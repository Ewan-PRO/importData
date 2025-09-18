import type { Actions, ServerLoad } from '@sveltejs/kit';
import { fail } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';
import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';
import { zod } from 'sveltekit-superforms/adapters';
import { protect } from '$lib/auth/protect';
import {
	getTableValidationRules,
	getImportableTables,
	getImportableTableFields,
	getImportableTableRequiredFields,
	createRecord as createRecordGeneric,
	updateRecord,
	findRecord,
	detectDatabaseForTable,
	parseTableIdentifier,
	type ValidationRules
} from '$lib/prisma-meta';

const prisma = new PrismaClient();

// Types pour les données et les fonctions
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
	resultsByTable?: Record<
		string,
		{
			validRows: number;
			inserted: number;
			updated: number;
		}
	>;
}

interface ImportResult extends ValidationResult {
	inserted: number;
	updated: number;
	errors: string[];
}

// ValidationRules est maintenant importé de prisma-meta.ts

// Type pour la transaction Prisma
type PrismaTransactionClient = Omit<
	PrismaClient,
	'$connect' | '$disconnect' | '$on' | '$transaction' | '$use'
>;

// Schéma de validation pour les données d'importation
const importSchema = z.object({
	data: z.array(z.array(z.unknown())),
	mappedFields: z.record(z.string()),
	selectedTables: z.array(z.string())
});


// Nouvelle fonction pour valider le format CSV
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


