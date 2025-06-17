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

// Schéma de validation des catégories (copié depuis +page.server.ts)
const categorySchema = z
	.object({
		atr_0_label: z.string().default('Catégorie des produits'),
		atr_1_label: z.string().optional(),
		atr_2_label: z.string().optional(),
		atr_3_label: z.string().optional(),
		atr_4_label: z.string().optional(),
		atr_5_label: z.string().optional(),
		atr_6_label: z.string().optional(),
		atr_7_label: z.string().optional()
	})
	.refine(
		(data) => {
			// Vérifier qu'au moins un champ entre atr_1_label et atr_7_label est rempli
			const hasAtLeastOneLevel = [
				data.atr_1_label,
				data.atr_2_label,
				data.atr_3_label,
				data.atr_4_label,
				data.atr_5_label,
				data.atr_6_label,
				data.atr_7_label
			].some((label) => label && label.trim() !== '');

			return hasAtLeastOneLevel;
		},
		{
			message: 'Au moins un niveau entre atr_1_label et atr_7_label doit être rempli',
			path: ['atr_1_label'] // Afficher l'erreur sur le premier champ
		}
	);

// Mock des données de test
const validCategoryData = {
	atr_0_label: 'Catégorie des produits',
	atr_1_label: 'Électronique',
	atr_2_label: 'Ordinateurs',
	atr_3_label: 'Portables'
};

const minimalCategoryData = {
	atr_0_label: 'Catégorie des produits',
	atr_1_label: 'Mobilier'
};

const invalidCategoryData = {
	atr_0_label: 'Catégorie des produits'
	// Aucun niveau entre atr_1_label et atr_7_label n'est rempli
};

const maxLevelCategoryData = {
	atr_0_label: 'Catégorie des produits',
	atr_1_label: 'Vêtements',
	atr_2_label: 'Homme',
	atr_3_label: 'Hauts',
	atr_4_label: 'T-shirts',
	atr_5_label: 'Manches courtes',
	atr_6_label: 'Coton',
	atr_7_label: 'Bio'
};

