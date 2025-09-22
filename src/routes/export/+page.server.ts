import { error, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { z } from 'zod';
import { superValidate } from 'sveltekit-superforms/server';
import { zod } from 'sveltekit-superforms/adapters';
import { protect } from '$lib/auth/protect';
import * as XLSX from 'xlsx';
import { XMLBuilder } from 'fast-xml-parser';
import {
	getAllDatabaseTables,
	getTableMetadata,
	countTableRows,
	getClient,
	getDatabases,
	type TableInfo as PrismaTableInfo,
	type FieldInfo,
	type DatabaseName
} from '$lib/prisma-meta';

// Type pour les données extraites
export interface SharedExportData {
	tableName: string;
	database: DatabaseName;
	schema: string;
	data: Record<string, unknown>[];
	columns: string[];
	totalRows: number;
}

// Options d'extraction
export interface ExtractionOptions {
	limit?: number;
	maxBinaryLength?: number;
}

// Types pour l'export
export interface ExportConfig {
	selectedSources: string[];
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
	formattedRowCount?: string; // Nombre de lignes formaté côté serveur
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

// Interface pour les fichiers d'export
interface ExportFile {
	buffer: Buffer;
	fileName: string;
	mimeType: string;
	size: number;
}

// Configuration des formats d'export (centralisé pour éliminer duplication)
const EXPORT_FORMATS_CONFIG = {
	csv: {
		value: 'csv',
		label: 'CSV (.csv)',
		description: 'Fichier texte séparé par des virgules',
		mimeType: 'text/csv; charset=utf-8',
		recommended: true
	},
	xlsx: {
		value: 'xlsx',
		label: 'Excel (.xlsx)',
		description: 'Classeur Excel avec plusieurs feuilles',
		mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
		recommended: false
	},
	json: {
		value: 'json',
		label: 'JSON (.json)',
		description: 'Structure de données avec métadonnées',
		mimeType: 'application/json',
		recommended: false
	},
	xml: {
		value: 'xml',
		label: 'XML (.xml)',
		description: 'Données structurées en XML',
		mimeType: 'application/xml',
		recommended: false
	}
} as const;

// Fonctions utilitaires pour les formats
export function _getExportFormats() {
	return Object.values(EXPORT_FORMATS_CONFIG);
}

function getValidFormats(): string[] {
	return Object.keys(EXPORT_FORMATS_CONFIG);
}

// Schéma de validation pour l'export
const exportSchema = z.object({
	selectedSources: z.array(z.string()).min(1, 'Sélectionnez au moins une source'),
	format: z.enum(['csv', 'xlsx', 'json', 'xml'], {
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

// Fonctions de formatage (centralisées pour éliminer duplication)
export function _formatNumber(num: number): string {
	return new Intl.NumberFormat('fr-FR').format(num);
}

export function _formatFileSize(bytes: number): string {
	const units = ['B', 'KB', 'MB', 'GB'];
	let size = bytes;
	let unitIndex = 0;
	while (size >= 1024 && unitIndex < units.length - 1) {
		size /= 1024;
		unitIndex++;
	}
	return `${size.toFixed(1)} ${units[unitIndex]}`;
}

// Formatage centralisé des valeurs pour export
function formatValueForExport(value: unknown): string {
	// Formatage des valeurs nulles
	if (value === null || value === undefined) {
		return '';
	}

	// Formatage des dates
	if (value instanceof Date) {
		return value.toISOString();
	}

	// Formatage des objets
	if (typeof value === 'object') {
		return JSON.stringify(value);
	}

	// Conversion en string
	return String(value);
}

// Extractions données tables
async function extractTableData(
	tableId: string,
	options: ExtractionOptions = {}
): Promise<SharedExportData> {
	const { limit, maxBinaryLength } = options;

	let data: Record<string, unknown>[] = [];
	let columns: string[] = [];

	// Parser l'ID pour extraire database et table name
	// Format: "database-tablename" ou juste "tablename" pour compatibilité
	let database: DatabaseName;
	let tableName: string;

	if (tableId.includes('-')) {
		const parts = tableId.split('-');
		const dbName = parts[0];
		// Validation du nom de base de données
		if (dbName !== 'cenov' && dbName !== 'cenov_dev') {
			throw new Error(`Base de données inconnue: ${dbName}`);
		}
		database = dbName as DatabaseName;
		tableName = parts.slice(1).join('-');
	} else {
		// Fallback: chercher dans toutes les bases
		const allTables = await getAllDatabaseTables();
		const tableInfo = allTables.find((t) => t.name === tableId);
		if (!tableInfo) {
			throw new Error(`Table non trouvée: ${tableId}`);
		}
		database = tableInfo.database;
		tableName = tableInfo.name;
	}

	const metadata = await getTableMetadata(database, tableName);
	if (!metadata) {
		throw new Error(`Métadonnées non trouvées pour ${tableName}`);
	}

	columns = metadata.fields.map((field) => field.name);

	// Pour l'extraction, utiliser des requêtes SQL directes plutôt que les modèles Prisma
	// car les noms de modèles peuvent avoir des préfixes de schéma
	const schema = metadata.schema || 'public';

	// Utiliser le nom @@map si disponible, sinon le nom de table Prisma
	let realTableName = tableName;

	// Récupérer les métadonnées complètes pour accéder au nom @@map
	const databases = await getDatabases();
	const model = databases[database].dmmf.datamodel.models.find((m) => m.name === tableName);

	if (model) {
		const modelWithMeta = model as { dbName?: string };
		// Si un nom @@map existe, l'utiliser
		if (modelWithMeta.dbName) {
			realTableName = modelWithMeta.dbName;
		} else {
			// Seulement nettoyer les préfixes évidents comme "public_"
			if (tableName.startsWith('public_') && schema === 'public') {
				realTableName = tableName.substring(7); // 'public_'.length = 7
			}
		}
	}

	// Construire le nom qualifié de la table avec le schéma
	const qualifiedTableName = `"${schema.replace(/"/g, '""')}"."${realTableName.replace(/"/g, '""')}"`;

	// Identifier les colonnes timestamp pour formatage spécial
	const timestampColumns = metadata?.fields.filter((f) => f.isTimestamp) ?? [];

	// Identifier les colonnes binaires
	const tableFields = metadata?.fields || [];
	const binaryColumns = tableFields
		.filter(
			(field) =>
				field.type.toLowerCase().includes('byte') ||
				field.name.includes('binary') ||
				field.name.includes('blob')
		)
		.map((field) => field.name);

	// Construction des sélections avec traitement spécial pour les colonnes binaires et timestamps
	let selectColumns = '*';
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

	if (binaryColumns.length > 0 || timestampColumns.length > 0) {
		const columnSelects = tableFields
			.map((field) => {
				if (binaryColumns.includes(field.name)) {
					// Convertir les colonnes binaires en hex
					const hexLimit = maxBinaryLength || (limit ? 50 : 32767); // 50 pour preview, 32767 pour export
					return `CASE WHEN "${field.name}" IS NOT NULL THEN LEFT(encode("${field.name}", 'hex'), ${hexLimit}) ELSE NULL END as "${field.name}"`;
				}
				return `"${field.name}"`;
			})
			.join(', ');
		selectColumns = columnSelects;
	}

	const query = limit
		? `SELECT ${selectColumns}${timestampSelects} FROM ${qualifiedTableName} LIMIT ${limit}`
		: `SELECT ${selectColumns}${timestampSelects} FROM ${qualifiedTableName}`;

	try {
		const prisma = await getClient(database);

		const rawData = (await (
			prisma as { $queryRawUnsafe: (query: string) => Promise<unknown[]> }
		).$queryRawUnsafe(query)) as Record<string, unknown>[];

		// Post-traitement : remplacer les timestamps Date par les versions string avec microsecondes
		data = rawData.map((row) => {
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
	} catch (err) {
		throw new Error(
			`Erreur lors de l'extraction de ${tableName}: ${err instanceof Error ? err.message : 'Erreur inconnue'}`
		);
	}

	return {
		tableName: realTableName, // Utiliser le nom @@map en priorité
		database,
		schema,
		data,
		columns,
		totalRows: data.length
	};
}

// Fonction pour générer un nom de fichier intelligent et dynamique
async function generateFileName(
	exportDataList: SharedExportData[],
	format: string
): Promise<string> {
	// Calculer dynamiquement le nombre total de tables disponibles
	const allTables = await getAllDatabaseTables();
	const totalAvailableTables = allTables.length;

	// Déterminer les bases de données utilisées à partir des données exportées
	const usedDatabases = new Set(exportDataList.map((data) => data.database));

	// Préfixe selon les bases utilisées (vraiment dynamique)
	let prefix: string;
	if (usedDatabases.size === 0) {
		prefix = 'export';
	} else if (usedDatabases.size === 1) {
		// Utiliser le vrai nom de base de données tel quel
		prefix = Array.from(usedDatabases)[0] as string;
	} else {
		// Concaténer tous les noms de bases utilisées
		prefix = Array.from(usedDatabases).sort().join('_');
	}

	let tablePart: string;
	const tableNames = exportDataList.map((d) => d.tableName);
	if (tableNames.length === totalAvailableTables) {
		tablePart = 'complet';
	} else if (tableNames.length === 1) {
		tablePart = tableNames[0];
	} else if (tableNames.length <= 3) {
		tablePart = tableNames.join('-');
	} else {
		tablePart = `${tableNames.length}tables`;
	}

	return `${prefix}_${tablePart}.${format}`;
}

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
					rowCount: count,
					formattedRowCount: _formatNumber(count) // Formatage côté serveur
				};
			} catch {
				return {
					...table,
					rowCount: 0,
					formattedRowCount: '0' // Formatage côté serveur
				};
			}
		})
	);

	return tablesWithCounts;
}

// Génération d'un fichier Excel
async function generateExcelFile(
	exportDataList: SharedExportData[],
	config: ExportConfig
): Promise<ExportFile> {
	const workbook = XLSX.utils.book_new();
	const usedSheetNames = new Set<string>();

	for (const tableData of exportDataList) {
		// Préparation des données pour Excel
		const worksheetData: unknown[][] = [];

		// En-têtes
		if (config.includeHeaders !== false) {
			worksheetData.push(tableData.columns);
		}

		// Données
		for (const row of tableData.data) {
			const excelRow: unknown[] = [];
			for (const column of tableData.columns) {
				const value = formatValueForExport(row[column]);
				excelRow.push(value);
			}
			worksheetData.push(excelRow);
		}

		// Création de la feuille de calcul
		const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

		// Ajustement automatique de la largeur des colonnes
		const colWidths = tableData.columns.map((col) => ({ wch: Math.max(col.length, 15) }));
		worksheet['!cols'] = colWidths;

		// Génération simple d'un nom de feuille : nom original + (1), (2) si doublon
		let baseSheetName = tableData.tableName;

		// Limiter à 31 caractères (limite Excel) en gardant de la place pour (X)
		if (baseSheetName.length > 27) {
			baseSheetName = baseSheetName.substring(0, 27);
		}

		// S'assurer de l'unicité avec (1), (2), etc.
		let sheetName = baseSheetName;
		let counter = 1;
		while (usedSheetNames.has(sheetName)) {
			sheetName = `${baseSheetName}(${counter})`;
			counter++;
		}

		usedSheetNames.add(sheetName);

		XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
	}

	// Génération du buffer
	const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

	const fileName = await generateFileName(exportDataList, 'xlsx');

	return {
		buffer: Buffer.from(buffer),
		fileName,
		mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
		size: buffer.length
	};
}

// Génération d'un fichier CSV
async function generateCSVFile(
	exportDataList: SharedExportData[],
	config: ExportConfig
): Promise<ExportFile> {
	let csvContent = '';

	for (let i = 0; i < exportDataList.length; i++) {
		const tableData = exportDataList[i];

		// Séparateur entre les tables (sauf pour la première)
		if (i > 0) {
			csvContent += '\n\n';
		}

		// Nom de la table (utilise désormais le nom @@map en priorité)
		csvContent += `# Table: ${tableData.tableName}\n`;

		// En-têtes
		if (config.includeHeaders !== false) {
			csvContent += tableData.columns.join(',') + '\n';
		}

		// Données
		for (const row of tableData.data) {
			const csvRow: string[] = [];
			for (const column of tableData.columns) {
				let value = formatValueForExport(row[column]);

				// Échappement CSV spécifique
				if (value.includes(',') || value.includes('"') || value.includes('\n')) {
					value = `"${value.replace(/"/g, '""')}"`;
				}

				csvRow.push(value);
			}
			csvContent += csvRow.join(',') + '\n';
		}
	}

	// Ajouter BOM UTF-8 pour une meilleure compatibilité
	const csvWithBOM = '\uFEFF' + csvContent;
	const buffer = Buffer.from(csvWithBOM, 'utf-8');
	const fileName = await generateFileName(exportDataList, 'csv');

	return {
		buffer,
		fileName,
		mimeType: 'text/csv; charset=utf-8',
		size: buffer.length
	};
}

// Génération d'un fichier XML
async function generateXMLFile(exportDataList: SharedExportData[]): Promise<ExportFile> {
	const xmlData: Record<string, unknown> = {
		export: {
			'@_generated': new Date().toISOString(),
			'@_tables': exportDataList.length,
			'@_totalRows': exportDataList.reduce((sum, t) => sum + t.totalRows, 0),
			tables: {
				table: exportDataList.map((tableData) => ({
					'@_name': tableData.tableName,
					'@_rows': tableData.totalRows,
					columns: {
						column: tableData.columns.map((col) => ({
							'@_name': col
						}))
					},
					data: {
						row: tableData.data.map((row) => {
							const xmlRow: Record<string, unknown> = {};
							for (const column of tableData.columns) {
								xmlRow[column] = formatValueForExport(row[column]);
							}
							return xmlRow;
						})
					}
				}))
			}
		}
	};

	const builder = new XMLBuilder({
		ignoreAttributes: false,
		format: true,
		indentBy: '  '
	});

	const xmlContent = '<?xml version="1.0" encoding="UTF-8"?>\n' + builder.build(xmlData);
	const buffer = Buffer.from(xmlContent, 'utf-8');
	const fileName = await generateFileName(exportDataList, 'xml');

	return {
		buffer,
		fileName,
		mimeType: 'application/xml',
		size: buffer.length
	};
}

// Génération d'un fichier JSON
async function generateJSONFile(
	exportDataList: SharedExportData[],
	config: ExportConfig
): Promise<ExportFile> {
	const jsonData = {
		metadata: {
			exportDate: new Date().toISOString(),
			format: 'json',
			includeHeaders: config.includeHeaders,
			rowLimit: config.rowLimit || null,
			totalTables: exportDataList.length,
			totalRows: exportDataList.reduce((sum, t) => sum + t.totalRows, 0)
		},
		databases: exportDataList.reduce(
			(acc, tableData) => {
				if (!acc[tableData.database]) {
					acc[tableData.database] = {
						name: tableData.database,
						tables: {}
					};
				}

				acc[tableData.database].tables[tableData.tableName] = {
					metadata: {
						tableName: tableData.tableName,
						columns: tableData.columns,
						totalRows: tableData.totalRows,
						exportedRows: tableData.data.length
					},
					data: tableData.data
				};

				return acc;
			},
			{} as Record<string, { name: string; tables: Record<string, unknown> }>
		)
	};

	const jsonContent = JSON.stringify(jsonData, null, 2);
	const buffer = Buffer.from(jsonContent, 'utf-8');
	const fileName = await generateFileName(exportDataList, 'json');

	return {
		buffer,
		fileName,
		mimeType: 'application/json',
		size: buffer.length
	};
}

export const load = (async (event) => {
	await protect(event);

	const { depends } = event;
	depends('app:export');

	try {
		const tables = await getTablesInfo();
		const form = await superValidate(zod(exportSchema));

		form.data = {
			selectedSources: [],
			format: 'csv',
			includeRelations: false,
			filters: {},
			includeHeaders: true
		};

		const totalRows = tables.reduce((sum, table) => sum + (table.rowCount || 0), 0);

		return {
			form,
			tables,
			totalTables: tables.length,
			totalRows,
			formattedTotalRows: _formatNumber(totalRows), // Formatage côté serveur
			exportFormats: _getExportFormats() // Données statiques, pas de fonction
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
			const { selectedSources } = form.data;
			const previewData: Record<string, unknown[]> = {};

			// Récupérer un aperçu des données pour chaque table sélectionnée
			for (const tableId of selectedSources) {
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

		const { request } = event;
		const form = await superValidate(request, zod(exportSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			const config: ExportConfig = form.data;

			// Validation des données
			if (!config.selectedSources || config.selectedSources.length === 0) {
				return fail(400, {
					form,
					error: "Aucune table sélectionnée pour l'export"
				});
			}

			const supportedFormats = getValidFormats();
			if (!supportedFormats.includes(config.format)) {
				return fail(400, {
					form,
					error: `Format non supporté: ${config.format}`
				});
			}

			// Collecte des données à exporter
			const exportDataList: SharedExportData[] = [];
			const warnings: string[] = [];
			const errors: string[] = [];
			let totalExportedRows = 0;

			for (const tableId of config.selectedSources) {
				try {
					const sharedTableData = await extractTableData(tableId, {
						limit: config.rowLimit,
						maxBinaryLength: undefined // Pas de limite pour export complet
					});

					// Utiliser directement SharedExportData (pas besoin d'adaptation)
					const tableData: SharedExportData = sharedTableData;

					exportDataList.push(tableData);
					totalExportedRows += tableData.totalRows;

					if (config.rowLimit && tableData.totalRows >= config.rowLimit) {
						warnings.push(
							`Table ${tableData.tableName}: limite de ${config.rowLimit} lignes appliquée`
						);
					}
				} catch (err) {
					console.error(`❌ [EXPORT] Erreur avec ${tableId}:`, err);
					errors.push(
						`Erreur lors de l'extraction de ${tableId}: ${err instanceof Error ? err.message : 'Erreur inconnue'}`
					);
				}
			}

			if (exportDataList.length === 0) {
				return fail(500, {
					form,
					error: "Aucune donnée n'a pu être extraite"
				});
			}

			// Génération du fichier selon le format
			let exportFile: ExportFile;

			switch (config.format) {
				case 'xlsx':
					exportFile = await generateExcelFile(exportDataList, config);
					break;
				case 'csv':
					exportFile = await generateCSVFile(exportDataList, config);
					break;
				case 'xml':
					exportFile = await generateXMLFile(exportDataList);
					break;
				case 'json':
					exportFile = await generateJSONFile(exportDataList, config);
					break;
				default:
					return fail(400, {
						form,
						error: `Format non implémenté: ${config.format}`
					});
			}

			// Création du résultat avec le fichier à télécharger
			const result: ExportResult = {
				success: true,
				message: `Export terminé avec succès (${totalExportedRows} lignes)`,
				fileName: exportFile.fileName,
				fileSize: exportFile.size,
				exportedRows: totalExportedRows,
				warnings,
				errors,
				needsClientDownload: true
			};

			// Encoder le fichier en base64 pour transmission via form action
			const fileBase64 = exportFile.buffer.toString('base64');

			return {
				form,
				success: true,
				result,
				fileData: {
					content: fileBase64,
					fileName: exportFile.fileName,
					mimeType: exportFile.mimeType,
					size: exportFile.size
				}
			};
		} catch (err) {
			console.error('❌ [EXPORT] Erreur générale:', err);

			return fail(500, {
				form,
				error: `Erreur lors de l'export: ${err instanceof Error ? err.message : 'Erreur inconnue'}`
			});
		}
	}
};
