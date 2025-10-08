#!/usr/bin/env node
/**
 * Script d'extraction complète des métadonnées Prisma DMMF (Data Model Meta Format)
 * Extrait TOUTES les métadonnées disponibles pour analyse
 *
 * Utilisation :
 *   node scripts/Script\ DMMF/extract-dmmf-metadata.mjs
 *
 * Génère 8 fichiers JSON optimisés pour différents usages :
 *
 * 📊 FICHIERS PRINCIPAUX (usage quotidien) :
 *   1. quick-stats.json (~60 lignes)
 *      → Aperçu rapide de la structure DB (compteurs, types, contraintes)
 *      → Usage : Vue d'ensemble rapide sans détails techniques
 *
 *   2. models-index.json (~150 lignes)
 *      → Index de navigation avec dépendances et niveaux d'import
 *      → Usage : Comprendre les relations entre modèles, ordre d'import
 *
 *   3. relations-graph.json (~200 lignes)
 *      → Graphe complet des relations FK avec cardinalités
 *      → Usage : Visualiser dépendances, analyser cascades de suppression
 *
 *   4. import-order.json (~120 lignes)
 *      → Ordre d'import optimal (tri topologique par niveaux)
 *      → Usage : Planifier imports de données sans erreurs FK
 *
 * 🔧 FICHIERS UTILITAIRES (développement) :
 *   5. validation-rules.json (~400 lignes)
 *      → Règles de validation complètes par modèle/champ
 *      → Usage : Générer schémas Zod, valider données avant import
 *
 *   6. native-types.json (~80 lignes)
 *      → Mapping types Prisma ↔ PostgreSQL
 *      → Usage : Migrations SQL, génération DDL, conversions de types
 *
 * 📈 FICHIERS STATISTIQUES :
 *   7. summary-dmmf.json (~100 lignes)
 *      → Statistiques essentielles globales
 *      → Usage : Rapport statistique de la base
 *
 *   8. full-dmmf.json (~13 580 lignes)
 *      → DMMF complet brut + analyses détaillées
 *      → Usage : Référence technique complète, développement d'outils
 *
 * 💡 Voir scripts/Script DMMF/output/README.md pour guide d'utilisation complet
 */

import { PrismaClient as CenovDevClient } from '../../prisma/cenov_dev/generated/index.js';
import { Prisma as CenovDevPrisma } from '../../prisma/cenov_dev/generated/index.js';
import fs from 'fs/promises';
import path from 'path';

const prisma = new CenovDevClient();

/**
 * Analyse un champ pour extraire toutes ses métadonnées
 */
function analyzeField(field) {
	const analyzed = {
		// Identification
		name: field.name,
		kind: field.kind,
		type: field.type,

		// Propriétés de base
		isList: field.isList,
		isRequired: field.isRequired,
		isUnique: field.isUnique,
		isId: field.isId,
		isReadOnly: field.isReadOnly,
		isGenerated: field.isGenerated,
		isUpdatedAt: field.isUpdatedAt,

		// Type natif DB
		nativeType: field.nativeType,
		nativeTypeString: field.nativeType
			? `${field.nativeType[0]}${field.nativeType[1].length > 0 ? `(${field.nativeType[1].join(',')})` : ''}`
			: null,

		// Valeur par défaut
		hasDefaultValue: field.hasDefaultValue,
		default: field.default || null,

		// Documentation
		documentation: field.documentation || null
	};

	// Ajouter les métadonnées de relation si c'est une relation
	if (field.kind === 'object') {
		analyzed.relation = {
			relationName: field.relationName || null,
			relationFromFields: field.relationFromFields || [],
			relationToFields: field.relationToFields || [],
			relationOnDelete: field.relationOnDelete || null,
			relationOnUpdate: field.relationOnUpdate || null
		};
	}

	return analyzed;
}

/**
 * Analyse un modèle pour extraire toutes ses métadonnées
 */
