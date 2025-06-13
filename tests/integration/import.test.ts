import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { PrismaClient } from '@prisma/client';

// Mock des modules SvelteKit
vi.mock('$app/navigation', () => ({
	invalidateAll: vi.fn()
}));

vi.mock('$lib/components/ui/alert', () => ({
	alertActions: {
		success: vi.fn(),
		error: vi.fn(),
		warning: vi.fn(),
		info: vi.fn()
	}
}));

// Configuration de la base de données de test
const prisma = new PrismaClient();

// Types pour les tests
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

// Fonctions utilitaires pour les tests
function safeStringify(value: unknown): string {
	if (value === null || value === undefined) return '';
	if (typeof value === 'object') return JSON.stringify(value);
	return String(value);
}

function validateCSVFormat(
	data: unknown[][]
): Array<{ row: number; field: string; value: string; error: string }> {
	const errors: Array<{ row: number; field: string; value: string; error: string }> = [];

	data.forEach((row, rowIndex) => {
		if (!Array.isArray(row)) return;

		row.forEach((cell, cellIndex) => {
			if (typeof cell === 'string') {
				const quoteCount = (cell.match(/"/g) || []).length;
				if (quoteCount % 2 !== 0) {
					errors.push({
						row: rowIndex,
						field: `Colonne ${cellIndex}`,
						value: cell,
						error: 'Guillemets malformés dans le CSV'
					});
				}
			}
		});
	});

	return errors;
}

function validateRequiredFields(
	data: unknown[][],
	mappedFields: Record<string, string>,
	targetTable: string
): ValidationResult {
	const result: ValidationResult = {
		totalRows: data.length,
		validRows: 0,
		duplicates: 0,
		invalidData: [],
		processed: false
	};

	const requiredFields = getRequiredFields(targetTable);
	const uniqueEntries = new Set<string>();

	data.forEach((row, rowIndex) => {
		if (!Array.isArray(row)) return;

		const isRequiredFieldsValid = validateRowRequiredFields(
			row,
			rowIndex,
			mappedFields,
			requiredFields,
			result
		);
		const isDuplicateValid = validateRowDuplicates(
			row,
			rowIndex,
			mappedFields,
			targetTable,
			uniqueEntries,
			result
		);

		if (isRequiredFieldsValid && isDuplicateValid) {
			result.validRows++;
		}
	});

	return result;
}

function validateRowRequiredFields(
	row: unknown[],
	rowIndex: number,
	mappedFields: Record<string, string>,
	requiredFields: string[],
	result: ValidationResult
): boolean {
	for (const fieldName of requiredFields) {
		const colIndex = Object.entries(mappedFields).find(([, field]) => field === fieldName)?.[0];
		if (!colIndex || row[parseInt(colIndex)] === undefined || row[parseInt(colIndex)] === '') {
			result.invalidData.push({
				row: rowIndex,
				field: fieldName,
				value: safeStringify(row[colIndex ? parseInt(colIndex) : 0]),
				error: 'Champ obligatoire manquant'
			});
			return false;
		}
	}
	return true;
}

function validateRowDuplicates(
	row: unknown[],
	rowIndex: number,
	mappedFields: Record<string, string>,
	targetTable: string,
	uniqueEntries: Set<string>,
	result: ValidationResult
): boolean {
	if (targetTable !== 'supplier') return true;

	const codeIndex = Object.entries(mappedFields).find(([, field]) => field === 'sup_code')?.[0];
	if (!codeIndex) return true;

	const code = String(row[parseInt(codeIndex)]);
	if (uniqueEntries.has(code)) {
		result.duplicates++;
		result.invalidData.push({
			row: rowIndex,
			field: 'sup_code',
			value: code,
			error: 'Doublon détecté'
		});
		return false;
	}

	uniqueEntries.add(code);
	return true;
}

function getRequiredFields(targetTable: string): string[] {
	switch (targetTable) {
		case 'attribute':
		case 'attribute_dev':
			return ['atr_nat', 'atr_val'];
		case 'supplier':
			return ['sup_code'];
		case 'v_categories':
			return ['atr_0_label'];
		default:
			return [];
	}
}

async function checkExistingRecords(
	data: unknown[][],
	mappedFields: Record<string, string>,
	targetTable: string
): Promise<number> {
	let duplicates = 0;

	for (const row of data) {
		if (!Array.isArray(row)) continue;

		if (targetTable === 'supplier') {
			const codeIndex = Object.entries(mappedFields).find(([, field]) => field === 'sup_code')?.[0];
			if (codeIndex !== undefined) {
				const code = String(row[parseInt(codeIndex)]);
				const existing = await prisma.supplier.findFirst({
					where: { sup_code: code }
				});
				if (existing) duplicates++;
			}
		}
	}

	return duplicates;
}

describe("Tests d'importation de données CSV", () => {
	beforeEach(async () => {
		// Nettoyer les tables de test avant chaque test
		await prisma.attribute_dev.deleteMany();
		await prisma.supplier.deleteMany();
	});

	afterEach(async () => {
		// Nettoyer après chaque test
		await prisma.attribute_dev.deleteMany();
		await prisma.supplier.deleteMany();
	});

	describe('Validation des données CSV', () => {
		it('devrait valider des fournisseurs corrects', async () => {
			const csvData = [
				['SUP001', 'Fournisseur Alpha'],
				['SUP002', 'Fournisseur Beta'],
				['SUP003', 'Fournisseur Gamma']
			];

			const mappedFields = {
				'0': 'sup_code',
				'1': 'sup_label'
			};

			const result = validateRequiredFields(csvData, mappedFields, 'supplier');

			expect(result.totalRows).toBe(3);
			expect(result.validRows).toBe(3);
			expect(result.duplicates).toBe(0);
			expect(result.invalidData).toHaveLength(0);
		});

		it('devrait détecter les champs obligatoires manquants', async () => {
			const csvData = [
				['', 'Fournisseur sans code'],
				['SUP002', 'Fournisseur Beta']
			];

			const mappedFields = {
				'0': 'sup_code',
				'1': 'sup_label'
			};

			const result = validateRequiredFields(csvData, mappedFields, 'supplier');

			expect(result.totalRows).toBe(2);
			expect(result.validRows).toBe(1);
			expect(result.invalidData).toHaveLength(1);
			expect(result.invalidData[0].field).toBe('sup_code');
			expect(result.invalidData[0].error).toBe('Champ obligatoire manquant');
		});

		it('devrait détecter les doublons internes', async () => {
			const csvData = [
				['SUP001', 'Fournisseur 1'],
				['SUP001', 'Fournisseur 1 bis'],
				['SUP002', 'Fournisseur 2']
			];

			const mappedFields = {
				'0': 'sup_code',
				'1': 'sup_label'
			};

			const result = validateRequiredFields(csvData, mappedFields, 'supplier');

			expect(result.totalRows).toBe(3);
			expect(result.validRows).toBe(2);
			expect(result.duplicates).toBe(1);
		});

		it('devrait détecter les guillemets malformés', async () => {
			const csvData = [
				['SUP005', '"Guillemets non fermés'],
				['SUP006', 'Normal']
			];

			const csvErrors = validateCSVFormat(csvData);

			expect(csvErrors).toHaveLength(1);
			expect(csvErrors[0].error).toContain('Guillemets');
		});
	});

	describe('Validation des attributs', () => {
		it('devrait valider des attributs corrects', async () => {
			const csvData = [
				['Couleur', 'Rouge', 'Rouge vif'],
				['Couleur', 'Bleu', 'Bleu marine'],
				['Matériau', 'Acier', 'Acier inoxydable']
			];

			const mappedFields = {
				'0': 'atr_nat',
				'1': 'atr_val',
				'2': 'atr_label'
			};

			const result = validateRequiredFields(csvData, mappedFields, 'attribute_dev');

			expect(result.totalRows).toBe(3);
			expect(result.validRows).toBe(3);
			expect(result.invalidData).toHaveLength(0);
		});

		it('devrait détecter les champs obligatoires manquants pour les attributs', async () => {
			const csvData = [
				['', 'Rouge', 'Rouge vif'], // atr_nat manquant
				['Couleur', '', 'Bleu marine'], // atr_val manquant
				['Matériau', 'Acier', 'Acier inoxydable'] // Ligne valide
			];

			const mappedFields = {
				'0': 'atr_nat',
				'1': 'atr_val',
				'2': 'atr_label'
			};

			const result = validateRequiredFields(csvData, mappedFields, 'attribute_dev');

			expect(result.totalRows).toBe(3);
			expect(result.validRows).toBe(1);
			expect(result.invalidData).toHaveLength(2);
		});
	});

	describe("Tests d'importation en base de données", () => {
		it('devrait importer des fournisseurs en base', async () => {
			const suppliers = [
				{ sup_code: 'SUP001', sup_label: 'Fournisseur Alpha' },
				{ sup_code: 'SUP002', sup_label: 'Fournisseur Beta' },
				{ sup_code: 'SUP003', sup_label: 'Fournisseur Gamma' }
			];

			// Insertion en base
			for (const supplier of suppliers) {
				await prisma.supplier.create({ data: supplier });
			}

			// Vérification
			const result = await prisma.supplier.findMany();
			expect(result).toHaveLength(3);
			expect(result.map((s) => s.sup_code)).toEqual(['SUP001', 'SUP002', 'SUP003']);
		});

		it('devrait détecter les doublons en base de données', async () => {
			// Insérer d'abord un fournisseur
			await prisma.supplier.create({
				data: { sup_code: 'SUP001', sup_label: 'Fournisseur existant' }
			});

			// Tester la détection de doublon
			const csvData = [
				['SUP001', 'Nouveau fournisseur avec même code'],
				['SUP002', 'Fournisseur unique']
			];

			const mappedFields = {
				'0': 'sup_code',
				'1': 'sup_label'
			};

			const duplicates = await checkExistingRecords(csvData, mappedFields, 'supplier');
			expect(duplicates).toBe(1);
		});

		it('devrait importer des attributs en base', async () => {
			const attributes = [
				{ atr_nat: 'Couleur', atr_val: 'Rouge', atr_label: 'Rouge vif' },
				{ atr_nat: 'Couleur', atr_val: 'Bleu', atr_label: 'Bleu marine' },
				{ atr_nat: 'Matériau', atr_val: 'Acier', atr_label: 'Acier inoxydable' }
			];

			// Insertion en base
			for (const attribute of attributes) {
				await prisma.attribute_dev.create({ data: attribute });
			}

			// Vérification
			const result = await prisma.attribute_dev.findMany();
			expect(result).toHaveLength(3);
		});
	});

	describe('Tests de cas limites', () => {
		it('devrait gérer un fichier vide', async () => {
			const csvData: unknown[][] = [];
			const mappedFields = { '0': 'sup_code', '1': 'sup_label' };

			const result = validateRequiredFields(csvData, mappedFields, 'supplier');

			expect(result.totalRows).toBe(0);
			expect(result.validRows).toBe(0);
			expect(result.invalidData).toHaveLength(0);
		});

		it('devrait gérer les champs optionnels vides', async () => {
			const csvData = [
				['SUP001', ''], // sup_label vide mais optionnel
				['SUP002', 'Fournisseur avec label']
			];

			const mappedFields = {
				'0': 'sup_code',
				'1': 'sup_label'
			};

			const result = validateRequiredFields(csvData, mappedFields, 'supplier');

			expect(result.totalRows).toBe(2);
			expect(result.validRows).toBe(2); // Les deux lignes sont valides
		});

		it('devrait gérer un grand nombre de lignes', async () => {
			// Générer 100 fournisseurs
			const csvData = Array.from({ length: 100 }, (_, i) => [
				`SUP${String(i + 1).padStart(3, '0')}`,
				`Fournisseur ${i + 1}`
			]);

			const mappedFields = {
				'0': 'sup_code',
				'1': 'sup_label'
			};

			const startTime = Date.now();
			const result = validateRequiredFields(csvData, mappedFields, 'supplier');
			const validationTime = Date.now() - startTime;

			// La validation ne devrait pas prendre plus de 1 seconde
			expect(validationTime).toBeLessThan(1000);
			expect(result.totalRows).toBe(100);
			expect(result.validRows).toBe(100);
		});
	});

	describe('Tests de validation spécifique aux catégories', () => {
		it('devrait valider atr_0_label pour les catégories', async () => {
			const csvData = [
				['Électronique', 'Composants'], // atr_0_label incorrect
				['Catégorie des produits', 'Composants'] // atr_0_label correct
			];

			// Validation spécifique pour atr_0_label
			const result: ValidationResult = {
				totalRows: csvData.length,
				validRows: 0,
				duplicates: 0,
				invalidData: [],
				processed: false
			};

			csvData.forEach((row, rowIndex) => {
				const atr0Value = String(row[0]);
				if (atr0Value && atr0Value !== 'Catégorie des produits') {
					result.invalidData.push({
						row: rowIndex,
						field: 'atr_0_label',
						value: atr0Value,
						error: 'Valeur non conforme - doit être "Catégorie des produits"'
					});
				} else if (atr0Value === 'Catégorie des produits') {
					result.validRows++;
				}
			});

			expect(result.totalRows).toBe(2);
			expect(result.validRows).toBe(1);
			expect(result.invalidData).toHaveLength(1);
			expect(result.invalidData[0].error).toContain('Catégorie des produits');
		});
	});
});
