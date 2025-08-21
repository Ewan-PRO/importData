import type { RequestHandler } from '@sveltejs/kit';
import { json, error } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Types importés du fichier principal
type ColumnMap = Record<string, number>;

interface ValidationResult {
	totalRows: number;
	validRows: number;
	duplicates: number;
	invalidData: Array<{
		row: number;
		field: string;
		value: string;
		error: string;
	}>;
	processed: boolean;
	inserted?: number;
	updated?: number;
	errors?: string[];
}

interface ValidationRules {
	requiredFields: string[];
	uniqueFields: string[];
	validators: Record<string, (value: unknown) => boolean>;
}

// Fonctions utilitaires (copiées et adaptées depuis +page.server.ts)
function getValidationRules(tableName: string): ValidationRules {
	switch (tableName) {
		case 'attribute':
		case 'attribute_dev':
			return {
				requiredFields: ['atr_nat', 'atr_val'],
				uniqueFields: ['atr_nat', 'atr_val'],
				validators: {
					atr_nat: (value: unknown) => typeof value === 'string' && value.length <= 60,
					atr_val: (value: unknown) => typeof value === 'string' && value.length <= 60,
					atr_label: (value: unknown) => typeof value === 'string' && value.length <= 150
				}
			};
		case 'supplier':
		case 'supplier_dev':
			return {
				requiredFields: ['sup_code'],
				uniqueFields: ['sup_code'],
				validators: {
					sup_code: (value: unknown) => typeof value === 'string' && value.length <= 30,
					sup_label: (value: unknown) => !value || (typeof value === 'string' && value.length <= 50)
				}
			};
		case 'v_categories_dev':
			return {
				requiredFields: ['atr_0_label'],
				uniqueFields: ['atr_1_label', 'atr_2_label', 'atr_3_label'], // Combinaison unique sur les niveaux
				validators: {
					atr_0_label: (value: unknown) => typeof value === 'string' && value.length <= 100,
					atr_1_label: (value: unknown) =>
						!value || (typeof value === 'string' && value.length <= 150),
					atr_2_label: (value: unknown) =>
						!value || (typeof value === 'string' && value.length <= 150),
					atr_3_label: (value: unknown) =>
						!value || (typeof value === 'string' && value.length <= 150),
					atr_4_label: (value: unknown) =>
						!value || (typeof value === 'string' && value.length <= 150),
					atr_5_label: (value: unknown) =>
						!value || (typeof value === 'string' && value.length <= 150),
					atr_6_label: (value: unknown) =>
						!value || (typeof value === 'string' && value.length <= 150),
					atr_7_label: (value: unknown) =>
						!value || (typeof value === 'string' && value.length <= 150)
				}
			};
		default:
			return {
				requiredFields: [],
				uniqueFields: [],
				validators: {}
			};
	}
}

function prepareColumnMap(mappedFields: Record<string, string>): ColumnMap {
	const columnMap: ColumnMap = {};
	Object.entries(mappedFields).forEach(([index, field]) => {
		if (field) columnMap[field] = parseInt(index);
	});
	return columnMap;
}

function validateRow(
	rowIndex: number,
	row: unknown[],
	columnMap: ColumnMap,
	validationRules: ValidationRules,
	uniqueEntries: Set<string>,
	result: ValidationResult
): boolean {
	// Vérifier les champs requis
	const requiredValid = validateRequiredFields(rowIndex, row, columnMap, validationRules, result);
	if (!requiredValid) return false;

	// Vérifier le format des données
	const formatValid = validateDataFormat(rowIndex, row, columnMap, validationRules, result);
	if (!formatValid) return false;

	// Vérifier les doublons internes
	if (validationRules.uniqueFields.length > 0) {
		const uniqueValid = validateUniqueEntries(
			rowIndex,
			row,
			columnMap,
			validationRules,
			uniqueEntries,
			result
		);
		if (!uniqueValid) return false;
	}

	return true;
}

function validateRequiredFields(
	rowIndex: number,
	row: unknown[],
	columnMap: ColumnMap,
	validationRules: ValidationRules,
	result: ValidationResult
): boolean {
	for (const fieldName of validationRules.requiredFields) {
		const colIndex = columnMap[fieldName];
		const value = colIndex !== undefined ? row[colIndex] : undefined;

		// Vérifier si le champ est vide (undefined, null, '', ou chaîne vide après trim)
		const isEmpty =
			value === undefined ||
			value === null ||
			value === '' ||
			(typeof value === 'string' && value.trim() === '');

		if (colIndex === undefined || isEmpty) {
			result.invalidData.push({
				row: rowIndex,
				field: fieldName,
				value: formatDisplayValue(value),
				error: 'Champ obligatoire manquant'
			});
			return false;
		}
	}

	return true;
}

