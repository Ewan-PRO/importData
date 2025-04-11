import { handleLogto, UserScope } from '@logto/sveltekit';
import { env } from '$env/dynamic/private';
import { dev } from '$app/environment';

console.log('==== CONFIGURATION LOGTO ====');
console.log('Environnement dev:', dev);
console.log('LOGTO_ENDPOINT:', env.LOGTO_ENDPOINT);
console.log('LOGTO_APP_ID:', env.LOGTO_APP_ID);
console.log('LOGTO_APP_SECRET présent:', !!env.LOGTO_APP_SECRET);
console.log('LOGTO_COOKIE_ENCRYPTION_KEY présent:', !!env.LOGTO_COOKIE_ENCRYPTION_KEY);

export const handle = handleLogto(
	{
		endpoint: env.LOGTO_ENDPOINT,
		appId: env.LOGTO_APP_ID,
		appSecret: env.LOGTO_APP_SECRET,
		scopes: [UserScope.Email, UserScope.Profile]
	},
	{
		encryptionKey: env.LOGTO_COOKIE_ENCRYPTION_KEY ?? '',
		cookieKey: 'cenov_logto'
		// La propriété secureCookie n'est pas supportée dans l'API actuelle
		// La propriété sameSite n'est pas supportée non plus
	}
);

console.log('Middleware Logto initialisé');
