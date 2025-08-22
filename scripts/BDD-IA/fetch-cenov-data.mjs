#!/usr/bin/env node
/**
 * Script principal pour récupérer toutes les données de la base Cenov
 * Récupère toutes les tables et vues du schéma public en mode lecture seule
 * 
 * Commandes pour lancer les scripts :
 * - Tables seulement : node scripts/fetch-all-tables.mjs
 * - Vues seulement : node scripts/fetch-all-views.mjs  
 * - Tout (recommandé) : node scripts/fetch-cenov-data.mjs
 */

import { PrismaClient } from '@prisma/client';
import fs from 'fs/promises';
import path from 'path';
import { fetchAllTables } from './fetch-all-tables.mjs';
import { fetchAllViews } from './fetch-all-views.mjs';

const prisma = new PrismaClient({
  log: ['error', 'warn'],
  errorFormat: 'pretty'
});

/**
 * Récupère les informations générales sur la base de données
 */
async function getDatabaseInfo() {
  try {
    const [dbInfo, schemaInfo] = await Promise.all([
      // Informations générales sur la base
      prisma.$queryRaw`
        SELECT 
          current_database() as database_name,
          current_schema() as current_schema,
          version() as postgres_version
      `,
      // Informations sur le schéma public
      prisma.$queryRaw`
        SELECT 
          schemaname,
          COUNT(*) FILTER (WHERE tabletype = 'table') as table_count,
          COUNT(*) FILTER (WHERE tabletype = 'view') as view_count
        FROM (
          SELECT schemaname, 'table' as tabletype FROM pg_tables WHERE schemaname = 'public'
          UNION ALL
          SELECT schemaname, 'view' as tabletype FROM pg_views WHERE schemaname = 'public'
          UNION ALL
          SELECT schemaname, 'materialized_view' as tabletype FROM pg_matviews WHERE schemaname = 'public'
        ) combined
        GROUP BY schemaname
      `
    ]);

    return {
      database: dbInfo[0],
      schema: schemaInfo[0] || { schemaname: 'public', table_count: 0, view_count: 0 }
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des infos DB:', error);
    return null;
  }
}

/**
 * Fonction principale pour récupérer toutes les données Cenov
 */
async function fetchCenovData() {
  const startTime = new Date();
  console.log('🚀 Démarrage de la récupération complète des données Cenov');
  console.log(`⏰ Début: ${startTime.toISOString()}\n`);

  try {
    // Récupération des informations sur la base
    console.log('📋 Récupération des informations de la base de données...');
    const dbInfo = await getDatabaseInfo();
    if (dbInfo) {
      console.log(`   Base de données: ${dbInfo.database.database_name}`);
      console.log(`   Version PostgreSQL: ${dbInfo.database.postgres_version.split(' ')[0]}`);
      console.log(`   Tables: ${dbInfo.schema.table_count}, Vues: ${dbInfo.schema.view_count}\n`);
    }

    // Récupération des tables et vues en parallèle
    console.log('📊 Récupération des données...\n');
    const [tablesData, viewsData] = await Promise.all([
      fetchAllTables().catch(error => {
        console.error('Erreur tables:', error.message);
        return { error: error.message, tables: {} };
      }),
      fetchAllViews().catch(error => {
        console.error('Erreur vues:', error.message);
        return { error: error.message, views: {} };
      })
    ]);

    const endTime = new Date();
    const duration = endTime - startTime;

    // Compilation des résultats
    const results = {
      metadata: {
        timestamp: endTime.toISOString(),
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        duration: `${Math.round(duration / 1000)}s`,
        database: dbInfo?.database || null,
        schema: 'public'
      },
      summary: {
        tables: {
          count: Object.keys(tablesData.tables || {}).length,
          totalRows: Object.values(tablesData.tables || {}).reduce((sum, table) => sum + (table.rowCount || 0), 0),
          errors: Object.values(tablesData.tables || {}).filter(table => table.error).length
        },
        views: {
          count: Object.keys(viewsData.views || {}).length,
          totalRows: Object.values(viewsData.views || {}).reduce((sum, view) => sum + (view.rowCount || 0), 0),
          errors: Object.values(viewsData.views || {}).filter(view => view.error).length
        }
      },
      data: {
        tables: tablesData.tables || {},
        views: viewsData.views || {}
      },
      errors: {
        tables: tablesData.error || null,
        views: viewsData.error || null
      }
    };

    // Sauvegarde des résultats complets
    const outputDir = path.join(process.cwd(), 'scripts', 'output');
    await fs.mkdir(outputDir, { recursive: true });
    
    const outputFile = path.join(outputDir, `cenov-complete-data-${new Date().toISOString().split('T')[0]}.json`);
    await fs.writeFile(outputFile, JSON.stringify(results, null, 2));

    // Création d'un résumé léger
    const summaryFile = path.join(outputDir, `cenov-summary-${new Date().toISOString().split('T')[0]}.json`);
    const summary = {
      ...results.metadata,
      ...results.summary,
      tableList: Object.keys(results.data.tables),
      viewList: Object.keys(results.data.views),
      errors: results.errors
    };
    await fs.writeFile(summaryFile, JSON.stringify(summary, null, 2));

    console.log('\n' + '='.repeat(50));
    console.log('✅ RÉCUPÉRATION TERMINÉE AVEC SUCCÈS');
    console.log('='.repeat(50));
    console.log(`⏱️  Durée totale: ${Math.round(duration / 1000)}s`);
    console.log(`📊 Tables récupérées: ${results.summary.tables.count} (${results.summary.tables.totalRows} lignes)`);
    console.log(`👁️  Vues récupérées: ${results.summary.views.count} (${results.summary.views.totalRows} lignes)`);
    
    if (results.summary.tables.errors > 0 || results.summary.views.errors > 0) {
      console.log(`⚠️  Erreurs: ${results.summary.tables.errors} tables, ${results.summary.views.errors} vues`);
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
if (import.meta.url.includes('fetch-cenov-data.mjs')) {
  fetchCenovData()
    .then(() => {
      console.log('\n🎉 Script principal terminé avec succès');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Échec du script principal:', error);
      process.exit(1);
    });
}

export { fetchCenovData, getDatabaseInfo };