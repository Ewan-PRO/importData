import type { Actions } from './$types';
import { dev } from '$app/environment';

console.log('==== CONFIGURATION ACTIONS AUTHENTICATION ====');
console.log('Environnement dev:', dev);

export const actions: Actions = {
	signIn: async ({ locals }) => {
		const baseUrl = dev
			? 'http://localhost:5173'
			: 'http://gc0wo8k0swkgcswkowkkw8o8.151.80.117.67.sslip.io';

		console.log('Action signIn déclenchée');
		console.log('URL de base utilisée:', baseUrl);
		console.log('URL de callback complète:', `${baseUrl}/callback`);

		try {
			await locals.logtoClient.signIn(`${baseUrl}/callback`);
			console.log('Redirection vers Logto initiée avec succès');
		} catch (error) {
			console.error('Erreur lors de la redirection vers Logto:', error);
			throw error;
		}
	},
	signOut: async ({ locals }) => {
		const baseUrl = dev
			? 'http://localhost:5173'
			: 'http://gc0wo8k0swkgcswkowkkw8o8.151.80.117.67.sslip.io';

		console.log('Action signOut déclenchée');
		console.log('URL de redirection après déconnexion:', `${baseUrl}/`);

		try {
			await locals.logtoClient.signOut(`${baseUrl}/`);
			console.log('Déconnexion initiée avec succès');
		} catch (error) {
			console.error('Erreur lors de la déconnexion:', error);
			throw error;
		}
	}
};
