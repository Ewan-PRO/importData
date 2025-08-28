#!/usr/bin/env node
/**
 * Script pour récupérer toutes les données des vues des schémas public et produit
 * de la base cenov_dev_ewan - Mode lecture seule - aucune modification/suppression/ajout
 *
 * Commandes pour lancer les scripts :
 * - Tables seulement : node scripts/BDD-IA/cenov_dev_ewan/fetch-dev-tables.mjs
 * - Vues seulement : node scripts/BDD-IA/cenov_dev_ewan/fetch-dev-views.mjs
 * - Tout (recommandé) : node scripts/BDD-IA/cenov_dev_ewan/fetch-dev-data.mjs
 */

import { PrismaClient } from '@prisma/client';
import fs from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient({
	datasources: {
		db: {
			url: process.env.CENOV_DEV_DATABASE_URL
		}
	},
	log: ['error', 'warn'],
	errorFormat: 'pretty'
});

/**
 * Convertit les BigInt en Number pour éviter les erreurs de sérialisation JSON
 */
function convertBigIntToNumber(obj) {
	if (obj === null || obj === undefined) return obj;
	if (typeof obj === 'bigint') return Number(obj);
	if (Array.isArray(obj)) return obj.map(convertBigIntToNumber);
	if (typeof obj === 'object') {
		const converted = {};
		for (const [key, value] of Object.entries(obj)) {
			converted[key] = convertBigIntToNumber(value);
		}
		return converted;
	}
	return obj;
}

const SCHEMAS = ['produit', 'public'];

/**
 * Récupère la liste de toutes les vues d'un schéma spécifique
 */
async function getViewsForSchema(schemaName) {
	const result = await prisma.$queryRaw`
    SELECT 
      table_name as view_name,
      view_definition
    FROM information_schema.views 
    WHERE table_schema = ${schemaName}
    ORDER BY table_name
  `;
	return convertBigIntToNumber(result);
}

/**
 * Récupère la liste des vues matérialisées d'un schéma spécifique
 */
async function getMaterializedViewsForSchema(schemaName) {
	const result = await prisma.$queryRaw`
    SELECT 
      matviewname as view_name,
      definition as view_definition
    FROM pg_matviews 
    WHERE schemaname = ${schemaName}
    ORDER BY matviewname
  `;
	return convertBigIntToNumber(result);
}

/**
 * Récupère toutes les données d'une vue spécifique dans un schéma
 */
async function getViewData(schemaName, viewName) {
	try {
		console.log(`Récupération des données: ${schemaName}.${viewName}`);
		const result = await prisma.$queryRawUnsafe(`SELECT * FROM "${schemaName}"."${viewName}"`);
		return {
			viewName,
			schemaName,
			rowCount: result.length,
			data: convertBigIntToNumber(result)
		};
	} catch (error) {
		console.error(`Erreur lors de la récupération de ${schemaName}.${viewName}:`, error.message);
		return {
			viewName,
			schemaName,
			error: error.message,
			rowCount: 0,
			data: []
		};
	}
}

/**
 * Récupère les informations sur les colonnes d'une vue dans un schéma
 */
async function getViewColumns(schemaName, viewName) {
	try {
		const result = await prisma.$queryRaw`
      SELECT 
        column_name,
        data_type,
        is_nullable,
        column_default
      FROM information_schema.columns 
      WHERE table_schema = ${schemaName}
      AND table_name = ${viewName}
      ORDER BY ordinal_position
    `;
		return convertBigIntToNumber(result);
	} catch (error) {
		console.error(`Erreur lors de la récupération des colonnes de ${schemaName}.${viewName}:`, error.message);
		return [];
	}
}

/**
 * Fonction principale pour récupérer toutes les vues des 2 schémas
 */
