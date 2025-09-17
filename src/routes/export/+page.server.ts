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
	type TableInfo as PrismaTableInfo,
	type FieldInfo
} from '$lib/prisma-meta';
import { extractTableData, type SharedExportData } from './shared.js';

// Types pour l'export
export interface ExportConfig {
	selectedTables: string[];
	format: 'xlsx' | 'csv' | 'xml' | 'json';
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
	format: z.enum(['xlsx', 'csv', 'xml', 'json'], {
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
async function generateExportTables(): Promise<ExportTableInfo[]> {
	// Récupérer toutes les tables des deux bases de données
	const tables = await getAllDatabaseTables();

	const tablesWithMetadata = await Promise.all(
		tables.map(async (table) => {
			const metadata = await getTableMetadata(table.database, table.name);
			const columns: FieldInfo[] = metadata?.fields || [];

			return {
				...table,
				columns,
				relations: []
			};
		})
	);

	return tablesWithMetadata;
}

// Obtenir les informations sur les tables avec le compte de lignes
async function getTablesInfo(): Promise<ExportTableInfo[]> {
	const availableTables = await generateExportTables();

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
			for (const tableId of selectedTables) {
				try {
					const tableData: SharedExportData = await extractTableData(tableId, {
						limit: 6,
						maxBinaryLength: 50 // Limite pour preview
					});

					// Utiliser l'ID complet (database-tablename) pour éviter les collisions
					const tableName = tableId.includes('-') ? tableId.split('-').slice(1).join('-') : tableId;
					const previewKey = `${tableData.database}-${tableName}`;
					previewData[previewKey] = tableData.data;
				} catch (error) {
					console.error(
						`❌ [PREVIEW] Erreur lors de la récupération des données pour ${tableId}:`,
						error instanceof Error ? error.message : 'Erreur inconnue'
					);

					// Parser tableId pour créer la clé de preview même en cas d'erreur
					let previewKey: string;
					if (tableId.includes('-')) {
						previewKey = tableId;
					} else {
						// Fallback pour compatibilité
						const allTables = await getAllDatabaseTables();
						const tableInfo = allTables.find((t) => t.name === tableId);
						previewKey = tableInfo ? `${tableInfo.database}-${tableInfo.name}` : tableId;
					}
					previewData[previewKey] = [];
				}
			}

			return {
				form,
				success: true,
				preview: previewData,
				previewConfig: { includeHeaders: form.data.includeHeaders }
			};
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
			// Préserver les IDs complets avec database-tablename pour l'API

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
					contentType.includes('application/xml') ||
					contentType.includes('application/json'))
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
