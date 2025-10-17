#!/usr/bin/env node
/**
 * ============================================================================
 * SCRIPT DE ROLLBACK MVP - Suppression données CSV importées
 * ============================================================================
 *
 * Supprime UNIQUEMENT les données importées depuis le CSV MVP.
 * Utilise pro_cenov_id comme identifiant unique pour cibler les produits.
 *
 * PRINCIPE :
 * 1. Lit automatiquement le CSV pour extraire les pro_cenov_id
 * 2. Pour chaque pro_cenov_id, supprime en cascade :
 *    - price_purchase (prix)
 *    - product_category (liens catégories)
 *    - cross_ref (références croisées)
 *    - product (produit lui-même)
 * 3. Transaction atomique : rollback automatique si erreur
 *
 * SÉCURITÉ :
 * - Ne touche QUE les produits avec pro_cenov_id du CSV
 * - Préserve tous les autres produits
 * - Transaction atomique par produit
 *
 * UTILISATION :
 * ```bash
 * node scripts/import/rollback-mvp-csv.mjs
 * ```
 */

import { readFileSync } from 'fs';
import { parse } from 'csv-parse/sync';
import { PrismaClient as CenovDevPrismaClient } from '../../prisma/cenov_dev/generated/index.js';

// ============================================================================
// CONFIGURATION
// ============================================================================

const CONFIG = {
	// Chemin du fichier CSV source (même que import-mvp-csv.mjs)
	csvFilePath:
		'C:/Users/EwanSenergous/OneDrive - jll.spear/Bureau/Projet/importData/test_data/MVP_NV_CSV.csv',

	// Options de parsing CSV (identiques à l'import)
	csvOptions: {
		delimiter: ';',
		columns: true,
		skip_empty_lines: true,
		trim: true,
		bom: true
	}
};

// ============================================================================
// CLIENT PRISMA
// ============================================================================

const prisma = new CenovDevPrismaClient({
	datasources: {
		cenov_dev_db: {
			url: process.env.CENOV_DEV_DATABASE_URL
		}
	}
});

// ============================================================================
// FONCTION DE SUPPRESSION D'UN PRODUIT
// ============================================================================

/**
 * Supprime un produit et toutes ses dépendances en cascade
 * @param {string} proCenovId - ID Cenov du produit à supprimer
 * @returns {Promise<{success: boolean, stats: object}>}
 */
async function deleteProduct(proCenovId) {
	console.log(`\n[>] Traitement de ${proCenovId}...`);

	// 1. Chercher le produit
	const product = await prisma.product.findUnique({
		where: { pro_cenov_id: proCenovId },
		include: {
			price_purchase: true,
			product_category: true,
			cross_ref: true,
			supplier: true,
			kit: true
		}
	});

	if (!product) {
		console.log(`   ⚠️  Produit introuvable (déjà supprimé ou jamais importé)`);
		return { success: false, reason: 'not_found' };
	}

	console.log(`   ✓ Produit trouvé: pro_id=${product.pro_id}, pro_code=${product.pro_code}`);
	console.log(`   └─ Supplier: ${product.supplier?.sup_label || 'N/A'}`);
	console.log(`   └─ Kit: ${product.kit?.kit_label || 'N/A'}`);

	// 2. Compteurs pour stats
	const stats = {
		prices: 0,
		productCategories: 0,
		crossRefs: 0,
		productDeleted: false
	};

	// 3. Suppression en cascade (transaction atomique)
	try {
		await prisma.$transaction(async (tx) => {
			// 3.1. Supprimer price_purchase
			const deletedPrices = await tx.price_purchase.deleteMany({
				where: { fk_product: product.pro_id }
			});
			stats.prices = deletedPrices.count;
			console.log(`   - ${deletedPrices.count} prix supprimé(s)`);

			// 3.2. Supprimer product_category
			const deletedProdCat = await tx.product_category.deleteMany({
				where: { fk_product: product.pro_id }
			});
			stats.productCategories = deletedProdCat.count;
			console.log(`   - ${deletedProdCat.count} lien(s) catégorie supprimé(s)`);

			// 3.3. Supprimer cross_ref (si existe)
			const deletedCrossRef = await tx.cross_ref.deleteMany({
				where: { fk_product: product.pro_id }
			});
			stats.crossRefs = deletedCrossRef.count;
			if (deletedCrossRef.count > 0) {
				console.log(`   - ${deletedCrossRef.count} cross_ref supprimé(s)`);
			}

			// 3.4. Supprimer le produit lui-même
			await tx.product.delete({
				where: { pro_id: product.pro_id }
			});
			stats.productDeleted = true;
			console.log(`   ✓ Produit supprimé (pro_id=${product.pro_id})`);
		});

		console.log(`   ✅ Rollback de ${proCenovId} terminé avec succès`);
		return { success: true, stats };
	} catch (error) {
		console.error(`   ❌ Erreur lors de la suppression:`, error.message);
		return { success: false, reason: 'transaction_failed', error: error.message };
	}
}

