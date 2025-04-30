// src/routes/api/categories/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const createRootCategory = async () => {
	const rootCategory = await prisma.attribute_dev.findFirst({
		where: {
			atr_val: 'CATEGORIE'
		}
	});

	if (!rootCategory) {
		await prisma.attribute_dev.create({
			data: {
				atr_nat: 'ROOT',
				atr_val: 'CATEGORIE',
				atr_label: 'Catégorie des produits'
			}
		});
	}
};

const handleLevel0Attribute = async (label: string) => {
	const existingLevel0 = await prisma.attribute_dev.findFirst({
		where: {
			atr_nat: 'CATEGORIE',
			atr_label: label
		}
	});

	if (existingLevel0) {
		return { attribute: existingLevel0, nextLevel: existingLevel0.atr_val ?? '' };
	}

	const newAttr = await prisma.attribute_dev.create({
		data: {
			atr_nat: 'CATEGORIE',
			atr_val: label.toLowerCase().replace(/\s+/g, '_'),
			atr_label: label
		}
	});

	return { attribute: newAttr, nextLevel: newAttr.atr_val ?? '' };
};

const handleSubLevelAttribute = async (label: string, previousLevel: string) => {
	const existingAttr = await prisma.attribute_dev.findFirst({
		where: {
			atr_nat: previousLevel,
			atr_label: label
		}
	});

	if (existingAttr) {
		return { attribute: existingAttr, nextLevel: existingAttr.atr_val ?? '' };
	}

	const attrVal = `${previousLevel}_${label.toLowerCase().replace(/\s+/g, '_')}`;
	const newAttr = await prisma.attribute_dev.create({
		data: {
			atr_nat: previousLevel,
			atr_val: attrVal,
			atr_label: label
		}
	});

	return { attribute: newAttr, nextLevel: newAttr.atr_val ?? '' };
};

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
		const data = await request.json();
		const attributeEntries = [];

		if (!data.atr_0_label || data.atr_0_label.trim() === '') {
			return json({ error: 'Le niveau 1 (atr_0_label) est obligatoire' }, { status: 400 });
		}

		await createRootCategory();

		let previousLevel = 'CATEGORIE';

		for (let i = 0; i < 8; i++) {
			const label = data[`atr_${i}_label`];

			if (label && label.trim() !== '') {
				let result;
				if (i === 0) {
					result = await handleLevel0Attribute(label);
				} else {
					result = await handleSubLevelAttribute(label, previousLevel);
				}

				attributeEntries.push(result.attribute);
				previousLevel = result.nextLevel;
			} else {
				break;
			}
		}

		return json({ success: true, attributes: attributeEntries });
	} catch (error) {
		console.error('Erreur lors de la création des attributs :', error);
		return json({ error: 'Erreur lors de la création des attributs' }, { status: 500 });
	}
};
