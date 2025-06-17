// src/routes/api/categories/[id]/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Seuils de protection
const PROTECTION_THRESHOLDS = {
	DIRECT_ALLOW: 3, // ≤ 3 enfants : autoriser
	REQUIRE_CONFIRM: 20, // 4-20 enfants : demander confirmation
	BLOCK_OPERATION: 20 // 20+ enfants : bloquer
};

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

async function countAffectedCategories(category: Category): Promise<{
	count: number;
	samples: string[];
}> {
	// Compter toutes les sous-catégories qui seraient affectées
	const affectedCategories = await prisma.attribute_dev.findMany({
		where: {
			OR: [{ atr_nat: category.atr_val }, { atr_nat: { startsWith: `${category.atr_val}_` } }]
		},
		select: {
			atr_label: true,
			atr_nat: true
		},
		take: 10 // Limiter pour les exemples
	});

	const totalCount = await prisma.attribute_dev.count({
		where: {
			OR: [{ atr_nat: category.atr_val }, { atr_nat: { startsWith: `${category.atr_val}_` } }]
		}
	});

	const samples = affectedCategories
		.map((cat) => cat.atr_label)
		.filter((label) => label !== null)
		.slice(0, 4) as string[];

	return { count: totalCount, samples };
}

async function updateMainCategory(
	categoryId: number,
	data: CategoryData,
	level: number
): Promise<void> {
	const updateData: Record<string, string | null> = {};
	const labelField = `atr_${level}_label`;
	const fieldValue = data[labelField];

	if (fieldValue !== undefined && typeof fieldValue !== 'boolean') {
		updateData.atr_label = fieldValue;
		await prisma.attribute_dev.update({
			where: { atr_id: categoryId },
			data: updateData
		});
		console.log('Catégorie principale mise à jour');
	}
}

async function updateSubCategory(
	currentNat: string,
	level: number,
	data: CategoryData
): Promise<string> {
	const nextLevelField = `atr_${level}_label`;
	const fieldValue = data[nextLevelField];

	if (fieldValue === undefined || typeof fieldValue === 'boolean') {
		return currentNat;
	}

	const childCategory = await prisma.attribute_dev.findFirst({
		where: { atr_nat: currentNat }
	});

	if (childCategory) {
		await prisma.attribute_dev.update({
			where: { atr_id: childCategory.atr_id },
			data: { atr_label: fieldValue }
		});

		if (fieldValue !== null) {
			console.log(`Sous-catégorie de niveau ${level} mise à jour`);
			return childCategory.atr_val ?? '';
		}
	} else if (fieldValue !== null) {
		const newValue = `${currentNat}_${fieldValue.toLowerCase().replace(/\s+/g, '_')}`;
		await prisma.attribute_dev.create({
			data: {
				atr_nat: currentNat,
				atr_val: newValue,
				atr_label: fieldValue
			}
		});
		console.log(`Nouvelle sous-catégorie de niveau ${level} créée`);
		return newValue;
	}

	return currentNat;
}

