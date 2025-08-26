import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { prisma, getKits } from '$lib/server/db';

// Type pour la transaction Prisma
type PrismaTransactionClient = Parameters<Parameters<typeof prisma.$transaction>[0]>[0];

export const GET: RequestHandler = async ({ url }) => {
	try {
		// Test de connexion à la base de données
		await prisma.$connect();
		const kits = await getKits();
		return json(kits);
	} catch (error) {
		console.error('❌ [API-KITS] Erreur lors de la récupération des kits:', error);
		console.error('❌ [API-KITS] Stack trace:', error instanceof Error ? error.stack : 'N/A');
		console.error("❌ [API-KITS] Type d'erreur:", error?.constructor?.name || 'Inconnu');

		return json(
			{
				error: 'Erreur lors de la récupération des kits',
				details: error instanceof Error ? error.message : 'Erreur inconnue'
			},
			{ status: 500 }
		);
	} finally {
		try {
			await prisma.$disconnect();
		} catch (disconnectError) {
			console.error('⚠️ [API-KITS] Erreur lors de la déconnexion:', disconnectError);
		}
	}
};

export const POST: RequestHandler = async ({ request }) => {
	try {
		const data = await request.json();

		// Nettoyer les données d'entrée
		const cleanData = {
			kit_label: data.kit_label?.trim() || '',
			atr_label: data.atr_label?.trim() || '',
			atr_val: data.atr_val?.trim() || '',
			kat_valeur: data.kat_valeur?.trim() || ''
		};

		// Validation des données requises
		if (!cleanData.kit_label) {
			return json({ error: 'Le nom du kit est obligatoire' }, { status: 400 });
		}

		if (!cleanData.atr_label) {
			return json({ error: 'La caractéristique est obligatoire' }, { status: 400 });
		}

		if (!cleanData.atr_val) {
			return json({ error: "L'unité est obligatoire" }, { status: 400 });
		}

		if (!cleanData.kat_valeur) {
			return json({ error: 'La valeur est obligatoire' }, { status: 400 });
		}

		// Vérifier l'unicité de la combinaison complète AVANT la transaction
		// Un même kit peut avoir plusieurs caractéristiques, mais pas la même combinaison exacte
		const existingCombination = await prisma.v_kit_carac_dev.findFirst({
			where: {
				kit_label: cleanData.kit_label,
				atr_label: cleanData.atr_label,
				atr_val: cleanData.atr_val,
				kat_valeur: parseFloat(cleanData.kat_valeur) || 0
			}
		});

		if (existingCombination) {
			return json(
				{
					error: `Cette combinaison existe déjà : Kit "${cleanData.kit_label}" avec caractéristique "${cleanData.atr_label}" = ${cleanData.kat_valeur} ${cleanData.atr_val}`
				},
				{ status: 409 }
			);
		}

		// Utilisation d'une transaction pour créer toutes les entités nécessaires
		const result = await prisma.$transaction(async (tx: PrismaTransactionClient) => {
			// 1. Créer le nouveau kit (on sait qu'il n'existe pas)
			const kit = await tx.kit_dev.create({
				data: { kit_label: cleanData.kit_label }
			});

			// 2. Vérifier si l'attribut caractéristique existe, sinon le créer
			const attributeCarac =
				(await tx.attribute_dev.findFirst({
					where: {
						atr_nat: 'CARAC',
						atr_label: cleanData.atr_label
					}
				})) ??
				(await tx.attribute_dev.create({
					data: {
						atr_nat: 'CARAC',
						atr_val: cleanData.atr_label.toLowerCase().replace(/\s+/g, '_'),
						atr_label: cleanData.atr_label
					}
				}));

			// 3. Vérifier si l'attribut valeur existe, sinon le créer
			const attributeVal =
				(await tx.attribute_dev.findFirst({
					where: {
						atr_val: cleanData.atr_val
					}
				})) ??
				(await tx.attribute_dev.create({
					data: {
						atr_nat: 'UNITE',
						atr_val: cleanData.atr_val,
						atr_label: cleanData.atr_val
					}
				}));

			// 4. Vérifier les IDs existants et la séquence avant création
			// Vérifier le dernier kat_id
			const lastKitAttribute = await tx.kit_attribute_dev.findFirst({
				orderBy: { kat_id: 'desc' },
				select: { kat_id: true }
			});

			// CORRECTION: Synchroniser la séquence avec le dernier ID
			if (lastKitAttribute?.kat_id) {
				const nextId = lastKitAttribute.kat_id + 1;
				await tx.$executeRaw`SELECT setval('kit_attribute_dev_kat_id_seq', ${nextId}, false)`;
			}

			// Créer la relation kit_attribute_dev SANS spécifier kat_id (laisser l'autoincrement)
			const kitAttribute = await tx.kit_attribute_dev.create({
				data: {
					fk_kit: kit.kit_id,
					fk_attribute_carac: attributeCarac.atr_id,
					fk_attribute: attributeVal.atr_id,
					kat_valeur: parseFloat(cleanData.kat_valeur) || 0
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
