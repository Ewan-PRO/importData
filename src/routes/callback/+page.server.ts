// src/routes/callback/+page.server.ts
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
	console.log('URL de callback reçue:', url.toString());
	console.log('Client Logto:', !!locals.logtoClient);
	try {
		// Cette ligne est CRITIQUE pour traiter la redirection OAuth
		await locals.logtoClient.handleSignInCallback(url.toString());

		// Rediriger vers la page d'accueil après succès
		throw redirect(302, '/');
	} catch (error) {
		console.error('Erreur lors du traitement du callback:', error);
		throw redirect(302, '/acces-refuse');
	}
};
