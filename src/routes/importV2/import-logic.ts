import { getClient } from '$lib/prisma-meta';
import type { PrismaClient as CenovDevPrismaClient } from '../../../prisma/cenov_dev/generated/index.js';

type PrismaTransaction = Omit<
	CenovDevPrismaClient,
	'$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>;

// ============================================================================
// TYPES
// ============================================================================
export interface CSVRow {
	pro_cenov_id: string;
	pro_code: string;
	sup_code: string;
	sup_label: string;
	cat_code: string;
	cat_label: string;
	kit_label: string;
	famille?: string;
	sous_famille?: string;
	sous_sous_famille?: string;
	pp_amount: string;
	pp_discount?: string;
	pp_date: string;
}

export interface AttributePair {
	atrValueCode: string; // Code atr_value de la BDD (ex: PRESSION_LIMITE)
	atrValue: string | null; // Valeur de l'attribut (ex: 0.1)
}

export interface ProductAttributes {
	pro_cenov_id: string;
	attributes: AttributePair[];
}

export interface ParsedCSVData {
	success: boolean;
	data: CSVRow[];
	attributes: ProductAttributes[]; // Attributs par produit
	error?: string;
}

export interface ValidationError {
	line: number;
	field: string;
	value: string;
	error: string;
}

export interface ValidationResult {
	success: boolean;
	totalRows: number;
	validRows: number;
	errors: ValidationError[];
	warnings: ValidationError[];
}

export interface ImportStats {
	suppliers: number;
	kits: number;
	categories: number;
	families: number;
	products: number;
	productsUpdated: number;
	prices: number;
	categoryAttributes: number;
	kitAttributes: number;
}

export interface ChangeDetail {
	table: string;
	schema: string;
	column: string;
	oldValue: string | number | null;
	newValue: string | number | null;
	recordId: string;
}

export interface ImportResult {
	success: boolean;
	stats: ImportStats;
	changes: ChangeDetail[];
	error?: string;
}

interface AttributeMetadata {
	attributeMap: Map<string, { atr_id: number; atr_value: string }>;
	attributeUnitsMap: Map<
		number,
		{
			default_unit_id: number | null;
			units: Array<{ unit_id: number; unit_value: string; unit_label: string }>;
		}
	>;
	allowedValuesMap: Map<number, Set<string>>;
	categoryAttributesMap: Map<string, boolean>; // key: "cat_id:atr_id" → exists
	kitAttributesMap: Map<
		string,
		{ kat_id: number; kat_value: string | null; fk_attribute_unite: number | null }
	>; // key: "kit_id:atr_id"
}

// ============================================================================
// UTILITAIRES
// ============================================================================
function convertToISODate(dateStr: string): string | null {
	if (!dateStr || dateStr.trim() === '') return null;
	const trimmed = dateStr.trim();

	if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;

	const match = trimmed.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
	if (match) {
		const [, day, month, year] = match;
		return `${year}-${month}-${day}`;
	}
	return null;
}

export function parseValueAndUnit(rawValue: string): { value: string; unit: string | null } {
	if (!rawValue || typeof rawValue !== 'string') {
		return { value: rawValue, unit: null };
	}

	const regex = /^(\d+(?:\.\d+)?(?:\/\d+)?)\s*(.*)$/;
	const match = rawValue.trim().match(regex);

	if (!match) return { value: rawValue, unit: null };

	const value = match[1];
	const unit = match[2].trim() || null;
	return { value, unit };
}

export function findUnitId(
	atr_id: number,
	unit_string: string,
	attributeUnitsMap: Map<
		number,
		{
			default_unit_id: number | null;
			units: Array<{ unit_id: number; unit_value: string; unit_label: string }>;
		}
	>
): number | null {
	const unitsData = attributeUnitsMap.get(atr_id);
	if (!unitsData || !unitsData.units) return null;

	const search = unit_string.toLowerCase();

	for (const unit of unitsData.units) {
		if (unit.unit_value.toLowerCase() === search || unit.unit_label.toLowerCase() === search) {
			return unit.unit_id;
		}
	}
	return null;
}

// ============================================================================
// PARSE CSV FORMAT VERTICAL (NATIF - SANS PAPAPARSE)
// ============================================================================
function parseCSVNative(csvContent: string, delimiter: string): unknown[][] {
	const lines = csvContent.split(/\r?\n/);
	const result: unknown[][] = [];

	for (const line of lines) {
		if (line.trim() === '') continue; // Skip empty lines
		const values = line.split(delimiter);
		result.push(values);
	}

	return result;
}

export async function parseCSVContent(
	csvContent: string,
	database: 'cenov_dev' | 'cenov_preprod' = 'cenov_dev'
): Promise<ParsedCSVData> {
	try {
		const rawData = parseCSVNative(csvContent, ';');

		if (rawData.length < 2) {
			return {
				success: false,
				data: [],
				attributes: [],
				error: 'Fichier CSV invalide (moins de 2 lignes)'
			};
		}

		const headers = rawData[0] as string[];

		// Charger tous les atr_value depuis BDD pour détection
		const prisma = (await getClient(database)) as unknown as CenovDevPrismaClient;
		const attributesFromDB = await prisma.attribute.findMany({
			select: { atr_value: true },
			where: { atr_value: { not: null } }
		});
		const validAtrValues = new Set(attributesFromDB.map((a) => a.atr_value));

		const allRows: CSVRow[] = [];
		const allAttributes: ProductAttributes[] = [];

		// Boucle sur TOUTES les lignes de données (à partir de la ligne 2)
		for (let lineIndex = 1; lineIndex < rawData.length; lineIndex++) {
			const values = rawData[lineIndex] as string[];

			// Skip lignes vides (tous les champs vides)
			if (values.every((v) => !v || v.trim() === '')) {
				console.log(`⚠️ Ligne ${lineIndex + 1} vide ignorée`);
				continue;
			}

			const row: Record<string, string> = {};
			const attributes: AttributePair[] = [];

			headers.forEach((header, index) => {
				const headerTrimmed = header.trim();
				const value = values[index] ? String(values[index]).trim() : '';

				if (validAtrValues.has(headerTrimmed)) {
					// C'est un code atr_value connu en BDD
					attributes.push({
						atrValueCode: headerTrimmed,
						atrValue: value || null
					});
				} else {
					// C'est une colonne métier
					row[headerTrimmed] = value;
				}
			});

			allRows.push(row as unknown as CSVRow);
			allAttributes.push({
				pro_cenov_id: row['pro_cenov_id'] || `ligne_${lineIndex + 1}`,
				attributes
			});
		}

		console.log(`✅ ${allRows.length} produit(s) détecté(s)`);
		return { success: true, data: allRows, attributes: allAttributes };
	} catch (error) {
		return {
			success: false,
			data: [],
			attributes: [],
			error: `Erreur parsing: ${error instanceof Error ? error.message : 'Erreur inconnue'}`
		};
	}
}

