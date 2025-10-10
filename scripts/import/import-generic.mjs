#!/usr/bin/env node
/**
 * ============================================================================
 * SCRIPT D'IMPORT GÉNÉRIQUE AVEC GESTION FK AUTOMATIQUE
 * ============================================================================
 *
 * Ce script montre comment faire un import FACILE avec résolution automatique
 * des Foreign Keys, sans la complexité du système actuel.
 *
 * PRINCIPE SIMPLE :
 * 1. Définir vos données dans un objet JavaScript (facile à lire/modifier)
 * 2. Le script résout automatiquement les FK en cherchant par valeur unique
 * 3. Insert ou Update intelligent (upsert)
 *
 * AVANTAGES vs système actuel (view-import.ts) :
 * ✅ Pas de cache session complexe
 * ✅ Pas de DMMF detection automatique (trop compliqué)
 * ✅ Configuration explicite et lisible
 * ✅ ~100 lignes au lieu de 1500+
 * ✅ Facile à debugger
 *
 * UTILISATION :
 * ```bash
 * node scripts/import/import-generic.mjs
 * ```
 */

import { PrismaClient as CenovDevPrismaClient } from '../../prisma/cenov_dev/generated/index.js';

const prisma = new CenovDevPrismaClient({
	datasources: {
		cenov_dev_db: {
			url: process.env.CENOV_DEV_DATABASE_URL
		}
	}
});

/**
 * Helper: Trouve un enregistrement par une valeur unique
 * Remplace le cache session complexe par une simple recherche DB
 */
async function findByUniqueValue(tableName, uniqueField, uniqueValue) {
	try {
		const record = await prisma[tableName].findFirst({
			where: { [uniqueField]: uniqueValue }
		});
		return record;
	} catch {
		console.warn(`⚠️  Recherche échouée pour ${tableName}.${uniqueField} = "${uniqueValue}"`);
		return null;
	}
}

/**
 * Helper: Insert ou Update intelligent
 * Simple wrapper autour de upsert Prisma
 */
async function upsertRecord(tableName, uniqueWhere, data) {
	return await prisma[tableName].upsert({
		where: uniqueWhere,
		create: data,
		update: data
	});
}

/**
 * ============================================================================
 * EXEMPLE : Import d'un fournisseur avec produits et prix
 * ============================================================================
 *
 * Scénario : Importer un nouveau fournisseur "Grundfos-Test" avec 2 produits
 * et leurs tarifs d'achat.
 */
