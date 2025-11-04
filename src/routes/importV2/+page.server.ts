import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import {
	parseCSVContent,
	validateCSVData,
	validateAttributes,
	validateRequiredAttributes,
	importToDatabase,
	type ParsedCSVData,
	type ValidationResult,
	type ValidationError
} from './import-logic';
import { getClient } from '$lib/prisma-meta';
import type { PrismaClient as CenovDevPrismaClient } from '../../../prisma/cenov_dev/generated/index.js';

// ============================================================================
// CONFIGURATION
// ============================================================================
const CONFIG = {
	requiredFields: [
		'pro_cenov_id',
		'pro_code',
		'sup_code',
		'sup_label',
		'cat_code',
		'cat_label',
		'kit_label',
		'pp_amount',
		'pp_date'
	],

	fieldMapping: {
		pro_cenov_id: { table: 'product', field: 'pro_cenov_id' },
		pro_code: { table: 'product', field: 'pro_code' },
		sup_code: { table: 'supplier', field: 'sup_code' },
		sup_label: { table: 'supplier', field: 'sup_label' },
		cat_code: { table: 'category', field: 'cat_code' },
		cat_label: { table: 'category', field: 'cat_label' },
		kit_label: { table: 'kit', field: 'kit_label' },
		famille: { table: 'family', field: 'fam_label' },
		sous_famille: { table: 'family', field: 'fam_label' },
		sous_sous_famille: { table: 'family', field: 'fam_label' },
		pp_amount: { table: 'price_purchase', field: 'pp_amount' },
		pp_discount: { table: 'price_purchase', field: 'pp_discount' },
		pp_date: { table: 'price_purchase', field: 'pp_date' }
	},

	fieldMaxLengths: {
		'product.pro_cenov_id': 50,
		'product.pro_code': 50,
		'supplier.sup_code': 50,
		'supplier.sup_label': 70,
		'category.cat_code': 60,
		'category.cat_label': 100,
		'kit.kit_label': 100,
		'family.fam_label': 100
	},

	numericFields: ['pp_amount', 'pp_discount'],
	dateFields: ['pp_date']
};

// ============================================================================
// HELPERS
// ============================================================================
function formatError(err: unknown): string {
	return err instanceof Error ? err.message : 'Erreur inconnue';
}

function validateFormData(formData: FormData): { csvContent: string; error?: string } {
	const csvContent = formData.get('csv');

	if (!csvContent || typeof csvContent !== 'string') {
		return { csvContent: '', error: 'Fichier CSV manquant' };
	}

	if (csvContent.trim() === '') {
		return { csvContent: '', error: 'Fichier CSV vide' };
	}

	return { csvContent };
}

