import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import {
	parseCSVContent,
	validateCSVData,
	validateAttributes,
	importToDatabase,
	type ParsedCSVData,
	type ValidationResult
} from './import-logic';

// ============================================================================
// CONFIGURATION
// ============================================================================
const CONFIG = {
	requiredFields: [
		'pro_cenov_id',
		'pro_code',
		'sup_code',
		'sup_label',
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

			const parsedData: ParsedCSVData = await parseCSVContent(csvContent);
			if (!parsedData.success) return fail(400, { error: parsedData.error });

			const csvValidation = await validateCSVData(parsedData.data, CONFIG);
			const attributeValidation = await validateAttributes(parsedData.attributes);

			const validation: ValidationResult = {
				success: csvValidation.success && attributeValidation.success,
				totalRows: parsedData.data.length,
				validRows: csvValidation.validRows,
				errors: [...csvValidation.errors, ...attributeValidation.errors],
				warnings: [...csvValidation.warnings, ...attributeValidation.warnings]
			};

			console.log(
				`✅ Validation: ${csvValidation.validRows}/${parsedData.data.length} lignes valides`
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

			const parsedData = await parseCSVContent(csvContent);
			if (!parsedData.success) {
				return fail(400, { error: parsedData.error });
			}

			const csvValidation = await validateCSVData(parsedData.data, CONFIG);
			const attributeValidation = await validateAttributes(parsedData.attributes);

			if (!csvValidation.success || !attributeValidation.success) {
				return fail(400, { error: 'Validation échouée. Veuillez corriger les erreurs.' });
			}

			const importResult = await importToDatabase(parsedData.data, parsedData.attributes);

			if (!importResult.success) {
				return fail(500, { error: `Erreur d'import: ${importResult.error}` });
			}

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
	return { config: CONFIG };
};
