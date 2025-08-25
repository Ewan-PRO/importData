import { redirect } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';

export async function protect(event: RequestEvent) {
	const { locals, url } = event;

	if (!locals.user) {
		// Déterminer le nom de la route pour le message d'erreur
		const routeName = url.pathname.split('/')[1] || 'cette page';
		throw redirect(302, `/?error=auth&route=${encodeURIComponent(routeName)}`);
	}

	return locals.user;
}

export async function requireRole(event: RequestEvent, role: string) {
	const user = await protect(event);

	if (!user.roles?.includes(role)) {
		throw redirect(302, '/acces-refuse');
	}

	return user;
}
