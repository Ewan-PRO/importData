#!/usr/bin/env node
/**
 * Script principal pour recuperer toutes les donnees de la base cenov
 * Recupere toutes les tables et vues des schemas public et produit en mode lecture seule
 *
 * Commandes pour lancer les scripts :
 * - Tables seulement : node scripts/BDD-IA/cenov/fetch-cenov-tables.mjs
 * - Vues seulement : node scripts/BDD-IA/cenov/fetch-cenov-views.mjs
 * - Tout (recommande) : node scripts/BDD-IA/cenov/fetch-cenov-data.mjs
 */

import { PrismaClient } from '@prisma/client';
import fs from 'node:fs/promises';
import path from 'node:path';
import { getTablesForSchema, getTableData, SCHEMAS } from './fetch-cenov-tables.mjs';
import {
	getViewsForSchema,
	getMaterializedViewsForSchema,
	getViewData
} from './fetch-cenov-views.mjs';

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

/**
 * Recupere les informations generales sur la base de donnees cenov
 */
async function getCenovDatabaseInfo() {
	try {
		const [dbInfo, schemasInfo] = await Promise.all([
			// Informations generales sur la base
			prisma.$queryRaw`
        SELECT
          current_database() as database_name,
          current_schema() as current_schema,
          version() as postgres_version
      `,
			// Informations sur les schemas public et produit
			prisma.$queryRaw`
        SELECT
          schemaname,
          COUNT(*) FILTER (WHERE tabletype = 'table') as table_count,
          COUNT(*) FILTER (WHERE tabletype = 'view') as view_count,
          COUNT(*) FILTER (WHERE tabletype = 'materialized_view') as materialized_view_count
        FROM (
          SELECT schemaname, 'table' as tabletype FROM pg_tables WHERE schemaname = ANY(${SCHEMAS})
          UNION ALL
          SELECT schemaname, 'view' as tabletype FROM pg_views WHERE schemaname = ANY(${SCHEMAS})
          UNION ALL
          SELECT schemaname, 'materialized_view' as tabletype FROM pg_matviews WHERE schemaname = ANY(${SCHEMAS})
        ) combined
        GROUP BY schemaname
        ORDER BY schemaname
      `
		]);

		return {
			database: convertBigIntToNumber(dbInfo[0]),
			schemas: convertBigIntToNumber(schemasInfo)
		};
	} catch (error) {
		console.error('Erreur lors de la recuperation des infos DB:', error);
		return null;
	}
}

/**
 * Fonction principale pour recuperer toutes les donnees cenov
 */
