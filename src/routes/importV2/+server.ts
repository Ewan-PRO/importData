import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getClient } from '$lib/prisma-meta';
import type { PrismaClient as CenovDevPrismaClient } from '../../../prisma/cenov_dev/generated/index.js';

export const GET: RequestHandler = async ({ url }) => {
	try {
		const cat_code = url.searchParams.get('cat_code');
		const database =
			(url.searchParams.get('database') as 'cenov_dev' | 'cenov_preprod') || 'cenov_dev';

		if (!cat_code) {
			throw error(400, 'Catégorie non sélectionnée');
		}

		console.log(`🔍 Génération template pour catégorie: ${cat_code} (base: ${database})`);

		// 1. Charger le client Prisma
		const prisma = (await getClient(database)) as unknown as CenovDevPrismaClient;

		// 2. Charger la catégorie
		const category = await prisma.category.findFirst({
			where: { cat_code }
		});

		if (!category) {
			throw error(404, `Catégorie ${cat_code} introuvable`);
		}

		console.log(`✅ Catégorie trouvée: ${category.cat_label} (ID: ${category.cat_id})`);

		// 3. Charger les attributs liés à cette catégorie
		const categoryAttributes = await prisma.category_attribute.findMany({
			where: { fk_category: category.cat_id },
			include: {
				attribute: {
					select: { atr_value: true }
				}
			},
			orderBy: {
				attribute: { atr_value: 'asc' }
			}
		});

		console.log(`📊 Attributs trouvés: ${categoryAttributes.length}`);

		// 4. Construire les en-têtes CSV
		const metierHeaders = [
			'pro_cenov_id',
			'pro_code',
			'sup_code',
			'sup_label',
			'cat_code',
			'cat_label',
			'fk_document',
			'kit_label',
			'famille',
			'sous_famille',
			'sous_sous_famille',
			'pp_amount',
			'pp_date',
			'pp_discount'
		];

		const attributeHeaders = categoryAttributes
			.map((ca) => ca.attribute.atr_value)
			.filter((v): v is string => v !== null);

		const allHeaders = [...metierHeaders, ...attributeHeaders];

		console.log(`📋 En-têtes CSV: ${allHeaders.length} colonnes`);

		// 5. Générer le CSV (juste la ligne d'en-têtes)
		const csvContent = allHeaders.join(';') + '\n';

		console.log(`✅ Template généré avec succès`);

		// 6. Retourner le fichier CSV
		return new Response(csvContent, {
			status: 200,
			headers: {
				'Content-Type': 'text/csv; charset=utf-8',
				'Content-Disposition': `attachment; filename="template_${cat_code}.csv"`
			}
		});
	} catch (err) {
		console.error('❌ Erreur génération template:', err);

		if (err && typeof err === 'object' && 'status' in err) {
			throw err; // Re-throw SvelteKit errors
		}

		throw error(
			500,
			`Erreur génération template: ${err instanceof Error ? err.message : 'Erreur inconnue'}`
		);
	}
};
