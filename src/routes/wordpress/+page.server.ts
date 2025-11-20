import { error } from '@sveltejs/kit';
import { protect } from '$lib/auth/protect';
import { getExportStats } from './repositories/wordpress.repository';
import type { PageServerLoad } from './$types';

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
