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

/**
 * Trouve l'ID de la catégorie racine (niveau 1) à partir de n'importe quel niveau
 */
async function findRootCategoryId(atrId: number): Promise<number | null> {
	const category = await prisma.attribute_dev.findUnique({
		where: { atr_id: atrId },
		select: { atr_id: true, atr_nat: true, atr_val: true, atr_label: true }
	});

	if (!category) return null;

	console.log(`🔍 Analyse catégorie ID ${atrId}:`, category);

	// Si atr_nat est 'CATEGORIE', c'est déjà la racine
	if (category.atr_nat === 'CATEGORIE') {
		console.log(`🌳 Catégorie racine trouvée: ID ${atrId}`);
		return atrId;
	}

	// Sinon, chercher la catégorie parent via atr_nat
	const parent = await prisma.attribute_dev.findFirst({
		where: { atr_val: category.atr_nat },
		select: { atr_id: true }
	});

	if (parent) {
		console.log(`⬆️ Parent trouvé, remontée récursive...`);
		return findRootCategoryId(parent.atr_id);
	}

	// Si pas de parent, cette catégorie est peut-être orpheline
	console.log(`⚠️ Catégorie orpheline détectée: ID ${atrId}`);
	return atrId;
}

export const DELETE: RequestHandler = async ({ params }) => {
	const { id } = params;

	if (!id) {
		return json({ error: 'ID manquant' }, { status: 400 });
	}

	try {
		console.log('=== Début DELETE /api/categories/[id] ===');
		const categoryId = parseInt(id, 10);
		if (isNaN(categoryId)) {
			return json({ error: 'ID invalide' }, { status: 400 });
		}

		console.log(`🎯 Suppression demandée pour row_key: ${categoryId}`);

		// 1. Récupérer la ligne complète depuis la vue
		const categoryFromView = await prisma.v_categories_dev.findFirst({
			where: { row_key: categoryId }
		});

		if (!categoryFromView) {
			console.log(`❌ Aucune ligne trouvée avec row_key: ${categoryId}`);
			return json({ error: 'Catégorie non trouvée' }, { status: 404 });
		}

		console.log(`📊 Ligne trouvée dans la vue:`, categoryFromView);

		// 2. Vérifier que atr_id existe dans la vue
		if (!categoryFromView.atr_id) {
			console.log(`❌ atr_id manquant dans la vue`);
			return json({ error: 'ID de catégorie manquant' }, { status: 404 });
		}

		// 3. L'atr_id dans la vue pointe vers le dernier niveau rempli
		// On doit remonter à la racine pour supprimer toute la hiérarchie
		const rootCategoryId = await findRootCategoryId(categoryFromView.atr_id);

		if (!rootCategoryId) {
			console.log(`❌ Impossible de trouver la catégorie racine`);
			return json({ error: 'Catégorie racine non trouvée' }, { status: 404 });
		}

		console.log(`🌳 Catégorie racine identifiée: ID ${rootCategoryId}`);

		// 3. Récupérer tous les IDs de la hiérarchie complète depuis la racine
		const allIdsToDelete = await getDescendantIds(rootCategoryId);

		console.log(`📝 IDs à supprimer:`, allIdsToDelete);

		if (allIdsToDelete.length === 0) {
			return json({ error: 'Aucune catégorie à supprimer' }, { status: 404 });
		}

		// 4. Supprimer toutes les catégories en une seule transaction
		const deleteResult = await prisma.attribute_dev.deleteMany({
			where: {
				atr_id: {
					in: allIdsToDelete
				}
			}
		});

		console.log(`🗑️ ${deleteResult.count} catégorie(s) supprimée(s) avec succès.`);
		console.log('=== Fin DELETE /api/categories/[id] ===');

		return new Response(null, { status: 204 });
	} catch (error) {
		console.error('❌ Erreur lors de la suppression de la catégorie :', error);
		const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
		return json({ error: `Erreur interne: ${errorMessage}` }, { status: 500 });
	}
};
