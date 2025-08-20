// Tests d'intégration avec vraies données et logique BDD
//
// 🚀 UTILISATION:
// 1. Démarrer le serveur: pnpm dev
// 2. Lancer les tests: pnpm test tests/integration/categories-real-data.test.ts
// 3. Vérifier que USE_DEV_VIEWS=true dans .env
//
// 🎯 CAS TESTÉS:
// ✅ Création catégorie simple et hiérarchique
// ❌ Rejet niveaux non consécutifs (vraie règle code)
// ❌ Rejet modification avec saut niveau
// ✅ Suppression avec vraies données
// ✅ Logique COALESCE et nettoyage espaces
//
// 💾 DONNÉES: Préfixées TEST_* - nettoyage automatique

import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { PrismaClient } from '@prisma/client';

// Configuration pour forcer l'utilisation des tables dev
process.env.USE_DEV_VIEWS = 'true';
process.env.NODE_ENV = 'test';

const prisma = new PrismaClient();

// 📊 Données de test basées sur les VRAIES règles du code actuel
const testCategoriesReal = {
	// ✅ Cas VALIDES selon code actuel
	simple: {
		atr_0_label: 'Catégorie des produits',
		atr_1_label: 'TEST_Simple'
	},

	consecutive: {
		atr_0_label: 'Catégorie des produits',
		atr_1_label: 'TEST_Fluide',
		atr_2_label: 'TEST_Huile',
		atr_3_label: 'TEST_Hydraulique'
	},

	// ❌ Cas INVALIDES selon code actuel
	nonConsecutive: {
		atr_0_label: 'Catégorie des produits',
		atr_1_label: 'TEST_Pièce',
		atr_2_label: '', // Vide
		atr_3_label: 'TEST_Joint' // ERREUR: atr_2 manquant
	},

	empty: {
		atr_0_label: 'Catégorie des produits'
		// ERREUR: aucun niveau atr_1 à atr_7 rempli
	},

	tooLong: {
		atr_0_label: 'Catégorie des produits',
		atr_1_label: 'TEST_' + 'A'.repeat(252) // > 255 chars
	},

	// Pour tests modification
	forModification: {
		atr_0_label: 'Catégorie des produits',
		atr_1_label: 'TEST_ModifBase',
		atr_2_label: 'TEST_ModifSous'
	}
};

// Variables pour stocker les IDs créés
let createdIds: number[] = [];