// ============================================================================
// VALIDATION CSV
// ============================================================================
export async function validateCSVData(
	data: CSVRow[],
	config: {
		requiredFields: string[];
		numericFields: string[];
		dateFields: string[];
		fieldMapping: Record<string, { table: string; field: string }>;
		fieldMaxLengths: Record<string, number>;
	}
): Promise<ValidationResult> {
	const errors: ValidationError[] = [];
	const warnings: ValidationError[] = [];
	const rowValidityMap = new Map<number, boolean>(); // Track validity per line
	const seenSupplierProducts = new Map<string, number>(); // key: "sup_code:pro_code" → first line number

	// ✅ VALIDATION COHÉRENCE INTERNE CSV - PRIORITÉ 1
	const supplierLabels = new Map<string, { label: string; line: number }>(); // sup_code → { label, line }
	const categoryLabels = new Map<string, { label: string; line: number }>(); // cat_code → { label, line }

	for (let i = 0; i < data.length; i++) {
		const row = data[i];
		const lineNumber = i + 2;
		let rowValid = true;

		for (const field of config.requiredFields) {
			const value = row[field as keyof CSVRow];
			if (!value || (typeof value === 'string' && value.trim() === '')) {
				errors.push({
					line: lineNumber,
					field,
					value: value || '',
					error: 'Champ obligatoire manquant'
				});
				rowValid = false;
			}
		}

		for (const field of config.numericFields) {
			const value = row[field as keyof CSVRow];
			if (value && typeof value === 'string' && value.trim() !== '') {
				const numValue = parseFloat(value);
				if (isNaN(numValue)) {
					errors.push({ line: lineNumber, field, value, error: 'Format numérique invalide' });
					rowValid = false;
				}
				if (field === 'pp_amount' && numValue <= 0) {
					errors.push({ line: lineNumber, field, value, error: 'Le prix doit être > 0' });
					rowValid = false;
				}
				if (field === 'pp_discount') {
					if (numValue < 0 || numValue > 100) {
						errors.push({
							line: lineNumber,
							field,
							value,
							error: 'La remise doit être entre 0 et 100%'
						});
						rowValid = false;
					}
				}
			}
		}

		for (const field of config.dateFields) {
			const value = row[field as keyof CSVRow];
			if (value && typeof value === 'string' && value.trim() !== '') {
				const isoDate = convertToISODate(value);
				if (!isoDate) {
					errors.push({
						line: lineNumber,
						field,
						value,
						error: 'Format date invalide (YYYY-MM-DD ou DD/MM/YYYY)'
					});
					rowValid = false;
				} else {
					const date = new Date(isoDate);
					if (isNaN(date.getTime())) {
						errors.push({ line: lineNumber, field, value, error: 'Date invalide' });
						rowValid = false;
					} else {
						(row[field as keyof CSVRow] as string) = isoDate;
					}
				}
			}
		}

		for (const [csvField, mapping] of Object.entries(config.fieldMapping)) {
			const value = row[csvField as keyof CSVRow];
			if (value && typeof value === 'string' && value.trim() !== '') {
				const maxLength = config.fieldMaxLengths[`${mapping.table}.${mapping.field}`];
				if (maxLength && value.length > maxLength) {
					errors.push({
						line: lineNumber,
						field: csvField,
						value,
						error: `Trop long (${value.length}/${maxLength})`
					});
					rowValid = false;
				}
			}
		}

		// Validation conditionnelle hiérarchie famille
		const sousFamille = row.sous_famille;
		const sousSousFamille = row.sous_sous_famille;
		const famille = row.famille;

		if (sousSousFamille && typeof sousSousFamille === 'string' && sousSousFamille.trim() !== '') {
			// Si sous_sous_famille présent → famille ET sous_famille obligatoires
			if (!famille || (typeof famille === 'string' && famille.trim() === '')) {
				errors.push({
					line: lineNumber,
					field: 'famille',
					value: famille || '',
					error: 'Champ obligatoire si "sous_sous_famille" est renseigné'
				});
				rowValid = false;
			}
			if (!sousFamille || (typeof sousFamille === 'string' && sousFamille.trim() === '')) {
				errors.push({
					line: lineNumber,
					field: 'sous_famille',
					value: sousFamille || '',
					error: 'Champ obligatoire si "sous_sous_famille" est renseigné'
				});
				rowValid = false;
			}
		} else if (sousFamille && typeof sousFamille === 'string' && sousFamille.trim() !== '') {
			// Si sous_famille présent → famille obligatoire
			if (!famille || (typeof famille === 'string' && famille.trim() === '')) {
				errors.push({
					line: lineNumber,
					field: 'famille',
					value: famille || '',
					error: 'Champ obligatoire si "sous_famille" est renseigné'
				});
				rowValid = false;
			}
		}

		// ✅ VALIDATION : Vérifier que (sup_code, pro_code) est unique dans le CSV
		const sup_code = row.sup_code;
		const pro_code = row.pro_code;

		if (sup_code && pro_code) {
			const key = `${sup_code}:${pro_code}`;
			const firstOccurrence = seenSupplierProducts.get(key);

			if (firstOccurrence !== undefined) {
				// Doublon détecté
				errors.push({
					line: lineNumber,
					field: 'pro_code',
					value: pro_code,
					error: `Doublon : (${sup_code}, ${pro_code}) existe déjà ligne ${firstOccurrence}`
				});
				rowValid = false;
			} else {
				// Première occurrence
				seenSupplierProducts.set(key, lineNumber);
			}
		}

		// ✅ VALIDATION COHÉRENCE INTERNE CSV - Même sup_code doit avoir même sup_label
		const sup_label = row.sup_label;
		if (sup_code && sup_label) {
			const existingSupplier = supplierLabels.get(sup_code);
			if (existingSupplier) {
				// Vérifier que le label est identique
				if (existingSupplier.label !== sup_label) {
					errors.push({
						line: lineNumber,
						field: 'sup_label',
						value: sup_label,
						error: `Incohérence : fournisseur ${sup_code} a différents noms (ligne ${existingSupplier.line}: "${existingSupplier.label}", ligne ${lineNumber}: "${sup_label}")`
					});
					rowValid = false;
				}
			} else {
				// Première occurrence de ce sup_code
				supplierLabels.set(sup_code, { label: sup_label, line: lineNumber });
			}
		}

		// ✅ VALIDATION COHÉRENCE INTERNE CSV - Même cat_code doit avoir même cat_label
		const cat_code = row.cat_code;
		const cat_label = row.cat_label;
		if (cat_code && cat_label) {
			const existingCategory = categoryLabels.get(cat_code);
			if (existingCategory) {
				// Vérifier que le label est identique
				if (existingCategory.label !== cat_label) {
					errors.push({
						line: lineNumber,
						field: 'cat_label',
						value: cat_label,
						error: `Incohérence : catégorie ${cat_code} a différents noms (ligne ${existingCategory.line}: "${existingCategory.label}", ligne ${lineNumber}: "${cat_label}")`
					});
					rowValid = false;
				}
			} else {
				// Première occurrence de ce cat_code
				categoryLabels.set(cat_code, { label: cat_label, line: lineNumber });
			}
		}

		rowValidityMap.set(lineNumber, rowValid);
	}

	// Compter les lignes valides
	const validRows = Array.from(rowValidityMap.values()).filter((valid) => valid).length;

	return { success: errors.length === 0, totalRows: data.length, validRows, errors, warnings };
}