async function importSupplierWithProducts() {
	console.log('🚀 Import fournisseur + produits + tarifs\n');

	try {
		// ========== 1. CRÉER LE FOURNISSEUR ==========
		console.log('📦 Étape 1 : Création du fournisseur...');

		const supplier = await upsertRecord(
			'supplier',
			{ sup_code: 'GRDF-Test' }, // Clé unique
			{
				sup_code: 'GRDF-Test',
				sup_label: 'Grundfos France-Test',
				sup_parent_name: 'Grundfos Group',
				sup_brand_name: 'Grundfos'
			}
		);

		console.log(`   ✅ Fournisseur créé: ${supplier.sup_id} - ${supplier.sup_label}`);

		// ========== 2. CRÉER UN KIT ==========
		console.log('\n📦 Étape 2 : Création du kit...');

		const kit = await upsertRecord(
			'kit',
			// Pas de contrainte unique sur kit → vérifier par kit_label manuellement
			{ kit_id: (await findByUniqueValue('kit', 'kit_label', 'Pompe CR Grundfos-Test'))?.kit_id || 0 },
			{
				kit_label: 'Pompe CR Grundfos-Test'
			}
		);

		console.log(`   ✅ Kit créé: ${kit.kit_id} - ${kit.kit_label}`);

		// ========== 3. CRÉER DES PRODUITS AVEC FK AUTO ==========
		console.log('\n📦 Étape 3 : Création des produits...');

		const products = [
			{ pro_code: 'CR32-4-Test', pro_cenov_id: 'GRDF-CR32-4-Test' },
			{ pro_code: 'CR45-5-Test', pro_cenov_id: 'GRDF-CR45-5-Test' }
		];

		const insertedProducts = [];

		for (const prodData of products) {
			// ✅ RÉSOLUTION FK SIMPLE : Chercher le kit par son label
			const linkedKit = await findByUniqueValue('kit', 'kit_label', 'Pompe CR Grundfos-Test');

			// ✅ RÉSOLUTION FK SIMPLE : Chercher le fournisseur par son code
			const linkedSupplier = await findByUniqueValue('supplier', 'sup_code', 'GRDF-Test');

			const product = await prisma.product.upsert({
				where: {
					// Pas de contrainte unique sur product → chercher par pro_code manuellement
					pro_id:
						(await findByUniqueValue('product', 'pro_code', prodData.pro_code))?.pro_id || 0
				},
				create: {
					pro_code: prodData.pro_code,
					pro_cenov_id: prodData.pro_cenov_id,
					fk_kit: linkedKit?.kit_id || null, // ← FK résolue automatiquement
					fk_supplier: linkedSupplier?.sup_id || null // ← FK résolue automatiquement
				},
				update: {
					pro_cenov_id: prodData.pro_cenov_id,
					fk_kit: linkedKit?.kit_id || null,
					fk_supplier: linkedSupplier?.sup_id || null
				}
			});

			insertedProducts.push(product);
			console.log(`   ✅ Produit créé: ${product.pro_id} - ${product.pro_code}`);
		}

		// ========== 4. CRÉER DES TARIFS D'ACHAT ==========
		console.log('\n📦 Étape 4 : Création des tarifs d\'achat...');

		const prices = [
			{
				pro_code: 'CR32-4-Test',
				pp_date: new Date('2025-01-15'),
				pp_amount: 1250.0,
				pp_discount: 10.0
			},
			{
				pro_code: 'CR45-5-Test',
				pp_date: new Date('2025-01-15'),
				pp_amount: 1850.0,
				pp_discount: 12.0
			}
		];

		let pricesCreated = 0;

		for (const priceData of prices) {
			// ✅ RÉSOLUTION FK : Chercher le produit par son code
			const linkedProduct = insertedProducts.find((p) => p.pro_code === priceData.pro_code);

			if (!linkedProduct) {
				console.warn(`   ⚠️  Produit non trouvé: ${priceData.pro_code}`);
				continue;
			}

			await prisma.price_purchase.upsert({
				where: {
					// Clé composite (fk_product, pp_date)
					fk_product_pp_date: {
						fk_product: linkedProduct.pro_id,
						pp_date: priceData.pp_date
					}
				},
				create: {
					fk_product: linkedProduct.pro_id, // ← FK résolue
					pp_date: priceData.pp_date,
					pp_amount: priceData.pp_amount,
					pp_discount: priceData.pp_discount,
					pro_cenov_id: linkedProduct.pro_cenov_id
				},
				update: {
					pp_amount: priceData.pp_amount,
					pp_discount: priceData.pp_discount
				}
			});

			pricesCreated++;
			console.log(
				`   ✅ Tarif créé: ${priceData.pro_code} - ${priceData.pp_amount}€ (-${priceData.pp_discount}%)`
			);
		}

		// ========== RÉCAPITULATIF ==========
		console.log('\n' + '='.repeat(60));
		console.log('✅ IMPORT TERMINÉ AVEC SUCCÈS');
		console.log('='.repeat(60));
		console.log(`📊 Résumé:`);
		console.log(`   - 1 fournisseur créé`);
		console.log(`   - 1 kit créé`);
		console.log(`   - ${insertedProducts.length} produits créés`);
		console.log(`   - ${pricesCreated} tarifs d'achat créés`);
		console.log('');

		return {
			success: true,
			supplier: supplier.sup_id,
			products: insertedProducts.length,
			prices: pricesCreated
		};
	} catch (error) {
		console.error('\n❌ ERREUR LORS DE L\'IMPORT:', error);
		throw error;
	} finally {
		await prisma.$disconnect();
	}
}

/**
 * ============================================================================
 * PATRON RÉUTILISABLE : Import avec résolution FK
 * ============================================================================
 *
 * Ce pattern peut être réutilisé pour n'importe quelle table avec FK :
 *
 * 1. Définir les données à importer (objet JS simple)
 * 2. Pour chaque FK, utiliser findByUniqueValue() pour résoudre
 * 3. Utiliser upsert() pour insert ou update
 * 4. C'est tout !
 *
 * COMPARAISON vs système actuel :
 * - Ancien : Cache session, DMMF detection, enrichissement automatique → 1500 lignes
 * - Nouveau : Recherche directe, configuration explicite → ~100 lignes
 */

// Exécution si le script est lancé directement
if (import.meta.url.includes('import-generic.mjs')) {
	importSupplierWithProducts()
		.then(() => {
			console.log('🎉 Script terminé avec succès');
			process.exit(0);
		})
		.catch((error) => {
			console.error('💥 Échec du script:', error);
			process.exit(1);
		});
}

export { importSupplierWithProducts, findByUniqueValue, upsertRecord };
