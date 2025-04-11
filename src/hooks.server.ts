import { handleLogto, UserScope } from '@logto/sveltekit';
import { env } from '$env/dynamic/private';

export const handle = handleLogto(
	{
		endpoint: env.SECRET_LOGTO_ENDPOINT,
		appId: env.SECRET_LOGTO_APP_ID,
		appSecret: env.SECRET_LOGTO_APP_SECRET,
		scopes: [UserScope.Email, UserScope.Profile]
	},
	{ encryptionKey: env.SECRET_LOGTO_COOKIE_ENCRYPTION_KEY }
);

console.log('Middleware Logto initialisé');