// ============================================================================
// FONCTION PRINCIPALE
// ============================================================================

async function rollbackImport() {
	console.log('🗑️  ROLLBACK IMPORT MVP CSV -> CENOV_DEV\n');
	console.log(`[i] Fichier source: ${CONFIG.csvFilePath}\n`);

	try {
		// ========== 1. LECTURE CSV ==========
		console.log('[>] Lecture du fichier CSV...');
		const fileContent = readFileSync(CONFIG.csvFilePath, 'utf-8');
		const rows = parse(fileContent, CONFIG.csvOptions);
		console.log(`   [OK] ${rows.length} ligne(s) détectée(s)\n`);

		// ========== 2. EXTRACTION DES PRO_CENOV_ID ==========
		const proCenovIds = rows.map((row) => row.pro_cenov_id).filter((id) => id && id.trim() !== '');

		if (proCenovIds.length === 0) {
			console.log('⚠️  Aucun pro_cenov_id trouvé dans le CSV\n');
			return { success: true, stats: { total: 0, deleted: 0, notFound: 0, errors: 0 } };
		}

		console.log(`[>] ${proCenovIds.length} produit(s) à supprimer:\n`);
		proCenovIds.forEach((id, index) => {
			console.log(`   ${index + 1}. ${id}`);
		});
		console.log('');

		// ========== 3. SUPPRESSION LIGNE PAR LIGNE ==========
		console.log('[>] Début de la suppression...\n');

		const results = {
			total: proCenovIds.length,
			deleted: 0,
			notFound: 0,
			errors: 0,
			details: []
		};

		for (let i = 0; i < proCenovIds.length; i++) {
			const proCenovId = proCenovIds[i];
			const lineNumber = i + 1;

			console.log(`${'='.repeat(60)}`);
			console.log(`[${lineNumber}/${proCenovIds.length}] ${proCenovId}`);
			console.log(`${'='.repeat(60)}`);

			const result = await deleteProduct(proCenovId);

			if (result.success) {
				results.deleted++;
			} else if (result.reason === 'not_found') {
				results.notFound++;
			} else {
				results.errors++;
			}

			results.details.push({
				proCenovId,
				...result
			});
		}

		// ========== 4. RECAPITULATIF ==========
		console.log('\n' + '='.repeat(60));
		console.log('📊 RECAPITULATIF ROLLBACK');
		console.log('='.repeat(60));
		console.log(`[i] Total lignes CSV     : ${results.total}`);
		console.log(`[i] Produits supprimés  : ${results.deleted}`);
		console.log(`[i] Produits non trouvés: ${results.notFound}`);
		console.log(`[i] Erreurs             : ${results.errors}`);
		console.log('');

		if (results.deleted > 0) {
			console.log('✅ ROLLBACK TERMINÉ AVEC SUCCÈS');
		} else if (results.notFound === results.total) {
			console.log('ℹ️  Aucun produit à supprimer (déjà nettoyé)');
		} else {
			console.log('⚠️  ROLLBACK PARTIEL (voir erreurs ci-dessus)');
		}

		console.log('');

		return { success: true, stats: results };
	} catch (error) {
		console.error('\n[X] ERREUR LORS DU ROLLBACK:', error.message);
		throw error;
	} finally {
		await prisma.$disconnect();
	}
}

// ============================================================================
// EXECUTION
// ============================================================================

if (import.meta.url.includes('rollback-mvp-csv.mjs')) {
	rollbackImport()
		.then(() => {
			console.log('[OK] Script terminé avec succès');
			process.exit(0);
		})
		.catch((error) => {
			console.error('[X] Échec du script:', error);
			process.exit(1);
		});
}

export { rollbackImport, deleteProduct };
