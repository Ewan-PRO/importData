#!/usr/bin/env node
/**
 * Script pour récupérer toutes les données des tables du schéma public de la base Cenov
 * Mode lecture seule - aucune modification/suppression/ajout
 * test
 * Commandes pour lancer les scripts :
 * - Tables seulement : node scripts/fetch-all-tables.mjs
 * - Vues seulement : node scripts/fetch-all-views.mjs
 * - Tout (recommandé) : node scripts/fetch-cenov-data.mjs
 */

import { PrismaClient } from '@prisma/client';
import fs from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient({
	log: ['error', 'warn'],
	errorFormat: 'pretty'
});

/**
 * Récupère la liste de toutes les tables du schéma public
 */
async function getAllTables() {
	const result = await prisma.$queryRaw`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_type = 'BASE TABLE'
    ORDER BY table_name
  `;
	return result;
}

/**
 * Récupère toutes les données d'une table spécifique
 */
async function getTableData(tableName) {
	try {
		console.log(`Récupération des données de la table: ${tableName}`);
		const result = await prisma.$queryRawUnsafe(`SELECT * FROM "${tableName}"`);
		return {
			tableName,
			rowCount: result.length,
			data: result
		};
	} catch (error) {
		console.error(`Erreur lors de la récupération de ${tableName}:`, error.message);
		return {
			tableName,
			error: error.message,
			rowCount: 0,
			data: []
		};
	}
}

// Fonction principale pour récupérer toutes les tables
async function fetchAllTables() {
	try {
		console.log('🔍 Récupération de la liste des tables...');
		const tables = await getAllTables();

		console.log(`📊 ${tables.length} tables trouvées dans le schéma public`);

		const results = {
			timestamp: new Date().toISOString(),
			schema: 'public',
			totalTables: tables.length,
			tables: {}
		};

		// Récupération des données de chaque table
		for (const table of tables) {
			const tableData = await getTableData(table.table_name);
			results.tables[table.table_name] = tableData;

			console.log(`✅ ${table.table_name}: ${tableData.rowCount} lignes`);
		}

		// Sauvegarde des résultats
		const outputDir = path.join(process.cwd(), 'scripts', 'output');
		await fs.mkdir(outputDir, { recursive: true });

		const outputFile = path.join(
			outputDir,
			`tables-data-${new Date().toISOString().split('T')[0]}.json`
		);
		await fs.writeFile(outputFile, JSON.stringify(results, null, 2));

		console.log(`\n📁 Données sauvegardées dans: ${outputFile}`);

		// Affichage du résumé
		console.log('\n📈 Résumé:');
		console.log(`- Total tables: ${results.totalTables}`);
		const totalRows = Object.values(results.tables).reduce((sum, table) => sum + table.rowCount, 0);
		console.log(`- Total lignes: ${totalRows}`);

		const tablesWithErrors = Object.values(results.tables).filter((table) => table.error);
		if (tablesWithErrors.length > 0) {
			console.log(`- Tables avec erreurs: ${tablesWithErrors.length}`);
			tablesWithErrors.forEach((table) => {
				console.log(`  ⚠️  ${table.tableName}: ${table.error}`);
			});
		}

		return results;
	} catch (error) {
		console.error('❌ Erreur lors de la récupération des tables:', error);
		throw error;
	} finally {
		await prisma.$disconnect();
	}
}

// Exécution si le script est lancé directement
if (import.meta.url.includes('fetch-all-tables.mjs')) {
	console.log('🚀 Démarrage du script de récupération des tables...');
	fetchAllTables()
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

export { fetchAllTables, getAllTables, getTableData };
