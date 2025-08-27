import { error, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { z } from 'zod';
import { superValidate } from 'sveltekit-superforms/server';
import { zod } from 'sveltekit-superforms/adapters';
import { PrismaClient } from '@prisma/client';
import { protect } from '$lib/auth/protect';

const prisma = new PrismaClient();

// Types pour l'export
export interface ExportConfig {
	selectedTables: string[];
	format: 'xlsx' | 'csv' | 'pdf' | 'xml';
	includeRelations: boolean;
	rowLimit?: number;
	filters: Record<string, unknown>;
	includeHeaders: boolean;
}

export interface TableInfo {
	name: string;
	displayName: string;
	category: 'tables' | 'views';
	rowCount: number;
	columns: ColumnInfo[];
	relations?: string[];
}

export interface ColumnInfo {
	name: string;
	type: string;
	required: boolean;
	description?: string;
}

export interface ExportResult {
	success: boolean;
	message: string;
	downloadUrl?: string;
	fileName?: string;
	fileSize?: number;
	exportedRows: number;
	warnings: string[];
	errors: string[];
	needsClientDownload?: boolean;
}

// Schéma de validation pour l'export
const exportSchema = z.object({
	selectedTables: z.array(z.string()).min(1, 'Sélectionnez au moins une table'),
	format: z.enum(['xlsx', 'csv', 'pdf', 'xml'], {
		errorMap: () => ({ message: 'Format non supporté' })
	}),
	includeRelations: z.boolean().default(false),
	rowLimit: z.number().min(1).max(1000000).optional(),
	filters: z.record(z.unknown()).default({}),
	includeHeaders: z.boolean().default(true),
	dateRange: z
		.object({
			from: z.string().optional(),
			to: z.string().optional()
		})
		.optional()
});

// Définition des tables et vues disponibles
const availableTables: TableInfo[] = [
	// Tables principales
	{
		name: 'kit',
		displayName: 'Kits',
		category: 'tables',
		rowCount: 0,
		columns: [
			{ name: 'kit_id', type: 'number', required: true, description: 'ID du kit' },
			{ name: 'kit_label', type: 'string', required: false, description: 'Nom du kit' },
			{ name: 'created_at', type: 'datetime', required: false, description: 'Date de création' },
			{ name: 'updated_at', type: 'datetime', required: false, description: 'Date de mise à jour' }
		],
		relations: ['kit_attribute', 'kit_document', 'kit_kit', 'part']
	},
	{
		name: 'part',
		displayName: 'Pièces',
		category: 'tables',
		rowCount: 0,
		columns: [
			{ name: 'par_id', type: 'number', required: true, description: 'ID de la pièce' },
			{ name: 'fk_kit', type: 'number', required: false, description: 'Kit parent' },
			{ name: 'par_label', type: 'string', required: false, description: 'Nom de la pièce' },
			{ name: 'created_at', type: 'datetime', required: false, description: 'Date de création' },
			{ name: 'updated_at', type: 'datetime', required: false, description: 'Date de mise à jour' }
		],
		relations: ['kit']
	},
	{
		name: 'attribute',
		displayName: 'Attributs',
		category: 'tables',
		rowCount: 0,
		columns: [
			{ name: 'atr_id', type: 'number', required: true, description: "ID de l'attribut" },
			{ name: 'atr_nat', type: 'string', required: false, description: "Nature de l'attribut" },
			{ name: 'atr_val', type: 'string', required: false, description: "Valeur de l'attribut" },
			{ name: 'atr_label', type: 'string', required: false, description: "Label de l'attribut" },
			{ name: 'created_at', type: 'datetime', required: false, description: 'Date de création' },
			{ name: 'updated_at', type: 'datetime', required: false, description: 'Date de mise à jour' }
		],
		relations: ['kit_attribute']
	},
	{
		name: 'kit_attribute',
		displayName: 'Kit-Attributs (Relations)',
		category: 'tables',
		rowCount: 0,
		columns: [
			{ name: 'kat_id', type: 'number', required: true, description: 'ID de la relation' },
			{ name: 'fk_kit', type: 'number', required: false, description: 'Kit lié' },
			{
				name: 'fk_attribute_carac',
				type: 'number',
				required: false,
				description: 'Attribut caractéristique'
			},
			{ name: 'fk_attribute', type: 'number', required: false, description: 'Attribut lié' },
			{ name: 'kat_valeur', type: 'number', required: false, description: 'Valeur numérique' },
			{ name: 'created_at', type: 'datetime', required: false, description: 'Date de création' },
			{ name: 'updated_at', type: 'datetime', required: false, description: 'Date de mise à jour' }
		],
		relations: ['kit', 'attribute']
	},
	{
		name: 'kit_kit',
		displayName: 'Kit-Kit (Relations)',
		category: 'tables',
		rowCount: 0,
		columns: [
			{ name: 'kik_id', type: 'number', required: true, description: 'ID de la relation' },
			{ name: 'fk_kit_parent', type: 'number', required: false, description: 'Kit parent' },
			{ name: 'fk_kit_child', type: 'number', required: false, description: 'Kit enfant' },
			{ name: 'kik_qty', type: 'number', required: false, description: 'Quantité' },
			{ name: 'kik_index', type: 'number', required: false, description: 'Index' },
			{ name: 'created_at', type: 'datetime', required: false, description: 'Date de création' },
			{ name: 'updated_at', type: 'datetime', required: false, description: 'Date de mise à jour' }
		],
		relations: ['kit']
	},
	{
		name: 'document',
		displayName: 'Documents',
		category: 'tables',
		rowCount: 0,
		columns: [
			{ name: 'doc_id', type: 'number', required: true, description: 'ID du document' },
			{ name: 'doc_name', type: 'string', required: false, description: 'Nom du document' },
			{
				name: 'doc_extension',
				type: 'string',
				required: false,
				description: 'Extension du fichier'
			},
			{ name: 'doc_type', type: 'string', required: false, description: 'Type de document' }
		],
		relations: ['kit_document']
	},
	{
		name: 'kit_document',
		displayName: 'Kit-Documents (Relations)',
		category: 'tables',
		rowCount: 0,
		columns: [
			{ name: 'kid_id', type: 'number', required: true, description: 'ID de la relation' },
			{ name: 'fk_kit', type: 'number', required: false, description: 'Kit lié' },
			{ name: 'fk_document', type: 'number', required: false, description: 'Document lié' },
			{ name: 'kid_description', type: 'string', required: false, description: 'Description' },
			{ name: 'created_at', type: 'datetime', required: false, description: 'Date de création' },
			{ name: 'updated_at', type: 'datetime', required: false, description: 'Date de mise à jour' }
		],
		relations: ['kit', 'document']
	},
	{
		name: 'supplier',
		displayName: 'Fournisseurs',
		category: 'tables',
		rowCount: 0,
		columns: [
			{ name: 'sup_id', type: 'number', required: true, description: 'ID du fournisseur' },
			{ name: 'sup_code', type: 'string', required: true, description: 'Code fournisseur' },
			{ name: 'sup_label', type: 'string', required: false, description: 'Nom du fournisseur' }
		]
	},

	// Tables de développement
	{
		name: 'kit_dev',
		displayName: 'Kits (Dev)',
		category: 'tables',
		rowCount: 0,
		columns: [
			{ name: 'kit_id', type: 'number', required: true, description: 'ID du kit' },
			{ name: 'kit_label', type: 'string', required: false, description: 'Nom du kit' },
			{ name: 'created_at', type: 'datetime', required: false, description: 'Date de création' },
			{ name: 'updated_at', type: 'datetime', required: false, description: 'Date de mise à jour' }
		]
	},
	{
		name: 'attribute_dev',
		displayName: 'Attributs (Dev)',
		category: 'tables',
		rowCount: 0,
		columns: [
			{ name: 'atr_id', type: 'number', required: true, description: "ID de l'attribut" },
			{ name: 'atr_nat', type: 'string', required: false, description: "Nature de l'attribut" },
			{ name: 'atr_val', type: 'string', required: false, description: "Valeur de l'attribut" },
			{ name: 'atr_label', type: 'string', required: false, description: "Label de l'attribut" },
			{ name: 'created_at', type: 'datetime', required: false, description: 'Date de création' },
			{ name: 'updated_at', type: 'datetime', required: false, description: 'Date de mise à jour' }
		]
	},
	{
		name: 'kit_attribute_dev',
		displayName: 'Kit-Attributs (Dev)',
		category: 'tables',
		rowCount: 0,
		columns: [
			{ name: 'kat_id', type: 'number', required: true, description: 'ID de la relation' },
			{ name: 'fk_kit', type: 'number', required: false, description: 'Kit lié' },
			{
				name: 'fk_attribute_carac',
				type: 'number',
				required: false,
				description: 'Attribut caractéristique'
			},
			{ name: 'fk_attribute', type: 'number', required: false, description: 'Attribut lié' },
			{ name: 'kat_valeur', type: 'number', required: false, description: 'Valeur numérique' },
			{ name: 'created_at', type: 'datetime', required: false, description: 'Date de création' },
			{ name: 'updated_at', type: 'datetime', required: false, description: 'Date de mise à jour' }
		]
	},
	{
		name: 'supplier_dev',
		displayName: 'Fournisseurs (Dev)',
		category: 'tables',
		rowCount: 0,
		columns: [
			{ name: 'sup_id', type: 'number', required: true, description: 'ID du fournisseur' },
			{ name: 'sup_code', type: 'string', required: false, description: 'Code fournisseur' },
			{ name: 'sup_label', type: 'string', required: false, description: 'Nom du fournisseur' }
		]
	},

	// Vues
	{
		name: 'v_kit_carac',
		displayName: 'Vue Kit-Caractéristiques',
		category: 'views',
		rowCount: 0,
		columns: [
			{ name: 'id', type: 'number', required: true, description: 'ID unique' },
			{ name: 'kit_label', type: 'string', required: true, description: 'Nom du kit' },
			{ name: 'atr_label', type: 'string', required: true, description: "Label de l'attribut" },
			{ name: 'atr_val', type: 'string', required: true, description: "Valeur de l'attribut" },
			{ name: 'kat_valeur', type: 'number', required: true, description: 'Valeur numérique' }
		]
	},
	{
		name: 'v_categories',
		displayName: 'Vue Catégories',
		category: 'views',
		rowCount: 0,
		columns: [
			{ name: 'atr_id', type: 'number', required: true, description: "ID de l'attribut" },
			{ name: 'atr_0_label', type: 'string', required: true, description: 'Catégorie niveau 0' },
			{ name: 'atr_1_label', type: 'string', required: false, description: 'Catégorie niveau 1' },
			{ name: 'atr_2_label', type: 'string', required: false, description: 'Catégorie niveau 2' },
			{ name: 'atr_3_label', type: 'string', required: false, description: 'Catégorie niveau 3' },
			{ name: 'atr_4_label', type: 'string', required: false, description: 'Catégorie niveau 4' },
			{ name: 'atr_5_label', type: 'string', required: false, description: 'Catégorie niveau 5' },
			{ name: 'atr_6_label', type: 'string', required: false, description: 'Catégorie niveau 6' },
			{ name: 'atr_7_label', type: 'string', required: false, description: 'Catégorie niveau 7' }
		]
	},

	// Vues de développement
	{
		name: 'v_kit_carac_dev',
		displayName: 'Vue Kit-Caractéristiques (Dev)',
		category: 'views',
		rowCount: 0,
		columns: [
			{ name: 'id', type: 'number', required: true, description: 'ID unique' },
			{ name: 'kit_label', type: 'string', required: true, description: 'Nom du kit' },
			{ name: 'atr_label', type: 'string', required: true, description: "Label de l'attribut" },
			{ name: 'atr_val', type: 'string', required: true, description: "Valeur de l'attribut" },
			{ name: 'kat_valeur', type: 'number', required: true, description: 'Valeur numérique' }
		]
	},
	{
		name: 'v_categories_dev',
		displayName: 'Vue Catégories (Dev)',
		category: 'views',
		rowCount: 0,
		columns: [
			{ name: 'row_key', type: 'number', required: true, description: 'Clé de ligne' },
			{ name: 'atr_id', type: 'number', required: false, description: "ID de l'attribut" },
			{ name: 'atr_0_label', type: 'string', required: false, description: 'Catégorie niveau 0' },
			{ name: 'atr_1_label', type: 'string', required: false, description: 'Catégorie niveau 1' },
			{ name: 'atr_2_label', type: 'string', required: false, description: 'Catégorie niveau 2' },
			{ name: 'atr_3_label', type: 'string', required: false, description: 'Catégorie niveau 3' },
			{ name: 'atr_4_label', type: 'string', required: false, description: 'Catégorie niveau 4' },
			{ name: 'atr_5_label', type: 'string', required: false, description: 'Catégorie niveau 5' },
			{ name: 'atr_6_label', type: 'string', required: false, description: 'Catégorie niveau 6' },
			{ name: 'atr_7_label', type: 'string', required: false, description: 'Catégorie niveau 7' }
		]
	}
];

// Obtenir les informations sur les tables avec le compte de lignes
async function getTablesInfo(): Promise<TableInfo[]> {
	const tablesWithCounts = await Promise.all(
		availableTables.map(async (table) => {
			try {
				let count = 0;

				// Obtenir le nombre de lignes pour chaque table/vue
				switch (table.name) {
					case 'kit':
						count = await prisma.kit.count();
						break;
					case 'part':
						count = await prisma.part.count();
						break;
					case 'attribute':
						count = await prisma.attribute.count();
						break;
					case 'kit_attribute':
						count = await prisma.kit_attribute.count();
						break;
					case 'kit_kit':
						count = await prisma.kit_kit.count();
						break;
					case 'document':
						count = await prisma.document.count();
						break;
					case 'kit_document':
						count = await prisma.kit_document.count();
						break;
					case 'supplier':
						count = await prisma.supplier.count();
						break;
					case 'kit_dev':
						count = await prisma.kit_dev.count();
						break;
					case 'attribute_dev':
						count = await prisma.attribute_dev.count();
						break;
					case 'kit_attribute_dev':
						count = await prisma.kit_attribute_dev.count();
						break;
					case 'supplier_dev':
						count = await prisma.supplier_dev.count();
						break;
					case 'v_kit_carac':
						count = await prisma.v_kit_carac.count();
						break;
					case 'v_categories':
						count = await prisma.v_categories.count();
						break;
					case 'v_kit_carac_dev':
						count = await prisma.v_kit_carac_dev.count();
						break;
					case 'v_categories_dev':
						count = await prisma.v_categories_dev.count();
						break;
				}

				return {
					...table,
					rowCount: count
				};
			} catch (err) {
				console.warn(`Erreur lors du comptage des lignes pour ${table.name}:`, err);
				return {
					...table,
					rowCount: 0
				};
			}
		})
	);

	return tablesWithCounts;
}

export const load = (async (event) => {
	// Protection de la route - redirection vers / si non connecté
	await protect(event);

	const { depends } = event;
	depends('app:export');

	try {
		// Récupérer les informations sur les tables avec les compteurs
		const tables = await getTablesInfo();

		// Créer le formulaire vide pour l'export
		const form = await superValidate(zod(exportSchema));

		// Données par défaut
		form.data = {
			selectedTables: [],
			format: 'csv',
			includeRelations: false,
			filters: {},
			includeHeaders: true
		};

		return {
			form,
			tables,
			totalTables: tables.length,
			totalRows: tables.reduce((sum, table) => sum + table.rowCount, 0)
		};
	} catch (err) {
		throw error(
			500,
			`Erreur lors du chargement de la page export: ${err instanceof Error ? err.message : 'Erreur inconnue'}`
		);
	}
}) satisfies PageServerLoad;

export const actions: Actions = {
	preview: async (event) => {
		// Protection de l'action - redirection vers / si non connecté
		await protect(event);

		const { request } = event;
		console.log('🔍 [PREVIEW] Action preview déclenchée');
		const form = await superValidate(request, zod(exportSchema));

		if (!form.valid) {
			console.error('❌ [PREVIEW] Formulaire invalide:', form.errors);
			return fail(400, { form });
		}

		console.log("📊 [PREVIEW] Configuration d'aperçu reçue:", form.data);

		try {
			const { selectedTables, rowLimit } = form.data;
			const previewData: Record<string, unknown[]> = {};

			// Récupérer un aperçu des données pour chaque table sélectionnée
			for (const tableName of selectedTables) {
				const limit = Math.min(rowLimit || 10, 10); // Max 10 lignes pour l'aperçu
				let data: unknown[] = [];

				switch (tableName) {
					case 'kit':
						data = await prisma.kit.findMany({ take: limit, orderBy: { kit_id: 'asc' } });
						break;
					case 'part':
						data = await prisma.part.findMany({
							take: limit,
							include: { kit: true },
							orderBy: { par_id: 'asc' }
						});
						break;
					case 'attribute':
						data = await prisma.attribute.findMany({ take: limit, orderBy: { atr_id: 'asc' } });
						break;
					case 'kit_attribute':
						data = await prisma.kit_attribute.findMany({
							take: limit,
							include: { kit: true, attribute_kit_attribute_fk_attributeToattribute: true },
							orderBy: { kat_id: 'asc' }
						});
						break;
					case 'supplier':
						data = await prisma.supplier.findMany({ take: limit, orderBy: { sup_id: 'asc' } });
						break;
					case 'supplier_dev':
						data = await prisma.supplier_dev.findMany({ take: limit, orderBy: { sup_id: 'asc' } });
						break;
					case 'v_kit_carac':
						data = await prisma.v_kit_carac.findMany({ take: limit, orderBy: { id: 'asc' } });
						break;
					case 'v_categories':
						data = await prisma.v_categories.findMany({ take: limit, orderBy: { atr_id: 'asc' } });
						break;
					// Ajouter les autres tables selon les besoins
				}

				previewData[tableName] = data;
			}

			console.log('✅ [PREVIEW] Aperçu généré avec succès, tables:', Object.keys(previewData));
			return { form, success: true, preview: previewData };
		} catch (err) {
			console.error("❌ [PREVIEW] Erreur lors de l'aperçu:", err);
			return fail(500, {
				form,
				error: "Erreur lors de l'aperçu des données"
			});
		}
	},

	export: async (event) => {
		// Protection de l'action - redirection vers / si non connecté
		await protect(event);

		const { request, fetch } = event;
		console.log('🚀 [SERVER] Action export déclenchée');

		const form = await superValidate(request, zod(exportSchema));

		console.log('📝 [SERVER] Données reçues après validation:');
		console.log('  - Valid:', form.valid);
		console.log('  - Data:', form.data);
		console.log('  - Errors:', form.errors);

		if (!form.valid) {
			console.error('❌ [SERVER] Formulaire invalide:', form.errors);
			return fail(400, { form });
		}

		console.log("📊 [SERVER] Configuration d'export validée:", form.data);

		try {
			// Rediriger vers l'API d'export pour le traitement
			console.log('📡 [SERVER] Envoi requête vers /export/api');
			const response = await fetch('/export/api', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(form.data)
			});

			console.log('📨 [SERVER] Réponse API reçue:', response.status, response.statusText);

			// Vérifier si c'est un fichier binaire (headers Content-Type)
			const contentType = response.headers.get('content-type');
			console.log('📄 [SERVER] Content-Type de la réponse:', contentType);

			if (!response.ok) {
				console.error('❌ [SERVER] Réponse API non OK:', response.status);
				let errorData;
				try {
					errorData = await response.json();
				} catch {
					errorData = { error: "Erreur de communication avec l'API" };
				}
				return fail(response.status, {
					form,
					error: errorData.error || "Erreur lors de l'export"
				});
			}

			// Si c'est un fichier binaire ou HTML (PDF), on devrait gérer le téléchargement différemment
			if (
				contentType &&
				(contentType.includes('application/vnd.openxml') ||
					contentType.includes('text/csv') ||
					contentType.includes('application/xml') ||
					contentType.includes('text/html'))
			) {
				console.log('📁 [SERVER] Fichier binaire détecté, lecture des headers personnalisés');
				const exportResultHeader = response.headers.get('X-Export-Result');
				if (exportResultHeader) {
					const result = JSON.parse(exportResultHeader);
					console.log("📦 [SERVER] Résultat d'export extrait des headers:", result);

					// Dans ce cas, nous devons gérer le téléchargement côté client
					const finalResult = { ...result, needsClientDownload: true, downloadUrl: '/export/api' };
					console.log('🎯 [SERVER] Retour du résultat final:', finalResult);
					return { form, success: true, result: finalResult };
				} else {
					console.warn('⚠️ [SERVER] Header X-Export-Result manquant');
				}
			}

			// Tentative de lecture JSON pour les erreurs
			let result;
			try {
				result = await response.json();
				console.log('📦 [SERVER] Résultat JSON:', result);
			} catch (jsonErr) {
				console.error('❌ [SERVER] Impossible de parser la réponse en JSON:', jsonErr);
				return fail(500, {
					form,
					error: "Erreur lors du parsing de la réponse d'export"
				});
			}

			return { form, success: true, result };
		} catch (err) {
			console.error("❌ [SERVER] Erreur lors de l'export:", err);
			return fail(500, {
				form,
				error: "Erreur lors de l'export des données"
			});
		}
	}
};
