import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, locals }) => {
	try {
		// Log des paramètres pour le débogage
		console.log('URL de callback:', url.toString());
		console.log('Paramètres:', Object.fromEntries(url.searchParams.entries()));

		// Ne pas rediriger immédiatement, laisser le code côté client gérer le callback
		if (locals.user) {
			// Si l'utilisateur est déjà authentifié, rediriger
			throw redirect(302, '/');
		}

		// Sinon, retourner les paramètres pour traitement côté client
		return {
			query: Object.fromEntries(url.searchParams.entries())
		};
	} catch (error) {
		if (error instanceof redirect) {
			throw error;
		}
		console.error('Erreur lors de la gestion du callback:', error);
		// Ne pas rediriger en cas d'erreur, pour permettre l'affichage de l'erreur
		return {
			error: error instanceof Error ? error.message : 'Erreur inconnue'
		};
	}
};