function analyzeModel(model) {
	return {
		// Identification
		name: model.name,
		dbName: model.dbName || null,
		schema: model.schema || 'public',
		isGenerated: model.isGenerated || false,

		// Clé primaire
		primaryKey: model.primaryKey || null,

		// Contraintes unique
		uniqueFields: model.uniqueFields || [],
		uniqueIndexes: model.uniqueIndexes || [],

		// Champs
		fields: model.fields.map(analyzeField),

		// Statistiques rapides
		stats: {
			totalFields: model.fields.length,
			scalarFields: model.fields.filter((f) => f.kind === 'scalar').length,
			relationFields: model.fields.filter((f) => f.kind === 'object').length,
			enumFields: model.fields.filter((f) => f.kind === 'enum').length,
			requiredFields: model.fields.filter((f) => f.isRequired).length,
			optionalFields: model.fields.filter((f) => !f.isRequired).length,
			uniqueFields: model.fields.filter((f) => f.isUnique).length,
			hasCompositePrimaryKey: model.primaryKey?.fields?.length > 1,
			hasUniqueConstraints: model.uniqueFields?.length > 0 || model.uniqueIndexes?.length > 0
		}
	};
}

/**
 * Construit le graphe des relations entre modèles
 */
function buildRelationGraph(models) {
	const relations = [];
	const dependencies = {};
	const reverseDependencies = {};

	for (const model of models) {
		const modelName = model.name;
		dependencies[modelName] = new Set();

		for (const field of model.fields) {
			if (
				field.kind === 'object' &&
				field.relationFromFields &&
				field.relationFromFields.length > 0
			) {
				// C'est une relation FK (N:1 ou 1:1 ownership)
				const targetModel = field.type;

				relations.push({
					sourceModel: modelName,
					sourceField: field.name,
					sourceSchema: model.schema,
					targetModel: targetModel,
					targetField: field.relationToFields?.[0] || null,
					type: field.isList ? 'N:M' : field.isRequired ? 'N:1 (required)' : 'N:1 (optional)',
					relationName: field.relationName,
					foreignKeyFields: field.relationFromFields,
					referencedFields: field.relationToFields,
					onDelete: field.relationOnDelete,
					onUpdate: field.relationOnUpdate,
					isRequired: field.isRequired,
					isList: field.isList,
					isSelfReferencing: modelName === targetModel
				});

				// Ajouter la dépendance
				dependencies[modelName].add(targetModel);

				// Ajouter la dépendance inverse
				if (!reverseDependencies[targetModel]) {
					reverseDependencies[targetModel] = new Set();
				}
				reverseDependencies[targetModel].add(modelName);
			}
		}
	}

	// Convertir Sets en Arrays pour JSON
	const dependenciesArray = {};
	for (const [model, deps] of Object.entries(dependencies)) {
		dependenciesArray[model] = Array.from(deps);
	}

	const reverseDependenciesArray = {};
	for (const [model, deps] of Object.entries(reverseDependencies)) {
		reverseDependenciesArray[model] = Array.from(deps);
	}

	return {
		relations,
		dependencies: dependenciesArray,
		reverseDependencies: reverseDependenciesArray
	};
}

/**
 * Calcule l'ordre d'import optimal (tri topologique)
 */
function calculateImportOrder(models, dependencies) {
	const visited = new Set();
	const visiting = new Set();
	const order = [];
	const cycles = [];

	function visit(modelName, path = []) {
		if (visiting.has(modelName)) {
			// Cycle détecté
			const cycleStart = path.indexOf(modelName);
			const cycle = [...path.slice(cycleStart), modelName];
			cycles.push(cycle);
			return;
		}

		if (visited.has(modelName)) {
			return;
		}

		visiting.add(modelName);
		path.push(modelName);

		const deps = dependencies[modelName] || [];
		for (const dep of deps) {
			// Ignorer les auto-références pour le tri topologique
			if (dep !== modelName) {
				visit(dep, [...path]);
			}
		}

		visiting.delete(modelName);
		visited.add(modelName);
		order.push(modelName);
		path.pop();
	}

	// Visiter tous les modèles
	for (const model of models) {
		if (!visited.has(model.name)) {
			visit(model.name);
		}
	}

	// Grouper par niveaux
	const levels = [];
	const modelLevels = {};

	for (const modelName of order) {
		const deps = dependencies[modelName] || [];
		const maxDepLevel = Math.max(
			-1,
			...deps
				.filter((dep) => dep !== modelName) // Ignorer auto-références
				.map((dep) => modelLevels[dep] ?? -1)
		);

		const level = maxDepLevel + 1;
		modelLevels[modelName] = level;

		if (!levels[level]) {
			levels[level] = [];
		}
		levels[level].push(modelName);
	}

	return {
		order: order.reverse(), // Inverser pour avoir les dépendances d'abord
		levels: levels.map((tables, level) => ({ level, tables })),
		cycles: [...new Set(cycles.map((c) => JSON.stringify(c)))].map((c) => JSON.parse(c)),
		selfReferencingTables: Object.entries(dependencies)
			.filter(([model, deps]) => deps.includes(model))
			.map(([model]) => model)
	};
}

