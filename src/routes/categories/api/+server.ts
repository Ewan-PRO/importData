// src/routes/api/categories/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const handleLevel0Attribute = async (label: string) => {
	console.log(`🔍 Recherche niveau 0 pour: "${label}"`);

	const existingLevel0 = await prisma.attribute_dev.findFirst({
		where: {
			atr_nat: 'CATEGORIE',
			atr_label: label
		}
	});

	console.log('📋 Niveau 0 existant:', existingLevel0);

	if (existingLevel0) {
		return { attribute: existingLevel0, nextLevel: existingLevel0.atr_val ?? '' };
	}

	console.log(`➕ Création niveau 0: "${label}"`);
	try {
		const newAttr = await prisma.attribute_dev.create({
			data: {
				atr_nat: 'CATEGORIE',
				atr_val: label,
				atr_label: label
			}
		});
		console.log('✅ Niveau 0 créé:', newAttr);
		return { attribute: newAttr, nextLevel: newAttr.atr_val ?? '' };
	} catch (error) {
		console.error(`❌ Erreur création niveau 0 "${label}":`, error);
		throw error;
	}
};

const handleSubLevelAttribute = async (label: string, previousLevel: string) => {
	console.log(`🔍 Recherche sous-niveau "${label}" dans "${previousLevel}"`);

	const existingAttr = await prisma.attribute_dev.findFirst({
		where: {
			atr_nat: previousLevel,
			atr_label: label
		}
	});

	console.log('📋 Sous-niveau existant:', existingAttr);

	if (existingAttr) {
		return { attribute: existingAttr, nextLevel: existingAttr.atr_val ?? '' };
	}

	console.log(`➕ Création sous-niveau "${label}" dans "${previousLevel}"`);
	try {
		const newAttr = await prisma.attribute_dev.create({
			data: {
				atr_nat: previousLevel,
				atr_val: label,
				atr_label: label
			}
		});
		console.log('✅ Sous-niveau créé:', newAttr);
		return { attribute: newAttr, nextLevel: newAttr.atr_val ?? '' };
	} catch (error) {
		console.error(`❌ Erreur création sous-niveau "${label}":`, error);
		throw error;
	}
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
		console.log('🚀 Début de la création des catégories');
		const data = await request.json();
		console.log('📥 Données reçues:', data);

		const attributeEntries = [];

		// Vérifier qu'au moins un niveau entre atr_1_label et atr_7_label est rempli
		const hasAtLeastOneLevel = [
			data.atr_1_label,
			data.atr_2_label,
			data.atr_3_label,
			data.atr_4_label,
			data.atr_5_label,
			data.atr_6_label,
			data.atr_7_label
		].some((label) => label && label.trim() !== '');

		if (!hasAtLeastOneLevel) {
			console.log('❌ Aucun niveau rempli');
			return json(
				{ error: 'Au moins un niveau entre atr_1_label et atr_7_label doit être rempli' },
				{ status: 400 }
			);
		}

		let previousLevel = 'CATEGORIE';

		// Commencer à partir de atr_1_label (ignorer atr_0_label qui est toujours "Catégorie des produits")
		for (let i = 1; i <= 7; i++) {
			const label = data[`atr_${i}_label`];

			if (label && label.trim() !== '') {
				let result;
				if (i === 1) {
					// Premier niveau réel (atr_1_label devient le niveau 0 en base)
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
