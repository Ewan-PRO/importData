#!/usr/bin/env node
/**
 * Script pour récupérer toutes les données des vues du schéma public de la base Cenov
 * Mode lecture seule - aucune modification/suppression/ajout
 *
 * Commandes pour lancer les scripts :
 * - Tables seulement : node scripts/BDD-IA/cenov/fetch-all-tables.mjs
 * - Vues seulement : node scripts/BDD-IA/cenov/fetch-all-views.mjs
 * - Tout (recommandé) : node scripts/BDD-IA/cenov/fetch-cenov-data.mjs
 */

import { PrismaClient } from '@prisma/client';
import fs from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient({
	log: ['error', 'warn'],
	errorFormat: 'pretty'
});

/**
 * Récupère la liste de toutes les vues du schéma public
 */
async function getAllViews() {
	const result = await prisma.$queryRaw`
    SELECT 
      table_name as view_name,
      view_definition
    FROM information_schema.views 
    WHERE table_schema = 'public'
    ORDER BY table_name
  `;
	return result;
}

/**
 * Récupère la liste des vues matérialisées du schéma public
 */
async function getAllMaterializedViews() {
	const result = await prisma.$queryRaw`
    SELECT 
      matviewname as view_name,
      definition as view_definition
    FROM pg_matviews 
    WHERE schemaname = 'public'
    ORDER BY matviewname
  `;
	return result;
}

/**
 * Récupère toutes les données d'une vue spécifique
 */
async function getViewData(viewName) {
	try {
		console.log(`Récupération des données de la vue: ${viewName}`);
		const result = await prisma.$queryRawUnsafe(`SELECT * FROM "${viewName}"`);
		return {
			viewName,
			rowCount: result.length,
			data: result
		};
	} catch (error) {
		console.error(`Erreur lors de la récupération de ${viewName}:`, error.message);
		return {
			viewName,
			error: error.message,
			rowCount: 0,
			data: []
		};
	}
}

/**
 * Récupère les informations sur les colonnes d'une vue
 */
async function getViewColumns(viewName) {
	try {
		const result = await prisma.$queryRaw`
      SELECT 
        column_name,
        data_type,
        is_nullable,
        column_default
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = ${viewName}
      ORDER BY ordinal_position
    `;
		return result;
	} catch (error) {
		console.error(`Erreur lors de la récupération des colonnes de ${viewName}:`, error.message);
		return [];
	}
}

/**
 * Fonction principale pour récupérer toutes les vues
 */
async function fetchAllViews() {
	try {
		console.log('🔍 Récupération de la liste des vues...');
		const [views, materializedViews] = await Promise.all([
			getAllViews(),
			getAllMaterializedViews()
		]);

		const allViews = [
			...views.map((v) => ({ ...v, type: 'VIEW' })),
			...materializedViews.map((v) => ({ ...v, type: 'MATERIALIZED VIEW' }))
		];

		console.log(`📊 ${allViews.length} vues trouvées dans le schéma public`);
		console.log(`   - ${views.length} vues normales`);
		console.log(`   - ${materializedViews.length} vues matérialisées`);

		const results = {
			timestamp: new Date().toISOString(),
			schema: 'public',
			totalViews: allViews.length,
			views: {}
		};

		// Récupération des données de chaque vue
		for (const view of allViews) {
			const viewData = await getViewData(view.view_name);
			const viewColumns = await getViewColumns(view.view_name);

			results.views[view.view_name] = {
				...viewData,
				type: view.type,
				definition: view.view_definition,
				columns: viewColumns
			};

			console.log(`✅ ${view.view_name} (${view.type}): ${viewData.rowCount} lignes`);
		}

		// Sauvegarde des résultats
		const outputDir = path.join(process.cwd(), 'scripts', 'BDD-IA', 'cenov', 'output');
		await fs.mkdir(outputDir, { recursive: true });

		const outputFile = path.join(
			outputDir,
			`views-data-${new Date().toISOString().split('T')[0]}.json`
		);
		await fs.writeFile(outputFile, JSON.stringify(results, null, 2));

		console.log(`\n📁 Données sauvegardées dans: ${outputFile}`);

		// Affichage du résumé
		console.log('\n📈 Résumé:');
		console.log(`- Total vues: ${results.totalViews}`);
		const totalRows = Object.values(results.views).reduce((sum, view) => sum + view.rowCount, 0);
		console.log(`- Total lignes: ${totalRows}`);

		const viewsWithErrors = Object.values(results.views).filter((view) => view.error);
		if (viewsWithErrors.length > 0) {
			console.log(`- Vues avec erreurs: ${viewsWithErrors.length}`);
			viewsWithErrors.forEach((view) => {
				console.log(`  ⚠️  ${view.viewName}: ${view.error}`);
			});
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
if (import.meta.url.includes('fetch-all-views.mjs') && process.argv[1] && process.argv[1].includes('fetch-all-views.mjs')) {
	fetchAllViews()
		.then(() => {
			console.log('✅ Script terminé avec succès');
			process.exit(0);
		})
		.catch((error) => {
			console.error('❌ Échec du script:', error);
			process.exit(1);
		});
}

export { fetchAllViews, getAllViews, getAllMaterializedViews, getViewData, getViewColumns };
