#!/usr/bin/env node
/**
 * Script pour recuperer toutes les donnees des tables des schemas public et produit
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
 * Convertit les BigInt en Number pour eviter les erreurs de serialisation JSON
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
 * Recupere la liste de toutes les tables d'un schema specifique
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
 * Recupere toutes les donnees d'une table specifique dans un schema
 */
async function getTableData(schemaName, tableName) {
	try {
		console.log(`Recuperation des donnees: ${schemaName}.${tableName}`);
		const result = await prisma.$queryRawUnsafe(`SELECT * FROM "${schemaName}"."${tableName}"`);
		return {
			tableName,
			schemaName,
			rowCount: result.length,
			data: convertBigIntToNumber(result)
		};
	} catch (error) {
		console.error(`Erreur lors de la recuperation de ${schemaName}.${tableName}:`, error.message);
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
 * Fonction principale pour recuperer toutes les tables des 2 schemas
 */
async function fetchCenovTables() {
	try {
		console.log('🔍 Recuperation des tables pour cenov...');
		console.log(`📊 Schemas a traiter: ${SCHEMAS.join(', ')}`);

		const results = {
			timestamp: new Date().toISOString(),
			database: 'cenov',
			schemas: {}
		};

		// Traitement de chaque schema
		for (const schema of SCHEMAS) {
			console.log(`\n🔍 Traitement du schema: ${schema}`);

			const tables = await getTablesForSchema(schema);
			console.log(`   📊 ${tables.length} tables trouvees dans ${schema}`);

			results.schemas[schema] = {
				name: schema,
				totalTables: tables.length,
				tables: {}
			};

			// Recuperation des donnees de chaque table
			for (const table of tables) {
				const tableData = await getTableData(schema, table.table_name);
				results.schemas[schema].tables[table.table_name] = tableData;

				console.log(`   ✅ ${table.table_name}: ${tableData.rowCount} lignes`);
			}

			// Calcul des totaux par schema
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

		// Sauvegarde des resultats
		const outputDir = path.join(process.cwd(), 'scripts', 'BDD-IA', 'cenov', 'output');
		await fs.mkdir(outputDir, { recursive: true });

		const outputFile = path.join(
			outputDir,
			`cenov-tables-data-${new Date().toISOString().split('T')[0]}.json`
		);
		await fs.writeFile(outputFile, JSON.stringify(results, null, 2));

		console.log(`\n📁 Donnees sauvegardees dans: ${outputFile}`);

		// Affichage du resume global
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

		console.log('\n📈 Resume global:');
		console.log(`- Total tables: ${globalSummary.totalTables}`);
		console.log(`- Total lignes: ${globalSummary.totalRows}`);
		if (globalSummary.totalErrors > 0) {
			console.log(`- Total erreurs: ${globalSummary.totalErrors}`);
		}

		console.log('\n📋 Detail par schema:');
		for (const [schemaName, schemaData] of Object.entries(results.schemas)) {
			console.log(
				`- ${schemaName}: ${schemaData.totalTables} tables, ${schemaData.totalRows} lignes`
			);
		}

		return results;
	} catch (error) {
		console.error('❌ Erreur lors de la recuperation des tables:', error);
		throw error;
	} finally {
		await prisma.$disconnect();
	}
}

// Execution si le script est lance directement
if (
	import.meta.url ===
		`file://${process.cwd().replace(/\\/g, '/')}/scripts/BDD-IA/cenov/fetch-cenov-tables.mjs` ||
	process.argv[1]?.endsWith('fetch-cenov-tables.mjs')
) {
	console.log('🚀 Demarrage du script de recuperation des tables cenov...');
	fetchCenovTables()
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

export { fetchCenovTables, getTablesForSchema, getTableData, SCHEMAS };