// src/lib/import/view-import.ts
import {
	getDatabases,
	getTableMetadata,
	getPrimaryKeyFields,
	createRecord,
	findRecord,
	type DatabaseName
} from '$lib/prisma-meta';
import fs from 'fs/promises';
import path from 'path';

// ========== TYPES ==========
interface ViewDependency {
	tables: string[];
	importOrder: string[][];
	relations: Record<
		string,
		Array<{
			field: string;
			targetTable: string;
			targetField: string;
			required: boolean;
		}>
	>;
}

// ========== FONCTIONS UTILITAIRES DYNAMIQUES ==========

// Récupère le schéma d'une vue/table DYNAMIQUEMENT via DMMF
async function getTableSchema(database: DatabaseName, tableName: string): Promise<string> {
	const databases = await getDatabases();
	const model = databases[database].dmmf.datamodel.models.find((m) => m.name === tableName);

	// Retourner le schéma depuis DMMF (@@schema)
	return (model as { schema?: string })?.schema || 'public';
}

// Calcule l'ordre d'import pour un sous-ensemble de tables DYNAMIQUEMENT
async function calculateTableImportOrder(
	database: DatabaseName,
	tableNames: string[]
): Promise<string[][]> {
	const databases = await getDatabases();
	const allModels = databases[database].dmmf.datamodel.models;

	// Construire graphe de dépendances
	const dependencies: Record<string, Set<string>> = {};

	for (const tableName of tableNames) {
		const model = allModels.find((m) => m.name === tableName);
		if (!model) continue;

		dependencies[tableName] = new Set();

		// Trouver les relations FK
		for (const field of model.fields) {
			if (field.kind === 'object') {
				const fieldWithRelation = field as {
					relationFromFields?: string[];
					type: string;
				};

				if (
					fieldWithRelation.relationFromFields &&
					fieldWithRelation.relationFromFields.length > 0
				) {
					const targetTable = fieldWithRelation.type;
					if (tableNames.includes(targetTable) && targetTable !== tableName) {
						dependencies[tableName].add(targetTable);
					}
				}
			}
		}
	}

	// Tri topologique par niveaux
	return topologicalSort(dependencies);
}

// Trouve les relations FK d'une table DYNAMIQUEMENT
async function getTableRelations(
	database: DatabaseName,
	tableName: string
): Promise<
	Array<{
		field: string;
		targetTable: string;
		targetField: string;
		required: boolean;
	}>
> {
	const databases = await getDatabases();
	const model = databases[database].dmmf.datamodel.models.find((m) => m.name === tableName);

	if (!model) return [];

	const relations: Array<{
		field: string;
		targetTable: string;
		targetField: string;
		required: boolean;
	}> = [];

	for (const field of model.fields) {
		if (field.kind === 'object') {
			const fieldWithRelation = field as {
				relationFromFields?: string[];
				relationToFields?: string[];
				type: string;
				isRequired: boolean;
			};

			if (fieldWithRelation.relationFromFields && fieldWithRelation.relationFromFields.length > 0) {
				relations.push({
					field: fieldWithRelation.relationFromFields[0],
					targetTable: fieldWithRelation.type,
					targetField: fieldWithRelation.relationToFields?.[0] || 'id',
					required: fieldWithRelation.isRequired
				});
			}
		}
	}

	return relations;
}

// Tri topologique (helper interne)
function topologicalSort(dependencies: Record<string, Set<string>>): string[][] {
	const visited = new Set<string>();
	const levels: string[][] = [];

	while (visited.size < Object.keys(dependencies).length) {
		const currentLevel: string[] = [];

		for (const [table, deps] of Object.entries(dependencies)) {
			if (visited.has(table)) continue;

			const allDepsVisited = Array.from(deps).every((dep) => visited.has(dep));

			if (allDepsVisited) {
				currentLevel.push(table);
			}
		}

		if (currentLevel.length === 0) break; // Cycle détecté

		currentLevel.forEach((table) => visited.add(table));
		levels.push(currentLevel);
	}

	return levels;
}

// Extrait tables depuis SQL (regex simple, pas de hardcoding)
function extractTablesFromSql(sql: string): string[] {
	const tables = new Set<string>();

	// Regex pour capturer : schema.table ou table
	const regex = /(?:FROM|JOIN)\s+(?:\w+\.)?(\w+)\s+/gi;
	let match;

	while ((match = regex.exec(sql)) !== null) {
		const tableName = match[1];
		// Filtrer alias courts (1-2 caractères) et vues (commencent par v_)
		if (tableName.length > 2 && !tableName.startsWith('v_')) {
			tables.add(tableName);
		}
	}

	return Array.from(tables);
}

