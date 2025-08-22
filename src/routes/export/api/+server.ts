import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PrismaClient } from '@prisma/client';
import * as XLSX from 'xlsx';
import { XMLBuilder } from 'fast-xml-parser';
import type { ExportConfig, ExportResult } from '../+page.server.js';

const prisma = new PrismaClient();

// Types pour l'export des données
interface ExportData {
	tableName: string;
	data: Record<string, unknown>[];
	columns: string[];
	totalRows: number;
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

		// Validation des données
		if (!config.selectedTables || config.selectedTables.length === 0) {
			throw error(400, "Aucune table sélectionnée pour l'export");
		}

		const supportedFormats = ['xlsx', 'csv', 'pdf', 'xml'];
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
					config.rowLimit,
					config.filters,
					config.includeRelations
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
			case 'pdf':
				exportFile = await generatePDFFile(exportDataList);
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

// Extraction des données d'une table
async function extractTableData(
	tableName: string,
	rowLimit?: number,
	filters?: Record<string, unknown>,
	includeRelations = false
): Promise<ExportData> {
	const limit = rowLimit && rowLimit > 0 ? rowLimit : undefined;
	let data: Record<string, unknown>[] = [];
	let columns: string[] = [];

	// Configuration des relations si demandées
	const includeConfig = includeRelations ? getRelationConfig(tableName) : undefined;

	switch (tableName) {
		case 'kit':
			data = await prisma.kit.findMany({
				take: limit,
				include: includeConfig,
				orderBy: { kit_id: 'asc' }
			});
			columns = ['kit_id', 'kit_label', 'created_at', 'updated_at'];
			if (includeRelations) {
				columns.push('related_parts', 'related_attributes', 'related_documents', 'related_kits');
			}
			break;

		case 'part':
			data = await prisma.part.findMany({
				take: limit,
				include: includeConfig,
				orderBy: { par_id: 'asc' }
			});
			columns = ['par_id', 'fk_kit', 'par_label', 'created_at', 'updated_at'];
			if (includeRelations) {
				columns.push('kit_info');
			}
			break;

		case 'attribute':
			data = await prisma.attribute.findMany({
				take: limit,
				orderBy: { atr_id: 'asc' }
			});
			columns = ['atr_id', 'atr_nat', 'atr_val', 'atr_label', 'created_at', 'updated_at'];
			break;

		case 'attribute_dev':
			data = await prisma.attribute_dev.findMany({
				take: limit,
				orderBy: { atr_id: 'asc' }
			});
			columns = ['atr_id', 'atr_nat', 'atr_val', 'atr_label', 'created_at', 'updated_at'];
			break;

		case 'kit_attribute':
			data = await prisma.kit_attribute.findMany({
				take: limit,
				include: includeConfig,
				orderBy: { kat_id: 'asc' }
			});
			columns = [
				'kat_id',
				'fk_kit',
				'fk_attribute_carac',
				'fk_attribute',
				'kat_valeur',
				'created_at',
				'updated_at'
			];
			if (includeRelations) {
				columns.push('kit_info', 'attribute_info');
			}
			break;

		case 'kit_attribute_dev':
			data = await prisma.kit_attribute_dev.findMany({
				take: limit,
				orderBy: { kat_id: 'asc' }
			});
			columns = [
				'kat_id',
				'fk_kit',
				'fk_attribute_carac',
				'fk_attribute',
				'kat_valeur',
				'created_at',
				'updated_at'
			];
			break;

		case 'kit_kit':
			data = await prisma.kit_kit.findMany({
				take: limit,
				include: includeConfig,
				orderBy: { kik_id: 'asc' }
			});
			columns = [
				'kik_id',
				'fk_kit_parent',
				'fk_kit_child',
				'kik_qty',
				'kik_index',
				'created_at',
				'updated_at'
			];
			if (includeRelations) {
				columns.push('parent_kit_info', 'child_kit_info');
			}
			break;

		case 'document':
			data = await prisma.document.findMany({
				take: limit,
				include: includeConfig,
				orderBy: { doc_id: 'asc' }
			});
			columns = ['doc_id', 'doc_name', 'doc_extension', 'doc_type'];
			if (includeRelations) {
				columns.push('related_kits');
			}
			break;

		case 'kit_document':
			data = await prisma.kit_document.findMany({
				take: limit,
				include: includeConfig,
				orderBy: { kid_id: 'asc' }
			});
			columns = ['kid_id', 'fk_kit', 'fk_document', 'kid_description', 'created_at', 'updated_at'];
			if (includeRelations) {
				columns.push('kit_info', 'document_info');
			}
			break;

		case 'supplier':
			data = await prisma.supplier.findMany({
				take: limit,
				orderBy: { sup_id: 'asc' }
			});
			columns = ['sup_id', 'sup_code', 'sup_label'];
			break;

		case 'supplier_dev':
			data = await prisma.supplier_dev.findMany({
				take: limit,
				orderBy: { sup_id: 'asc' }
			});
			columns = ['sup_id', 'sup_code', 'sup_label'];
			break;

		case 'kit_dev':
			data = await prisma.kit_dev.findMany({
				take: limit,
				orderBy: { kit_id: 'asc' }
			});
			columns = ['kit_id', 'kit_label', 'created_at', 'updated_at'];
			break;

		case 'v_kit_carac':
			data = await prisma.v_kit_carac.findMany({
				take: limit,
				orderBy: { id: 'asc' }
			});
			columns = ['id', 'kit_label', 'atr_label', 'atr_val', 'kat_valeur'];
			break;

		case 'v_kit_carac_dev':
			data = await prisma.v_kit_carac_dev.findMany({
				take: limit,
				orderBy: { id: 'asc' }
			});
			columns = ['id', 'kit_label', 'atr_label', 'atr_val', 'kat_valeur'];
			break;

		case 'v_categories':
			data = await prisma.v_categories.findMany({
				take: limit,
				orderBy: { atr_id: 'asc' }
			});
			columns = [
				'atr_id',
				'atr_0_label',
				'atr_1_label',
				'atr_2_label',
				'atr_3_label',
				'atr_4_label',
				'atr_5_label',
				'atr_6_label',
				'atr_7_label'
			];
			break;

		case 'v_categories_dev':
			data = await prisma.v_categories_dev.findMany({
				take: limit,
				orderBy: { row_key: 'asc' }
			});
			columns = [
				'row_key',
				'atr_id',
				'atr_0_label',
				'atr_1_label',
				'atr_2_label',
				'atr_3_label',
				'atr_4_label',
				'atr_5_label',
				'atr_6_label',
				'atr_7_label'
			];
			break;

		default:
			throw new Error(`Table non supportée: ${tableName}`);
	}

	// Traitement des données relationnelles si incluses
	if (includeRelations) {
		data = processRelationalData(data, tableName);
	}

	return {
		tableName,
		data,
		columns,
		totalRows: data.length
	};
}

// Configuration des relations pour chaque table
function getRelationConfig(tableName: string): Record<string, unknown> | undefined {
	switch (tableName) {
		case 'kit':
			return {
				part: { select: { par_id: true, par_label: true } },
				kit_attribute: {
					select: {
						kat_id: true,
						kat_valeur: true,
						attribute_kit_attribute_fk_attributeToattribute: {
							select: { atr_nat: true, atr_val: true, atr_label: true }
						}
					}
				},
				kit_document: {
					select: {
						kid_id: true,
						kid_description: true,
						document: { select: { doc_name: true, doc_type: true } }
					}
				},
				kit_kit_kit_kit_fk_kit_parentTokit: {
					select: {
						kik_id: true,
						kik_qty: true,
						kit_kit_kit_fk_kit_childTokit: { select: { kit_id: true, kit_label: true } }
					}
				}
			};

		case 'part':
			return {
				kit: { select: { kit_id: true, kit_label: true } }
			};

		case 'kit_attribute':
			return {
				kit: { select: { kit_id: true, kit_label: true } },
				attribute_kit_attribute_fk_attributeToattribute: {
					select: { atr_id: true, atr_nat: true, atr_val: true, atr_label: true }
				}
			};

		case 'kit_kit':
			return {
				kit_kit_kit_fk_kit_parentTokit: { select: { kit_id: true, kit_label: true } },
				kit_kit_kit_fk_kit_childTokit: { select: { kit_id: true, kit_label: true } }
			};

		case 'document':
			return {
				kit_document: {
					select: {
						kid_id: true,
						kit: { select: { kit_id: true, kit_label: true } }
					}
				}
			};

		case 'kit_document':
			return {
				kit: { select: { kit_id: true, kit_label: true } },
				document: { select: { doc_id: true, doc_name: true, doc_type: true } }
			};

		default:
			return undefined;
	}
}

// Traitement des données relationnelles
function processRelationalData(
	data: Record<string, unknown>[],
	tableName: string
): Record<string, unknown>[] {
	return data.map((record) => {
		const processedRecord = { ...record };

		switch (tableName) {
			case 'kit':
				if (record.part && Array.isArray(record.part)) {
					processedRecord.related_parts = (record.part as Record<string, unknown>[])
						.map((p) => p.par_label as string)
						.join(', ');
				}
				if (record.kit_attribute && Array.isArray(record.kit_attribute)) {
					processedRecord.related_attributes = (record.kit_attribute as unknown[]).length;
				}
				if (record.kit_document && Array.isArray(record.kit_document)) {
					processedRecord.related_documents = (record.kit_document as unknown[]).length;
				}
				if (record.kit_kit_kit_kit_fk_kit_parentTokit && Array.isArray(record.kit_kit_kit_kit_fk_kit_parentTokit)) {
					processedRecord.related_kits = (record.kit_kit_kit_kit_fk_kit_parentTokit as unknown[]).length;
				}
				break;

			case 'part':
				if (record.kit && typeof record.kit === 'object' && record.kit !== null) {
					const kit = record.kit as Record<string, unknown>;
					processedRecord.kit_info = (kit.kit_label as string) || (kit.kit_id as string);
				}
				break;

			case 'kit_attribute':
				if (record.kit && typeof record.kit === 'object' && record.kit !== null) {
					const kit = record.kit as Record<string, unknown>;
					processedRecord.kit_info = (kit.kit_label as string) || (kit.kit_id as string);
				}
				if (record.attribute_kit_attribute_fk_attributeToattribute && typeof record.attribute_kit_attribute_fk_attributeToattribute === 'object' && record.attribute_kit_attribute_fk_attributeToattribute !== null) {
					const attr = record.attribute_kit_attribute_fk_attributeToattribute as Record<string, unknown>;
					processedRecord.attribute_info = attr.atr_label as string;
				}
				break;
		}

		return processedRecord;
	});
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

	const fileName = `export-${new Date().toISOString().split('T')[0]}.xlsx`;

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
				if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
					value = `"${value.replace(/"/g, '""')}"`;
				}

