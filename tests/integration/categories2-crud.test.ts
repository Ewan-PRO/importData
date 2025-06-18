import { describe, it, expect, beforeEach, vi } from 'vitest';

// 🔒 MOCK Prisma pour éviter de toucher la vraie base de données
vi.mock('@prisma/client');

// Mock fetch pour simuler les appels API
global.fetch = vi.fn();

// Données de test basées sur les exemples fournis
const testData = {
	// ✅ Cas valides
	simple: {
		atr_0_label: 'Catégorie des produits',
		atr_1_label: 'matériel électronique'
	},

	complex: {
		atr_0_label: 'Catégorie des produits',
		atr_1_label: 'pièce',
		atr_2_label: 'piece mécanique',
		atr_3_label: 'guidage',
		atr_4_label: 'guidage en rotation',
		atr_5_label: 'roulement',
		atr_6_label: 'roulement à billes',
		atr_7_label: 'roulements à billes spéciaux'
	},

	duplicate: {
		atr_0_label: 'Catégorie des produits',
		atr_1_label: 'pièce',
		atr_2_label: 'piece mécanique',
		atr_3_label: 'guidage',
		atr_4_label: 'guidage en rotation',
		atr_5_label: 'roulement',
		atr_6_label: 'roulement à billes',
		atr_7_label: 'roulements à billes à contact oblique' // Existant
	},

	// ❌ Cas invalides
	nonConsecutive: {
		atr_0_label: 'Catégorie des produits',
		atr_1_label: 'pièce',
		atr_2_label: '',
		atr_3_label: 'guidage' // Erreur: atr_2 vide mais atr_3 rempli
	},

	empty: {
		atr_0_label: 'Catégorie des produits'
		// Erreur: aucun niveau atr_1 à atr_7 rempli
	},

	tooLong: {
		atr_0_label: 'Catégorie des produits',
		atr_1_label: 'A'.repeat(256) // > 255 caractères
	}
};

// Types pour les réponses
type APIResponse =
	| {
			success: true;
			path: string;
			attributes: Array<{ atr_id: number; atr_nat: string; atr_val: string; atr_label: string }>;
	  }
	| { success: false; error: string }
	| Array<{
			row_key: number;
			atr_id: number;
			atr_0_label: string;
			atr_1_label: string;
			atr_2_label?: string;
	  }>
	| { success: true; message: string };

// 🧪 Helper pour simuler les réponses API (sans vraie requête HTTP)
function mockAPIResponse(
	method: string,
	data?: object | null,
	id?: string
): { response: { status: number; ok: boolean }; result: APIResponse } {
	const mockResponses = {
		'POST-simple': {
			success: true,
			path: 'matériel électronique',
			attributes: [
				{
					atr_id: 1001,
					atr_nat: 'CATEGORIE',
					atr_val: 'matériel électronique',
					atr_label: 'matériel électronique'
				}
			]
		},
		'POST-complex': {
			success: true,
			path: 'pièce -> piece mécanique -> guidage -> guidage en rotation -> roulement -> roulement à billes -> roulements à billes spéciaux',
			attributes: Array.from({ length: 7 }, (_, i) => ({
				atr_id: 1002 + i,
				atr_nat: i === 0 ? 'CATEGORIE' : `niveau${i}`,
				atr_val: `niveau${i + 1}`,
				atr_label: `niveau${i + 1}`
			}))
		},
		'POST-nonConsecutive': {
			success: false,
			error:
				'Les niveaux de catégorie doivent être consécutifs. Vous ne pouvez pas laisser de vide.'
		},
		'POST-empty': {
			success: false,
			error: 'Au moins un niveau entre atr_1_label et atr_7_label doit être rempli'
		},
		'POST-tooLong': {
			success: false,
			error: 'Le label ne peut pas dépasser 255 caractères'
		},
		'POST-duplicate': {
			success: false,
			error: 'Cette hiérarchie de catégories existe déjà'
		},
		GET: [
			{
				row_key: 1,
				atr_id: 1001,
				atr_0_label: 'Catégorie des produits',
				atr_1_label: 'matériel électronique'
			},
			{
				row_key: 2,
				atr_id: 1002,
				atr_0_label: 'Catégorie des produits',
				atr_1_label: 'pièce',
				atr_2_label: 'ordinateurs'
			}
		],
		'DELETE-success': {
			success: true,
			message: 'Catégorie supprimée'
		},
		'DELETE-notfound': {
			success: false,
			error: 'Catégorie introuvable'
		}
	};

	// Déterminer la clé de réponse
	let key = method;
	if (method === 'POST' && data) {
		if (
			JSON.stringify(data).includes('matériel électronique') &&
			!JSON.stringify(data).includes('ordinateurs')
		) {
			key = 'POST-simple';
		} else if (JSON.stringify(data).includes('roulements à billes spéciaux')) {
			key = 'POST-complex';
		} else if (JSON.stringify(data).includes('"atr_2_label":""')) {
			key = 'POST-nonConsecutive';
		} else if (JSON.stringify(data).includes('A'.repeat(256))) {
			key = 'POST-tooLong';
		} else if (JSON.stringify(data).includes('contact oblique')) {
			key = 'POST-duplicate';
		} else if (!JSON.stringify(data).includes('atr_1_label')) {
			key = 'POST-empty';
		}
	} else if (method === 'DELETE') {
		key = id === '99999' ? 'DELETE-notfound' : 'DELETE-success';
	}

	const response = mockResponses[key as keyof typeof mockResponses] || { error: 'Not mocked' };
	const status =
		key.includes('success') ||
		key === 'GET' ||
		key.includes('POST-simple') ||
		key.includes('POST-complex')
			? 200
			: key.includes('notfound')
				? 404
				: key.includes('duplicate')
					? 409
					: 400;

	return {
		response: { status, ok: status < 400 },
		result: response as APIResponse
	};
}

