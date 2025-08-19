import { json } from '@sveltejs/kit';
import { dev } from '$app/environment';
import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	console.log('🚀 [ENV-TEST] Test de configuration environnement');

	const useDevViews = env.USE_DEV_VIEWS === 'true' || dev;

	const config = {
		timestamp: new Date().toISOString(),
		environment: {
			NODE_ENV: env.NODE_ENV || 'non défini',
			dev: dev,
			USE_DEV_VIEWS: env.USE_DEV_VIEWS || 'non défini',
			useDevViews: useDevViews
		},
		tablesToUse: {
			categories: useDevViews ? 'v_categories_dev' : 'v_categories',
			kits: useDevViews ? 'v_kit_carac_dev' : 'v_kit_carac',
			attributes: useDevViews ? 'attribute_dev' : 'attribute'
		},
		recommendations: useDevViews
			? '⚠️ Utilisation des tables DEV - normal en développement'
			: '✅ Utilisation des tables PROD - normal en production'
	};

	console.log('📊 [ENV-TEST] Configuration détectée:', config);

	return json(config);
};
