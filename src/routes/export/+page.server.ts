import { error, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { z } from 'zod';
import { superValidate } from 'sveltekit-superforms/server';
import { zod } from 'sveltekit-superforms/adapters';
import { protect } from '$lib/auth/protect';
import {
	getAllDatabaseTables,
	getTableMetadata,
	countTableRows,
	getClient,
	type TableInfo as PrismaTableInfo,
	type FieldInfo
} from '$lib/prisma-meta';

// Types pour l'export
export interface ExportConfig {
	selectedTables: string[];
	format: 'xlsx' | 'csv' | 'xml';
	includeRelations: boolean;
	rowLimit?: number;
	filters: Record<string, unknown>;
	includeHeaders: boolean;
}

// Extension de TableInfo pour inclure les données d'export
export interface ExportTableInfo extends PrismaTableInfo {
	columns: FieldInfo[];
	relations?: string[];
}

export interface ExportResult {
	success: boolean;
	message: string;
	downloadUrl?: string;
	fileName?: string;
	fileSize?: number;
	exportedRows: number;
	warnings: string[];
	errors: string[];
	needsClientDownload?: boolean;
}

// Schéma de validation pour l'export
const exportSchema = z.object({
	selectedTables: z.array(z.string()).min(1, 'Sélectionnez au moins une table'),
	format: z.enum(['xlsx', 'csv', 'xml'], {
		errorMap: () => ({ message: 'Format non supporté' })
	}),
	includeRelations: z.boolean().default(false),
	rowLimit: z.number().min(1).max(1000000).optional(),
	filters: z.record(z.unknown()).default({}),
	includeHeaders: z.boolean().default(true),
	dateRange: z
		.object({
			from: z.string().optional(),
			to: z.string().optional()
		})
		.optional()
});

// Génération des informations d'export à partir des métadonnées Prisma
function generateExportTables(): ExportTableInfo[] {
	// Récupérer toutes les tables des deux bases de données
	const tables = getAllDatabaseTables();

	return tables.map((table) => {
		const metadata = getTableMetadata(table.database, table.name);
		const columns: FieldInfo[] = metadata?.fields || [];

		return {
			...table,
			columns,
			relations: []
		};
	});
}

// Obtenir les informations sur les tables avec le compte de lignes
async function getTablesInfo(): Promise<ExportTableInfo[]> {
	const availableTables = generateExportTables();

	const tablesWithCounts = await Promise.all(
		availableTables.map(async (table) => {
			try {
				const count = await countTableRows(table.database, table.name);
				return {
					...table,
					rowCount: count
				};
			} catch {
				return {
					...table,
					rowCount: 0
				};
			}
		})
	);

	return tablesWithCounts;
}

export const load = (async (event) => {
	await protect(event);

	const { depends } = event;
	depends('app:export');

	try {
		const tables = await getTablesInfo();
		const form = await superValidate(zod(exportSchema));

		form.data = {
			selectedTables: [],
			format: 'csv',
			includeRelations: false,
			filters: {},
			includeHeaders: true
		};

		return {
			form,
			tables,
			totalTables: tables.length,
			totalRows: tables.reduce((sum, table) => sum + (table.rowCount || 0), 0)
		};
	} catch (err) {
		throw error(
			500,
			`Erreur lors du chargement de la page export: ${err instanceof Error ? err.message : 'Erreur inconnue'}`
		);
	}
}) satisfies PageServerLoad;

export const actions: Actions = {
	preview: async (event) => {
		await protect(event);

		const { request } = event;
		const form = await superValidate(request, zod(exportSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			const { selectedTables } = form.data;
			const previewData: Record<string, unknown[]> = {};

			// Récupérer un aperçu des données pour chaque table sélectionnée
			for (const tableName of selectedTables) {
				const limit = 5;

				try {
					// Déterminer quelle base de données utiliser pour cette table
					const allTables = getAllDatabaseTables();
					const tableInfo = allTables.find((t) => t.name === tableName);
					
					if (!tableInfo) {
						console.error(`❌ [PREVIEW] Table non trouvée: ${tableName}`);
						continue; // Passer à la table suivante
					}
					
					const database = tableInfo.database;

					// Utiliser l'accès dynamique aux modèles Prisma
					const prisma = getClient(database);

					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					const model = (prisma as Record<string, any>)[tableName];
					if (!model) {
						continue;
					}

					// Déterminer la colonne pour l'ordre (clé primaire)
					const metadata = getTableMetadata(database, tableName);
					const primaryKey = metadata?.primaryKey;
					const orderBy = primaryKey ? { [primaryKey]: 'asc' } : {};

					// Récupérer les données avec l'ordre approprié
					const data = await model.findMany({
						take: limit,
						...(Object.keys(orderBy).length > 0 && { orderBy })
					});

					previewData[tableName] = data;
				} catch {
					previewData[tableName] = [];
				}
			}

			return { form, success: true, preview: previewData };
		} catch {
			return fail(500, {
				form,
				error: "Erreur lors de l'aperçu des données"
			});
		}
	},

	export: async (event) => {
		await protect(event);

		const { request, fetch } = event;
		const form = await superValidate(request, zod(exportSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			const response = await fetch('/export/api', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(form.data)
			});

			const contentType = response.headers.get('content-type');

			if (!response.ok) {
				let errorData;
				try {
					errorData = await response.json();
				} catch {
					errorData = { error: "Erreur de communication avec l'API" };
				}
				return fail(response.status, {
					form,
					error: errorData.error || "Erreur lors de l'export"
				});
			}

			if (
				contentType &&
				(contentType.includes('application/vnd.openxml') ||
					contentType.includes('text/csv') ||
					contentType.includes('application/xml'))
			) {
				const exportResultHeader = response.headers.get('X-Export-Result');
				if (exportResultHeader) {
					const result = JSON.parse(exportResultHeader);
					const finalResult = { ...result, needsClientDownload: true, downloadUrl: '/export/api' };
					return { form, success: true, result: finalResult };
				}
			}

			let result;
			try {
				result = await response.json();
			} catch {
				return fail(500, {
					form,
					error: "Erreur lors du parsing de la réponse d'export"
				});
			}

			return { form, success: true, result };
		} catch {
			return fail(500, {
				form,
				error: "Erreur lors de l'export des données"
			});
		}
	}
};
