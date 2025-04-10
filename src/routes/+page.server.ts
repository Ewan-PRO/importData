import type { Actions } from './$types';
import { dev } from '$app/environment';

export const actions: Actions = {
	signIn: async ({ locals }) => {
		const baseUrl = dev
			? 'http://localhost:5173'
			: 'http://gc0wo8k0swkgcswkowkkw8o8.151.80.117.67.sslip.io';

		// Obtenir l'URL de redirection de Logto
		const redirectUrl = await locals.logtoClient.signIn(`${baseUrl}/callback`);

		// Retourner l'URL pour redirection côté client
		return {
			redirectUrl
		};
	},
	signOut: async ({ locals }) => {
		const baseUrl = dev
			? 'http://localhost:5173'
			: 'http://gc0wo8k0swkgcswkowkkw8o8.151.80.117.67.sslip.io';

		const redirectUrl = await locals.logtoClient.signOut(`${baseUrl}/`);
		return {
			redirectUrl
		};
	}
};
