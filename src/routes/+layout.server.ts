import type { ServerLoadEvent } from '@sveltejs/kit';

export const load = async ({ locals }: ServerLoadEvent) => {
	console.log('==== CHARGEMENT LAYOUT ====');
	console.log('Utilisateur authentifié:', !!locals.user);

	if (locals.user) {
		console.log('Données utilisateur disponibles:', {
			sub: locals.user.sub,
			name: locals.user.name,
			email: locals.user.email
		});
	}

	return { user: locals.user };
};
