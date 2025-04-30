// src/routes/api/categories/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const GET: RequestHandler = async () => {
	try {
		const categories = await prisma.v_categories.findMany();
		return json(categories);
	} catch (error) {
		console.error('Erreur lors de la récupération des catégories:', error);
		return json({ error: 'Erreur lors de la récupération des catégories' }, { status: 500 });
	}
};

export const POST: RequestHandler = async ({ request }) => {
	try {
		const data = await request.json();
		const attributeEntries = [];

		// Vérifier si nous avons au moins le niveau 0
		if (!data.atr_0_label || data.atr_0_label.trim() === '') {
			return json({ error: 'Le niveau 1 (atr_0_label) est obligatoire' }, { status: 400 });
		}

		// Étape 1: Vérifier que l'entrée racine 'CATEGORIE' existe
		const rootCategory = await prisma.attribute.findFirst({
			where: {
				atr_val: 'CATEGORIE'
			}
		});

		if (!rootCategory) {
			// Créer l'entrée racine si elle n'existe pas
			await prisma.attribute.create({
				data: {
					atr_nat: 'ROOT',
					atr_val: 'CATEGORIE',
					atr_label: 'Catégorie des produits'
				}
			});
		}

		// Étape 2: Construire la chaîne de hiérarchie
		let previousLevel = 'CATEGORIE';

		for (let i = 0; i < 8; i++) {
			const label = data[`atr_${i}_label`];

			// Si ce niveau a une valeur
			if (label && label.trim() !== '') {
				// Si c'est le niveau 0, vérifier s'il existe déjà
				if (i === 0) {
					const existingLevel0 = await prisma.attribute.findFirst({
						where: {
							atr_nat: 'CATEGORIE',
							atr_label: label
						}
					});

					if (existingLevel0) {
						// Utiliser l'attribut existant
						attributeEntries.push(existingLevel0);
						previousLevel = existingLevel0.atr_val ?? '';
					} else {
						// Créer un nouvel attribut de niveau 0
						const newAttr = await prisma.attribute.create({
							data: {
								atr_nat: 'CATEGORIE',
								atr_val: label.toLowerCase().replace(/\s+/g, '_'),
								atr_label: label
							}
						});
						attributeEntries.push(newAttr);
						previousLevel = newAttr.atr_val ?? '';
					}
				} else {
					// Pour les niveaux > 0, le atr_nat doit être la valeur du niveau précédent
					const existingAttr = await prisma.attribute.findFirst({
						where: {
							atr_nat: previousLevel,
							atr_label: label
						}
					});

					if (existingAttr) {
						attributeEntries.push(existingAttr);
						previousLevel = existingAttr.atr_val ?? '';
					} else {
						// Créer un nouvel attribut pour ce niveau
						const attrVal = `${previousLevel}_${label.toLowerCase().replace(/\s+/g, '_')}`;
						const newAttr = await prisma.attribute.create({
							data: {
								atr_nat: previousLevel,
								atr_val: attrVal,
								atr_label: label
							}
						});
						attributeEntries.push(newAttr);
						previousLevel = newAttr.atr_val ?? '';
					}
				}
			} else {
				// Si pas de valeur pour ce niveau, arrêter la chaîne
				break;
			}
		}

		return json({ success: true, attributes: attributeEntries });
	} catch (error) {
		console.error('Erreur lors de la création des attributs :', error);
		return json({ error: 'Erreur lors de la création des attributs' }, { status: 500 });
	}
};
