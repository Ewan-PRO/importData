// src/routes/api/categories/[id]/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface CategoryData {
	forceUpdate?: boolean; // Pour forcer les modifications avec confirmation
	atr_label?: string | null;
	atr_val?: string | null;
	[key: string]: string | null | undefined | boolean;
}

interface Category {
	atr_id: number;
	atr_nat: string | null;
	atr_val: string | null;
	atr_label: string | null;
}

async function getCategoryLevel(category: Category): Promise<number> {
	if (category.atr_nat === 'CATEGORIE') {
		return 1;
	}
	if (category.atr_nat?.startsWith('CATEGORIE_')) {
		return 2;
	}
	if (category.atr_nat?.includes('_')) {
		return category.atr_nat?.split('_').length || 0;
	}
	return 0;
}

async function deleteSubsequentLevels(parentNat: string | null): Promise<void> {
	if (!parentNat) return;

	const children = await prisma.attribute_dev.findMany({
		where: { atr_nat: parentNat }
	});

	for (const child of children) {
		await deleteSubsequentLevels(child.atr_val);
		await prisma.attribute_dev.delete({ where: { atr_id: child.atr_id } });
		console.log(`🗑️ Niveau orphelin ${child.atr_label} supprimé.`);
	}
}

export const PUT: RequestHandler = async ({ params, request }) => {
	try {
		console.log('=== Début PUT /api/categories/[id] ===');
		const { id } = params;
		const formData = (await request.json()) as CategoryData;

		const categoryId = parseInt(id);

		// Trouver la catégorie dans la vue pour comprendre sa structure
		const categoryFromView = await prisma.v_categories_dev.findFirst({
			where: { atr_id: categoryId }
		});

		if (!categoryFromView) {
			return json({ error: 'Catégorie non trouvée' }, { status: 404 });
		}

		console.log('Catégorie trouvée dans la vue:', categoryFromView);

		// Validation séquentielle
		const levels = Object.keys(formData)
			.filter((k) => k.startsWith('atr_') && k.endsWith('_label'))
			.sort();

		for (let i = 1; i < levels.length; i++) {
			const prevLevel = formData[levels[i - 1]];
			const currentLevel = formData[levels[i]];
			if (!prevLevel && currentLevel) {
				return json(
					{ error: `Le niveau ${i + 1} ne peut pas être rempli si le niveau ${i} est vide.` },
					{ status: 400 }
				);
			}
		}

		// Récupérer la catégorie principale (celle avec l'ID fourni)
		const mainCategory = await prisma.attribute_dev.findUnique({
			where: { atr_id: categoryId }
		});

		if (!mainCategory) {
			return json({ error: 'Catégorie principale non trouvée' }, { status: 404 });
		}

		// Déterminer le niveau de la catégorie principale
		const mainLevel = await getCategoryLevel(mainCategory);
		console.log(`Catégorie principale niveau ${mainLevel}:`, mainCategory);

		// Mettre à jour le label de la catégorie principale si nécessaire
		const mainLabelKey = `atr_${mainLevel}_label`;
		const mainLabelValue = formData[mainLabelKey];

		if (mainLabelValue !== undefined && mainCategory.atr_label !== mainLabelValue) {
			const newLabel = typeof mainLabelValue === 'string' ? mainLabelValue : null;
			await prisma.attribute_dev.update({
				where: { atr_id: categoryId },
				data: {
					atr_label: newLabel === '' ? null : newLabel,
					atr_val: newLabel === '' ? null : newLabel // atr_val = atr_label
				}
			});
			console.log(`🏷️ Label de la catégorie principale mis à jour: ${newLabel}`);
		}

		// Traitement des niveaux suivants
		let currentParentVal = mainCategory.atr_val;

		for (let i = mainLevel + 1; i <= 7; i++) {
			const labelKey = `atr_${i}_label`;
			const labelValue = formData[labelKey];
			const label = typeof labelValue === 'string' ? labelValue : null;

			// Chercher l'enfant existant
			const childCategory = await prisma.attribute_dev.findFirst({
				where: { atr_nat: currentParentVal }
			});

			if (label && label.trim() !== '') {
				// Si un label est fourni
				if (childCategory) {
					// L'enfant existe -> on le met à jour
					await prisma.attribute_dev.update({
						where: { atr_id: childCategory.atr_id },
						data: {
							atr_label: label,
							atr_val: label // atr_val = atr_label
						}
					});
					console.log(`✍️ Niveau ${i} mis à jour avec le label: ${label}`);
					currentParentVal = label; // Utiliser le nouveau label comme parent
				} else {
					// L'enfant n'existe pas -> on le crée
					await prisma.attribute_dev.create({
						data: {
							atr_nat: currentParentVal,
							atr_label: label,
							atr_val: label // atr_val = atr_label
						}
					});
					console.log(`✨ Niveau ${i} créé avec le label: "${label}"`);
					currentParentVal = label; // Utiliser le nouveau label comme parent
				}
			} else {
				// Si le label est vide ou manquant, on supprime ce niveau et les suivants
				if (childCategory) {
					console.log(`🗑️ Début de la suppression à partir du niveau ${i}`);
					await deleteSubsequentLevels(childCategory.atr_val);
					await prisma.attribute_dev.delete({ where: { atr_id: childCategory.atr_id } });
				}
				break; // Arrête la boucle car la suite de la chaîne est rompue
			}
		}

		return json({ success: true });
	} catch (error) {
		console.error('❌ Erreur lors de la mise à jour :', error);
		const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
		return json({ error: `Erreur interne: ${errorMessage}` }, { status: 500 });
	}
};