export const PUT: RequestHandler = async ({ params, request }) => {
	try {
		console.log('=== Début PUT /api/categories/[id] ===');
		const { id } = params;
		const data = (await request.json()) as CategoryData;
		console.log('Données reçues:', data);

		if (!id || isNaN(parseInt(id))) {
			return json({ error: 'ID de catégorie invalide' }, { status: 400 });
		}

		const categoryId = parseInt(id);
		const category = await prisma.attribute_dev.findUnique({
			where: { atr_id: categoryId }
		});

		if (!category) {
			return json({ error: 'Catégorie non trouvée' }, { status: 404 });
		}

		// Vérifier l'impact de la modification
		const { count: affectedCount, samples } = await countAffectedCategories(category);
		console.log(`Modification affecterait ${affectedCount} sous-catégories`);

		// Protection contre les modifications trop fortes
		if (affectedCount > PROTECTION_THRESHOLDS.BLOCK_OPERATION) {
			return json(
				{
					error: `Modification trop forte : cette modification affecterait ${affectedCount}+ sous-catégories`,
					affectedCount,
					currentValue: category.atr_label,
					newValue: data.atr_label,
					impactedBranches: samples
				},
				{ status: 409 }
			);
		}

		// Demander confirmation pour impact moyen
		if (affectedCount > PROTECTION_THRESHOLDS.DIRECT_ALLOW && !data.forceUpdate) {
			return json(
				{
					requiresConfirmation: true,
					message: `Cette modification affectera ${affectedCount} sous-catégories. Confirmez-vous ?`,
					affectedCount,
					previewChanges: samples
				},
				{ status: 202 }
			);
		}

		const level = await getCategoryLevel(category);
		console.log(`Cette catégorie est de niveau ${level}`);

		// Convertir les chaînes vides en null pour tous les champs
		Object.keys(data).forEach((key) => {
			if (data[key] === '' || data[key] === undefined) {
				data[key] = null;
			}
		});

		await updateMainCategory(categoryId, data, level);

		let currentNat = category.atr_val ?? '';
		for (let i = level + 1; i <= 7; i++) {
			const nextNat = await updateSubCategory(currentNat, i, data);
			if (nextNat === currentNat) {
				break;
			}
			currentNat = nextNat;
		}

		const responseData: {
			success: boolean;
			updatedWithConfirmation?: boolean;
			affectedCount?: number;
		} = { success: true };

		if (data.forceUpdate) {
			responseData.updatedWithConfirmation = true;
		}
		if (affectedCount > 0) {
			responseData.affectedCount = affectedCount;
		}

		return json(responseData, { status: 200 });
	} catch (error) {
		console.error('Erreur lors de la mise à jour de la catégorie:', error);
		return json({ error: 'Erreur lors de la mise à jour de la catégorie' }, { status: 500 });
	}
};

export const DELETE: RequestHandler = async ({ params }) => {
	try {
		console.log('=== Début DELETE /api/categories/[id] ===');
		const { id } = params;
		console.log('ID reçu:', id);
		const categoryId = parseInt(id);
		console.log('ID converti en nombre:', categoryId);

		// Récupérer la catégorie à supprimer
		const category = await prisma.attribute_dev.findUnique({
			where: {
				atr_id: categoryId
			}
		});
		console.log('Catégorie trouvée:', category);

		if (!category) {
			console.log('Catégorie non trouvée');
			return json({ error: 'Catégorie non trouvée' }, { status: 404 });
		}

		// Vérifier si l'attribut est utilisé dans kit_attribute
		const usageCount = await prisma.kit_attribute.count({
			where: {
				OR: [{ fk_attribute: categoryId }, { fk_attribute_carac: categoryId }]
			}
		});
		console.log("Nombre d'utilisations trouvées:", usageCount);

		if (usageCount > 0) {
			console.log('Catégorie utilisée dans des kits, suppression impossible');
			return json(
				{ error: 'Impossible de supprimer cette catégorie car elle est utilisée dans des kits' },
				{ status: 400 }
			);
		}

		// Vérifier l'impact de la suppression
		const { count: affectedCount, samples } = await countAffectedCategories(category);
		console.log(`Suppression affecterait ${affectedCount} sous-catégories`);

		// Protection contre les suppressions trop fortes
		if (affectedCount > PROTECTION_THRESHOLDS.BLOCK_OPERATION) {
			return json(
				{
					error: `Impossible de supprimer cette catégorie : elle contient ${affectedCount}+ sous-catégories`,
					affectedCount,
					affectedCategories: samples
				},
				{ status: 409 }
			);
		}

		// Supprimer toutes les sous-catégories
		console.log('Suppression des sous-catégories...');
		const deleteResult = await prisma.attribute_dev.deleteMany({
			where: {
				OR: [{ atr_nat: category.atr_val }, { atr_nat: { startsWith: `${category.atr_val}_` } }]
			}
		});
		console.log('Résultat de la suppression des sous-catégories:', deleteResult);

		// Supprimer la catégorie elle-même
		console.log('Suppression de la catégorie principale...');
		const mainDeleteResult = await prisma.attribute_dev.delete({
			where: {
				atr_id: categoryId
			}
		});
		console.log('Résultat de la suppression de la catégorie principale:', mainDeleteResult);

		console.log('=== Fin DELETE /api/categories/[id] ===');
		return json({
			success: true,
			message:
				affectedCount === 0
					? 'Catégorie supprimée avec succès'
					: `Catégorie et ${affectedCount} sous-catégories supprimées`,
			deletedCategory: category.atr_label,
			affectedCount
		});
	} catch (error) {
		console.error('Erreur lors de la suppression de la catégorie:', error);
		return json({ error: 'Erreur lors de la suppression de la catégorie' }, { status: 500 });
	}
};