// ============================================================================
// ACTIONS
// ============================================================================
export const actions: Actions = {
	validate: async ({ request }) => {
		try {
			const formData = await request.formData();
			const { csvContent, error } = validateFormData(formData);
			if (error) return fail(400, { error });

			const database = (formData.get('database') as 'cenov_dev' | 'cenov_preprod') || 'cenov_dev';

			const parsedData: ParsedCSVData = await parseCSVContent(csvContent, database);
			if (!parsedData.success) return fail(400, { error: parsedData.error });

			// Validation CSV (toutes les lignes)
			const csvValidation = await validateCSVData(parsedData.data, CONFIG);

			// Validation attributs PAR produit
			const allAttributeErrors: ValidationError[] = [];
			const allAttributeWarnings: ValidationError[] = [];

			for (const productAttrs of parsedData.attributes) {
				const attrValidation = await validateAttributes(productAttrs.attributes, database);

				// Préfixer erreurs avec pro_cenov_id
				for (const err of attrValidation.errors) {
					allAttributeErrors.push({
						...err,
						field: `[${productAttrs.pro_cenov_id}] ${err.field}`
					});
				}

				for (const warn of attrValidation.warnings) {
					allAttributeWarnings.push({
						...warn,
						field: `[${productAttrs.pro_cenov_id}] ${warn.field}`
					});
				}
			}

			// ✅ VALIDATION ATTRIBUTS OBLIGATOIRES - PRIORITÉ 2
			const requiredAttrsValidation = await validateRequiredAttributes(
				parsedData.data,
				parsedData.attributes,
				database
			);

			const validation: ValidationResult = {
				success:
					csvValidation.success &&
					allAttributeErrors.length === 0 &&
					requiredAttrsValidation.success,
				totalRows: parsedData.data.length,
				validRows: Math.min(
					csvValidation.validRows,
					requiredAttrsValidation.validRows,
					parsedData.data.length - allAttributeErrors.length
				),
				errors: [...csvValidation.errors, ...allAttributeErrors, ...requiredAttrsValidation.errors],
				warnings: [
					...csvValidation.warnings,
					...allAttributeWarnings,
					...requiredAttrsValidation.warnings
				]
			};

			console.log(
				`✅ Validation: ${csvValidation.validRows}/${parsedData.data.length} produit(s) valide(s)`
			);
			return { validation };
		} catch (err) {
			console.error('❌ Erreur validation:', err);
			return fail(500, { error: `Erreur de validation: ${formatError(err)}` });
		}
	},

	process: async ({ request }) => {
		try {
			const formData = await request.formData();

			const { csvContent, error } = validateFormData(formData);
			if (error) {
				return fail(400, { error });
			}

			const database = (formData.get('database') as 'cenov_dev' | 'cenov_preprod') || 'cenov_dev';

			const parsedData = await parseCSVContent(csvContent, database);
			if (!parsedData.success) {
				return fail(400, { error: parsedData.error });
			}

			// Validation CSV
			const csvValidation = await validateCSVData(parsedData.data, CONFIG);

			// Validation attributs PAR produit
			let hasAttributeErrors = false;
			for (const productAttrs of parsedData.attributes) {
				const attrValidation = await validateAttributes(productAttrs.attributes, database);
				if (!attrValidation.success) {
					hasAttributeErrors = true;
					break;
				}
			}

			// ✅ Validation attributs obligatoires
			const requiredAttrsValidation = await validateRequiredAttributes(
				parsedData.data,
				parsedData.attributes,
				database
			);

			if (!csvValidation.success || hasAttributeErrors || !requiredAttrsValidation.success) {
				return fail(400, { error: 'Validation échouée. Veuillez corriger les erreurs.' });
			}

			const importResult = await importToDatabase(parsedData.data, parsedData.attributes, database);

			if (!importResult.success) {
				return fail(500, { error: `Erreur d'import: ${importResult.error}` });
			}

			console.log(`✅ Import réussi: ${parsedData.data.length} produit(s) importé(s)`);
			return { success: true, result: importResult };
		} catch (err) {
			return fail(500, { error: `Erreur d'importation: ${formatError(err)}` });
		}
	}
};

// ============================================================================
// LOAD
// ============================================================================
export const load: PageServerLoad = async () => {
	// ✅ Charger les catégories avec comptage d'attributs
	const database = 'cenov_dev'; // Par défaut
	const prisma = (await getClient(database)) as unknown as CenovDevPrismaClient;

	// Charger toutes les catégories avec comptage des attributs liés
	const categoriesRaw = await prisma.category.findMany({
		select: {
			cat_id: true,
			cat_code: true,
			cat_label: true
		}
	});

	// Compter les attributs pour chaque catégorie
	const categoriesWithCount = await Promise.all(
		categoriesRaw.map(async (cat) => {
			const attributeCount = await prisma.category_attribute.count({
				where: { fk_category: cat.cat_id }
			});
			return {
				cat_id: cat.cat_id,
				cat_code: cat.cat_code,
				cat_label: cat.cat_label,
				attributeCount
			};
		})
	);

	// Tri alphabétique case-insensitive (A, a, B, b au lieu de A, B, a, b)
	const categories = categoriesWithCount.toSorted((a, b) =>
		(a.cat_label || '').localeCompare(b.cat_label || '', 'fr', { sensitivity: 'base' })
	);

	return {
		config: CONFIG,
		categories
	};
};
