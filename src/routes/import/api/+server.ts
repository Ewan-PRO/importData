import type { RequestHandler } from '@sveltejs/kit';
import { json, error } from '@sveltejs/kit';
import { getTableValidationRules, createRecord, findRecord, detectDatabaseForTable, type ValidationRules } from '$lib/prisma-meta';

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

// ValidationRules est maintenant importé de prisma-meta.ts


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
	const database = await detectDatabaseForTable(tableName);
	const validationRules = await getTableValidationRules(database, tableName);
	const uniqueFields = validationRules.uniqueFields;

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
		const database = await detectDatabaseForTable(tableName);

		const existingRecord = await findRecord(database, tableName, whereCondition);

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

				// Procéder normalement pour toutes les tables
				Object.entries(mappedFields).forEach(([columnIndex, fieldName]) => {
					if (fieldName && row[parseInt(columnIndex)] !== undefined) {
						insertData[fieldName] = formatValueForDatabase(fieldName, row[parseInt(columnIndex)]);
					}
				});

				console.log(`🔍 Insert data for row ${rowIndex}:`, insertData);

				// Insérer dans la table appropriée en utilisant la fonction générique
				const database = await detectDatabaseForTable(tableName);

				await createRecord(database, tableName, insertData);
				console.log(`✅ Inserted into ${tableName}:`, insertData);
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

		// Obtenir la structure de la table cible via DMMF
		const database = await detectDatabaseForTable(targetTable);
		const validationRules = await getTableValidationRules(database, targetTable);

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