				csvRow.push(String(value));
			}
			csvContent += csvRow.join(',') + '\n';
		}
	}

	const buffer = Buffer.from(csvContent, 'utf-8');
	const fileName = `export-${new Date().toISOString().split('T')[0]}.csv`;

	return {
		buffer,
		fileName,
		mimeType: 'text/csv',
		size: buffer.length
	};
}

// Génération d'un fichier PDF (simplifié)
async function generatePDFFile(
	exportDataList: ExportData[]
): Promise<ExportFile> {
	// Pour une implémentation complète du PDF, vous pouvez utiliser jsPDF ou Puppeteer
	// Ici, nous créons un rapport simple en HTML puis nous le convertissons conceptuellement

	let htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Export des données</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .table-section { margin-bottom: 30px; }
        .table-title { font-size: 18px; font-weight: bold; color: #333; margin-bottom: 10px; }
        table { border-collapse: collapse; width: 100%; margin-bottom: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; font-weight: bold; }
        tr:nth-child(even) { background-color: #f9f9f9; }
        .summary { background-color: #e7f3ff; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
    </style>
</head>
<body>
    <h1>Rapport d'export des données</h1>
    <div class="summary">
        <p><strong>Date d'export:</strong> ${new Date().toLocaleString()}</p>
        <p><strong>Tables exportées:</strong> ${exportDataList.length}</p>
        <p><strong>Total des lignes:</strong> ${exportDataList.reduce((sum, t) => sum + t.totalRows, 0)}</p>
    </div>
`;

	for (const tableData of exportDataList) {
		htmlContent += `
    <div class="table-section">
        <div class="table-title">Table: ${tableData.tableName} (${tableData.totalRows} lignes)</div>
        <table>
            <thead>
                <tr>
`;

		// En-têtes
		for (const column of tableData.columns) {
			htmlContent += `<th>${column}</th>`;
		}

		htmlContent += `
                </tr>
            </thead>
            <tbody>
`;

		// Données (limitées pour le PDF)
		const limitedData = tableData.data.slice(0, 50); // Limite pour éviter les PDF trop lourds
		for (const row of limitedData) {
			htmlContent += '<tr>';
			for (const column of tableData.columns) {
				let value = row[column];
				if (value === null || value === undefined) {
					value = '';
				} else if (typeof value === 'object') {
					value = JSON.stringify(value);
				} else {
					value = String(value);
				}

				// Échappement HTML
				const stringValue = String(value);
				const escapedValue = stringValue.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
				htmlContent += `<td>${escapedValue}</td>`;
			}
			htmlContent += '</tr>';
		}

		htmlContent += `
            </tbody>
        </table>
    </div>
`;

		if (tableData.totalRows > 50) {
			htmlContent += `<p><em>Note: Seules les 50 premières lignes sont affichées dans ce rapport PDF.</em></p>`;
		}
	}

	htmlContent += `
</body>
</html>`;

	// Ici, dans une vraie implémentation, vous utiliseriez une librairie comme Puppeteer
	// pour convertir le HTML en PDF. Pour l'instant, nous retournons le HTML.
	const buffer = Buffer.from(htmlContent, 'utf-8');
	const fileName = `export-report-${new Date().toISOString().split('T')[0]}.html`;

	return {
		buffer,
		fileName,
		mimeType: 'text/html', // 'application/pdf' pour un vrai PDF
		size: buffer.length
	};
}

// Génération d'un fichier XML
async function generateXMLFile(
	exportDataList: ExportData[]
): Promise<ExportFile> {
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
	const fileName = `export-${new Date().toISOString().split('T')[0]}.xml`;

	return {
		buffer,
		fileName,
		mimeType: 'application/xml',
		size: buffer.length
	};
}
