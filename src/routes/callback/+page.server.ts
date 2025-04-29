import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
	try {
		// Cette ligne est CRITIQUE pour traiter la redirection OAuth
		await locals.logtoClient.handleSignInCallback(url.toString());

		throw redirect(302, '/');
	} catch (unknownError) {
		// Conversion du type unknown en objet pour pouvoir accéder aux propriétés en toute sécurité
		const error = unknownError as Error & {
			response?: {
				status?: number;
				statusText?: string;
				data?: unknown;
			};
		};

		throw redirect(
			302,
			`/acces-refuse?error=${encodeURIComponent(error.message || 'Erreur inconnue')}`
		);
	}
};
