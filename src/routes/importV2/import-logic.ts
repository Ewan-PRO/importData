import Papa from 'papaparse';
import { PrismaClient as CenovDevPrismaClient } from '../../../prisma/cenov_dev/generated/index.js';

type PrismaTransaction = Omit<CenovDevPrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>;

// ============================================================================
// TYPES
// ============================================================================
export interface CSVRow {
	pro_cenov_id: string;
	pro_code: string;
	sup_code: string;
	sup_label: string;
	cat_code?: string;
	cat_label?: string;
	kit_label: string;
	famille?: string;
	sous_famille?: string;
	sous_sous_famille?: string;
	pp_amount: string;
	pp_discount?: string;
	pp_date: string;
}

export interface AttributePair {
	atrLabel: string;
	atrValue: string | null;
}

export interface ParsedCSVData {
	success: boolean;
	data: CSVRow[];
	attributes: AttributePair[];
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

export interface ImportResult {
	success: boolean;
	stats: ImportStats;
	error?: string;
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
	attributeUnitsMap: Map<number, { default_unit_id: number | null; units: Array<{ unit_id: number; unit_value: string; unit_label: string }> }>
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
// PARSE CSV FORMAT VERTICAL
// ============================================================================
export function parseCSVContent(csvContent: string): ParsedCSVData {
	try {
		const parseResult = Papa.parse(csvContent, {
			delimiter: ';',
			skipEmptyLines: true,
			header: false
		});

		const rawData = parseResult.data as unknown[][];

		if (rawData.length < 2) {
			return { success: false, data: [], attributes: [], error: 'Fichier CSV invalide (moins de 2 lignes)' };
		}

		const headers = rawData[0] as string[];
		const attributeColumnIndexes: number[] = [];

		headers.forEach((header, index) => {
			if (header === 'atr_label') attributeColumnIndexes.push(index);
		});

		const isVerticalFormat = attributeColumnIndexes.length > 0 && rawData.length >= 3;
		if (!isVerticalFormat) {
			return { success: false, data: [], attributes: [], error: 'Format vertical non détecté' };
		}

		const dataLine = rawData[1] as unknown[];
		const valuesLine = rawData[2] as unknown[];

		const row: Record<string, string> = {};
		headers.forEach((header, index) => {
			if (!attributeColumnIndexes.includes(index)) {
				row[header] = (dataLine[index] as string) || '';
			}
		});

		const attributes: AttributePair[] = [];
		attributeColumnIndexes.forEach((colIndex) => {
			const atrLabel = dataLine[colIndex] as string;
			const atrValue = valuesLine[colIndex] as string;

			if (atrLabel && atrLabel.trim() !== '') {
				attributes.push({
					atrLabel: atrLabel.trim(),
					atrValue: atrValue ? atrValue.trim() : null
				});
			}
		});

		return { success: true, data: [row as unknown as CSVRow], attributes };
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
export async function validateCSVData(data: CSVRow[], config: {
	requiredFields: string[];
	numericFields: string[];
	dateFields: string[];
	fieldMapping: Record<string, { table: string; field: string }>;
	fieldMaxLengths: Record<string, number>;
}): Promise<ValidationResult> {
	const errors: ValidationError[] = [];
	const warnings: ValidationError[] = [];
	let validRows = 0;

	for (let i = 0; i < data.length; i++) {
		const row = data[i];
		const lineNumber = i + 2;
		let rowValid = true;

		for (const field of config.requiredFields) {
			const value = row[field as keyof CSVRow];
			if (!value || (typeof value === 'string' && value.trim() === '')) {
				errors.push({ line: lineNumber, field, value: value || '', error: 'Champ obligatoire manquant' });
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
			}
		}

		for (const field of config.dateFields) {
			const value = row[field as keyof CSVRow];
			if (value && typeof value === 'string' && value.trim() !== '') {
				const isoDate = convertToISODate(value);
				if (!isoDate) {
					errors.push({ line: lineNumber, field, value, error: 'Format date invalide (YYYY-MM-DD ou DD/MM/YYYY)' });
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
					errors.push({ line: lineNumber, field: csvField, value, error: `Trop long (${value.length}/${maxLength})` });
					rowValid = false;
				}
			}
		}

		if (rowValid) validRows++;
	}

	return { success: errors.length === 0, totalRows: data.length, validRows, errors, warnings };
}

// ============================================================================
// VALIDATION ATTRIBUTS
// ============================================================================
const prisma = new CenovDevPrismaClient();

async function loadAttributeReference(): Promise<Map<string, { atr_id: number; atr_label: string }>> {
	const attributes = await prisma.attribute.findMany({
		select: { atr_id: true, atr_label: true }
	});
	const map = new Map();
	attributes.forEach((attr) => map.set(attr.atr_label, attr));
	return map;
}

async function loadAttributeUnitsEnriched(): Promise<Map<number, { default_unit_id: number | null; units: Array<{ unit_id: number; unit_value: string; unit_label: string }> }>> {
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

async function loadAllowedValues(atrIds: number[]): Promise<Map<number, Set<string>>> {
	if (atrIds.length === 0) return new Map();

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

export async function validateAttributes(attributes: AttributePair[]): Promise<ValidationResult> {
	const errors: ValidationError[] = [];
	const warnings: ValidationError[] = [];

	const attributeMap = await loadAttributeReference();
	const attributeUnitsMap = await loadAttributeUnitsEnriched();

	const attributeIds = attributes
		.filter((a) => a.atrValue && attributeMap.has(a.atrLabel))
		.map((a) => attributeMap.get(a.atrLabel)!.atr_id);

	const allowedValuesMap = await loadAllowedValues(attributeIds);

	for (let i = 0; i < attributes.length; i++) {
		const { atrLabel, atrValue } = attributes[i];
		if (!atrValue || atrValue.trim() === '') continue;

		const attribute = attributeMap.get(atrLabel);
		if (!attribute) {
			errors.push({ line: i + 1, field: atrLabel, value: atrValue, error: 'Attribut introuvable' });
			continue;
		}

		const allowedValues = allowedValuesMap.get(attribute.atr_id);

		if (allowedValues && allowedValues.size > 0) {
			if (!allowedValues.has(atrValue)) {
				const allowedList = Array.from(allowedValues).join(', ');
				errors.push({ line: i + 1, field: atrLabel, value: atrValue, error: `Valeur non autorisée. Acceptées: ${allowedList}` });
			}
		} else {
			const { unit } = parseValueAndUnit(atrValue);
			if (unit) {
				const unitsData = attributeUnitsMap.get(attribute.atr_id);
				if (unitsData && unitsData.units.length > 0) {
					const unitId = findUnitId(attribute.atr_id, unit, attributeUnitsMap);
					if (!unitId) {
						const allowedUnits = unitsData.units.map((u) => u.unit_value).join(', ');
						errors.push({ line: i + 1, field: atrLabel, value: atrValue, error: `Unité "${unit}" invalide. Acceptées: ${allowedUnits}` });
					}
				}
			}
		}
	}

	return { success: errors.length === 0, totalRows: attributes.length, validRows: attributes.length - errors.length, errors, warnings };
}

// ============================================================================
// IMPORT BDD
// ============================================================================
export async function importToDatabase(data: CSVRow[], attributes: AttributePair[]): Promise<ImportResult> {
	const stats: ImportStats = {
		suppliers: 0, kits: 0, categories: 0, families: 0,
		products: 0, productsUpdated: 0, prices: 0,
		categoryAttributes: 0, kitAttributes: 0
	};

	try {
		await prisma.$transaction(async (tx) => {
			for (const row of data) {
				const supplierResult = await findOrCreateSupplier(tx, row.sup_code, row.sup_label);
				if (supplierResult.isNew) stats.suppliers++;

				const kitResult = await findOrCreateKit(tx, row.kit_label);
				if (kitResult.isNew) stats.kits++;

				const categoryResult = await findOrCreateCategory(tx, row.cat_label, row.cat_code);
				if (categoryResult && categoryResult.isNew) stats.categories++;

				const familyIds = await resolveFamilyHierarchy(tx, row, supplierResult.entity.sup_id, stats);

				const productResult = await upsertProduct(tx, row, supplierResult.entity.sup_id, kitResult.entity.kit_id, familyIds, categoryResult);
				if (productResult.isNew) stats.products++;
				else stats.productsUpdated++;

				await upsertPricePurchase(tx, productResult.entity.pro_id, row);
				stats.prices++;

				if (categoryResult && attributes.length > 0) {
					const attrStats = await importAttributes(tx, categoryResult.entity.cat_id, kitResult.entity.kit_id, attributes);
					stats.categoryAttributes += attrStats.categoryAttributes;
					stats.kitAttributes += attrStats.kitAttributes;
				}
			}
		});

		return { success: true, stats };
	} catch (error) {
		return { success: false, stats, error: error instanceof Error ? error.message : 'Erreur inconnue' };
	}
}

async function findOrCreateSupplier(tx: PrismaTransaction, sup_code: string, sup_label: string) {
	const existing = await tx.supplier.findUnique({ where: { sup_code } });
	const supplier = await tx.supplier.upsert({
		where: { sup_code },
		create: { sup_code, sup_label },
		update: { sup_label }
	});
	return { entity: supplier, isNew: !existing };
}

async function findOrCreateKit(tx: PrismaTransaction, kit_label: string) {
	const existing = await tx.kit.findUnique({ where: { kit_label } });
	const kit = await tx.kit.upsert({
		where: { kit_label },
		create: { kit_label },
		update: {}
	});
	return { entity: kit, isNew: !existing };
}

async function findOrCreateCategory(tx: PrismaTransaction, cat_label?: string, cat_code?: string) {
	if (!cat_label || cat_label.trim() === '') return null;

	const whereClause = cat_code ? { cat_code } : { cat_label };
	let category = await tx.category.findFirst({ where: whereClause });
	const isNew = !category;

	if (!category) {
		category = await tx.category.create({
			data: { cat_code: cat_code || null, cat_label }
		});
	}
	return { entity: category, isNew };
}

async function resolveFamilyHierarchy(tx: PrismaTransaction, row: CSVRow, fk_supplier: number, stats: ImportStats) {
	let fam_id = null, sfam_id = null, ssfam_id = null;

	if (row.famille) {
		const famille = await findOrCreateFamily(tx, row.famille, null, fk_supplier);
		if (famille.isNew) stats.families++;
		fam_id = famille.entity.fam_id;

		if (row.sous_famille) {
			const sousFamille = await findOrCreateFamily(tx, row.sous_famille, fam_id, fk_supplier);
			if (sousFamille.isNew) stats.families++;
			sfam_id = sousFamille.entity.fam_id;

			if (row.sous_sous_famille) {
				const sousSousFamille = await findOrCreateFamily(tx, row.sous_sous_famille, sfam_id, fk_supplier);
				if (sousSousFamille.isNew) stats.families++;
				ssfam_id = sousSousFamille.entity.fam_id;
			}
		}
	}
	return { fam_id, sfam_id, ssfam_id };
}

async function findOrCreateFamily(tx: PrismaTransaction, fam_label: string, fk_parent: number | null, fk_supplier: number) {
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
	}
	return { entity: family, isNew };
}

async function upsertProduct(tx: PrismaTransaction, row: CSVRow, fk_supplier: number, fk_kit: number, familyIds: { fam_id: number | null; sfam_id: number | null; ssfam_id: number | null }, categoryResult: { entity: { cat_id: number }; isNew: boolean } | null) {
	const existing = await tx.product.findUnique({ where: { pro_cenov_id: row.pro_cenov_id } });

	const productData = {
		pro_cenov_id: row.pro_cenov_id,
		pro_code: row.pro_code,
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

	if (categoryResult) {
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
	}

	return { entity: product, isNew: !existing };
}

async function upsertPricePurchase(tx: PrismaTransaction, fk_product: number, row: CSVRow) {
	const pp_discount = row.pp_discount && row.pp_discount.trim() !== '' ? parseFloat(row.pp_discount) : null;
	const pp_date = new Date(row.pp_date);

	await tx.price_purchase.upsert({
		where: { fk_product_pp_date: { fk_product, pp_date } },
		create: {
			fk_product,
			pp_date,
			pp_amount: parseFloat(row.pp_amount),
			pp_discount,
			pro_cenov_id: row.pro_cenov_id
		},
		update: {
			pp_amount: parseFloat(row.pp_amount),
			pp_discount
		}
	});
}

async function importAttributes(tx: PrismaTransaction, cat_id: number, kit_id: number, attributes: AttributePair[]) {
	let categoryAttributes = 0, kitAttributes = 0;

	const attributeMap = await loadAttributeReference();
	const attributeUnitsMap = await loadAttributeUnitsEnriched();
	const atrIds = attributes.filter((a) => a.atrValue && attributeMap.has(a.atrLabel)).map((a) => attributeMap.get(a.atrLabel)!.atr_id);
	const allowedValuesMap = await loadAllowedValues(atrIds);

	for (const { atrLabel, atrValue } of attributes) {
		if (!atrValue || atrValue.trim() === '') continue;

		const attribute = attributeMap.get(atrLabel);
		if (!attribute) continue;

		const existingCatAttr = await tx.category_attribute.findFirst({
			where: { fk_category: cat_id, fk_attribute: attribute.atr_id }
		});

		if (!existingCatAttr) {
			await tx.category_attribute.create({
				data: { fk_category: cat_id, fk_attribute: attribute.atr_id, cat_atr_required: false }
			});
			categoryAttributes++;
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

		const existingKitAttr = await tx.kit_attribute.findFirst({
			where: { fk_kit: kit_id, fk_attribute_characteristic: attribute.atr_id }
		});

		if (existingKitAttr) {
			await tx.kit_attribute.update({
				where: { kat_id: existingKitAttr.kat_id },
				data: { kat_value: finalValue, fk_attribute_unite: finalUnitId }
			});
		} else {
			await tx.kit_attribute.create({
				data: {
					fk_kit: kit_id,
					fk_attribute_characteristic: attribute.atr_id,
					fk_attribute_unite: finalUnitId,
					kat_value: finalValue
				}
			});
			kitAttributes++;
		}
	}

	return { categoryAttributes, kitAttributes };
}
