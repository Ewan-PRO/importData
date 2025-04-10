import { protect } from '$lib/auth/protect';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const user = await protect(event);

	return {
		user
	};
};