// ========== FONCTIONS PRINCIPALES ==========

// Analyse les dépendances d'une vue DYNAMIQUEMENT

export async function analyzeViewDependencies(
	database: DatabaseName,
	viewName: string
): Promise<ViewDependency> {
	// 1. Récupérer le schéma DYNAMIQUEMENT via DMMF
	const schema = await getTableSchema(database, viewName);

	// 2. Construire le chemin DYNAMIQUEMENT
	const viewSqlPath = path.join(
		process.cwd(),
		'prisma',
		database, // ✅ Pas de ternaire, utilise directement le nom
		'views',
		schema, // ✅ Dynamique depuis DMMF
		`${viewName}.sql`
	);

	// 3. Lire le fichier SQL
	const viewSql = await fs.readFile(viewSqlPath, 'utf-8');

	// 4. Extraire les tables du SQL
	const tables = extractTablesFromSql(viewSql);

	// 5. Calculer ordre d'import DYNAMIQUEMENT
	const importOrder = await calculateTableImportOrder(database, tables);

	// 6. Récupérer relations DYNAMIQUEMENT
	const relations: Record<
		string,
		Array<{
			field: string;
			targetTable: string;
			targetField: string;
			required: boolean;
		}>
	> = {};
	for (const table of tables) {
		relations[table] = await getTableRelations(database, table);
	}

	return {
		tables,
		importOrder,
		relations
	};
}

// Mappe colonnes vue → tables DYNAMIQUEMENT
export async function mapViewColumnsToTables(
	database: DatabaseName,
	viewColumns: Record<string, unknown>,
	dependencies: ViewDependency
): Promise<Record<string, Record<string, unknown>>> {
	const mapping: Record<string, Record<string, unknown>> = {};

	for (const level of dependencies.importOrder) {
		for (const tableName of level) {
			// Récupérer métadonnées DYNAMIQUEMENT
			const metadata = await getTableMetadata(database, tableName);
			if (!metadata) continue;

			mapping[tableName] = {};

			// Mapper colonnes disponibles
			for (const field of metadata.fields) {
				if (viewColumns[field.name] !== undefined) {
					mapping[tableName][field.name] = viewColumns[field.name];
				}
			}
		}
	}

	return mapping;
}

// FONCTION PRINCIPALE : Import intelligent depuis vue
export async function importFromView(
	database: DatabaseName,
	viewName: string,
	data: Record<string, unknown>[]
): Promise<{
	success: boolean;
	inserted: Record<string, number>;
	updated: Record<string, number>;
	errors: string[];
}> {
	const result = {
		success: true,
		inserted: {} as Record<string, number>,
		updated: {} as Record<string, number>,
		errors: [] as string[]
	};

	try {
		// 1. Analyser vue DYNAMIQUEMENT
		const deps = await analyzeViewDependencies(database, viewName);

		// 2. Pour chaque ligne de données
		for (const row of data) {
			// 3. Mapper colonnes DYNAMIQUEMENT
			const mapping = await mapViewColumnsToTables(database, row, deps);

			// 4. Insérer dans l'ordre calculé DYNAMIQUEMENT
			const createdIds: Record<string, unknown> = {};

			for (const level of deps.importOrder) {
				for (const tableName of level) {
					if (!mapping[tableName] || Object.keys(mapping[tableName]).length === 0) {
						continue;
					}

					const insertData = { ...mapping[tableName] };

					// Résoudre FK DYNAMIQUEMENT
					const relations = deps.relations[tableName] || [];
					for (const rel of relations) {
						if (createdIds[rel.targetTable]) {
							insertData[rel.field] = createdIds[rel.targetTable];
						}
					}

					// Upsert DYNAMIQUE
					const pks = await getPrimaryKeyFields(database, tableName);
					const whereCondition: Record<string, unknown> = {};

					for (const pk of pks) {
						if (insertData[pk]) {
							whereCondition[pk] = insertData[pk];
						}
					}

					let recordId;

					if (Object.keys(whereCondition).length > 0) {
						const existing = await findRecord(database, tableName, whereCondition);
						if (existing) {
							recordId = existing[pks[0]];
							result.updated[tableName] = (result.updated[tableName] || 0) + 1;
							continue; // Skip insert, déjà existe
						}
					}

					// Créer nouvel enregistrement
					const created = await createRecord(database, tableName, insertData);
					recordId = created[pks[0]];
					createdIds[tableName] = recordId;
					result.inserted[tableName] = (result.inserted[tableName] || 0) + 1;
				}
			}
		}
	} catch (error) {
		result.success = false;
		result.errors.push(error instanceof Error ? error.message : String(error));
	}

	return result;
}