// ============================================================================
// VALIDATION ATTRIBUTS
// ============================================================================
async function loadAttributeReference(
	database: 'cenov_dev' | 'cenov_preprod' = 'cenov_dev'
): Promise<Map<string, { atr_id: number; atr_value: string }>> {
	const prisma = (await getClient(database)) as unknown as CenovDevPrismaClient;
	const attributes = await prisma.attribute.findMany({
		select: { atr_id: true, atr_value: true },
		where: { atr_value: { not: null } }
	});
	const map = new Map();
	attributes.forEach((attr) => map.set(attr.atr_value!, attr));
	return map;
}

async function loadAttributeUnitsEnriched(
	database: 'cenov_dev' | 'cenov_preprod' = 'cenov_dev'
): Promise<
	Map<
		number,
		{
			default_unit_id: number | null;
			units: Array<{ unit_id: number; unit_value: string; unit_label: string }>;
		}
	>
> {
	const prisma = (await getClient(database)) as unknown as CenovDevPrismaClient;
	const attributeUnits = await prisma.attribute_unit.findMany({
		include: {
			attribute_attribute_unit_fk_unitToattribute: {
				select: { atr_id: true, atr_value: true, atr_label: true }
			}
		},
		orderBy: [{ fk_attribute: 'asc' }, { is_default: 'desc' }]
	});

	const map = new Map();
	for (const au of attributeUnits) {
		const atr_id = au.fk_attribute;
		const unit = au.attribute_attribute_unit_fk_unitToattribute;

		if (!map.has(atr_id)) {
			map.set(atr_id, { default_unit_id: null, units: [] });
		}

		const entry = map.get(atr_id)!;
		if (au.is_default && entry.default_unit_id === null) {
			entry.default_unit_id = au.fk_unit;
		}

		entry.units.push({
			unit_id: au.fk_unit,
			unit_value: unit.atr_value || '',
			unit_label: unit.atr_label
		});
	}
	return map;
}

async function loadAllowedValues(
	atrIds: number[],
	database: 'cenov_dev' | 'cenov_preprod' = 'cenov_dev'
): Promise<Map<number, Set<string>>> {
	if (atrIds.length === 0) return new Map();

	const prisma = (await getClient(database)) as unknown as CenovDevPrismaClient;
	const attributeValues = await prisma.attribute_value.findMany({
		where: { av_atr_id: { in: atrIds } },
		select: { av_atr_id: true, av_value_label: true }
	});

	const allowedValuesMap = new Map();
	for (const av of attributeValues) {
		if (!allowedValuesMap.has(av.av_atr_id)) {
			allowedValuesMap.set(av.av_atr_id, new Set());
		}
		if (av.av_value_label) {
			allowedValuesMap.get(av.av_atr_id)!.add(av.av_value_label);
		}
	}
	return allowedValuesMap;
}

// ============================================================================
// VALIDATION ATTRIBUTS OBLIGATOIRES - PRIORITÉ 2
// ============================================================================

/**
 * Charge les métadonnées des catégories et détecte les doublons
 */
async function loadCategoriesMetadata(
	catCodes: string[],
	database: 'cenov_dev' | 'cenov_preprod' = 'cenov_dev'
): Promise<{
	categoriesMap: Map<string, { cat_id: number; cat_label: string }>;
	duplicates: Array<{ cat_code: string; labels: string[] }>;
}> {
	const prisma = (await getClient(database)) as unknown as CenovDevPrismaClient;

	const categories = await prisma.category.findMany({
		where: {
			cat_code: { in: catCodes },
			fk_parent: null // Catégories racines uniquement
		},
		select: { cat_id: true, cat_code: true, cat_label: true }
	});

	const categoriesMap = new Map<string, { cat_id: number; cat_label: string }>();
	const duplicates: Array<{ cat_code: string; labels: string[] }> = [];

	// Grouper par cat_code pour détecter doublons
	const grouped = new Map<string, Array<{ cat_id: number; cat_label: string }>>();
	for (const cat of categories) {
		if (!grouped.has(cat.cat_code!)) {
			grouped.set(cat.cat_code!, []);
		}
		grouped.get(cat.cat_code!)!.push({ cat_id: cat.cat_id, cat_label: cat.cat_label });
	}

	// Détecter doublons et remplir la map
	for (const [code, cats] of grouped.entries()) {
		if (cats.length > 1) {
			// Doublon détecté
			duplicates.push({
				cat_code: code,
				labels: cats.map((c) => c.cat_label)
			});
		} else {
			// Une seule catégorie
			categoriesMap.set(code, cats[0]);
		}
	}

	return { categoriesMap, duplicates };
}

/**
 * Charge les attributs obligatoires pour plusieurs catégories
 */
async function loadRequiredAttributesByCategory(
	categoryIds: number[],
	database: 'cenov_dev' | 'cenov_preprod' = 'cenov_dev'
): Promise<Map<number, Array<{ code: string; label: string }>>> {
	if (categoryIds.length === 0) return new Map();

	const prisma = (await getClient(database)) as unknown as CenovDevPrismaClient;

	const requiredAttrs = await prisma.category_attribute.findMany({
		where: {
			fk_category: { in: categoryIds },
			cat_atr_required: true
		},
		include: {
			attribute: {
				select: { atr_value: true, atr_label: true }
			}
		}
	});

	const map = new Map<number, Array<{ code: string; label: string }>>();
	for (const attr of requiredAttrs) {
		if (!map.has(attr.fk_category)) {
			map.set(attr.fk_category, []);
		}
		map.get(attr.fk_category)!.push({
			code: attr.attribute.atr_value!,
			label: attr.attribute.atr_label
		});
	}

	return map;
}

