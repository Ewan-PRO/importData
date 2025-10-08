// src/routes/kits/+page.server.ts - Serveur unifié avec Prisma DMMF
import { error, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { z } from 'zod';
import { superValidate } from 'sveltekit-superforms/server';
import { zod } from 'sveltekit-superforms/adapters';
import { protect } from '$lib/auth/protect';
import { useDevTables } from '$lib/server/db';
import {
	getDatabases,
	getTableMetadata,
	findRecord,
	createRecord,
	updateRecord,
	type DatabaseName,
	type FieldInfo
} from '$lib/prisma-meta';

// Fonction utilitaire pour convertir en toute sécurité les valeurs FormData en string
function safeFormDataToString(value: FormDataEntryValue | null): string {
	if (value === null) return '';
	if (typeof value === 'string') return value;
	if (value instanceof File) return value.name;
	return '';
}

// ========== SYSTÈME 100% DYNAMIQUE SANS HARDCODING ==========

// Fonction générique pour générer un schéma Zod depuis n'importe quelle table DMMF
async function generateDynamicSchemaFromTable(
	database: DatabaseName,
	tableName: string
): Promise<{
	schema: z.ZodObject<Record<string, z.ZodTypeAny>>;
	columns: FieldInfo[];
}> {
	const metadata = await getTableMetadata(database, tableName);
	if (!metadata) {
		throw new Error(`Métadonnées non trouvées pour la table ${tableName}`);
	}

	const zodFields: Record<string, z.ZodTypeAny> = {};

	metadata.fields.forEach((field) => {
		let zodType: z.ZodTypeAny = z.string();

		// Validation selon le type DMMF
		switch (field.type) {
			case 'Int':
			case 'Float':
			case 'Decimal':
				zodType = zodType.refine((val) => !isNaN(parseFloat(val)), {
					message: `${field.name} doit être un nombre valide`
				});
				break;
			case 'DateTime':
				zodType = zodType.refine((val) => !isNaN(Date.parse(val)), {
					message: `${field.name} doit être une date valide`
				});
				break;
			case 'Boolean':
				zodType = zodType.refine((val) => ['true', 'false', '1', '0'].includes(val.toLowerCase()), {
					message: `${field.name} doit être true/false`
				});
				break;
		}

		// Champs obligatoires (détectés via DMMF)
		if (field.isRequired && !field.isPrimaryKey) {
			if (zodType instanceof z.ZodString) {
				zodType = zodType.min(1, { message: `${field.name} est obligatoire` });
			}
		} else {
			zodType = zodType.optional();
		}

		zodFields[field.name] = zodType;
	});

	return {
		schema: z.object(zodFields),
		columns: metadata.fields
	};
}

// Fonction générique pour récupérer des données depuis n'importe quelle vue/table
async function getDataFromTable(database: DatabaseName, tableName: string): Promise<unknown[]> {
	const databases = await getDatabases();
	const client = databases[database].client;

	const model = client[tableName] as { findMany: () => Promise<unknown[]> };
	if (!model?.findMany) {
		throw new Error(`Table/Vue ${tableName} non trouvée dans la base ${database}`);
	}

	return await model.findMany();
}

// Fonction générique pour créer un enregistrement dans n'importe quelle table
async function createRecordDynamic(
	database: DatabaseName,
	tableName: string,
	formData: Record<string, string>
): Promise<unknown> {
	const metadata = await getTableMetadata(database, tableName);
	if (!metadata) {
		throw new Error(`Métadonnées non trouvées pour la table ${tableName}`);
	}

	const insertData: Record<string, unknown> = {};

	// Conversion automatique selon les types DMMF
	metadata.fields.forEach((field) => {
		if (formData[field.name] !== undefined && !field.isPrimaryKey) {
			const value = formData[field.name];

			if (value === '' || value === null) {
				// Valeur vide : null si optionnel, erreur si requis
				if (!field.isRequired) {
					insertData[field.name] = null;
				}
				return;
			}

			// Conversion selon le type DMMF
			switch (field.type) {
				case 'Int':
					insertData[field.name] = parseInt(value, 10);
					break;
				case 'Float':
				case 'Decimal':
					insertData[field.name] = parseFloat(value);
					break;
				case 'Boolean':
					insertData[field.name] = ['true', '1'].includes(value.toLowerCase());
					break;
				case 'DateTime':
					insertData[field.name] = new Date(value);
					break;
				default:
					insertData[field.name] = value;
			}
		}
	});

	return await createRecord(database, tableName, insertData);
}

// Fonction générique pour mettre à jour un enregistrement dans n'importe quelle table
async function updateRecordDynamic(
	database: DatabaseName,
	tableName: string,
	id: number,
	formData: Record<string, string>
): Promise<unknown> {
	const metadata = await getTableMetadata(database, tableName);
	if (!metadata) {
		throw new Error(`Métadonnées non trouvées pour la table ${tableName}`);
	}

	const primaryKey = metadata.primaryKey;

	// Vérifier que l'enregistrement existe
	const existingRecord = await findRecord(database, tableName, { [primaryKey]: id });
	if (!existingRecord) {
		throw new Error('Enregistrement non trouvé');
	}

	const updateData: Record<string, unknown> = {};

	// Conversion automatique selon les types DMMF
	metadata.fields.forEach((field) => {
		if (formData[field.name] !== undefined && !field.isPrimaryKey) {
			const value = formData[field.name];

			if (value === '' || value === null) {
				if (!field.isRequired) {
					updateData[field.name] = null;
				}
				return;
			}

			// Conversion selon le type DMMF
			switch (field.type) {
				case 'Int':
					updateData[field.name] = parseInt(value, 10);
					break;
				case 'Float':
				case 'Decimal':
					updateData[field.name] = parseFloat(value);
					break;
				case 'Boolean':
					updateData[field.name] = ['true', '1'].includes(value.toLowerCase());
					break;
				case 'DateTime':
					updateData[field.name] = new Date(value);
					break;
				default:
					updateData[field.name] = value;
			}
		}
	});

	return await updateRecord(database, tableName, { [primaryKey]: id }, updateData);
}

// Fonction générique pour supprimer un enregistrement dans n'importe quelle table
async function deleteRecordDynamic(
	database: DatabaseName,
	tableName: string,
	id: number
): Promise<unknown> {
	const metadata = await getTableMetadata(database, tableName);
	if (!metadata) {
		throw new Error(`Métadonnées non trouvées pour la table ${tableName}`);
	}

	const primaryKey = metadata.primaryKey;

	// Vérifier que l'enregistrement existe
	const existingRecord = await findRecord(database, tableName, { [primaryKey]: id });
	if (!existingRecord) {
		throw new Error('Enregistrement non trouvé');
	}

	const databases = await getDatabases();
	const client = databases[database].client;
	const model = client[tableName] as {
		delete: (args: { where: unknown }) => Promise<unknown>;
	};

	if (!model?.delete) {
		throw new Error(`Table ${tableName} non trouvée dans la base ${database}`);
	}

	return await model.delete({ where: { [primaryKey]: id } });
}

// ========== CONFIGURATION 100% DYNAMIQUE DMMF ==========

// Récupérer automatiquement la première vue disponible (100% dynamique DMMF)
async function getFirstAvailableView(): Promise<{ database: DatabaseName; tableName: string }> {
	const useDevViews = useDevTables();
	const database: DatabaseName = useDevViews ? 'cenov_dev' : 'cenov';

	const databases = await getDatabases();
	const availableModels = databases[database].dmmf.datamodel.models;

	// Trouver la première vue (nom contenant 'v_')
	const firstView = availableModels.find(
		(model) => model.name.includes('v_') || model.name.includes('_v_')
	);

	if (firstView) {
		return { database, tableName: firstView.name };
	}

	// Si aucune vue, prendre le premier modèle disponible
	return { database, tableName: availableModels[0]?.name || 'defaultTable' };
}

// Récupérer automatiquement la première table disponible (100% dynamique DMMF)
async function getFirstAvailableTable(): Promise<{ database: DatabaseName; tableName: string }> {
	const useDevViews = useDevTables();
	const database: DatabaseName = useDevViews ? 'cenov_dev' : 'cenov';

	const databases = await getDatabases();
	const availableModels = databases[database].dmmf.datamodel.models;

	// Trouver la première table (nom ne contenant pas 'v_')
	const firstTable = availableModels.find(
		(model) => !model.name.includes('v_') && !model.name.includes('_v_')
	);

	if (firstTable) {
		return { database, tableName: firstTable.name };
	}

	// Si aucune table, prendre le premier modèle disponible
	return { database, tableName: availableModels[0]?.name || 'defaultTable' };
}

// ========== LOAD ET ACTIONS ==========

export const load = (async (event) => {
	// Protection de la route - redirection vers / si non connecté
	await protect(event);

	const { depends } = event;
	depends('app:kits'); // Pour permettre l'invalidation avec invalidateAll()

	try {
		// Détection 100% dynamique via DMMF
		const viewInfo = await getFirstAvailableView();
		const tableInfo = await getFirstAvailableTable();

		// Récupérer les données depuis la vue détectée
		const data = await getDataFromTable(viewInfo.database, viewInfo.tableName);

		// Générer le schéma et les colonnes dynamiquement depuis la table détectée
		const { schema, columns } = await generateDynamicSchemaFromTable(
			tableInfo.database,
			tableInfo.tableName
		);

		// Créer un formulaire avec le schéma dynamique
		const form = await superValidate(zod(schema));

		return {
			data,
			columns,
			form
		};
	} catch (err) {
		throw error(
			500,
			`Erreur lors du chargement des données: ${err instanceof Error ? err.message : 'Erreur inconnue'}`
		);
	}
}) satisfies PageServerLoad;

export const actions: Actions = {
	create: async (event) => {
		// Protection de l'action - redirection vers / si non connecté
		await protect(event);

		const { request } = event;
		const formData = await request.formData();

		// Détection 100% dynamique via DMMF
		const tableInfo = await getFirstAvailableTable();
		const { schema } = await generateDynamicSchemaFromTable(
			tableInfo.database,
			tableInfo.tableName
		);

		const form = await superValidate(formData, zod(schema));

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			const result = await createRecordDynamic(tableInfo.database, tableInfo.tableName, form.data);

			// Réinitialiser le formulaire après succès
			return { form, success: true, data: result };
		} catch (err) {
			console.error('Erreur lors de la création:', err);
			const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la création';
			return fail(500, {
				form,
				error: errorMessage
			});
		}
	},

	update: async (event) => {
		// Protection de l'action - redirection vers / si non connecté
		await protect(event);

		const { request } = event;
		const formData = await request.formData();
		const id = safeFormDataToString(formData.get('id'));

		if (!id) {
			return fail(400, { error: 'ID manquant' });
		}

		// Détection 100% dynamique via DMMF
		const tableInfo = await getFirstAvailableTable();

		// Extraire toutes les données du formulaire dynamiquement
		const updateData: Record<string, string> = {};
		for (const [key, value] of formData.entries()) {
			if (key !== 'id') {
				updateData[key] = safeFormDataToString(value);
			}
		}

		try {
			const result = await updateRecordDynamic(
				tableInfo.database,
				tableInfo.tableName,
				parseInt(id),
				updateData
			);
			return { success: true, data: result };
		} catch (err) {
			console.error('Erreur lors de la mise à jour:', err);
			const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la mise à jour';
			return fail(500, { error: errorMessage });
		}
	},

	delete: async (event) => {
		// Protection de l'action - redirection vers / si non connecté
		await protect(event);

		const { request } = event;
		const formData = await request.formData();
		const id = safeFormDataToString(formData.get('id'));

		if (!id) {
			return fail(400, { error: 'ID manquant' });
		}

		// Détection 100% dynamique via DMMF
		const tableInfo = await getFirstAvailableTable();

		try {
			await deleteRecordDynamic(tableInfo.database, tableInfo.tableName, parseInt(id));
			return { success: true };
		} catch (err) {
			console.error('Erreur lors de la suppression:', err);
			const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la suppression';
			return fail(500, { error: errorMessage });
		}
	}
};
