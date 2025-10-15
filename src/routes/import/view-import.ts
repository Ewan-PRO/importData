// ============================================================================
// MODULE VIEW-IMPORT : Cache Session + Enrichissement Foreign Keys
// ============================================================================
//
// Ce module g�re l'import intelligent de donn�es avec r�solution automatique
// des Foreign Keys via un cache session.
//
// PRINCIPE :
// 1. Import fichier 1 (attribute) � IDs g�n�r�s � Stock�s dans cache
// 2. Import fichier 4 (category_attribute) � Lit cache � Enrichit FK auto
//
// FEATURES :
//  100% dynamique via Prisma DMMF (z�ro hardcoding)
//  Cache session avec TTL (1h)
//  Fallback DB si cache miss
//  Support cl�s composites
//  Detection automatique champs uniques
//
// ============================================================================

import type { DatabaseName } from '$lib/prisma-meta';
import { getDatabases, findRecord } from '$lib/prisma-meta';

// ========== TYPES ==========

/**
 * Type étendu pour les champs DMMF Prisma
 * Inclut les propriétés non typées dans les interfaces de base
 */
interface DMMFField {
	name: string;
	type: string;
	isRequired: boolean;
	isId: boolean;
	kind: string;
	isUnique?: boolean;
	hasDefaultValue?: boolean;
	relationName?: string;
	relationFromFields?: string[];
	relationToFields?: string[];
}

/**
 * Type étendu pour les modèles DMMF
 */
interface DMMFModel {
	name: string;
	fields: DMMFField[];
}

/**
 * Structure d'une entr�e de cache
 */
interface ImportCacheEntry {
	id: number; // ID g�n�r� (ex: 378)
	uniqueValue: string; // Valeur unique (ex: "PWR-Test")
	timestamp: number; // Timestamp cr�ation (pour TTL)
}

/**
 * Mapping FK d�tect� via DMMF
 */
interface ForeignKeyMapping {
	fkField: string; // Nom colonne FK (ex: "fk_kit")
	targetTable: string; // Table cible (ex: "kit")
	lookupField: string; // Champ lookup (ex: "kit_label")
}

// ========== CACHE GLOBAL ==========

/**
 * Cache session des IDs g�n�r�s pendant l'import
 * Structure: Map<"database:tableName", Map<uniqueValue, CacheEntry>>
 *
 * Exemple:
 * {
 *   "cenov_dev:attribute": Map {
 *     "PWR-Test" => { id: 378, uniqueValue: "PWR-Test", timestamp: ... }
 *   }
 * }
 */
const importSessionCache = new Map<string, Map<string, ImportCacheEntry>>();

/**
 * TTL du cache : 1 heure
 * Evite la saturation m�moire sur imports longs
 */
const CACHE_TTL_MS = 60 * 60 * 1000;

// ========== FONCTIONS PUBLIQUES ==========

/**
 * Ajoute un enregistrement au cache apr�s insertion
 *
 * D�tection automatique :
 * - Champ unique (via detectUniqueField)
 * - Champ ID (via detectIdField)
 *
 * @param database - Base de donn�es (cenov/cenov_dev)
 * @param tableName - Nom de la table (ex: "attribute")
 * @param insertedRecord - Enregistrement ins�r� avec tous les champs
 */
export async function addToCache(
	database: DatabaseName,
	tableName: string,
	insertedRecord: Record<string, unknown>
): Promise<void> {
	const cacheKey = `${database}:${tableName}`;

	// Initialiser cache pour cette table si n�cessaire
	if (!importSessionCache.has(cacheKey)) {
		importSessionCache.set(cacheKey, new Map());
	}

	const cache = importSessionCache.get(cacheKey)!;

	try {
		// D�tecter automatiquement le champ unique via DMMF
		const uniqueField = await detectUniqueField(database, tableName);
		const idField = await detectIdField(database, tableName);

		if (!uniqueField || !idField) {
			console.warn(`� [CACHE] ${cacheKey}: Impossible de d�tecter unique/id field, skip cache`);
			return;
		}

		const uniqueValue = String(insertedRecord[uniqueField]);
		const generatedId = Number(insertedRecord[idField]);

		if (!uniqueValue || isNaN(generatedId)) {
			console.warn(`� [CACHE] ${cacheKey}: Valeur unique ou ID invalide, skip cache`);
			return;
		}

		// Ajouter au cache
		cache.set(uniqueValue, {
			id: generatedId,
			uniqueValue,
			timestamp: Date.now()
		});

		console.log(`=� [CACHE-ADD] ${cacheKey}: "${uniqueValue}" � ${generatedId}`);
	} catch (error) {
		console.error(`L [CACHE-ADD] ${cacheKey} erreur:`, error);
	}
}

/**
 * Cherche un ID dans le cache
 *
 * @param database - Base de donn�es
 * @param tableName - Nom de la table source
 * @param uniqueValue - Valeur unique � chercher (ex: "PWR-Test")
 * @returns ID trouv� ou null si absent/expir�
 */
