import { error } from '@sveltejs/kit';
import { protect } from '$lib/auth/protect';
import { getProductsForWordPress } from './repositories/wordpress.repository';
import { generateWordPressCSV } from './services/wordpress.csv-generator';
import type { RequestHandler } from './$types';

/**
 * API GET pour téléchargement direct du CSV WordPress
 * Alternative à l'action POST dans +page.server.ts
 *
 * Usage : GET /wordpress?format=csv
 * Retourne : Fichier CSV wordpress_products_YYYY-MM-DD.csv
 */
export const GET: RequestHandler = async (event) => {
	await protect(event);

	try {
		console.log('📥 Démarrage export WordPress (API GET)...');

		// Récupérer tous les produits
		const products = await getProductsForWordPress();
		console.log(`✅ ${products.length} produits récupérés`);

		// Générer le CSV
		const csv = generateWordPressCSV(products);
		console.log(`✅ CSV généré (${csv.length} caractères)`);

		// Générer nom de fichier avec timestamp
		const timestamp = new Date().toISOString().split('T')[0];
		const filename = `wordpress_products_${timestamp}.csv`;

		console.log(`✅ Export WordPress terminé : ${filename}`);

		// Retourner le fichier CSV
		return new Response(csv, {
			headers: {
				'Content-Type': 'text/csv; charset=utf-8',
				'Content-Disposition': `attachment; filename="${filename}"`
			}
		});
	} catch (err) {
		console.error('❌ Erreur export WordPress (API GET):', err);
		throw error(500, 'Erreur lors de la génération du CSV');
	}
};
