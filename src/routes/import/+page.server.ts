import type { Actions, ServerLoad } from '@sveltejs/kit';
import { fail } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';
import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';
import { zod } from 'sveltekit-superforms/adapters';

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
}

interface ImportResult extends ValidationResult {
	inserted: number;
	updated: number;
	errors: string[];
}

interface ValidationRules {
	requiredFields: string[];
	uniqueFields: string[];
	validators: Record<string, (value: unknown) => boolean>;
}

// Type pour la transaction Prisma
type PrismaTransactionClient = Omit<
	PrismaClient,
	'$connect' | '$disconnect' | '$on' | '$transaction' | '$use'
>;

// Schéma de validation pour les données d'importation
const importSchema = z.object({
	data: z.array(z.array(z.unknown())),
	mappedFields: z.record(z.string()),
	targetTable: z.string()
});

type AttributeData = {
	atr_nat: string;
	atr_val: string;
	atr_label?: string;
};

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

// Nouvelle fonction pour valider atr_0_label spécifiquement
function validateAtr0Label(
	data: unknown[][],
	mappedFields: Record<string, string>,
	result: ValidationResult
): void {
	const expectedValue = 'Catégorie des produits';

	// Trouver l'index de la colonne atr_0_label
	const atr0ColumnIndex = Object.entries(mappedFields).find(
		([, field]) => field === 'atr_0_label'
	)?.[0];

	if (atr0ColumnIndex === undefined) {
		return;
	}

	const columnIndex = parseInt(atr0ColumnIndex);

	data.forEach((row, rowIndex) => {
		if (!Array.isArray(row)) return;

		const value = row[columnIndex];
		const stringValue = typeof value === 'string' ? value.trim() : String(value ?? '');

		// Vérifier si la valeur n'est pas "Catégorie des produits"
		if (stringValue && stringValue !== expectedValue) {
			result.invalidData.push({
				row: rowIndex,
				field: 'atr_0_label',
				value: stringValue,
				error: `Valeur non conforme - doit être "${expectedValue}"`
			});
		}
	});
}

