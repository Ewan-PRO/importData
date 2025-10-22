import type { Actions, ServerLoad } from '@sveltejs/kit';
import { fail } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';
import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod/v4';
import { zod4 } from 'sveltekit-superforms/adapters';
import { protect } from '$lib/auth/protect';
import {
	getImportableTables,
	getImportableTableFields,
	getImportableTableRequiredFields,
	getTableValidationRules,
	createRecord,
	updateRecord,
	findRecord,
	parseTableIdentifier,
	getDatabases,
	getAllDatabaseNames,
	getPrimaryKeyFields,
	type ValidationRules
} from '$lib/prisma-meta';

const prisma = new PrismaClient();

type ColumnMap = Record<string, number>;

// ========== CACHE GLOBAL POUR TYPES PRISMA ==========
// Cache global: Map<"database:table", Map<"fieldName", "PrismaType">>
const globalFieldTypes = new Map<string, Map<string, string>>();
// Cache nativeTypes: Map<"database:table", Map<"fieldName", "NativeType">> (ex: "Date", "Timestamp")
const globalNativeTypes = new Map<string, Map<string, string>>();
// Cache primary keys: Map<"database:table", string[]> (ex: ["fk_product", "pp_date"])
const globalPrimaryKeys = new Map<string, string[]>();

// Fonction pour pré-charger TOUS les types de TOUS les champs de TOUTES les tables
async function preloadAllFieldTypes(): Promise<void> {
	try {
		const databases = await getDatabases();
		let totalTables = 0;
		let totalFields = 0;

		for (const [dbName, db] of Object.entries(databases)) {
			for (const model of db.dmmf.datamodel.models) {
				const tableKey = `${dbName}:${model.name}`;
				const fieldTypes = new Map<string, string>();
				const nativeTypes = new Map<string, string>();

				// Extraire tous les champs scalaires avec leurs types
				model.fields
					.filter((field: { kind: string; name: string; type: string }) => field.kind === 'scalar')
					.forEach((field: { name: string; type: string; nativeType?: [string, string[]] }) => {
						fieldTypes.set(field.name, field.type);

						// Capturer nativeType si disponible (ex: @db.Date, @db.Timestamp)
						if (field.nativeType && field.nativeType[0]) {
							nativeTypes.set(field.name, field.nativeType[0]);
						}

						totalFields++;
					});

				// Extraire la clé primaire (simple ou composite)
				const modelWithPK = model as { primaryKey?: { fields?: string[] } | null };
				const primaryKeyFields: string[] = [];

				// 1. Clé primaire composite (@@id)
				if (modelWithPK.primaryKey?.fields && modelWithPK.primaryKey.fields.length > 0) {
					primaryKeyFields.push(...modelWithPK.primaryKey.fields);
				} else {
					// 2. Clé primaire simple (@id)
					const singlePK = model.fields.find((f: { isId: boolean }) => f.isId);
					if (singlePK) {
						primaryKeyFields.push(singlePK.name);
					}
				}

				globalFieldTypes.set(tableKey, fieldTypes);
				globalNativeTypes.set(tableKey, nativeTypes);
				globalPrimaryKeys.set(tableKey, primaryKeyFields);
				totalTables++;
			}
		}

		console.log(`✅ [TYPES] Types chargés: ${totalTables} tables, ${totalFields} champs`);
	} catch (error) {
		console.error('❌ [TYPES] Erreur pré-chargement:', error);
		throw error;
	}
}

// Interface unifiée pour tous les résultats d'importation
interface ImportResult {
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
	inserted: number;
	updated: number;
	errors: string[];
	resultsByTable?: Record<
		string,
		{
			validRows: number;
			inserted: number;
			updated: number;
		}
	>;
}

interface ImportConfig {
	data: unknown[][];
	mappedFields: Record<string, string>;
	selectedTables: string[];
	targetTable?: string; // Pour API simple table
}

interface ValidationOptions {
	multiTable?: boolean;
	enableDatabaseCheck?: boolean;
}

interface InsertionOptions {
	useTransaction?: boolean;
	prismaClient?: unknown;
}

interface InsertionResult {
	inserted: number;
	updated: number;
	errors: string[];
}

