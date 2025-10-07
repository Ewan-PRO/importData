// src/routes/export/export-server-logic.ts
import * as XLSX from 'xlsx';
import { XMLBuilder } from 'fast-xml-parser';
import {
	getTableMetadata,
	getClient,
	getDatabases,
	getAllDatabaseTables,
	getAllDatabaseNames,
	type DatabaseName
} from '$lib/prisma-meta';
import type { SharedExportData, ExtractionOptions, ExportConfig } from './+page.server';

// Interface pour les fichiers d'export
export interface ExportFile {
	buffer: Buffer;
	fileName: string;
	mimeType: string;
	size: number;
}

// Formatage centralisé des valeurs pour export
export function formatValueForExport(value: unknown): string {
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
export async function extractTableData(
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
		// Validation dynamique du nom de base de données
		const validDatabases = await getAllDatabaseNames();
		if (!validDatabases.includes(dbName as DatabaseName)) {
			throw new Error(`Base de données inconnue: ${dbName}. Valides: ${validDatabases.join(', ')}`);
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
			// Nettoyer les préfixes de schéma dynamiquement (ex: "public_", "produit_")
			if (schema && tableName.startsWith(`${schema}_`)) {
				realTableName = tableName.substring(schema.length + 1); // +1 pour le '_'
			}
		}
	}

	// Construire le nom qualifié de la table avec le schéma
	const qualifiedTableName = `"${schema.replace(/"/g, '""')}"."${realTableName.replace(/"/g, '""')}"`;

	// Identifier les colonnes datetime (Date + Timestamp) pour formatage spécial
	const timestampColumns =
		metadata?.fields.filter((f) => f.type === 'DateTime' || f.isTimestamp) ?? [];

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
export async function generateFileName(
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

// Génération d'un fichier Excel
export async function generateExcelFile(
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
export async function generateCSVFile(
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
export async function generateXMLFile(exportDataList: SharedExportData[]): Promise<ExportFile> {
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
export async function generateJSONFile(
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
