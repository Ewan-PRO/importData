import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { PrismaClient, type Prisma } from '@prisma/client';
import * as XLSX from 'xlsx';

const prisma = new PrismaClient();

// Types
type ColumnMapping = {
	fileColumn: string;
	dbField: string;
	required: boolean;
	valid: boolean;
	errorMessage?: string;
};

type ImportOptions = {
	tableName: string;
	columnMappings: ColumnMapping[];
	data: unknown[];
	rawFileData: Uint8Array;
	fileName: string;
};

type ImportResult = {
	tableName: string;
	totalRows: number;
	importedRows: number;
	duplicates: number;
	errors: number;
	errorDetails: {
		row: number;
		message: string;
	}[];
};

export const actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const file = formData.get('file') as File;
		const tableName = formData.get('tableName') as string;
		const columnMappingsJson = formData.get('columnMappings') as string;

		if (!file || !tableName || !columnMappingsJson) {
			return error(400, 'Données de formulaire manquantes');
		}

		try {
			const columnMappings: ColumnMapping[] = JSON.parse(columnMappingsJson);

			// Lire le fichier
			const arrayBuffer = await file.arrayBuffer();
			const data = new Uint8Array(arrayBuffer);

			// Utiliser XLSX pour traiter le fichier
			const workbook = XLSX.read(data, { type: 'array' });
			const worksheet = workbook.Sheets[workbook.SheetNames[0]];
			const rows = XLSX.utils.sheet_to_json(worksheet);

			// Préparer les options d'importation
			const options: ImportOptions = {
				tableName,
				columnMappings,
				data: rows,
				rawFileData: data,
				fileName: file.name
			};

			// Exécuter l'importation
			const result = await importData(options);

			return {
				success: true,
				result
			};
		} catch (err) {
			console.error("Erreur lors de l'importation:", err);
			return error(500, {
				message: err instanceof Error ? err.message : "Erreur inconnue lors de l'importation"
			});
		}
	}
};

// Fonction principale d'importation
async function importData(options: ImportOptions): Promise<ImportResult> {
	const { tableName, columnMappings, data } = options;

	validateMappings(columnMappings);

	const result: ImportResult = {
		tableName,
		totalRows: data.length,
		importedRows: 0,
		duplicates: 0,
		errors: 0,
		errorDetails: []
	};

	const mappingByColumn = createColumnMapping(columnMappings);

	try {
		const importedData = await prisma.$transaction(async (tx) => {
			return await processRows(
				tx,
				data as Record<string, string | number>[],
				mappingByColumn,
				tableName
			);
		});

		updateResult(result, importedData);
		return result;
	} catch (err) {
		console.error("Erreur lors de la transaction d'importation:", err);
		throw new Error(err instanceof Error ? err.message : "Erreur inconnue lors de l'importation");
	}
}

function validateMappings(columnMappings: ColumnMapping[]) {
	const invalidMappings = columnMappings.filter(
		(m) => m.required && (!m.fileColumn || m.fileColumn === '')
	);

	if (invalidMappings.length > 0) {
		throw new Error(`Certains champs obligatoires n'ont pas été mappés`);
	}
}

function createColumnMapping(columnMappings: ColumnMapping[]): Record<string, string> {
	const mappingByColumn: Record<string, string> = {};
	columnMappings.forEach((mapping) => {
		if (mapping.fileColumn) {
			mappingByColumn[mapping.fileColumn] = mapping.dbField;
		}
	});
	return mappingByColumn;
}

async function processRows(
	tx: Prisma.TransactionClient,
	data: Record<string, string | number>[],
	mappingByColumn: Record<string, string>,
	tableName: string
) {
	let importedRows = 0;
	const errors: { row: number; message: string }[] = [];
	const processedKeys = new Set<string>();
	let duplicates = 0;

	for (let i = 0; i < data.length; i++) {
		const row = data[i];
		const transformedRow = transformRow(row, mappingByColumn);
		const uniqueKey = generateUniqueKey(transformedRow, tableName);

		if (uniqueKey && processedKeys.has(uniqueKey)) {
			duplicates++;
			continue;
		}

		if (uniqueKey) {
			processedKeys.add(uniqueKey);
		}

		try {
			await insertRow(tx, tableName, transformedRow);
			importedRows++;
		} catch (err) {
			console.error(`Erreur lors de l'insertion de la ligne ${i + 1}:`, err);
			errors.push({
				row: i + 1,
				message: err instanceof Error ? err.message : 'Erreur inconnue'
			});
		}
	}

	return { importedRows, errors, duplicates };
}

function transformRow(
	row: Record<string, string | number>,
	mappingByColumn: Record<string, string>
): Record<string, string | number> {
	const transformedRow: Record<string, string | number> = {};
	Object.entries(row).forEach(([col, value]) => {
		const dbField = mappingByColumn[col];
		if (dbField) {
			transformedRow[dbField] = value;
		}
	});
	return transformedRow;
}

function generateUniqueKey(row: Record<string, string | number>, tableName: string): string {
	let uniqueKey = '';
	Object.entries(row).forEach(([field, value]) => {
		if (
			(tableName === 'attribute' && (field === 'atr_nat' || field === 'atr_val')) ||
			(tableName === 'supplier' && field === 'sup_code') ||
			(tableName === 'v_categories' && field === 'atr_0_label')
		) {
			uniqueKey += `${field}:${value};`;
		}
	});
	return uniqueKey;
}

async function insertRow(
	tx: Prisma.TransactionClient,
	tableName: string,
	transformedRow: Record<string, string | number>
): Promise<void> {
	switch (tableName) {
		case 'attribute':
			await tx.attribute.create({
				data: transformedRow as Prisma.attributeCreateInput
			});
			break;

		case 'supplier':
			await tx.supplier.create({
				data: transformedRow as Prisma.supplierCreateInput
			});
			break;

		case 'v_categories':
			await insertCategories(tx, transformedRow);
			break;

		default:
			throw new Error(`Table non supportée: ${tableName}`);
	}
}

async function insertCategories(
	tx: Prisma.TransactionClient,
	transformedRow: Record<string, string | number>
) {
	for (let level = 0; level <= 7; level++) {
		const categoryField = `atr_${level}_label`;
		const categoryValue = transformedRow[categoryField];

		if (categoryValue) {
			const existingCategory = await tx.attribute.findFirst({
				where: {
					atr_nat: 'category',
					atr_val: `level_${level}`,
					atr_label: categoryValue as string
				}
			});

			if (!existingCategory) {
				await tx.attribute.create({
					data: {
						atr_nat: 'category',
						atr_val: `level_${level}`,
						atr_label: categoryValue as string
					}
				});
			}
		} else {
			break;
		}
	}
}

function updateResult(
	result: ImportResult,
	importedData: {
		importedRows: number;
		errors: { row: number; message: string }[];
		duplicates: number;
	}
) {
	result.importedRows = importedData.importedRows;
	result.errors = importedData.errors.length;
	result.errorDetails = importedData.errors;
	result.duplicates = importedData.duplicates;
}

// Chargement de la page
export const load: PageServerLoad = async () => {
	return {};
};
