import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	try {
		if (!locals.user) {
			return {};
		}

		throw redirect(302, '/');
	} catch (error) {
		if (error instanceof redirect) {
			throw error;
		}
		console.error('Erreur lors de la gestion du callback:', error);
		throw redirect(302, '/');
	}
};
