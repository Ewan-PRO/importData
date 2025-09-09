// src/lib/prisma-meta.ts - Micro-wrapper pour métadonnées Prisma
import { Prisma, PrismaClient } from '@prisma/client';
// TEMPORAIREMENT EN COMMENTAIRE POUR LE DEPLOIEMENT - imports non utilisés
// import { createRequire } from 'node:module';
// import { fileURLToPath } from 'node:url';
// import path from 'node:path';

// Types Prisma pour les métadonnées
type DMMFModel = Prisma.DMMF.Model;
type DMMFField = Prisma.DMMF.Field;

// TEMPORAIREMENT EN COMMENTAIRE POUR LE DEPLOIEMENT
// Solution durable ESM/CommonJS : utiliser createRequire pour importer CommonJS
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// const require = createRequire(import.meta.url);

// const devPrismaPath = path.resolve(__dirname, '../../prisma/cenov_dev_ewan/generated/index.js');
// const { Prisma: DevPrisma, PrismaClient: DevClient } = require(devPrismaPath);

export type DatabaseName = 'cenov'; // | 'cenov_dev_ewan' TEMPORAIREMENT EN COMMENTAIRE

export interface TableInfo {
	name: string;
	displayName: string;
	category: 'table' | 'view';
	database: DatabaseName;
	rowCount?: number;
}

export interface FieldInfo {
	name: string;
	type: string;
	isRequired: boolean;
	isPrimaryKey: boolean;
}

// Configuration des bases
export const DATABASES = {
	cenov: {
		dmmf: Prisma.dmmf,
		client: new PrismaClient()
	}
	// TEMPORAIREMENT EN COMMENTAIRE POUR LE DEPLOIEMENT
	// cenov_dev_ewan: {
	// 	dmmf: DevPrisma.dmmf,
	// 	client: new DevClient()
	// }
} as const;

// Obtenir métadonnées d'une table spécifique
export function getTableMetadata(database: DatabaseName, tableName: string) {
	const model = DATABASES[database].dmmf.datamodel.models.find(
		(m: DMMFModel) => m.name === tableName
	);
	if (!model) return null;

	return {
		name: model.name,
		primaryKey: model.fields.find((f: DMMFField) => f.isId)?.name || 'id',
		fields: model.fields
			.filter((f: DMMFField) => f.kind === 'scalar')
			.map((f: DMMFField) => ({
				name: f.name,
				type: f.type,
				isRequired: f.isRequired,
				isPrimaryKey: f.isId || false
			}))
	};
}

// Obtenir toutes les tables d'une base
export function getAllTables(database: DatabaseName): TableInfo[] {
	return DATABASES[database].dmmf.datamodel.models.map((model: DMMFModel) => ({
		name: model.name,
		displayName: humanizeTableName(model.name),
		category: model.name.startsWith('v_') || model.name.includes('_v_') ? 'view' : 'table',
		database
	}));
}

// TEMPORAIREMENT EN COMMENTAIRE POUR LE DEPLOIEMENT
// Obtenir toutes les tables des 2 bases
// export function getAllDatabaseTables(): TableInfo[] {
// 	return [...getAllTables('cenov'), ...getAllTables('cenov_dev_ewan')];
// }

// Obtenir client Prisma
export function getClient(database: DatabaseName) {
	return DATABASES[database].client;
}

// Compter lignes d'une table
export async function countTableRows(database: DatabaseName, tableName: string): Promise<number> {
	try {
		const client = getClient(database);
		return await (client as unknown as Record<string, { count: () => Promise<number> }>)[
			tableName
		].count();
	} catch {
		return 0;
	}
}

// Utilitaire : Humaniser nom de table
function humanizeTableName(name: string): string {
	return name
		.replace(/_/g, ' ')
		.replace(/\b\w/g, (l) => l.toUpperCase())
		.replace(/^V /, 'Vue ')
		.replace(/Dev$/, ' (Dev)')
		.replace(/Produit V /, 'Vue ');
}
