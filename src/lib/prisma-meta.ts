// src/lib/prisma-meta.ts - Micro-wrapper pour métadonnées Prisma
import { browser, dev } from '$app/environment';

// Types pour les modules Prisma
interface PrismaModule {
	Prisma: {
		dmmf: {
			datamodel: {
				models: Array<{
					name: string;
					fields: Array<{
						name: string;
						type: string;
						isRequired: boolean;
						isId: boolean;
						kind: string;
					}>;
				}>;
			};
		};
	};
	PrismaClient: new () => Record<string, unknown>;
}

// Variables globales typées
let Prisma: PrismaModule['Prisma'] | undefined;
let PrismaClient: PrismaModule['PrismaClient'] | undefined;
let prismaModule: PrismaModule | undefined;

// Import côté serveur uniquement
async function initializePrisma() {
	if (!browser && !prismaModule) {
		const imported = (await import('@prisma/client')) as unknown as PrismaModule;
		prismaModule = imported;
		Prisma = imported.Prisma;
		PrismaClient = imported.PrismaClient;
	}
}

// Client de développement typé
let CenovDevPrisma: PrismaModule['Prisma'] | undefined;
let CenovDevPrismaClient: PrismaModule['PrismaClient'] | undefined;

// Fonction helper pour déterminer si on utilise les vues dev (comme db.ts)
function shouldUseDevViews() {
	// Utiliser process.env directement (côté serveur uniquement)
	if (browser) return false;
	return process.env.USE_DEV_VIEWS === 'true' || dev;
}

// Initialisation du client de développement - Solution hybride dev/prod
async function initializeCenovDevPrisma() {
	if (browser) return;

	await initializePrisma();

	const useDevViews = shouldUseDevViews();
	console.log('🔍 [PRISMA-META] Configuration:', {
		USE_DEV_VIEWS: process.env.USE_DEV_VIEWS,
		dev,
		useDevViews
	});

	if (!useDevViews) {
		// Pas de vues dev - utiliser client principal uniquement
		console.log('⚪ [PRISMA-META] Client principal seul (USE_DEV_VIEWS=false)');
		CenovDevPrisma = Prisma;
		CenovDevPrismaClient = PrismaClient;
		return;
	}

	// USE_DEV_VIEWS=true - Chargement selon environnement
	console.log('✅ [PRISMA-META] Chargement client dev (USE_DEV_VIEWS=true)');
	try {
		let devPrismaModule: PrismaModule | undefined;

		if (dev) {
			// DEV: createRequire (gère CommonJS)
			console.log('🛠️ [PRISMA-META] Mode DEV - createRequire');
			try {
				const { createRequire } = await import('node:module');
				const { fileURLToPath } = await import('node:url');
				const path = await import('node:path');

				const __filename = fileURLToPath(import.meta.url);
				const __dirname = path.dirname(__filename);
				const require = createRequire(import.meta.url);

				const devPrismaPath = path.resolve(__dirname, '../../prisma/cenov_dev_ewan/generated');
				devPrismaModule = require(devPrismaPath) as unknown as PrismaModule;
				console.log('✅ [PRISMA-META] createRequire réussi');
			} catch (createRequireError) {
				console.log('❌ [PRISMA-META] createRequire échoué:', createRequireError);
				throw createRequireError;
			}
		} else {
			// PROD: import() avec @vite-ignore (marche en production)
			console.log('🚀 [PRISMA-META] Mode PROD - import()');
			try {
				const path = await import('node:path');
				const { pathToFileURL } = await import('node:url');
				const absolutePath = path.resolve(
					process.cwd(),
					'prisma/cenov_dev_ewan/generated/index.js'
				);
				const fileUrl = pathToFileURL(absolutePath).href;

				devPrismaModule = (await import(/* @vite-ignore */ fileUrl)) as unknown as PrismaModule;
			} catch {
				// Fallback import relatif
				devPrismaModule = (await import(
					/* @vite-ignore */ '../../prisma/cenov_dev_ewan/generated/index.js'
				)) as unknown as PrismaModule;
			}
			console.log('✅ [PRISMA-META] import() réussi');
		}

		if (devPrismaModule?.Prisma && devPrismaModule?.PrismaClient) {
			CenovDevPrisma = devPrismaModule.Prisma;
			CenovDevPrismaClient = devPrismaModule.PrismaClient;
			console.log('✅ [PRISMA-META] Client dev chargé avec succès');
		} else {
			throw new Error('Module dev invalide - Prisma/PrismaClient manquants');
		}
	} catch (error) {
		console.log('❌ [PRISMA-META] Erreur client dev:', error);
		// Fallback au client principal
		CenovDevPrisma = Prisma;
		CenovDevPrismaClient = PrismaClient;
		console.log('⚪ [PRISMA-META] Utilisation client principal en fallback');
	}
}

