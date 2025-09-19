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
	getImportableTableRequiredFields
} from '$lib/prisma-meta';
import {
	validateImportData,
	insertValidatedData,
	type ImportConfig,
	type ValidationResult
} from './shared.js';

const prisma = new PrismaClient();

// Types SvelteKit spécifiques
interface ImportResult extends ValidationResult {
	inserted: number;
	updated: number;
	errors: string[];
}


// Schéma de validation pour les données d'importation
const importSchema = z.object({
	data: z.array(z.array(z.unknown())),
	mappedFields: z.record(z.string()),
	selectedTables: z.array(z.string())
});


// Fonction utilitaire pour calculer les lignes valides depuis ValidationResult
function calculateValidRowsSet(result: ValidationResult, totalRows: number): Set<number> {
	const validRowsSet = new Set<number>();
	const invalidRowIndices = new Set(result.invalidData.map(error => error.row));

	for (let i = 0; i < totalRows; i++) {
		if (!invalidRowIndices.has(i)) {
			validRowsSet.add(i);
		}
	}

	return validRowsSet;
}


export const actions: Actions = {
	validate: async (event) => {
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

			// Conversion vers format commun
			const config: ImportConfig = {
				data,
				mappedFields,
				selectedTables
			};

			// Validation via shared.ts
			const result = await validateImportData(config, {
				multiTable: true, // SvelteKit = multi-tables
				enableDatabaseCheck: true
			});

			// Retourner un formulaire avec le résultat intégré
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
		} catch (err) {
			console.error('Erreur lors de la validation:', err);
			return fail(500, {
				error: `Erreur de validation: ${err instanceof Error ? err.message : 'Erreur inconnue'}`
			});
		}
	},

	process: async (event) => {
		await protect(event);

		const { request } = event;
		try {
			// Validation du formulaire avec SuperForms
			const form = await superValidate(request, zod(importSchema));

			if (!form.valid) {
				return fail(400, { form });
			}

			const { data, mappedFields, selectedTables } = form.data;

			// Conversion vers format commun
			const config: ImportConfig = {
				data,
				mappedFields,
				selectedTables
			};

			// Validation d'abord via shared.ts
			const validationResult = await validateImportData(config, {
				multiTable: true,
				enableDatabaseCheck: true
			});

			// Calculer les lignes valides depuis le résultat de validation
			const validRowsSet = calculateValidRowsSet(validationResult, config.data.length);

			// Insertion avec transaction via shared.ts
			const insertResult = await insertValidatedData(config, validRowsSet, {
				useTransaction: true, // SvelteKit = transaction complète
				prismaClient: prisma
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
						selectedTables: selectedTables || [],
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
