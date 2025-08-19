// Polyfills globaux pour __dirname et __filename en ES modules
// Doit être défini AVANT tous les imports pour Prisma
if (typeof globalThis.__dirname === 'undefined') {
	globalThis.__dirname = '/app';
}
if (typeof globalThis.__filename === 'undefined') {
	globalThis.__filename = '/app/index.js';
}

import { handleLogto, UserScope } from '@logto/sveltekit';
import { env } from '$env/dynamic/private';
import type { Handle } from '@sveltejs/kit';

console.log('🚀 [HOOKS] Initialisation des hooks serveur');
console.log("🔧 [HOOKS] Variables d'environnement:", {
	endpoint: env.SECRET_LOGTO_ENDPOINT ? 'DÉFINI' : 'NON DÉFINI',
	appId: env.SECRET_LOGTO_APP_ID ? 'DÉFINI' : 'NON DÉFINI',
	appSecret: env.SECRET_LOGTO_APP_SECRET ? 'DÉFINI' : 'NON DÉFINI',
	encryptionKey: env.SECRET_LOGTO_COOKIE_ENCRYPTION_KEY ? 'DÉFINI' : 'NON DÉFINI'
});

const logtoHandle = handleLogto(
	{
		endpoint: env.SECRET_LOGTO_ENDPOINT,
		appId: env.SECRET_LOGTO_APP_ID,
		appSecret: env.SECRET_LOGTO_APP_SECRET,
		scopes: [UserScope.Email, UserScope.Profile]
	},
	{ encryptionKey: env.SECRET_LOGTO_COOKIE_ENCRYPTION_KEY }
);

export const handle: Handle = async ({ event, resolve }) => {
	console.log(`🌐 [HOOKS] Requête entrante: ${event.request.method} ${event.url.pathname}`);
	console.log('🔍 [HOOKS] Headers:', Object.fromEntries(event.request.headers));

	try {
		// Appliquer le handle Logto
		const response = await logtoHandle({ event, resolve });

		console.log('👤 [HOOKS] État utilisateur après auth:', {
			userExists: !!event.locals.user,
			userId: event.locals.user?.id || 'N/A',
			userEmail: event.locals.user?.email || 'N/A'
		});

		console.log(`✅ [HOOKS] Réponse: ${response.status} pour ${event.url.pathname}`);
		return response;
	} catch (error) {
		console.error('❌ [HOOKS] Erreur dans le handle:', error);
		throw error;
	}
};
