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

		// Déterminer le niveau de la catégorie
		let level = 0;
		if (category.atr_nat === 'CATEGORIE') {
			level = 1;
		} else if (category.atr_nat?.startsWith('CATEGORIE_')) {
			level = 2;
		} else if (category.atr_nat?.includes('_')) {
			level = category.atr_nat?.split('_').length || 0;
		}

		console.log(`Cette catégorie est de niveau ${level}`);

		// Mettre à jour la catégorie principale
		const updateData: Record<string, string> = {};
		const labelField = `atr_${level}_label`;

		if (data[labelField] !== undefined) {
			updateData.atr_label = data[labelField];

			// Mise à jour de l'attribut principal
			await prisma.attribute_dev.update({
				where: { atr_id: categoryId },
				data: updateData
			});

			console.log('Catégorie principale mise à jour');
		}

		// Traiter les niveaux suivants
		let currentNat = category.atr_val ?? '';
		for (let i = level + 1; i <= 7; i++) {
			const nextLevelField = `atr_${i}_label`;
			if (data[nextLevelField] !== undefined && data[nextLevelField] !== null) {
				// Vérifier si une sous-catégorie existe déjà
				let childCategory = await prisma.attribute_dev.findFirst({
					where: { atr_nat: currentNat }
				});

				if (childCategory) {
					// Mettre à jour la sous-catégorie existante
					await prisma.attribute_dev.update({
						where: { atr_id: childCategory.atr_id },
						data: { atr_label: data[nextLevelField] }
					});
					currentNat = childCategory.atr_val ?? '';
					console.log(`Sous-catégorie de niveau ${i} mise à jour`);
				} else if (data[nextLevelField].trim() !== '') {
					// Créer une nouvelle sous-catégorie si la valeur n'est pas vide
					const newValue = `${currentNat}_${data[nextLevelField].toLowerCase().replace(/\s+/g, '_')}`;
					childCategory = await prisma.attribute_dev.create({
						data: {
							atr_nat: currentNat,
							atr_val: newValue,
							atr_label: data[nextLevelField]
						}
					});
					currentNat = newValue;
					console.log(`Nouvelle sous-catégorie de niveau ${i} créée`);
				}
			} else {
				// Arrêter le traitement si on rencontre un niveau null ou undefined
				break;
			}
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