/**
 * Valide que tous les attributs obligatoires sont présents pour chaque produit
 */
export async function validateRequiredAttributes(
	data: CSVRow[],
	attributesByProduct: ProductAttributes[],
	database: 'cenov_dev' | 'cenov_preprod' = 'cenov_dev'
): Promise<ValidationResult> {
	const errors: ValidationError[] = [];
	const warnings: ValidationError[] = [];

	// 1. Collecter tous les cat_code uniques
	const uniqueCatCodes = Array.from(new Set(data.map((row) => row.cat_code).filter((c) => c)));

	if (uniqueCatCodes.length === 0) {
		return { success: true, totalRows: data.length, validRows: data.length, errors, warnings };
	}

	// 2. Charger métadonnées catégories + détecter doublons
	const { categoriesMap, duplicates } = await loadCategoriesMetadata(uniqueCatCodes, database);

	// 3. ERREUR BLOQUANTE si doublons cat_code
	if (duplicates.length > 0) {
		for (const dup of duplicates) {
			errors.push({
				line: 0, // Erreur globale BDD
				field: 'cat_code',
				value: dup.cat_code,
				error: `ERREUR BDD: ${dup.labels.length} catégories racines avec le code ${dup.cat_code}. Labels: ${dup.labels.join(', ')}. Corrigez la base de données avant import.`
			});
		}
		return { success: false, totalRows: data.length, validRows: 0, errors, warnings };
	}

	// 4. Charger attributs obligatoires pour toutes les catégories trouvées
	const categoryIds = Array.from(categoriesMap.values()).map((c) => c.cat_id);
	const requiredAttrsByCategory = await loadRequiredAttributesByCategory(categoryIds, database);

	// 5. Détecter attributs du CSV pour les catégories inconnues (pour auto-liaison)
	const unknownCategoryAttrs = new Map<string, Set<string>>(); // cat_code → Set<atr_value>

	// 6. Valider chaque produit
	for (let i = 0; i < data.length; i++) {
		const row = data[i];
		const lineNumber = i + 2;
		const productAttrs = attributesByProduct.find((a) => a.pro_cenov_id === row.pro_cenov_id);

		if (!productAttrs) continue;

		const category = categoriesMap.get(row.cat_code);

		// CAS 1: Catégorie inconnue
		if (!category) {
			warnings.push({
				line: lineNumber,
				field: 'cat_code',
				value: row.cat_code,
				error: `Catégorie "${row.cat_code}" inconnue en BDD. Elle sera créée automatiquement lors de l'import avec ${productAttrs.attributes.length} attribut(s) (tous optionnels).`
			});

			// Stocker attributs pour auto-liaison lors de l'import
			if (!unknownCategoryAttrs.has(row.cat_code)) {
				unknownCategoryAttrs.set(row.cat_code, new Set());
			}
			for (const attr of productAttrs.attributes) {
				unknownCategoryAttrs.get(row.cat_code)!.add(attr.atrValueCode);
			}

			continue; // Pas de validation attributs obligatoires
		}

		// CAS 2: Catégorie connue - vérifier attributs obligatoires
		const requiredAttrs = requiredAttrsByCategory.get(category.cat_id) || [];

		if (requiredAttrs.length === 0) {
			// Aucun attribut obligatoire
			continue;
		}

		// Vérifier présence de tous les attributs obligatoires
		const csvAttrCodes = productAttrs.attributes.map((a) => a.atrValueCode);
		const missingAttrs = requiredAttrs.filter((req) => !csvAttrCodes.includes(req.code));

		if (missingAttrs.length > 0) {
			errors.push({
				line: lineNumber,
				field: 'attributs_obligatoires',
				value: row.cat_code,
				error: `Catégorie "${category.cat_label}" (${row.cat_code}) requiert ${missingAttrs.length} attribut(s) manquant(s): ${missingAttrs.map((m) => m.label).join(', ')}`
			});
		}
	}

	const validRows = data.length - errors.length;

	return {
		success: errors.length === 0,
		totalRows: data.length,
		validRows,
		errors,
		warnings
	};
}

export async function validateAttributes(
	attributes: AttributePair[],
	database: 'cenov_dev' | 'cenov_preprod' = 'cenov_dev'
): Promise<ValidationResult> {
	const errors: ValidationError[] = [];
	const warnings: ValidationError[] = [];

	const attributeMap = await loadAttributeReference(database);
	const attributeUnitsMap = await loadAttributeUnitsEnriched(database);

	const attributeIds = attributes
		.filter((a) => a.atrValue && attributeMap.has(a.atrValueCode))
		.map((a) => attributeMap.get(a.atrValueCode)!.atr_id);

	const allowedValuesMap = await loadAllowedValues(attributeIds, database);

	for (let i = 0; i < attributes.length; i++) {
		const { atrValueCode, atrValue } = attributes[i];
		if (!atrValue || atrValue.trim() === '') continue;

		const attribute = attributeMap.get(atrValueCode);
		if (!attribute) {
			errors.push({
				line: i + 1,
				field: atrValueCode,
				value: atrValue,
				error: 'Code attribut inconnu'
			});
			continue;
		}

		const allowedValues = allowedValuesMap.get(attribute.atr_id);

		if (allowedValues && allowedValues.size > 0) {
			if (!allowedValues.has(atrValue)) {
				const allowedList = Array.from(allowedValues).join(', ');
				errors.push({
					line: i + 1,
					field: atrValueCode,
					value: atrValue,
					error: `Valeur non autorisée. Acceptées: ${allowedList}`
				});
			}
		} else {
			const { unit } = parseValueAndUnit(atrValue);
			if (unit) {
				const unitsData = attributeUnitsMap.get(attribute.atr_id);
				if (unitsData && unitsData.units.length > 0) {
					const unitId = findUnitId(attribute.atr_id, unit, attributeUnitsMap);
					if (!unitId) {
						const allowedUnits = unitsData.units.map((u) => u.unit_value).join(', ');
						errors.push({
							line: i + 1,
							field: atrValueCode,
							value: atrValue,
							error: `Unité "${unit}" invalide. Acceptées: ${allowedUnits}`
						});
					}
				}
			}
		}
	}

	return {
		success: errors.length === 0,
		totalRows: attributes.length,
		validRows: attributes.length - errors.length,
		errors,
		warnings
	};
}

