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

export const load = (async ({ parent }) => {
	const data = await parent();

	return {
		user: data.user || null
	};
}) satisfies Load;
