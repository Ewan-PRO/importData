import { error } from '@sveltejs/kit';
import { protect } from '$lib/auth/protect';
import { getExportStats, getAllProductsSummary } from './repositories/wordpress.repository';
import type { PageServerLoad } from './$types';

/**
 * Charge les statistiques d'export et la liste des produits pour affichage dans l'interface
 * Protégé par authentification
 */
export const load: PageServerLoad = async (event) => {
	await protect(event);

	try {
		const [stats, products] = await Promise.all([getExportStats(), getAllProductsSummary()]);

		return { stats, products };
	} catch (err) {
		console.error('Erreur chargement données WordPress:', err);
		throw error(500, 'Erreur lors du chargement des données');
	}
};