// ============================================================================
// IMPORT BDD
// ============================================================================
export async function importToDatabase(
	data: CSVRow[],
	attributesByProduct: ProductAttributes[],
	database: 'cenov_dev' | 'cenov_preprod' = 'cenov_dev'
): Promise<ImportResult> {
	const stats: ImportStats = {
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
	const changes: ChangeDetail[] = [];

	try {
		const prisma = (await getClient(database)) as unknown as CenovDevPrismaClient;

		// ✅ Charger TOUTES les métadonnées AVANT la transaction (évite timeout)
		console.log('🔄 Chargement métadonnées attributs...');
		const metadata: AttributeMetadata = {
			attributeMap: await loadAttributeReference(database),
			attributeUnitsMap: await loadAttributeUnitsEnriched(database),
			allowedValuesMap: new Map<number, Set<string>>(), // Sera rempli dynamiquement
			categoryAttributesMap: new Map<string, boolean>(),
			kitAttributesMap: new Map<
				string,
				{ kat_id: number; kat_value: string | null; fk_attribute_unite: number | null }
			>()
		};

		// Collecter tous les cat_id, kit_id et atr_id uniques du CSV
		const uniqueCatCodes = new Set<string>();
		const uniqueKitLabels = new Set<string>();
		const allAtrIds = new Set<number>();

		for (const row of data) {
			if (row.cat_code) uniqueCatCodes.add(row.cat_code);
			if (row.kit_label) uniqueKitLabels.add(row.kit_label);
		}

		for (const productAttrs of attributesByProduct) {
			for (const attr of productAttrs.attributes) {
				const atrData = metadata.attributeMap.get(attr.atrValueCode);
				if (atrData) allAtrIds.add(atrData.atr_id);
			}
		}

		// Charger valeurs autorisées pour tous les attributs
		if (allAtrIds.size > 0) {
			metadata.allowedValuesMap = await loadAllowedValues(Array.from(allAtrIds), database);
		}

		// ✅ OPTIMISATION : Précharger category_attribute et kit_attribute (évite 2000+ requêtes en boucle)
		console.log('🔄 Préchargement category_attribute et kit_attribute...');

		// Récupérer les cat_id depuis les cat_code
		const categories = await prisma.category.findMany({
			where: { fk_parent: null, cat_code: { in: Array.from(uniqueCatCodes) } },
			select: { cat_id: true, cat_code: true }
		});
		const catIdsByCatCode = new Map(categories.map((c) => [c.cat_code!, c.cat_id]));
		const uniqueCatIds = Array.from(catIdsByCatCode.values());

		// Récupérer les kit_id depuis les kit_label
		const kits = await prisma.kit.findMany({
			where: { kit_label: { in: Array.from(uniqueKitLabels) } },
			select: { kit_id: true, kit_label: true }
		});
		const kitIdsByKitLabel = new Map(kits.map((k) => [k.kit_label, k.kit_id]));
		const uniqueKitIds = Array.from(kitIdsByKitLabel.values());

		// Précharger TOUS les category_attribute
		const categoryAttributes = await prisma.category_attribute.findMany({
			where: { fk_category: { in: uniqueCatIds } }
		});
		for (const ca of categoryAttributes) {
			const key = `${ca.fk_category}:${ca.fk_attribute}`;
			metadata.categoryAttributesMap.set(key, true);
		}

		// Précharger TOUS les kit_attribute
		const kitAttributes = await prisma.kit_attribute.findMany({
			where: { fk_kit: { in: uniqueKitIds } }
		});
		for (const ka of kitAttributes) {
			const key = `${ka.fk_kit}:${ka.fk_attribute_characteristic}`;
			metadata.kitAttributesMap.set(key, {
				kat_id: ka.kat_id,
				kat_value: ka.kat_value,
				fk_attribute_unite: ka.fk_attribute_unite
			});
		}

		console.log(
			`✅ Métadonnées chargées: ${metadata.attributeMap.size} attributs, ${categoryAttributes.length} category_attribute, ${kitAttributes.length} kit_attribute`
		);

		await prisma.$transaction(async (tx) => {
			for (const row of data) {
				const supplierResult = await findOrCreateSupplier(tx, row.sup_code, row.sup_label, changes);
				if (supplierResult.isNew) stats.suppliers++;

				const kitResult = await findOrCreateKit(tx, row.kit_label, changes);
				if (kitResult.isNew) stats.kits++;

				// cat_code et cat_label sont obligatoires (validés avant l'import)
				const categoryResult = await findOrCreateCategory(tx, row.cat_code, row.cat_label, changes);
				if (categoryResult.isNew) stats.categories++;

				// ✅ AUTO-LIAISON: Si nouvelle catégorie, lier les attributs du CSV (tous optionnels)
				if (categoryResult.isNew) {
					const productAttrsForCategory = attributesByProduct.find(
						(a) => a.pro_cenov_id === row.pro_cenov_id
					);
					if (productAttrsForCategory) {
						const attributeCodes = productAttrsForCategory.attributes.map((a) => a.atrValueCode);
						await autoLinkCategoryAttributes(
							tx,
							categoryResult.entity.cat_id,
							row.cat_code,
							attributeCodes,
							changes,
							metadata
						);
					}
				}

				const familyIds = await resolveFamilyHierarchy(
					tx,
					row,
					supplierResult.entity.sup_id,
					stats,
					changes
				);

				const productResult = await upsertProduct(
					tx,
					row,
					supplierResult.entity.sup_id,
					kitResult.entity.kit_id,
					familyIds,
					categoryResult,
					changes
				);
				if (productResult.isNew) stats.products++;
				else stats.productsUpdated++;

				await upsertPricePurchase(tx, productResult.entity.pro_id, row, changes);
				stats.prices++;

				// Récupérer les attributs de CE produit
				const productAttrs = attributesByProduct.find((a) => a.pro_cenov_id === row.pro_cenov_id);

				if (categoryResult && productAttrs && productAttrs.attributes.length > 0) {
					const attrStats = await importAttributes(
						tx,
						categoryResult.entity.cat_id,
						kitResult.entity.kit_id,
						row.kit_label, // ✅ Passer kit_label pour éviter requête
						productAttrs.attributes,
						changes,
						metadata // ✅ Passer les métadonnées préchargées
					);
					stats.categoryAttributes += attrStats.categoryAttributes;
					stats.kitAttributes += attrStats.kitAttributes;
				}
			}
		});

		return { success: true, stats, changes };
	} catch (error) {
		return {
			success: false,
			stats,
			changes,
			error: error instanceof Error ? error.message : 'Erreur inconnue'
		};
	}
}

async function findOrCreateSupplier(
	tx: PrismaTransaction,
	sup_code: string,
	sup_label: string,
	changes: ChangeDetail[]
) {
	const existing = await tx.supplier.findUnique({ where: { sup_code } });
	const supplier = await tx.supplier.upsert({
		where: { sup_code },
		create: { sup_code, sup_label },
		update: { sup_label }
	});

	if (!existing) {
		changes.push({
			table: 'supplier',
			schema: 'public',
			column: 'sup_code',
			oldValue: null,
			newValue: sup_code,
			recordId: sup_code
		});
		changes.push({
			table: 'supplier',
			schema: 'public',
			column: 'sup_label',
			oldValue: null,
			newValue: sup_label,
			recordId: sup_code
		});
		console.log(`📦 Fournisseur créé: ${sup_label} (${sup_code})`);
	} else if (existing.sup_label !== sup_label) {
		changes.push({
			table: 'supplier',
			schema: 'public',
			column: 'sup_label',
			oldValue: existing.sup_label,
			newValue: sup_label,
			recordId: sup_code
		});
		console.log(
			`🔄 Fournisseur mis à jour: ${sup_code} - "${existing.sup_label}" → "${sup_label}"`
		);
	}

	return { entity: supplier, isNew: !existing };
}

async function findOrCreateKit(tx: PrismaTransaction, kit_label: string, changes: ChangeDetail[]) {
	const existing = await tx.kit.findUnique({ where: { kit_label } });
	const kit = await tx.kit.upsert({
		where: { kit_label },
		create: { kit_label },
		update: { kit_label }
	});

	if (!existing) {
		changes.push({
			table: 'kit',
			schema: 'public',
			column: 'kit_label',
			oldValue: null,
			newValue: kit_label,
			recordId: kit_label
		});
		console.log(`📦 Kit créé: ${kit_label}`);
	}

	return { entity: kit, isNew: !existing };
}

async function findOrCreateCategory(
	tx: PrismaTransaction,
	cat_code: string,
	cat_label: string,
	changes: ChangeDetail[]
) {
	// Note: CSV importe uniquement des catégories racine (fk_parent = null)
	// Recherche par cat_code (les catégories racine ont fk_parent = null)
	const existing = await tx.category.findFirst({
		where: { fk_parent: null, cat_code }
	});

	let category;

	if (!existing) {
		// CREATE - Nouvelle catégorie
		category = await tx.category.create({
			data: { fk_parent: null, cat_code, cat_label }
		});

		changes.push({
			table: 'category',
			schema: 'produit',
			column: 'cat_code',
			oldValue: null,
			newValue: cat_code,
			recordId: cat_code
		});
		changes.push({
			table: 'category',
			schema: 'produit',
			column: 'cat_label',
			oldValue: null,
			newValue: cat_label,
			recordId: cat_code
		});
		console.log(`📦 Catégorie créée: ${cat_label} (${cat_code})`);
	} else {
		// UPDATE - Catégorie existe
		if (existing.cat_label !== cat_label) {
			category = await tx.category.update({
				where: { cat_id: existing.cat_id },
				data: { cat_label }
			});

			changes.push({
				table: 'category',
				schema: 'produit',
				column: 'cat_label',
				oldValue: existing.cat_label,
				newValue: cat_label,
				recordId: cat_code
			});
			console.log(
				`🔄 Catégorie mise à jour: ${cat_code} - "${existing.cat_label}" → "${cat_label}"`
			);
		} else {
			category = existing;
		}
	}

	return { entity: category, isNew: !existing };
}

/**
 * Auto-lie les attributs du CSV à une nouvelle catégorie (tous optionnels)
 */
async function autoLinkCategoryAttributes(
	tx: PrismaTransaction,
	cat_id: number,
	cat_code: string,
	attributeCodes: string[],
	changes: ChangeDetail[],
	metadata: AttributeMetadata
): Promise<number> {
	if (attributeCodes.length === 0) return 0;

	let linkedCount = 0;

	// Récupérer les atr_id pour les codes fournis
	const attributes = await tx.attribute.findMany({
		where: { atr_value: { in: attributeCodes } },
		select: { atr_id: true, atr_value: true }
	});

	const attributeMap = new Map(attributes.map((a) => [a.atr_value!, a.atr_id]));

	for (const code of attributeCodes) {
		const atr_id = attributeMap.get(code);
		if (!atr_id) {
			console.log(`⚠️ Attribut ${code} introuvable, ignoré pour auto-liaison`);
			continue;
		}

		// ✅ Vérifier dans le cache d'abord
		const catAttrKey = `${cat_id}:${atr_id}`;
		const existingInCache = metadata.categoryAttributesMap.has(catAttrKey);

		if (!existingInCache) {
			await tx.category_attribute.create({
				data: {
					fk_category: cat_id,
					fk_attribute: atr_id,
					cat_atr_required: false // Tous optionnels par défaut
				}
			});

			// ✅ Mettre à jour le cache pour éviter duplicatas
			metadata.categoryAttributesMap.set(catAttrKey, true);

			changes.push({
				table: 'category_attribute',
				schema: 'produit',
				column: 'fk_attribute',
				oldValue: null,
				newValue: atr_id,
				recordId: `${cat_code} → ${code} (optionnel)`
			});

			linkedCount++;
		}
	}

	if (linkedCount > 0) {
		console.log(`📎 Auto-liaison: ${linkedCount} attribut(s) lié(s) à la catégorie ${cat_code}`);
	}

	return linkedCount;
}

async function resolveFamilyHierarchy(
	tx: PrismaTransaction,
	row: CSVRow,
	fk_supplier: number,
	stats: ImportStats,
	changes: ChangeDetail[]
) {
	let fam_id = null,
		sfam_id = null,
		ssfam_id = null;

	if (row.famille) {
		const famille = await findOrCreateFamily(tx, row.famille, null, fk_supplier, changes);
		if (famille.isNew) stats.families++;
		fam_id = famille.entity.fam_id;

		if (row.sous_famille) {
			const sousFamille = await findOrCreateFamily(
				tx,
				row.sous_famille,
				fam_id,
				fk_supplier,
				changes
			);
			if (sousFamille.isNew) stats.families++;
			sfam_id = sousFamille.entity.fam_id;

			if (row.sous_sous_famille) {
				const sousSousFamille = await findOrCreateFamily(
					tx,
					row.sous_sous_famille,
					sfam_id,
					fk_supplier,
					changes
				);
				if (sousSousFamille.isNew) stats.families++;
				ssfam_id = sousSousFamille.entity.fam_id;
			}
		}
	}
	return { fam_id, sfam_id, ssfam_id };
}

async function findOrCreateFamily(
	tx: PrismaTransaction,
	fam_label: string,
	fk_parent: number | null,
	fk_supplier: number,
	changes: ChangeDetail[]
) {
	const whereClause = { fam_label, fk_parent: fk_parent || null, fk_supplier };
	let family = await tx.family.findFirst({ where: whereClause });
	const isNew = !family;

	if (!family) {
		if (fk_parent !== null) {
			family = await tx.family.upsert({
				where: { fam_label_fk_parent_fk_supplier: { fam_label, fk_parent, fk_supplier } },
				create: { fam_label, fk_parent, fk_supplier, fk_category: null },
				update: {}
			});
		} else {
			family = await tx.family.create({
				data: { fam_label, fk_parent: null, fk_supplier, fk_category: null }
			});
		}

		const level = fk_parent ? '(sous-famille)' : '(famille)';
		changes.push({
			table: 'family',
			schema: 'produit',
			column: 'fam_label',
			oldValue: null,
			newValue: fam_label,
			recordId: `${fam_label} ${level}`
		});

		console.log(`📦 Famille créée: ${fam_label} ${level}`);
	}

	return { entity: family, isNew };
}

async function upsertProduct(
	tx: PrismaTransaction,
	row: CSVRow,
	fk_supplier: number,
	fk_kit: number,
	familyIds: { fam_id: number | null; sfam_id: number | null; ssfam_id: number | null },
	categoryResult: { entity: { cat_id: number }; isNew: boolean } | null,
	changes: ChangeDetail[]
) {
	const existing = await tx.product.findUnique({ where: { pro_cenov_id: row.pro_cenov_id } });

	const productData = {
		pro_cenov_id: row.pro_cenov_id,
		pro_code: row.pro_code,
		sup_code: row.sup_code,
		sup_label: row.sup_label,
		cat_code: row.cat_code,
		fk_supplier,
		fk_kit,
		fk_family: familyIds.fam_id,
		fk_sfamily: familyIds.sfam_id,
		fk_ssfamily: familyIds.ssfam_id
	};

	const product = await tx.product.upsert({
		where: { pro_cenov_id: row.pro_cenov_id },
		create: productData,
		update: productData
	});

	// Capturer les changements si produit existant
	if (existing) {
		const fieldMap = [
			{ key: 'pro_code', label: 'pro_code' },
			{ key: 'sup_code', label: 'sup_code' },
			{ key: 'sup_label', label: 'sup_label' },
			{ key: 'cat_code', label: 'cat_code' },
			{ key: 'fk_supplier', label: 'fk_supplier' },
			{ key: 'fk_kit', label: 'fk_kit' },
			{ key: 'fk_family', label: 'fk_family' },
			{ key: 'fk_sfamily', label: 'fk_sfamily' },
			{ key: 'fk_ssfamily', label: 'fk_ssfamily' }
		];

		for (const { key, label } of fieldMap) {
			const oldValue = existing[key as keyof typeof existing];
			const newValue = productData[key as keyof typeof productData];

			if (oldValue !== newValue) {
				changes.push({
					table: 'product',
					schema: 'produit',
					column: label,
					oldValue: oldValue as string | number | null,
					newValue: newValue as string | number | null,
					recordId: row.pro_cenov_id
				});
			}
		}
		console.log(`🔄 Produit mis à jour: ${row.pro_cenov_id} (${row.pro_code})`);
	} else {
		// Tracker la création du produit avec tous ses champs
		changes.push({
			table: 'product',
			schema: 'produit',
			column: 'pro_cenov_id',
			oldValue: null,
			newValue: row.pro_cenov_id,
			recordId: row.pro_cenov_id
		});
		changes.push({
			table: 'product',
			schema: 'produit',
			column: 'pro_code',
			oldValue: null,
			newValue: row.pro_code,
			recordId: row.pro_cenov_id
		});
		changes.push({
			table: 'product',
			schema: 'produit',
			column: 'sup_code',
			oldValue: null,
			newValue: row.sup_code,
			recordId: row.pro_cenov_id
		});
		changes.push({
			table: 'product',
			schema: 'produit',
			column: 'sup_label',
			oldValue: null,
			newValue: row.sup_label,
			recordId: row.pro_cenov_id
		});
		changes.push({
			table: 'product',
			schema: 'produit',
			column: 'cat_code',
			oldValue: null,
			newValue: row.cat_code,
			recordId: row.pro_cenov_id
		});
		console.log(`✅ Produit créé: ${row.pro_cenov_id} (${row.pro_code})`);
	}

	if (categoryResult) {
		const existingProductCategory = await tx.product_category.findUnique({
			where: {
				fk_product_fk_category: {
					fk_product: product.pro_id,
					fk_category: categoryResult.entity.cat_id
				}
			}
		});

		await tx.product_category.upsert({
			where: {
				fk_product_fk_category: {
					fk_product: product.pro_id,
					fk_category: categoryResult.entity.cat_id
				}
			},
			create: { fk_product: product.pro_id, fk_category: categoryResult.entity.cat_id },
			update: {}
		});

		if (!existingProductCategory) {
			changes.push({
				table: 'product_category',
				schema: 'produit',
				column: 'fk_category',
				oldValue: null,
				newValue: categoryResult.entity.cat_id,
				recordId: `${row.pro_cenov_id} → cat_id:${categoryResult.entity.cat_id}`
			});
		}
	}

	return { entity: product, isNew: !existing };
}

async function upsertPricePurchase(
	tx: PrismaTransaction,
	fk_product: number,
	row: CSVRow,
	changes: ChangeDetail[]
) {
	const pp_discount =
		row.pp_discount && row.pp_discount.trim() !== '' ? parseFloat(row.pp_discount) : null;
	const pp_date = new Date(row.pp_date);
	const pp_amount = parseFloat(row.pp_amount);

	// Vérifier si un prix existe déjà
	const existing = await tx.price_purchase.findUnique({
		where: { fk_product_pp_date: { fk_product, pp_date } }
	});

	await tx.price_purchase.upsert({
		where: { fk_product_pp_date: { fk_product, pp_date } },
		create: {
			fk_product,
			pp_date,
			pp_amount,
			pp_discount,
			pro_cenov_id: row.pro_cenov_id
		},
		update: {
			pp_amount,
			pp_discount
		}
	});

	// Capturer les changements (création ou modification)
	if (existing) {
		// Modification : comparer anciennes vs nouvelles valeurs
		if (existing.pp_amount.toNumber() !== pp_amount) {
			changes.push({
				table: 'price_purchase',
				schema: 'produit',
				column: 'pp_amount',
				oldValue: existing.pp_amount.toNumber(),
				newValue: pp_amount,
				recordId: `${row.pro_cenov_id} (${row.pp_date})`
			});
		}

		const oldDiscount = existing.pp_discount ? existing.pp_discount.toNumber() : null;
		if (oldDiscount !== pp_discount) {
			changes.push({
				table: 'price_purchase',
				schema: 'produit',
				column: 'pp_discount',
				oldValue: oldDiscount,
				newValue: pp_discount,
				recordId: `${row.pro_cenov_id} (${row.pp_date})`
			});
		}
	} else {
		// Création : tracker le nouveau prix
		changes.push({
			table: 'price_purchase',
			schema: 'produit',
			column: 'pp_amount',
			oldValue: null,
			newValue: pp_amount,
			recordId: `${row.pro_cenov_id} (${row.pp_date})`
		});
		if (pp_discount !== null) {
			changes.push({
				table: 'price_purchase',
				schema: 'produit',
				column: 'pp_discount',
				oldValue: null,
				newValue: pp_discount,
				recordId: `${row.pro_cenov_id} (${row.pp_date})`
			});
		}
	}

	const pp_net = pp_discount ? pp_amount * (1 - pp_discount / 100) : pp_amount;
	const discountStr = pp_discount ? ` (remise ${pp_discount}% = ${pp_net.toFixed(2)}€ net)` : '';
	console.log(`💰 Prix enregistré: ${pp_amount}€${discountStr} - Date: ${row.pp_date}`);
}

async function importAttributes(
	tx: PrismaTransaction,
	cat_id: number,
	kit_id: number,
	kit_label: string, // ✅ Reçu en paramètre au lieu de requête
	attributes: AttributePair[],
	changes: ChangeDetail[],
	metadata: AttributeMetadata // ✅ Métadonnées préchargées
) {
	let categoryAttributes = 0,
		kitAttributes = 0;

	// ✅ Utiliser les métadonnées préchargées (pas de requêtes BDD)
	const {
		attributeMap,
		attributeUnitsMap,
		allowedValuesMap,
		categoryAttributesMap,
		kitAttributesMap
	} = metadata;

	for (const { atrValueCode, atrValue } of attributes) {
		if (!atrValue || atrValue.trim() === '') continue;

		const attribute = attributeMap.get(atrValueCode);
		if (!attribute) continue;

		// ✅ OPTIMISATION : Vérifier existence dans map préchargée (au lieu de findFirst)
		const catAttrKey = `${cat_id}:${attribute.atr_id}`;
		const existingCatAttr = categoryAttributesMap.has(catAttrKey);

		if (!existingCatAttr) {
			await tx.category_attribute.create({
				data: { fk_category: cat_id, fk_attribute: attribute.atr_id, cat_atr_required: false }
			});
			categoryAttributes++;

			// ✅ Ajouter à la map pour éviter duplicatas dans la même transaction
			categoryAttributesMap.set(catAttrKey, true);

			changes.push({
				table: 'category_attribute',
				schema: 'produit',
				column: 'fk_attribute',
				oldValue: null,
				newValue: attribute.atr_id,
				recordId: `cat_id:${cat_id} → ${atrValueCode}`
			});
		}

		const allowedValues = allowedValuesMap.get(attribute.atr_id);
		let finalValue = atrValue;
		let finalUnitId = null;

		if (!allowedValues || allowedValues.size === 0) {
			const { value, unit } = parseValueAndUnit(atrValue);
			finalValue = value;

			if (unit) {
				finalUnitId = findUnitId(attribute.atr_id, unit, attributeUnitsMap);
			} else {
				const unitsData = attributeUnitsMap.get(attribute.atr_id);
				if (unitsData && unitsData.default_unit_id) {
					finalUnitId = unitsData.default_unit_id;
				}
			}
		}

		// ✅ OPTIMISATION : Vérifier existence dans map préchargée (au lieu de findFirst)
		const kitAttrKey = `${kit_id}:${attribute.atr_id}`;
		const existingKitAttr = kitAttributesMap.get(kitAttrKey);

		if (existingKitAttr) {
			// Capturer les changements de valeur
			if (existingKitAttr.kat_value !== finalValue) {
				changes.push({
					table: 'kit_attribute',
					schema: 'public',
					column: 'kat_value',
					oldValue: existingKitAttr.kat_value,
					newValue: finalValue,
					recordId: `${kit_label} - ${atrValueCode}`
				});
			}

			// Capturer les changements d'unité
			if (existingKitAttr.fk_attribute_unite !== finalUnitId) {
				changes.push({
					table: 'kit_attribute',
					schema: 'public',
					column: 'fk_attribute_unite',
					oldValue: existingKitAttr.fk_attribute_unite,
					newValue: finalUnitId,
					recordId: `${kit_label} - ${atrValueCode}`
				});
			}

			await tx.kit_attribute.update({
				where: { kat_id: existingKitAttr.kat_id },
				data: { kat_value: finalValue, fk_attribute_unite: finalUnitId }
			});

			// ✅ Mettre à jour la map avec les nouvelles valeurs
			kitAttributesMap.set(kitAttrKey, {
				kat_id: existingKitAttr.kat_id,
				kat_value: finalValue,
				fk_attribute_unite: finalUnitId
			});
		} else {
			const created = await tx.kit_attribute.create({
				data: {
					fk_kit: kit_id,
					fk_attribute_characteristic: attribute.atr_id,
					fk_attribute_unite: finalUnitId,
					kat_value: finalValue
				}
			});

			// ✅ Ajouter à la map pour éviter duplicatas dans la même transaction
			kitAttributesMap.set(kitAttrKey, {
				kat_id: created.kat_id,
				kat_value: finalValue,
				fk_attribute_unite: finalUnitId
			});

			// Tracker la création du kit_attribute
			changes.push({
				table: 'kit_attribute',
				schema: 'public',
				column: 'kat_value',
				oldValue: null,
				newValue: finalValue,
				recordId: `${kit_label} - ${atrValueCode}`
			});
			if (finalUnitId !== null) {
				changes.push({
					table: 'kit_attribute',
					schema: 'public',
					column: 'fk_attribute_unite',
					oldValue: null,
					newValue: finalUnitId,
					recordId: `${kit_label} - ${atrValueCode}`
				});
			}

			kitAttributes++;
		}
	}

	if (categoryAttributes > 0 || kitAttributes > 0) {
		console.log(`📊 Attributs importés: ${kitAttributes} attributs kit`);
	}

	return { categoryAttributes, kitAttributes };
}
