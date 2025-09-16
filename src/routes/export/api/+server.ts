import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import * as XLSX from 'xlsx';
import { XMLBuilder } from 'fast-xml-parser';
import type { ExportConfig, ExportResult } from '../+page.server.js';
import {
	getAllDatabaseTables,
	getClient,
	getTableMetadata,
	getDatabases,
	type DatabaseName
} from '$lib/prisma-meta.js';

// Types pour l'export des données
interface ExportData {
	tableName: string;
	database: DatabaseName;
	data: Record<string, unknown>[];
	columns: string[];
	totalRows: number;
}

// Fonction pour générer un nom de fichier intelligent et dynamique
async function generateFileName(exportDataList: ExportData[], format: string): Promise<string> {
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

interface ExportFile {
	buffer: Buffer;
	fileName: string;
	mimeType: string;
	size: number;
}

export const POST: RequestHandler = async ({ request }) => {
	try {
		const config: ExportConfig = await request.json();
		console.log(`🚀 [EXPORT] Export demandé: ${config.selectedTables.length} tables en ${config.format.toUpperCase()}`);

		// Validation des données
		if (!config.selectedTables || config.selectedTables.length === 0) {
			throw error(400, "Aucune table sélectionnée pour l'export");
		}

		const supportedFormats = ['xlsx', 'csv', 'xml', 'json'];
		if (!supportedFormats.includes(config.format)) {
			throw error(400, `Format non supporté: ${config.format}`);
		}

		// Collecte des données à exporter
		const exportDataList: ExportData[] = [];
		const warnings: string[] = [];
		const errors: string[] = [];
		let totalExportedRows = 0;

		for (const tableId of config.selectedTables) {
			try {
				const tableData = await extractTableData(tableId, config.rowLimit);
				exportDataList.push(tableData);
				totalExportedRows += tableData.totalRows;
				console.log(`✅ [EXPORT] ${tableData.tableName} [${tableData.database}]: ${tableData.totalRows} lignes`);

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
			throw error(500, "Aucune donnée n'a pu être extraite");
		}

		// Détection préventive des doublons potentiels pour Excel
		if (config.format === 'xlsx') {
			const tableNames = exportDataList.map(t => t.tableName);
			const duplicates = tableNames.filter((name, index) => tableNames.indexOf(name) !== index);
			if (duplicates.length > 0) {
				console.log('⚠️ [EXPORT] Doublons détectés:', [...new Set(duplicates)]);
			}
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
				throw error(400, `Format non implémenté: ${config.format}`);
		}

		// Création de la réponse avec le fichier
		const result: ExportResult = {
			success: true,
			message: `Export terminé avec succès (${totalExportedRows} lignes)`,
			fileName: exportFile.fileName,
			fileSize: exportFile.size,
			exportedRows: totalExportedRows,
			warnings,
			errors
		};

		console.log(`✅ [EXPORT] Export terminé: ${result.fileName} (${result.fileSize} bytes, ${result.exportedRows} lignes)`);

		// Retourner le fichier avec les headers appropriés
		return new Response(new Uint8Array(exportFile.buffer).buffer, {
			status: 200,
			headers: {
				'Content-Type': exportFile.mimeType,
				'Content-Disposition': `attachment; filename="${exportFile.fileName}"`,
				'Content-Length': exportFile.size.toString(),
				'X-Export-Result': JSON.stringify(result)
			}
		});
	} catch (err) {
		console.error('❌ [EXPORT] Erreur générale:', err);

		if (
			(err instanceof Error && err.message.includes('400')) ||
			(err instanceof Error && err.message.includes('500'))
		) {
			throw err;
		}

		return json(
			{
				success: false,
				message: "Erreur lors de l'export",
				errors: [err instanceof Error ? err.message : 'Erreur inconnue'],
				warnings: [],
				exportedRows: 0
			} as ExportResult,
			{ status: 500 }
		);
	}
};

// Extraction des données d'une table avec logique dynamique
async function extractTableData(tableId: string, rowLimit?: number): Promise<ExportData> {
	const limit = rowLimit && rowLimit > 0 ? rowLimit : undefined;
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
		if (dbName !== 'cenov' && dbName !== 'cenov_dev_ewan') {
			throw new Error(`Base de données inconnue: ${dbName}`);
		}
		database = dbName as DatabaseName;
		tableName = parts.slice(1).join('-');
	} else {
		// Fallback: chercher dans toutes les bases (comportement original)
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

	// Pour l'export, utiliser des requêtes SQL directes plutôt que les modèles Prisma
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

	// Pour l'export complet, on garde les données binaires complètes mais en hex
	// (pas de limite à 50 caractères comme pour l'aperçu)
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
					// Convertir les colonnes binaires en hex avec limite Excel (32767 chars max)
					return `CASE WHEN "${field.name}" IS NOT NULL THEN LEFT(encode("${field.name}", 'hex'), 32767) ELSE NULL END as "${field.name}"`;
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
		data,
		columns,
		totalRows: data.length
	};
}

// Génération d'un fichier Excel
async function generateExcelFile(
	exportDataList: ExportData[],
	config: ExportConfig
): Promise<ExportFile> {
	const workbook = XLSX.utils.book_new();
	const usedSheetNames = new Set<string>();

	console.log('📊 [EXCEL] Génération du fichier XLSX...');
	console.log('📊 [EXCEL] Tables à traiter:', exportDataList.map(t => `${t.tableName} [${t.database}]`));

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
				let value = row[column];

				// Formatage des valeurs pour Excel
				if (value instanceof Date) {
					// Ne pas reformater si c'est déjà un timestamp formaté
					value = value.toISOString();
				} else if (value === null || value === undefined) {
					value = '';
				} else if (typeof value === 'object') {
					value = JSON.stringify(value);
				}
				// Les timestamps sont maintenant des strings formatés, on les garde tels quels

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
		console.log(`📊 [EXCEL] Table ${tableData.tableName} [${tableData.database}] → Feuille: ${sheetName}`);

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
	exportDataList: ExportData[],
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
				let value = row[column];

				// Formatage pour CSV
				if (value === null || value === undefined) {
					value = '';
				} else if (typeof value === 'object') {
					value = JSON.stringify(value);
				} else {
					value = String(value);
				}
				// Les timestamps sont maintenant des strings formatés, on les garde tels quels

				// Échappement des guillemets et des virgules
				if (
					typeof value === 'string' &&
					(value.includes(',') || value.includes('"') || value.includes('\n'))
				) {
					value = `"${value.replace(/"/g, '""')}"`;
				}

				csvRow.push(String(value));
			}
			csvContent += csvRow.join(',') + '\n';
		}
	}

	const buffer = Buffer.from(csvContent, 'utf-8');
	const fileName = await generateFileName(exportDataList, 'csv');

	return {
		buffer,
		fileName,
		mimeType: 'text/csv',
		size: buffer.length
	};
}

// Génération d'un fichier XML
async function generateXMLFile(exportDataList: ExportData[]): Promise<ExportFile> {
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
								let value = row[column];
								if (value === null || value === undefined) {
									value = '';
								} else if (typeof value === 'object') {
									value = JSON.stringify(value);
								} else {
									value = String(value);
								}
								// Les timestamps sont maintenant des strings formatés, on les garde tels quels
								xmlRow[column] = value;
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
	exportDataList: ExportData[],
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