function validateDataFormat(
	rowIndex: number,
	row: unknown[],
	columnMap: ColumnMap,
	validationRules: ValidationRules,
	result: ValidationResult
): boolean {
	let valid = true;

	for (const [fieldName, validator] of Object.entries(validationRules.validators)) {
		const colIndex = columnMap[fieldName];

		if (colIndex !== undefined && row[colIndex] !== undefined && row[colIndex] !== '') {
			const value = row[colIndex];

			if (!validator(value)) {
				result.invalidData.push({
					row: rowIndex,
					field: fieldName,
					value: formatDisplayValue(value),
					error: 'Format invalide'
				});
				valid = false;
			}
		}
	}

	return valid;
}

function validateUniqueEntries(
	rowIndex: number,
	row: unknown[],
	columnMap: ColumnMap,
	validationRules: ValidationRules,
	uniqueEntries: Set<string>,
	result: ValidationResult
): boolean {
	const uniqueKey = validationRules.uniqueFields
		.map((field) => {
			const colIndex = columnMap[field];
			return colIndex !== undefined ? formatDisplayValue(row[colIndex]) : '';
		})
		.join('|');

	if (uniqueEntries.has(uniqueKey)) {
		result.duplicates++;

		result.invalidData.push({
			row: rowIndex,
			field: validationRules.uniqueFields.join(', '),
			value: uniqueKey,
			error: 'Doublon détecté'
		});

		return false;
	}

	uniqueEntries.add(uniqueKey);
	return true;
}

function formatDisplayValue(value: unknown): string {
	if (value === null || value === undefined) {
		return '';
	}

	if (typeof value === 'object') {
		try {
			return JSON.stringify(value, null, 2);
		} catch {
			return '[Object]';
		}
	}

	return String(value);
}