describe('Categories CRUD - Tests avec vraies données BDD', () => {
	// 🧹 Nettoyage avant tous les tests
	beforeAll(async () => {
		console.log('🧹 Nettoyage des données de test précédentes...');

		// Supprimer toutes les données TEST_* qui pourraient trainer
		await prisma.attribute_dev.deleteMany({
			where: {
				atr_label: { startsWith: 'TEST_' }
			}
		});

		console.log('✅ Nettoyage terminé');
	});

	// 🧹 Nettoyage après tous les tests
	afterAll(async () => {
		console.log('🧹 Nettoyage final des données de test...');

		// Supprimer toutes les données créées
		await prisma.attribute_dev.deleteMany({
			where: {
				atr_label: { startsWith: 'TEST_' }
			}
		});

		console.log('✅ Données de test supprimées');
		await prisma.$disconnect();
	});

	// 🔄 Reset entre chaque test pour isolation
	beforeEach(() => {
		createdIds = [];
	});

	describe('✅ Tests création (POST /categories/api)', () => {
		it('✅ VALIDE: devrait créer une catégorie simple', async () => {
			const response = await fetch('http://localhost:5173/categories/api', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(testCategoriesReal.simple)
			});

			expect(response.status).toBe(200);
			const result = await response.json();

			expect(result.success).toBe(true);
			expect(result.path).toBe('TEST_Simple');
			expect(result.attributes).toHaveLength(1);
			expect(result.attributes[0].atr_label).toBe('TEST_Simple');

			// Vérifier dans la vue
			const categoryInView = await prisma.v_categories_dev.findFirst({
				where: { atr_1_label: 'TEST_Simple' }
			});

			expect(categoryInView).toBeTruthy();
			expect(categoryInView?.atr_0_label).toBe('Catégorie des produits');
			expect(categoryInView?.atr_1_label).toBe('TEST_Simple');

			createdIds.push(result.attributes[0].atr_id);
		});

		it('✅ VALIDE: devrait créer une hiérarchie consécutive complète', async () => {
			const response = await fetch('http://localhost:5173/categories/api', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(testCategoriesReal.consecutive)
			});

			expect(response.status).toBe(200);
			const result = await response.json();

			expect(result.success).toBe(true);
			expect(result.path).toBe('TEST_Fluide -> TEST_Huile -> TEST_Hydraulique');
			expect(result.attributes).toHaveLength(3);

			// Vérifier hiérarchie dans la vue
			const categoryInView = await prisma.v_categories_dev.findFirst({
				where: {
					atr_1_label: 'TEST_Fluide',
					atr_2_label: 'TEST_Huile',
					atr_3_label: 'TEST_Hydraulique'
				}
			});

			expect(categoryInView).toBeTruthy();
			expect(categoryInView?.atr_3_label).toBe('TEST_Hydraulique');
		});

		it('❌ INVALIDE: devrait rejeter les niveaux non consécutifs', async () => {
			const response = await fetch('http://localhost:5173/categories/api', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(testCategoriesReal.nonConsecutive)
			});

			expect(response.status).toBe(400);
			const result = await response.json();

			expect(result.success).toBe(false);
			expect(result.error).toContain('Les niveaux de catégorie doivent être consécutifs');
		});

		it('❌ INVALIDE: devrait rejeter si aucun niveau rempli', async () => {
			const response = await fetch('http://localhost:5173/categories/api', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(testCategoriesReal.empty)
			});

			expect(response.status).toBe(400);
			const result = await response.json();

			expect(result.success).toBe(false);
			expect(result.error).toContain(
				'Au moins un niveau entre atr_1_label et atr_7_label doit être rempli'
			);
		});

		it('❌ INVALIDE: devrait rejeter si label trop long', async () => {
			const response = await fetch('http://localhost:5173/categories/api', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(testCategoriesReal.tooLong)
			});

			expect(response.status).toBe(400);
			const result = await response.json();

			expect(result.success).toBe(false);
			expect(result.error).toContain('ne peut pas dépasser 255 caractères');
		});
	});

	describe('✏️ Tests modification (PUT /categories/api/:id)', () => {
		let testCategoryId: number;

		beforeEach(async () => {
			// ✅ CORRECTION: Nom unique pour chaque test pour éviter conflits
			const uniqueName = `TEST_ModifBase_${Date.now()}`;
			const modifData = {
				atr_0_label: 'Catégorie des produits',
				atr_1_label: uniqueName,
				atr_2_label: `${uniqueName}_Sous`
			};

			// Créer une catégorie pour les tests de modification
			const response = await fetch('http://localhost:5173/categories/api', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(modifData)
			});

			const result = await response.json();

			// ✅ CORRECTION: Vérifier que result.attributes existe
			if (!result.attributes || result.attributes.length === 0) {
				throw new Error(`Échec création catégorie pour test: ${JSON.stringify(result)}`);
			}

			testCategoryId = result.attributes[result.attributes.length - 1].atr_id;
			createdIds.push(...result.attributes.map((attr: { atr_id: number }) => attr.atr_id));
		});

		it('❌ INVALIDE: devrait rejeter modification avec saut de niveau', async () => {
			const modificationData = {
				atr_1_label: 'TEST_ModifBase',
				atr_2_label: '', // Vide
				atr_3_label: 'TEST_NouveauNiveau3' // Saut de niveau !
			};

			const response = await fetch(`http://localhost:5173/categories/api/${testCategoryId}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(modificationData)
			});

			expect(response.status).toBe(400);
			const result = await response.json();

			expect(result.error).toContain('Saut de niveau interdit');
			expect(result.error).toContain('Le niveau 3 ne peut pas être rempli si le niveau 2 est vide');
		});

		it('✅ VALIDE: devrait modifier sans saut de niveau', async () => {
			const modificationData = {
				atr_1_label: 'TEST_ModifBase_Updated',
				atr_2_label: 'TEST_ModifSous_Updated'
			};

			const response = await fetch(`http://localhost:5173/categories/api/${testCategoryId}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(modificationData)
			});

			expect(response.status).toBe(200);
			const result = await response.json();

			expect(result.success).toBe(true);
		});
	});

	describe('🗑️ Tests suppression (DELETE /categories/api/:id)', () => {
		let testCategoryRowKey: number;
		let testCategoryAtrId: number;

		beforeEach(async () => {
			// Créer une catégorie pour test de suppression
			const response = await fetch('http://localhost:5173/categories/api', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					atr_0_label: 'Catégorie des produits',
					atr_1_label: 'TEST_ToDelete'
				})
			});

			const result = await response.json();
			testCategoryAtrId = result.attributes[0].atr_id;

			// ✅ CORRECTION: Récupérer le row_key depuis la vue (comme fait l'interface réelle)
			const categoryInView = await prisma.v_categories_dev.findFirst({
				where: { atr_1_label: 'TEST_ToDelete' }
			});

			testCategoryRowKey = categoryInView!.row_key;
		});

		it('✅ VALIDE: devrait supprimer une catégorie existante', async () => {
			// ✅ CORRECTION: Utiliser row_key comme fait l'interface réelle
			const response = await fetch(`http://localhost:5173/categories/api/${testCategoryRowKey}`, {
				method: 'DELETE'
			});

			// ✅ CORRECTION: API retourne HTTP 204 (pas de JSON)
			expect(response.status).toBe(204);

			// Vérifier que la donnée est supprimée
			const deletedAttribute = await prisma.attribute_dev.findUnique({
				where: { atr_id: testCategoryAtrId }
			});

			expect(deletedAttribute).toBeNull();
		});

		it('❌ INVALIDE: devrait échouer avec ID inexistant', async () => {
			// ✅ CORRECTION: Tester avec row_key inexistant
			const response = await fetch('http://localhost:5173/categories/api/99999', {
				method: 'DELETE'
			});

			expect(response.status).toBe(404);

			// ✅ CORRECTION: Vérifier qu'il y a une réponse JSON pour les erreurs
			const result = await response.json();
			expect(result.error).toBeDefined();
		});
	});

	describe('🔍 Tests logique métier avancée', () => {
		it('✅ COALESCE: devrait retourner le bon atr_id (dernier niveau)', async () => {
			const response = await fetch('http://localhost:5173/categories/api', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					atr_0_label: 'Catégorie des produits',
					atr_1_label: 'TEST_Coalesce1',
					atr_2_label: 'TEST_Coalesce2',
					atr_3_label: 'TEST_Coalesce3'
				})
			});

			const result = await response.json();

			// Le dernier attribut créé doit avoir l'ID le plus élevé
			const lastAttribute = result.attributes[result.attributes.length - 1];

			// Vérifier dans la vue que atr_id correspond au dernier niveau
			const categoryInView = await prisma.v_categories_dev.findFirst({
				where: { atr_3_label: 'TEST_Coalesce3' }
			});

			expect(categoryInView?.atr_id).toBe(lastAttribute.atr_id);
		});

		it('✅ TRIM: devrait nettoyer automatiquement les espaces', async () => {
			const response = await fetch('http://localhost:5173/categories/api', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					atr_0_label: 'Catégorie des produits',
					atr_1_label: '  TEST_WithSpaces  '
				})
			});

			const result = await response.json();

			expect(result.attributes[0].atr_label).toBe('TEST_WithSpaces');
			expect(result.path).toBe('TEST_WithSpaces');
		});
	});
});
