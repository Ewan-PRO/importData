// src/routes/api/categories/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import {
	prisma,
	getCategories,
	findCategoryInView,
	findAttribute,
	createAttribute
} from '$lib/server/db';

export const GET: RequestHandler = async ({ url }) => {
	try {
		// Test de connexion à la base de données
		await prisma.$connect();
		const sortOrder = (url.searchParams.get('sortOrder') || 'asc') as 'asc' | 'desc';
		const categories = await getCategories(sortOrder);
		return json(categories);
	} catch (error) {
		console.error('❌ [API-CATEGORIES] Erreur lors de la récupération des catégories:', error);
		console.error('❌ [API-CATEGORIES] Stack trace:', error instanceof Error ? error.stack : 'N/A');
		console.error("❌ [API-CATEGORIES] Type d'erreur:", error?.constructor?.name || 'Inconnu');

		return json(
			{
				error: 'Erreur lors de la récupération des catégories',
				details: error instanceof Error ? error.message : 'Erreur inconnue'
			},
			{ status: 500 }
		);
	} finally {
		try {
			await prisma.$disconnect();
		} catch (disconnectError) {
			console.error('⚠️ [API-CATEGORIES] Erreur lors de la déconnexion:', disconnectError);
		}
	}
};

export const POST: RequestHandler = async ({ request }) => {
	try {
		const data = await request.json();

		// Construire le chemin complet de la hiérarchie
		const levels = [];
		for (let i = 1; i <= 7; i++) {
			const label = data[`atr_${i}_label`];
			if (!label || label.trim() === '') {
				break;
			}
			levels.push(label.trim());
		}

		// Validation 1: Au moins un niveau doit être rempli
		if (levels.length === 0) {
			return json(
				{
					success: false,
					error: 'Au moins un niveau entre atr_1_label et atr_7_label doit être rempli'
				},
				{ status: 400 }
			);
		}

		// Validation 2: Vérifier que les niveaux sont consécutifs
		const allLevels = [];
		for (let i = 1; i <= 7; i++) {
			const label = data[`atr_${i}_label`];
			allLevels.push(label || '');
		}

		// Trouver le premier niveau vide
		const firstEmptyIndex = allLevels.findIndex((level) => !level || level.trim() === '');

		if (firstEmptyIndex !== -1) {
			// Vérifier que tous les niveaux après le premier vide sont aussi vides
			const subsequentLevels = allLevels.slice(firstEmptyIndex + 1);
			const hasNonEmptyAfterEmpty = subsequentLevels.some((level) => level && level.trim() !== '');

			if (hasNonEmptyAfterEmpty) {
				return json(
					{
						success: false,
						error:
							'Les niveaux de catégorie doivent être consécutifs. Vous ne pouvez pas laisser de vide.'
					},
					{ status: 400 }
				);
			}
		}

		// Validation 3: Vérifier la longueur des labels
		for (const label of levels) {
			if (label.length > 255) {
				return json(
					{
						success: false,
						error: 'Le label ne peut pas dépasser 255 caractères'
					},
					{ status: 400 }
				);
			}
		}

		// Validation 4: Vérifier si cette hiérarchie complète existe déjà dans la vue
		const whereClause: Record<string, string | null> = {
			atr_0_label: 'Catégorie des produits'
		};

		// Ajouter chaque niveau à la condition de recherche
		for (let i = 0; i < levels.length; i++) {
			whereClause[`atr_${i + 1}_label`] = levels[i];
		}

		// Ajouter les niveaux vides pour une correspondance exacte
		for (let i = levels.length + 1; i <= 7; i++) {
			whereClause[`atr_${i}_label`] = null;
		}

		const existingHierarchy = await findCategoryInView(whereClause);

		if (existingHierarchy) {
			const fullPath = levels.join(' -> ');
			return json(
				{
					success: false,
					error: `Cette hiérarchie de catégories existe déjà : ${fullPath}`
				},
				{ status: 409 }
			);
		}

		const attributeEntries = [];
		let parentNat = 'CATEGORIE';

		// Créer chaque niveau de la hiérarchie
		for (let i = 0; i < levels.length; i++) {
			const label = levels[i];

			// Vérifier si un attribut avec ce label existe déjà pour ce parent
			const existingAttr = await findAttribute({
				atr_nat: parentNat,
				atr_label: label
			});

			let currentAttr;

			if (existingAttr) {
				currentAttr = existingAttr;
			} else {
				// Créer le nouvel attribut avec atr_val = atr_label
				currentAttr = await createAttribute({
					atr_nat: parentNat,
					atr_val: label, // atr_val = atr_label
					atr_label: label
				});
			}

			attributeEntries.push(currentAttr);
			// Le atr_val de ce niveau devient le atr_nat du niveau suivant
			parentNat = currentAttr.atr_val ?? '';
		}

		const fullPath = levels.join(' -> ');
		return json({
			success: true,
			attributes: attributeEntries,
			path: fullPath,
			message: `Hiérarchie créée/mise à jour: ${fullPath}`
		});
	} catch (error) {
		console.error('Erreur lors de la création des attributs :', error);
		return json(
			{
				success: false,
				error: 'Erreur lors de la création des attributs'
			},
			{ status: 500 }
		);
	}
};
