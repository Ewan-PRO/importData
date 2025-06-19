import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Fonction pour normaliser une chaîne pour la comparaison de similarité
function normalizeForComparison(text: string): string {
	return text
		.toLowerCase()
		.normalize('NFD') // Décompose les caractères accentués
		.replace(/[\u0300-\u036f]/g, '') // Supprime les accents
		.replace(/\s+/g, ' ') // Remplace espaces multiples par un seul
		.replace(/[.,;:!?]+$/, '') // Supprime ponctuation finale
		.trim();
}

// Fonction pour calculer la distance de Levenshtein
function levenshteinDistance(str1: string, str2: string): number {
	const matrix = Array(str2.length + 1)
		.fill(null)
		.map(() => Array(str1.length + 1).fill(null));

	for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
	for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;

	for (let j = 1; j <= str2.length; j++) {
		for (let i = 1; i <= str1.length; i++) {
			const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
			matrix[j][i] = Math.min(
				matrix[j][i - 1] + 1, // deletion
				matrix[j - 1][i] + 1, // insertion
				matrix[j - 1][i - 1] + indicator // substitution
			);
		}
	}

	return matrix[str2.length][str1.length];
}

// Fonction pour vérifier si deux mots sont des abréviations l'un de l'autre
function areAbbreviations(word1: string, word2: string): boolean {
	const abbreviations = [
		['TRI', 'TRIPHASÉ', 'TRIPHASE'],
		['MONO', 'MONOPHASÉ', 'MONOPHASE'],
		['VAR', 'VARIAIR', 'VARIABLE'],
		['SEC', 'SECHE', 'SÈCHE', 'SECHES', 'SÈCHES']
	];

	const w1 = word1.toUpperCase();
	const w2 = word2.toUpperCase();

	return abbreviations.some((group) => group.includes(w1) && group.includes(w2) && w1 !== w2);
}

// Fonction pour vérifier si les mots sont transposés
function areWordsTransposed(text1: string, text2: string): boolean {
	const words1 = text1
		.toLowerCase()
		.split(/\s+/)
		.sort((a, b) => a.localeCompare(b));
	const words2 = text2
		.toLowerCase()
		.split(/\s+/)
		.sort((a, b) => a.localeCompare(b));

	if (words1.length !== words2.length) return false;

	return words1.every((word, index) => word === words2[index]);
}

// Fonction principale pour détecter la similarité
function isSimilarKitLabel(
	newLabel: string,
	existingLabel: string
): { isSimilar: boolean; reason: string } {
	// Règle 1: Même texte, casse différente
	if (newLabel.toLowerCase() === existingLabel.toLowerCase() && newLabel !== existingLabel) {
		return { isSimilar: true, reason: 'Même texte avec casse différente' };
	}

	// Règle 2: Même texte, accents différents
	const normalized1 = normalizeForComparison(newLabel);
	const normalized2 = normalizeForComparison(existingLabel);

	if (normalized1 === normalized2 && newLabel !== existingLabel) {
		return { isSimilar: true, reason: 'Même texte avec accents ou espaces différents' };
	}

	// Règle 3: Distance de Levenshtein ≤ 2
	const distance = levenshteinDistance(normalized1, normalized2);
	if (distance <= 2 && distance > 0) {
		return {
			isSimilar: true,
			reason: `Texte très similaire (${distance} caractère(s) de différence)`
		};
	}

	// Règle 4: Mots transposés
	if (areWordsTransposed(newLabel, existingLabel)) {
		return { isSimilar: true, reason: 'Mots dans un ordre différent' };
	}

	// Règle 5: Abréviations communes
	const words1 = newLabel.split(/\s+/);
	const words2 = existingLabel.split(/\s+/);

	for (const word1 of words1) {
		for (const word2 of words2) {
			if (areAbbreviations(word1, word2)) {
				return { isSimilar: true, reason: 'Contient des abréviations similaires' };
			}
		}
	}

	return { isSimilar: false, reason: '' };
}

export const GET: RequestHandler = async () => {
	try {
		const kits = await prisma.v_kit_carac_dev.findMany();
		return json(kits);
	} catch (error) {
		console.error('Erreur lors de la récupération des kits:', error);
		return json({ error: 'Erreur lors de la récupération des kits' }, { status: 500 });
	}
};

export const POST: RequestHandler = async ({ request }) => {
	try {
		console.log('=== API POST /api/kits appelée ===');
		const data = await request.json();
		console.log('Données reçues:', data);

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

		// Vérifier l'unicité et la similarité du kit_label AVANT la transaction
		const existingKits = await prisma.kit_dev.findMany({
			where: { kit_label: { not: null } },
			select: { kit_label: true }
		});

		// Vérification exacte
		const exactMatch = existingKits.find((kit) => kit.kit_label === data.kit_label);
		if (exactMatch) {
			console.log('Erreur: Kit avec ce nom existe déjà:', exactMatch);
			return json(
				{
					error: `Un kit avec le nom "${data.kit_label}" existe déjà. Les noms de kits doivent être uniques.`
				},
				{ status: 409 }
			); // 409 Conflict
		}

		// Vérification de similarité
		for (const existingKit of existingKits) {
			if (existingKit.kit_label) {
				const similarity = isSimilarKitLabel(data.kit_label, existingKit.kit_label);
				if (similarity.isSimilar) {
					console.log('Erreur: Kit similaire détecté:', {
						nouveau: data.kit_label,
						existant: existingKit.kit_label,
						raison: similarity.reason
					});
					return json(
						{
							error: `Un kit similaire existe déjà : "${existingKit.kit_label}". Raison : ${similarity.reason}. Les noms de kits doivent être suffisamment distincts.`
						},
						{ status: 409 }
					); // 409 Conflict
				}
			}
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
