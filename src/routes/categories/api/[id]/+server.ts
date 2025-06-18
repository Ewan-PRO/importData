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

/**
 * Crée une nouvelle hiérarchie de catégories en réutilisant les branches existantes
 * @param hierarchy - Tableau des labels de la hiérarchie [niveau1, niveau2, ..., niveauN]
 */
async function createHierarchyBranch(hierarchy: string[]): Promise<void> {
	if (hierarchy.length === 0) {
		console.log(`⚠️ Hiérarchie vide, rien à créer`);
		return;
	}

	let currentParentNat = 'CATEGORIE';

	for (let i = 0; i < hierarchy.length; i++) {
		const label = hierarchy[i];

		// Vérifier si ce niveau existe déjà
		const existingCategory = await prisma.attribute_dev.findFirst({
			where: {
				atr_nat: currentParentNat,
				atr_val: label
			}
		});

		if (existingCategory) {
			console.log(`♻️ Réutilisation du niveau existant ${i + 1}: "${label}"`);
			currentParentNat = label; // Utiliser pour le niveau suivant
		} else {
			// Créer le nouveau niveau
			const newCategory = await prisma.attribute_dev.create({
				data: {
					atr_nat: currentParentNat,
					atr_label: label,
					atr_val: label
				}
			});
			console.log(`🌱 Création du niveau ${i + 1}: "${label}" (ID: ${newCategory.atr_id})`);
			currentParentNat = label;
		}
	}

	console.log(`✅ Hiérarchie créée avec succès: ${hierarchy.join(' → ')}`);
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

		// Validation stricte - les niveaux doivent être consécutifs
		let lastFilledLevel = 0;
		for (let i = 1; i <= 7; i++) {
			const labelKey = `atr_${i}_label`;
			const labelValue = formData[labelKey];
			const hasValue = labelValue && typeof labelValue === 'string' && labelValue.trim() !== '';

			if (hasValue) {
				if (i !== lastFilledLevel + 1) {
					console.log(`❌ Saut de niveau détecté: niveau ${lastFilledLevel} → niveau ${i}`);
					return json(
						{
							error: `Saut de niveau interdit. Le niveau ${i} ne peut pas être rempli si le niveau ${i - 1} est vide.`
						},
						{ status: 400 }
					);
				}
				lastFilledLevel = i;
			}
		}

		if (lastFilledLevel === 0) {
			return json({ error: 'Au moins un niveau doit être rempli.' }, { status: 400 });
		}

		// Obtenir la hiérarchie actuelle depuis la vue pour modification ciblée
		const currentHierarchy = [
			categoryFromView.atr_1_label,
			categoryFromView.atr_2_label,
			categoryFromView.atr_3_label,
			categoryFromView.atr_4_label,
			categoryFromView.atr_5_label,
			categoryFromView.atr_6_label,
			categoryFromView.atr_7_label
		].filter((label) => label && label.trim() !== '' && label !== '""""');

		console.log(`📊 Hiérarchie actuelle:`, currentHierarchy);

		// Construire la nouvelle hiérarchie demandée
		const newHierarchy: string[] = [];
		for (let i = 1; i <= 7; i++) {
			const labelKey = `atr_${i}_label`;
			const labelValue = formData[labelKey];
			const label = typeof labelValue === 'string' ? labelValue?.trim() : null;

			if (label && label !== '' && label !== '""""') {
				newHierarchy.push(label);
			} else {
				break; // Arrêt à la première valeur vide
			}
		}

		console.log(`🎯 Nouvelle hiérarchie demandée:`, newHierarchy);

		// Vérifier si la hiérarchie a changé
		const hierarchyChanged = JSON.stringify(currentHierarchy) !== JSON.stringify(newHierarchy);

		if (!hierarchyChanged) {
			console.log(`✅ Aucun changement détecté dans la hiérarchie`);
			return json({ success: true, message: 'Aucune modification nécessaire' });
		}

		// Supprimer l'ancienne branche terminale spécifique
		if (!categoryFromView.atr_id) {
			return json({ error: 'ID de catégorie manquant pour modification' }, { status: 404 });
		}
		console.log(`🗑️ Suppression de l'ancienne branche terminale (ID: ${categoryFromView.atr_id})`);
		await deleteTerminalAndCleanup(categoryFromView.atr_id);

		// Créer la nouvelle hiérarchie complète
		console.log(`🏗️ Création de la nouvelle hiérarchie`);
		await createHierarchyBranch(newHierarchy);

		return json({ success: true });
	} catch (error) {
		console.error('❌ Erreur lors de la mise à jour :', error);
		const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
		return json({ error: `Erreur interne: ${errorMessage}` }, { status: 500 });
	}
};

