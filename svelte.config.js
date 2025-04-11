import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter(),
		// Ajout de cette configuration pour résoudre le problème CORS
		csrf: {
			checkOrigin: false // Désactive la vérification d'origine CSRF
		}
	}
};

export default config;