export function lookupInCache(
	database: DatabaseName,
	tableName: string,
	uniqueValue: string
): number | null {
	const cacheKey = `${database}:${tableName}`;
	const cache = importSessionCache.get(cacheKey);

	if (!cache) {
		console.warn(`� [CACHE-MISS] ${cacheKey}: Cache non initialis�`);
		return null;
	}

	const entry = cache.get(uniqueValue);

	if (!entry) {
		console.warn(`� [CACHE-MISS] ${cacheKey}: "${uniqueValue}" absent`);
		return null;
	}

	// V�rifier TTL
	const isExpired = Date.now() - entry.timestamp > CACHE_TTL_MS;
	if (isExpired) {
		console.warn(`� [CACHE-EXPIRED] ${cacheKey}: "${uniqueValue}" expir� (TTL d�pass�)`);
		cache.delete(uniqueValue);
		return null;
	}

	console.log(` [CACHE-HIT] ${cacheKey}: "${uniqueValue}" � ${entry.id}`);
	return entry.id;
}

/**
 * Enrichit les donn�es avec les Foreign Keys manquantes
 *
 * PRINCIPE :
 * 1. D�tecte toutes les FK de la table via DMMF
 * 2. Pour chaque FK :
 *    - Si d�j� fournie : skip
 *    - Sinon : cherche valeur lookup dans les donn�es
 *    - Lookup dans cache (rapide)
 *    - Fallback DB si cache miss (lent)
 *    - Ajoute FK si trouv�e
 *
 * @param database - Base de donn�es
 * @param tableName - Nom de la table cible
 * @param rowData - Donn�es de la ligne (d�j� format�es)
 * @returns Donn�es enrichies avec FK
 */
export async function enrichWithForeignKeys(
	database: DatabaseName,
	tableName: string,
	rowData: Record<string, unknown>
): Promise<Record<string, unknown>> {
	const enrichedData = { ...rowData };

	try {
		// D�tecter toutes les FK de cette table via DMMF
		const fkMappings = await detectForeignKeyMappings(database, tableName);

		if (fkMappings.length === 0) {
			// Pas de FK d�tect�es, retourner tel quel
			return enrichedData;
		}

		console.log(`=
 [FK-ENRICH] ${tableName}: ${fkMappings.length} FK d�tect�es`);

		for (const fkMapping of fkMappings) {
			const { fkField, targetTable, lookupField } = fkMapping;

			// V�rifier si la FK est d�j� fournie dans les donn�es
			if (enrichedData[fkField] !== undefined && enrichedData[fkField] !== null) {
				console.log(` [FK-SKIP] ${fkField}: D�j� fourni (${enrichedData[fkField]})`);
				continue;
			}

			// Chercher le champ lookup dans les donn�es
			const lookupValue = enrichedData[lookupField];

			if (!lookupValue || typeof lookupValue !== 'string') {
				console.warn(`� [FK-SKIP] ${fkField}: Lookup field "${lookupField}" absent/invalide`);
				continue;
			}

			// 1. Essayer le cache (rapide - O(1))
			const cachedId = lookupInCache(database, targetTable, lookupValue);

			if (cachedId !== null) {
				enrichedData[fkField] = cachedId;
				console.log(`= [FK-CACHE] ${fkField}: "${lookupValue}" � ${cachedId}`);
				continue;
			}

			// 2. Fallback : Lookup en base de donn�es (lent mais fiable)
			console.warn(`� [FK-FALLBACK-DB] ${fkField}: Lookup DB pour "${lookupValue}"`);

			const uniqueFieldTarget = await detectUniqueField(database, targetTable);
			if (!uniqueFieldTarget) {
				console.error(`L [FK-ERROR] ${fkField}: Impossible de d�tecter unique field`);
				continue;
			}

			const record = await findRecord(database, targetTable, {
				[uniqueFieldTarget]: lookupValue
			});

			if (record) {
				const idField = await detectIdField(database, targetTable);
				if (idField && record[idField]) {
					enrichedData[fkField] = record[idField];
					console.log(` [FK-DB-FOUND] ${fkField}: "${lookupValue}" � ${record[idField]}`);
				}
			} else {
				console.error(`L [FK-NOT-FOUND] ${fkField}: "${lookupValue}" introuvable`);
			}
		}
	} catch (error) {
		console.error(`L [FK-ENRICH] ${tableName} erreur globale:`, error);
	}

	return enrichedData;
}

/**
 * Vide compl�tement le cache
 * Utile pour debugging ou nettoyage manuel
 */
export function clearImportCache(): void {
	const sizeBefore = importSessionCache.size;
	importSessionCache.clear();
	console.log(`=� [CACHE-CLEAR] ${sizeBefore} tables vid�es`);
}

/**
 * Statistiques du cache (debugging)
 */
export function getCacheStats(): Record<
	string,
	{ entries: number; oldestEntry: number; newestEntry: number }