// Schéma de validation unifié (détection automatique mono/multi-table)
const importSchema = z.object({
	data: z.array(z.array(z.unknown())),
	mappedFields: z.record(z.string(), z.string()),
	selectedTables: z.array(z.string()),
	targetTable: z.string().optional() // Rétrocompatibilité API
});

// ========== FONCTIONS UTILITAIRES ==========

function formatError(err: unknown): string {
	return err instanceof Error ? err.message : 'Erreur inconnue';
}

function calculateValidRowsSet(result: ImportResult, totalRows: number): Set<number> {
	const validRowsSet = new Set<number>();
	const invalidRowIndices = new Set(result.invalidData.map((error) => error.row));

	for (let i = 0; i < totalRows; i++) {
		if (!invalidRowIndices.has(i)) {
			validRowsSet.add(i);
		}
	}

	return validRowsSet;
}

function prepareColumnMap(mappedFields: Record<string, string>): ColumnMap {
	const columnMap: ColumnMap = {};
	Object.entries(mappedFields).forEach(([index, field]) => {
		if (field) columnMap[field] = parseInt(index);
	});
	return columnMap;
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

// Version SYNCHRONE ultra-rapide utilisant le cache global
function formatValueForDatabase(field: string, value: unknown, tableIdentifier: string): unknown {
	// Si la valeur est null ou undefined, retourner null
	if (value === null || value === undefined || value === '') {
		return null;
	}

	// Lookup synchrone dans le cache global des types
	const tableTypes = globalFieldTypes.get(tableIdentifier);
	const prismaType = tableTypes?.get(field) || 'String';

	// Lookup nativeType (ex: "Date", "Timestamp") via cache
	// const tableNativeTypes = globalNativeTypes.get(tableIdentifier);
	// const nativeType = tableNativeTypes?.get(field); // TODO: utiliser pour conversion avancée

	const stringValue = String(value).trim();

	// Conversion selon le type Prisma réel
	switch (prismaType) {
		case 'Int': {
			const intValue = parseInt(stringValue, 10);
			return isNaN(intValue) ? null : intValue;
		}

		case 'Float':
		case 'Decimal': {
			const floatValue = parseFloat(stringValue.replace(',', '.'));
			return isNaN(floatValue) ? null : floatValue;
		}

		case 'Boolean': {
			return (
				stringValue.toLowerCase() === 'true' ||
				stringValue === '1' ||
				stringValue.toLowerCase() === 'yes'
			);
		}

		case 'DateTime': {
			if (typeof value === 'string') {
				const trimmedValue = value.trim();

				// Format ISO date seule (YYYY-MM-DD) → Prisma exige toujours ISO DateTime complet
				if (/^\d{4}-\d{2}-\d{2}$/.test(trimmedValue)) {
					return `${trimmedValue}T00:00:00.000Z`;
				}

				// Format PostgreSQL: "2025-09-26 15:23:14.943538" → ISO-8601
				if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}(\.\d+)?$/.test(trimmedValue)) {
					return trimmedValue.replace(' ', 'T') + 'Z';
				}

				// Format ISO DateTime déjà correct → ajouter Z si absent
				if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(trimmedValue)) {
					return trimmedValue.endsWith('Z') ? trimmedValue : `${trimmedValue}Z`;
				}

				// Fallback: retourner tel quel
				return trimmedValue;
			}
			return value;
		}

		case 'String':
		default: {
			return stringValue;
		}
	}
}

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

				// Vérifier les séquences de guillemets suspectes
				if (cell.includes('""') && !/^".*"$/.exec(cell)) {
					errors.push({
						row: rowIndex,
						field: `Colonne ${cellIndex}`,
						value: cell,
						error: "Séquence de guillemets suspecte - vérifiez l'encodage du fichier"
					});
				}
			}
		});
	});

	return errors;
}

