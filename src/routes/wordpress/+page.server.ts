import { error } from '@sveltejs/kit';
import { protect } from '$lib/auth/protect';
import { getProductsForWordPress, getExportStats } from './repositories/wordpress.repository';
import { generateWordPressCSV } from './services/wordpress.csv-generator';
import type { Actions, PageServerLoad } from './$types';

/**
 * Charge les statistiques d'export pour affichage dans l'interface
 * Protégé par authentification
 */
export const load: PageServerLoad = async (event) => {
	await protect(event);

	try {
		const stats = await getExportStats();

		return { stats };
	} catch (err) {
		console.error('Erreur chargement statistiques WordPress:', err);
		throw error(500, 'Erreur lors du chargement des statistiques');
	}
};

/**
 * Actions disponibles sur la page WordPress
 */
export const actions: Actions = {
	/**
	 * Génère et télécharge le fichier CSV WordPress
	 * Format: wordpress_products_YYYY-MM-DD.csv
	 */
	download: async (event) => {
		await protect(event);

		try {
			console.log('📥 Démarrage export WordPress...');

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
			console.error('❌ Erreur export WordPress:', err);
			throw error(500, 'Erreur lors de la génération du CSV');
		}
	}
};
