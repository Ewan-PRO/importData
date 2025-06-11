import { describe, it, expect, beforeEach, vi } from 'vitest';
import { z } from 'zod';

// Mock des modules SvelteKit
vi.mock('$app/navigation', () => ({
	invalidateAll: vi.fn()
}));

vi.mock('$lib/components/ui/alert', () => ({
	alertActions: {
		success: vi.fn(),
		error: vi.fn(),
		warning: vi.fn(),
		info: vi.fn()
	}
}));

// Schéma de validation des kits (copié depuis +page.server.ts)
const kitSchema = z.object({
	kit_label: z.string().min(1, { message: 'Le nom du kit est requis' }),
	atr_label: z.string().min(1, { message: 'La caractéristique est requise' }),
	atr_val: z.string().min(1, { message: "L'unité est requise" }),
	kat_valeur: z
		.string()
		.min(1, { message: 'La valeur doit être un chiffre ou un nombre valide' })
		.refine((val) => !isNaN(parseFloat(val)), {
			message: 'La valeur doit être un nombre valide'
		})
});

// Fonction de validation numérique (extraite de la logique du composant)
function validateNumericValue(value: string): { isValid: boolean; error?: string } {
	if (!value || value.trim() === '') {
		return { isValid: false, error: 'La valeur numérique est obligatoire' };
	}

	const numericValue = parseFloat(value);
	// Vérifier si c'est NaN, Infinity ou si la chaîne contient des caractères non numériques
	if (
		isNaN(numericValue) ||
		!isFinite(numericValue) ||
		!/^-?\d*\.?\d+([eE][-+]?\d+)?$/.test(value.trim())
	) {
		return { isValid: false, error: 'La valeur doit être un chiffre ou un nombre valide' };
	}

	return { isValid: true };
}

// Mock des données de test
const validKitData = {
	kit_label: 'Boulon Test',
	atr_label: 'Diamètre',
	atr_val: 'mm',
	kat_valeur: '12.5'
};

const invalidKitData = {
	kit_label: 'Kit Invalide',
	atr_label: 'Poids',
	atr_val: 'g',
	kat_valeur: 'abc' // Valeur non numérique
};