/**
 * Génère les règles de validation pour l'import
 */
function generateValidationRules(models) {
	const rules = {};

	for (const model of models) {
		rules[model.name] = {
			schema: model.schema,
			tableName: model.dbName || model.name,
			primaryKey: model.primaryKey,
			uniqueConstraints: [
				...model.uniqueFields.map((fields) => ({ fields })),
				...model.uniqueIndexes.map((idx) => ({ name: idx.name, fields: idx.fields }))
			],
			fields: {}
		};

		for (const field of model.fields) {
			const fieldRule = {
				type: field.type,
				kind: field.kind,
				required: field.isRequired,
				unique: field.isUnique,
				isPrimaryKey: field.isId,
				isAutoGenerated: field.hasDefaultValue && field.default?.name === 'autoincrement',
				hasDefault: field.hasDefaultValue,
				defaultValue: field.default,
				nativeType: field.nativeType
			};

			if (field.kind === 'object' && field.relationFromFields) {
				fieldRule.relation = {
					targetModel: field.type,
					foreignKeyFields: field.relationFromFields,
					referencedFields: field.relationToFields,
					required: field.isRequired
				};
			}

			if (field.kind === 'enum') {
				// Trouver l'enum correspondant
				const enumDef = CenovDevPrisma.dmmf.datamodel.enums.find((e) => e.name === field.type);
				if (enumDef) {
					fieldRule.enumValues = enumDef.values.map((v) => v.name);
				}
			}

			rules[model.name].fields[field.name] = fieldRule;
		}
	}

	return rules;
}

/**
 * Génère un mapping des types natifs
 */
function generateNativeTypeMapping(models) {
	const mapping = {};

	for (const model of models) {
		for (const field of model.fields) {
			if (field.nativeType) {
				const key = `${field.type} + ${field.nativeType[0]}${field.nativeType[1].length > 0 ? `(${field.nativeType[1].join(',')})` : ''}`;
				const value = `PostgreSQL ${field.nativeType[0]}${field.nativeType[1].length > 0 ? `(${field.nativeType[1].join(',')})` : ''}`;
				mapping[key] = value;
			} else {
				const key = field.type;
				if (!mapping[key] && field.kind === 'scalar') {
					mapping[key] = `PostgreSQL ${field.type.toUpperCase()}`;
				}
			}
		}
	}

	return mapping;
}

/**
 * Génère les statistiques globales
 */
function generateStatistics(models, enums, relationGraph) {
	const stats = {
		models: {
			total: models.length,
			bySchema: {}
		},
		fields: {
			total: 0,
			byKind: {},
			byType: {}
		},
		relations: {
			total: relationGraph.relations.length,
			byType: {},
			selfReferencing: relationGraph.relations.filter((r) => r.isSelfReferencing).length
		},
		enums: {
			total: enums.length,
			list: enums.map((e) => ({ name: e.name, valuesCount: e.values.length }))
		},
		constraints: {
			primaryKeys: {
				simple: 0,
				composite: 0
			},
			unique: 0,
			foreignKeys: relationGraph.relations.length
		}
	};

	// Statistiques par schéma
	for (const model of models) {
		const schema = model.schema || 'public';
		if (!stats.models.bySchema[schema]) {
			stats.models.bySchema[schema] = {
				count: 0,
				models: []
			};
		}
		stats.models.bySchema[schema].count++;
		stats.models.bySchema[schema].models.push(model.name);
	}

	// Statistiques des champs
	for (const model of models) {
		stats.fields.total += model.fields.length;

		for (const field of model.fields) {
			// Par kind
			stats.fields.byKind[field.kind] = (stats.fields.byKind[field.kind] || 0) + 1;

			// Par type
			stats.fields.byType[field.type] = (stats.fields.byType[field.type] || 0) + 1;
		}

		// Contraintes PK
		if (model.primaryKey) {
			if (model.primaryKey.fields.length === 1) {
				stats.constraints.primaryKeys.simple++;
			} else {
				stats.constraints.primaryKeys.composite++;
			}
		}

		// Contraintes unique
		stats.constraints.unique += model.uniqueFields.length + model.uniqueIndexes.length;
	}

	// Statistiques des relations par type
	for (const relation of relationGraph.relations) {
		const type = relation.type;
		stats.relations.byType[type] = (stats.relations.byType[type] || 0) + 1;
	}

	return stats;
}

