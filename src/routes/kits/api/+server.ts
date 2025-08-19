import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const GET: RequestHandler = async () => {
	console.log('🚀 [API-KITS] Début GET /kits/api');

	try {
		console.log('🔍 [API-KITS] Vérification de la connexion Prisma');

		// Test de connexion à la base de données
		await prisma.$connect();
		console.log('✅ [API-KITS] Connexion Prisma établie');

		console.log('📡 [API-KITS] Requête vers v_kit_carac_dev');
		const kits = await prisma.v_kit_carac_dev.findMany();

		console.log('📊 [API-KITS] Données récupérées:', {
			count: kits.length,
			firstItem: kits.length > 0 ? kits[0] : null
		});

		console.log('✅ [API-KITS] GET terminé avec succès');
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
			console.log('🔌 [API-KITS] Connexion Prisma fermée');
		} catch (disconnectError) {
			console.error('⚠️ [API-KITS] Erreur lors de la déconnexion:', disconnectError);
		}
	}
};

export const POST: RequestHandler = async ({ request }) => {
	console.log('🚀 [API-KITS] Début POST /kits/api');

	try {
		console.log('📥 [API-KITS] Lecture du body de la requête');
		const data = await request.json();
		console.log('📥 [API-KITS] Données reçues:', data);

		// Validation des données requises
		if (!data.kit_label || data.kit_label.trim() === '') {
			console.log('Erreur: kit_label manquant');
			return json({ error: 'Le nom du kit est obligatoire' }, { status: 400 });
		}

		if (!data.atr_label || data.atr_label.trim() === '') {
			console.log('Erreur: atr_label manquant');
			return json({ error: 'La caractéristique est obligatoire' }, { status: 400 });
		}

		if (!data.atr_val || data.atr_val.trim() === '') {
			console.log('Erreur: atr_val manquant');
			return json({ error: "L'unité est obligatoire" }, { status: 400 });
		}

		if (!data.kat_valeur || data.kat_valeur.trim() === '') {
			console.log('Erreur: kat_valeur manquant');
			return json({ error: 'La valeur est obligatoire' }, { status: 400 });
		}

		console.log('Validation OK, début de la transaction');

		// Vérifier l'unicité de la combinaison complète AVANT la transaction
		// Un même kit peut avoir plusieurs caractéristiques, mais pas la même combinaison exacte
		const existingCombination = await prisma.v_kit_carac_dev.findFirst({
			where: {
				kit_label: data.kit_label,
				atr_label: data.atr_label,
				atr_val: data.atr_val,
				kat_valeur: parseFloat(data.kat_valeur) || 0
			}
		});

		if (existingCombination) {
			console.log('Erreur: Combinaison exacte existe déjà:', existingCombination);
			return json(
				{
					error: `Cette combinaison existe déjà : Kit "${data.kit_label}" avec caractéristique "${data.atr_label}" = ${data.kat_valeur} ${data.atr_val}`
				},
				{ status: 409 }
			);
		}

		// Vérifier s'il existe des combinaisons similaires (même kit + même caractéristique mais valeur/unité différente)
		const similarCombinations = await prisma.v_kit_carac_dev.findMany({
			where: {
				kit_label: data.kit_label,
				atr_label: data.atr_label
			}
		});

		if (similarCombinations.length > 0) {
			console.log(
				'Attention: Kit existant avec même caractéristique mais valeur/unité différente:',
				similarCombinations
			);
			// On laisse passer mais on log pour information
		}

		// Utilisation d'une transaction pour créer toutes les entités nécessaires
		const result = await prisma.$transaction(async (tx) => {
			console.log('Transaction démarrée');

			// 1. Créer le nouveau kit (on sait qu'il n'existe pas)
			const kit = await tx.kit_dev.create({
				data: { kit_label: data.kit_label }
			});
			console.log('Kit créé:', kit);

			// 2. Vérifier si l'attribut caractéristique existe, sinon le créer
			const attributeCarac =
				(await tx.attribute_dev.findFirst({
					where: {
						atr_nat: 'CARAC',
						atr_label: data.atr_label
					}
				})) ??
				(await tx.attribute_dev.create({
					data: {
						atr_nat: 'CARAC',
						atr_val: data.atr_label.toLowerCase().replace(/\s+/g, '_'),
						atr_label: data.atr_label
					}
				}));
			console.log('Attribut caractéristique créé/trouvé:', attributeCarac);

			// 3. Vérifier si l'attribut valeur existe, sinon le créer
			const attributeVal =
				(await tx.attribute_dev.findFirst({
					where: {
						atr_val: data.atr_val
					}
				})) ??
				(await tx.attribute_dev.create({
					data: {
						atr_nat: 'UNITE',
						atr_val: data.atr_val,
						atr_label: data.atr_val
					}
				}));
			console.log('Attribut valeur créé/trouvé:', attributeVal);

			// 4. Vérifier les IDs existants et la séquence avant création
			console.log('Vérification avant création kit_attribute_dev:');

			// Vérifier le dernier kat_id
			const lastKitAttribute = await tx.kit_attribute_dev.findFirst({
				orderBy: { kat_id: 'desc' },
				select: { kat_id: true }
			});
			console.log('Dernier kat_id trouvé:', lastKitAttribute?.kat_id || 'aucun');

			// Compter le nombre total d'enregistrements
			const count = await tx.kit_attribute_dev.count();
			console.log('Nombre total kit_attribute_dev:', count);

			// CORRECTION: Synchroniser la séquence avec le dernier ID
			if (lastKitAttribute?.kat_id) {
				const nextId = lastKitAttribute.kat_id + 1;
				console.log('Correction de la séquence pour démarrer à:', nextId);

				await tx.$executeRaw`SELECT setval('kit_attribute_dev_kat_id_seq', ${nextId}, false)`;
				console.log('Séquence corrigée');
			}

			// Créer la relation kit_attribute_dev SANS spécifier kat_id (laisser l'autoincrement)
			console.log('Données à insérer:', {
				fk_kit: kit.kit_id,
				fk_attribute_carac: attributeCarac.atr_id,
				fk_attribute: attributeVal.atr_id,
				kat_valeur: parseFloat(data.kat_valeur) || 0
			});

			const kitAttribute = await tx.kit_attribute_dev.create({
				data: {
					fk_kit: kit.kit_id,
					fk_attribute_carac: attributeCarac.atr_id,
					fk_attribute: attributeVal.atr_id,
					kat_valeur: parseFloat(data.kat_valeur) || 0
				}
			});
			console.log('Kit_attribute_dev créé avec succès:', kitAttribute);

			return {
				kit,
				attributeCarac,
				attributeVal,
				kitAttribute
			};
		});

		console.log('Transaction terminée avec succès');
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
