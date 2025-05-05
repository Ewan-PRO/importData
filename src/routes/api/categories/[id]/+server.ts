// src/routes/api/categories/[id]/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const PUT: RequestHandler = async ({ params, request }) => {
	try {
		console.log('=== Début PUT /api/categories/[id] ===');
		const { id } = params;
		const data = await request.json();
		console.log('Données reçues:', data);

		// Récupérer la catégorie à modifier
		const categoryId = parseInt(id);
		const category = await prisma.attribute_dev.findUnique({
			where: { atr_id: categoryId }
		});

		if (!category) {
			return json({ error: 'Catégorie non trouvée' }, { status: 404 });
		}

		// Déterminer le niveau de la catégorie basé sur son atr_nat
		let level = 0;
		if (category.atr_nat === 'CATEGORIE') {
			level = 1; // Premier niveau (après la racine)
		} else if (category.atr_nat?.startsWith('CATEGORIE_')) {
			level = 2; // Deuxième niveau
		} else if (category.atr_nat?.includes('_')) {
			// Compter le nombre de segments pour déterminer le niveau
			level = category.atr_nat?.split('_').length || 0;
		}

		console.log(`Cette catégorie est de niveau ${level}`);

		// Préparer les données à mettre à jour
		const updateData: Record<string, string> = {};

		// Mise à jour du label (seul champ modifiable dans la plupart des cas)
		const labelField = `atr_${level}_label`;
		if (data[labelField] !== undefined) {
			updateData.atr_label = data[labelField];
		}

		console.log('Données préparées pour mise à jour:', updateData);

		// Mise à jour de l'attribut
		const updatedAttribute = await prisma.attribute_dev.update({
			where: { atr_id: categoryId },
			data: updateData
		});

		console.log('Catégorie mise à jour avec succès');

		// Invalider le cache et retourner la réponse
		return json({ success: true, attribute: updatedAttribute }, { status: 200 });
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
