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
	type FieldInfo,
	type DatabaseName
} from '$lib/prisma-meta';

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
				const limit = 6;

				// Parser l'ID pour extraire database et table name
				let database: DatabaseName;
				let tableName: string;

				if (tableId.includes('-')) {
					const parts = tableId.split('-');
					const dbName = parts[0];
					// Validation du nom de base de données
					if (dbName !== 'cenov' && dbName !== 'cenov_dev_ewan') {
						console.error(`❌ [PREVIEW] Base de données inconnue: ${dbName}`);
						continue;
					}
					database = dbName as DatabaseName;
					tableName = parts.slice(1).join('-');
				} else {
					// Fallback pour compatibilité
					const allTables = await getAllDatabaseTables();
					const tableInfo = allTables.find((t) => t.name === tableId);
					if (!tableInfo) {
						console.error(`❌ [PREVIEW] Table ${tableId} non trouvée`);
						continue;
					}
					database = tableInfo.database;
					tableName = tableInfo.name;
				}

				try {
					// Obtenir le client Prisma
					const prisma = await getClient(database);

					// Obtenir les métadonnées pour identifier les colonnes timestamp
					const metadata = await getTableMetadata(database, tableName);
					const timestampColumns = metadata?.fields.filter((f) => f.isTimestamp) ?? [];
					const schema = metadata?.schema || 'public';

					// Utiliser $queryRaw sécurisé avec Prisma.sql pour préserver les microsecondes
					let timestampSelects = '';
					if (timestampColumns.length > 0) {
						timestampSelects =
							', ' +
							timestampColumns
								.map(
									(col) =>
										`"${col.name.replace(/"/g, '""')}"::text as "${col.name.replace(/"/g, '""')}_str"`
								)
								.join(', ');
					}

					// Nettoyer le nom de table pour enlever le préfixe de schéma auto-généré par Prisma
					let realTableName = tableName;
					console.log(`🔍 [PREVIEW-DEBUG] Original tableName: ${tableName}, Schema: ${schema}`);

					if (tableName.startsWith(`${schema}_`)) {
						realTableName = tableName.substring(schema.length + 1);
						console.log(`🧹 [PREVIEW] Nettoyage préfixe: ${tableName} → ${realTableName}`);
					} else {
						console.log(`ℹ️ [PREVIEW] Pas de nettoyage nécessaire pour: ${tableName}`);
					}

					// Construire le nom qualifié de la table avec le schéma
					const qualifiedTableName = `"${schema.replace(/"/g, '""')}"."${realTableName.replace(/"/g, '""')}"`;

					console.log(
						`🔍 [PREVIEW] Table: ${tableName}, Schema: ${schema}, Real name: ${realTableName}, Qualified: ${qualifiedTableName}`
					);

					// Détection des colonnes binaires et construction de la requête SELECT
					const columns = metadata?.fields || [];
					const binaryColumns = columns
						.filter(col => col.type.toLowerCase().includes('byte') || col.name.includes('binary') || col.name.includes('blob'))
						.map(col => col.name);

					// Construction des sélections avec traitement spécial pour les colonnes binaires
					let selectColumns = '*';
					if (binaryColumns.length > 0) {
						const columnSelects = columns.map(col => {
							if (binaryColumns.includes(col.name)) {
								// Convertir les colonnes binaires en hex limité à 50 caractères
								return `CASE WHEN "${col.name}" IS NOT NULL THEN LEFT(encode("${col.name}", 'hex'), 50) ELSE NULL END as "${col.name}"`;
							}
							return `"${col.name}"`;
						}).join(', ');
						selectColumns = columnSelects;
					}

					const rawData = (await (
						prisma as { $queryRawUnsafe: (query: string) => Promise<unknown[]> }
					).$queryRawUnsafe(`
						SELECT ${selectColumns}${timestampSelects}
						FROM ${qualifiedTableName}
						LIMIT ${limit}
					`)) as Record<string, unknown>[];

					// Post-traitement : remplacer les timestamps Date par les versions string
					const processedData = rawData.map((row) => {
						const processedRow = { ...row };
						timestampColumns.forEach((col) => {
							const stringKey = `${col.name}_str`;
							if (processedRow[stringKey]) {
								// Remplacer la version Date par la version string avec microsecondes
								processedRow[col.name] = processedRow[stringKey];
								// Supprimer la colonne temporaire _str
								delete processedRow[stringKey];
							}
						});
						return processedRow;
					});

					// Utiliser l'ID complet (database-tablename) pour éviter les collisions
					const previewKey = `${database}-${tableName}`;
					previewData[previewKey] = processedData;
					console.log(
						`✅ [PREVIEW] Succès pour ${tableName}: ${processedData.length} lignes récupérées`
					);
				} catch (error) {
					console.error(
						`❌ [PREVIEW] Erreur lors de la récupération des données pour ${tableName}:`,
						error
					);

					// Détails supplémentaires pour le debug
					if (error instanceof Error) {
						console.error(`❌ [PREVIEW] Message d'erreur: ${error.message}`);
						console.error(`❌ [PREVIEW] Stack: ${error.stack}`);
					}

					const previewKey = `${database}-${tableName}`;
					previewData[previewKey] = [];
					console.log(`❌ [PREVIEW] Données vides ajoutées pour ${previewKey}`);
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
