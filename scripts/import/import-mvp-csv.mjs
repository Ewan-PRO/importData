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
		columns: false, // IMPORTANT: false pour gérer headers dupliqués (atr_label x4)
		skip_empty_lines: true,
		trim: true,
		bom: true // Support UTF-8 BOM
	},

	// Mapping colonnes CSV -> tables/champs DB
	fieldMapping: {
		pro_cenov_id: { table: 'product', field: 'pro_cenov_id' },
		pro_code: { table: 'product', field: 'pro_code' },
		cat_code: { table: 'category', field: 'cat_code' },
		sup_code: { table: 'supplier', field: 'sup_code' },
		sup_label: { table: 'supplier', field: 'sup_label' },
		cat_label: { table: 'category', field: 'cat_label' },
		kit_label: { table: 'kit', field: 'kit_label' },
		famille: { table: 'family', field: 'fam_label' },
		sous_famille: { table: 'family', field: 'fam_label' },
		sous_sous_famille: { table: 'family', field: 'fam_label' },
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
	'product.pro_code': 50,
	'product.cat_code': 50,
	'product.sup_code': 100,
	'product.sup_label': 70,
	'supplier.sup_code': 50,
	'supplier.sup_label': 70,
	'category.cat_label': 100,
	'category.cat_code': 60,
	'kit.kit_label': 100,
	'family.fam_label': 100,
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
// FONCTIONS UTILITAIRES
// ============================================================================

/**
 * Mappe une ligne CSV (array) en objet en utilisant les headers
 * Gère les headers dupliqués en ignorant les colonnes "atr_label"
 * @param {Array<string>} headers - Headers du CSV
 * @param {Array<string>} line - Ligne de données
 * @param {Array<number>} atrPositions - Positions des colonnes "atr_label" à ignorer
 * @returns {Object} Objet avec les données mappées
 */
function mapRowToObject(headers, line, atrPositions = []) {
	const row = {};

	headers.forEach((header, index) => {
		// Ignorer les colonnes "atr_label" (gérées séparément)
		if (atrPositions.includes(index)) return;

		// Mapper les autres colonnes
		row[header] = line[index] || '';
	});

	return row;
}

/**
 * Convertit une date DD/MM/YYYY vers YYYY-MM-DD (ISO)
 * Accepte aussi directement le format ISO
 * @param {string} dateStr - Date au format DD/MM/YYYY ou YYYY-MM-DD
 * @returns {string|null} Date au format ISO (YYYY-MM-DD) ou null si invalide
 */
function convertToISODate(dateStr) {
	if (!dateStr || dateStr.trim() === '') return null;

	const trimmed = dateStr.trim();

	// Format ISO (YYYY-MM-DD) - déjà bon
	const isoRegex = /^\d{4}-\d{2}-\d{2}$/;
	if (isoRegex.test(trimmed)) {
		return trimmed;
	}

	// Format français (DD/MM/YYYY) - convertir
	const frenchRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
	const match = trimmed.match(frenchRegex);

	if (match) {
		const [, day, month, year] = match;
		return `${year}-${month}-${day}`;
	}

	return null; // Format non reconnu
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

	// 3. Verifier et convertir format dates (ISO ou français)
	for (const field of CONFIG.dateFields) {
		const value = row[field];

		// Skip si champ nullable et vide
		if (!value || value.trim() === '') {
			if (!CONFIG.requiredFields.includes(field)) continue; // OK si non requis
			errors.push(`Ligne ${lineNumber}: Champ date requis vide "${field}"`);
			continue;
		}

		// Convertir au format ISO (accepte ISO et DD/MM/YYYY)
		const isoDate = convertToISODate(value);
		if (!isoDate) {
			errors.push(
				`Ligne ${lineNumber}: "${field}" format invalide (accepte: YYYY-MM-DD ou DD/MM/YYYY), valeur: "${value}"`
			);
			continue;
		}

		// Verifier que c'est une date valide
		const date = new Date(isoDate);
		if (isNaN(date.getTime())) {
			errors.push(`Ligne ${lineNumber}: "${field}" n'est pas une date valide: "${value}"`);
			continue;
		}

		// Remplacer la valeur dans row par le format ISO pour l'import
		row[field] = isoDate;
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
	// Verifier existence prealable pour stats
	const existing = await tx.supplier.findUnique({
		where: { sup_code }
	});

	// Upsert (create ou update)
	const supplier = await tx.supplier.upsert({
		where: { sup_code },
		create: {
			sup_code,
			sup_label
		},
		update: {
			sup_label
		}
	});

	if (!existing) {
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
	// Verifier existence prealable pour stats
	const existing = await tx.kit.findUnique({
		where: { kit_label }
	});

	// Upsert (create ou update)
	const kit = await tx.kit.upsert({
		where: { kit_label },
		create: { kit_label },
		update: {}
	});

	if (!existing) {
		console.log(`   [+] Kit cree: ${kit_label}`);
		return { entity: kit, isNew: true };
	}

	return { entity: kit, isNew: false };
}

/**
 * Trouve ou cree une categorie
 * @param {PrismaTransaction} tx - Client de transaction Prisma
 * @param {string} cat_label - Label de la categorie
 * @param {string|null} cat_code - Code de la categorie (optionnel)
 * @returns {{ entity: category, isNew: boolean } | null}
 */
async function findOrCreateCategory(tx, cat_label, cat_code = null) {
	if (!cat_label || cat_label.trim() === '') return null;

	// Chercher par cat_code SI fourni, sinon par label
	const whereClause = cat_code ? { cat_code } : { cat_label };

	let category = await tx.category.findFirst({
		where: whereClause
	});

	if (!category) {
		// Creer la categorie avec cat_code si fourni
		try {
			category = await tx.category.create({
				data: {
					cat_code: cat_code || null,
					cat_label
				}
			});
			console.log(`   [+] Categorie creee: ${cat_label}${cat_code ? ` (${cat_code})` : ''}`);
			return { entity: category, isNew: true };
		} catch (error) {
			// Si erreur de contrainte, re-chercher (race condition possible)
			category = await tx.category.findFirst({
				where: whereClause
			});
			if (!category) throw error; // Re-throw si vraiment une autre erreur
		}
	}

	return { entity: category, isNew: false };
}

/**
 * Trouve ou cree une famille avec gestion hierarchique
 * @param {PrismaTransaction} tx - Client de transaction Prisma
 * @param {string} fam_label - Label de la famille
 * @param {number|null} fk_parent - ID du parent (null pour niveau 1)
 * @param {number} fk_supplier - ID du fournisseur
 * @returns {{ entity: family, isNew: boolean } | null}
 */
async function findOrCreateFamily(tx, fam_label, fk_parent, fk_supplier) {
	if (!fam_label || fam_label.trim() === '') return null;

	// Chercher famille existante avec contrainte unique (fam_label, fk_parent, fk_supplier)
	const whereClause = {
		fam_label,
		fk_parent: fk_parent || null,
		fk_supplier
	};

	let family = await tx.family.findFirst({
		where: whereClause
	});

	if (!family) {
		// Si fk_parent est fourni et non-null, utiliser upsert pour profiter de la contrainte
		if (fk_parent !== null) {
			family = await tx.family.upsert({
				where: {
					fam_label_fk_parent_fk_supplier: {
						fam_label,
						fk_parent,
						fk_supplier
					}
				},
				create: {
					fam_label,
					fk_parent,
					fk_supplier,
					fk_category: null
				},
				update: {} // Pas de mise a jour si existe deja
			});
		} else {
			// Pour fk_parent = null, utiliser create car upsert ne supporte pas null dans where
			family = await tx.family.create({
				data: {
					fam_label,
					fk_parent: null,
					fk_supplier,
					fk_category: null
				}
			});
		}

		const parentInfo = fk_parent ? `parent: ${fk_parent}` : 'racine';
		console.log(`   [+] Famille creee: ${fam_label} (${parentInfo})`);
		return { entity: family, isNew: true };
	}

	return { entity: family, isNew: false };
}

// ============================================================================
// FONCTIONS GESTION ATTRIBUTS
// ============================================================================

/**
 * Charge tous les attributs de la DB dans une Map pour lookup rapide
 * @returns {Promise<Map<string, {atr_id: number, atr_label: string}>>}
 */
async function loadAttributeReference(prisma) {
	console.log('[>] Chargement du referentiel des attributs...');

	const attributes = await prisma.attribute.findMany({
		select: {
			atr_id: true,
			atr_label: true
		}
	});

	const map = new Map();
	for (const attr of attributes) {
		map.set(attr.atr_label, attr);
	}

	console.log(`   [OK] ${attributes.length} attributs charges en reference\n`);
	return map;
}

/** Detecte les colonnes d'attributs (header = "atr_label") dans le CSV
 * Format vertical: ligne 2 = noms attributs, ligne 3 = valeurs
 * @returns {{columnIndexes: number[]}} */
function classifyColumns(csvHeaders) {
	console.log('[>] Classification des colonnes CSV...');

	const attributeColumnIndexes = [];

	csvHeaders.forEach((header, index) => {
		if (header === 'atr_label') {
			attributeColumnIndexes.push(index);
			console.log(`   [+] Colonne attribut detectee a la position ${index}`);
		}
	});

	console.log(
		`\n[i] Classification: ${attributeColumnIndexes.length} colonnes d'attributs detectees\n`
	);

	return { attributeColumnIndexes };
}

/**
 * Extrait les paires nom-valeur d'attributs depuis les lignes CSV (format vertical)
 * @param {Array} dataRow - Ligne 2 du CSV (donnees produit + noms attributs)
 * @param {Array} valuesRow - Ligne 3 du CSV (valeurs attributs)
 * @param {Array<number>} columnIndexes - Positions des colonnes atr_label
 * @returns {Array<{atrLabel: string, atrValue: string}>}
 */
function extractAttributePairs(dataRow, valuesRow, columnIndexes) {
	const attributes = [];

	for (const colIndex of columnIndexes) {
		const atrLabel = dataRow[colIndex]; // Ex: "Type d'alimentation"
		const atrValue = valuesRow ? valuesRow[colIndex] : null; // Ex: "Triphasé"

		if (atrLabel && atrLabel.trim() !== '') {
			attributes.push({
				atrLabel: atrLabel.trim(),
				atrValue: atrValue ? atrValue.trim() : null
			});
		}
	}

	return attributes;
}

/**
 * Charge les valeurs autorisees pour un ensemble d'attributs
 * @returns {Promise<Map<number, Set<string>>>} Map<atr_id, Set<av_value_label>>
 */
async function loadAllowedValues(prisma, atrIds) {
	if (atrIds.length === 0) return new Map();

	console.log('[>] Chargement des valeurs autorisees pour validation...');

	const attributeValues = await prisma.attribute_value.findMany({
		where: {
			av_atr_id: { in: atrIds }
		},
		select: {
			av_atr_id: true,
			av_value_label: true
		}
	});

	// Creer Map<atr_id, Set<valeurs>>
	const allowedValuesMap = new Map();

	for (const av of attributeValues) {
		if (!allowedValuesMap.has(av.av_atr_id)) {
			allowedValuesMap.set(av.av_atr_id, new Set());
		}
		allowedValuesMap.get(av.av_atr_id).add(av.av_value_label);
	}

	console.log(`   [OK] Valeurs autorisees chargees pour ${atrIds.length} attributs\n`);
	return allowedValuesMap;
}

/**
 * Valide que les attributs existent et que leurs valeurs sont autorisees
 * @returns {Array<string>} Tableau d'erreurs (vide si tout est valide)
 */
function validateAttributeValues(attributes, attributeMap, allowedValuesMap) {
	const errors = [];

	for (const { atrLabel, atrValue } of attributes) {
		// Skip si pas de valeur (optionnel)
		if (!atrValue || atrValue.trim() === '') continue;

		// 1. Verifier que l'attribut existe
		const attribute = attributeMap.get(atrLabel);
		if (!attribute) {
			errors.push(`Attribut "${atrLabel}" introuvable dans la base de donnees`);
			continue;
		}

		// 2. Verifier que la valeur est autorisee
		const allowedValues = allowedValuesMap.get(attribute.atr_id);
		if (!allowedValues || !allowedValues.has(atrValue)) {
			const allowedList = allowedValues ? Array.from(allowedValues).join(', ') : 'aucune';
			errors.push(
				`Attribut "${atrLabel}": valeur "${atrValue}" invalide. Valeurs autorisees: [${allowedList}]`
			);
		}
	}

	return errors;
}

/**
 * Cree ou verifie la relation category-attribute (template)
 * @param {PrismaTransaction} tx - Client de transaction Prisma
 * @param {number} cat_id - ID de la categorie
 * @param {number} atr_id - ID de l'attribut
 * @param {string} atr_label - Label de l'attribut (pour logs)
 * @returns {Promise<{isNew: boolean}>}
 */
async function upsertCategoryAttribute(tx, cat_id, atr_id, atr_label) {
	// Verifier si relation existe deja
	const existing = await tx.category_attribute.findFirst({
		where: {
			fk_category: cat_id,
			fk_attribute: atr_id
		}
	});

	if (!existing) {
		// Creer la relation (template)
		await tx.category_attribute.create({
			data: {
				fk_category: cat_id,
				fk_attribute: atr_id,
				cat_atr_required: false // Optionnel par defaut
			}
		});
		console.log(`   [+] Categorie-Attribut lie: "${atr_label}" (optionnel)`);
		return { isNew: true };
	}

	return { isNew: false };
}

/**
 * Cree ou met a jour la valeur d'un attribut pour un kit (instance)
 * @param {PrismaTransaction} tx - Client de transaction Prisma
 * @param {number} kit_id - ID du kit
 * @param {number} atr_id - ID de l'attribut
 * @param {string} atr_value - Valeur de l'attribut
 * @param {string} atr_label - Label de l'attribut (pour logs)
 * @returns {Promise<{isNew: boolean}>}
 */
async function upsertKitAttribute(tx, kit_id, atr_id, atr_value, atr_label) {
	// Verifier si attribut deja defini pour ce kit
	const existing = await tx.kit_attribute.findFirst({
		where: {
			fk_kit: kit_id,
			fk_attribute_characteristic: atr_id
		}
	});

	if (existing) {
		// Mettre a jour la valeur
		await tx.kit_attribute.update({
			where: { kat_id: existing.kat_id },
			data: { kat_value: atr_value }
		});
		console.log(`   [↻] Kit-Attribut mis a jour: "${atr_label}" = "${atr_value}"`);
		return { isNew: false };
	} else {
		// Creer l'enregistrement
		await tx.kit_attribute.create({
			data: {
				fk_kit: kit_id,
				fk_attribute_characteristic: atr_id,
				fk_attribute_unite: null, // Pas d'unite pour valeurs predefinies
				kat_value: atr_value
			}
		});
		console.log(`   [+] Kit-Attribut cree: "${atr_label}" = "${atr_value}"`);
		return { isNew: true };
	}
}

/**
 * Verifie que les attributs ont bien ete importes dans les tables
 * @param {PrismaClient} prisma - Client Prisma
 * @param {number} cat_id - ID de la categorie
 * @param {number} kit_id - ID du kit
 * @param {Array<{atrLabel: string, atrValue: string}>} attributes - Attributs importes
 * @param {Map} attributeMap - Map des attributs
 */
async function verifyImportedAttributes(prisma, cat_id, kit_id, attributes, attributeMap) {
	console.log('\n' + '='.repeat(60));
	console.log("[>] VERIFICATION DES IMPORTS D'ATTRIBUTS");
	console.log('='.repeat(60) + '\n');

	const attributesWithValues = attributes.filter((a) => a.atrValue);

	if (attributesWithValues.length === 0) {
		console.log('[i] Aucun attribut a verifier\n');
		return;
	}

	// Verification category_attribute
	console.log('[>] Verification table category_attribute...');
	for (const { atrLabel } of attributesWithValues) {
		const attribute = attributeMap.get(atrLabel);
		if (!attribute) continue;

		const catAttr = await prisma.category_attribute.findFirst({
			where: {
				fk_category: cat_id,
				fk_attribute: attribute.atr_id
			}
		});

		if (catAttr) {
			console.log(
				`   [OK] cat_id=${cat_id}, atr_id=${attribute.atr_id}, atr_label="${atrLabel}", cat_atr_required=${catAttr.cat_atr_required}`
			);
		} else {
			console.log(`   [X] MANQUANT: cat_id=${cat_id}, atr_label="${atrLabel}"`);
		}
	}

	// Verification kit_attribute
	console.log('\n[>] Verification table kit_attribute...');
	for (const { atrLabel } of attributesWithValues) {
		const attribute = attributeMap.get(atrLabel);
		if (!attribute) continue;

		const kitAttr = await prisma.kit_attribute.findFirst({
			where: {
				fk_kit: kit_id,
				fk_attribute_characteristic: attribute.atr_id
			}
		});

		if (kitAttr) {
			console.log(
				`   [OK] kit_id=${kit_id}, atr_id=${attribute.atr_id}, atr_label="${atrLabel}", kat_value="${kitAttr.kat_value}"`
			);
		} else {
			console.log(`   [X] MANQUANT: kit_id=${kit_id}, atr_label="${atrLabel}"`);
		}
	}

	console.log('');
}

// ============================================================================
// FONCTION PRINCIPALE D'IMPORT
// ============================================================================

async function importCSV() {
	console.log('[>>] Import MVP CSV -> CENOV_DEV\n');
	console.log(`[i] Fichier: ${CONFIG.csvFilePath}\n`);

	try {
		// ========== 0. CHARGEMENT REFERENTIEL ATTRIBUTS ==========
		const attributeMap = await loadAttributeReference(prisma);

		// ========== 1. LECTURE CSV ==========
		console.log('[>] Lecture du fichier CSV...');
		const fileContent = readFileSync(CONFIG.csvFilePath, 'utf-8');
		const rawData = parse(fileContent, CONFIG.csvOptions); // columns: false → array de arrays
		console.log(`   [OK] ${rawData.length} lignes detectees (incluant header)\n`);

		// ========== 1.5 EXTRACTION HEADERS ET CLASSIFICATION ==========
		const headers = rawData[0]; // Ligne 1 = headers
		const dataLines = rawData.slice(1); // Lignes 2+ = données

		const { attributeColumnIndexes } = classifyColumns(headers);

		// Extraire paires attribut nom-valeur (format vertical: ligne data + ligne valeurs)
		let attributePairs = [];
		let dataRows = []; // Lignes de données en format objet

		if (attributeColumnIndexes.length > 0 && dataLines.length >= 2) {
			// Format vertical détecté
			const dataLine = dataLines[0]; // Ligne 2 CSV (données + noms attributs)
			const valuesLine = dataLines[1]; // Ligne 3 CSV (valeurs attributs)

			// Extraire attributs par index direct
			attributePairs = extractAttributePairs(dataLine, valuesLine, attributeColumnIndexes);

			console.log('[i] Attributs detectes:');
			attributePairs.forEach((pair) => {
				console.log(`   - "${pair.atrLabel}" = "${pair.atrValue || '(vide)'}"`);
			});
			console.log('');

			// Mapper ligne 2 en objet (ignorer colonnes atr_label)
			const row = mapRowToObject(headers, dataLine, attributeColumnIndexes);
			dataRows = [row];

			console.log('[i] Format vertical detecte: ligne de valeurs attributs ignoree\n');
		} else {
			// Format classique: toutes les lignes sont des données
			dataRows = dataLines.map((line) => mapRowToObject(headers, line, attributeColumnIndexes));
		}

		// ========== 2. VALIDATION PREALABLE ==========
		const isValid = validateAllRows(dataRows);
		if (!isValid) {
			throw new Error('Validation CSV echouee - Import annule');
		}

		// ========== 2.5 VALIDATION ATTRIBUTS ==========
		if (attributePairs.length > 0) {
			// Charger valeurs autorisees
			const atrIds = attributePairs
				.filter((p) => attributeMap.has(p.atrLabel))
				.map((p) => attributeMap.get(p.atrLabel).atr_id);

			const allowedValuesMap = await loadAllowedValues(prisma, atrIds);

			// Valider
			const attrErrors = validateAttributeValues(attributePairs, attributeMap, allowedValuesMap);
			if (attrErrors.length > 0) {
				console.error('[X] VALIDATION ATTRIBUTS ECHOUEE\n');
				attrErrors.forEach((err) => console.error(`   ${err}`));
				throw new Error('Validation attributs echouee - Import annule');
			}

			console.log('[OK] Validation attributs reussie\n');
		}

		// ========== 3. IMPORT LIGNE PAR LIGNE (TRANSACTION ATOMIQUE) ==========
		console.log('[>] Import des donnees (transaction atomique)...\n');

		const stats = {
			suppliers: 0,
			kits: 0,
			categories: 0,
			families: 0,
			products: 0,
			productsUpdated: 0,
			prices: 0,
			categoryAttributes: 0,
			kitAttributes: 0
		};

		// Variables pour verification finale
		let lastCatId = null;
		let lastKitId = null;

		// Transaction: si une erreur survient, TOUT est annule (rollback)
		await prisma.$transaction(async (tx) => {
			for (let i = 0; i < dataRows.length; i++) {
				const row = dataRows[i];
				const lineNumber = i + 2;

				console.log(`\n[>] Ligne ${lineNumber}/${dataRows.length + 1}: ${row.pro_cenov_id}`);

				// Resolution FK: Supplier
				const supplierResult = await findOrCreateSupplier(tx, row.sup_code, row.sup_label);
				if (supplierResult.isNew) stats.suppliers++;

				// Resolution FK: Kit
				const kitResult = await findOrCreateKit(tx, row.kit_label);
				if (kitResult.isNew) stats.kits++;

				// Resolution FK: Category (nullable)
				const categoryResult = await findOrCreateCategory(tx, row.cat_label, row.cat_code);
				if (categoryResult && categoryResult.isNew) stats.categories++;

				// Resolution Hierarchie Famille (3 niveaux)
				let famille = null;
				let sous_famille = null;
				let sous_sous_famille = null;

				if (row.famille) {
					const familleResult = await findOrCreateFamily(
						tx,
						row.famille,
						null, // Pas de parent (niveau 1)
						supplierResult.entity.sup_id
					);
					if (familleResult?.isNew) stats.families++;
					famille = familleResult?.entity;

					if (row.sous_famille && familleResult?.entity) {
						const sousFamilleResult = await findOrCreateFamily(
							tx,
							row.sous_famille,
							familleResult.entity.fam_id, // Parent = famille
							supplierResult.entity.sup_id
						);
						if (sousFamilleResult?.isNew) stats.families++;
						sous_famille = sousFamilleResult?.entity;

						if (row.sous_sous_famille && sousFamilleResult?.entity) {
							const sousSousFamilleResult = await findOrCreateFamily(
								tx,
								row.sous_sous_famille,
								sousFamilleResult.entity.fam_id, // Parent = sous_famille
								supplierResult.entity.sup_id
							);
							if (sousSousFamilleResult?.isNew) stats.families++;
							sous_sous_famille = sousSousFamilleResult?.entity;
						}
					}
				}

				// Upsert Product (utilise contrainte unique sur pro_cenov_id)
				const productData = {
					pro_cenov_id: row.pro_cenov_id,
					pro_code: row.pro_code,
					fk_supplier: supplierResult.entity.sup_id,
					fk_kit: kitResult.entity.kit_id,
					fk_family: famille?.fam_id || null,
					fk_sfamily: sous_famille?.fam_id || null,
					fk_ssfamily: sous_sous_famille?.fam_id || null
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

				// ========== IMPORT ATTRIBUTS ==========
				if (attributePairs.length > 0 && categoryResult) {
					console.log('\n   [>] Import des attributs...');

					for (const { atrLabel, atrValue } of attributePairs) {
						// Skip si pas de valeur
						if (!atrValue || atrValue.trim() === '') {
							console.log(`   [i] Attribut "${atrLabel}": pas de valeur (skip)`);
							continue;
						}

						const attribute = attributeMap.get(atrLabel);
						if (!attribute) {
							console.log(`   [!] Attribut "${atrLabel}": introuvable (skip)`);
							continue;
						}

						// 1. Upsert category_attribute (template)
						const catAttrResult = await upsertCategoryAttribute(
							tx,
							categoryResult.entity.cat_id,
							attribute.atr_id,
							atrLabel
						);
						if (catAttrResult.isNew) stats.categoryAttributes++;

						// 2. Upsert kit_attribute (instance/valeur)
						const kitAttrResult = await upsertKitAttribute(
							tx,
							kitResult.entity.kit_id,
							attribute.atr_id,
							atrValue,
							atrLabel
						);
						if (kitAttrResult.isNew) stats.kitAttributes++;
					}

					// Sauvegarder IDs pour verification finale
					lastCatId = categoryResult.entity.cat_id;
					lastKitId = kitResult.entity.kit_id;
				}
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
		console.log(`   - ${stats.families} nouvelles familles`);
		console.log(`   - ${stats.products} produits crees`);
		console.log(`   - ${stats.productsUpdated} produits mis a jour`);
		console.log(`   - ${stats.prices} prix enregistres`);
		console.log(`   - ${stats.categoryAttributes} relations categorie-attribut creees`);
		console.log(`   - ${stats.kitAttributes} attributs kit crees`);
		console.log('');

		// ========== VERIFICATION FINALE ==========
		if (lastCatId && lastKitId && attributePairs.length > 0) {
			await verifyImportedAttributes(prisma, lastCatId, lastKitId, attributePairs, attributeMap);
		}

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
