import LogtoClient from '@logto/browser';
import type { UserInfoResponse } from '@logto/sveltekit';

export const logtoClient = new LogtoClient({
	endpoint: 'https://sso.cenov-distribution.com/',
	appId: 'a1hkizv8g8ohcafsp63yg',
	scopes: ['openid', 'offline_access', 'profile', 'email'],
	resources: []
});

export const isAuthenticated = (user: UserInfoResponse | undefined | null): boolean => {
	return !!user;
};

export const hasRole = (user: UserInfoResponse | undefined | null, role: string): boolean => {
	if (!user || !user.roles) return false;
	return user.roles.includes(role);
};