/**
 * Génère quick-stats.json : Statistiques rapides pour vue d'ensemble
 */
function generateQuickStats(models, enums, relationGraph, statistics) {
	// Séparer tables et vues
	const tables = models.filter((m) => !m.name.startsWith('v_') && !m.name.includes('_v_'));
	const views = models.filter((m) => m.name.startsWith('v_') || m.name.includes('_v_'));

	const bySchema = {};
	for (const schema of ['produit', 'public']) {
		const schemaModels = models.filter((m) => (m.schema || 'public') === schema);
		const schemaTables = schemaModels.filter(
			(m) => !m.name.startsWith('v_') && !m.name.includes('_v_')
		);
		const schemaViews = schemaModels.filter(
			(m) => m.name.startsWith('v_') || m.name.includes('_v_')
		);
		const schemaRelations = relationGraph.relations.filter((r) => r.sourceSchema === schema);

		bySchema[schema] = {
			models: schemaModels.length,
			tables: schemaTables.length,
			views: schemaViews.length,
			fields: schemaModels.reduce((sum, m) => sum + m.fields.length, 0),
			relations: schemaRelations.length
		};
	}

	return {
		metadata: {
			database: 'cenov_dev',
			extractedAt: new Date().toISOString()
		},
		overview: {
			totalModels: models.length,
			totalTables: tables.length,
			totalViews: views.length,
			totalFields: statistics.fields.total,
			totalRelations: statistics.relations.total,
			totalEnums: enums.length
		},
		bySchema,
		fieldTypes: statistics.fields.byType,
		relationTypes: statistics.relations.byType,
		constraints: statistics.constraints
	};
}

/**
 * Génère models-index.json : Index rapide de tous les modèles
 */
function generateModelsIndex(models, relationGraph, importOrder) {
	const index = {
		metadata: {
			totalModels: models.length,
			database: 'cenov_dev'
		},
		models: {}
	};

	// Créer un map des niveaux d'import
	const modelLevels = {};
	importOrder.levels.forEach((levelInfo) => {
		levelInfo.tables.forEach((tableName) => {
			modelLevels[tableName] = levelInfo.level;
		});
	});

	for (const model of models) {
		const modelName = model.name;
		const isView = modelName.startsWith('v_') || modelName.includes('_v_');

		// Trouver les dépendances et dépendants
		const dependencies = relationGraph.dependencies[modelName] || [];
		const dependents = relationGraph.reverseDependencies[modelName] || [];

		index.models[modelName] = {
			schema: model.schema || 'public',
			dbName: model.dbName || modelName,
			type: isView ? 'view' : 'table',
			fieldsCount: model.fields.length,
			relationsCount: model.fields.filter((f) => f.kind === 'object').length,
			primaryKey: model.primaryKey
				? {
						fields: model.primaryKey.fields,
						composite: model.primaryKey.fields.length > 1
					}
				: null,
			hasUniqueConstraints:
				(model.uniqueFields?.length || 0) + (model.uniqueIndexes?.length || 0) > 0,
			hasSelfReference: dependencies.includes(modelName),
			importLevel: modelLevels[modelName] ?? null,
			dependencies,
			dependents
		};
	}

	return index;
}

/**
 * Génère relations-graph.json : Graphe complet des relations
 */
