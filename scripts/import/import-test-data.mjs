#!/usr/bin/env node
/**
 * ============================================================================
 * SCRIPT D'IMPORT SIMPLE - Version Node.js de test_vue_SAFE_v2.sql
 * ============================================================================
 *
 * Ce script fait EXACTEMENT la même chose que test_vue_SAFE_v2.sql,
 * mais directement depuis le code (pas besoin de DataGrip/psql).
 *
 * AVANTAGES vs SQL manuel :
 * ✅ Exécutable automatiquement : node scripts/import/import-test-data.mjs
 * ✅ Récupération automatique des IDs générés (pas besoin de les deviner)
 * ✅ Scriptable et intégrable dans CI/CD
 * ✅ Gestion d'erreurs intégrée
 * ✅ Logs détaillés de ce qui se passe
 * ✅ Données séparées dans fichier JSON (facile à modifier)
 *
 * UTILISATION :
 * ```bash
 * node scripts/import/import-test-data.mjs
 * node scripts/import/import-test-data.mjs ./data/test-data.json
 * node scripts/import/import-test-data.mjs ./data/suppliers-data.json
 * ```
 */

import { PrismaClient as CenovDevPrismaClient } from '../../prisma/cenov_dev/generated/index.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new CenovDevPrismaClient({
	datasources: {
		cenov_dev_db: {
			url: process.env.CENOV_DEV_DATABASE_URL
		}
	}
});

/**
 * Charger les données depuis un fichier JSON
 * @param {string} dataFilePath - Chemin vers le fichier JSON (relatif au script)
 * @returns {Promise<Object>} - Données chargées
 */
async function loadData(dataFilePath) {
	const fullPath = path.resolve(__dirname, dataFilePath);
	console.log(`📁 Chargement des données depuis: ${fullPath}`);

	try {
		const fileContent = await fs.readFile(fullPath, 'utf-8');
		const data = JSON.parse(fileContent);
		console.log(`✅ Données chargées avec succès\n`);
		return data;
	} catch (error) {
		console.error(`❌ Erreur lors du chargement du fichier: ${fullPath}`);
		throw error;
	}
}

/**
 * Fonction principale d'import
 * @param {string} dataFilePath - Chemin vers le fichier JSON de données (défaut: ./data/test-data.json)
 */
