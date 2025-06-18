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

		if (levels.length === 0) {
			return json(
				{ error: 'Aucun niveau de catégorie à créer. Au moins le niveau 1 doit être rempli.' },
				{ status: 400 }
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
		return json({ error: 'Erreur lors de la création des attributs' }, { status: 500 });
	}
};
