import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url, request }) => {
	console.log('==== DÉBUT TRAITEMENT CALLBACK ====');
	console.log('URL complète:', url.toString());
	console.log('Paramètres URL:', Object.fromEntries(url.searchParams.entries()));
	console.log('Client Logto disponible:', !!locals.logtoClient);
	console.log('Utilisateur actuel:', locals.user ? 'Présent' : 'Absent');

	// Vérifier les cookies
	const cookies = request.headers.get('cookie');
	console.log('Cookies disponibles:', cookies);

	try {
		console.log('Tentative de traitement du callback...');
		// Cette ligne est CRITIQUE pour traiter la redirection OAuth
		await locals.logtoClient.handleSignInCallback(url.toString());

		console.log('Callback traité avec succès, redirection vers /');
		throw redirect(302, '/');
	} catch (unknownError) {
		console.error('==== ERREUR DÉTAILLÉE CALLBACK ====');
		// Conversion du type unknown en objet pour pouvoir accéder aux propriétés en toute sécurité
		const error = unknownError as Error & {
			response?: {
				status?: number;
				statusText?: string;
				data?: unknown; // Remplacé 'any' par 'unknown' pour éviter l'erreur ESLint
			};
		};

		console.error("Type d'erreur:", error.constructor.name);
		console.error("Message d'erreur:", error.message);
		console.error('Stack trace:', error.stack);

		if (error.response) {
			console.error("Réponse d'erreur:", {
				status: error.response.status,
				statusText: error.response.statusText,
				data: error.response.data
			});
		}

		console.error('==== FIN ERREUR DÉTAILLÉE ====');
		throw redirect(
			302,
			`/acces-refuse?error=${encodeURIComponent(error.message || 'Erreur inconnue')}`
		);
	}
};
