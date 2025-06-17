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

const checkExistingCategoryPath = async (data: Record<string, string>, lastFilledLevel: number) => {
	console.log("🔍 Vérification de l'existence du chemin complet");

	// Construire la requête pour vérifier si le chemin complet existe
	let currentLevel = 'CATEGORIE';
	let currentAttribute = null;

	for (let i = 1; i <= lastFilledLevel; i++) {
		const label = data[`atr_${i}_label`];
		const hasValue = label && label.trim() !== '';

		if (hasValue) {
			const existing = await prisma.attribute_dev.findFirst({
				where: {
					atr_nat: currentLevel,
					atr_label: label
				}
			});

			if (!existing) {
				// Si un niveau n'existe pas, le chemin complet n'existe pas
				return null;
			}

			currentAttribute = existing;
			currentLevel = existing.atr_val ?? '';
		} else {
			// Pour les niveaux vides, on cherche un attribut avec atr_label = null
			const existing = await prisma.attribute_dev.findFirst({
				where: {
					atr_nat: currentLevel,
					atr_label: null
				}
			});

			if (!existing) {
				return null;
			}

			currentAttribute = existing;
			currentLevel = existing.atr_val ?? '';
		}
	}

	return currentAttribute;
};

const createLevelAttribute = async (level: number, label: string, previousLevel: string) => {
	const hasValue = label && label.trim() !== '';

	if (level === 1) {
		if (hasValue) {
			return await handleLevel0Attribute(label);
		}
		console.log(`🔧 Création niveau 1 intermédiaire (NULL)`);
		const autoValue = `NIVEAU_1_AUTO_${Date.now()}`;
		const result = await handleLevel0Attribute(autoValue);
		await prisma.attribute_dev.update({
			where: { atr_id: result.attribute.atr_id },
			data: { atr_label: null }
		});
		result.attribute.atr_label = null;
		return result;
	}

	if (hasValue) {
		return await handleSubLevelAttribute(label, previousLevel);
	}

	console.log(`🔧 Création sous-niveau ${level} intermédiaire (NULL) dans "${previousLevel}"`);
	const autoValue = `NIVEAU_${level}_AUTO_${Date.now()}`;
	const result = await handleSubLevelAttribute(autoValue, previousLevel);
	await prisma.attribute_dev.update({
		where: { atr_id: result.attribute.atr_id },
		data: { atr_label: null }
	});
	result.attribute.atr_label = null;
	return result;
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

		// Trouver le dernier niveau rempli pour savoir jusqu'où créer la hiérarchie
		let lastFilledLevel = 0;
		for (let i = 7; i >= 1; i--) {
			const label = data[`atr_${i}_label`];
			if (label && label.trim() !== '') {
				lastFilledLevel = i;
				break;
			}
		}

		// Vérifier si la combinaison complète existe déjà
		const existingCategory = await checkExistingCategoryPath(data, lastFilledLevel);
		if (existingCategory) {
			console.log('⚠️ Catégorie existante trouvée:', existingCategory);
			return json({ error: 'Cette combinaison de catégories existe déjà' }, { status: 409 });
		}

		let previousLevel = 'CATEGORIE';

		// Créer tous les niveaux de 1 jusqu'au dernier niveau rempli
		for (let i = 1; i <= lastFilledLevel; i++) {
			const label = data[`atr_${i}_label`];
			const result = await createLevelAttribute(i, label, previousLevel);

			attributeEntries.push(result.attribute);
			previousLevel = result.nextLevel;
		}

		return json({ success: true, attributes: attributeEntries });
	} catch (error) {
		console.error('Erreur lors de la création des attributs :', error);
		return json({ error: 'Erreur lors de la création des attributs' }, { status: 500 });
	}
};