/**
 * Collecte de manière récursive les IDs de toutes les catégories descendantes.
 * @param startCategoryId - L'ID de la catégorie de départ.
 * @returns Un tableau des IDs à supprimer.
 */
async function getDescendantIds(startCategoryId: number): Promise<number[]> {
	const idsToDelete = new Set<number>();
	const queue: number[] = [startCategoryId];
	const visitedIds = new Set<number>();

	while (queue.length > 0) {
		const currentId = queue.shift()!;
		if (visitedIds.has(currentId)) {
			continue;
		}

		visitedIds.add(currentId);
		idsToDelete.add(currentId);

		const category = await prisma.attribute_dev.findUnique({
			where: { atr_id: currentId },
			select: { atr_val: true }
		});

		if (category?.atr_val) {
			const children = await prisma.attribute_dev.findMany({
				where: { atr_nat: category.atr_val },
				select: { atr_id: true }
			});

			for (const child of children) {
				if (!visitedIds.has(child.atr_id)) {
					queue.push(child.atr_id);
				}
			}
		}
	}

	return Array.from(idsToDelete);
}

export const DELETE: RequestHandler = async ({ params }) => {
	const { id } = params;

	if (!id) {
		return json({ error: 'ID manquant' }, { status: 400 });
	}

	try {
		const categoryId = parseInt(id, 10);
		if (isNaN(categoryId)) {
			return json({ error: 'ID invalide' }, { status: 400 });
		}

		// 1. Récupérer l'ID de la catégorie à partir de la vue, car c'est celui que le front-end utilise.
		const categoryFromView = await prisma.v_categories_dev.findFirst({
			where: {
				row_key: categoryId // On suppose que le `id` du front-end est `row_key`
			}
		});

		if (!categoryFromView || !categoryFromView.atr_id) {
			// Si `row_key` ne fonctionne pas, essayons avec `atr_id` comme fallback
			const realCategory = await prisma.attribute_dev.findUnique({
				where: { atr_id: categoryId }
			});
			if (!realCategory) {
				return json({ error: 'Catégorie non trouvée' }, { status: 404 });
			}
		}

		const realAtrId = categoryFromView?.atr_id ?? categoryId;

		// 2. Récupérer tous les IDs (celui de départ + tous ses descendants)
		const allIdsToDelete = await getDescendantIds(realAtrId);

		if (allIdsToDelete.length === 0) {
			// Cela ne devrait pas arriver si on trouve une catégorie, mais c'est une sécurité
			return json({ error: 'Catégorie non trouvée ou sans ID' }, { status: 404 });
		}

		// 3. Supprimer toutes les catégories en une seule transaction
		await prisma.attribute_dev.deleteMany({
			where: {
				atr_id: {
					in: allIdsToDelete
				}
			}
		});

		console.log(`🗑️ ${allIdsToDelete.length} catégorie(s) supprimée(s).`);

		return new Response(null, { status: 204 });
	} catch (error) {
		console.error('❌ Erreur lors de la suppression de la catégorie :', error);
		const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
		return json({ error: `Erreur interne: ${errorMessage}` }, { status: 500 });
	}
};