async function fetchDevViews() {
	try {
		console.log('🔍 Récupération des vues pour cenov_dev_ewan...');
		console.log(`📊 Schémas à traiter: ${SCHEMAS.join(', ')}`);

		const results = {
			timestamp: new Date().toISOString(),
			database: 'cenov_dev_ewan',
			schemas: {}
		};

		// Traitement de chaque schéma
		for (const schema of SCHEMAS) {
			console.log(`\n🔍 Traitement du schéma: ${schema}`);
			
			const [views, materializedViews] = await Promise.all([
				getViewsForSchema(schema),
				getMaterializedViewsForSchema(schema)
			]);

			const allViews = [
				...views.map((v) => ({ ...v, type: 'VIEW' })),
				...materializedViews.map((v) => ({ ...v, type: 'MATERIALIZED VIEW' }))
			];

			console.log(`   📊 ${allViews.length} vues trouvées dans ${schema}`);
			console.log(`      - ${views.length} vues normales`);
			console.log(`      - ${materializedViews.length} vues matérialisées`);

			results.schemas[schema] = {
				name: schema,
				totalViews: allViews.length,
				views: {}
			};

			// Récupération des données de chaque vue
			for (const view of allViews) {
				const viewData = await getViewData(schema, view.view_name);
				const viewColumns = await getViewColumns(schema, view.view_name);

				results.schemas[schema].views[view.view_name] = {
					...viewData,
					type: view.type,
					definition: view.view_definition,
					columns: viewColumns
				};

				console.log(`   ✅ ${view.view_name} (${view.type}): ${viewData.rowCount} lignes`);
			}

			// Calcul des totaux par schéma
			const schemaData = results.schemas[schema];
			schemaData.totalRows = Object.values(schemaData.views).reduce(
				(sum, view) => sum + view.rowCount, 0
			);
			schemaData.viewsWithErrors = Object.values(schemaData.views).filter(
				view => view.error
			).length;

			console.log(`   📈 Total ${schema}: ${schemaData.totalViews} vues, ${schemaData.totalRows} lignes`);
			if (schemaData.viewsWithErrors > 0) {
				console.log(`   ⚠️  Erreurs ${schema}: ${schemaData.viewsWithErrors} vues`);
			}
		}

		// Sauvegarde des résultats
		const outputDir = path.join(process.cwd(), 'scripts', 'BDD-IA', 'cenov_dev_ewan', 'output');
		await fs.mkdir(outputDir, { recursive: true });

		const outputFile = path.join(
			outputDir,
			`dev-views-data-${new Date().toISOString().split('T')[0]}.json`
		);
		await fs.writeFile(outputFile, JSON.stringify(results, null, 2));

		console.log(`\n📁 Données sauvegardées dans: ${outputFile}`);

		// Affichage du résumé global
		const globalSummary = {
			totalViews: Object.values(results.schemas).reduce((sum, schema) => sum + schema.totalViews, 0),
			totalRows: Object.values(results.schemas).reduce((sum, schema) => sum + schema.totalRows, 0),
			totalErrors: Object.values(results.schemas).reduce((sum, schema) => sum + schema.viewsWithErrors, 0)
		};

		console.log('\n📈 Résumé global:');
		console.log(`- Total vues: ${globalSummary.totalViews}`);
		console.log(`- Total lignes: ${globalSummary.totalRows}`);
		if (globalSummary.totalErrors > 0) {
			console.log(`- Total erreurs: ${globalSummary.totalErrors}`);
		}

		console.log('\n📋 Détail par schéma:');
		for (const [schemaName, schemaData] of Object.entries(results.schemas)) {
			console.log(`- ${schemaName}: ${schemaData.totalViews} vues, ${schemaData.totalRows} lignes`);
		}

		return results;
	} catch (error) {
		console.error('❌ Erreur lors de la récupération des vues:', error);
		throw error;
	} finally {
		await prisma.$disconnect();
	}
}

// Exécution si le script est lancé directement
if (import.meta.url === `file://${process.cwd().replace(/\\/g, '/')}/scripts/BDD-IA/cenov_dev_ewan/fetch-dev-views.mjs` || process.argv[1]?.endsWith('fetch-dev-views.mjs')) {
	console.log('🚀 Démarrage du script de récupération des vues cenov_dev_ewan...');
	fetchDevViews()
		.then(() => {
			console.log('✅ Script terminé avec succès');
			process.exit(0);
		})
		.catch((error) => {
			console.error('❌ Échec du script:', error);
			console.error('Détails:', error.stack);
			process.exit(1);
		});
}

export { 
	fetchDevViews, 
	getViewsForSchema, 
	getMaterializedViewsForSchema, 
	getViewData, 
	getViewColumns, 
	SCHEMAS 
};