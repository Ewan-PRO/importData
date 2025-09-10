// src/lib/prisma-meta.ts - Micro-wrapper pour métadonnées Prisma
import { browser } from '$app/environment';

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

// Import côté serveur uniquement (sans top-level await)
async function initializePrisma() {
  if (!browser && !prismaModule) {
    const imported = await import('@prisma/client') as unknown as PrismaModule;
    prismaModule = imported;
    Prisma = imported.Prisma;
    PrismaClient = imported.PrismaClient;
  }
}

// Client de développement typé
let CenovDevPrisma: PrismaModule['Prisma'] | undefined;
let CenovDevPrismaClient: PrismaModule['PrismaClient'] | undefined;

// Initialisation du client de développement
async function initializeCenovDevPrisma() {
  if (browser) return;
  
  await initializePrisma();
  
  try {
    const { createRequire } = await import('node:module');
    const { fileURLToPath } = await import('node:url');
    const path = await import('node:path');
    
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const require = createRequire(import.meta.url);

    const devPrismaPath = path.resolve(__dirname, '../../prisma/cenov_dev_ewan/generated');
    const devPrismaModule = require(devPrismaPath) as unknown as PrismaModule;
    CenovDevPrisma = devPrismaModule.Prisma;
    CenovDevPrismaClient = devPrismaModule.PrismaClient;
  } catch (error) {
    console.error('❌ [PRISMA-META] Erreur lors du chargement du client CENOV_DEV_EWAN:', error);
    // Fallback au client principal si le client dev n'est pas disponible
    CenovDevPrisma = Prisma;
    CenovDevPrismaClient = PrismaClient;
  }
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
// Type pour les modèles DMMF réels
type DMMFModelFromPrisma = PrismaModule['Prisma']['dmmf']['datamodel']['models'][number];

// Détecter la clé primaire via DMMF Prisma
function detectPrimaryKeyFromDMMF(model: DMMFModelFromPrisma): string | null {
  console.log(`🔍 [PRISMA-META] Analyse de ${model.name}:`, {
    idFields: model.fields.filter((f) => f.isId).map((f) => f.name)
  });

  // 1. Les clés primaires composites ne sont pas supportées dans le DMMF actuel
  // On se concentre sur les clés simples

  // 2. Clé primaire simple (@id)
  const singlePK = model.fields.find((f) => f.isId);
  if (singlePK) {
    console.log(`🔧 [PRISMA-META] Clé simple détectée pour ${model.name}: ${singlePK.name}`);
    return singlePK.name;
  }

  // 3. Pour les vues : chercher le premier champ "id-like"
  const idLikeFields = model.fields.filter((f) => 
    f.name.match(/^(.*_id|id|pro_id|cat_id|atr_id|kit_id|fam_id|frs_id|par_id|kat_id)$/)
  );
  
  if (idLikeFields.length > 0) {
    const fallbackKey = idLikeFields[0].name;
    console.log(`🔧 [PRISMA-META] Clé fallback détectée pour ${model.name}: ${fallbackKey}`);
    return fallbackKey;
  }

  // 4. Dernier recours : premier champ
  if (model.fields.length > 0) {
    const firstField = model.fields[0].name;
    console.log(`⚠️ [PRISMA-META] Aucune clé trouvée pour ${model.name}, utilisation du premier champ: ${firstField}`);
    return firstField;
  }

  console.warn(`❌ [PRISMA-META] Impossible de déterminer une clé pour ${model.name}`);
  return null;
}

export async function getTableMetadata(database: DatabaseName, tableName: string) {
  if (browser) {
    throw new Error('[PRISMA-META] getTableMetadata ne peut être appelé côté client');
  }
  
  const databases = await getDatabases();
  const model = databases[database].dmmf.datamodel.models.find(
    (m) => m.name === tableName
  );
  if (!model) return null;

  // Détecter la clé primaire intelligemment
  const primaryKey = detectPrimaryKeyFromDMMF(model) || 'id';

  return {
    name: model.name,
    primaryKey,
    fields: model.fields
      .filter((f) => f.kind === 'scalar')
      .map((f) => ({
        name: f.name,
        type: f.type,
        isRequired: f.isRequired,
        isPrimaryKey: f.isId || false,
        // Détecter les timestamps (DateTime + noms courants)
        isTimestamp: f.type === 'DateTime' && 
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

// Obtenir toutes les tables des 2 bases (côté serveur uniquement)
export async function getAllDatabaseTables(): Promise<TableInfo[]> {
  if (browser) {
    throw new Error('[PRISMA-META] getAllDatabaseTables ne peut être appelé côté client');
  }
  
  const cenovTables = await getAllTables('cenov');
  const cenovDevTables = await getAllTables('cenov_dev_ewan');
  return [...cenovTables, ...cenovDevTables];
}

// Obtenir tous les noms de bases de données (côté client: version statique)
export async function getAllDatabaseNames(): Promise<DatabaseName[]> {
  if (browser) {
    // Côté client: retourner la liste statique des bases de données
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

// Utilitaire : Humaniser nom de table
function humanizeTableName(name: string): string {
	return name
		.replace(/_/g, ' ')
		.replace(/\b\w/g, (l) => l.toUpperCase())
		.replace(/^V /, 'Vue ')
		.replace(/Dev$/, ' (Dev)')
		.replace(/Produit V /, 'Vue ');
}