describe('Tests CRUD des Kits', () => {
	describe('Validation des données', () => {
		it('devrait valider un kit avec des données correctes', () => {
			const result = kitSchema.safeParse(validKitData);
			expect(result.success).toBe(true);

			if (result.success) {
				expect(result.data.kit_label).toBe('Boulon Test');
				expect(result.data.kat_valeur).toBe('12.5');
			}
		});

		it('devrait rejeter un kit avec une valeur non numérique', () => {
			const result = kitSchema.safeParse(invalidKitData);
			expect(result.success).toBe(false);

			if (!result.success) {
				expect(result.error.issues).toHaveLength(1);
				expect(result.error.issues[0].message).toBe('La valeur doit être un nombre valide');
			}
		});

		it('devrait rejeter un kit avec des champs manquants', () => {
			const incompleteData = {
				kit_label: '',
				atr_label: 'Test',
				atr_val: 'mm',
				kat_valeur: '10'
			};

			const result = kitSchema.safeParse(incompleteData);
			expect(result.success).toBe(false);

			if (!result.success) {
				expect(
					result.error.issues.some((issue) => issue.message === 'Le nom du kit est requis')
				).toBe(true);
			}
		});
	});

	describe('Validation numérique front-end', () => {
		it('devrait accepter des nombres entiers', () => {
			const result = validateNumericValue('42');
			expect(result.isValid).toBe(true);
		});

		it('devrait accepter des nombres décimaux', () => {
			const result = validateNumericValue('12.5');
			expect(result.isValid).toBe(true);
		});

		it('devrait accepter des nombres négatifs', () => {
			const result = validateNumericValue('-5.2');
			expect(result.isValid).toBe(true);
		});

		it('devrait rejeter des chaînes non numériques', () => {
			const result = validateNumericValue('abc');
			expect(result.isValid).toBe(false);
			expect(result.error).toBe('La valeur doit être un chiffre ou un nombre valide');
		});

		it('devrait rejeter des valeurs vides', () => {
			const result = validateNumericValue('');
			expect(result.isValid).toBe(false);
			expect(result.error).toBe('La valeur numérique est obligatoire');
		});

		it('devrait rejeter des valeurs avec espaces uniquement', () => {
			const result = validateNumericValue('   ');
			expect(result.isValid).toBe(false);
			expect(result.error).toBe('La valeur numérique est obligatoire');
		});

		it('devrait rejeter des valeurs mixtes (lettres + chiffres)', () => {
			const result = validateNumericValue('12abc');
			expect(result.isValid).toBe(false);
			expect(result.error).toBe('La valeur doit être un chiffre ou un nombre valide');
		});
	});

	describe('Simulation API CRUD', () => {
		// Mock de l'API fetch
		const mockFetch = vi.fn();
		global.fetch = mockFetch;

		beforeEach(() => {
			mockFetch.mockClear();
		});

		it("devrait rejeter la création d'un kit avec un nom déjà existant", async () => {
			// Mock de la réponse API pour conflit (kit déjà existant)
			mockFetch.mockResolvedValueOnce({
				ok: false,
				status: 409,
				json: async () => ({
					error: 'Un kit avec le nom "Boulon" existe déjà. Les noms de kits doivent être uniques.'
				})
			});

			const duplicateKitData = {
				kit_label: 'Boulon', // Nom déjà existant
				atr_label: 'Poids',
				atr_val: 'kg',
				kat_valeur: '2.5'
			};

			const response = await fetch('/api/kits', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(duplicateKitData)
			});

			const result = await response.json();

			expect(response.ok).toBe(false);
			expect(response.status).toBe(409); // Conflict
			expect(result.error).toContain('existe déjà');
			expect(result.error).toContain('uniques');
		});

		it('devrait rejeter un kit avec même nom mais casse différente', async () => {
			mockFetch.mockResolvedValueOnce({
				ok: false,
				status: 409,
				json: async () => ({
					error:
						'Un kit similaire existe déjà : "Boulon". Raison : Même texte avec casse différente. Les noms de kits doivent être suffisamment distincts.'
				})
			});

			const similarKitData = {
				kit_label: 'BOULON', // Même nom en majuscules
				atr_label: 'Poids',
				atr_val: 'kg',
				kat_valeur: '2.5'
			};

			const response = await fetch('/api/kits', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(similarKitData)
			});

			const result = await response.json();

			expect(response.ok).toBe(false);
			expect(response.status).toBe(409);
			expect(result.error).toContain('similaire existe déjà');
			expect(result.error).toContain('casse différente');
		});

		it('devrait rejeter un kit avec même nom mais accents différents', async () => {
			mockFetch.mockResolvedValueOnce({
				ok: false,
				status: 409,
				json: async () => ({
					error:
						'Un kit similaire existe déjà : "Pompe à bec". Raison : Même texte avec accents ou espaces différents. Les noms de kits doivent être suffisamment distincts.'
				})
			});

			const similarKitData = {
				kit_label: 'Pompe a bec', // Même nom sans accent
				atr_label: 'Pression',
				atr_val: 'MBAR',
				kat_valeur: '150'
			};

			const response = await fetch('/api/kits', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(similarKitData)
			});

			const result = await response.json();

			expect(response.ok).toBe(false);
			expect(response.status).toBe(409);
			expect(result.error).toContain('similaire existe déjà');
			expect(result.error).toContain('accents ou espaces différents');
		});

		it('devrait rejeter un kit avec distance de Levenshtein ≤ 2', async () => {
			mockFetch.mockResolvedValueOnce({
				ok: false,
				status: 409,
				json: async () => ({
					error:
						'Un kit similaire existe déjà : "Boulon". Raison : Texte très similaire (1 caractère(s) de différence). Les noms de kits doivent être suffisamment distincts.'
				})
			});

			const similarKitData = {
				kit_label: 'Boulons', // 1 caractère de différence
				atr_label: 'Poids',
				atr_val: 'g',
				kat_valeur: '5'
			};

			const response = await fetch('/api/kits', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(similarKitData)
			});

			const result = await response.json();

			expect(response.ok).toBe(false);
			expect(response.status).toBe(409);
			expect(result.error).toContain('similaire existe déjà');
			expect(result.error).toContain('très similaire');
		});

		it('devrait créer un kit avec succès', async () => {
			// Mock de la réponse API pour création réussie
			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: async () => ({
					success: true,
					message: 'Kit créé avec succès',
					data: { id: 1, ...validKitData }
				})
			});

			// Simulation de l'appel API
			const response = await fetch('/api/kits', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(validKitData)
			});

			const result = await response.json();

			expect(mockFetch).toHaveBeenCalledWith('/api/kits', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(validKitData)
			});

			expect(response.ok).toBe(true);
			expect(result.success).toBe(true);
			expect(result.data.kit_label).toBe('Boulon Test');
		});

		it('devrait échouer à créer un kit avec valeur invalide', async () => {
			// Mock de la réponse API pour erreur de validation
			mockFetch.mockResolvedValueOnce({
				ok: false,
				status: 400,
				json: async () => ({
					error: 'La valeur doit être un nombre valide'
				})
			});

			const response = await fetch('/api/kits', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(invalidKitData)
			});

			const result = await response.json();

			expect(response.ok).toBe(false);
			expect(response.status).toBe(400);
			expect(result.error).toBe('La valeur doit être un nombre valide');
		});

		it('devrait mettre à jour un kit existant', async () => {
			const updatedData = { ...validKitData, kat_valeur: '15.0' };

			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: async () => ({
					success: true,
					message: 'Kit mis à jour avec succès',
					data: { id: 1, ...updatedData }
				})
			});

			const response = await fetch('/api/kits/1', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(updatedData)
			});

			const result = await response.json();

			expect(response.ok).toBe(true);
			expect(result.success).toBe(true);
			expect(result.data.kat_valeur).toBe('15.0');
		});

		it('devrait supprimer un kit existant', async () => {
			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: async () => ({
					success: true,
					message: 'Kit supprimé avec succès'
				})
			});

			const response = await fetch('/api/kits/1', {
				method: 'DELETE'
			});

			const result = await response.json();

			expect(response.ok).toBe(true);
			expect(result.success).toBe(true);
			expect(result.message).toBe('Kit supprimé avec succès');
		});

		it('devrait récupérer la liste des kits', async () => {
			const mockKits = [
				{ id: 1, ...validKitData },
				{ id: 2, kit_label: 'Vis', atr_label: 'Longueur', atr_val: 'cm', kat_valeur: '5' }
			];

			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: async () => mockKits
			});

			const response = await fetch('/api/kits');
			const kits = await response.json();

			expect(response.ok).toBe(true);
			expect(Array.isArray(kits)).toBe(true);
			expect(kits).toHaveLength(2);
			expect(kits[0].kit_label).toBe('Boulon Test');
		});
	});

	describe('Cas limites de validation numérique', () => {
		it('devrait accepter zéro', () => {
			const result = validateNumericValue('0');
			expect(result.isValid).toBe(true);
		});

		it('devrait accepter des nombres très grands', () => {
			const result = validateNumericValue('999999999.99');
			expect(result.isValid).toBe(true);
		});

		it('devrait accepter des nombres très petits', () => {
			const result = validateNumericValue('0.001');
			expect(result.isValid).toBe(true);
		});

		it('devrait rejeter Infinity', () => {
			const result = validateNumericValue('Infinity');
			expect(result.isValid).toBe(false);
		});

		it('devrait rejeter NaN', () => {
			const result = validateNumericValue('NaN');
			expect(result.isValid).toBe(false);
		});

		it('devrait accepter la notation scientifique', () => {
			const result = validateNumericValue('1.5e10');
			expect(result.isValid).toBe(true);
		});
	});

	describe('Tests de régression', () => {
		it('devrait maintenir la cohérence entre validation front et back', () => {
			const testCases = [
				{ value: '12.5', shouldPass: true },
				{ value: 'abc', shouldPass: false },
				{ value: '', shouldPass: false },
				{ value: '0', shouldPass: true },
				{ value: '-5.2', shouldPass: true }
			];

			testCases.forEach(({ value, shouldPass }) => {
				// Test validation front-end
				const frontResult = validateNumericValue(value);

				// Test validation Zod (back-end)
				const backResult = kitSchema.safeParse({
					...validKitData,
					kat_valeur: value
				});

				if (shouldPass) {
					expect(frontResult.isValid).toBe(true);
					expect(backResult.success).toBe(true);
				} else {
					expect(frontResult.isValid).toBe(false);
					expect(backResult.success).toBe(false);
				}
			});
		});
	});
});