async function importTestData(dataFilePath = './data/test-data.json') {
	const startTime = new Date();
	console.log('🚀 Démarrage import données de test');
	console.log(`⏰ Début: ${startTime.toISOString()}\n`);

	try {
		// ========== 0. CHARGER LES DONNÉES ==========
		const TEST_DATA = await loadData(dataFilePath);

		// ========== 1. INSÉRER LES ATTRIBUTS ==========
		console.log('📊 Étape 1/7 : Insertion des attributs...');
		const insertedAttributes = [];

		for (const attr of TEST_DATA.attributes) {
			const inserted = await prisma.attribute.upsert({
				where: {
					// Clé unique composite (atr_nature, atr_value)
					// Note: atr_value est optionnel, on utilise atr_code comme identifiant unique
					atr_nature_atr_value: {
						atr_nature: attr.atr_nature,
						atr_value: attr.atr_code // Utiliser atr_code comme valeur unique
					}
				},
				create: {
					...attr,
					atr_value: attr.atr_code // Dupliquer atr_code dans atr_value pour contrainte
				},
				update: {
					atr_label: attr.atr_label,
					atr_symbol_intl: attr.atr_symbol_intl,
					atr_description: attr.atr_description
				}
			});

			insertedAttributes.push(inserted);
			console.log(`   ✅ Attribut créé: ${inserted.atr_id} - ${inserted.atr_code} (${inserted.atr_label})`);
		}

		// ========== 2. INSÉRER LES KITS ==========
		console.log('\n📊 Étape 2/7 : Insertion des kits...');
		const insertedKits = [];

		for (const kitData of TEST_DATA.kits) {
			// Vérifier si le kit existe déjà
			const existing = await prisma.kit.findFirst({
				where: { kit_label: kitData.kit_label }
			});

			let kit;
			if (existing) {
				console.log(`   ⚠️  Kit existe déjà: ${existing.kit_id} - ${existing.kit_label}`);
				kit = existing;
			} else {
				kit = await prisma.kit.create({
					data: kitData
				});
				console.log(`   ✅ Kit créé: ${kit.kit_id} - ${kit.kit_label}`);
			}

			insertedKits.push(kit);
		}

		// ========== 3. INSÉRER LES CATÉGORIES ==========
		console.log('\n📊 Étape 3/7 : Insertion des catégories...');
		const insertedCategories = [];

		for (const catData of TEST_DATA.categories) {
			const inserted = await prisma.category.upsert({
				where: {
					// Clé unique composite (fk_parent, cat_code)
					fk_parent_cat_code: {
						fk_parent: catData.fk_parent ?? -1, // Utiliser -1 pour NULL dans la clé
						cat_code: catData.cat_code
					}
				},
				create: catData,
				update: {
					cat_label: catData.cat_label,
					cat_wp_name: catData.cat_wp_name
				}
			});

			insertedCategories.push(inserted);
			console.log(`   ✅ Catégorie créée: ${inserted.cat_id} - ${inserted.cat_code} (${inserted.cat_label})`);
		}

		// ========== 4. LIER CATÉGORIES ET ATTRIBUTS ==========
		console.log('\n📊 Étape 4/7 : Liaison catégories ↔ attributs...');

		let linksCreated = 0;
		for (const link of TEST_DATA.categoryAttributeLinks) {
			const category = insertedCategories.find((c) => c.cat_code === link.cat_code);
			const attribute = insertedAttributes.find((a) => a.atr_code === link.atr_code);

			if (category && attribute) {
				await prisma.category_attribute.upsert({
					where: {
						fk_category_fk_attribute: {
							fk_category: category.cat_id,
							fk_attribute: attribute.atr_id
						}
					},
					create: {
						fk_category: category.cat_id,
						fk_attribute: attribute.atr_id,
						cat_atr_required: link.cat_atr_required
					},
					update: {
						cat_atr_required: link.cat_atr_required
					}
				});

				linksCreated++;
				console.log(
					`   ✅ Lien créé: ${link.cat_code} ↔ ${link.atr_code} (requis: ${link.cat_atr_required})`
				);
			}
		}

		console.log(`   📈 Total liens créés: ${linksCreated}`);

		// ========== 5. INSÉRER LES PRODUITS ==========
		console.log('\n📊 Étape 5/7 : Insertion des produits...');

		const insertedProducts = [];
		for (const prodData of TEST_DATA.products) {
			const kit = insertedKits.find((k) => k.kit_label === prodData.kit_label);

			if (!kit) {
				console.warn(`   ⚠️  Kit non trouvé pour ${prodData.pro_code}: ${prodData.kit_label}`);
				continue;
			}

			// Vérifier si le produit existe déjà
			const existing = await prisma.product.findFirst({
				where: { pro_code: prodData.pro_code }
			});

			let product;
			if (existing) {
				console.log(`   ⚠️  Produit existe déjà: ${existing.pro_id} - ${existing.pro_code}`);
				product = existing;
			} else {
				product = await prisma.product.create({
					data: {
						pro_code: prodData.pro_code,
						fk_kit: kit.kit_id,
						pro_cenov_id: prodData.pro_cenov_id
					}
				});
				console.log(`   ✅ Produit créé: ${product.pro_id} - ${product.pro_code}`);
			}

			insertedProducts.push(product);
		}

		// ========== 6. LIER PRODUITS ET CATÉGORIES ==========
		console.log('\n📊 Étape 6/7 : Liaison produits ↔ catégories...');

		let productLinksCreated = 0;
		for (const link of TEST_DATA.productCategoryLinks) {
			const product = insertedProducts.find((p) => p.pro_code === link.pro_code);

			if (!product) {
				console.warn(`   ⚠️  Produit non trouvé: ${link.pro_code}`);
				continue;
			}

			for (const cat_code of link.cat_codes) {
				const category = insertedCategories.find((c) => c.cat_code === cat_code);

				if (category) {
					await prisma.product_category.upsert({
						where: {
							fk_product_fk_category: {
								fk_product: product.pro_id,
								fk_category: category.cat_id
							}
						},
						create: {
							fk_product: product.pro_id,
							fk_category: category.cat_id
						},
						update: {}
					});

					productLinksCreated++;
					console.log(`   ✅ Lien créé: ${link.pro_code} ↔ ${cat_code}`);
				}
			}
		}

		console.log(`   📈 Total liens produit-catégorie créés: ${productLinksCreated}`);

		// ========== 7. VÉRIFICATION VUE ==========
		console.log('\n📊 Étape 7/7 : Vérification de la vue v_produit_categorie_attribut...');

		const viewData = await prisma.$queryRaw`
			SELECT pro_id, kit_label, atr_id, atr_label, cat_label
			FROM produit.v_produit_categorie_attribut
			WHERE pro_id IN (
				SELECT pro_id FROM produit.product WHERE pro_code LIKE '%-Test'
			)
			ORDER BY pro_id, atr_id
			LIMIT 10
		`;

		console.log(`   📋 Lignes dans la vue: ${viewData.length}`);
		if (viewData.length > 0) {
			console.log(`   👁️  Aperçu (3 premières lignes):`);
			viewData.slice(0, 3).forEach((row) => {
				console.log(
					`      - Produit ${row.pro_id} (${row.kit_label}) → ${row.atr_label} [${row.cat_label}]`
				);
			});
		}

		// ========== RÉCAPITULATIF FINAL ==========
		const endTime = new Date();
		const duration = Math.round((endTime - startTime) / 1000);

		console.log('\n' + '='.repeat(60));
		console.log('✅ IMPORT TERMINÉ AVEC SUCCÈS');
		console.log('='.repeat(60));
		console.log(`⏱️  Durée: ${duration}s`);
		console.log(`📊 Résumé:`);
		console.log(`   - ${insertedAttributes.length} attributs créés`);
		console.log(`   - ${insertedKits.length} kits créés`);
		console.log(`   - ${insertedCategories.length} catégories créées`);
		console.log(`   - ${linksCreated} liens catégorie-attribut créés`);
		console.log(`   - ${insertedProducts.length} produits créés`);
		console.log(`   - ${productLinksCreated} liens produit-catégorie créés`);
		console.log(`   - ${viewData.length} lignes dans la vue`);
		console.log('');

		return {
			success: true,
			attributes: insertedAttributes.length,
			kits: insertedKits.length,
			categories: insertedCategories.length,
			products: insertedProducts.length,
			duration
		};
	} catch (error) {
		console.error('\n❌ ERREUR LORS DE L\'IMPORT:', error);
		throw error;
	} finally {
		await prisma.$disconnect();
	}
}

// Exécution si le script est lancé directement
if (import.meta.url.includes('import-test-data.mjs')) {
	// Récupérer le chemin du fichier de données depuis les arguments CLI
	// Exemple : node import-test-data.mjs ./data/suppliers-data.json
	const dataFile = process.argv[2] || './data/test-data.json';

	console.log(`📂 Fichier de données: ${dataFile}\n`);

	importTestData(dataFile)
		.then(() => {
			console.log('🎉 Script terminé avec succès');
			process.exit(0);
		})
		.catch((error) => {
			console.error('💥 Échec du script:', error);
			process.exit(1);
		});
}

export { importTestData };
