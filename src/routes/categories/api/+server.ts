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

		const attributeEntries = [];
		let previousLevel = 'CATEGORIE';

		// Parcourir les niveaux séquentiellement
		for (let i = 1; i <= 7; i++) {
			const label = data[`atr_${i}_label`];

			// Si le label est vide ou non fourni, on arrête le traitement.
			// La validation en amont garantit qu'il n'y a pas de "trous".
			if (!label || label.trim() === '') {
				break;
			}

			// Vérifier si la catégorie à ce niveau existe déjà
			const existingAttr = await prisma.attribute_dev.findFirst({
				where: {
					atr_nat: previousLevel,
					atr_label: label
				}
			});

			if (existingAttr) {
				// Si l'attribut existe, on l'utilise pour le niveau suivant
				previousLevel = existingAttr.atr_val ?? '';
				attributeEntries.push(existingAttr);
			} else {
				// Sinon, on crée le nouvel attribut
				const newAttr = await prisma.attribute_dev.create({
					data: {
						atr_nat: previousLevel,
						atr_val: label, // Simplification: on peut utiliser le label comme valeur pour l'instant
						atr_label: label
					}
				});
				previousLevel = newAttr.atr_val ?? '';
				attributeEntries.push(newAttr);
			}
		}

		if (attributeEntries.length === 0) {
			return json(
				{ error: 'Aucun niveau de catégorie à créer. Au moins le niveau 1 doit être rempli.' },
				{ status: 400 }
			);
		}

		// Optionnel : vérifier si la hiérarchie complète existe déjà pour éviter les doublons exacts
		// Cette logique est complexe et peut être omise si la validation en amont est suffisante.

		return json({ success: true, attributes: attributeEntries });
	} catch (error) {
		console.error('Erreur lors de la création des attributs :', error);
		return json({ error: 'Erreur lors de la création des attributs' }, { status: 500 });
	}
};
