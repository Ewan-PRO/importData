import tailwindcss from '@tailwindcss/vite';
import { svelteTesting } from '@testing-library/svelte/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	define: {
		// Polyfills globaux pour Node.js
		global: 'globalThis'
	},
	ssr: {
		// Forcer Prisma standard à rester externe
		external: ['@prisma/client', '.prisma/client'],
		// Forcer l'inclusion du 2ème client cenov_dev dans le bundle SSR
		noExternal: ['../../prisma/cenov_dev/generated']
	},
	optimizeDeps: {
		// Exclure Prisma de l'optimisation des dépendances
		exclude: ['@prisma/client', '.prisma/client']
	},
	test: {
		projects: [
			{
				extends: './vite.config.ts',
				plugins: [svelteTesting()],
				test: {
					name: 'client',
					environment: 'jsdom',
					clearMocks: true,
					include: ['src/**/*.svelte.{test,spec}.{js,ts}'],
					exclude: ['src/lib/server/**'],
					setupFiles: ['./vitest-setup-client.ts']
				}
			},
			{
				extends: './vite.config.ts',
				test: {
					name: 'server',
					environment: 'node',
					include: ['src/**/*.{test,spec}.{js,ts}', 'tests/**/*.{test,spec}.{js,ts}'],
					exclude: ['src/**/*.svelte.{test,spec}.{js,ts}']
				}
			}
		]
	}
});