> {
	const stats: Record<string, { entries: number; oldestEntry: number; newestEntry: number }> = {};

	importSessionCache.forEach((cache, key) => {
		let oldest = Infinity;
		let newest = 0;

		cache.forEach((entry) => {
			if (entry.timestamp < oldest) oldest = entry.timestamp;
			if (entry.timestamp > newest) newest = entry.timestamp;
		});

		stats[key] = {
			entries: cache.size,
			oldestEntry: oldest === Infinity ? 0 : oldest,
			newestEntry: newest
		};
	});

	return stats;
}

// ========== FONCTIONS PRIV�ES (DMMF) ==========

/**
 * D�tecte automatiquement les mappings FK via DMMF Prisma
 *
 * LOGIQUE :
 * 1. Lire le mod�le DMMF de la table
 * 2. Trouver tous les champs de type "object" (relations)
 * 3. Extraire relationFromFields (champ FK r�el)
 * 4. D�tecter le champ lookup dans la table cible
 *
 * @returns Array de mappings { fkField, targetTable, lookupField }
 */
async function detectForeignKeyMappings(
	database: DatabaseName,
	tableName: string
): Promise<ForeignKeyMapping[]> {
	try {
		const databases = await getDatabases();
		const model = databases[database].dmmf.datamodel.models.find((m) => m.name === tableName) as
			| DMMFModel
			| undefined;

		if (!model) {
			console.warn(`� [FK-DETECT] Table "${tableName}" introuvable dans DMMF`);
			return [];
		}

		const mappings: ForeignKeyMapping[] = [];

		for (const field of model.fields) {
			// Chercher les relations (@relation)
			if (field.kind === 'object' && field.relationName) {
				// Extraire le champ FK r�el
				const relationFromFields = field.relationFromFields || [];
				const actualFkField = relationFromFields[0]; // Ex: "fk_kit"

				if (!actualFkField) {
					continue;
				}

				const targetTable = field.type; // Ex: "kit"

				// D�tecter le champ lookup dans la table cible
				const lookupField = await detectUniqueField(database, targetTable);

				if (lookupField) {
					mappings.push({
						fkField: actualFkField,
						targetTable,
						lookupField
					});

					console.log(
						`=
 [FK-DETECT] ${tableName}.${actualFkField} � ${targetTable}.${lookupField}`
					);
				}
			}
		}

		return mappings;
	} catch (error) {
		console.error(`L [FK-DETECT] ${tableName} erreur:`, error);
		return [];
	}
}

/**
 * D�tecte le champ unique d'une table via DMMF
 *
 * PRIORIT� :
 * 1. Champ avec @unique
 * 2. Champ @id non auto-increment
 * 3. Pattern *_code ou *_label
 * 4. Fallback : premier champ string
 *
 * @returns Nom du champ unique ou null
 */
async function detectUniqueField(
	database: DatabaseName,
	tableName: string
): Promise<string | null> {
	try {
		const databases = await getDatabases();
		const model = databases[database].dmmf.datamodel.models.find((m) => m.name === tableName) as
			| DMMFModel
			| undefined;

		if (!model) return null;

		// 1. Chercher @unique
		const uniqueField = model.fields.find((f) => f.isUnique === true);
		if (uniqueField) return uniqueField.name;

		// 2. Chercher @id non auto-increment
		const idField = model.fields.find((f) => f.isId && f.hasDefaultValue === false);
		if (idField) return idField.name;

		// 3. Patterns courants : *_code, *_label, *_name
		const patternField = model.fields.find(
			(f) =>
				f.kind === 'scalar' &&
				(f.name.endsWith('_code') || f.name.endsWith('_label') || f.name.endsWith('_name'))
		);
		if (patternField) return patternField.name;

		// 4. Fallback : premier champ string non-FK
		const stringField = model.fields.find(
			(f) => f.kind === 'scalar' && f.type === 'String' && !f.name.startsWith('fk_')
		);
		if (stringField) return stringField.name;

		console.warn(`� [UNIQUE-DETECT] ${tableName}: Aucun champ unique d�tect�`);
		return null;
	} catch (error) {
		console.error(`L [UNIQUE-DETECT] ${tableName} erreur:`, error);
		return null;
	}
}

/**
 * D�tecte le champ ID d'une table via DMMF
 *
 * @returns Nom du champ ID ou null
 */
async function detectIdField(database: DatabaseName, tableName: string): Promise<string | null> {
	try {
		const databases = await getDatabases();
		const model = databases[database].dmmf.datamodel.models.find((m) => m.name === tableName) as
			| DMMFModel
			| undefined;

		if (!model) return null;

		// Chercher @id
		const idField = model.fields.find((f) => f.isId === true);
		if (idField) return idField.name;

		// Fallback : pattern *_id en premier
		const patternIdField = model.fields.find((f) => f.name.endsWith('_id'));
		if (patternIdField) return patternIdField.name;

		console.warn(`� [ID-DETECT] ${tableName}: Aucun champ ID d�tect�`);
		return null;
	} catch (error) {
		console.error(`L [ID-DETECT] ${tableName} erreur:`, error);
		return null;
	}
}
