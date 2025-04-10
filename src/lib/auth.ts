import type { UserInfoResponse } from '@logto/sveltekit';

export const isAuthenticated = (user: UserInfoResponse | undefined | null): boolean => {
	return !!user;
};

export const hasRole = (user: UserInfoResponse | undefined | null, role: string): boolean => {
	if (!user || !user.roles) return false;
	return user.roles.includes(role);
};
