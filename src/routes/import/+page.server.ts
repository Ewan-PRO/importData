import type { Actions, ServerLoad } from '@sveltejs/kit';
import { fail } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';
import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';
import { zod } from 'sveltekit-superforms/adapters';
import { protect } from '$lib/auth/protect';
import {
	getImportableTables,
	getImportableTableFields,
	getImportableTableRequiredFields,
	getTableValidationRules,
	createRecord,
	findRecord,
	parseTableIdentifier,
	type ValidationRules
} from '$lib/prisma-meta';

const prisma = new PrismaClient();

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

// Types SvelteKit spécifiques
interface ImportResult extends ValidationResult {
	inserted: number;
	updated: number;
	errors: string[];
}

// Schéma de validation unifié (détection automatique mono/multi-table)
const importSchema = z.object({
	data: z.array(z.array(z.unknown())),
	mappedFields: z.record(z.string()),
	selectedTables: z.array(z.string()),
	targetTable: z.string().optional() // Rétrocompatibilité API
});

// ========== FONCTIONS UTILITAIRES ==========

function calculateValidRowsSet(result: ValidationResult, totalRows: number): Set<number> {
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

function formatValueForDatabase(field: string, value: unknown): unknown {
	// Si la valeur est null ou undefined, retourner null
	if (value === null || value === undefined || value === '') {
		return null;
	}

	// Conversion spécifique pour les champs ID/FK (entiers)
	if (field.includes('_id') || field.includes('fk_') || field.includes('_qty')) {
		const numValue = parseInt(String(value), 10);
		return isNaN(numValue) ? null : numValue;
	}

	// Conversion selon le type de champ
	if (field.includes('_valeur')) {
		// Conversion en nombre décimal
		const numValue = parseFloat(String(value).replace(',', '.'));
		return isNaN(numValue) ? null : numValue;
	}

	// Par défaut, retourner la valeur comme chaîne de caractères avec trim
	return String(value).trim();
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

async function checkExistingRecord(
	tableIdentifier: string,
	mappedFields: Record<string, string>,
	row: unknown[]
): Promise<string | null> {
	const whereCondition: Record<string, unknown> = {};
	const { database, tableName } = parseTableIdentifier(tableIdentifier);
	const validationRules = await getTableValidationRules(database, tableName);
	const uniqueFields = validationRules.uniqueFields;

	// Construction de la condition avec les champs uniques
	uniqueFields.forEach((field) => {
		const colIndex = Object.entries(mappedFields).find(([, f]) => f === field)?.[0];
		if (colIndex !== undefined) {
			const rawValue = row[parseInt(colIndex)];
			const formattedValue = formatValueForDatabase(field, rawValue);
			whereCondition[field] = formattedValue;
		}
	});

	// Si aucun champ unique trouvé, on ne peut pas vérifier
	if (Object.keys(whereCondition).length === 0) {
		return null;
	}

	try {
		// Recherche dans la table appropriée via DMMF générique
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

// ========== FONCTIONS D'ORCHESTRATION ==========

async function validateImportData(
	config: ImportConfig,
	options: ValidationOptions = {}
): Promise<ValidationResult> {
	const { multiTable = false, enableDatabaseCheck = true } = options;

	const result: ValidationResult = {
		totalRows: Array.isArray(config.data) ? config.data.length : 0,
		validRows: 0,
		duplicates: 0,
		invalidData: [],
		processed: false
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

	// Obtenir les règles de validation pour toutes les tables sélectionnées
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
					const tempResult: ValidationResult = {
						totalRows: 0,
						validRows: 0,
						duplicates: 0,
						invalidData: [],
						processed: false
					};

					const validationResult = validateRow(
						rowIndex,
						row,
						columnMap,
						rules,
						new Set<string>(), // Unique entries par table
						tempResult
					);

					if (validationResult && enableDatabaseCheck) {
						// Vérification des doublons avec la base de données pour cette table
						const existingRecord = await checkExistingRecord(table, config.mappedFields, row);

						if (!existingRecord) {
							// Ligne valide pour cette table spécifique
							result.resultsByTable![table].validRows++;
							isValidForAnyTable = true;
						}
					} else if (validationResult) {
						result.resultsByTable![table].validRows++;
						isValidForAnyTable = true;
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

				// Vérification des doublons avec la base de données
				if (validationResult && enableDatabaseCheck) {
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
				} else if (validationResult) {
					result.validRows++;
				}
			}
		}
	}

	return result;
}

async function insertValidatedData(
	config: ImportConfig,
	validRowsSet: Set<number>,
	options: InsertionOptions = {}
): Promise<InsertionResult> {
	const { useTransaction = false, prismaClient } = options;

	let insertedCount = 0;
	let updatedCount = 0;
	const errors: string[] = [];

	try {
		if (useTransaction && prismaClient) {
			// Mode transaction (SvelteKit)
			const client = prismaClient as {
				$transaction: (fn: (tx: unknown) => Promise<void>) => Promise<void>;
			};
			await client.$transaction(async () => {
				for (const table of config.selectedTables) {
					const result = await processTableData(config, table, validRowsSet);
					insertedCount += result.inserted;
					updatedCount += result.updated;
					errors.push(...result.errors);
				}
			});
		} else {
			// Mode direct (API)
			const table = config.targetTable || config.selectedTables[0];
			const result = await processTableData(config, table, validRowsSet);
			insertedCount = result.inserted;
			updatedCount = result.updated;
			errors.push(...result.errors);
		}
	} catch (err) {
		console.error("❌ Erreur lors de l'insertion:", err);
		errors.push(`Erreur d'insertion: ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
	}

	return {
		inserted: insertedCount,
		updated: updatedCount,
		errors
	};
}

async function processTableData(
	config: ImportConfig,
	tableIdentifier: string,
	validRowsSet: Set<number>
): Promise<InsertionResult> {
	let inserted = 0;
	const updated = 0;
	const errors: string[] = [];

	const { database, tableName } = parseTableIdentifier(tableIdentifier);

	for (let rowIndex = 0; rowIndex < config.data.length; rowIndex++) {
		// Seulement traiter les lignes marquées comme valides
		if (!validRowsSet.has(rowIndex)) {
			continue;
		}

		const row = config.data[rowIndex];

		try {
			// Vérifier une dernière fois que la ligne n'existe pas déjà en base
			const existingRecord = await checkExistingRecord(tableIdentifier, config.mappedFields, row);

			if (!existingRecord) {
				// Préparer les données pour l'insertion
				const insertData: Record<string, unknown> = {};

				Object.entries(config.mappedFields).forEach(([columnIndex, fieldName]) => {
					if (fieldName && row[parseInt(columnIndex)] !== undefined) {
						insertData[fieldName] = formatValueForDatabase(fieldName, row[parseInt(columnIndex)]);
					}
				});

				// Insérer dans la table appropriée
				await createRecord(database, tableName, insertData);
				inserted++;
			}
		} catch (err) {
			console.error(`Erreur lors de l'importation de la ligne ${rowIndex}:`, err);
			errors.push(
				`Ligne ${rowIndex + 1}: ${err instanceof Error ? err.message : 'Erreur inconnue'}`
			);
		}
	}

	return { inserted, updated, errors };
}

// ========== ACTIONS SVELTEKIT UNIFIÉES ==========

export const actions: Actions = {
	// Action de validation unifiée (détection automatique mono/multi-table)
	validate: async (event) => {
		await protect(event);

		const { request } = event;
		try {
			// Validation du formulaire avec SuperForms
			const form = await superValidate(request, zod(importSchema));
			console.log('Formulaire reçu:', form);

			if (!form.valid) {
				console.error('Formulaire invalide:', form.errors);
				return fail(400, { form });
			}

			const { data, mappedFields, selectedTables, targetTable } = form.data;

			// Détection automatique du mode : priorité à selectedTables, fallback sur targetTable
			const finalSelectedTables = selectedTables.length > 0
				? selectedTables
				: targetTable ? [targetTable] : [];

			const isMultiTable = finalSelectedTables.length > 1;

			console.log(`🔄 Mode détecté: ${isMultiTable ? 'MULTI-TABLE' : 'SIMPLE'} (${finalSelectedTables.length} table(s))`);

			// Conversion vers format commun
			const config: ImportConfig = {
				data,
				mappedFields,
				selectedTables: finalSelectedTables,
				targetTable
			};

			// Validation avec mode automatique
			const result = await validateImportData(config, {
				multiTable: isMultiTable,
				enableDatabaseCheck: true
			});

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
			console.error('Erreur lors de la validation:', err);
			return fail(500, {
				error: `Erreur de validation: ${err instanceof Error ? err.message : 'Erreur inconnue'}`
			});
		}
	},

	// Action de traitement unifiée (détection automatique mono/multi-table)
	process: async (event) => {
		await protect(event);

		const { request } = event;
		try {
			// Validation du formulaire avec SuperForms
			const form = await superValidate(request, zod(importSchema));

			if (!form.valid) {
				return fail(400, { form });
			}

			const { data, mappedFields, selectedTables, targetTable } = form.data;

			// Détection automatique du mode : priorité à selectedTables, fallback sur targetTable
			const finalSelectedTables = selectedTables.length > 0
				? selectedTables
				: targetTable ? [targetTable] : [];

			const isMultiTable = finalSelectedTables.length > 1;

			console.log(`🔄 Mode détecté: ${isMultiTable ? 'MULTI-TABLE' : 'SIMPLE'} (${finalSelectedTables.length} table(s))`);

			// Conversion vers format commun
			const config: ImportConfig = {
				data,
				mappedFields,
				selectedTables: finalSelectedTables,
				targetTable
			};

			// Validation d'abord avec mode automatique
			const validationResult = await validateImportData(config, {
				multiTable: isMultiTable,
				enableDatabaseCheck: true
			});

			// Calculer les lignes valides depuis le résultat de validation
			const validRowsSet = calculateValidRowsSet(validationResult, config.data.length);

			// Insertion avec transaction selon le mode
			const insertResult = await insertValidatedData(config, validRowsSet, {
				useTransaction: isMultiTable, // Transaction uniquement en multi-table
				prismaClient: isMultiTable ? prisma : undefined
			});

			const result: ImportResult = {
				...validationResult,
				processed: true,
				inserted: insertResult.inserted,
				updated: insertResult.updated,
				errors: insertResult.errors
			};

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
			console.error("Erreur lors de l'importation:", err);
			return fail(500, {
				error: `Erreur d'importation: ${err instanceof Error ? err.message : 'Erreur inconnue'}`
			});
		}
	}
};

// Fonction helper pour déterminer la catégorie d'une table basée sur le schéma
function getCategoryFromTable(table: {
	name: string;
	displayName: string;
	category: string;
	schema: string;
}): string {
	// Utiliser le schéma comme catégorie principale
	return table.schema;
}

// Pour SuperForms, nous devons également fournir la fonction de chargement
export const load: ServerLoad = async (event) => {
	// Protection de la route - redirection vers / si non connecté
	await protect(event);

	const { url } = event;
	console.log('🚀 [IMPORT] Début du chargement de la page import');
	console.log('🔍 [IMPORT] URL:', url.pathname);

	try {
		console.log('📝 [IMPORT] Création du formulaire SuperForms pour import');

		// Initialisation d'un formulaire vide
		const form = await superValidate(zod(importSchema));

		// Récupérer les tables et champs importables via DMMF
		console.log('📊 [IMPORT] Récupération des tables importables via DMMF');
		const availableTables = await getImportableTables();
		const rawTableFields = await getImportableTableFields();
		const rawTableRequiredFields = await getImportableTableRequiredFields();

		// Transformer les données pour le frontend
		const formattedTables = availableTables.map((table) => ({
			value: `${table.database}:${table.name}`, // Inclure database pour unicité
			name: table.displayName,
			displayName: table.displayName,
			category: getCategoryFromTable(table), // produit/public (schéma)
			tableType: table.category, // table/view (type réel)
			database: table.database,
			rowCount: table.rowCount,
			columns: table.columns
		}));

		// Les clés sont déjà au format database:tableName depuis prisma-meta
		const tableFields = rawTableFields;
		const tableRequiredFields = rawTableRequiredFields;

		console.log('📝 [IMPORT] Formulaire créé:', {
			valid: form.valid,
			hasErrors: Object.keys(form.errors || {}).length > 0,
			tablesCount: formattedTables.length,
			fieldsCount: Object.keys(tableFields).length,
			requiredFieldsCount: Object.keys(tableRequiredFields).length
		});

		console.log('✅ [IMPORT] Chargement terminé avec succès');
		return {
			form,
			availableTables: formattedTables,
			tableFields,
			tableRequiredFields
		};
	} catch (err) {
		console.error('❌ [IMPORT] Erreur dans le chargement de la page import:', err);
		console.error('❌ [IMPORT] Stack trace:', err instanceof Error ? err.stack : 'N/A');
		throw new Error(
			`Erreur lors du chargement de la page import: ${err instanceof Error ? err.message : 'Erreur inconnue'}`
		);
	}
};