async function fetchCenovData() {
	const startTime = new Date();
	console.log('🚀 Demarrage de la recuperation complete des donnees cenov');
	console.log(`📊 Schemas cibles: ${SCHEMAS.join(', ')}`);
	console.log(`⏰ Debut: ${startTime.toISOString()}\n`);

	try {
		// Recuperation des informations sur la base
		console.log('📋 Recuperation des informations de la base de donnees...');
		const dbInfo = await getCenovDatabaseInfo();
		if (dbInfo) {
			console.log(`   Base de donnees: ${dbInfo.database.database_name}`);
			console.log(`   Version PostgreSQL: ${dbInfo.database.postgres_version.split(' ')[0]}`);

			if (dbInfo.schemas.length > 0) {
				console.log('   Schemas detectes:');
				for (const schema of dbInfo.schemas) {
					const totalViews = (schema.view_count || 0) + (schema.materialized_view_count || 0);
					console.log(
						`     - ${schema.schemaname}: ${schema.table_count} tables, ${totalViews} vues`
					);
				}
			}
			console.log();
		}

		// Recuperation des tables et vues en parallele
		console.log('📊 Recuperation des donnees...\n');

		const compiledSchemas = {};

		for (const schema of SCHEMAS) {
			console.log(`🔍 Traitement du schema: ${schema}`);

			// Recuperation des tables
			const tables = await getTablesForSchema(schema);
			console.log(`   📊 ${tables.length} tables trouvees dans ${schema}`);

			const schemaTables = {};
			let totalTablesRows = 0;
			let tablesWithErrors = 0;

			for (const table of tables) {
				try {
					const tableData = await getTableData(schema, table.table_name);
					schemaTables[table.table_name] = tableData;
					totalTablesRows += tableData.rowCount;
					console.log(`   ✅ ${table.table_name}: ${tableData.rowCount} lignes`);
				} catch (error) {
					console.error(`   ❌ Erreur ${table.table_name}:`, error.message);
					tablesWithErrors++;
				}
			}

			// Recuperation des vues (normales + materialisees)
			const [normalViews, materializedViews] = await Promise.all([
				getViewsForSchema(schema),
				getMaterializedViewsForSchema(schema)
			]);

			const allViews = [
				...normalViews.map((v) => ({ ...v, type: 'VIEW' })),
				...materializedViews.map((v) => ({ ...v, type: 'MATERIALIZED VIEW' }))
			];

			console.log(`   📊 ${allViews.length} vues trouvees dans ${schema}`);
			if (normalViews.length > 0 || materializedViews.length > 0) {
				console.log(`      - ${normalViews.length} vues normales`);
				console.log(`      - ${materializedViews.length} vues materialisees`);
			}

			const schemaViews = {};
			let totalViewsRows = 0;
			let viewsWithErrors = 0;

			for (const view of allViews) {
				try {
					const viewData = await getViewData(schema, view.view_name);
					schemaViews[view.view_name] = {
						...viewData,
						type: view.type,
						definition: view.view_definition
					};
					totalViewsRows += viewData.rowCount;
					console.log(`   ✅ ${view.view_name} (${view.type}): ${viewData.rowCount} lignes`);
				} catch (error) {
					console.error(`   ❌ Erreur ${view.view_name}:`, error.message);
					viewsWithErrors++;
				}
			}

			compiledSchemas[schema] = {
				name: schema,
				tables: schemaTables,
				views: schemaViews,
				summary: {
					tables: {
						count: tables.length,
						totalRows: totalTablesRows,
						errors: tablesWithErrors
					},
					views: {
						count: allViews.length,
						totalRows: totalViewsRows,
						errors: viewsWithErrors
					}
				}
			};

			console.log(
				`   📈 Total ${schema}: ${tables.length} tables (${totalTablesRows} lignes), ${allViews.length} vues (${totalViewsRows} lignes)`
			);
		}

		const endTime = new Date();
		const duration = endTime - startTime;

		// Calcul des totaux globaux
		const globalSummary = {
			tables: {
				count: Object.values(compiledSchemas).reduce(
					(sum, schema) => sum + schema.summary.tables.count,
					0
				),
				totalRows: Object.values(compiledSchemas).reduce(
					(sum, schema) => sum + schema.summary.tables.totalRows,
					0
				),
				errors: Object.values(compiledSchemas).reduce(
					(sum, schema) => sum + schema.summary.tables.errors,
					0
				)
			},
			views: {
				count: Object.values(compiledSchemas).reduce(
					(sum, schema) => sum + schema.summary.views.count,
					0
				),
				totalRows: Object.values(compiledSchemas).reduce(
					(sum, schema) => sum + schema.summary.views.totalRows,
					0
				),
				errors: Object.values(compiledSchemas).reduce(
					(sum, schema) => sum + schema.summary.views.errors,
					0
				)
			}
		};

		const results = {
			metadata: {
				timestamp: endTime.toISOString(),
				startTime: startTime.toISOString(),
				endTime: endTime.toISOString(),
				duration: `${Math.round(duration / 1000)}s`,
				database: dbInfo?.database || null,
				targetSchemas: SCHEMAS
			},
			summary: globalSummary,
			schemas: compiledSchemas,
			errors: {
				tables: null,
				views: null
			}
		};

		// Sauvegarde des resultats complets
		const outputDir = path.join(process.cwd(), 'scripts', 'BDD-IA', 'cenov', 'output');
		await fs.mkdir(outputDir, { recursive: true });

		const outputFile = path.join(
			outputDir,
			`cenov-complete-data-${new Date().toISOString().split('T')[0]}.json`
		);
		await fs.writeFile(outputFile, JSON.stringify(results, null, 2));

		// Creation d'un resume leger
		const summaryFile = path.join(
			outputDir,
			`cenov-summary-${new Date().toISOString().split('T')[0]}.json`
		);
		const summary = {
			...results.metadata,
			globalSummary: results.summary,
			schemasSummary: Object.fromEntries(
				Object.entries(results.schemas).map(([name, data]) => [
					name,
					{
						tables: { count: data.summary.tables.count, rows: data.summary.tables.totalRows },
						views: { count: data.summary.views.count, rows: data.summary.views.totalRows },
						tableList: Object.keys(data.tables),
						viewList: Object.keys(data.views)
					}
				])
			),
			errors: results.errors
		};
		await fs.writeFile(summaryFile, JSON.stringify(summary, null, 2));

		console.log('\n' + '='.repeat(60));
		console.log('✅ RECUPERATION CENOV TERMINEE AVEC SUCCES');
		console.log('='.repeat(60));
		console.log(`⏱️  Duree totale: ${Math.round(duration / 1000)}s`);
		console.log(
			`📊 Tables recuperees: ${globalSummary.tables.count} (${globalSummary.tables.totalRows} lignes)`
		);
		console.log(
			`👁️  Vues recuperees: ${globalSummary.views.count} (${globalSummary.views.totalRows} lignes)`
		);

		if (globalSummary.tables.errors > 0 || globalSummary.views.errors > 0) {
			console.log(
				`⚠️  Erreurs: ${globalSummary.tables.errors} tables, ${globalSummary.views.errors} vues`
			);
		}

		console.log('\n📋 Detail par schema:');
		for (const [schemaName, schemaData] of Object.entries(results.schemas)) {
			console.log(
				`   ${schemaName}: ${schemaData.summary.tables.count} tables, ${schemaData.summary.views.count} vues`
			);
		}

		console.log(`\n📁 Fichiers generes:`);
		console.log(`   - Donnees completes: ${outputFile}`);
		console.log(`   - Resume: ${summaryFile}`);

		return results;
	} catch (error) {
		console.error('❌ Erreur critique lors de la recuperation des donnees:', error);
		throw error;
	} finally {
		await prisma.$disconnect();
	}
}

// Execution si le script est lance directement
if (import.meta.url.includes('fetch-cenov-data.mjs')) {
	try {
		await fetchCenovData();
		console.log('\n🎉 Script principal cenov termine avec succes');
		process.exit(0);
	} catch (error) {
		console.error('\n💥 Echec du script principal cenov:', error);
		process.exit(1);
	}
}

export { fetchCenovData, getCenovDatabaseInfo };