function generateRelationsGraph(relationGraph) {
	// Construire l'index par modèle
	const byModel = {};
	for (const relation of relationGraph.relations) {
		const source = relation.sourceModel;
		const target = relation.targetModel;

		if (!byModel[source]) {
			byModel[source] = { outgoing: [], incoming: [] };
		}
		if (!byModel[target]) {
			byModel[target] = { outgoing: [], incoming: [] };
		}

		byModel[source].outgoing.push(target);
		byModel[target].incoming.push(source);
	}

	// Dédupliquer
	for (const model in byModel) {
		byModel[model].outgoing = [...new Set(byModel[model].outgoing)];
		byModel[model].incoming = [...new Set(byModel[model].incoming)];
	}

	return {
		metadata: {
			totalRelations: relationGraph.relations.length,
			selfReferencingTables: relationGraph.relations
				.filter((r) => r.isSelfReferencing)
				.map((r) => r.sourceModel)
		},
		relations: relationGraph.relations.map((r, idx) => ({
			id: `${r.sourceModel}_to_${r.targetModel}_${idx}`,
			sourceModel: r.sourceModel,
			sourceSchema: r.sourceSchema,
			sourceField: r.sourceField,
			targetModel: r.targetModel,
			targetSchema: r.targetSchema || 'public',
			targetField: r.targetField,
			type: r.type,
			cardinality: r.type.includes('N:1')
				? 'many-to-one'
				: r.type.includes('1:N')
					? 'one-to-many'
					: r.type.includes('1:1')
						? 'one-to-one'
						: 'many-to-many',
			isRequired: r.isRequired,
			isList: r.isList,
			foreignKeyFields: r.foreignKeyFields,
			referencedFields: r.referencedFields,
			onDelete: r.onDelete,
			onUpdate: r.onUpdate,
			isSelfReferencing: r.isSelfReferencing
		})),
		byModel
	};
}

/**
 * Génère import-order.json : Ordre d'import optimal
 */
function generateImportOrderFile(models, importOrder) {
	const views = models.filter((m) => m.name.startsWith('v_') || m.name.includes('_v_'));
	const viewsBySchema = {
		produit: views.filter((v) => (v.schema || 'public') === 'produit').map((v) => v.name),
		public: views.filter((v) => (v.schema || 'public') === 'public').map((v) => v.name)
	};

	return {
		metadata: {
			totalLevels: importOrder.levels.length,
			hasCycles: importOrder.cycles.length > 0,
			selfReferencingTables: importOrder.selfReferencingTables
		},
		order: importOrder.order,
		levels: importOrder.levels.map((level) => ({
			level: level.level,
			description:
				level.level === 0
					? 'Tables sans dépendances (racines)'
					: `Tables dépendant du niveau ${level.level - 1}`,
			tables: level.tables,
			canImportInParallel: true
		})),
		cycles: importOrder.cycles,
		specialCases: {
			selfReferencing: importOrder.selfReferencingTables.map((table) => ({
				table,
				field: 'parent_id ou origine',
				strategy:
					'Import parents first, then children (topological sort by hierarchy) or allow null on insert'
			}))
		},
		views: {
			...viewsBySchema,
			note: 'Les vues doivent être importées APRÈS toutes les tables dont elles dépendent'
		}
	};
}

/**
 * Génère native-types.json : Mapping des types natifs
 */
function generateNativeTypesFile(nativeTypeMapping, statistics) {
	const byCategory = {
		numeric: {},
		text: {},
		datetime: {},
		boolean: {}
	};

	for (const [key, value] of Object.entries(nativeTypeMapping)) {
		if (key.includes('Int') || key.includes('Float') || key.includes('Decimal')) {
			byCategory.numeric[key] = value;
		} else if (key.includes('String') || key.includes('VarChar') || key.includes('Text')) {
			byCategory.text[key] = value;
		} else if (key.includes('DateTime') || key.includes('Date') || key.includes('Timestamp')) {
			byCategory.datetime[key] = value;
		} else if (key.includes('Boolean')) {
			byCategory.boolean[key] = value;
		}
	}

	return {
		metadata: {
			database: 'PostgreSQL',
			prismaVersion: 'latest'
		},
		mapping: nativeTypeMapping,
		byCategory,
		usage: statistics.fields.byType
	};
}

/**
 * Fonction principale d'extraction DMMF
 */
