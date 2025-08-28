#!/usr/bin/env node
/**
 * Script principal pour récupérer toutes les données de la base cenov_dev_ewan
 * Récupère toutes les tables et vues des schémas public et produit en mode lecture seule
 *
 * Commandes pour lancer les scripts :
 * - Tables seulement : node scripts/BDD-IA/cenov_dev_ewan/fetch-dev-tables.mjs
 * - Vues seulement : node scripts/BDD-IA/cenov_dev_ewan/fetch-dev-views.mjs
 * - Tout (recommandé) : node scripts/BDD-IA/cenov_dev_ewan/fetch-dev-data.mjs
 */

import { PrismaClient } from '@prisma/client';
import fs from 'fs/promises';
import path from 'path';
import { getTablesForSchema, getTableData, SCHEMAS } from './fetch-dev-tables.mjs';
import { getViewsForSchema, getMaterializedViewsForSchema, getViewData } from './fetch-dev-views.mjs';

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

/**
 * Récupère les informations générales sur la base de données cenov_dev_ewan
 */
async function getDevDatabaseInfo() {
	try {
		const [dbInfo, schemasInfo] = await Promise.all([
			// Informations générales sur la base
			prisma.$queryRaw`
        SELECT 
          current_database() as database_name,
          current_schema() as current_schema,
          version() as postgres_version
      `,
			// Informations sur les schémas public et produit
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
		console.error('Erreur lors de la récupération des infos DB:', error);
		return null;
	}
}

/**
 * Fonction principale pour récupérer toutes les données cenov_dev_ewan
 */
async function fetchDevData() {
	const startTime = new Date();
	console.log('🚀 Démarrage de la récupération complète des données cenov_dev_ewan');
	console.log(`📊 Schémas ciblés: ${SCHEMAS.join(', ')}`);
	console.log(`⏰ Début: ${startTime.toISOString()}\n`);

	try {
		// Récupération des informations sur la base
		console.log('📋 Récupération des informations de la base de données...');
		const dbInfo = await getDevDatabaseInfo();
		if (dbInfo) {
			console.log(`   Base de données: ${dbInfo.database.database_name}`);
			console.log(`   Version PostgreSQL: ${dbInfo.database.postgres_version.split(' ')[0]}`);
			
			if (dbInfo.schemas.length > 0) {
				console.log('   Schémas détectés:');
				for (const schema of dbInfo.schemas) {
					const totalViews = (schema.view_count || 0) + (schema.materialized_view_count || 0);
					console.log(`     - ${schema.schemaname}: ${schema.table_count} tables, ${totalViews} vues`);
				}
			}
			console.log();
		}

		// Récupération des tables et vues en parallèle
		console.log('📊 Récupération des données...\n');
		
		const compiledSchemas = {};
		
		for (const schema of SCHEMAS) {
			console.log(`🔍 Traitement du schéma: ${schema}`);
			
			// Récupération des tables
			const tables = await getTablesForSchema(schema);
			console.log(`   📊 ${tables.length} tables trouvées dans ${schema}`);
			
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
			
			// Récupération des vues (normales + matérialisées)
			const [normalViews, materializedViews] = await Promise.all([
				getViewsForSchema(schema),
				getMaterializedViewsForSchema(schema)
			]);
			
			const allViews = [
				...normalViews.map(v => ({ ...v, type: 'VIEW' })),
				...materializedViews.map(v => ({ ...v, type: 'MATERIALIZED VIEW' }))
			];
			
			console.log(`   📊 ${allViews.length} vues trouvées dans ${schema}`);
			if (normalViews.length > 0 || materializedViews.length > 0) {
				console.log(`      - ${normalViews.length} vues normales`);
				console.log(`      - ${materializedViews.length} vues matérialisées`);
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
			
			console.log(`   📈 Total ${schema}: ${tables.length} tables (${totalTablesRows} lignes), ${allViews.length} vues (${totalViewsRows} lignes)`);
		}

		const endTime = new Date();
		const duration = endTime - startTime;

		// Calcul des totaux globaux
		const globalSummary = {
			tables: {
				count: Object.values(compiledSchemas).reduce((sum, schema) => sum + schema.summary.tables.count, 0),
				totalRows: Object.values(compiledSchemas).reduce((sum, schema) => sum + schema.summary.tables.totalRows, 0),
				errors: Object.values(compiledSchemas).reduce((sum, schema) => sum + schema.summary.tables.errors, 0)
			},
			views: {
				count: Object.values(compiledSchemas).reduce((sum, schema) => sum + schema.summary.views.count, 0),
				totalRows: Object.values(compiledSchemas).reduce((sum, schema) => sum + schema.summary.views.totalRows, 0),
				errors: Object.values(compiledSchemas).reduce((sum, schema) => sum + schema.summary.views.errors, 0)
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

		// Sauvegarde des résultats complets
		const outputDir = path.join(process.cwd(), 'scripts', 'BDD-IA', 'cenov_dev_ewan', 'output');
		await fs.mkdir(outputDir, { recursive: true });

		const outputFile = path.join(
			outputDir,
			`dev-complete-data-${new Date().toISOString().split('T')[0]}.json`
		);
		await fs.writeFile(outputFile, JSON.stringify(results, null, 2));

		// Création d'un résumé léger
		const summaryFile = path.join(
			outputDir,
			`dev-summary-${new Date().toISOString().split('T')[0]}.json`
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
		console.log('✅ RÉCUPÉRATION CENOV_DEV_EWAN TERMINÉE AVEC SUCCÈS');
		console.log('='.repeat(60));
		console.log(`⏱️  Durée totale: ${Math.round(duration / 1000)}s`);
		console.log(`📊 Tables récupérées: ${globalSummary.tables.count} (${globalSummary.tables.totalRows} lignes)`);
		console.log(`👁️  Vues récupérées: ${globalSummary.views.count} (${globalSummary.views.totalRows} lignes)`);

		if (globalSummary.tables.errors > 0 || globalSummary.views.errors > 0) {
			console.log(`⚠️  Erreurs: ${globalSummary.tables.errors} tables, ${globalSummary.views.errors} vues`);
		}

		console.log('\n📋 Détail par schéma:');
		for (const [schemaName, schemaData] of Object.entries(results.schemas)) {
			console.log(`   ${schemaName}: ${schemaData.summary.tables.count} tables, ${schemaData.summary.views.count} vues`);
		}

		console.log(`\n📁 Fichiers générés:`);
		console.log(`   - Données complètes: ${outputFile}`);
		console.log(`   - Résumé: ${summaryFile}`);

		return results;
	} catch (error) {
		console.error('❌ Erreur critique lors de la récupération des données:', error);
		throw error;
	} finally {
		await prisma.$disconnect();
	}
}

// Exécution si le script est lancé directement
if (import.meta.url.includes('fetch-dev-data.mjs')) {
	fetchDevData()
		.then(() => {
			console.log('\n🎉 Script principal cenov_dev_ewan terminé avec succès');
			process.exit(0);
		})
		.catch((error) => {
			console.error('\n💥 Échec du script principal cenov_dev_ewan:', error);
			process.exit(1);
		});
}

export { fetchDevData, getDevDatabaseInfo };