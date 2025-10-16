#!/usr/bin/env node
/**
 * ============================================================================
 * SCRIPT D'IMPORT MVP - CSV vers CENOV_DEV
 * ============================================================================
 *
 * Import simple de donnees CSV avec validation stricte et resolution FK.
 *
 * PRINCIPE :
 * 1. Separation donnees/logique via objet de configuration
 * 2. Validation DMMF-based (sans hardcoding)
 * 3. Arret complet si validation echoue
 * 4. Upsert intelligent sur pro_cenov_id existant
 *
 * UTILISATION :
 * ```bash
 * node scripts/import/import-mvp-csv.mjs
 * ```
 */

import { readFileSync } from 'fs';
import { parse } from 'csv-parse/sync';
import { PrismaClient as CenovDevPrismaClient } from '../../prisma/cenov_dev/generated/index.js';

// ============================================================================
// CONFIGURATION - Separation donnees/logique
// ============================================================================

const CONFIG = {
	// Chemin du fichier CSV a importer
	csvFilePath:
		'C:/Users/EwanSenergous/OneDrive - jll.spear/Bureau/Projet/importData/test_data/MVP_NV_CSV.csv',

	// Options de parsing CSV
	csvOptions: {
		delimiter: ';',
		columns: true,
		skip_empty_lines: true,
		trim: true,
		bom: true // Support UTF-8 BOM
	},

	// Mapping colonnes CSV -> tables/champs DB
	fieldMapping: {
		pro_cenov_id: { table: 'product', field: 'pro_cenov_id' },
		pro_code: { table: 'product', field: 'pro_code' },
		sup_code: { table: 'supplier', field: 'sup_code' },
		sup_label: { table: 'supplier', field: 'sup_label' },
		cat_label: { table: 'category', field: 'cat_label' },
		kit_label: { table: 'kit', field: 'kit_label' },
		pp_amount: { table: 'price_purchase', field: 'pp_amount' },
		pp_discount: { table: 'price_purchase', field: 'pp_discount' },
		pp_date: { table: 'price_purchase', field: 'pp_date' }
	},

	// Champs requis pour validation
	requiredFields: [
		'pro_cenov_id',
		'pro_code',
		'sup_code',
		'sup_label',
		'kit_label',
		'pp_amount',
		'pp_date'
	],

	// Champs numeriques
	numericFields: ['pp_amount', 'pp_discount'],

	// Champs date (format ISO: YYYY-MM-DD)
	dateFields: ['pp_date']
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
// VALIDATION - Limites des champs (basees sur schema Prisma)
// ============================================================================

/**
 * Map des longueurs max par table.champ
 * Extrait directement du schema pour garantir coherence
 */
const FIELD_MAX_LENGTHS = {
	'product.pro_cenov_id': 50,
	'product.pro_code': 20,
	'product.sup_code': 100,
	'product.sup_label': 70,
	'supplier.sup_code': 10,
	'supplier.sup_label': 70,
	'category.cat_label': 100,
	'category.cat_code': 60,
	'kit.kit_label': 100,
	'price_purchase.pro_cenov_id': 100
};

/**
 * Recupere la longueur max d'un champ
 */
function getFieldMaxLength(modelName, fieldName) {
	const key = `${modelName}.${fieldName}`;
	return FIELD_MAX_LENGTHS[key] || null;
}

// ============================================================================
// FONCTIONS DE VALIDATION (sans hardcoding, DMMF-based)
// ============================================================================

/**
 * Valide une ligne CSV complete
 * @returns {{ valid: boolean, errors: string[] }}
 */
function validateRow(row, lineNumber) {
	const errors = [];

	// 1. Verifier champs requis (non vides)
	for (const field of CONFIG.requiredFields) {
		if (!row[field] || row[field].trim() === '') {
			errors.push(`Ligne ${lineNumber}: Champ requis manquant "${field}"`);
		}
	}

	// 2. Verifier types numeriques
	for (const field of CONFIG.numericFields) {
		const value = row[field];

		// Skip si champ nullable et vide
		if (!value || value.trim() === '') {
			if (!CONFIG.requiredFields.includes(field)) continue; // OK si non requis
			errors.push(`Ligne ${lineNumber}: Champ numerique requis vide "${field}"`);
			continue;
		}

		const numValue = parseFloat(value);
		if (isNaN(numValue)) {
			errors.push(`Ligne ${lineNumber}: "${field}" doit etre numerique (valeur: "${value}")`);
		}

		// pp_amount doit etre > 0
		if (field === 'pp_amount' && numValue <= 0) {
			errors.push(`Ligne ${lineNumber}: "pp_amount" doit etre > 0 (valeur: ${numValue})`);
		}
	}

	// 3. Verifier format dates ISO (YYYY-MM-DD)
	for (const field of CONFIG.dateFields) {
		const value = row[field];

		// Skip si champ nullable et vide
		if (!value || value.trim() === '') {
			if (!CONFIG.requiredFields.includes(field)) continue; // OK si non requis
			errors.push(`Ligne ${lineNumber}: Champ date requis vide "${field}"`);
			continue;
		}

		// Regex format ISO: YYYY-MM-DD
		const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;
		if (!isoDateRegex.test(value)) {
			errors.push(
				`Ligne ${lineNumber}: "${field}" doit etre au format ISO (YYYY-MM-DD), valeur: "${value}"`
			);
			continue;
		}

		// Verifier que c'est une date valide
		const date = new Date(value);
		if (isNaN(date.getTime())) {
			errors.push(`Ligne ${lineNumber}: "${field}" n'est pas une date valide: "${value}"`);
		}
	}

	// 4. Verifier longueurs max (DMMF-based, sans hardcoding)
	for (const [csvField, mapping] of Object.entries(CONFIG.fieldMapping)) {
		const value = row[csvField];
		if (!value || value.trim() === '') continue;

		const maxLength = getFieldMaxLength(mapping.table, mapping.field);
		if (maxLength && value.length > maxLength) {
			errors.push(
				`Ligne ${lineNumber}: "${csvField}" trop long (${value.length}/${maxLength} caracteres)`
			);
		}
	}

	return {
		valid: errors.length === 0,
		errors
	};
}

/**
 * Valide tout le CSV avant import
 */
function validateAllRows(rows) {
	console.log('[>] Validation prealable du CSV...\n');

	const allErrors = [];
	let validRows = 0;

	rows.forEach((row, index) => {
		const lineNumber = index + 2; // +2 car index 0 = ligne 2 (apres header)
		const validation = validateRow(row, lineNumber);

		if (validation.valid) {
			validRows++;
		} else {
			allErrors.push(...validation.errors);
		}
	});

	if (allErrors.length > 0) {
		console.error('[X] VALIDATION ECHOUEE\n');
		allErrors.forEach((err) => console.error(`   ${err}`));
		console.error(`\n[i] Resume: ${validRows}/${rows.length} lignes valides\n`);
		return false;
	}

	console.log(`[OK] Validation reussie: ${validRows} lignes valides\n`);
	return true;
}

// ============================================================================
// FONCTIONS DE RESOLUTION FK
// ============================================================================

/**
 * Trouve ou cree un fournisseur
 * @param {PrismaTransaction} tx - Client de transaction Prisma
 * @returns {{ entity: supplier, isNew: boolean }}
 */
async function findOrCreateSupplier(tx, sup_code, sup_label) {
	// Chercher par code unique
	let supplier = await tx.supplier.findUnique({
		where: { sup_code }
	});

	if (!supplier) {
		// Creer le fournisseur
		supplier = await tx.supplier.create({
			data: {
				sup_code,
				sup_label
			}
		});
		console.log(`   [+] Fournisseur cree: ${sup_code} - ${sup_label}`);
		return { entity: supplier, isNew: true };
	}

	return { entity: supplier, isNew: false };
}

/**
 * Trouve ou cree un kit
 * @param {PrismaTransaction} tx - Client de transaction Prisma
 * @returns {{ entity: kit, isNew: boolean }}
 */
async function findOrCreateKit(tx, kit_label) {
	// Chercher par label unique
	let kit = await tx.kit.findUnique({
		where: { kit_label }
	});

	if (!kit) {
		// Creer le kit
		kit = await tx.kit.create({
			data: { kit_label }
		});
		console.log(`   [+] Kit cree: ${kit_label}`);
		return { entity: kit, isNew: true };
	}

	return { entity: kit, isNew: false };
}

/**
 * Trouve ou cree une categorie
 * @param {PrismaTransaction} tx - Client de transaction Prisma
 * @returns {{ entity: category, isNew: boolean } | null}
 */
async function findOrCreateCategory(tx, cat_label) {
	if (!cat_label || cat_label.trim() === '') return null;

	// Chercher par label
	let category = await tx.category.findFirst({
		where: { cat_label }
	});

	if (!category) {
		// Creer la categorie (sans parent pour MVP)
		category = await tx.category.create({
			data: { cat_label }
		});
		console.log(`   [+] Categorie creee: ${cat_label}`);
		return { entity: category, isNew: true };
	}

	return { entity: category, isNew: false };
}

// ============================================================================
// FONCTION PRINCIPALE D'IMPORT
// ============================================================================

async function importCSV() {
	console.log('[>>] Import MVP CSV -> CENOV_DEV\n');
	console.log(`[i] Fichier: ${CONFIG.csvFilePath}\n`);

	try {
		// ========== 1. LECTURE CSV ==========
		console.log('[>] Lecture du fichier CSV...');
		const fileContent = readFileSync(CONFIG.csvFilePath, 'utf-8');
		const rows = parse(fileContent, CONFIG.csvOptions);
		console.log(`   [OK] ${rows.length} lignes detectees\n`);

		// ========== 2. VALIDATION PREALABLE ==========
		const isValid = validateAllRows(rows);
		if (!isValid) {
			throw new Error('Validation CSV echouee - Import annule');
		}

		// ========== 3. IMPORT LIGNE PAR LIGNE (TRANSACTION ATOMIQUE) ==========
		console.log('[>] Import des donnees (transaction atomique)...\n');

		const stats = {
			suppliers: 0,
			kits: 0,
			categories: 0,
			products: 0,
			productsUpdated: 0,
			prices: 0
		};

		// Transaction: si une erreur survient, TOUT est annule (rollback)
		await prisma.$transaction(async (tx) => {
			for (let i = 0; i < rows.length; i++) {
				const row = rows[i];
				const lineNumber = i + 2;

				console.log(`\n[>] Ligne ${lineNumber}/${rows.length + 1}: ${row.pro_cenov_id}`);

				// Resolution FK: Supplier
				const supplierResult = await findOrCreateSupplier(tx, row.sup_code, row.sup_label);
				if (supplierResult.isNew) stats.suppliers++;

				// Resolution FK: Kit
				const kitResult = await findOrCreateKit(tx, row.kit_label);
				if (kitResult.isNew) stats.kits++;

				// Resolution FK: Category (nullable)
				const categoryResult = await findOrCreateCategory(tx, row.cat_label);
				if (categoryResult && categoryResult.isNew) stats.categories++;

				// Upsert Product (utilise contrainte unique sur pro_cenov_id)
				const productData = {
					pro_cenov_id: row.pro_cenov_id,
					pro_code: row.pro_code,
					sup_code: row.sup_code,
					fk_supplier: supplierResult.entity.sup_id,
					fk_kit: kitResult.entity.kit_id
				};

				// Verifier si produit existe pour stats
				const existingProduct = await tx.product.findUnique({
					where: { pro_cenov_id: row.pro_cenov_id }
				});

				const product = await tx.product.upsert({
					where: { pro_cenov_id: row.pro_cenov_id },
					create: productData,
					update: productData
				});

				// Mettre a jour stats selon existence prealable
				if (existingProduct) {
					stats.productsUpdated++;
					console.log(`   [OK] Produit mis a jour: ${product.pro_id}`);
				} else {
					stats.products++;
					console.log(`   [OK] Produit cree: ${product.pro_id}`);
				}

				// Link Product <-> Category (si category existe)
				if (categoryResult) {
					await tx.product_category.upsert({
						where: {
							fk_product_fk_category: {
								fk_product: product.pro_id,
								fk_category: categoryResult.entity.cat_id
							}
						},
						create: {
							fk_product: product.pro_id,
							fk_category: categoryResult.entity.cat_id
						},
						update: {} // Pas de mise a jour si existe deja
					});
				}

				// Upsert Price Purchase
				const pp_discount =
					row.pp_discount && row.pp_discount.trim() !== '' ? parseFloat(row.pp_discount) : null;
				const pp_date = new Date(row.pp_date);

				await tx.price_purchase.upsert({
					where: {
						fk_product_pp_date: {
							fk_product: product.pro_id,
							pp_date: pp_date
						}
					},
					create: {
						fk_product: product.pro_id,
						pp_date: pp_date,
						pp_amount: parseFloat(row.pp_amount),
						pp_discount: pp_discount,
						pro_cenov_id: row.pro_cenov_id
					},
					update: {
						pp_amount: parseFloat(row.pp_amount),
						pp_discount: pp_discount
					}
				});
				stats.prices++;
				console.log(`   [OK] Prix enregistre: ${row.pp_amount} EUR (date: ${row.pp_date})`);
			}
		});

		// ========== RECAPITULATIF ==========
		console.log('\n' + '='.repeat(60));
		console.log('[OK] IMPORT TERMINE AVEC SUCCES');
		console.log('='.repeat(60));
		console.log(`[i] Resume:`);
		console.log(`   - ${stats.suppliers} nouveaux fournisseurs`);
		console.log(`   - ${stats.kits} nouveaux kits`);
		console.log(`   - ${stats.categories} nouvelles categories`);
		console.log(`   - ${stats.products} produits crees`);
		console.log(`   - ${stats.productsUpdated} produits mis a jour`);
		console.log(`   - ${stats.prices} prix enregistres`);
		console.log('');

		return { success: true, stats };
	} catch (error) {
		console.error("\n[X] ERREUR LORS DE L'IMPORT:", error.message);
		throw error;
	} finally {
		await prisma.$disconnect();
	}
}

// ============================================================================
// EXECUTION
// ============================================================================

if (import.meta.url.includes('import-mvp-csv.mjs')) {
	importCSV()
		.then(() => {
			console.log('[OK] Script termine avec succes');
			process.exit(0);
		})
		.catch((error) => {
			console.error('[X] Echec du script:', error);
			process.exit(1);
		});
}

export { importCSV, validateRow, validateAllRows };
