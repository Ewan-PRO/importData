/** @type {import('tailwindcss').Config} */
import flowbitePlugin from 'flowbite/plugin';

export default {
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		'./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'
	],
	theme: {
		extend: {
			colors: {
				primary: {
					DEFAULT: '#e31206',
					hover: '#af301f'
				},
				secondary: {
					DEFAULT: '#2563eb',
					hover: '#3c24ac'
				}
			}
		}
	},
	plugins: [flowbitePlugin]
};
