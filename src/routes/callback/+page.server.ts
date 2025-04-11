import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
	try {
		// Cette ligne est essentielle pour traiter le callback OAuth
		await locals.logtoClient.handleSignInCallback(url.toString());

		// Une fois l'authentification traitée, redirigez vers la page d'accueil
		throw redirect(302, '/');
	} catch (error) {
		if (error instanceof redirect) {
			throw error;
		}
		console.error('Erreur lors de la gestion du callback:', error);
		throw redirect(302, '/acces-refuse');
	}
};