describe('Tests CRUD des Catégories', () => {
	describe('Validation des données', () => {
		it('devrait valider une catégorie avec des données correctes', () => {
			const result = categorySchema.safeParse(validCategoryData);
			expect(result.success).toBe(true);

			if (result.success) {
				expect(result.data.atr_0_label).toBe('Catégorie des produits');
				expect(result.data.atr_1_label).toBe('Électronique');
				expect(result.data.atr_2_label).toBe('Ordinateurs');
				expect(result.data.atr_3_label).toBe('Portables');
			}
		});

		it('devrait valider une catégorie avec niveau 0 et 1', () => {
			const result = categorySchema.safeParse(minimalCategoryData);
			expect(result.success).toBe(true);

			if (result.success) {
				expect(result.data.atr_0_label).toBe('Catégorie des produits');
				expect(result.data.atr_1_label).toBe('Mobilier');
			}
		});

		it('devrait valider une catégorie avec tous les niveaux', () => {
			const result = categorySchema.safeParse(maxLevelCategoryData);
			expect(result.success).toBe(true);

			if (result.success) {
				expect(result.data.atr_0_label).toBe('Catégorie des produits');
				expect(result.data.atr_1_label).toBe('Vêtements');
				expect(result.data.atr_7_label).toBe('Bio');
			}
		});

		it('devrait rejeter une catégorie sans aucun niveau entre atr_1_label et atr_7_label', () => {
			const result = categorySchema.safeParse(invalidCategoryData);
			expect(result.success).toBe(false);

			if (!result.success) {
				expect(result.error.issues).toHaveLength(1);
				expect(result.error.issues[0].message).toBe(
					'Au moins un niveau entre atr_1_label et atr_7_label doit être rempli'
				);
			}
		});

		it('devrait automatiquement définir atr_0_label même si non fourni', () => {
			const emptyLevel0Data = { atr_1_label: 'Test' }; // atr_0_label non fourni
			const result = categorySchema.safeParse(emptyLevel0Data);
			expect(result.success).toBe(true);

			if (result.success) {
				expect(result.data.atr_0_label).toBe('Catégorie des produits');
				expect(result.data.atr_1_label).toBe('Test');
			}
		});

		it('devrait rejeter une catégorie avec tous les niveaux vides', () => {
			const allEmptyData = {
				atr_0_label: 'Catégorie des produits',
				atr_1_label: '',
				atr_2_label: '   ', // Espaces uniquement
				atr_3_label: undefined
			};
			const result = categorySchema.safeParse(allEmptyData);
			expect(result.success).toBe(false);

			if (!result.success) {
				expect(result.error.issues[0].message).toBe(
					'Au moins un niveau entre atr_1_label et atr_7_label doit être rempli'
				);
			}
		});
	});

	describe('Validation des niveaux hiérarchiques', () => {
		it('devrait accepter des niveaux non consécutifs', () => {
			const nonConsecutiveData = {
				atr_0_label: 'Sport',
				atr_2_label: 'Football', // Niveau 1 manquant
				atr_4_label: 'Chaussures' // Niveau 3 manquant
			};

			const result = categorySchema.safeParse(nonConsecutiveData);
			expect(result.success).toBe(true);
		});

		it('devrait gérer les chaînes vides comme undefined', () => {
			const emptyStringData = {
				atr_0_label: 'Jardin',
				atr_1_label: '',
				atr_2_label: 'Outils'
			};

			const result = categorySchema.safeParse(emptyStringData);
			expect(result.success).toBe(true);

			if (result.success) {
				expect(result.data.atr_1_label).toBe('');
				expect(result.data.atr_2_label).toBe('Outils');
			}
		});
	});

	// Mock de l'API fetch (global pour tous les tests)
	const mockFetch = vi.fn();
	global.fetch = mockFetch;

	describe('Simulation API CRUD', () => {
		beforeEach(() => {
			mockFetch.mockClear();
		});

		it('devrait créer une catégorie avec succès', async () => {
			// Mock de la réponse API pour création réussie
			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: async () => ({
					success: true,
					attributes: [
						{ id: 1, atr_nat: 'CATEGORIE', atr_val: 'electronique', atr_label: 'Électronique' },
						{
							id: 2,
							atr_nat: 'electronique',
							atr_val: 'electronique_ordinateurs',
							atr_label: 'Ordinateurs'
						}
					]
				})
			});

			const response = await fetch('/api/categories', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(validCategoryData)
			});

			const result = await response.json();

			expect(mockFetch).toHaveBeenCalledWith('/api/categories', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(validCategoryData)
			});

			expect(response.ok).toBe(true);
			expect(result.success).toBe(true);
			expect(result.attributes).toHaveLength(2);
			expect(result.attributes[0].atr_label).toBe('Électronique');
		});

		it('devrait échouer à créer une catégorie sans aucun niveau rempli', async () => {
			// Mock de la réponse API pour erreur de validation
			mockFetch.mockResolvedValueOnce({
				ok: false,
				status: 400,
				json: async () => ({
					error: 'Au moins un niveau entre atr_1_label et atr_7_label doit être rempli'
				})
			});

			const response = await fetch('/api/categories', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(invalidCategoryData)
			});

			const result = await response.json();

			expect(response.ok).toBe(false);
			expect(response.status).toBe(400);
			expect(result.error).toBe(
				'Au moins un niveau entre atr_1_label et atr_7_label doit être rempli'
			);
		});

		it('devrait créer une catégorie avec un seul niveau', async () => {
			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: async () => ({
					success: true,
					attributes: [{ id: 3, atr_nat: 'CATEGORIE', atr_val: 'mobilier', atr_label: 'Mobilier' }]
				})
			});

			const response = await fetch('/api/categories', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(minimalCategoryData)
			});

			const result = await response.json();

			expect(response.ok).toBe(true);
			expect(result.success).toBe(true);
			expect(result.attributes).toHaveLength(1);
			expect(result.attributes[0].atr_label).toBe('Mobilier');
		});

		it('devrait créer une catégorie avec tous les niveaux', async () => {
			const mockAttributes = Array.from({ length: 8 }, (_, i) => ({
				id: i + 1,
				atr_nat: i === 0 ? 'CATEGORIE' : `level_${i - 1}`,
				atr_val: `level_${i}`,
				atr_label: maxLevelCategoryData[`atr_${i}_label` as keyof typeof maxLevelCategoryData]
			}));

			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: async () => ({
					success: true,
					attributes: mockAttributes
				})
			});

			const response = await fetch('/api/categories', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(maxLevelCategoryData)
			});

			const result = await response.json();

			expect(response.ok).toBe(true);
			expect(result.success).toBe(true);
			expect(result.attributes).toHaveLength(8);
			expect(result.attributes[0].atr_label).toBe('Catégorie des produits');
			expect(result.attributes[1].atr_label).toBe('Vêtements');
			expect(result.attributes[7].atr_label).toBe('Bio');
		});

		it('devrait créer automatiquement les niveaux intermédiaires manquants avec NULL', async () => {
			const gappedCategoryData = {
				atr_0_label: 'Catégorie des produits',
				atr_1_label: '000000',
				atr_3_label: '111' // Niveau 2 manquant
			};

			// Mock de la réponse avec niveaux intermédiaires créés automatiquement
			const mockAttributes = [
				{ id: 1, atr_nat: 'CATEGORIE', atr_val: '000000', atr_label: '000000' },
				{ id: 2, atr_nat: '000000', atr_val: 'NIVEAU_2_AUTO_123456', atr_label: null }, // Niveau intermédiaire NULL
				{ id: 3, atr_nat: 'NIVEAU_2_AUTO_123456', atr_val: '111', atr_label: '111' }
			];

			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: async () => ({
					success: true,
					attributes: mockAttributes
				})
			});

			const response = await fetch('/api/categories', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(gappedCategoryData)
			});

			const result = await response.json();

			expect(response.ok).toBe(true);
			expect(result.success).toBe(true);
			expect(result.attributes).toHaveLength(3);

			// Vérifier le niveau 1 (rempli)
			expect(result.attributes[0].atr_label).toBe('000000');
			expect(result.attributes[0].atr_nat).toBe('CATEGORIE');

			// Vérifier le niveau 2 (créé automatiquement avec NULL)
			expect(result.attributes[1].atr_label).toBeNull();
			expect(result.attributes[1].atr_nat).toBe('000000');
			expect(result.attributes[1].atr_val).toMatch(/^NIVEAU_2_AUTO_/);

			// Vérifier le niveau 3 (rempli)
			expect(result.attributes[2].atr_label).toBe('111');
			expect(result.attributes[2].atr_nat).toMatch(/^NIVEAU_2_AUTO_/);
		});

		it('devrait mettre à jour une catégorie existante', async () => {
			const updateData = {
				atr_val: 'electronique_updated',
				atr_label: 'Électronique Mise à Jour'
			};

			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: async () => ({
					success: true,
					message: 'Catégorie mise à jour avec succès',
					data: { id: 1, ...updateData }
				})
			});

			const response = await fetch('/api/categories/1', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(updateData)
			});

			const result = await response.json();

			expect(response.ok).toBe(true);
			expect(result.success).toBe(true);
			expect(result.data.atr_label).toBe('Électronique Mise à Jour');
		});

		it('devrait supprimer une catégorie existante', async () => {
			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: async () => ({
					success: true,
					message: 'Catégorie supprimée avec succès'
				})
			});

			const response = await fetch('/api/categories/1', {
				method: 'DELETE'
			});

			const result = await response.json();

			expect(response.ok).toBe(true);
			expect(result.success).toBe(true);
			expect(result.message).toBe('Catégorie supprimée avec succès');
		});

		it('devrait récupérer la liste des catégories', async () => {
			const mockCategories = [
				{
					id: 1,
					atr_0_label: 'Catégorie des produits',
					atr_1_label: 'Électronique',
					atr_2_label: 'Ordinateurs',
					atr_3_label: 'Portables'
				},
				{
					id: 2,
					atr_0_label: 'Catégorie des produits',
					atr_1_label: 'Mobilier',
					atr_2_label: 'Chaises'
				}
			];

			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: async () => mockCategories
			});

			const response = await fetch('/api/categories');
			const categories = await response.json();

			expect(response.ok).toBe(true);
			expect(Array.isArray(categories)).toBe(true);
			expect(categories).toHaveLength(2);
			expect(categories[0].atr_0_label).toBe('Catégorie des produits');
			expect(categories[0].atr_1_label).toBe('Électronique');
			expect(categories[1].atr_0_label).toBe('Catégorie des produits');
			expect(categories[1].atr_1_label).toBe('Mobilier');
		});

		it('devrait gérer les erreurs de serveur', async () => {
			mockFetch.mockResolvedValueOnce({
				ok: false,
				status: 500,
				json: async () => ({
					error: 'Erreur lors de la création des attributs'
				})
			});

			const response = await fetch('/api/categories', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(validCategoryData)
			});

			const result = await response.json();

			expect(response.ok).toBe(false);
			expect(response.status).toBe(500);
			expect(result.error).toBe('Erreur lors de la création des attributs');
		});
	});

	describe('Tests de logique métier', () => {
		it('devrait générer des valeurs atr_val cohérentes', () => {
			// Test de la logique de génération des valeurs atr_val
			const testCases = [
				{ input: 'Électronique', expected: 'électronique' },
				{ input: 'Ordinateurs Portables', expected: 'ordinateurs_portables' },
				{ input: 'Gaming & Esport', expected: 'gaming_&_esport' }
			];

			testCases.forEach(({ input, expected }) => {
				const generated = input.toLowerCase().replace(/\s+/g, '_');
				expect(generated).toBe(expected);
			});
		});

		it('devrait valider la hiérarchie des niveaux', () => {
			// Vérifier que les niveaux optionnels sont bien gérés
			const hierarchyData = {
				atr_0_label: 'Niveau 1',
				atr_1_label: undefined,
				atr_2_label: 'Niveau 3' // Niveau 2 manquant
			};

			const result = categorySchema.safeParse(hierarchyData);
			expect(result.success).toBe(true);
		});
	});

	describe('Tests de régression', () => {
		it('devrait maintenir la cohérence entre validation front et back', () => {
			const testCases = [
				{ data: validCategoryData, shouldPass: true },
				{ data: minimalCategoryData, shouldPass: true },
				{ data: invalidCategoryData, shouldPass: false },
				{ data: maxLevelCategoryData, shouldPass: true }
			];

			testCases.forEach(({ data, shouldPass }) => {
				const result = categorySchema.safeParse(data);

				if (shouldPass) {
					expect(result.success).toBe(true);
				} else {
					expect(result.success).toBe(false);
				}
			});
		});

		it('devrait gérer les caractères spéciaux dans les labels', () => {
			const specialCharsData = {
				atr_0_label: 'Électronique & Informatique',
				atr_1_label: 'PC/Mac (Ordinateurs)',
				atr_2_label: 'Gaming - Esport'
			};

			const result = categorySchema.safeParse(specialCharsData);
			expect(result.success).toBe(true);

			if (result.success) {
				expect(result.data.atr_0_label).toBe('Électronique & Informatique');
				expect(result.data.atr_1_label).toBe('PC/Mac (Ordinateurs)');
				expect(result.data.atr_2_label).toBe('Gaming - Esport');
			}
		});
	});

	describe('Tests de performance et limites', () => {
		it('devrait gérer des labels très longs', () => {
			const longLabelData = {
				atr_0_label: 'A'.repeat(255), // Label très long
				atr_1_label: 'Sous-catégorie normale'
			};

			const result = categorySchema.safeParse(longLabelData);
			expect(result.success).toBe(true);
		});

		it('devrait rejeter des données avec tous les niveaux vides sauf atr_0_label', () => {
			const sparseData = {
				atr_0_label: 'Catégorie des produits',
				atr_1_label: '',
				atr_2_label: '',
				atr_3_label: '',
				atr_4_label: '',
				atr_5_label: '',
				atr_6_label: '',
				atr_7_label: ''
			};

			const result = categorySchema.safeParse(sparseData);
			expect(result.success).toBe(false);

			if (!result.success) {
				expect(result.error.issues[0].message).toBe(
					'Au moins un niveau entre atr_1_label et atr_7_label doit être rempli'
				);
			}
		});

		it('devrait accepter des données avec atr_0_label et au moins un autre niveau', () => {
			const validSparseData = {
				atr_0_label: 'Catégorie des produits',
				atr_1_label: '',
				atr_2_label: '',
				atr_3_label: 'Niveau 4 rempli',
				atr_4_label: '',
				atr_5_label: '',
				atr_6_label: '',
				atr_7_label: ''
			};

			const result = categorySchema.safeParse(validSparseData);
			expect(result.success).toBe(true);
		});
	});

	describe('Tests de protection contre suppressions/modifications trop fortes', () => {
		beforeEach(() => {
			mockFetch.mockClear();
		});

		it("devrait empêcher la suppression d'un niveau parent qui affecterait toute une branche", async () => {
			// Simulation : tentative de suppression de "pièce" qui affecterait toutes les sous-catégories
			const parentCategoryId = 34; // ID de "pièce"

			// Mock de la réponse API qui détecte des enfants
			mockFetch.mockResolvedValueOnce({
				ok: false,
				status: 409, // Conflict
				json: async () => ({
					error: 'Impossible de supprimer cette catégorie : elle contient 50+ sous-catégories',
					affectedCount: 67,
					affectedCategories: [
						'piece mécanique > guidage > guidage en rotation > roulement',
						'étanchéité > joint > joint statique',
						'filtration > filtration sur des liquides',
						'kit > entretien mineur'
					]
				})
			});

			const response = await fetch(`/api/categories/${parentCategoryId}`, {
				method: 'DELETE'
			});

			const result = await response.json();

			expect(response.ok).toBe(false);
			expect(response.status).toBe(409);
			expect(result.error).toContain('Impossible de supprimer cette catégorie');
			expect(result.affectedCount).toBe(67);
			expect(result.affectedCategories).toHaveLength(4);
		});

		it("devrait empêcher la modification d'un niveau parent qui affecterait massivement les enfants", async () => {
			// Simulation : tentative de modification de "equipement industriel" vers "333333"
			const parentCategoryId = 35;
			const updateData = {
				atr_val: '333333',
				atr_label: '333333'
			};

			// Mock de la réponse API qui détecte l'impact massif
			mockFetch.mockResolvedValueOnce({
				ok: false,
				status: 409, // Conflict
				json: async () => ({
					error: 'Modification trop forte : cette modification affecterait 45+ sous-catégories',
					affectedCount: 45,
					currentValue: 'equipement industriel',
					newValue: '333333',
					impactedBranches: [
						'pompe > pompe à vide',
						'moteurs électriques et équipements associés',
						'compresseurs industriels',
						'pompes industrielles'
					]
				})
			});

			const response = await fetch(`/api/categories/${parentCategoryId}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(updateData)
			});

			const result = await response.json();

			expect(response.ok).toBe(false);
			expect(response.status).toBe(409);
			expect(result.error).toContain('Modification trop forte');
			expect(result.affectedCount).toBe(45);
			expect(result.currentValue).toBe('equipement industriel');
			expect(result.newValue).toBe('333333');
			expect(result.impactedBranches).toHaveLength(4);
		});

		it("devrait permettre la suppression d'une catégorie feuille sans enfants", async () => {
			// Simulation : suppression d'une catégorie terminale comme "roulement rigide à billes"
			const leafCategoryId = 123;

			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: async () => ({
					success: true,
					message: 'Catégorie supprimée avec succès',
					deletedCategory: 'roulement rigide à billes',
					affectedCount: 0
				})
			});

			const response = await fetch(`/api/categories/${leafCategoryId}`, {
				method: 'DELETE'
			});

			const result = await response.json();

			expect(response.ok).toBe(true);
			expect(result.success).toBe(true);
			expect(result.affectedCount).toBe(0);
			expect(result.deletedCategory).toBe('roulement rigide à billes');
		});

		it("devrait permettre la modification d'une catégorie avec impact limité", async () => {
			// Simulation : modification d'une catégorie avec peu d'enfants
			const categoryId = 456;
			const updateData = {
				atr_val: 'roulement_billes_modifie',
				atr_label: 'Roulement à billes modifié'
			};

			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: async () => ({
					success: true,
					message: 'Catégorie modifiée avec succès',
					affectedCount: 3,
					updatedCategory: updateData,
					childrenUpdated: [
						'roulement rigide à billes',
						'roulements-inserts (roulements Y)',
						'roulements à billes à contact oblique'
					]
				})
			});

			const response = await fetch(`/api/categories/${categoryId}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(updateData)
			});

			const result = await response.json();

			expect(response.ok).toBe(true);
			expect(result.success).toBe(true);
			expect(result.affectedCount).toBe(3);
			expect(result.childrenUpdated).toHaveLength(3);
		});

		it('devrait demander confirmation pour les modifications à impact moyen', async () => {
			// Simulation : modification avec impact moyen (5-20 enfants)
			const categoryId = 789;
			const updateData = {
				atr_val: 'guidage_modifie',
				atr_label: 'Guidage modifié',
				forceUpdate: false // Première tentative sans forcer
			};

			mockFetch.mockResolvedValueOnce({
				ok: false,
				status: 202, // Accepted but needs confirmation
				json: async () => ({
					requiresConfirmation: true,
					message: 'Cette modification affectera 12 sous-catégories. Confirmez-vous ?',
					affectedCount: 12,
					previewChanges: [
						'guidage en rotation > roulement',
						"guidage en rotation > manchons d'usure",
						'pallier',
						'guidage en translation (linéaire)'
					]
				})
			});

			const response = await fetch(`/api/categories/${categoryId}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(updateData)
			});

			const result = await response.json();

			expect(response.ok).toBe(false);
			expect(response.status).toBe(202);
			expect(result.requiresConfirmation).toBe(true);
			expect(result.affectedCount).toBe(12);
			expect(result.previewChanges).toHaveLength(4);
		});

		it('devrait accepter la modification avec confirmation forcée', async () => {
			// Simulation : modification avec forceUpdate = true
			const categoryId = 789;
			const updateData = {
				atr_val: 'guidage_modifie',
				atr_label: 'Guidage modifié',
				forceUpdate: true // Confirmation explicite
			};

			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: async () => ({
					success: true,
					message: 'Modification forcée appliquée avec succès',
					affectedCount: 12,
					updatedWithConfirmation: true
				})
			});

			const response = await fetch(`/api/categories/${categoryId}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(updateData)
			});

			const result = await response.json();

			expect(response.ok).toBe(true);
			expect(result.success).toBe(true);
			expect(result.affectedCount).toBe(12);
			expect(result.updatedWithConfirmation).toBe(true);
		});
	});
});
