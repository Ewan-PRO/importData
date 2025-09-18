/**
 * src/routes/export/shared.ts
 *
 * Fichier de partage pour le code réutilisé dans PLUSIEURS fichiers du dossier export/
 * Contient uniquement les fonctions, types et constantes utilisées par au moins 2 fichiers.
 *
 * Le code utilisé dans un seul fichier doit rester dans ce fichier spécifique.
 * Note: shared.ts ne compte pas comme "fichier utilisateur" pour cette règle.
 */

// src/routes/export/shared.ts - Utilitaire partagé pour l'extraction de données d'export
import {
	getAllDatabaseTables,
	getTableMetadata,
	getClient,
	getDatabases,
	type DatabaseName
} from '$lib/prisma-meta.js';

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

// Configuration des formats d'export (centralisé pour éliminer duplication)
export const EXPORT_FORMATS_CONFIG = {
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

export function getExportFormats() {
	return Object.values(EXPORT_FORMATS_CONFIG);
}

export function getValidFormats(): string[] {
	return Object.keys(EXPORT_FORMATS_CONFIG);
}

export function isValidFormat(format: string): boolean {
	return format in EXPORT_FORMATS_CONFIG;
}

// Fonctions de formatage (centralisées pour éliminer duplication)
export function formatNumber(num: number): string {
	return new Intl.NumberFormat('fr-FR').format(num);
}

export function formatFileSize(bytes: number): string {
	const units = ['B', 'KB', 'MB', 'GB'];
	let size = bytes;
	let unitIndex = 0;
	while (size >= 1024 && unitIndex < units.length - 1) {
		size /= 1024;
		unitIndex++;
	}
	return `${size.toFixed(1)} ${units[unitIndex]}`;
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
		// Validation du nom de base de données
		if (dbName !== 'cenov' && dbName !== 'cenov_dev') {
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