export const actions: Actions = {
	validate: async (event) => {
		// Protection de l'action - redirection vers / si non connecté
		await protect(event);

		const { request } = event;
		try {
			console.log('Début de la validation côté serveur');
			// Validation du formulaire avec SuperForms
			const form = await superValidate(request, zod(importSchema));
			console.log('Formulaire reçu:', form);

			if (!form.valid) {
				console.error('Formulaire invalide:', form.errors);
				return fail(400, { form });
			}

			const { data, mappedFields, selectedTables } = form.data;

			const result: ValidationResult = {
				totalRows: Array.isArray(data) ? data.length : 0,
				validRows: 0,
				duplicates: 0,
				invalidData: [],
				processed: false,
				resultsByTable: {}
			};

			// Initialiser les compteurs par table
			selectedTables.forEach((table) => {
				result.resultsByTable![table] = {
					validRows: 0,
					inserted: 0,
					updated: 0
				};
			});

			// Validation du format CSV d'abord
			if (Array.isArray(data)) {
				const csvErrors = validateCSVFormat(data);
				if (csvErrors.length > 0) {
					result.invalidData.push(...csvErrors);

					return {
						form: {
							...form,
							data: {
								data: data || [],
								mappedFields: mappedFields || {},
								selectedTables: selectedTables || [],
								result
							}
						}
					};
				}

			}

			// Obtenir les règles de validation pour toutes les tables sélectionnées via DMMF
			const allValidationRules = await Promise.all(
				selectedTables.map(async (tableIdentifier) => {
					const { database, tableName } = parseTableIdentifier(tableIdentifier);
					return {
						table: tableIdentifier,
						tableName,
						rules: await getTableValidationRules(database, tableName)
					};
				})
			);

			// Préparation pour le traitement
			const columnMap = prepareColumnMap(mappedFields);

			// Validation ligne par ligne pour toutes les tables
			if (Array.isArray(data)) {
				for (let rowIndex = 0; rowIndex < data.length; rowIndex++) {
					const row = data[rowIndex];

					let isValidForAnyTable = false;

					// Valider pour chaque table sélectionnée
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

						if (validationResult) {
							// Vérification des doublons avec la base de données pour cette table
							const existingRecord = await checkExistingRecord(table, mappedFields, row);

							if (!existingRecord) {
								// Ligne valide pour cette table spécifique
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
				}
			}

			// Retourner un formulaire avec le résultat intégré
			return {
				form: {
					...form,
					data: {
						data: data || [],
						mappedFields: mappedFields || {},
						selectedTables: selectedTables || [],
						result // Inclure explicitement le résultat ici
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

	process: async (event) => {
		// Protection de l'action - redirection vers / si non connecté
		await protect(event);

		const { request } = event;
		try {
			// Validation du formulaire avec SuperForms
			const form = await superValidate(request, zod(importSchema));

			if (!form.valid) {
				return fail(400, { form });
			}

			const { data, mappedFields, selectedTables } = form.data;

			const result: ImportResult = {
				totalRows: Array.isArray(data) ? data.length : 0,
				validRows: 0,
				duplicates: 0,
				invalidData: [],
				inserted: 0,
				updated: 0,
				errors: [],
				processed: true,
				resultsByTable: {}
			};

			// Initialiser les compteurs par table
			selectedTables.forEach((table) => {
				result.resultsByTable![table] = {
					validRows: 0,
					inserted: 0,
					updated: 0
				};
			});

			// Validation du format CSV avant traitement
			if (Array.isArray(data)) {
				const csvErrors = validateCSVFormat(data);
				if (csvErrors.length > 0) {
					result.invalidData.push(...csvErrors);
					result.errors.push(`${csvErrors.length} erreur(s) de format CSV détectée(s)`);

					return {
						form: {
							...form,
							data: {
								data: data || [],
								mappedFields: mappedFields || {},
								selectedTables: selectedTables || [],
								result
							}
						}
					};
				}

			}

			// Préparation pour le traitement
			const columnMap = prepareColumnMap(mappedFields);
			const allValidationRules = await Promise.all(
				selectedTables.map(async (tableIdentifier) => {
					const { database, tableName } = parseTableIdentifier(tableIdentifier);
					return {
						table: tableIdentifier,
						tableName,
						rules: await getTableValidationRules(database, tableName)
					};
				})
			);

			// Pré-validation pour identifier les lignes valides pour chaque table
			const validRowsByTable: Record<string, { index: number; row: unknown[] }[]> = {};
			selectedTables.forEach((table) => {
				validRowsByTable[table] = [];
			});

			if (Array.isArray(data)) {
				for (let rowIndex = 0; rowIndex < data.length; rowIndex++) {
					const row = data[rowIndex];
					if (!Array.isArray(row)) continue;

					// Valider la ligne pour chaque table sélectionnée
					for (const { table, rules } of allValidationRules) {
						const tempResult: ValidationResult = {
							totalRows: 0,
							validRows: 0,
							duplicates: 0,
							invalidData: [],
							processed: false
						};

						const isValid = validateRow(
							rowIndex,
							row,
							columnMap,
							rules,
							new Set<string>(),
							tempResult
						);

						if (isValid) {
							// Vérifier les doublons en base pour cette table
							const existingRecord = await checkExistingRecord(table, mappedFields, row);
							if (!existingRecord) {
								validRowsByTable[table].push({ index: rowIndex, row });
							}
						}
					}
				}
			}

			// Traitement des données en transaction pour toutes les tables
			await prisma.$transaction(async (tx) => {
				for (const table of selectedTables) {
					const validRowsForTable = validRowsByTable[table];

					for (const { index, row } of validRowsForTable) {
						await processRow(row, index, columnMap, table, tx as PrismaTransactionClient, result);
					}
				}
			});

			// Retourner un formulaire avec le résultat intégré
			return {
				form: {
					...form,
					data: {
						data: data || [],
						mappedFields: mappedFields || {},
						selectedTables: selectedTables || [],
						result // Inclure explicitement le résultat ici
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

// Prépare le mappage inversé des colonnes
function prepareColumnMap(mappedFields: Record<string, string>): ColumnMap {
	const columnMap: ColumnMap = {};
	Object.entries(mappedFields).forEach(([index, field]) => {
		if (field) columnMap[field] = parseInt(index);
	});
	return columnMap;
}

// Valide une ligne complète
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

// Vérifie les champs requis
function validateRequiredFields(
	rowIndex: number,
	row: unknown[],
	columnMap: ColumnMap,
	validationRules: ValidationRules,
	result: ValidationResult
): boolean {
	for (const fieldName of validationRules.requiredFields) {
		const colIndex = columnMap[fieldName];

		if (colIndex === undefined || row[colIndex] === undefined || row[colIndex] === '') {
			result.invalidData.push({
				row: rowIndex,
				field: fieldName,
				value: formatDisplayValue(row[colIndex]),
				error: 'Champ obligatoire manquant'
			});
			return false;
		}
	}

	return true;
}

// Vérifie le format des données
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

// Vérifie les doublons internes
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

// Traite une ligne pour l'importation
async function processRow(
	row: unknown[],
	rowIndex: number,
	columnMap: ColumnMap,
	targetTableIdentifier: string,
	tx: PrismaTransactionClient,
	result: ImportResult
): Promise<void> {
	try {
		// Préparation des données pour l'importation
		const recordData: Record<string, unknown> = {};
		const { database, tableName } = parseTableIdentifier(targetTableIdentifier);
		const validationRules = await getTableValidationRules(database, tableName);

		Object.entries(columnMap).forEach(([field, colIndex]) => {
			const value = row[colIndex];

			// Inclure si c'est un champ obligatoire OU si la valeur n'est pas vide
			if (validationRules.requiredFields.includes(field) || (value !== undefined && value !== '')) {
				const formattedValue = formatValueForDatabase(field, value);
				recordData[field] = formattedValue;
			}
		});

		// Vérification si le record existe déjà
		const existingRecord = await checkExistingRecord(
			targetTableIdentifier,
			Object.fromEntries(Object.entries(columnMap).map(([k, v]) => [v.toString(), k])),
			row
		);

		if (existingRecord) {
			// Mise à jour d'un enregistrement existant
			await updateRecordGeneric(tableName, recordData);
			result.updated++;
			if (result.resultsByTable && result.resultsByTable[targetTableIdentifier]) {
				result.resultsByTable[targetTableIdentifier].updated++;
			}
		} else {
			// Création d'un nouvel enregistrement
			await createRecord(tx, tableName, recordData);
			result.inserted++;
			if (result.resultsByTable && result.resultsByTable[targetTableIdentifier]) {
				result.resultsByTable[targetTableIdentifier].inserted++;
			}
		}

		result.validRows++;
	} catch (err) {
		console.error(`Erreur lors de l'importation de la ligne ${rowIndex}:`, err);
		result.errors.push(
			`Ligne ${rowIndex + 1}: ${err instanceof Error ? err.message : 'Erreur inconnue'}`
		);
	}
}

// Fonction pour mettre à jour un enregistrement existant via DMMF
async function updateRecordGeneric(
	tableName: string,
	recordData: Record<string, unknown>
): Promise<void> {
	const uniqueConstraint = await getUniqueConstraint(tableName, recordData);
	const database = await detectDatabaseForTable(tableName);

	await updateRecord(database, tableName, uniqueConstraint, recordData);
}

// Fonction pour créer un nouvel enregistrement
async function createRecord(
	tx: PrismaTransactionClient,
	tableName: string,
	recordData: Record<string, unknown>
): Promise<void> {
	const database = await detectDatabaseForTable(tableName);

	await createRecordGeneric(database, tableName, recordData);
}

// Fonction sécurisée pour convertir en string pour affichage
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

async function checkExistingRecord(
	tableIdentifier: string,
	mappedFields: Record<string, string>,
	row: unknown[]
): Promise<string | null> {
	// Préparation de la condition de recherche
	const whereCondition: Record<string, unknown> = {};
	const { database, tableName } = parseTableIdentifier(tableIdentifier);
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

	// Par défaut, retourner la valeur comme chaîne de caractères
	return String(value);
}

async function getUniqueConstraint(
	tableName: string,
	data: Record<string, unknown>
): Promise<Record<string, unknown>> {
	const database = await detectDatabaseForTable(tableName);
	const validationRules = await getTableValidationRules(database, tableName);
	const uniqueFields = validationRules.uniqueFields;
	const constraint: Record<string, unknown> = {};

	uniqueFields.forEach((field) => {
		if (data[field] !== undefined) {
			constraint[field] = data[field];
		}
	});

	return constraint;
}



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
			name: `${table.displayName} (${table.database === 'cenov' ? 'Production' : 'Dev'})`,
			category: getCategoryFromTable(table)
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
