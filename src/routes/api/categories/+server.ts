import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const GET: RequestHandler = async () => {
	try {
		const categories = await prisma.v_categories.findMany({
			orderBy: [
				{ atr_0_label: 'asc' },
				{ atr_1_label: 'asc' },
				{ atr_2_label: 'asc' },
				{ atr_3_label: 'asc' },
				{ atr_4_label: 'asc' },
				{ atr_5_label: 'asc' },
				{ atr_6_label: 'asc' },
				{ atr_7_label: 'asc' }
			]
		});

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

		for (let i = 0; i < 8; i++) {
			const label = data[`atr_${i}_label`];
			if (label && label.trim() !== '') {
				const existingAttribute = await prisma.attribute.findFirst({
					where: {
						atr_nat: `category_level_${i}`,
						atr_val: label
					}
				});

				let attributeEntry;

				if (existingAttribute) {
					// Mettre à jour l'attribut existant
					attributeEntry = await prisma.attribute.update({
						where: {
							atr_id: existingAttribute.atr_id
						},
						data: {
							atr_label: label
						}
					});
				} else {
					// Créer un nouvel attribut
					attributeEntry = await prisma.attribute.create({
						data: {
							atr_nat: `category_level_${i}`,
							atr_val: label,
							atr_label: label
						}
					});
				}

				attributeEntries.push(attributeEntry);
			}
		}
		return json({ success: true, attributes: attributeEntries });
	} catch (error) {
		console.error('Erreur lors de la création des attributs :', error);
		return json({ error: 'Erreur lors de la création des attributs' }, { status: 500 });
	}
};
