// src/routes/api/categories/[id]/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface CategoryData {
	[key: string]: string | null | undefined;
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

async function updateMainCategory(
	categoryId: number,
	data: CategoryData,
	level: number
): Promise<void> {
	const updateData: Record<string, string | null> = {};
	const labelField = `atr_${level}_label`;

	if (data[labelField] !== undefined) {
		updateData.atr_label = data[labelField];
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
	if (data[nextLevelField] === undefined) {
		return currentNat;
	}

	const childCategory = await prisma.attribute_dev.findFirst({
		where: { atr_nat: currentNat }
	});

	if (childCategory) {
		await prisma.attribute_dev.update({
			where: { atr_id: childCategory.atr_id },
			data: { atr_label: data[nextLevelField] }
		});

		if (data[nextLevelField] !== null) {
			console.log(`Sous-catégorie de niveau ${level} mise à jour`);
			return childCategory.atr_val ?? '';
		}
	} else if (data[nextLevelField] !== null) {
		const newValue = `${currentNat}_${data[nextLevelField].toLowerCase().replace(/\s+/g, '_')}`;
		await prisma.attribute_dev.create({
			data: {
				atr_nat: currentNat,
				atr_val: newValue,
				atr_label: data[nextLevelField]
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

		return json({ success: true }, { status: 200 });
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
		return json({ success: true });
	} catch (error) {
		console.error('Erreur lors de la suppression de la catégorie:', error);
		return json({ error: 'Erreur lors de la suppression de la catégorie' }, { status: 500 });
	}
};
