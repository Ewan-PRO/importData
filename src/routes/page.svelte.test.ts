import { describe, test, expect, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/svelte';
import Page from './+page.svelte';

// Mock du composant UserInfo
vi.mock('$lib/components/UserInfo.svelte', () => ({
	default: vi.fn(() => ({
		$$: {},
		$set: vi.fn(),
		$destroy: vi.fn(),
		$on: vi.fn()
	}))
}));

describe('/+page.svelte', () => {
	test('should render h1', () => {
		// Fournir les données nécessaires au composant
		const mockData = {
			user: null, // Simuler un utilisateur non connecté
			authError: null
		};

		render(Page, { props: { data: mockData } });
		expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
	});

	test('should render login form when user is not connected', () => {
		const mockData = {
			user: null,
			authError: null
		};

		render(Page, { props: { data: mockData } });
		expect(screen.getByText('Se connecter12')).toBeInTheDocument();
	});

	test('should render user info when user is connected', () => {
		const mockData = {
			user: {
				id: '1',
				name: 'Test User',
				email: 'test@example.com'
			},
			authError: null
		};

		render(Page, { props: { data: mockData } });
		expect(screen.getByText('Vous êtes connecté !')).toBeInTheDocument();
	});
});