// Validation du format CSV
function validateCSVFormat(
	data: unknown[][]
): Array<{ row: number; field: string; value: string; error: string }> {
	const errors: Array<{ row: number; field: string; value: string; error: string }> = [];

	data.forEach((row, rowIndex) => {
		if (!Array.isArray(row)) return;

		row.forEach((cell, cellIndex) => {
			if (typeof cell === 'string') {
				// Vérifier les guillemets malformés
				const quoteCount = (cell.match(/"/g) || []).length;

				// Si nombre impair de guillemets, c'est malformé
				if (quoteCount % 2 !== 0) {
					errors.push({
						row: rowIndex,
						field: `Colonne ${cellIndex}`,
						value: cell,
						error: 'Guillemets malformés dans le CSV'
					});
				}

				// Vérifier si la cellule commence ou finit par des guillemets non échappés
				if (
					cell.includes('"""') ||
					(cell.startsWith('"') && !cell.endsWith('"') && quoteCount > 1)
				) {
					errors.push({
						row: rowIndex,
						field: `Colonne ${cellIndex}`,
						value: cell,
						error: 'Format CSV invalide - guillemets incorrects'
					});
				}
			}
		});
	});

	return errors;
}

// Vérification des doublons en base de données
async function checkExistingRecord(
	tableName: string,
	mappedFields: Record<string, string>,
	row: unknown[]
): Promise<string | null> {
	const whereCondition: Record<string, unknown> = {};
	const uniqueFields = getValidationRules(tableName).uniqueFields;

	// Construction de la condition avec les champs uniques
	uniqueFields.forEach((field) => {
		const colIndex = Object.entries(mappedFields).find(([, f]) => f === field)?.[0];
		if (colIndex !== undefined) {
			whereCondition[field] = formatValueForDatabase(field, row[parseInt(colIndex)]);
		}
	});

	// Si aucun champ unique trouvé, on ne peut pas vérifier
	if (Object.keys(whereCondition).length === 0) {
		return null;
	}

	try {
		let existingRecord: Record<string, unknown> | null = null;

		switch (tableName) {
			case 'attribute':
				existingRecord = await prisma.attribute.findFirst({
					where: whereCondition
				});
				break;
			case 'attribute_dev':
				existingRecord = await prisma.attribute_dev.findFirst({
					where: whereCondition
				});
				break;
			case 'supplier':
				existingRecord = await prisma.supplier.findFirst({
					where: whereCondition
				});
				break;
			case 'supplier_dev':
				existingRecord = await prisma.supplier_dev.findFirst({
					where: whereCondition
				});
				break;
			case 'v_categories_dev':
				existingRecord = await prisma.v_categories_dev.findFirst({
					where: whereCondition
				});
				break;
		}

		// Retourner une représentation textuelle de l'enregistrement trouvé
		if (existingRecord) {
			return uniqueFields
				.map((field) => {
					const value = existingRecord?.[field];
					return formatDisplayValue(value);
				})
				.join(', ');
		}

		return null;
	} catch (err) {
		console.error('Erreur lors de la vérification des doublons:', err);
		return null;
	}
}

function formatValueForDatabase(field: string, value: unknown): unknown {
	// Si la valeur est null ou undefined, retourner null
	if (value === null || value === undefined || value === '') {
		return null;
	}

	// Conversion selon le type de champ
	if (field.includes('_valeur') || field.includes('_qty')) {
		// Conversion en nombre
		const numValue = parseFloat(String(value).replace(',', '.'));
		return isNaN(numValue) ? null : numValue;
	}

	// Par défaut, retourner la valeur comme chaîne de caractères AVEC TRIM
	return String(value).trim();
}

// Fonction pour gérer l'insertion des catégories
async function handleCategoryInsert(data: Record<string, unknown>): Promise<void> {
	// Insertion dans la table attribute_dev pour chaque niveau de catégorie

	// Niveau 0 (catégorie principale)
	if (data.atr_0_label) {
		await prisma.attribute_dev.upsert({
			where: {
				atr_nat_atr_val: {
					atr_nat: 'Catégorie des produits',
					atr_val: String(data.atr_0_label)
				}
			},
			update: {
				atr_label: String(data.atr_0_label)
			},
			create: {
				atr_nat: 'Catégorie des produits',
				atr_val: String(data.atr_0_label),
				atr_label: String(data.atr_0_label)
			}
		});
	}

	// Niveaux 1-7 (sous-catégories)
	for (let i = 1; i <= 7; i++) {
		const labelField = `atr_${i}_label`;

		if (data[labelField]) {
			await prisma.attribute_dev.upsert({
				where: {
					atr_nat_atr_val: {
						atr_nat: 'Catégorie des produits',
						atr_val: String(data[labelField])
					}
				},
				update: {
					atr_label: String(data[labelField])
				},
				create: {
					atr_nat: 'Catégorie des produits',
					atr_val: String(data[labelField]),
					atr_label: String(data[labelField])
				}
			});
		}
	}
}

// Fonction pour insérer les données valides dans la base de données
async function insertValidData(
	tableName: string,
	mappedFields: Record<string, string>,
	data: unknown[][],
	validRowsSet: Set<number>
): Promise<number> {
	let insertedCount = 0;

	console.log('🔍 insertValidData Debug:', {
		tableName,
		mappedFields,
		dataLength: data.length,
		validRowsSetSize: validRowsSet.size,
		validRowsArray: Array.from(validRowsSet)
	});

	try {
		for (let rowIndex = 0; rowIndex < data.length; rowIndex++) {
			// Seulement traiter les lignes marquées comme valides lors de la validation initiale
			if (!validRowsSet.has(rowIndex)) {
				console.log(`🔍 Skipping row ${rowIndex} - not in validRowsSet`);
				continue;
			}

			const row = data[rowIndex];
			console.log(`🔍 Processing row ${rowIndex}:`, row);

			// Vérifier une dernière fois que la ligne n'existe pas déjà en base
			const existingRecord = await checkExistingRecord(tableName, mappedFields, row);
			console.log(`🔍 Existing record check for row ${rowIndex}:`, existingRecord);

			if (!existingRecord) {
				// Préparer les données pour l'insertion
				const insertData: Record<string, unknown> = {};

				// Pour les catégories, ne pas mapper les champs atr_X_label directement
				if (tableName === 'v_categories_dev') {
					// Stocker les données de catégorie temporairement pour handleCategoryInsert
					Object.entries(mappedFields).forEach(([columnIndex, fieldName]) => {
						if (fieldName && row[parseInt(columnIndex)] !== undefined) {
							insertData[fieldName] = formatValueForDatabase(fieldName, row[parseInt(columnIndex)]);
						}
					});
				} else {
					// Pour les autres tables, procéder normalement
					Object.entries(mappedFields).forEach(([columnIndex, fieldName]) => {
						if (fieldName && row[parseInt(columnIndex)] !== undefined) {
							insertData[fieldName] = formatValueForDatabase(fieldName, row[parseInt(columnIndex)]);
						}
					});
				}

				console.log(`🔍 Insert data for row ${rowIndex}:`, insertData);

				// Insérer dans la table appropriée
				switch (tableName) {
					case 'attribute_dev':
						await prisma.attribute_dev.create({ data: insertData });
						console.log(`✅ Inserted into attribute_dev:`, insertData);
						break;
					case 'supplier':
						// Vérifier et typer correctement les données pour supplier
						if (!insertData.sup_code || typeof insertData.sup_code !== 'string') {
							throw new Error('Le champ sup_code est obligatoire pour les fournisseurs');
						}
						await prisma.supplier.create({
							data: {
								sup_code: insertData.sup_code,
								sup_label: insertData.sup_label ? String(insertData.sup_label) : null
							}
						});
						console.log(`✅ Inserted into supplier:`, insertData);
						break;
					case 'supplier_dev':
						// Vérifier et typer correctement les données pour supplier_dev
						if (!insertData.sup_code || typeof insertData.sup_code !== 'string') {
							throw new Error('Le champ sup_code est obligatoire pour les fournisseurs');
						}
						await prisma.supplier_dev.create({
							data: {
								sup_code: insertData.sup_code,
								sup_label: insertData.sup_label ? String(insertData.sup_label) : null
							}
						});
						console.log(`✅ Inserted into supplier_dev:`, insertData);
						break;
					case 'v_categories_dev':
						// Pour les catégories, on insère dans attribute_dev pour chaque niveau
						await handleCategoryInsert(insertData);
						console.log(`✅ Inserted into categories:`, insertData);
						break;
				}
				insertedCount++;
			} else {
				console.log(`🔍 Row ${rowIndex} already exists, skipping`);
			}
		}
	} catch (err) {
		console.error("❌ Erreur lors de l'insertion:", err);
		throw new Error(
			`Erreur d'insertion: ${err instanceof Error ? err.message : 'Erreur inconnue'}`
		);
	}

	console.log(`🔍 Total inserted: ${insertedCount}`);
	return insertedCount;
}

export const POST: RequestHandler = async ({ request }) => {
	try {
		const body = await request.json();
		const { data, mappedFields, targetTable } = body;

		console.log('🔍 API Debug - Request:', {
			dataLength: Array.isArray(data) ? data.length : 'not array',
			mappedFields,
			targetTable,
			action: body.action
		});

		const result: ValidationResult = {
			totalRows: Array.isArray(data) ? data.length : 0,
			validRows: 0,
			duplicates: 0,
			invalidData: [],
			processed: false,
			inserted: 0,
			updated: 0,
			errors: []
		};

		// Validation du format CSV d'abord
		if (Array.isArray(data)) {
			const csvErrors = validateCSVFormat(data);
			if (csvErrors.length > 0) {
				result.invalidData.push(...csvErrors);
			}
		}

		// Obtenir la structure de la table cible
		const validationRules = getValidationRules(targetTable);

		// Préparation pour le traitement
		const columnMap = prepareColumnMap(mappedFields);
		const uniqueEntries = new Set<string>();
		const validRowsSet = new Set<number>();

		// Validation ligne par ligne
		if (Array.isArray(data)) {
			for (let rowIndex = 0; rowIndex < data.length; rowIndex++) {
				const row = data[rowIndex];
				console.log(`🔍 Validating row ${rowIndex}:`, row, 'with columnMap:', columnMap);

				const validationResult = validateRow(
					rowIndex,
					row,
					columnMap,
					validationRules,
					uniqueEntries,
					result
				);

				// Vérification des doublons avec la base de données
				if (validationResult) {
					const existingRecord = await checkExistingRecord(targetTable, mappedFields, row);
					console.log(
						`🔍 Validation result for row ${rowIndex}: validationResult=${validationResult}, existingRecord=${existingRecord}`
					);

					if (existingRecord) {
						result.duplicates++;
						result.invalidData.push({
							row: rowIndex,
							field: validationRules.uniqueFields.join(', '),
							value: existingRecord,
							error: 'Existe déjà dans la base de données'
						});
						console.log(`🔍 Row ${rowIndex} marked as duplicate`);
					} else {
						result.validRows++;
						validRowsSet.add(rowIndex); // Marquer cette ligne comme valide pour l'insertion
						console.log(`🔍 Row ${rowIndex} marked as valid`);
					}
				} else {
					console.log(`🔍 Row ${rowIndex} failed basic validation`);
				}
			}
		}

		// Si c'est un test "process", marquer comme traité et insérer les données
		const isProcessing = request.url.includes('process') || body.action === 'process';
		console.log('🔍 API Debug - Processing:', {
			isProcessing,
			validRows: result.validRows,
			validRowsSetSize: validRowsSet.size
		});

		if (isProcessing && result.validRows > 0) {
			result.processed = true;
			const insertedCount = await insertValidData(targetTable, mappedFields, data, validRowsSet);
			result.inserted = insertedCount;
			console.log('🔍 API Debug - Inserted:', insertedCount);
		} else if (isProcessing) {
			result.processed = true;
			result.inserted = 0;
		}

		return json({
			success: true,
			result
		});
	} catch (err) {
		console.error('Erreur lors de la validation:', err);
		return error(500, {
			message: `Erreur de validation: ${err instanceof Error ? err.message : 'Erreur inconnue'}`
		});
	}
};
