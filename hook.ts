import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const response = await resolve(event);

	response.headers.set(
		'Content-Security-Policy',
		"form-action 'self' http://gc0wo8k0swkgcswkowkkw8o8.151.80.117.67.sslip.io;"
	);

	return response;
};
