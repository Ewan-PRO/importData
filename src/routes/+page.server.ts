import type { Actions } from './$types';
import { dev } from '$app/environment';

// Définition d'un type pour les données de log
type LogData = Record<string, unknown> | null;

// Fonction pour enregistrer les logs dans la console et éventuellement les stocker
function logDebugInfo(message: string, data: LogData = null) {
	const timestamp = new Date().toISOString();
	const logEntry = {
		timestamp,
		message,
		data
	};

	console.log(`[DEBUG ${timestamp}] ${message}`, data ?? '');

	// Si en production, on pourrait envisager d'envoyer ces logs à un service
	return logEntry;
}

export const actions: Actions = {
	signIn: async ({ locals, request, url }) => {
		try {
			// Logging de démarrage
			logDebugInfo("Début de l'action signIn");

			// Logging des informations d'environnement
			logDebugInfo('Mode dev?', { dev });

			// Logging des informations de requête
			logDebugInfo('URL de la requête', { url: url.toString() });
			logDebugInfo('Méthode de la requête', { method: request.method });
			logDebugInfo('Headers de la requête', {
				headers: Object.fromEntries(request.headers.entries())
			});

			// Configuration de l'URL de base
			const baseUrl = dev
				? 'http://localhost:5173'
				: 'http://gc0wo8k0swkgcswkowkkw8o8.151.80.117.67.sslip.io';

			logDebugInfo('URL de base configurée', { baseUrl });
			logDebugInfo('URL de callback configurée', { callbackUrl: `${baseUrl}/callback` });

			// Vérification que logtoClient existe
			logDebugInfo('logtoClient disponible?', { hasLogtoClient: !!locals.logtoClient });

			// Exécution de la redirection Logto
			logDebugInfo("Tentative d'appel à logtoClient.signIn");
			await locals.logtoClient.signIn(`${baseUrl}/callback`);

			logDebugInfo('Redirection logtoClient.signIn terminée avec succès');
		} catch (error: unknown) {
			// Capture et logging des erreurs en détail
			const errorObj: Record<string, unknown> = {};

			if (error instanceof Error) {
				errorObj.name = error.name;
				errorObj.message = error.message;
				errorObj.stack = error.stack;
				errorObj.cause = error.cause;
			} else {
				errorObj.unknownError = String(error);
			}

			logDebugInfo('Erreur lors de la connexion', errorObj);

			// Lever à nouveau l'erreur pour que SvelteKit puisse la gérer
			throw error;
		}
	},
	signOut: async ({ locals }) => {
		try {
			logDebugInfo("Début de l'action signOut");

			const baseUrl = dev
				? 'http://localhost:5173'
				: 'http://gc0wo8k0swkgcswkowkkw8o8.151.80.117.67.sslip.io';

			logDebugInfo('URL de base configurée pour déconnexion', { baseUrl });

			await locals.logtoClient.signOut(`${baseUrl}/`);

			logDebugInfo('Déconnexion réussie');
		} catch (error: unknown) {
			const errorObj: Record<string, unknown> = {};

			if (error instanceof Error) {
				errorObj.name = error.name;
				errorObj.message = error.message;
				errorObj.stack = error.stack;
			} else {
				errorObj.unknownError = String(error);
			}

			logDebugInfo('Erreur lors de la déconnexion', errorObj);

			throw error;
		}
	}
};
