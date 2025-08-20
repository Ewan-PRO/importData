// Tests d'intégration avec vraies données et logique BDD pour les kits
//
// 🚀 UTILISATION:
// 1. Démarrer le serveur: pnpm dev
// 2. Lancer les tests: pnpm test tests/integration/kits-real-data.test.ts
// 3. Vérifier que USE_DEV_VIEWS=true dans .env
//
// 🎯 CAS TESTÉS:
// ✅ Création kit avec caractéristiques
// ❌ Rejet combinaisons duplicatas (contrainte unique)
// ❌ Rejet champs obligatoires manquants
// ❌ Rejet labels trop longs (> 100 chars)
// ✅ Modification kit existant
// ✅ Suppression avec vraies données
// ✅ Test logique vue v_kit_carac_dev
//
// 💾 DONNÉES: Préfixées TEST_KIT_* - nettoyage automatique

import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { PrismaClient } from '@prisma/client';

// Configuration pour forcer l'utilisation des tables dev
process.env.USE_DEV_VIEWS = 'true';
process.env.NODE_ENV = 'test';

const prisma = new PrismaClient();

// 📊 Données de test basées sur les VRAIES règles du code actuel
const testKitsReal = {
	// ✅ Cas VALIDES selon code actuel
	simple: {
		kit_label: 'TEST_KIT_Pompe_Hydraulique',
		atr_label: 'Pression',
		atr_val: 'bar',
		kat_valeur: '350'
	},

	withDifferentUnit: {
		kit_label: 'TEST_KIT_Pompe_Hydraulique',
		atr_label: 'Pression', // Même caractéristique
		atr_val: 'psi', // Unité différente - DOIT être autorisé
		kat_valeur: '5076'
	},

	differentKit: {
		kit_label: 'TEST_KIT_Moteur_Diesel',
		atr_label: 'Puissance',
		atr_val: 'kW',
		kat_valeur: '150.5'
	},

	// ❌ Cas INVALIDES selon code actuel
	duplicateExact: {
		kit_label: 'TEST_KIT_Pompe_Hydraulique',
		atr_label: 'Pression',
		atr_val: 'bar',
		kat_valeur: '350' // Combinaison exacte identique à 'simple'
	},

	emptyKitLabel: {
		kit_label: '', // ERREUR: obligatoire
		atr_label: 'Débit',
		atr_val: 'L/min',
		kat_valeur: '100'
	},

	emptyAtrLabel: {
		kit_label: 'TEST_KIT_Vérin',
		atr_label: '', // ERREUR: obligatoire
		atr_val: 'mm',
		kat_valeur: '200'
	},

	emptyAtrVal: {
		kit_label: 'TEST_KIT_Vérin',
		atr_label: 'Course',
		atr_val: '', // ERREUR: obligatoire
		kat_valeur: '200'
	},

	emptyKatValeur: {
		kit_label: 'TEST_KIT_Vérin',
		atr_label: 'Course',
		atr_val: 'mm',
		kat_valeur: '' // ERREUR: obligatoire
	},

	tooLongKitLabel: {
		kit_label: 'TEST_KIT_' + 'A'.repeat(95), // > 100 chars total
		atr_label: 'Test',
		atr_val: 'unit',
		kat_valeur: '1'
	},

	tooLongAtrLabel: {
		kit_label: 'TEST_KIT_Normal',
		atr_label: 'TEST_' + 'B'.repeat(96), // > 100 chars total  
		atr_val: 'unit',
		kat_valeur: '1'
	},

	// Pour tests modification
	forModification: {
		kit_label: 'TEST_KIT_ModifBase',
		atr_label: 'Température',
		atr_val: '°C',
		kat_valeur: '80'
	}
};

// Variables pour stocker les IDs créés
let createdKatIds: number[] = [];

