// src/routes/api/categories/[id]/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Seuils de protection
const PROTECTION_THRESHOLDS = {
	DIRECT_ALLOW: 3, // ≤ 3 enfants : autoriser
	REQUIRE_CONFIRM: 20, // 4-20 enfants : demander confirmation
	BLOCK_OPERATION: 20 // 20+ enfants : bloquer
};

interface CategoryData {
	forceUpdate?: boolean; // Pour forcer les modifications avec confirmation
	atr_label?: string | null;
	atr_val?: string | null;
	[key: string]: string | null | undefined | boolean;
}

interface Category {
	atr_id: number;
	atr_nat: string | null;
	atr_val: string | null;
	atr_label: string | null;
}

async function getCategoryLevel(category: Category): Promise<number> {
	if (category.atr_nat === 'CATEGORIE') {
		return 1;
	}
	if (category.atr_nat?.startsWith('CATEGORIE_')) {
		return 2;
	}
	if (category.atr_nat?.includes('_')) {
		return category.atr_nat?.split('_').length || 0;
	}
	return 0;
}

async function countAffectedCategories(category: Category): Promise<{
	count: number;
	samples: string[];
}> {
	// Compter toutes les sous-catégories qui seraient affectées
	const affectedCategories = await prisma.attribute_dev.findMany({
		where: {
			OR: [{ atr_nat: category.atr_val }, { atr_nat: { startsWith: `${category.atr_val}_` } }]
		},
		select: {
			atr_label: true,
			atr_nat: true
		},
		take: 10 // Limiter pour les exemples
	});

	const totalCount = await prisma.attribute_dev.count({
		where: {
			OR: [{ atr_nat: category.atr_val }, { atr_nat: { startsWith: `${category.atr_val}_` } }]
		}
	});

	const samples = affectedCategories
		.map((cat) => cat.atr_label)
		.filter((label) => label !== null)
		.slice(0, 4);

	return { count: totalCount, samples };
}

async function deleteSubsequentLevels(parentNat: string | null): Promise<void> {
	if (!parentNat) return;

	const children = await prisma.attribute_dev.findMany({
		where: { atr_nat: parentNat }
	});

	for (const child of children) {
		await deleteSubsequentLevels(child.atr_val);
		await prisma.attribute_dev.delete({ where: { atr_id: child.atr_id } });
		console.log(`🗑️ Niveau orphelin ${child.atr_label} supprimé.`);
	}
}

export const PUT: RequestHandler = async ({ params, request }) => {
	try {
		console.log('=== Début PUT /api/categories/[id] ===');
		const { id } = params;
		const data = (await request.json()) as CategoryData; // Les données envoyées par le client

		const categoryId = parseInt(id);
		const mainCategory = await prisma.attribute_dev.findUnique({ where: { atr_id: categoryId } });

		if (!mainCategory) {
			return json({ error: 'Catégorie principale non trouvée' }, { status: 404 });
		}

		// Validation séquentielle
		const levels = Object.keys(data)
			.filter((k) => k.startsWith('atr_') && k.endsWith('_label'))
			.sort();

		for (let i = 1; i < levels.length; i++) {
			const prevLevel = data[levels[i - 1]];
			const currentLevel = data[levels[i]];
			if (!prevLevel && currentLevel) {
				return json(
					{ error: `Le niveau ${i + 1} ne peut pas être rempli si le niveau ${i} est vide.` },
					{ status: 400 }
				);
			}
		}
		// --- Fin Validation

		let parentVal = mainCategory.atr_val;

		// Mise à jour du label de la catégorie principale cliquée
		const mainLabelValue = data[`atr_${await getCategoryLevel(mainCategory)}_label`];
		const mainLabel = typeof mainLabelValue === 'string' ? mainLabelValue : null;

		if (mainLabel !== undefined && mainCategory.atr_label !== mainLabel) {
			await prisma.attribute_dev.update({
				where: { atr_id: categoryId },
				data: { atr_label: mainLabel === '' ? null : mainLabel }
			});
			console.log(`🏷️ Label de la catégorie principale mis à jour: ${mainLabel}`);
		}

		// Traitement des niveaux suivants
		for (let i = (await getCategoryLevel(mainCategory)) + 1; i <= 7; i++) {
			const labelValue = data[`atr_${i}_label`];
			const label = typeof labelValue === 'string' ? labelValue : null;

			const childCategory = await prisma.attribute_dev.findFirst({ where: { atr_nat: parentVal } });

			if (label && label.trim() !== '') {
				// Si un label est fourni
				if (childCategory) {
					// L'enfant existe -> on le met à jour
					await prisma.attribute_dev.update({
						where: { atr_id: childCategory.atr_id },
						data: { atr_label: label }
					});
					console.log(`✍️ Niveau ${i} mis à jour avec le label: ${label}`);
					parentVal = childCategory.atr_val; // pour le prochain tour de boucle
				} else {
					// L'enfant n'existe pas -> on le crée
					const newChild = await prisma.attribute_dev.create({
						data: {
							atr_nat: parentVal,
							atr_label: label,
							atr_val: label // Simplification
						}
					});
					console.log(`✨ Niveau ${i} créé avec le label: ${label}`);
					parentVal = newChild.atr_val;
				}
			} else {
				// Si le label est vide ou manquant, on supprime ce niveau et les suivants
				if (childCategory) {
					console.log(`🗑️ Début de la suppression à partir du niveau ${i}`);
					await deleteSubsequentLevels(childCategory.atr_val);
					await prisma.attribute_dev.delete({ where: { atr_id: childCategory.atr_id } });
				}
				break; // Arrête la boucle car la suite de la chaîne est rompue
			}
		}

		return json({ success: true });
	} catch (error) {
		console.error('❌ Erreur lors de la mise à jour :', error);
		const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
		return json({ error: `Erreur interne: ${errorMessage}` }, { status: 500 });
	}
};

