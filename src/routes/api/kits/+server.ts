import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const GET: RequestHandler = async () => {
	try {
		const kits = await prisma.v_kit_carac.findMany();
		return json(kits);
	} catch (error) {
		console.error('Erreur lors de la récupération des kits:', error);
		return json({ error: 'Erreur lors de la récupération des kits' }, { status: 500 });
	}
};

export const POST: RequestHandler = async ({ request }) => {
	try {
		const data = await request.json();

		// Validation des données requises
		if (!data.kit_label || data.kit_label.trim() === '') {
			return json({ error: 'Le nom du kit est obligatoire' }, { status: 400 });
		}

		if (!data.atr_label || data.atr_label.trim() === '') {
			return json({ error: 'La caractéristique est obligatoire' }, { status: 400 });
		}

		if (!data.atr_val || data.atr_val.trim() === '') {
			return json({ error: "L'unité est obligatoire" }, { status: 400 });
		}

		if (!data.kat_valeur || data.kat_valeur.trim() === '') {
			return json({ error: 'La valeur est obligatoire' }, { status: 400 });
		}

		// Utilisation d'une transaction pour créer toutes les entités nécessaires
		const result = await prisma.$transaction(async (tx) => {
			// 1. Vérifier si le kit existe, sinon le créer
			const kit =
				(await tx.kit.findFirst({
					where: { kit_label: data.kit_label }
				})) ??
				(await tx.kit.create({
					data: { kit_label: data.kit_label }
				}));

			// 2. Vérifier si l'attribut caractéristique existe, sinon le créer
			const attributeCarac =
				(await tx.attribute.findFirst({
					where: {
						atr_nat: 'CARAC',
						atr_label: data.atr_label
					}
				})) ??
				(await tx.attribute.create({
					data: {
						atr_nat: 'CARAC',
						atr_val: data.atr_label.toLowerCase().replace(/\s+/g, '_'),
						atr_label: data.atr_label
					}
				}));

			// 3. Vérifier si l'attribut valeur existe, sinon le créer
			const attributeVal =
				(await tx.attribute.findFirst({
					where: {
						atr_val: data.atr_val
					}
				})) ??
				(await tx.attribute.create({
					data: {
						atr_nat: 'UNITE',
						atr_val: data.atr_val,
						atr_label: data.atr_val
					}
				}));

			// 4. Créer la relation kit_attribute
			const kitAttribute = await tx.kit_attribute.create({
				data: {
					fk_kit: kit.kit_id,
					fk_attribute_carac: attributeCarac.atr_id,
					fk_attribute: attributeVal.atr_id,
					kat_valeur: parseFloat(data.kat_valeur) || 0
				}
			});

			return {
				kit,
				attributeCarac,
				attributeVal,
				kitAttribute
			};
		});

		return json({
			success: true,
			message: 'Kit créé avec succès',
			data: result
		});
	} catch (error) {
		console.error('Erreur lors de la création du kit:', error);
		return json({ error: 'Erreur lors de la création du kit' }, { status: 500 });
	}
};