async function extractDmmfMetadata() {
	const startTime = new Date();
	console.log("🚀 Démarrage de l'extraction des métadonnées Prisma DMMF");
	console.log(`⏰ Début: ${startTime.toISOString()}\n`);

	try {
		// Accès au DMMF complet
		const dmmf = CenovDevPrisma.dmmf;

		console.log('📊 Extraction des données DMMF...');
		console.log(`   Modèles trouvés: ${dmmf.datamodel.models.length}`);
		console.log(`   Enums trouvés: ${dmmf.datamodel.enums.length}`);

		// 1. Analyser tous les modèles
		console.log('\n🔍 Analyse des modèles...');
		const analyzedModels = dmmf.datamodel.models.map(analyzeModel);

		// 2. Construire le graphe des relations
		console.log('🔗 Construction du graphe des relations...');
		const relationGraph = buildRelationGraph(dmmf.datamodel.models);
		console.log(`   Relations trouvées: ${relationGraph.relations.length}`);

		// 3. Calculer l'ordre d'import
		console.log("📋 Calcul de l'ordre d'import optimal...");
		const importOrder = calculateImportOrder(dmmf.datamodel.models, relationGraph.dependencies);
		console.log(`   Niveaux d'import: ${importOrder.levels.length}`);
		if (importOrder.cycles.length > 0) {
			console.log(`   ⚠️  Cycles détectés: ${importOrder.cycles.length}`);
		}
		if (importOrder.selfReferencingTables.length > 0) {
			console.log(`   🔄 Tables auto-référentielles: ${importOrder.selfReferencingTables.length}`);
		}

		// 4. Générer les règles de validation
		console.log('✅ Génération des règles de validation...');
		const validationRules = generateValidationRules(dmmf.datamodel.models);

		// 5. Générer le mapping des types natifs
		console.log('🗂️  Génération du mapping des types natifs...');
		const nativeTypeMapping = generateNativeTypeMapping(dmmf.datamodel.models);

		// 6. Générer les statistiques
		console.log('📈 Calcul des statistiques...');
		const statistics = generateStatistics(
			dmmf.datamodel.models,
			dmmf.datamodel.enums,
			relationGraph
		);

		const endTime = new Date();
		const duration = endTime - startTime;

		// 7. Générer les nouveaux fichiers optimisés
		console.log('📝 Génération des fichiers optimisés...');
		const quickStats = generateQuickStats(
			dmmf.datamodel.models,
			dmmf.datamodel.enums,
			relationGraph,
			statistics
		);
		const modelsIndex = generateModelsIndex(dmmf.datamodel.models, relationGraph, importOrder);
		const relationsGraph = generateRelationsGraph(relationGraph);
		const importOrderFile = generateImportOrderFile(dmmf.datamodel.models, importOrder);
		const nativeTypesFile = generateNativeTypesFile(nativeTypeMapping, statistics);

		// Préparer les résultats complets (full-dmmf.json)
		const fullDmmf = {
			metadata: {
				extractedAt: endTime.toISOString(),
				startTime: startTime.toISOString(),
				endTime: endTime.toISOString(),
				duration: `${Math.round(duration)}ms`,
				database: 'cenov_dev',
				prismaVersion: 'latest',
				warning: '⚠️  DMMF est une API interne Prisma qui peut changer entre versions mineures'
			},
			dmmf: {
				datamodel: {
					models: dmmf.datamodel.models,
					enums: dmmf.datamodel.enums,
					types: dmmf.datamodel.types || []
				}
			},
			analyzed: {
				models: analyzedModels,
				relationGraph,
				importOrder,
				validationRules,
				nativeTypeMapping,
				statistics
			}
		};

		// Préparer le résumé simplifié (summary-dmmf.json) - Uniquement statistiques
		const summary = {
			metadata: fullDmmf.metadata,
			statistics
		};

		// Sauvegarder les fichiers
		console.log('💾 Sauvegarde des fichiers JSON...');
		const outputDir = path.join(process.cwd(), 'scripts', 'Script DMMF', 'output');
		await fs.mkdir(outputDir, { recursive: true });

		const files = {
			fullDmmf: path.join(outputDir, 'full-dmmf.json'),
			summary: path.join(outputDir, 'summary-dmmf.json'),
			quickStats: path.join(outputDir, 'quick-stats.json'),
			modelsIndex: path.join(outputDir, 'models-index.json'),
			relationsGraph: path.join(outputDir, 'relations-graph.json'),
			importOrder: path.join(outputDir, 'import-order.json'),
			validationRules: path.join(outputDir, 'validation-rules.json'),
			nativeTypes: path.join(outputDir, 'native-types.json')
		};

		await Promise.all([
			fs.writeFile(files.fullDmmf, JSON.stringify(fullDmmf, null, 2)),
			fs.writeFile(files.summary, JSON.stringify(summary, null, 2)),
			fs.writeFile(files.quickStats, JSON.stringify(quickStats, null, 2)),
			fs.writeFile(files.modelsIndex, JSON.stringify(modelsIndex, null, 2)),
			fs.writeFile(files.relationsGraph, JSON.stringify(relationsGraph, null, 2)),
			fs.writeFile(files.importOrder, JSON.stringify(importOrderFile, null, 2)),
			fs.writeFile(files.validationRules, JSON.stringify(validationRules, null, 2)),
			fs.writeFile(files.nativeTypes, JSON.stringify(nativeTypesFile, null, 2))
		]);

		// Afficher le résumé
		console.log('\n' + '='.repeat(70));
		console.log('✅ EXTRACTION DMMF TERMINÉE AVEC SUCCÈS');
		console.log('='.repeat(70));
		console.log(`⏱️  Durée totale: ${Math.round(duration)}ms`);
		console.log(`📊 Modèles analysés: ${statistics.models.total}`);
		console.log(`🔗 Relations trouvées: ${statistics.relations.total}`);
		console.log(`📋 Enums trouvés: ${statistics.enums.total}`);

		console.log('\n📈 Statistiques détaillées:');
		console.log(`   Champs totaux: ${statistics.fields.total}`);
		console.log(`   Clés primaires simples: ${statistics.constraints.primaryKeys.simple}`);
		console.log(`   Clés primaires composites: ${statistics.constraints.primaryKeys.composite}`);
		console.log(`   Contraintes unique: ${statistics.constraints.unique}`);
		console.log(`   Relations auto-référentielles: ${statistics.relations.selfReferencing}`);

		console.log('\n📂 Par schéma:');
		for (const [schema, data] of Object.entries(statistics.models.bySchema)) {
			console.log(`   ${schema}: ${data.count} modèles`);
		}

		console.log('\n📁 Fichiers générés (8 fichiers):');
		console.log(`   1. full-dmmf.json         - DMMF complet brut (~13 580 lignes)`);
		console.log(`   2. summary-dmmf.json      - Statistiques essentielles (~100 lignes)`);
		console.log(`   3. quick-stats.json       - Vue d'ensemble numérique (~60 lignes)`);
		console.log(`   4. models-index.json      - Index des modèles avec dépendances (~150 lignes)`);
		console.log(`   5. relations-graph.json   - Graphe complet des relations (~200 lignes)`);
		console.log(`   6. import-order.json      - Ordre d'import optimal (~120 lignes)`);
		console.log(`   7. validation-rules.json  - Règles de validation par champ (~400 lignes)`);
		console.log(`   8. native-types.json      - Mapping Prisma ↔ PostgreSQL (~80 lignes)`);

		console.log('\n💡 Utilisation recommandée:');
		console.log('   - quick-stats.json: Aperçu rapide de la structure DB');
		console.log('   - models-index.json: Navigation et recherche de modèles');
		console.log('   - relations-graph.json: Analyse des dépendances et FK');
		console.log('   - import-order.json: Planification des imports de données');
		console.log('   - validation-rules.json: Validation des données avant import');
		console.log('   - native-types.json: Conversion de types Prisma → PostgreSQL');
		console.log('   - summary-dmmf.json: Statistiques globales');
		console.log('   - full-dmmf.json: Référence technique complète');

		console.log(`\n📂 Répertoire de sortie: ${outputDir}`);

		return {
			fullDmmf,
			summary,
			quickStats,
			modelsIndex,
			relationsGraph,
			importOrderFile,
			nativeTypesFile,
			validationRules
		};
	} catch (error) {
		console.error("❌ Erreur lors de l'extraction DMMF:", error);
		throw error;
	} finally {
		await prisma.$disconnect();
	}
}

// Exécution si le script est lancé directement
if (import.meta.url.endsWith('extract-dmmf-metadata.mjs')) {
	extractDmmfMetadata()
		.then(() => {
			console.log('\n🎉 Script DMMF terminé avec succès');
			process.exit(0);
		})
		.catch((error) => {
			console.error('\n💥 Échec du script DMMF:', error);
			process.exit(1);
		});
}

export { extractDmmfMetadata };
