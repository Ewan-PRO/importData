#!/usr/bin/env node
/**
 * Script pour récupérer toutes les données des tables des schémas public et produit
 * de la base cenov_dev - Mode lecture seule - aucune modification/suppression/ajout
 *
 * Commandes pour lancer les scripts :
 * - Tables seulement : node scripts/BDD-IA/cenov_dev/fetch-dev-tables.mjs
 * - Vues seulement : node scripts/BDD-IA/cenov_dev/fetch-dev-views.mjs
 * - Tout (recommandé) : node scripts/BDD-IA/cenov_dev/fetch-dev-data.mjs
 */

import { PrismaClient } from '@prisma/client';
import fs from 'node:fs/promises';
import path from 'node:path';

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
 * Convertit les BigInt en Number et les Date en ISO string pour éviter les erreurs de sérialisation JSON
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
 * Récupère la liste de toutes les tables d'un schéma spécifique
 */
async function getTablesForSchema(schemaName) {
	const result = await prisma.$queryRaw`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = ${schemaName}
    AND table_type = 'BASE TABLE'
    ORDER BY table_name
  `;
	return convertBigIntToNumber(result);
}

/**
 * Récupère toutes les données d'une table spécifique dans un schéma
 */
async function getTableData(schemaName, tableName) {
	try {
		console.log(`Récupération des données: ${schemaName}.${tableName}`);
		const result = await prisma.$queryRawUnsafe(`SELECT * FROM "${schemaName}"."${tableName}"`);
		return {
			tableName,
			schemaName,
			rowCount: result.length,
			data: convertBigIntToNumber(result)
		};
	} catch (error) {
		console.error(`Erreur lors de la récupération de ${schemaName}.${tableName}:`, error.message);
		return {
			tableName,
			schemaName,
			error: error.message,
			rowCount: 0,
			data: []
		};
	}
}

/**
 * Fonction principale pour récupérer toutes les tables des 2 schémas
 */
async function fetchDevTables() {
	try {
		console.log('🔍 Récupération des tables pour cenov_dev...');
		console.log(`📊 Schémas à traiter: ${SCHEMAS.join(', ')}`);

		const results = {
			timestamp: new Date().toISOString(),
			database: 'cenov_dev',
			schemas: {}
		};

		// Traitement de chaque schéma
		for (const schema of SCHEMAS) {
			console.log(`\n🔍 Traitement du schéma: ${schema}`);

			const tables = await getTablesForSchema(schema);
			console.log(`   📊 ${tables.length} tables trouvées dans ${schema}`);

			results.schemas[schema] = {
				name: schema,
				totalTables: tables.length,
				tables: {}
			};

			// Récupération des données de chaque table
			for (const table of tables) {
				const tableData = await getTableData(schema, table.table_name);
				results.schemas[schema].tables[table.table_name] = tableData;

				console.log(`   ✅ ${table.table_name}: ${tableData.rowCount} lignes`);
			}

			// Calcul des totaux par schéma
			const schemaData = results.schemas[schema];
			schemaData.totalRows = Object.values(schemaData.tables).reduce(
				(sum, table) => sum + table.rowCount,
				0
			);
			schemaData.tablesWithErrors = Object.values(schemaData.tables).filter(
				(table) => table.error
			).length;

			console.log(
				`   📈 Total ${schema}: ${schemaData.totalTables} tables, ${schemaData.totalRows} lignes`
			);
			if (schemaData.tablesWithErrors > 0) {
				console.log(`   ⚠️  Erreurs ${schema}: ${schemaData.tablesWithErrors} tables`);
			}
		}

		// Sauvegarde des résultats
		const outputDir = path.join(
			process.cwd().replaceAll('\\', '/'),
			'scripts',
			'BDD-IA',
			'cenov_dev',
			'output'
		);
		await fs.mkdir(outputDir, { recursive: true });

		const outputFile = path.join(
			outputDir,
			`dev-tables-data-${new Date().toISOString().split('T')[0]}.json`
		);
		await fs.writeFile(outputFile, JSON.stringify(results, null, 2));

		console.log(`\n📁 Données sauvegardées dans: ${outputFile}`);

		// Affichage du résumé global
		const globalSummary = {
			totalTables: Object.values(results.schemas).reduce(
				(sum, schema) => sum + schema.totalTables,
				0
			),
			totalRows: Object.values(results.schemas).reduce((sum, schema) => sum + schema.totalRows, 0),
			totalErrors: Object.values(results.schemas).reduce(
				(sum, schema) => sum + schema.tablesWithErrors,
				0
			)
		};

		console.log('\n📈 Résumé global:');
		console.log(`- Total tables: ${globalSummary.totalTables}`);
		console.log(`- Total lignes: ${globalSummary.totalRows}`);
		if (globalSummary.totalErrors > 0) {
			console.log(`- Total erreurs: ${globalSummary.totalErrors}`);
		}

		console.log('\n📋 Détail par schéma:');
		for (const [schemaName, schemaData] of Object.entries(results.schemas)) {
			console.log(
				`- ${schemaName}: ${schemaData.totalTables} tables, ${schemaData.totalRows} lignes`
			);
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
if (
	import.meta.url ===
		`file://${process.cwd().replaceAll('\\', '/')}/scripts/BDD-IA/cenov_dev/fetch-dev-tables.mjs` ||
	process.argv[1]?.endsWith('fetch-dev-tables.mjs')
) {
	console.log('🚀 Démarrage du script de récupération des tables cenov_dev...');
	try {
		await fetchDevTables();
		console.log('✅ Script terminé avec succès');
		process.exit(0);
	} catch (error) {
		console.error('❌ Échec du script:', error);
		console.error('Détails:', error.stack);
		process.exit(1);
	}
}

export { fetchDevTables, getTablesForSchema, getTableData, SCHEMAS };
