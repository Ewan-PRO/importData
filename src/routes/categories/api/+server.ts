// src/routes/api/categories/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const GET: RequestHandler = async () => {
	try {
		const categories = await prisma.v_categories_dev.findMany();
		return json(categories);
	} catch (error) {
		console.error('Erreur lors de la récupération des catégories:', error);
		return json({ error: 'Erreur lors de la récupération des catégories' }, { status: 500 });
	}
};

export const POST: RequestHandler = async ({ request }) => {
	try {
		console.log('🚀 Début de la création des catégories');
		const data = await request.json();
		console.log('📥 Données reçues:', data);

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

		console.log('🔍 Vérification des doublons avec la condition:', whereClause);

		const existingHierarchy = await prisma.v_categories_dev.findFirst({
			where: whereClause
		});

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

			console.log(`🔍 Niveau ${i + 1}:`, { label, parentNat });

			// Vérifier si un attribut avec ce label existe déjà pour ce parent
			const existingAttr = await prisma.attribute_dev.findFirst({
				where: {
					atr_nat: parentNat,
					atr_label: label
				}
			});

			let currentAttr;

			if (existingAttr) {
				console.log(`📋 Attribut existant trouvé:`, existingAttr);
				currentAttr = existingAttr;
			} else {
				console.log(`✨ Création d'un nouvel attribut avec atr_val = atr_label:`, label);

				// Créer le nouvel attribut avec atr_val = atr_label
				currentAttr = await prisma.attribute_dev.create({
					data: {
						atr_nat: parentNat,
						atr_val: label, // atr_val = atr_label
						atr_label: label
					}
				});

				console.log(`✅ Nouvel attribut créé:`, currentAttr);
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
