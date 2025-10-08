#!/usr/bin/env node
/**
 * Script pour recuperer toutes les donnees des vues des schemas public et produit
 * de la base cenov - Mode lecture seule - aucune modification/suppression/ajout
 *
 * Commandes pour lancer les scripts :
 * - Tables seulement : node scripts/BDD-IA/cenov/fetch-cenov-tables.mjs
 * - Vues seulement : node scripts/BDD-IA/cenov/fetch-cenov-views.mjs
 * - Tout (recommande) : node scripts/BDD-IA/cenov/fetch-cenov-data.mjs
 */

import { PrismaClient } from '@prisma/client';
import fs from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient({
	datasources: {
		db: {
			url: process.env.DATABASE_URL
		}
	},
	log: ['error', 'warn'],
	errorFormat: 'pretty'
});

/**
 * Convertit les BigInt en Number et les Date en ISO string pour eviter les erreurs de serialisation JSON
 */
function convertBigIntToNumber(obj) {
	if (obj === null || obj === undefined) return obj;
	if (typeof obj === 'bigint') return Number(obj);
	if (obj instanceof Date) return obj.toISOString();
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
 * Recupere la liste de toutes les vues d'un schema specifique
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
 * Recupere la liste des vues materialisees d'un schema specifique
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
 * Recupere toutes les donnees d'une vue specifique dans un schema
 */
async function getViewData(schemaName, viewName) {
	try {
		console.log(`Recuperation des donnees: ${schemaName}.${viewName}`);
		const result = await prisma.$queryRawUnsafe(`SELECT * FROM "${schemaName}"."${viewName}"`);
		return {
			viewName,
			schemaName,
			rowCount: result.length,
			data: convertBigIntToNumber(result)
		};
	} catch (error) {
		console.error(`Erreur lors de la recuperation de ${schemaName}.${viewName}:`, error.message);
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
 * Recupere les informations sur les colonnes d'une vue dans un schema
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
		console.error(
			`Erreur lors de la recuperation des colonnes de ${schemaName}.${viewName}:`,
			error.message
		);
		return [];
	}
}

/**
 * Fonction principale pour recuperer toutes les vues des 2 schemas
 */
async function fetchCenovViews() {
	try {
		console.log('🔍 Recuperation des vues pour cenov...');
		console.log(`📊 Schemas a traiter: ${SCHEMAS.join(', ')}`);

		const results = {
			timestamp: new Date().toISOString(),
			database: 'cenov',
			schemas: {}
		};

		// Traitement de chaque schema
		for (const schema of SCHEMAS) {
			console.log(`\n🔍 Traitement du schema: ${schema}`);

			const [views, materializedViews] = await Promise.all([
				getViewsForSchema(schema),
				getMaterializedViewsForSchema(schema)
			]);

			const allViews = [
				...views.map((v) => ({ ...v, type: 'VIEW' })),
				...materializedViews.map((v) => ({ ...v, type: 'MATERIALIZED VIEW' }))
			];

			console.log(`   📊 ${allViews.length} vues trouvees dans ${schema}`);
			console.log(`      - ${views.length} vues normales`);
			console.log(`      - ${materializedViews.length} vues materialisees`);

			results.schemas[schema] = {
				name: schema,
				totalViews: allViews.length,
				views: {}
			};

			// Recuperation des donnees de chaque vue
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

			// Calcul des totaux par schema
			const schemaData = results.schemas[schema];
			schemaData.totalRows = Object.values(schemaData.views).reduce(
				(sum, view) => sum + view.rowCount,
				0
			);
			schemaData.viewsWithErrors = Object.values(schemaData.views).filter(
				(view) => view.error
			).length;

			console.log(
				`   📈 Total ${schema}: ${schemaData.totalViews} vues, ${schemaData.totalRows} lignes`
			);
			if (schemaData.viewsWithErrors > 0) {
				console.log(`   ⚠️  Erreurs ${schema}: ${schemaData.viewsWithErrors} vues`);
			}
		}

		// Sauvegarde des resultats
		const outputDir = path.join(process.cwd(), 'scripts', 'BDD-IA', 'cenov', 'output');
		await fs.mkdir(outputDir, { recursive: true });

		const outputFile = path.join(
			outputDir,
			`cenov-views-data-${new Date().toISOString().split('T')[0]}.json`
		);
		await fs.writeFile(outputFile, JSON.stringify(results, null, 2));

		console.log(`\n📁 Donnees sauvegardees dans: ${outputFile}`);

		// Affichage du resume global
		const globalSummary = {
			totalViews: Object.values(results.schemas).reduce(
				(sum, schema) => sum + schema.totalViews,
				0
			),
			totalRows: Object.values(results.schemas).reduce((sum, schema) => sum + schema.totalRows, 0),
			totalErrors: Object.values(results.schemas).reduce(
				(sum, schema) => sum + schema.viewsWithErrors,
				0
			)
		};

		console.log('\n📈 Resume global:');
		console.log(`- Total vues: ${globalSummary.totalViews}`);
		console.log(`- Total lignes: ${globalSummary.totalRows}`);
		if (globalSummary.totalErrors > 0) {
			console.log(`- Total erreurs: ${globalSummary.totalErrors}`);
		}

		console.log('\n📋 Detail par schema:');
		for (const [schemaName, schemaData] of Object.entries(results.schemas)) {
			console.log(`- ${schemaName}: ${schemaData.totalViews} vues, ${schemaData.totalRows} lignes`);
		}

		return results;
	} catch (error) {
		console.error('❌ Erreur lors de la recuperation des vues:', error);
		throw error;
	} finally {
		await prisma.$disconnect();
	}
}

// Execution si le script est lance directement
if (
	import.meta.url ===
		`file://${process.cwd().replace(/\\/g, '/')}/scripts/BDD-IA/cenov/fetch-cenov-views.mjs` ||
	process.argv[1]?.endsWith('fetch-cenov-views.mjs')
) {
	console.log('🚀 Demarrage du script de recuperation des vues cenov...');
	fetchCenovViews()
		.then(() => {
			console.log('✅ Script termine avec succes');
			process.exit(0);
		})
		.catch((error) => {
			console.error('❌ Echec du script:', error);
			console.error('Details:', error.stack);
			process.exit(1);
		});
}

export {
	fetchCenovViews,
	getViewsForSchema,
	getMaterializedViewsForSchema,
	getViewData,
	getViewColumns,
	SCHEMAS
};
