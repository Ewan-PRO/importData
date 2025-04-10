import type { Actions } from './$types';
import { dev } from '$app/environment';

export const actions: Actions = {
	signIn: async ({ locals }) => {
		const baseUrl = dev ? 'http://localhost:5173' : 'http://app-dev.cenov-distribution.fr';

		await locals.logtoClient.signIn(`${baseUrl}/callback`);
	},
	signOut: async ({ locals }) => {
		const baseUrl = dev ? 'http://localhost:5173' : 'http://app-dev.cenov-distribution.fr';

		await locals.logtoClient.signOut(`${baseUrl}/`);
	}
};
