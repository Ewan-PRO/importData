import { getClient } from '$lib/prisma-meta';
import type { PrismaClient as CenovDevPrismaClient } from '../../../../prisma/cenov_dev/generated';

export interface WordPressProduct {
	type: string;
	sku: string;
	name: string | null;
	published: boolean;
	featured: boolean;
	visibility: string;
	short_description: string | null;
	description: string | null;
	in_stock: boolean;
	regular_price: string | null;
	images: string | null;
	brand: string | null;
}

/**
 * Récupère tous les produits formatés pour l'export WordPress/WooCommerce
 * @returns Liste des produits avec tous les champs requis par WordPress
 */
export async function getProductsForWordPress(): Promise<WordPressProduct[]> {
	const prisma = (await getClient('cenov_dev')) as unknown as CenovDevPrismaClient;

	const products = await prisma.$queryRaw<WordPressProduct[]>`
    SELECT
      COALESCE(p.pro_type::text, 'simple') AS type,
      p.pro_cenov_id AS sku,
      COALESCE(p.pro_name, p.pro_cenov_id) AS name,
      COALESCE(p.is_published, false) AS published,
      COALESCE(p.is_featured, false) AS featured,
      COALESCE(p.pro_visibility::text, 'visible') AS visibility,
      p.pro_short_description AS short_description,
      p.pro_description AS description,
      COALESCE(p.in_stock, true) AS in_stock,
      pp.pp_amount::TEXT AS regular_price,
      d.doc_link_source AS images,
      s.sup_label AS brand

    FROM produit.product p

    -- Dernier prix d'achat
    LEFT JOIN LATERAL (
      SELECT pp_amount
      FROM produit.price_purchase
      WHERE fk_product = p.pro_id
      ORDER BY pp_date DESC
      LIMIT 1
    ) pp ON true

    -- Première image active
    LEFT JOIN LATERAL (
      SELECT doc_link_source
      FROM public.document
      WHERE product_id = p.pro_id AND is_active = true
      ORDER BY created_at DESC
      LIMIT 1
    ) d ON true

    -- Fournisseur (brand)
    LEFT JOIN public.supplier s ON p.fk_supplier = s.sup_id

    WHERE p.pro_cenov_id IS NOT NULL  -- UGS obligatoire pour WordPress

    ORDER BY p.pro_id ASC;
  `;

	return products;
}

/**
 * Récupère les statistiques d'export pour affichage dans l'interface
 * @returns Statistiques : total, publiés, en stock, sans nom, sans prix
 */
export async function getExportStats() {
	const prisma = (await getClient('cenov_dev')) as unknown as CenovDevPrismaClient;

	const [total, published, in_stock, missing_name, missing_price] = await Promise.all([
		// Total produits avec UGS
		prisma.product.count({ where: { pro_cenov_id: { not: null } } }),

		// Produits publiés
		prisma.product.count({ where: { is_published: true, pro_cenov_id: { not: null } } }),

		// Produits en stock
		prisma.product.count({ where: { in_stock: true, pro_cenov_id: { not: null } } }),

		// Produits sans nom (fallback sur UGS)
		prisma.product.count({ where: { pro_name: null, pro_cenov_id: { not: null } } }),

		// Produits sans prix
		prisma.$queryRaw<[{ count: bigint }]>`
      SELECT COUNT(*)::bigint AS count
      FROM produit.product p
      WHERE p.pro_cenov_id IS NOT NULL
        AND NOT EXISTS (
          SELECT 1 FROM produit.price_purchase WHERE fk_product = p.pro_id
        )
    `.then((r) => Number(r[0].count))
	]);

	return {
		total: Number(total),
		published: Number(published),
		in_stock: Number(in_stock),
		missing_name: Number(missing_name),
		missing_price: Number(missing_price)
	};
}
