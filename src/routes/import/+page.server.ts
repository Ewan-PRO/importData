import type { RequestHandler } from '@sveltejs/kit';
import { error, json } from '@sveltejs/kit';
import { PrismaClient, type Prisma } from '@prisma/client';

const prisma = new PrismaClient();

// Types pour les données d'importation
interface ImportData {
	data: unknown[][];
	mappedFields: Record<string, string>;
	targetTable: string;
}

interface ValidationResult {
	totalRows: number;
	validRows: number;
	duplicates: number;
	invalidData: {
		row: number;
		field: string;
		value: string;
		error: string;
	}[];
	processed: boolean;
}

interface ImportResult extends ValidationResult {
	inserted: number;
	updated: number;
	errors: string[];
}

// Types pour les validateurs
type Validator = (value: unknown) => boolean;
interface ValidationRules {
	requiredFields: string[];
	uniqueFields: string[];
	validators: Record<string, Validator>;
}

// Action handler - pour SvelteKit
export const actions = {
	validate: async ({ request }) => {
		return handleValidation(request);
	},
	process: async ({ request }) => {
		return handleImport(request);
	}
} satisfies Record<string, RequestHandler>;

// Fonction de validation des données
async function handleValidation(request: Request) {
	try {
		const requestData: ImportData = await request.json();
		const { data, mappedFields, targetTable } = requestData;

		const result: ValidationResult = {
			totalRows: data.length,
			validRows: 0,
			duplicates: 0,
			invalidData: [],
			processed: false
		};

		// Obtenir la structure de la table cible
		const validationRules = getValidationRules(targetTable);

		// Préparation pour le traitement
		const columnMap = prepareColumnMap(mappedFields);
		const uniqueEntries = new Set<string>();

		// Validation ligne par ligne
		for (let rowIndex = 0; rowIndex < data.length; rowIndex++) {
			const row = data[rowIndex];
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

		return json(result);
	} catch (err) {
		console.error('Erreur lors de la validation:', err);
		throw error(
			500,
			`Erreur de validation: ${err instanceof Error ? err.message : 'Erreur inconnue'}`
		);
	}
}

// Prépare le mappage inversé des colonnes
function prepareColumnMap(mappedFields: Record<string, string>): Record<string, number> {
	const columnMap: Record<string, number> = {};
	Object.entries(mappedFields).forEach(([index, field]) => {
		if (field) columnMap[field] = parseInt(index);
	});
	return columnMap;
}

// Valide une ligne complète
function validateRow(
	rowIndex: number,
	row: unknown[],
	columnMap: Record<string, number>,
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
	columnMap: Record<string, number>,
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
	columnMap: Record<string, number>,
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
	columnMap: Record<string, number>,
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

// Fonction d'importation des données
async function handleImport(request: Request) {
	try {
		const requestData: ImportData = await request.json();
		const { data, mappedFields, targetTable } = requestData;

		const result: ImportResult = {
			totalRows: data.length,
			validRows: 0,
			duplicates: 0,
			invalidData: [],
			inserted: 0,
			updated: 0,
			errors: [],
			processed: true
		};

		// Préparation pour le traitement
		const columnMap = prepareColumnMap(mappedFields);

		// Traitement des données en transaction
		await prisma.$transaction(async (tx) => {
			for (let rowIndex = 0; rowIndex < data.length; rowIndex++) {
				const row = data[rowIndex];
				await processRow(row, rowIndex, columnMap, targetTable, tx, result);
			}
		});

		return json(result);
	} catch (err) {
		console.error("Erreur lors de l'importation:", err);
		throw error(
			500,
			`Erreur d'importation: ${err instanceof Error ? err.message : 'Erreur inconnue'}`
		);
	}
}

// Traite une ligne pour l'importation
async function processRow(
	row: unknown[],
	rowIndex: number,
	columnMap: Record<string, number>,
	targetTable: string,
	tx: Prisma.TransactionClient,
	result: ImportResult
): Promise<void> {
	try {
		// Préparation des données pour l'importation
		const recordData: Record<string, unknown> = {};

		Object.entries(columnMap).forEach(([field, colIndex]) => {
			if (row[colIndex] !== undefined && row[colIndex] !== '') {
				recordData[field] = formatValueForDatabase(field, row[colIndex]);
			}
		});

		// Vérification si le record existe déjà
		const existingRecord = await checkExistingRecord(
			targetTable,
			Object.fromEntries(Object.entries(columnMap).map(([k, v]) => [v.toString(), k])),
			row,
			tx
		);

		if (existingRecord) {
			// Mise à jour d'un enregistrement existant
			await updateRecord(tx, targetTable, recordData);
			result.updated++;
		} else {
			// Création d'un nouvel enregistrement
			await createRecord(tx, targetTable, recordData);
			result.inserted++;
		}

		result.validRows++;
	} catch (err) {
		console.error(`Erreur lors de l'importation de la ligne ${rowIndex}:`, err);
		result.errors.push(
			`Ligne ${rowIndex + 1}: ${err instanceof Error ? err.message : 'Erreur inconnue'}`
		);
	}
}

// Fonction pour mettre à jour un enregistrement existant
async function updateRecord(
	tx: Prisma.TransactionClient,
	targetTable: string,
	recordData: Record<string, unknown>
): Promise<void> {
	const uniqueConstraint = getUniqueConstraint(targetTable, recordData);

	switch (targetTable) {
		case 'attribute':
			await tx.attribute.updateMany({
				where: uniqueConstraint as Prisma.attributeWhereInput,
				data: recordData as Prisma.attributeUpdateManyMutationInput
			});
			break;
		case 'attribute_dev':
			await tx.attribute_dev.updateMany({
				where: uniqueConstraint as Prisma.attribute_devWhereInput,
				data: recordData as Prisma.attribute_devUpdateManyMutationInput
			});
			break;
		case 'supplier':
			await tx.supplier.updateMany({
				where: uniqueConstraint as Prisma.supplierWhereInput,
				data: recordData as Prisma.supplierUpdateManyMutationInput
			});
			break;
		// Les vues ne peuvent pas être mises à jour directement
	}
}

// Fonction pour créer un nouvel enregistrement
async function createRecord(
	tx: Prisma.TransactionClient,
	targetTable: string,
	recordData: Record<string, unknown>
): Promise<void> {
	switch (targetTable) {
		case 'attribute':
			await tx.attribute.create({
				data: recordData as Prisma.attributeCreateInput
			});
			break;
		case 'attribute_dev':
			await tx.attribute_dev.create({
				data: recordData as Prisma.attribute_devCreateInput
			});
			break;
		case 'supplier':
			// Vérifier que sup_code est défini pour supplier
			if (!recordData.sup_code) {
				throw new Error('Le champ sup_code est obligatoire pour les fournisseurs');
			}
			await tx.supplier.create({
				data: recordData as Prisma.supplierCreateInput
			});
			break;
		case 'v_categories':
			// Pour les vues, on doit insérer dans les tables sous-jacentes
			await handleCategoryInsert(tx, recordData);
			break;
	}
}

// Fonctions utilitaires
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
					atr_label: (value: unknown) => typeof value === 'string' && value.length <= 100
				}
			};
		case 'supplier':
			return {
				requiredFields: ['sup_code'],
				uniqueFields: ['sup_code'],
				validators: {
					sup_code: (value: unknown) => typeof value === 'string' && value.length <= 10,
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
						!value || (typeof value === 'string' && value.length <= 100),
					atr_2_label: (value: unknown) =>
						!value || (typeof value === 'string' && value.length <= 100),
					atr_3_label: (value: unknown) =>
						!value || (typeof value === 'string' && value.length <= 100),
					atr_4_label: (value: unknown) =>
						!value || (typeof value === 'string' && value.length <= 100),
					atr_5_label: (value: unknown) =>
						!value || (typeof value === 'string' && value.length <= 100),
					atr_6_label: (value: unknown) =>
						!value || (typeof value === 'string' && value.length <= 100),
					atr_7_label: (value: unknown) =>
						!value || (typeof value === 'string' && value.length <= 100)
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

// Fonction sécurisée pour convertir en string pour affichage
function formatDisplayValue(value: unknown): string {
	if (value === null || value === undefined) {
		return '';
	}

	if (typeof value === 'object') {
		try {
			return JSON.stringify(value);
		} catch {
			return Object.prototype.toString.call(value);
		}
	}

	return String(value);
}

async function checkExistingRecord(
	tableName: string,
	mappedFields: Record<string, string>,
	row: unknown[],
	tx: Prisma.TransactionClient = prisma
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
					where: whereCondition as Prisma.attributeWhereInput
				});
				break;
			case 'attribute_dev':
				existingRecord = await tx.attribute_dev.findFirst({
					where: whereCondition as Prisma.attribute_devWhereInput
				});
				break;
			case 'supplier':
				existingRecord = await tx.supplier.findFirst({
					where: whereCondition as Prisma.supplierWhereInput
				});
				break;
			case 'v_categories':
				existingRecord = await tx.v_categories.findFirst({
					where: whereCondition as Prisma.v_categoriesWhereInput
				});
				break;
		}

		// Retourner une représentation textuelle de l'enregistrement trouvé
		if (existingRecord) {
			return uniqueFields.map((field) => formatDisplayValue(existingRecord?.[field])).join(', ');
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
	tx: Prisma.TransactionClient,
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