export const actions: Actions = {
	validate: async ({ request }) => {
		try {
			console.log('Début de la validation côté serveur');
			// Validation du formulaire avec SuperForms
			const form = await superValidate(request, zod(importSchema));
			console.log('Formulaire reçu:', form);

			if (!form.valid) {
				console.error('Formulaire invalide:', form.errors);
				return fail(400, { form });
			}

			const { data, mappedFields, targetTable } = form.data;
			console.log('Données extraites:', { data, mappedFields, targetTable });

			const result: ValidationResult = {
				totalRows: Array.isArray(data) ? data.length : 0,
				validRows: 0,
				duplicates: 0,
				invalidData: [],
				processed: false
			};
			console.log('Résultat initial:', result);

			// Validation du format CSV d'abord
			if (Array.isArray(data)) {
				const csvErrors = validateCSVFormat(data);
				if (csvErrors.length > 0) {
					result.invalidData.push(...csvErrors);
					console.log('Erreurs de format CSV détectées:', csvErrors);

					return {
						form: {
							...form,
							data: {
								data: data || [],
								mappedFields: mappedFields || {},
								targetTable: targetTable || '',
								result
							}
						}
					};
				}

				// Validation spécifique pour atr_0_label si c'est la table v_categories
				if (targetTable === 'v_categories') {
					validateAtr0Label(data, mappedFields, result);

					// Si des erreurs atr_0_label sont détectées, arrêter ici
					const atr0Errors = result.invalidData.filter((error) => error.field === 'atr_0_label');
					if (atr0Errors.length > 0) {
						console.log('Erreurs atr_0_label détectées:', atr0Errors);

						return {
							form: {
								...form,
								data: {
									data: data || [],
									mappedFields: mappedFields || {},
									targetTable: targetTable || '',
									result
								}
							}
						};
					}
				}
			}

			// Obtenir la structure de la table cible
			const validationRules = getValidationRules(targetTable);
			console.log('Règles de validation:', validationRules);

			// Préparation pour le traitement
			const columnMap = prepareColumnMap(mappedFields);
			console.log('Mappage des colonnes:', columnMap);
			const uniqueEntries = new Set<string>();

			// Validation ligne par ligne
			if (Array.isArray(data)) {
				console.log('Début de la validation des lignes');
				for (let rowIndex = 0; rowIndex < data.length; rowIndex++) {
					const row = data[rowIndex];
					console.log(`Validation de la ligne ${rowIndex}:`, row);
					const validationResult = validateRow(
						rowIndex,
						row,
						columnMap,
						validationRules,
						uniqueEntries,
						result
					);
					console.log(`Résultat de validation pour la ligne ${rowIndex}:`, validationResult);

					// Vérification des doublons avec la base de données
					if (validationResult) {
						const existingRecord = await checkExistingRecord(targetTable, mappedFields, row);
						console.log(`Vérification des doublons pour la ligne ${rowIndex}:`, existingRecord);

						if (existingRecord) {
							result.duplicates++;

							result.invalidData.push({
								row: rowIndex,
								field: validationRules.uniqueFields.join(', '),
								value: existingRecord,
								error: 'Existe déjà dans la base de données'
							});
						} else {
							result.validRows++;
						}
					}
				}
			}

			console.log('Résultat final de validation:', result);
			// Retourner un formulaire avec le résultat intégré
			return {
				form: {
					...form,
					data: {
						data: data || [],
						mappedFields: mappedFields || {},
						targetTable: targetTable || '',
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

	process: async ({ request }) => {
		try {
			// Validation du formulaire avec SuperForms
			const form = await superValidate(request, zod(importSchema));

			if (!form.valid) {
				return fail(400, { form });
			}

			const { data, mappedFields, targetTable } = form.data;

			const result: ImportResult = {
				totalRows: Array.isArray(data) ? data.length : 0,
				validRows: 0,
				duplicates: 0,
				invalidData: [],
				inserted: 0,
				updated: 0,
				errors: [],
				processed: true
			};

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
								targetTable: targetTable || '',
								result
							}
						}
					};
				}

				// Validation spécifique pour atr_0_label si c'est la table v_categories
				if (targetTable === 'v_categories') {
					validateAtr0Label(data, mappedFields, result);

					// Si des erreurs atr_0_label sont détectées, arrêter le traitement
					const atr0Errors = result.invalidData.filter((error) => error.field === 'atr_0_label');
					if (atr0Errors.length > 0) {
						result.errors.push(
							`${atr0Errors.length} ligne(s) rejetée(s) - valeur atr_0_label non conforme`
						);

						return {
							form: {
								...form,
								data: {
									data: data || [],
									mappedFields: mappedFields || {},
									targetTable: targetTable || '',
									result
								}
							}
						};
					}
				}
			}

			// Préparation pour le traitement
			const columnMap = prepareColumnMap(mappedFields);
			const validationRules = getValidationRules(targetTable);
			const uniqueEntries = new Set<string>();

			// Pré-validation pour identifier les lignes valides
			const validRows: { index: number; row: unknown[] }[] = [];

			if (Array.isArray(data)) {
				for (let rowIndex = 0; rowIndex < data.length; rowIndex++) {
					const row = data[rowIndex];
					if (!Array.isArray(row)) continue;

					// Valider la ligne
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
						validationRules,
						uniqueEntries,
						tempResult
					);

					if (isValid) {
						// Vérifier les doublons en base
						const existingRecord = await checkExistingRecord(targetTable, mappedFields, row);
						if (!existingRecord) {
							validRows.push({ index: rowIndex, row });
						}
					}
				}
			}

			console.log(`Lignes valides à traiter: ${validRows.length}`);

			// Traitement des données en transaction (seulement les lignes valides)
			await prisma.$transaction(async (tx) => {
				for (const { index, row } of validRows) {
					await processRow(
						row,
						index,
						columnMap,
						targetTable,
						tx as PrismaTransactionClient,
						result
					);
				}
			});

			// Retourner un formulaire avec le résultat intégré
			return {
				form: {
					...form,
					data: {
						data: data || [],
						mappedFields: mappedFields || {},
						targetTable: targetTable || '',
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
	targetTable: string,
	tx: PrismaTransactionClient,
	result: ImportResult
): Promise<void> {
	try {
		console.log(`=== Traitement ligne ${rowIndex} ===`);
		console.log('Données brutes de la ligne:', row);

		// Préparation des données pour l'importation
		const recordData: Record<string, unknown> = {};
		const validationRules = getValidationRules(targetTable);
		console.log('Règles de validation:', validationRules);
		console.log('Mappage des colonnes:', columnMap);

		Object.entries(columnMap).forEach(([field, colIndex]) => {
			const value = row[colIndex];
			console.log(`Champ ${field} (colonne ${colIndex}): valeur brute = "${value}"`);

			// Inclure si c'est un champ obligatoire OU si la valeur n'est pas vide
			if (validationRules.requiredFields.includes(field) || (value !== undefined && value !== '')) {
				const formattedValue = formatValueForDatabase(field, value);
				recordData[field] = formattedValue;
				console.log(`  -> Inclus dans recordData: ${field} = "${formattedValue}"`);
			} else {
				console.log(`  -> Exclu de recordData (optionnel et vide)`);
			}
		});

		console.log('RecordData final:', recordData);

		// Vérification si le record existe déjà
		const existingRecord = await checkExistingRecord(
			targetTable,
			Object.fromEntries(Object.entries(columnMap).map(([k, v]) => [v.toString(), k])),
			row,
			tx
		);
		console.log('Enregistrement existant trouvé:', existingRecord);

		if (existingRecord) {
			// Mise à jour d'un enregistrement existant
			console.log("-> Mise à jour d'un enregistrement existant");
			await updateRecord(tx, targetTable, recordData);
			result.updated++;
		} else {
			// Création d'un nouvel enregistrement
			console.log("-> Création d'un nouvel enregistrement");
			await createRecord(tx, targetTable, recordData);
			result.inserted++;
		}

		result.validRows++;
		console.log(`Ligne ${rowIndex} traitée avec succès`);
	} catch (err) {
		console.error(`Erreur lors de l'importation de la ligne ${rowIndex}:`, err);
		result.errors.push(
			`Ligne ${rowIndex + 1}: ${err instanceof Error ? err.message : 'Erreur inconnue'}`
		);
	}
}

// Fonction pour mettre à jour un enregistrement existant
async function updateRecord(
	tx: PrismaTransactionClient,
	targetTable: string,
	recordData: Record<string, unknown>
): Promise<void> {
	const uniqueConstraint = getUniqueConstraint(targetTable, recordData);

	switch (targetTable) {
		case 'attribute':
			await tx.attribute.updateMany({
				where: uniqueConstraint,
				data: recordData
			});
			break;
		case 'attribute_dev':
			await tx.attribute_dev.updateMany({
				where: uniqueConstraint,
				data: recordData
			});
			break;
		case 'supplier':
			await tx.supplier.updateMany({
				where: uniqueConstraint,
				data: recordData
			});
			break;
		// Les vues ne peuvent pas être mises à jour directement
	}
}

// Fonction pour créer un nouvel enregistrement
async function createRecord(
	tx: PrismaTransactionClient,
	targetTable: string,
	recordData: Record<string, unknown>
): Promise<void> {
	switch (targetTable) {
		case 'attribute':
			await tx.attribute.create({
				data: recordData as AttributeData
			});
			break;
		case 'attribute_dev':
			await tx.attribute_dev.create({
				data: recordData as AttributeData
			});
			break;
		case 'supplier':
			// Vérifier que sup_code est défini pour supplier
			if (!recordData.sup_code || recordData.sup_code === null) {
				throw new Error('Le champ sup_code est obligatoire pour les fournisseurs');
			}
			await tx.supplier.create({
				data: {
					sup_code: recordData.sup_code as string,
					sup_label: recordData.sup_label as string | null
				}
			});
			break;
		case 'v_categories':
			// Pour les vues, on doit insérer dans les tables sous-jacentes
			await handleCategoryInsert(tx, recordData);
			break;
	}
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
	tableName: string,
	mappedFields: Record<string, string>,
	row: unknown[],
	tx: PrismaTransactionClient = prisma
): Promise<string | null> {
	// Préparation de la condition de recherche
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
		// Recherche dans la table appropriée
		let existingRecord: Record<string, unknown> | null = null;

		switch (tableName) {
			case 'attribute':
				existingRecord = await tx.attribute.findFirst({
					where: whereCondition
				});
				break;
			case 'attribute_dev':
				existingRecord = await tx.attribute_dev.findFirst({
					where: whereCondition
				});
				break;
			case 'supplier':
				existingRecord = await tx.supplier.findFirst({
					where: whereCondition
				});
				break;
			case 'v_categories':
				existingRecord = await tx.v_categories.findFirst({
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

	// Par défaut, retourner la valeur comme chaîne de caractères
	return String(value);
}

function getUniqueConstraint(
	tableName: string,
	data: Record<string, unknown>
): Record<string, unknown> {
	const uniqueFields = getValidationRules(tableName).uniqueFields;
	const constraint: Record<string, unknown> = {};

	uniqueFields.forEach((field) => {
		if (data[field] !== undefined) {
			constraint[field] = data[field];
		}
	});

	return constraint;
}

async function handleCategoryInsert(
	tx: PrismaTransactionClient,
	data: Record<string, unknown>
): Promise<void> {
	// Insertion dans la table attribute pour chaque niveau de catégorie
	// Pour v_categories, on doit insérer dans les tables sous-jacentes

	// Niveau 0 (catégorie principale)
	if (data.atr_0_label) {
		await tx.attribute.upsert({
			where: {
				atr_nat_atr_val: {
					atr_nat: 'Catégorie des produits',
					atr_val: formatDisplayValue(data.atr_0_label)
				}
			},
			update: {
				atr_label: formatDisplayValue(data.atr_0_label)
			},
			create: {
				atr_nat: 'Catégorie des produits',
				atr_val: formatDisplayValue(data.atr_0_label),
				atr_label: formatDisplayValue(data.atr_0_label)
			}
		});
	}

	// Niveau 1-7 (sous-catégories)
	for (let i = 1; i <= 7; i++) {
		const labelField = `atr_${i}_label`;
		const prevLabelField = `atr_${i - 1}_label`;

		if (data[labelField] && data[prevLabelField]) {
			await tx.attribute.upsert({
				where: {
					atr_nat_atr_val: {
						atr_nat: 'Catégorie des produits',
						atr_val: formatDisplayValue(data[labelField])
					}
				},
				update: {
					atr_label: formatDisplayValue(data[labelField])
				},
				create: {
					atr_nat: 'Catégorie des produits',
					atr_val: formatDisplayValue(data[labelField]),
					atr_label: formatDisplayValue(data[labelField])
				}
			});
		}
	}
}

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
			return {
				requiredFields: ['sup_code'],
				uniqueFields: ['sup_code'],
				validators: {
					sup_code: (value: unknown) => typeof value === 'string' && value.length <= 30,
					sup_label: (value: unknown) => typeof value === 'string' && value.length <= 50
				}
			};
		case 'v_categories':
			return {
				requiredFields: ['atr_0_label'],
				uniqueFields: ['atr_0_label'],
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

// Pour SuperForms, nous devons également fournir la fonction de chargement
export const load: ServerLoad = async () => {
	// Initialisation d'un formulaire vide
	const form = await superValidate(zod(importSchema));

	return { form };
};
