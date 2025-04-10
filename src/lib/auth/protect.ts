import { redirect } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';

export async function protect(event: RequestEvent) {
	const { locals } = event;

	if (!locals.user) {
		throw redirect(302, '/');
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
