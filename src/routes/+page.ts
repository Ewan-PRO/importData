import type { Load } from '@sveltejs/kit';

export interface UserData {
	id: string;
	name?: string;
	email?: string;
	// Ajoutez d'autres propriétés selon votre modèle utilisateur
}

export interface PageData {
	user: UserData | null;
}

export const load = (async ({ parent, url }) => {
	const data = await parent();

	// Récupérer les paramètres d'erreur depuis l'URL
	const error = url.searchParams.get('error');
	const route = url.searchParams.get('route');

	return {
		user: data.user || null,
		authError: error === 'auth' ? route : null
	};
}) satisfies Load;
