import { error, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { z } from 'zod';
import { superValidate } from 'sveltekit-superforms/server';
import { zod } from 'sveltekit-superforms/adapters';
import { PrismaClient } from '@prisma/client';
import { protect } from '$lib/auth/protect';
import {
	getAllTables,
	getTableMetadata,
	countTableRows,
	type TableInfo as PrismaTableInfo,
	type FieldInfo
} from '$lib/prisma-meta';

const prisma = new PrismaClient();

// Types pour l'export
export interface ExportConfig {
	selectedTables: string[];
	format: 'xlsx' | 'csv' | 'xml';
	includeRelations: boolean;
	rowLimit?: number;
	filters: Record<string, unknown>;
	includeHeaders: boolean;
}

// Extension de TableInfo pour inclure les données d'export
export interface ExportTableInfo extends PrismaTableInfo {
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
	format: z.enum(['xlsx', 'csv', 'xml'], {
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

// Génération des informations d'export à partir des métadonnées Prisma
function generateExportTables(): ExportTableInfo[] {
	// Récupérer toutes les tables CENOV uniquement
	const tables = getAllTables('cenov');

	return tables.map((table) => {
		const metadata = getTableMetadata('cenov', table.name);

		const columns: ColumnInfo[] =
			metadata?.fields.map((field: FieldInfo) => ({
				name: field.name,
				type: mapPrismaTypeToString(field.type),
				required: field.isRequired,
				description: generateFieldDescription(field.name)
			})) || [];

		return {
			...table,
			columns,
			// Relations peuvent être ajoutées plus tard si nécessaire
			relations: []
		};
	});
}

// Helper functions
function mapPrismaTypeToString(prismaType: string): string {
	switch (prismaType) {
		case 'Int':
		case 'Float':
			return 'number';
		case 'String':
			return 'string';
		case 'DateTime':
			return 'datetime';
		case 'Boolean':
			return 'boolean';
		case 'Bytes':
			return 'binary';
		default:
			return 'string';
	}
}

function generateFieldDescription(fieldName: string): string {
	const descriptions: Record<string, string> = {
		// IDs principaux
		kit_id: 'ID du kit',
		par_id: 'ID de la pièce',
		atr_id: "ID de l'attribut",
		doc_id: 'ID du document',
		sup_id: 'ID du fournisseur',
		kat_id: 'ID de la relation kit-attribut',
		kik_id: 'ID de la relation kit-kit',
		kid_id: 'ID de la relation kit-document',

		// Labels
		kit_label: 'Nom du kit',
		par_label: 'Nom de la pièce',
		atr_label: "Label de l'attribut",
		doc_name: 'Nom du document',
		sup_label: 'Nom du fournisseur',

		// Autres champs courants
		atr_nat: "Nature de l'attribut",
		atr_val: "Valeur de l'attribut",
		sup_code: 'Code fournisseur',
		created_at: 'Date de création',
		updated_at: 'Date de mise à jour',
		kat_valeur: 'Valeur numérique',
		kik_qty: 'Quantité',
		kik_index: 'Index',
		doc_extension: 'Extension du fichier',
		doc_type: 'Type de document',
		kid_description: 'Description',

		// Clés étrangères
		fk_kit: 'Kit lié',
		fk_attribute: 'Attribut lié',
		fk_attribute_carac: 'Attribut caractéristique',
		fk_document: 'Document lié',
		fk_kit_parent: 'Kit parent',
		fk_kit_child: 'Kit enfant'
	};

	return descriptions[fieldName] || fieldName;
}

// Obtenir les informations sur les tables avec le compte de lignes
async function getTablesInfo(): Promise<ExportTableInfo[]> {
	const availableTables = generateExportTables();

	const tablesWithCounts = await Promise.all(
		availableTables.map(async (table) => {
			try {
				const count = await countTableRows('cenov', table.name);
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
			totalRows: tables.reduce((sum, table) => sum + (table.rowCount || 0), 0)
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
			const { selectedTables } = form.data;
			const previewData: Record<string, unknown[]> = {};

			// Récupérer un aperçu des données pour chaque table sélectionnée
			for (const tableName of selectedTables) {
				const limit = 5; // Exactement 5 lignes pour l'aperçu

				try {
					// Utiliser l'accès dynamique aux modèles Prisma
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					const model = (prisma as Record<string, any>)[tableName];
					if (!model) {
						console.warn(`Model ${tableName} non trouvé`);
						continue;
					}

					// Déterminer la colonne pour l'ordre (clé primaire)
					const metadata = getTableMetadata('cenov', tableName);
					const primaryKey = metadata?.primaryKey;
					const orderBy = primaryKey ? { [primaryKey]: 'asc' } : {};

					// Récupérer les données avec l'ordre approprié
					const data = await model.findMany({
						take: limit,
						...(Object.keys(orderBy).length > 0 && { orderBy })
					});

					previewData[tableName] = data;
				} catch (modelErr) {
					console.warn(`Erreur lors de la récupération des données pour ${tableName}:`, modelErr);
					previewData[tableName] = [];
				}
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

			// Si c'est un fichier binaire, on devrait gérer le téléchargement différemment
			if (
				contentType &&
				(contentType.includes('application/vnd.openxml') ||
					contentType.includes('text/csv') ||
					contentType.includes('application/xml'))
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
