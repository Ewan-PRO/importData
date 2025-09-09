// src/lib/prisma-meta.ts - Micro-wrapper pour métadonnées Prisma
import { Prisma, PrismaClient } from '@prisma/client';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

// Types Prisma pour les métadonnées
type DMMFModel = Prisma.DMMF.Model;
type DMMFField = Prisma.DMMF.Field;

// Import dynamique des clients Prisma
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

// Clients Prisma 
let CenovDevPrisma: typeof Prisma;
let CenovDevPrismaClient: typeof PrismaClient;

try {
	const devPrismaPath = path.resolve(__dirname, '../../prisma/cenov_dev_ewan/generated');
	const devPrismaModule = require(devPrismaPath);
	CenovDevPrisma = devPrismaModule.Prisma;
	CenovDevPrismaClient = devPrismaModule.PrismaClient;
} catch (error) {
	console.error('❌ [PRISMA-META] Erreur lors du chargement du client CENOV_DEV_EWAN:', error);
	// Fallback au client principal si le client dev n'est pas disponible
	CenovDevPrisma = Prisma;
	CenovDevPrismaClient = PrismaClient;
}

export type DatabaseName = 'cenov' | 'cenov_dev_ewan';

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

// Cache pour les bases de données (singleton)
let databasesCache: ReturnType<typeof createDatabases> | null = null;

// Configuration des bases - création unique
function createDatabases() {
	return {
		cenov: {
			dmmf: Prisma.dmmf,
			client: new PrismaClient()
		},
		cenov_dev_ewan: {
			dmmf: CenovDevPrisma.dmmf,
			client: new CenovDevPrismaClient()
		}
	};
}

// Accès aux bases avec cache
export function getDatabases() {
	if (!databasesCache) {
		databasesCache = createDatabases();
	}
	return databasesCache;
}

// Obtenir métadonnées d'une table spécifique
export function getTableMetadata(database: DatabaseName, tableName: string) {
	const databases = getDatabases();
	const model = databases[database].dmmf.datamodel.models.find(
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
	const databases = getDatabases();
	const tables = databases[database].dmmf.datamodel.models.map((model: DMMFModel) => {
		const category: 'table' | 'view' = model.name.startsWith('v_') || model.name.includes('_v_') ? 'view' : 'table';
		return {
			name: model.name,
			displayName: humanizeTableName(model.name),
			category,
			database
		};
	});
	return tables;
}

// Obtenir toutes les tables des 2 bases
export function getAllDatabaseTables(): TableInfo[] {
	const cenovTables = getAllTables('cenov');
	const cenovDevTables = getAllTables('cenov_dev_ewan');
	return [...cenovTables, ...cenovDevTables];
}

// Obtenir client Prisma
export function getClient(database: DatabaseName) {
	const databases = getDatabases();
	return databases[database].client;
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
