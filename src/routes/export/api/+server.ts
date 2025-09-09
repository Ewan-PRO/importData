import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import * as XLSX from 'xlsx';
import { XMLBuilder } from 'fast-xml-parser';
import type { ExportConfig, ExportResult } from '../+page.server.js';
import { getAllDatabaseTables, getClient, getTableMetadata } from '$lib/prisma-meta.js';

// Types pour l'export des données
interface ExportData {
	tableName: string;
	data: Record<string, unknown>[];
	columns: string[];
	totalRows: number;
}

// Fonction pour générer un nom de fichier intelligent et dynamique
function generateFileName(selectedTables: string[], format: string): string {
	// Calculer dynamiquement le nombre total de tables disponibles
	const allTables = getAllDatabaseTables();
	const totalAvailableTables = allTables.length;
	
	// Déterminer les bases de données utilisées
	const usedDatabases = new Set(
		selectedTables
			.map(tableName => allTables.find(t => t.name === tableName)?.database)
			.filter(Boolean)
	);
	
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
	if (selectedTables.length === totalAvailableTables) {
		tablePart = 'complet';
	} else if (selectedTables.length === 1) {
		tablePart = selectedTables[0];
	} else if (selectedTables.length <= 3) {
		tablePart = selectedTables.join('-');
	} else {
		tablePart = `${selectedTables.length}tables`;
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
		console.log('🚀 [EXPORT] Configuration reçue:', config);
		console.log('📊 [EXPORT] Tables sélectionnées:', config.selectedTables);
		console.log('📋 [EXPORT] Format:', config.format);

		// Validation des données
		if (!config.selectedTables || config.selectedTables.length === 0) {
			throw error(400, "Aucune table sélectionnée pour l'export");
		}

		const supportedFormats = ['xlsx', 'csv', 'xml'];
		if (!supportedFormats.includes(config.format)) {
			throw error(400, `Format non supporté: ${config.format}`);
		}

		// Collecte des données à exporter
		const exportDataList: ExportData[] = [];
		const warnings: string[] = [];
		const errors: string[] = [];
		let totalExportedRows = 0;

		for (const tableName of config.selectedTables) {
			try {
				console.log(`📊 [EXPORT] Extraction des données de ${tableName}`);

				const tableData = await extractTableData(
					tableName,
					config.rowLimit
					// config.filters et config.includeRelations - Supprimés pour simplifier
				);

				exportDataList.push(tableData);
				totalExportedRows += tableData.totalRows;

				console.log(`✅ [EXPORT] ${tableName}: ${tableData.totalRows} lignes extraites`);

				if (config.rowLimit && tableData.totalRows >= config.rowLimit) {
					warnings.push(`Table ${tableName}: limite de ${config.rowLimit} lignes appliquée`);
				}
			} catch (err) {
				console.error(`❌ [EXPORT] Erreur avec ${tableName}:`, err);
				errors.push(
					`Erreur lors de l'extraction de ${tableName}: ${err instanceof Error ? err.message : 'Erreur inconnue'}`
				);
			}
		}

		if (exportDataList.length === 0) {
			throw error(500, "Aucune donnée n'a pu être extraite");
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

		console.log('✅ [EXPORT] Export terminé:', result);

		// Retourner le fichier avec les headers appropriés
		return new Response(exportFile.buffer, {
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
async function extractTableData(
	tableName: string,
	rowLimit?: number
	// filters et includeRelations supprimés - export simple des données brutes
): Promise<ExportData> {
	const limit = rowLimit && rowLimit > 0 ? rowLimit : undefined;
	let data: Record<string, unknown>[] = [];
	let columns: string[] = [];

	// Déterminer quelle base de données contient cette table
	const allTables = getAllDatabaseTables();
	const tableInfo = allTables.find((t) => t.name === tableName);

	if (!tableInfo) {
		throw new Error(`Table non trouvée: ${tableName}`);
	}

	const database = tableInfo.database;
	console.log(`📊 [EXPORT] Exportation de ${tableName} depuis ${database}`);

	// Obtenir le client Prisma approprié
	const prisma = getClient(database);

	// Récupérer les métadonnées de la table
	const metadata = getTableMetadata(database, tableName);
	if (!metadata) {
		throw new Error(`Métadonnées non trouvées pour ${tableName}`);
	}

	// Définir les colonnes à partir des métadonnées
	columns = metadata.fields.map((field) => field.name);

	try {
		// Accès dynamique au modèle Prisma
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const model = (prisma as Record<string, any>)[tableName];
		if (!model) {
			throw new Error(`Modèle Prisma non trouvé pour ${tableName}`);
		}

		// Déterminer la colonne pour l'ordre (clé primaire)
		const primaryKey = metadata.primaryKey;
		const orderBy = primaryKey ? { [primaryKey]: 'asc' } : {};

		// Récupérer les données
		data = await model.findMany({
			take: limit,
			...(Object.keys(orderBy).length > 0 && { orderBy })
		});

		console.log(`✅ [EXPORT] ${tableName}: ${data.length} lignes extraites depuis ${database}`);
	} catch (err) {
		console.error(`❌ [EXPORT] Erreur avec ${tableName} depuis ${database}:`, err);
		throw new Error(
			`Erreur lors de l'extraction de ${tableName}: ${err instanceof Error ? err.message : 'Erreur inconnue'}`
		);
	}

	return {
		tableName,
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
					value = value.toISOString();
				} else if (value === null || value === undefined) {
					value = '';
				} else if (typeof value === 'object') {
					value = JSON.stringify(value);
				}

				excelRow.push(value);
			}
			worksheetData.push(excelRow);
		}

		// Création de la feuille de calcul
		const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

		// Ajustement automatique de la largeur des colonnes
		const colWidths = tableData.columns.map((col) => ({ wch: Math.max(col.length, 15) }));
		worksheet['!cols'] = colWidths;

		// Ajout de la feuille au classeur
		let sheetName = tableData.tableName;
		if (sheetName.length > 31) {
			sheetName = sheetName.substring(0, 31);
		}
		XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
	}

	// Génération du buffer
	const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

	const fileName = generateFileName(
		exportDataList.map((d) => d.tableName),
		'xlsx'
	);

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

		// Nom de la table
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
	const fileName = generateFileName(
		exportDataList.map((d) => d.tableName),
		'csv'
	);

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
	const fileName = generateFileName(
		exportDataList.map((d) => d.tableName),
		'xml'
	);

	return {
		buffer,
		fileName,
		mimeType: 'application/xml',
		size: buffer.length
	};
}