/**
 * Supprime un niveau terminal et nettoie récursivement les parents orphelins
 * @param terminalId - L'ID du niveau terminal à supprimer
 * @returns Un tableau des IDs supprimés
 */
async function deleteTerminalAndCleanup(terminalId: number): Promise<number[]> {
	const deletedIds: number[] = [];

	// Récupérer la catégorie terminale
	const terminalCategory = await prisma.attribute_dev.findUnique({
		where: { atr_id: terminalId },
		select: { atr_id: true, atr_nat: true, atr_val: true, atr_label: true }
	});

	if (!terminalCategory) {
		console.log(`❌ Catégorie terminale non trouvée: ID ${terminalId}`);
		return deletedIds;
	}

	console.log(`🎯 Suppression de la catégorie terminale:`, terminalCategory);

	// Supprimer d'abord tous les descendants (au cas où)
	const descendants = await getDescendantsRecursive(terminalId);
	if (descendants.length > 0) {
		await prisma.attribute_dev.deleteMany({
			where: { atr_id: { in: descendants } }
		});
		deletedIds.push(...descendants);
		console.log(`🗑️ ${descendants.length} descendant(s) supprimé(s)`);
	}

	// Supprimer la catégorie terminale elle-même
	await prisma.attribute_dev.delete({ where: { atr_id: terminalId } });
	deletedIds.push(terminalId);
	console.log(`🗑️ Catégorie terminale supprimée: ${terminalCategory.atr_label}`);

	// Nettoyer récursivement les parents qui deviennent orphelins
	if (terminalCategory.atr_nat && terminalCategory.atr_nat !== 'CATEGORIE') {
		await cleanupOrphanParents(terminalCategory.atr_nat, deletedIds);
	}

	return deletedIds;
}

/**
 * Récupère récursivement tous les descendants d'une catégorie
 */
async function getDescendantsRecursive(categoryId: number): Promise<number[]> {
	const descendants: number[] = [];

	const category = await prisma.attribute_dev.findUnique({
		where: { atr_id: categoryId },
		select: { atr_val: true }
	});

	if (category?.atr_val) {
		const children = await prisma.attribute_dev.findMany({
			where: { atr_nat: category.atr_val },
			select: { atr_id: true }
		});

		for (const child of children) {
			descendants.push(child.atr_id);
			const grandChildren = await getDescendantsRecursive(child.atr_id);
			descendants.push(...grandChildren);
		}
	}

	return descendants;
}

/**
 * Nettoie les parents orphelins récursivement
 */
async function cleanupOrphanParents(parentNat: string, deletedIds: number[]): Promise<void> {
	// Trouver le parent par atr_val = parentNat
	const parent = await prisma.attribute_dev.findFirst({
		where: { atr_val: parentNat },
		select: { atr_id: true, atr_nat: true, atr_val: true, atr_label: true }
	});

	if (!parent) {
		console.log(`👻 Parent non trouvé pour atr_nat: ${parentNat}`);
		return;
	}

	// Vérifier si ce parent a encore des enfants
	const remainingChildren = await prisma.attribute_dev.findMany({
		where: {
			atr_nat: parent.atr_val,
			atr_id: { notIn: deletedIds }
		},
		select: { atr_id: true }
	});

	if (remainingChildren.length === 0) {
		// Le parent n'a plus d'enfants, on peut le supprimer
		console.log(`🧹 Nettoyage du parent orphelin: ${parent.atr_label}`);

		await prisma.attribute_dev.delete({ where: { atr_id: parent.atr_id } });
		deletedIds.push(parent.atr_id);

		// Remonter récursivement si ce n'est pas la racine
		if (parent.atr_nat && parent.atr_nat !== 'CATEGORIE') {
			await cleanupOrphanParents(parent.atr_nat, deletedIds);
		}
	} else {
		console.log(
			`👥 Parent conservé (${remainingChildren.length} enfant(s) restant(s)): ${parent.atr_label}`
		);
	}
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

		// 3. La vue pointe vers le dernier niveau rempli - on supprime SEULEMENT ce niveau terminal
		const terminalCategoryId = categoryFromView.atr_id;
		console.log(`🎯 Suppression du niveau terminal: ID ${terminalCategoryId}`);

		// 4. Supprimer le niveau terminal et nettoyer les orphelins remontants
		const allIdsToDelete = await deleteTerminalAndCleanup(terminalCategoryId);

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
