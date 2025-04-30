// src/routes/api/categories/[id]/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const PUT: RequestHandler = async ({ params, request }) => {
	try {
		const { id } = params;
		const data = await request.json();

		// Récupérer la catégorie à modifier
		const categoryId = parseInt(id);
		const category = await prisma.attribute.findUnique({
			where: {
				atr_id: categoryId
			}
		});

		if (!category) {
			return json({ error: 'Catégorie non trouvé' }, { status: 404 });
		}

		// Mise à jour de l'attribut
		const updatedAttribute = await prisma.attribute.update({
			where: {
				atr_id: categoryId
			},
			data: {
				atr_val: data.atr_val ?? category.atr_val,
				atr_label: data.atr_label ?? category.atr_label
			}
		});
		return json(updatedAttribute, { status: 200 });
	} catch (error) {
		console.error('Erreur lors de la mise à jour de la catégorie :', error);
		return json({ error: 'Erreur lors de la mise à jour de la catégorie' }, { status: 500 });
	}
};

export const DELETE: RequestHandler = async ({ params }) => {
	try {
		const { id } = params;
		const categoryId = parseInt(id);
		// Vérifier si l'attribut est utilisé dans kit_attribute
		const usageCount = await prisma.kit_attribute.count({
			where: {
				OR: [{ fk_attribute: categoryId }, { fk_attribute_carac: categoryId }]
			}
		});
		if (usageCount > 0) {
			return json(
				{ error: 'Impossible de supprimer cette catégorie car elle est utilisée dans des kits' },
				{ status: 400 }
			);
		}

		// Supprimer l'attribut
		await prisma.attribute.delete({
			where: {
				atr_id: categoryId
			}
		});
		return json({ success: true });
	} catch (error) {
		console.error('Erreur lors de la suppression de la catégorie :', error);
		return json({ error: 'Erreur lors de la suppression de la catégorie' }, { status: 500 });
	}
};