function validateRequiredFields(
	rowIndex: number,
	row: unknown[],
	columnMap: ColumnMap,
	validationRules: ValidationRules,
	result: ImportResult
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
	result: ImportResult
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
	result: ImportResult
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

function validateRow(
	rowIndex: number,
	row: unknown[],
	columnMap: ColumnMap,
	validationRules: ValidationRules,
	uniqueEntries: Set<string>,
	result: ImportResult
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

// Vérifier si un enregistrement existe via la clé primaire
async function checkExistingRecord(
	tableIdentifier: string,
	mappedFields: Record<string, string>,
	row: unknown[]
): Promise<string | null> {
	const { database, tableName } = parseTableIdentifier(tableIdentifier);

	// Utiliser directement getPrimaryKeyFields de prisma-meta
	const primaryKeyFields = await getPrimaryKeyFields(database, tableName);

	if (primaryKeyFields.length === 0) {
		return null; // Pas de clé primaire = impossible de vérifier
	}

	// Construction de la condition WHERE avec les champs de la clé primaire
	const whereCondition: Record<string, unknown> = {};
	primaryKeyFields.forEach((field) => {
		const colIndex = Object.entries(mappedFields).find(([, f]) => f === field)?.[0];
		if (colIndex !== undefined) {
			const rawValue = row[parseInt(colIndex)];
			const formattedValue = formatValueForDatabase(field, rawValue, tableIdentifier);
			whereCondition[field] = formattedValue;
		}
	});

	// Si tous les champs de la clé primaire ne sont pas mappés, on ne peut pas vérifier
	if (Object.keys(whereCondition).length !== primaryKeyFields.length) {
		return null;
	}

	try {
		const existingRecord = await findRecord(database, tableName, whereCondition);

		if (existingRecord) {
			// Retourner une représentation textuelle des champs de la clé primaire
			const result = primaryKeyFields
				.map((field) => formatDisplayValue(existingRecord[field]))
				.join(', ');
			return result;
		}

		return null;
	} catch (error) {
		console.log(`❌ [ERROR] checkExistingRecord ${tableName} échoué:`, error);
		return null;
	}
}

// ========== FONCTIONS D'ORCHESTRATION ==========

async function validateImportData(
	config: ImportConfig,
	options: ValidationOptions = {}
): Promise<ImportResult> {
	const { multiTable = false, enableDatabaseCheck = true } = options;

	const result: ImportResult = {
		totalRows: Array.isArray(config.data) ? config.data.length : 0,
		validRows: 0,
		duplicates: 0,
		invalidData: [],
		processed: false,
		inserted: 0,
		updated: 0,
		errors: []
	};

	// Initialiser resultsByTable si multi-table
	if (multiTable) {
		result.resultsByTable = {};
		config.selectedTables.forEach((table) => {
			result.resultsByTable![table] = {
				validRows: 0,
				inserted: 0,
				updated: 0
			};
		});
	}

	// Validation du format CSV d'abord
	if (Array.isArray(config.data)) {
		const csvErrors = validateCSVFormat(config.data);
		if (csvErrors.length > 0) {
			result.invalidData.push(...csvErrors);
		}
	}

	// Valider directement contre les tables sélectionnées (plus de résolution de vues)
	const allValidationRules = await Promise.all(
		config.selectedTables.map(async (tableIdentifier) => {
			const { database, tableName } = parseTableIdentifier(tableIdentifier);
			return {
				table: tableIdentifier,
				tableName,
				rules: await getTableValidationRules(database, tableName)
			};
		})
	);

	// Préparation pour le traitement
	const columnMap = prepareColumnMap(config.mappedFields);

	// Validation ligne par ligne
	if (Array.isArray(config.data)) {
		for (let rowIndex = 0; rowIndex < config.data.length; rowIndex++) {
			const row = config.data[rowIndex];

			if (multiTable) {
				// Mode multi-table : vérifier pour toutes les tables
				let isValidForAnyTable = false;

				for (const { table, rules } of allValidationRules) {
					const tempResult: ImportResult = {
						totalRows: 0,
						validRows: 0,
						duplicates: 0,
						invalidData: [],
						processed: false,
						inserted: 0,
						updated: 0,
						errors: []
					};

					const validationResult = validateRow(
						rowIndex,
						row,
						columnMap,
						rules,
						new Set<string>(), // Unique entries par table
						tempResult
					);

					if (validationResult) {
						if (
							!enableDatabaseCheck ||
							!(await checkExistingRecord(table, config.mappedFields, row))
						) {
							result.resultsByTable![table].validRows++;
							isValidForAnyTable = true;
						}
					}
				}

				if (isValidForAnyTable) {
					result.validRows++;
				} else {
					// Si la ligne n'est valide pour aucune table, ajouter une erreur générique
					result.invalidData.push({
						row: rowIndex,
						field: 'Général',
						value: 'Ligne entière',
						error: 'Ligne non valide pour aucune des tables sélectionnées'
					});
				}
			} else {
				// Mode simple table (API)
				const { rules } = allValidationRules[0]; // Une seule table
				const uniqueEntries = new Set<string>();

				const validationResult = validateRow(
					rowIndex,
					row,
					columnMap,
					rules,
					uniqueEntries,
					result
				);

				if (validationResult) {
					if (enableDatabaseCheck) {
						const existingRecord = await checkExistingRecord(
							config.selectedTables[0],
							config.mappedFields,
							row
						);
						if (existingRecord) {
							result.duplicates++;
							result.invalidData.push({
								row: rowIndex,
								field: rules.uniqueFields.join(', '),
								value: existingRecord,
								error: 'Existe déjà dans la base de données'
							});
						} else {
							result.validRows++;
						}
					} else {
						result.validRows++;
					}
				}
			}
		}
	}

	return result;
}

// Fonction pour traiter les updates avec validation
async function updateValidatedData(
	config: ImportConfig,
	validRowsSet: Set<number>,
	options: InsertionOptions = {}
): Promise<InsertionResult> {
	const { useTransaction = false, prismaClient } = options;

	let insertedCount = 0;
	let updatedCount = 0;
	const errors: string[] = [];

	console.log(`🔄 [UPDATE] Traitement import`, {
		tables: config.selectedTables.length,
		rows: config.data.length
	});

	try {
		if (useTransaction && prismaClient) {
			// Mode transaction (SvelteKit)
			const client = prismaClient as {
				$transaction: (fn: (tx: unknown) => Promise<void>) => Promise<void>;
			};
			await client.$transaction(async () => {
				for (const table of config.selectedTables) {
					const result = await updateTableData(config, table, validRowsSet);
					insertedCount += result.inserted;
					updatedCount += result.updated;
					errors.push(...result.errors);
				}
			});
		} else {
			// Mode direct (API)
			const table = config.targetTable || config.selectedTables[0];
			const result = await updateTableData(config, table, validRowsSet);
			insertedCount = result.inserted;
			updatedCount = result.updated;
			errors.push(...result.errors);
		}
	} catch (err) {
		console.log(`❌ [UPDATE] Erreur updateValidatedData:`, err);
		console.log(`❌ [UPDATE] Stack trace:`, err instanceof Error ? err.stack : 'Pas de stack');
		errors.push(`Erreur d'update: ${formatError(err)}`);
	}

	console.log(`✅ [UPDATE] Résultat: +${insertedCount} ~${updatedCount} ⚠${errors.length}`);

	return {
		inserted: insertedCount,
		updated: updatedCount,
		errors
	};
}

// UPDATE MINIMAL - Cherche par ID et met à jour
async function updateTableData(
	config: ImportConfig,
	tableIdentifier: string,
	validRowsSet: Set<number>
): Promise<InsertionResult & { updated: number }> {
	let inserted = 0;
	let updated = 0;
	const errors: string[] = [];

	const { database, tableName } = parseTableIdentifier(tableIdentifier);

	for (let rowIndex = 0; rowIndex < config.data.length; rowIndex++) {
		if (!validRowsSet.has(rowIndex)) continue;

		const row = config.data[rowIndex];

		try {
			// Utiliser la clé primaire du cache DMMF (dynamique, pas de hardcoding)
			const primaryKeyFields = globalPrimaryKeys.get(tableIdentifier) || [];

			const whereCondition: Record<string, unknown> = {};
			let existingRecord = null;

			if (primaryKeyFields.length > 0) {
				// Construire condition avec TOUS les champs de la clé primaire (simple ou composite)
				primaryKeyFields.forEach((field) => {
					const colIndex = Object.entries(config.mappedFields).find(([, f]) => f === field)?.[0];
					if (colIndex !== undefined) {
						const rawValue = row[parseInt(colIndex)];
						const formattedValue = formatValueForDatabase(field, rawValue, tableIdentifier);
						whereCondition[field] = formattedValue;
					}
				});

				// Debug pour price_purchase
				if (tableName === 'price_purchase') {
					console.log(`🔑 [PRICE_PURCHASE-KEY] PK fields (DMMF):`, primaryKeyFields);
					console.log(
						`🔑 [PRICE_PURCHASE-KEY] Where condition:`,
						JSON.stringify(whereCondition, null, 2)
					);
				}

				if (Object.keys(whereCondition).length > 0) {
					existingRecord = await findRecord(database, tableName, whereCondition);

					if (tableName === 'price_purchase') {
						console.log(`🔑 [PRICE_PURCHASE-KEY] Existing record found:`, !!existingRecord);
					}
				}
			}

			if (existingRecord) {
				// 3. UPDATE - Préparer les données
				const updateData: Record<string, unknown> = {};
				Object.entries(config.mappedFields).forEach(([columnIndex, fieldName]) => {
					if (fieldName && row[parseInt(columnIndex)] !== undefined) {
						updateData[fieldName] = formatValueForDatabase(
							fieldName,
							row[parseInt(columnIndex)],
							tableIdentifier
						);
					}
				});

				// 4. Exécuter UPDATE avec la whereCondition appropriée
				const result = await updateRecord(database, tableName, whereCondition, updateData);

				if (result.count > 0) {
					updated++;
					if (
						tableName === 'famille' &&
						primaryKeyFields.length === 1 &&
						whereCondition[primaryKeyFields[0]] === 1
					) {
						console.log(`✅ [FAMILLE-1-SIMPLE] UPDATE réussi`);
					}
				}
			} else {
				// INSERT si n'existe pas
				const insertData: Record<string, unknown> = {};
				Object.entries(config.mappedFields).forEach(([columnIndex, fieldName]) => {
					if (fieldName && row[parseInt(columnIndex)] !== undefined) {
						insertData[fieldName] = formatValueForDatabase(
							fieldName,
							row[parseInt(columnIndex)],
							tableIdentifier
						);
					}
				});

				// Debug pour price_purchase
				if (tableName === 'price_purchase') {
					console.log(`💾 [PRICE_PURCHASE-INSERT] Table: ${tableName}`);
					console.log(
						`💾 [PRICE_PURCHASE-INSERT] Insert Data:`,
						JSON.stringify(insertData, null, 2)
					);
					console.log(
						`💾 [PRICE_PURCHASE-INSERT] Types:`,
						Object.entries(insertData).map(([k, v]) => `${k}: ${typeof v}`)
					);
				}

				await createRecord(database, tableName, insertData);
				inserted++;
			}
		} catch (err) {
			const errorMessage = `Ligne ${rowIndex + 1}: ${formatError(err)}`;
			console.log(`❌ [ROW-ERROR] ${errorMessage}`);
			errors.push(errorMessage);
		}
	}

	return { inserted, updated, errors };
}

// ========== FONCTIONS UTILITAIRES COMMUNES ==========

// Détermine le mode de traitement (mono/multi-table) et les tables finales
function determineImportMode(selectedTables: string[], targetTable?: string) {
	const finalSelectedTables =
		selectedTables.length > 0 ? selectedTables : targetTable ? [targetTable] : [];

	return {
		finalSelectedTables,
		isMultiTable: finalSelectedTables.length > 1
	};
}

// Construit la configuration d'importation commune

function buildImportConfig(
	data: unknown[][],
	mappedFields: Record<string, string>,
	finalSelectedTables: string[],
	targetTable?: string
): ImportConfig {
	return {
		data,
		mappedFields,
		selectedTables: finalSelectedTables,
		targetTable
	};
}

// Exécute la validation avec les options communes

async function executeValidation(
	config: ImportConfig,
	isMultiTable: boolean
): Promise<ImportResult> {
	return await validateImportData(config, {
		multiTable: isMultiTable,
		enableDatabaseCheck: true
	});
}

// ========== ACTIONS SVELTEKIT UNIFIÉES ==========

export const actions: Actions = {
	// Action de validation unifiée (détection automatique mono/multi-table)
	validate: async (event) => {
		await protect(event);

		const { request } = event;
		try {
			// Validation du formulaire avec SuperForms
			const form = await superValidate(request, zod4(importSchema));

			if (!form.valid) {
				return fail(400, { form });
			}

			const { data, mappedFields, selectedTables, targetTable } = form.data;

			// Utilisation des fonctions utilitaires
			const { finalSelectedTables, isMultiTable } = determineImportMode(
				selectedTables,
				targetTable
			);
			const config = buildImportConfig(data, mappedFields, finalSelectedTables, targetTable);
			const result = await executeValidation(config, isMultiTable);

			// Retourner un formulaire avec le résultat intégré
			return {
				form: {
					...form,
					data: {
						data: data || [],
						mappedFields: mappedFields || {},
						selectedTables: finalSelectedTables,
						targetTable: targetTable || '',
						result
					}
				}
			};
		} catch (err) {
			return fail(500, {
				error: `Erreur de validation: ${formatError(err)}`
			});
		}
	},

	// Action de traitement INTELLIGENTE (détection automatique INSERT/UPDATE)
	process: async (event) => {
		await protect(event);

		const { request } = event;
		try {
			// Validation du formulaire avec SuperForms
			const form = await superValidate(request, zod4(importSchema));

			if (!form.valid) {
				return fail(400, { form });
			}

			const { data, mappedFields, selectedTables, targetTable } = form.data;

			// Utilisation des fonctions utilitaires
			const { finalSelectedTables, isMultiTable } = determineImportMode(
				selectedTables,
				targetTable
			);
			const config = buildImportConfig(data, mappedFields, finalSelectedTables, targetTable);
			const validationResult = await executeValidation(config, isMultiTable);

			// Calculer les lignes valides depuis le résultat de validation
			const validRowsSet = calculateValidRowsSet(validationResult, config.data.length);

			// LOGIQUE INTELLIGENTE : Utiliser updateTableData qui fait INSERT/UPDATE automatiquement
			const smartResult = await updateValidatedData(config, validRowsSet, {
				useTransaction: isMultiTable, // Transaction uniquement en multi-table
				prismaClient: isMultiTable ? prisma : undefined
			});

			const result: ImportResult = {
				...validationResult,
				processed: true,
				inserted: smartResult.inserted,
				updated: smartResult.updated,
				errors: smartResult.errors
			};

			// Après un import réussi, reset le formulaire pour un nouvel import
			const resetForm = await superValidate(zod4(importSchema));

			return {
				form: {
					...resetForm,
					data: {
						data: [],
						mappedFields: {},
						selectedTables: [],
						targetTable: '',
						result
					}
				}
			};
		} catch (err) {
			return fail(500, {
				error: `Erreur d'importation: ${formatError(err)}`
			});
		}
	}
};

// Pour SuperForms, nous devons également fournir la fonction de chargement
export const load: ServerLoad = async (event) => {
	// Protection de la route - redirection vers / si non connecté
	await protect(event);

	try {
		// 🚀 PRÉ-CHARGEMENT CRITIQUE: Charger TOUS les types Prisma avant tout
		await preloadAllFieldTypes();

		// Initialisation d'un formulaire vide
		const form = await superValidate(zod4(importSchema));

		// Récupérer les tables et champs importables via DMMF
		const availableTables = await getImportableTables();
		const rawTableFields = await getImportableTableFields();
		const rawTableRequiredFields = await getImportableTableRequiredFields();

		// Obtenir les databases disponibles dynamiquement
		const databases = await getAllDatabaseNames();

		// Transformer les données pour le frontend
		const formattedTables = availableTables.map((table) => ({
			value: `${table.database}:${table.name}`, // Inclure database pour unicité
			name: table.displayName,
			displayName: table.displayName,
			category: table.schema, // produit/public (schéma)
			tableType: table.category, // table/view (type réel)
			database: table.database,
			rowCount: table.rowCount,
			columns: table.columns
		}));

		// Les clés sont déjà au format database:tableName depuis prisma-meta
		const tableFields = rawTableFields;
		const tableRequiredFields = rawTableRequiredFields;

		return {
			form,
			availableTables: formattedTables,
			tableFields,
			tableRequiredFields,
			databases
		};
	} catch (err) {
		throw new Error(`Erreur lors du chargement de la page import: ${formatError(err)}`);
	}
};