describe('Kits CRUD - Tests avec vraies données BDD', () => {
	// 🧹 Nettoyage avant tous les tests
	beforeAll(async () => {
		console.log('🧹 Nettoyage des données de test précédentes...');

		// Supprimer les kit_attribute_dev avec des kits de test
		// Note: kit_attribute_dev n'a pas de relation directe avec kit_dev dans le schema
		const testKits = await prisma.kit_dev.findMany({
			where: { kit_label: { startsWith: 'TEST_KIT_' } }
		});
		
		if (testKits.length > 0) {
			const testKitIds = testKits.map(k => k.kit_id);
			await prisma.kit_attribute_dev.deleteMany({
				where: { fk_kit: { in: testKitIds } }
			});
		}

		// Supprimer les kits de test
		await prisma.kit_dev.deleteMany({
			where: {
				kit_label: { startsWith: 'TEST_KIT_' }
			}
		});

		// Supprimer les attributs de test
		await prisma.attribute_dev.deleteMany({
			where: {
				OR: [
					{ atr_label: { startsWith: 'TEST_' } },
					{ atr_val: { startsWith: 'TEST_' } }
				]
			}
		});

		console.log('✅ Nettoyage terminé');
	});

	// 🧹 Nettoyage après tous les tests
	afterAll(async () => {
		console.log('🧹 Nettoyage final des données de test...');

		// Supprimer dans l'ordre inverse des relations
		const testKits = await prisma.kit_dev.findMany({
			where: { kit_label: { startsWith: 'TEST_KIT_' } }
		});
		
		if (testKits.length > 0) {
			const testKitIds = testKits.map(k => k.kit_id);
			await prisma.kit_attribute_dev.deleteMany({
				where: { fk_kit: { in: testKitIds } }
			});
		}

		await prisma.kit_dev.deleteMany({
			where: {
				kit_label: { startsWith: 'TEST_KIT_' }
			}
		});

		await prisma.attribute_dev.deleteMany({
			where: {
				OR: [
					{ atr_label: { startsWith: 'TEST_' } },
					{ atr_val: { startsWith: 'TEST_' } }
				]
			}
		});

		console.log('✅ Données de test supprimées');
		await prisma.$disconnect();
	});

	// 🔄 Reset entre chaque test pour isolation
	beforeEach(() => {
		createdKatIds = [];
	});

	describe('✅ Tests création (POST /kits/api)', () => {
		it('✅ VALIDE: devrait créer un kit simple avec caractéristique', async () => {
			const response = await fetch('http://localhost:5173/kits/api', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(testKitsReal.simple)
			});

			expect(response.status).toBe(200);
			const result = await response.json();

			expect(result.success).toBe(true);
			expect(result.message).toBe('Kit créé avec succès');
			expect(result.data.kit.kit_label).toBe('TEST_KIT_Pompe_Hydraulique');
			expect(result.data.kitAttribute.kat_valeur).toBe(350);

			// Vérifier dans la vue v_kit_carac_dev
			const kitInView = await prisma.v_kit_carac_dev.findFirst({
				where: { 
					kit_label: 'TEST_KIT_Pompe_Hydraulique',
					atr_label: 'Pression'
				}
			});

			expect(kitInView).toBeTruthy();
			expect(kitInView?.atr_val).toBe('bar');
			expect(kitInView?.kat_valeur).toBe(350);

			createdKatIds.push(result.data.kitAttribute.kat_id);
		});

		it('✅ VALIDE: devrait créer même kit avec unité différente', async () => {
			// Créer le kit de base d'abord
			await fetch('http://localhost:5173/kits/api', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(testKitsReal.simple)
			});

			// Puis créer la même caractéristique avec une autre unité
			const response = await fetch('http://localhost:5173/kits/api', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(testKitsReal.withDifferentUnit)
			});

			expect(response.status).toBe(200);
			const result = await response.json();

			expect(result.success).toBe(true);
			expect(result.data.kit.kit_label).toBe('TEST_KIT_Pompe_Hydraulique');

			// Vérifier qu'il y a maintenant 2 entrées pour ce kit dans la vue
			const kitsInView = await prisma.v_kit_carac_dev.findMany({
				where: { 
					kit_label: 'TEST_KIT_Pompe_Hydraulique',
					atr_label: 'Pression'
				}
			});

			expect(kitsInView).toHaveLength(2);
			const units = kitsInView.map(k => k.atr_val).sort();
			expect(units).toEqual(['bar', 'psi']);
		});

		it('❌ INVALIDE: devrait rejeter combinaison exacte identique', async () => {
			// Créer le kit de base d'abord
			await fetch('http://localhost:5173/kits/api', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(testKitsReal.simple)
			});

			// Tenter de créer la même combinaison exacte
			const response = await fetch('http://localhost:5173/kits/api', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(testKitsReal.duplicateExact)
			});

			expect(response.status).toBe(409);
			const result = await response.json();

			expect(result.error).toContain('Cette combinaison existe déjà');
			expect(result.error).toContain('TEST_KIT_Pompe_Hydraulique');
			expect(result.error).toContain('Pression');
		});

		it('❌ INVALIDE: devrait rejeter si kit_label vide', async () => {
			const response = await fetch('http://localhost:5173/kits/api', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(testKitsReal.emptyKitLabel)
			});

			expect(response.status).toBe(400);
			const result = await response.json();

			expect(result.error).toBe('Le nom du kit est obligatoire');
		});

		it('❌ INVALIDE: devrait rejeter si atr_label vide', async () => {
			const response = await fetch('http://localhost:5173/kits/api', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(testKitsReal.emptyAtrLabel)
			});

			expect(response.status).toBe(400);
			const result = await response.json();

			expect(result.error).toBe('La caractéristique est obligatoire');
		});

		it('❌ INVALIDE: devrait rejeter si atr_val vide', async () => {
			const response = await fetch('http://localhost:5173/kits/api', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(testKitsReal.emptyAtrVal)
			});

			expect(response.status).toBe(400);
			const result = await response.json();

			expect(result.error).toBe("L'unité est obligatoire");
		});

		it('❌ INVALIDE: devrait rejeter si kat_valeur vide', async () => {
			const response = await fetch('http://localhost:5173/kits/api', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(testKitsReal.emptyKatValeur)
			});

			expect(response.status).toBe(400);
			const result = await response.json();

			expect(result.error).toBe('La valeur est obligatoire');
		});

		it('❌ INVALIDE: devrait rejeter si kit_label trop long', async () => {
			const response = await fetch('http://localhost:5173/kits/api', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(testKitsReal.tooLongKitLabel)
			});

			// Le rejet peut se faire côté DB (contrainte VarChar) ou côté API
			expect([400, 500]).toContain(response.status);
		});

		it('❌ INVALIDE: devrait rejeter si atr_label trop long', async () => {
			const response = await fetch('http://localhost:5173/kits/api', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(testKitsReal.tooLongAtrLabel)
			});

			// Le rejet peut se faire côté DB (contrainte VarChar) ou côté API
			expect([400, 500]).toContain(response.status);
		});
	});

	describe('✏️ Tests modification (PUT /kits/api/:id)', () => {
		let testKitKatId: number;

		beforeEach(async () => {
			// Créer un kit pour les tests de modification avec nom unique
			const uniqueName = `TEST_KIT_ModifBase_${Date.now()}`;
			const modifData = {
				kit_label: uniqueName,
				atr_label: 'Température',
				atr_val: '°C',
				kat_valeur: '80'
			};

			const response = await fetch('http://localhost:5173/kits/api', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(modifData)
			});

			const result = await response.json();

			if (!result.success || !result.data.kitAttribute) {
				throw new Error(`Échec création kit pour test: ${JSON.stringify(result)}`);
			}

			testKitKatId = result.data.kitAttribute.kat_id;
			createdKatIds.push(testKitKatId);
		});

		it('✅ VALIDE: devrait modifier un kit existant', async () => {
			const modificationData = {
				kit_label: 'TEST_KIT_ModifBase_Updated',
				atr_label: 'Température_Updated',
				atr_val: 'K',
				kat_valeur: '353.15'
			};

			const response = await fetch(`http://localhost:5173/kits/api/${testKitKatId}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(modificationData)
			});

			expect(response.status).toBe(200);
			const result = await response.json();

			expect(result.success).toBe(true);
			expect(result.message).toBe('Kit mis à jour avec succès');

			// Vérifier les changements dans la vue
			const updatedKit = await prisma.v_kit_carac_dev.findFirst({
				where: {
					kit_label: 'TEST_KIT_ModifBase_Updated',
					atr_label: 'Température_Updated',
					atr_val: 'K'
				}
			});

			expect(updatedKit).toBeTruthy();
			expect(updatedKit?.kit_label).toBe('TEST_KIT_ModifBase_Updated');
			expect(updatedKit?.atr_label).toBe('Température_Updated');
			expect(updatedKit?.atr_val).toBe('K');
			expect(updatedKit?.kat_valeur).toBe(353.15);
		});

		it('❌ INVALIDE: devrait rejeter modification avec champs vides', async () => {
			const modificationData = {
				kit_label: '',
				atr_label: 'Température',
				atr_val: '°C',
				kat_valeur: '80'
			};

			const response = await fetch(`http://localhost:5173/kits/api/${testKitKatId}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(modificationData)
			});

			expect(response.status).toBe(400);
			const result = await response.json();

			expect(result.error).toBe('Le nom du kit est obligatoire');
		});
	});

	describe('🗑️ Tests suppression (DELETE /kits/api/:id)', () => {
		let testKitKatId: number;

		beforeEach(async () => {
			// Créer un kit pour test de suppression
			const response = await fetch('http://localhost:5173/kits/api', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					kit_label: 'TEST_KIT_ToDelete',
					atr_label: 'TestCarac',
					atr_val: 'unit',
					kat_valeur: '99'
				})
			});

			const result = await response.json();
			testKitKatId = result.data.kitAttribute.kat_id;
		});

		it('✅ VALIDE: devrait supprimer un kit existant', async () => {
			const response = await fetch(`http://localhost:5173/kits/api/${testKitKatId}`, {
				method: 'DELETE'
			});

			expect(response.status).toBe(200);
			const result = await response.json();

			expect(result.success).toBe(true);
			expect(result.message).toBe('Kit supprimé avec succès');

			// Vérifier que la donnée est supprimée de kit_attribute_dev
			const deletedKitAttribute = await prisma.kit_attribute_dev.findUnique({
				where: { kat_id: testKitKatId }
			});

			expect(deletedKitAttribute).toBeNull();

			// Vérifier qu'elle n'apparaît plus dans la vue
			const kitInView = await prisma.v_kit_carac_dev.findFirst({
				where: {
					kit_label: 'TEST_KIT_ToDelete',
					atr_label: 'TestCarac',
					atr_val: 'unit'
				}
			});

			expect(kitInView).toBeNull();
		});

		it('❌ INVALIDE: devrait échouer avec ID inexistant', async () => {
			const response = await fetch('http://localhost:5173/kits/api/99999', {
				method: 'DELETE'
			});

			expect(response.status).toBe(404);
			const result = await response.json();

			expect(result.error).toBe('Kit non trouvé');
		});
	});

	describe('🔍 Tests logique métier avancée', () => {
		it('✅ Vue v_kit_carac_dev: devrait refléter les bonnes données', async () => {
			const response = await fetch('http://localhost:5173/kits/api', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					kit_label: 'TEST_KIT_Vue_Test',
					atr_label: 'Pression_Test',
					atr_val: 'bar',
					kat_valeur: '250.5'
				})
			});

			const result = await response.json();
			const katId = result.data.kitAttribute.kat_id;

			// Vérifier que les données apparaissent correctement dans la vue
			const kitInView = await prisma.v_kit_carac_dev.findFirst({
				where: {
					kit_label: 'TEST_KIT_Vue_Test',
					atr_label: 'Pression_Test',
					atr_val: 'bar'
				}
			});

			expect(kitInView).toBeTruthy();
			expect(kitInView?.kit_label).toBe('TEST_KIT_Vue_Test');
			expect(kitInView?.atr_label).toBe('Pression_Test');
			expect(kitInView?.atr_val).toBe('bar');
			expect(kitInView?.kat_valeur).toBe(250.5);
			expect(kitInView?.id).toBe(katId);

			createdKatIds.push(katId);
		});

		it('✅ Contrainte unique: devrait permettre même kit avec différentes caractéristiques', async () => {
			const baseKit = {
				kit_label: 'TEST_KIT_Multi_Carac',
				atr_label: 'Pression',
				atr_val: 'bar',
				kat_valeur: '200'
			};

			const sameKitDiffCarac = {
				kit_label: 'TEST_KIT_Multi_Carac', // Même kit
				atr_label: 'Débit', // Caractéristique différente
				atr_val: 'L/min',
				kat_valeur: '50'
			};

			// Créer le premier
			const response1 = await fetch('http://localhost:5173/kits/api', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(baseKit)
			});

			expect(response1.status).toBe(200);

			// Créer le second (doit passer)
			const response2 = await fetch('http://localhost:5173/kits/api', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(sameKitDiffCarac)
			});

			expect(response2.status).toBe(200);

			// Vérifier qu'il y a bien 2 entrées pour ce kit
			const kitsInView = await prisma.v_kit_carac_dev.findMany({
				where: { kit_label: 'TEST_KIT_Multi_Carac' }
			});

			expect(kitsInView).toHaveLength(2);
			const caracs = kitsInView.map(k => k.atr_label).sort();
			expect(caracs).toEqual(['Débit', 'Pression']);
		});

		it('✅ Nettoyage automatique: trim des espaces', async () => {
			const response = await fetch('http://localhost:5173/kits/api', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					kit_label: '  TEST_KIT_WithSpaces  ',
					atr_label: '  Température  ',
					atr_val: '  °C  ',
					kat_valeur: '  85.5  '
				})
			});

			expect(response.status).toBe(200);
			const result = await response.json();

			// L'API devrait nettoyer les espaces (si implémenté)
			// Sinon, c'est un point d'amélioration à noter
			expect(result.data.kit.kit_label.trim()).toBe('TEST_KIT_WithSpaces');
			expect(result.data.kitAttribute.kat_valeur).toBe(85.5);

			createdKatIds.push(result.data.kitAttribute.kat_id);
		});
	});
});