export type DatabaseName = 'cenov' | 'cenov_dev_ewan';

export interface TableInfo {
	name: string;
	displayName: string;
	category: 'table' | 'view';
	database: DatabaseName;
	schema: string;
	rowCount?: number;
}

export interface FieldInfo {
	name: string;
	type: string;
	isRequired: boolean;
	isPrimaryKey: boolean;
	isTimestamp?: boolean;
	dbType?: string;
}

// Interface pour les bases de données
interface DatabaseConfig {
	cenov: {
		dmmf: PrismaModule['Prisma']['dmmf'];
		client: Record<string, unknown>;
	};
	cenov_dev_ewan: {
		dmmf: PrismaModule['Prisma']['dmmf'];
		client: Record<string, unknown>;
	};
}

// Cache pour les bases de données (singleton)
let databasesCache: DatabaseConfig | null = null;

// Configuration des bases - création unique (côté serveur uniquement)
async function createDatabases(): Promise<DatabaseConfig> {
	if (browser) {
		throw new Error('[PRISMA-META] createDatabases ne peut être appelé côté client');
	}

	await initializePrisma();
	await initializeCenovDevPrisma();

	if (!Prisma || !PrismaClient || !CenovDevPrisma || !CenovDevPrismaClient) {
		throw new Error('[PRISMA-META] Modules Prisma non initialisés');
	}

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

// Accès aux bases avec cache (côté serveur uniquement)
export async function getDatabases(): Promise<DatabaseConfig> {
	if (browser) {
		throw new Error('[PRISMA-META] getDatabases ne peut être appelé côté client');
	}

	if (!databasesCache) {
		databasesCache = await createDatabases();
	}

	return databasesCache;
}

// Obtenir métadonnées d'une table spécifique (côté serveur uniquement)
// Type pour les modèles DMMF réels (avec support @@map)
type DMMFModelFromPrisma = PrismaModule['Prisma']['dmmf']['datamodel']['models'][number] & {
	dbName?: string; // Nom de la table/vue réelle (@@map)
	schema?: string; // Schéma (@@schema)
};

// Détecter la clé primaire via DMMF Prisma
function detectPrimaryKeyFromDMMF(model: DMMFModelFromPrisma): string | null {
	// 1. Clé primaire simple (@id)
	const singlePK = model.fields.find((f) => f.isId);
	if (singlePK) {
		return singlePK.name;
	}

	// 2. Pour les vues : chercher le premier champ "id-like"
	const idLikeFields = model.fields.filter((f) =>
		f.name.match(/^(.*_id|id|pro_id|cat_id|atr_id|kit_id|fam_id|frs_id|par_id|kat_id)$/)
	);

	if (idLikeFields.length > 0) {
		return idLikeFields[0].name;
	}

	// 3. Dernier recours : premier champ
	if (model.fields.length > 0) {
		return model.fields[0].name;
	}

	return null;
}

export async function getTableMetadata(database: DatabaseName, tableName: string) {
	if (browser) {
		throw new Error('[PRISMA-META] getTableMetadata ne peut être appelé côté client');
	}

	const databases = await getDatabases();
	const model = databases[database].dmmf.datamodel.models.find((m) => m.name === tableName);
	if (!model) return null;

	// Détecter la clé primaire intelligemment
	const primaryKey = detectPrimaryKeyFromDMMF(model) || 'id';

	// Extraire le schéma depuis les métadonnées Prisma
	const schema = (model as { schema?: string }).schema || 'public';

	return {
		name: model.name,
		primaryKey,
		schema, // Nouveau champ pour le schéma
		fields: model.fields
			.filter((f) => f.kind === 'scalar')
			.map((f) => ({
				name: f.name,
				type: f.type,
				isRequired: f.isRequired,
				isPrimaryKey: f.isId || false,
				// Détecter les timestamps (DateTime + noms courants)
				isTimestamp:
					f.type === 'DateTime' &&
					/^(created_at|updated_at|deleted_at|timestamp|date_|.*_at)$/i.test(f.name),
				dbType: f.type
			}))
	};
}

// Obtenir toutes les tables d'une base (côté serveur uniquement)
export async function getAllTables(database: DatabaseName): Promise<TableInfo[]> {
	if (browser) {
		throw new Error('[PRISMA-META] getAllTables ne peut être appelé côté client');
	}

	const databases = await getDatabases();
	const tables = databases[database].dmmf.datamodel.models.map((model) => {
		const modelWithMeta = model as DMMFModelFromPrisma;

		// Utiliser le nom @@map si disponible, sinon le nom du modèle
		const realTableName = modelWithMeta.dbName || model.name;

		const category: 'table' | 'view' =
			realTableName.startsWith('v_') || realTableName.includes('_v_') ? 'view' : 'table';

		// Utiliser le nom mappé (@@map) comme displayName par défaut
		let displayName = realTableName;
		const schema = modelWithMeta.schema || 'public';

		// Nettoyer uniquement les préfixes automatiques évidents (comme public_)
		// MAIS GARDER les vrais noms de tables qui contiennent le nom du schéma
		if (realTableName.startsWith('public_') && schema === 'public') {
			const cleanName = realTableName.substring(7); // 'public_'.length = 7
			displayName = cleanName;
		}

		return {
			name: model.name, // Garder le nom de modèle Prisma pour l'accès programmatique
			displayName, // Utiliser le nom @@map pour l'affichage
			category,
			database,
			schema
		};
	});
	return tables;
}

// Obtenir toutes les tables des 2 bases (côté serveur uniquement)
export async function getAllDatabaseTables(): Promise<TableInfo[]> {
	if (browser) {
		throw new Error('[PRISMA-META] getAllDatabaseTables ne peut être appelé côté client');
	}

	const cenovTables = await getAllTables('cenov');
	const cenovDevTables = await getAllTables('cenov_dev_ewan');
	const allTables = [...cenovTables, ...cenovDevTables];

	// Tri par schéma puis par type (table/vue) : tables schema → vues schema → tables schema suivant
	const sortedTables = allTables.sort((a, b) => {
		// Définir la priorité des schémas et databases
		const getSchemaOrder = (item: TableInfo) => {
			if (item.database === 'cenov') return 1;
			if (item.database === 'cenov_dev_ewan' && item.schema === 'produit') return 2;
			if (item.database === 'cenov_dev_ewan' && item.schema === 'public') return 3;
			return 4;
		};

		// Définir la priorité du type (table avant vue dans chaque schéma)
		const getTypeOrder = (category: 'table' | 'view') => (category === 'table' ? 1 : 2);

		const aSchemaOrder = getSchemaOrder(a);
		const bSchemaOrder = getSchemaOrder(b);
		const aTypeOrder = getTypeOrder(a.category);
		const bTypeOrder = getTypeOrder(b.category);

		// Comparer d'abord par schéma/database
		if (aSchemaOrder !== bSchemaOrder) {
			return aSchemaOrder - bSchemaOrder;
		}

		// Puis par type (table/vue) dans le même schéma
		if (aTypeOrder !== bTypeOrder) {
			return aTypeOrder - bTypeOrder;
		}

		// Enfin, tri spécial pour les vues avec suffixe _dev
		if (a.category === 'view' && b.category === 'view') {
			const aBaseName = a.displayName.replace(/_dev$/, '');
			const bBaseName = b.displayName.replace(/_dev$/, '');

			// Si même nom de base, version normale avant _dev
			if (aBaseName === bBaseName) {
				const aIsDev = a.displayName.endsWith('_dev');
				const bIsDev = b.displayName.endsWith('_dev');
				return aIsDev ? 1 : bIsDev ? -1 : 0;
			}

			// Sinon tri alphabétique par nom de base
			return aBaseName.localeCompare(bBaseName);
		}

		// Pour les tables, garder l'ordre d'origine
		return 0;
	});

	return sortedTables;
}

// Obtenir tous les noms de bases de données
export async function getAllDatabaseNames(): Promise<DatabaseName[]> {
	if (browser) {
		return ['cenov', 'cenov_dev_ewan'];
	}

	const databases = await getDatabases();
	return Object.keys(databases) as DatabaseName[];
}

// Obtenir client Prisma (côté serveur uniquement)
export async function getClient(database: DatabaseName): Promise<Record<string, unknown>> {
	if (browser) {
		throw new Error('[PRISMA-META] getClient ne peut être appelé côté client');
	}

	const databases = await getDatabases();
	return databases[database].client;
}

// Compter lignes d'une table (côté serveur uniquement)
export async function countTableRows(database: DatabaseName, tableName: string): Promise<number> {
	if (browser) {
		throw new Error('[PRISMA-META] countTableRows ne peut être appelé côté client');
	}

	try {
		const client = await getClient(database);
		const model = client[tableName] as { count: () => Promise<number> } | undefined;
		return model ? await model.count() : 0;
	} catch {
		return 0;
	}
}
