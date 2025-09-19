import type { RequestHandler } from '@sveltejs/kit';
import { json, error } from '@sveltejs/kit';
import {
	validateImportData,
	insertValidatedData,
	calculateValidRowsSet,
	type ImportConfig
} from '../shared.js';

// Types spécifiques à l'API
interface ApiRequest {
	data: unknown[][];
	mappedFields: Record<string, string>;
	targetTable: string; // API = mono-table seulement
	action?: 'validate' | 'process';
}



export const POST: RequestHandler = async ({ request }) => {
	try {
		const body: ApiRequest = await request.json();
		const { data, mappedFields, targetTable, action } = body;

		console.log('🔍 API Debug - Request:', {
			dataLength: Array.isArray(data) ? data.length : 'not array',
			mappedFields,
			targetTable,
			action
		});

		// Conversion vers format commun
		const config: ImportConfig = {
			data,
			mappedFields,
			selectedTables: [targetTable], // API = 1 table seulement
			targetTable
		};

		// Validation via shared.ts
		const result = await validateImportData(config, {
			multiTable: false, // API = simple table
			enableDatabaseCheck: true
		});

		// Si process demandé, procéder à l'insertion
		const isProcessing = request.url.includes('process') || action === 'process';
		console.log('🔍 API Debug - Processing:', {
			isProcessing,
			validRows: result.validRows
		});

		if (isProcessing && result.validRows > 0) {
			result.processed = true;

			// Calculer les lignes valides depuis le résultat de validation
			const validRowsSet = calculateValidRowsSet(result, config.data.length);

			// Insertion via shared.ts
			const insertResult = await insertValidatedData(config, validRowsSet, {
				useTransaction: false // API simple sans transaction
			});

			result.inserted = insertResult.inserted;
			result.updated = insertResult.updated;
			result.errors = insertResult.errors;

			console.log('🔍 API Debug - Inserted:', insertResult.inserted);
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