export const DELETE: RequestHandler = async ({ params }) => {
	try {
		console.log('=== Début DELETE /api/categories/[id] ===');
		const { id } = params;
		console.log('ID reçu:', id);
		const categoryId = parseInt(id);
		console.log('ID converti en nombre:', categoryId);

		// Étape 1: Récupérer la ligne de la vue avec l'ID séquentiel
		const categoryFromView = await prisma.v_categories_dev.findFirst({
			where: {
				atr_id: categoryId
			}
		});
		console.log('Catégorie trouvée dans la vue:', categoryFromView);

		if (!categoryFromView) {
			console.log('Catégorie non trouvée dans la vue');
			return json({ error: 'Catégorie non trouvée' }, { status: 404 });
		}

		// Étape 2: Retrouver l'atr_id réel en cherchant dans attribute_dev
		let category = null;
		let realAtrId = null;

		// Chercher le dernier niveau rempli pour identifier la catégorie réelle
		for (let level = 7; level >= 1; level--) {
			const labelField = `atr_${level}_label` as keyof typeof categoryFromView;
			const label = categoryFromView[labelField];

			if (label !== null && label !== undefined) {
				console.log(`Recherche au niveau ${level} avec label: "${label}"`);

				// Construire la hiérarchie pour trouver l'atr_nat correct
				let currentNat = 'CATEGORIE';

				// Parcourir les niveaux précédents pour construire le bon atr_nat
				for (let i = 1; i < level; i++) {
					const prevLabelField = `atr_${i}_label` as keyof typeof categoryFromView;
					const prevLabel = categoryFromView[prevLabelField];

					if (prevLabel !== null && prevLabel !== undefined) {
						const prevCategory = await prisma.attribute_dev.findFirst({
							where: {
								atr_nat: currentNat,
								atr_label: String(prevLabel)
							}
						});
						if (prevCategory) {
							currentNat = prevCategory.atr_val ?? '';
						}
					}
				}

				// Chercher la catégorie finale
				category = await prisma.attribute_dev.findFirst({
					where: {
						atr_nat: currentNat,
						atr_label: String(label)
					}
				});

				if (category) {
					realAtrId = category.atr_id;
					console.log(`Catégorie réelle trouvée avec atr_id: ${realAtrId}`);
					break;
				}
			}
		}

		console.log('Catégorie réelle trouvée:', category);

		if (!category || !realAtrId) {
			console.log('Impossible de retrouver la catégorie réelle');
			return json({ error: 'Catégorie non trouvée' }, { status: 404 });
		}

		// Vérifier si l'attribut est utilisé dans kit_attribute
		const usageCount = await prisma.kit_attribute.count({
			where: {
				OR: [{ fk_attribute: realAtrId }, { fk_attribute_carac: realAtrId }]
			}
		});
		console.log("Nombre d'utilisations trouvées:", usageCount);

		if (usageCount > 0) {
			console.log('Catégorie utilisée dans des kits, suppression impossible');
			return json(
				{ error: 'Impossible de supprimer cette catégorie car elle est utilisée dans des kits' },
				{ status: 400 }
			);
		}

		// Vérifier l'impact de la suppression
		const { count: affectedCount, samples } = await countAffectedCategories(category);
		console.log(`Suppression affecterait ${affectedCount} sous-catégories`);

		// Protection contre les suppressions trop fortes
		if (affectedCount > PROTECTION_THRESHOLDS.BLOCK_OPERATION) {
			return json(
				{
					error: `Impossible de supprimer cette catégorie : elle contient ${affectedCount}+ sous-catégories`,
					affectedCount,
					affectedCategories: samples
				},
				{ status: 409 }
			);
		}

		// Supprimer toutes les sous-catégories
		console.log('Suppression des sous-catégories...');
		const deleteResult = await prisma.attribute_dev.deleteMany({
			where: {
				OR: [{ atr_nat: category.atr_val }, { atr_nat: { startsWith: `${category.atr_val}_` } }]
			}
		});
		console.log('Résultat de la suppression des sous-catégories:', deleteResult);

		// Supprimer la catégorie elle-même
		console.log('Suppression de la catégorie principale...');
		const mainDeleteResult = await prisma.attribute_dev.delete({
			where: {
				atr_id: realAtrId
			}
		});
		console.log('Résultat de la suppression de la catégorie principale:', mainDeleteResult);

		console.log('=== Fin DELETE /api/categories/[id] ===');
		return json({
			success: true,
			message:
				affectedCount === 0
					? 'Catégorie supprimée avec succès'
					: `Catégorie et ${affectedCount} sous-catégories supprimées`,
			deletedCategory: category.atr_label,
			affectedCount
		});
	} catch (error) {
		console.error('Erreur lors de la suppression de la catégorie:', error);
		return json({ error: 'Erreur lors de la suppression de la catégorie' }, { status: 500 });
	}
};