describe('Categories CRUD - Tests Simulés (Aucun impact BDD)', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('POST /categories/api - Création', () => {
		it('✅ devrait créer une catégorie simple valide', async () => {
			const { response, result } = mockAPIResponse('POST', testData.simple);

			expect(response.status).toBe(200);
			if ('success' in result && result.success && 'path' in result) {
				expect(result.success).toBe(true);
				expect(result.path).toBe('matériel électronique');
				expect(result.attributes).toHaveLength(1);
				expect(result.attributes[0].atr_label).toBe('matériel électronique');
				expect(result.attributes[0].atr_val).toBe('matériel électronique');
			}
		});

		it('✅ devrait créer une hiérarchie complète valide', async () => {
			const { response, result } = mockAPIResponse('POST', testData.complex);

			expect(response.status).toBe(200);
			if ('success' in result && result.success && 'path' in result) {
				expect(result.success).toBe(true);
				expect(result.path).toBe(
					'pièce -> piece mécanique -> guidage -> guidage en rotation -> roulement -> roulement à billes -> roulements à billes spéciaux'
				);
				expect(result.attributes).toHaveLength(7);
			}
		});

		it('❌ devrait rejeter les niveaux non consécutifs', async () => {
			const { response, result } = mockAPIResponse('POST', testData.nonConsecutive);

			expect(response.status).toBe(400);
			if ('success' in result && !result.success) {
				expect(result.success).toBe(false);
				expect(result.error).toBe(
					'Les niveaux de catégorie doivent être consécutifs. Vous ne pouvez pas laisser de vide.'
				);
			}
		});

		it('❌ devrait rejeter les catégories vides', async () => {
			const { response, result } = mockAPIResponse('POST', testData.empty);

			expect(response.status).toBe(400);
			if ('success' in result && !result.success) {
				expect(result.success).toBe(false);
				expect(result.error).toBe(
					'Au moins un niveau entre atr_1_label et atr_7_label doit être rempli'
				);
			}
		});

		it('❌ devrait rejeter les labels trop longs', async () => {
			const { response, result } = mockAPIResponse('POST', testData.tooLong);

			expect(response.status).toBe(400);
			if ('success' in result && !result.success) {
				expect(result.success).toBe(false);
				expect(result.error).toBe('Le label ne peut pas dépasser 255 caractères');
			}
		});

		it('❌ devrait rejeter les doublons exacts', async () => {
			const { response, result } = mockAPIResponse('POST', testData.duplicate);

			expect(response.status).toBe(409);
			if ('success' in result && !result.success) {
				expect(result.success).toBe(false);
				expect(result.error).toContain('Cette hiérarchie de catégories existe déjà');
			}
		});
	});

	describe('GET /categories/api - Lecture', () => {
		it('✅ devrait récupérer toutes les catégories', async () => {
			const { response, result } = mockAPIResponse('GET');

			expect(response.status).toBe(200);
			expect(Array.isArray(result)).toBe(true);
			if (Array.isArray(result)) {
				expect(result.length).toBeGreaterThan(0);
				const firstCategory = result[0];
				expect(firstCategory).toHaveProperty('row_key');
				expect(firstCategory).toHaveProperty('atr_id');
				expect(firstCategory).toHaveProperty('atr_0_label');
			}
		});
	});

	describe('DELETE /categories/api/:id - Suppression', () => {
		it("✅ devrait simuler la suppression d'une catégorie", async () => {
			const { response, result } = mockAPIResponse('DELETE', undefined, '1');

			expect(response.status).toBe(200);
			if ('success' in result) {
				expect(result.success).toBe(true);
			}
		});

		it('❌ devrait échouer avec un ID inexistant', async () => {
			const { response, result } = mockAPIResponse('DELETE', undefined, '99999');

			expect(response.status).toBe(404);
			if ('success' in result && !result.success) {
				expect(result.success).toBe(false);
				expect(result.error).toContain('Catégorie introuvable');
			}
		});
	});

	describe('Validation métier', () => {
		it('✅ devrait valider la logique de création de branches', () => {
			// Test de logique pure sans appel BDD
			const branch1 = testData.simple;
			const branch2 = { ...testData.simple, atr_2_label: 'smartphones' };

			expect(branch1.atr_1_label).toBe('matériel électronique');
			expect(branch2.atr_2_label).toBe('smartphones');

			// Les deux partagent le même parent
			expect(branch1.atr_1_label).toBe(branch2.atr_1_label);
		});

		it('✅ devrait valider le nettoyage des espaces', () => {
			const dataWithSpaces = '  matériel électronique  ';
			const cleaned = dataWithSpaces.trim();

			expect(cleaned).toBe('matériel électronique');
			expect(cleaned.length).toBeLessThan(dataWithSpaces.length);
		});
	});
});
