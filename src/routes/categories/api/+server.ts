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

		// Vérifier si cette hiérarchie complète existe déjà
		const fullPath = levels.join('->');
		const existingPath = await prisma.attribute_dev.findFirst({
			where: {
				atr_nat: 'CATEGORIE',
				atr_val: fullPath
			}
		});

		if (existingPath) {
			return json({ error: 'Cette hiérarchie de catégories existe déjà.' }, { status: 409 });
		}

		const attributeEntries = [];
		let previousLevel = 'CATEGORIE';

		// Créer chaque niveau de la hiérarchie
		for (let i = 0; i < levels.length; i++) {
			const label = levels[i];
			const currentPath = levels.slice(0, i + 1).join('->');

			// Générer un atr_val unique pour ce niveau spécifique dans ce chemin
			// On utilise un UUID basé sur le chemin complet + timestamp pour garantir l'unicité
			const uniqueId = `${currentPath}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

			console.log(`🔍 Niveau ${i + 1}:`, {
				label,
				currentPath,
				uniqueId,
				previousLevel,
				fullPath
			});

			// Pour éviter les doublons exacts sur cette hiérarchie complète,
			// on vérifie si cette combinaison exacte existe déjà
			const existingInPath = await prisma.attribute_dev.findFirst({
				where: {
					atr_nat: previousLevel,
					atr_label: label,
					// Vérifier s'il y a déjà un attribut avec ce label à ce niveau pour ce chemin parent
					atr_val: {
						contains: currentPath
					}
				}
			});

			console.log(`📋 Attribut similaire trouvé:`, existingInPath ? 'OUI' : 'NON');

			// Toujours créer un nouvel attribut pour éviter les conflits de hiérarchie
			const newAttr = await prisma.attribute_dev.create({
				data: {
					atr_nat: previousLevel,
					atr_val: uniqueId,
					atr_label: label
				}
			});

			console.log(`✅ Nouvel attribut créé:`, {
				id: newAttr.atr_id,
				atr_nat: newAttr.atr_nat,
				atr_val: newAttr.atr_val,
				atr_label: newAttr.atr_label
			});

			previousLevel = newAttr.atr_val ?? '';
			attributeEntries.push(newAttr);
		}

		return json({ success: true, attributes: attributeEntries, path: fullPath });
	} catch (error) {
		console.error('Erreur lors de la création des attributs :', error);
		return json({ error: 'Erreur lors de la création des attributs' }, { status: 500 });
	}
};
