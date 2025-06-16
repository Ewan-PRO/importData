import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const PUT: RequestHandler = async ({ params, request }) => {
	try {
		const id = parseInt(params.id);
		if (isNaN(id)) {
			return json({ error: 'ID invalide' }, { status: 400 });
		}

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

		// Vérifier que l'enregistrement existe
		const existingRecord = await prisma.kit_attribute_dev.findUnique({
			where: { kat_id: id }
		});

		if (!existingRecord) {
			return json({ error: 'Kit non trouvé' }, { status: 404 });
		}

		// Récupérer les données liées pour la mise à jour
		const kit = existingRecord.fk_kit
			? await prisma.kit_dev.findUnique({
					where: { kit_id: existingRecord.fk_kit }
				})
			: null;

		const attributeCarac = existingRecord.fk_attribute_carac
			? await prisma.attribute_dev.findUnique({
					where: { atr_id: existingRecord.fk_attribute_carac }
				})
			: null;

		const attributeVal = existingRecord.fk_attribute
			? await prisma.attribute_dev.findUnique({
					where: { atr_id: existingRecord.fk_attribute }
				})
			: null;

		// Utilisation d'une transaction pour mettre à jour toutes les entités
		const result = await prisma.$transaction(async (tx) => {
			// 1. Mettre à jour le kit si nécessaire
			if (kit?.kit_label !== data.kit_label && existingRecord.fk_kit) {
				await tx.kit_dev.update({
					where: { kit_id: existingRecord.fk_kit },
					data: { kit_label: data.kit_label }
				});
			}

			// 2. Mettre à jour l'attribut caractéristique si nécessaire
			if (attributeCarac?.atr_label !== data.atr_label && existingRecord.fk_attribute_carac) {
				await tx.attribute_dev.update({
					where: { atr_id: existingRecord.fk_attribute_carac },
					data: {
						atr_label: data.atr_label,
						atr_val: data.atr_label.toLowerCase().replace(/\s+/g, '_')
					}
				});
			}

			// 3. Mettre à jour l'attribut valeur si nécessaire
			if (attributeVal?.atr_val !== data.atr_val && existingRecord.fk_attribute) {
				await tx.attribute_dev.update({
					where: { atr_id: existingRecord.fk_attribute },
					data: {
						atr_val: data.atr_val,
						atr_label: data.atr_val
					}
				});
			}

			// 4. Mettre à jour la valeur dans kit_attribute_dev
			const updatedKitAttribute = await tx.kit_attribute_dev.update({
				where: { kat_id: id },
				data: {
					kat_valeur: parseFloat(data.kat_valeur) || 0
				}
			});

			return updatedKitAttribute;
		});

		return json({
			success: true,
			message: 'Kit mis à jour avec succès',
			data: result
		});
	} catch (error) {
		console.error('Erreur lors de la mise à jour du kit:', error);
		return json({ error: 'Erreur lors de la mise à jour du kit' }, { status: 500 });
	}
};

export const DELETE: RequestHandler = async ({ params }) => {
	try {
		console.log('=== API DELETE /api/kits/[id] appelée ===');
		console.log('Params reçus:', params);

		const id = parseInt(params.id);
		console.log('ID parsé:', id);

		if (isNaN(id)) {
			console.log('Erreur: ID invalide');
			return json({ error: 'ID invalide' }, { status: 400 });
		}

		console.log("Recherche de l'enregistrement avec ID:", id);
		// Vérifier que l'enregistrement existe
		const existingRecord = await prisma.kit_attribute_dev.findUnique({
			where: { kat_id: id }
		});

		console.log('Enregistrement trouvé:', existingRecord);

		if (!existingRecord) {
			console.log('Erreur: Kit non trouvé');
			return json({ error: 'Kit non trouvé' }, { status: 404 });
		}

		console.log("Suppression de l'enregistrement kit_attribute_dev avec ID:", id);
		// Supprimer l'enregistrement kit_attribute_dev
		await prisma.kit_attribute_dev.delete({
			where: { kat_id: id }
		});

		console.log('Suppression réussie');
		return json({
			success: true,
			message: 'Kit supprimé avec succès'
		});
	} catch (error) {
		console.error('Erreur lors de la suppression du kit:', error);
		return json({ error: 'Erreur lors de la suppression du kit' }, { status: 500 });
	}
};
