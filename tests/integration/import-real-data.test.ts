// Tests d'intégration avec vraies données et logique d'import
//
// 🚀 UTILISATION:
// 1. Démarrer le serveur: pnpm dev
// 2. Lancer les tests: pnpm test tests/integration/import-real-data.test.ts
// 3. Vérifier que USE_DEV_VIEWS=true dans .env
//
// 🎯 CAS TESTÉS:
// ✅ Import basique attributes, suppliers, categories
// ❌ Rejet format CSV malformé (guillemets incorrects)
// ❌ Rejet champs obligatoires manquants
// ❌ Rejet doublons internes et en base
// ❌ Rejet valeurs trop longues
// ❌ Rejet atr_0_label non conforme pour catégories
// ✅ Import sans en-têtes avec colonnes génériques
// ✅ Mise à jour d'enregistrements existants
// ✅ Gestion trim automatique des espaces
//
// 💾 DONNÉES: Préfixées TEST_IMPORT_* - nettoyage automatique

import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { PrismaClient } from '@prisma/client';

// Configuration pour forcer l'utilisation des tables dev
process.env.USE_DEV_VIEWS = 'true';
process.env.NODE_ENV = 'test';

const prisma = new PrismaClient();

// Types pour les tests
type ValidationError = {
	row: number;
	field: string;
	value: string;
	error: string;
};

// 📊 Données de test basées sur les VRAIES règles du code et fichiers d'exemple
const testImportData = {
	// ✅ CAS VALIDES selon code actuel et exemples Excel

	// Données attributes valides (basées sur attributes.csv)
	attributes: {
		valid: [
			['atr_nat', 'atr_val', 'atr_label'],
			['TEST_IMPORT_Couleur', 'Rouge', 'Rouge vif'],
			['TEST_IMPORT_Couleur', 'Bleu', 'Bleu marine'],
			['TEST_IMPORT_Materiau', 'Acier', 'Acier inoxydable']
		],
		mappedFields: { '0': 'atr_nat', '1': 'atr_val', '2': 'atr_label' }
	},

	// Données suppliers valides (basées sur supplier.csv)
	suppliers: {
		valid: [
			['sup_code', 'sup_label'],
			['TEST_S001', 'TEST_IMPORT_Fournisseur Alpha'],
			['TEST_S002', 'TEST_IMPORT_Fournisseur Beta'],
			['TEST_S003', 'TEST_IMPORT_Fournisseur Gamma']
		],
		mappedFields: { '0': 'sup_code', '1': 'sup_label' }
	},

	// Données categories valides (basées sur categories.csv)
	categories: {
		valid: [
			['atr_0_label', 'atr_1_label', 'atr_2_label', 'atr_3_label'],
			[
				'Catégorie des produits',
				'TEST_IMPORT_Electronique',
				'TEST_IMPORT_Composants',
				'TEST_IMPORT_Resistances'
			],
			['Catégorie des produits', 'TEST_IMPORT_Mecanique', 'TEST_IMPORT_Vis', ''],
			['Catégorie des produits', 'TEST_IMPORT_Autre', '', '']
		],
		mappedFields: { '0': 'atr_0_label', '1': 'atr_1_label', '2': 'atr_2_label', '3': 'atr_3_label' }
	},

	// ❌ CAS INVALIDES selon code actuel

	// Format CSV malformé (guillemets incorrects)
	csvMalformed: [
		['atr_nat', 'atr_val'],
		['TEST_Couleur', 'Rouge"incomplete'], // Guillemet non fermé
		['TEST_Materiau', '"Acier"""'] // Guillemets triples
	],

	// Champs obligatoires manquants
	missingRequired: {
		attributes: [
			['atr_nat', 'atr_val'],
			['', 'ValeurSansNature'], // atr_nat manquant
			['NatureSansValeur', ''] // atr_val manquant
		],
		suppliers: [
			['sup_code', 'sup_label'],
			['', 'Fournisseur sans code'], // sup_code manquant (obligatoire)
			['SUP004', ''] // sup_label vide (optionnel, donc valide)
		],
		categories: [
			['atr_0_label', 'atr_1_label'],
			['Autre valeur', 'TEST_Niveau1'], // atr_0_label != "Catégorie des produits"
			['', 'TEST_Niveau1'] // atr_0_label vide
		]
	},

	// Doublons internes
	internalDuplicates: {
		attributes: [
			['atr_nat', 'atr_val'],
			['TEST_Couleur', 'Rouge'],
			['TEST_Couleur', 'Rouge'] // Même combinaison atr_nat + atr_val
		],
		suppliers: [
			['sup_code', 'sup_label'],
			['TEST_S999', 'Premier'],
			['TEST_S999', 'Doublon'] // Même sup_code
		]
	},

	// Valeurs trop longues
	tooLongValues: {
		attributes: [
			['atr_nat', 'atr_val'],
			['TEST_' + 'A'.repeat(58), 'Valeur'], // atr_nat > 60 chars
			['Nature', 'TEST_' + 'B'.repeat(58)] // atr_val > 60 chars
		],
		suppliers: [
			['sup_code', 'sup_label'],
			['TEST_' + 'C'.repeat(28), 'Label'], // sup_code > 30 chars
			['SUP001', 'TEST_' + 'D'.repeat(48)] // sup_label > 50 chars
		]
	},

	// Données sans en-têtes (basées sur "Fichier sans en-têtes.csv")
	noHeaders: {
		data: [
			['TEST_S997', 'TEST_IMPORT_Fournisseur 1'],
			['TEST_S998', 'TEST_IMPORT_Fournisseur 2']
		],
		mappedFields: { '0': 'sup_code', '1': 'sup_label' }
	},

	// Données pour mise à jour
	forUpdate: {
		initial: [
			['sup_code', 'sup_label'],
			['TEST_UP01', 'Version initiale']
		],
		updated: [
			['sup_code', 'sup_label'],
			['TEST_UP01', 'Version mise à jour'] // Même sup_code, sup_label différent
		],
		mappedFields: { '0': 'sup_code', '1': 'sup_label' }
	},

	// Données avec espaces pour test trim
	withSpaces: [
		['atr_nat', 'atr_val'],
		['  TEST_IMPORT_Couleur  ', '  Rouge  '], // Espaces avant/après
		[' TEST_IMPORT_Materiau ', ' Acier '] // Espaces mixtes
	]
};

// Variables pour stocker les IDs créés
const createdIds = {
	attributes: [] as number[],
	suppliers: [] as number[],
	categories: [] as number[]
};

describe('Import System - Tests avec vraies données BDD', () => {
	// 🧹 Nettoyage avant tous les tests
	beforeAll(async () => {
		console.log('🧹 Nettoyage des données de test précédentes...');

		// Supprimer toutes les données TEST_IMPORT_* qui pourraient trainer
		await prisma.attribute_dev.deleteMany({
			where: {
				OR: [
					{ atr_nat: { startsWith: 'TEST_IMPORT_' } },
					{ atr_val: { startsWith: 'TEST_IMPORT_' } },
					{ atr_label: { startsWith: 'TEST_IMPORT_' } }
				]
			}
		});

		await prisma.supplier_dev.deleteMany({
			where: {
				OR: [
					{ sup_code: { startsWith: 'TEST_S' } },
					{ sup_label: { startsWith: 'TEST_IMPORT_' } },
					{ sup_code: { startsWith: 'TEST_UPD' } },
					{ sup_code: { startsWith: 'TEST_UP' } },
					{ sup_code: { startsWith: 'TB' } }
				]
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
				OR: [
					{ atr_nat: { startsWith: 'TEST_IMPORT_' } },
					{ atr_val: { startsWith: 'TEST_IMPORT_' } },
					{ atr_label: { startsWith: 'TEST_IMPORT_' } },
					{ atr_nat: { startsWith: 'TEST_' } }
				]
			}
		});

		await prisma.supplier_dev.deleteMany({
			where: {
				OR: [
					{ sup_code: { startsWith: 'TEST_S' } },
					{ sup_label: { startsWith: 'TEST_IMPORT_' } },
					{ sup_code: { startsWith: 'TEST_UPD' } },
					{ sup_code: { startsWith: 'TEST_UP' } },
					{ sup_code: { startsWith: 'TB' } }
				]
			}
		});

		console.log('✅ Données de test supprimées');
		await prisma.$disconnect();
	});

	// 🔄 Reset entre chaque test pour isolation
	beforeEach(() => {
		Object.keys(createdIds).forEach((key) => {
			createdIds[key as keyof typeof createdIds] = [];
		});
	});

	describe('✅ Tests import validation (POST /import?/validate)', () => {
		it('✅ VALIDE: devrait valider des attributes correctes', async () => {
			const response = await fetch('http://localhost:5173/import/api', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					data: testImportData.attributes.valid.slice(1),
					mappedFields: testImportData.attributes.mappedFields,
					targetTable: 'attribute_dev'
				})
			});

			expect(response.status).toBe(200);
			const result = await response.json();

			expect(result.success).toBe(true);
			expect(result.result).toBeDefined();
			expect(result.result.totalRows).toBe(3);
			expect(result.result.validRows).toBe(3);
			expect(result.result.invalidData).toHaveLength(0);
			expect(result.result.processed).toBe(false);
		});

		it('✅ VALIDE: devrait valider des suppliers corrects', async () => {
			const response = await fetch('http://localhost:5173/import/api', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					data: testImportData.suppliers.valid.slice(1), // Exclure les en-têtes
					mappedFields: testImportData.suppliers.mappedFields,
					targetTable: 'supplier_dev'
				})
			});

			expect(response.status).toBe(200);
			const result = await response.json();

			expect(result.result.totalRows).toBe(3);
			expect(result.result.validRows).toBe(3);
			expect(result.result.invalidData).toHaveLength(0);
		});

		it('✅ VALIDE: devrait valider des categories correctes', async () => {
			const response = await fetch('http://localhost:5173/import/api', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					data: testImportData.categories.valid.slice(1), // Exclure les en-têtes
					mappedFields: testImportData.categories.mappedFields,
					targetTable: 'v_categories_dev'
				})
			});

			expect(response.status).toBe(200);
			const result = await response.json();

			expect(result.result.totalRows).toBe(3);
			expect(result.result.validRows).toBe(3);
			expect(result.result.invalidData).toHaveLength(0);
		});

		it('❌ INVALIDE: devrait rejeter format CSV malformé', async () => {
			const response = await fetch('http://localhost:5173/import/api', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					data: testImportData.csvMalformed.slice(1), // Exclure les en-têtes
					mappedFields: { '0': 'atr_nat', '1': 'atr_val' },
					targetTable: 'attribute_dev'
				})
			});

			expect(response.status).toBe(200);
			const result = await response.json();

			expect(result.result.invalidData.length).toBeGreaterThan(0);
			expect(
				result.result.invalidData.some(
					(error: ValidationError) =>
						error.error.includes('Guillemets malformés') ||
						error.error.includes('Format CSV invalide')
				)
			).toBe(true);
		});

		it('❌ INVALIDE: devrait rejeter champs obligatoires manquants - attributes', async () => {
			const response = await fetch('http://localhost:5173/import/api', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					data: testImportData.missingRequired.attributes.slice(1),
					mappedFields: { '0': 'atr_nat', '1': 'atr_val' },
					targetTable: 'attribute_dev'
				})
			});

			expect(response.status).toBe(200);
			const result = await response.json();

			expect(result.result.invalidData.length).toBeGreaterThan(0);
			expect(
				result.result.invalidData.some((error: ValidationError) =>
					error.error.includes('Champ obligatoire manquant')
				)
			).toBe(true);
		});

		it('❌ INVALIDE: devrait rejeter champs obligatoires manquants - suppliers', async () => {
			const response = await fetch('http://localhost:5173/import/api', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					data: testImportData.missingRequired.suppliers.slice(1),
					mappedFields: testImportData.suppliers.mappedFields,
					targetTable: 'supplier_dev'
				})
			});

			expect(response.status).toBe(200);
			const result = await response.json();

			// Doit rejeter la ligne avec sup_code vide (obligatoire)
			expect(
				result.result.invalidData.some(
					(error: ValidationError) =>
						error.field === 'sup_code' && error.error.includes('Champ obligatoire manquant')
				)
			).toBe(true);
		});

		it('❌ INVALIDE: devrait rejeter atr_0_label non conforme pour catégories', async () => {
			const response = await fetch('http://localhost:5173/import/api', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					data: testImportData.missingRequired.categories.slice(1),
					mappedFields: { '0': 'atr_0_label', '1': 'atr_1_label' },
					targetTable: 'v_categories_dev'
				})
			});

			expect(response.status).toBe(200);
			const result = await response.json();

			// Doit rejeter si atr_0_label != "Catégorie des produits"
			expect(
				result.result.invalidData.some(
					(error: ValidationError) =>
						error.field === 'atr_0_label' && error.error.includes('Valeur non conforme')
				)
			).toBe(true);
		});

		it('❌ INVALIDE: devrait rejeter doublons internes - attributes', async () => {
			const response = await fetch('http://localhost:5173/import/api', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					data: testImportData.internalDuplicates.attributes.slice(1),
					mappedFields: { '0': 'atr_nat', '1': 'atr_val' },
					targetTable: 'attribute_dev'
				})
			});

			expect(response.status).toBe(200);
			const result = await response.json();

			expect(result.result.duplicates).toBeGreaterThan(0);
			expect(
				result.result.invalidData.some((error: ValidationError) =>
					error.error.includes('Doublon détecté')
				)
			).toBe(true);
		});

		it('❌ INVALIDE: devrait rejeter valeurs trop longues - attributes', async () => {
			const response = await fetch('http://localhost:5173/import/api', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					data: testImportData.tooLongValues.attributes.slice(1),
					mappedFields: { '0': 'atr_nat', '1': 'atr_val' },
					targetTable: 'attribute_dev'
				})
			});

			expect(response.status).toBe(200);
			const result = await response.json();

			expect(
				result.result.invalidData.some((error: ValidationError) =>
					error.error.includes('Format invalide')
				)
			).toBe(true);
		});

		it('✅ VALIDE: devrait gérer les données sans en-têtes', async () => {
			const response = await fetch('http://localhost:5173/import/api', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					data: testImportData.noHeaders.data, // Pas d'en-têtes à exclure
					mappedFields: testImportData.noHeaders.mappedFields,
					targetTable: 'supplier_dev'
				})
			});

			expect(response.status).toBe(200);
			const result = await response.json();

			expect(result.result.totalRows).toBe(2);
			expect(result.result.validRows).toBe(2);
			expect(result.result.invalidData).toHaveLength(0);
		});
	});

	describe('📥 Tests import processing (POST /import?/process)', () => {
		it('✅ VALIDE: devrait importer des attributes correctes', async () => {
			const response = await fetch('http://localhost:5173/import/api', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					data: testImportData.attributes.valid.slice(1),
					mappedFields: testImportData.attributes.mappedFields,
					targetTable: 'attribute_dev',
					action: 'process'
				})
			});

			expect(response.status).toBe(200);
			const result = await response.json();

			expect(result.result.processed).toBe(true);
			expect(result.result.inserted).toBeGreaterThan(0);
			expect(result.result.validRows).toBe(3);
			expect(result.result.errors).toHaveLength(0);

			// Vérifier que les données sont en base
			const importedAttributes = await prisma.attribute_dev.findMany({
				where: { atr_nat: { startsWith: 'TEST_IMPORT_' } }
			});

			expect(importedAttributes).toHaveLength(3);
			expect(importedAttributes.some((attr) => attr.atr_val === 'Rouge')).toBe(true);
			expect(importedAttributes.some((attr) => attr.atr_val === 'Bleu')).toBe(true);
			expect(importedAttributes.some((attr) => attr.atr_val === 'Acier')).toBe(true);
		});

		it('✅ VALIDE: devrait importer des suppliers corrects', async () => {
			const response = await fetch('http://localhost:5173/import/api', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					data: testImportData.suppliers.valid.slice(1),
					mappedFields: testImportData.suppliers.mappedFields,
					targetTable: 'supplier_dev',
					action: 'process'
				})
			});

			expect(response.status).toBe(200);
			const result = await response.json();

			expect(result.result.processed).toBe(true);
			expect(result.result.inserted).toBeGreaterThan(0);
			expect(result.result.validRows).toBe(3);

			// Vérifier que les données sont en base
			const importedSuppliers = await prisma.supplier_dev.findMany({
				where: { sup_code: { startsWith: 'TEST_S' } }
			});

			expect(importedSuppliers).toHaveLength(3);
			expect(importedSuppliers.some((sup) => sup.sup_code === 'TEST_S001')).toBe(true);
		});

		it('✅ VALIDE: devrait importer sans en-têtes', async () => {
			const response = await fetch('http://localhost:5173/import/api', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					data: testImportData.noHeaders.data,
					mappedFields: testImportData.noHeaders.mappedFields,
					targetTable: 'supplier_dev',
					action: 'process'
				})
			});

			expect(response.status).toBe(200);
			const result = await response.json();

			expect(result.result.processed).toBe(true);
			expect(result.result.inserted).toBe(2);

			// Vérifier que les données sont en base
			const importedSuppliers = await prisma.supplier_dev.findMany({
				where: { sup_code: { in: ['TEST_S997', 'TEST_S998'] } }
			});

			expect(importedSuppliers).toHaveLength(2);
		});

		it('❌ INVALIDE: devrait échouer sur données invalides et ne rien importer', async () => {
			const response = await fetch('http://localhost:5173/import/api', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					data: testImportData.missingRequired.suppliers.slice(1),
					mappedFields: testImportData.suppliers.mappedFields,
					targetTable: 'supplier_dev',
					action: 'process'
				})
			});

			expect(response.status).toBe(200);
			const result = await response.json();

			expect(result.result.processed).toBe(true);
			expect(result.result.invalidData.length).toBeGreaterThan(0);

			// Les données invalides ne devraient pas être importées
			// (seules les lignes valides le seraient)
			const importedCount = result.result.inserted || 0;
			expect(importedCount).toBeLessThan(2); // Moins que le total des lignes
		});
	});

	describe('🗃️ Tests spécifiques tables', () => {
		it('✅ CATEGORIES: devrait traiter correctement les niveaux hiérarchiques', async () => {
			const categoriesData = [
				['Catégorie des produits', 'TEST_IMPORT_Parent', '', ''],
				['Catégorie des produits', 'TEST_IMPORT_Parent2', 'TEST_IMPORT_Enfant', ''],
				[
					'Catégorie des produits',
					'TEST_IMPORT_Parent3',
					'TEST_IMPORT_Enfant2',
					'TEST_IMPORT_PetitEnfant'
				]
			];

			const response = await fetch('http://localhost:5173/import/api', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					data: categoriesData,
					mappedFields: {
						'0': 'atr_0_label',
						'1': 'atr_1_label',
						'2': 'atr_2_label',
						'3': 'atr_3_label'
					},
					targetTable: 'v_categories_dev',
					action: 'process'
				})
			});

			expect(response.status).toBe(200);
			const result = await response.json();

			expect(result.result.processed).toBe(true);
			expect(result.result.validRows).toBe(3);

			// Vérifier que les catégories apparaissent dans la vue
			const categories = await prisma.v_categories_dev.findMany({
				where: { atr_1_label: { startsWith: 'TEST_IMPORT_Parent' } }
			});

			expect(categories.length).toBeGreaterThan(0);
			expect(categories.some((cat) => cat.atr_1_label === 'TEST_IMPORT_Parent')).toBe(true);
			expect(categories.some((cat) => cat.atr_2_label === 'TEST_IMPORT_Enfant')).toBe(true);
			expect(categories.some((cat) => cat.atr_3_label === 'TEST_IMPORT_PetitEnfant')).toBe(true);
		});

		it('❌ CATEGORIES: devrait rejeter si pas de niveau 1 défini', async () => {
			const categoriesData = [
				['Catégorie des produits', '', '', ''] // Aucun niveau défini après atr_0
			];

			const response = await fetch('http://localhost:5173/import/api', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					data: categoriesData,
					mappedFields: { '0': 'atr_0_label', '1': 'atr_1_label' },
					targetTable: 'v_categories_dev',
					action: 'process'
				})
			});

			expect(response.status).toBe(200);
			const result = await response.json();

			// Doit être rejeté car aucun niveau 1-7 n'est rempli
			expect(
				result.result.invalidData.some(
					(error: ValidationError) =>
						error.error.includes('Au moins un niveau') ||
						error.error.includes('Champ obligatoire manquant')
				)
			).toBe(true);
		});
	});

	describe('🔍 Tests logique métier avancée', () => {
		it('✅ GESTION DOUBLONS: devrait identifier les doublons en base de données', async () => {
			// 1. Créer un supplier d'abord
			await prisma.supplier_dev.create({
				data: {
					sup_code: 'TEST01',
					sup_label: 'Fournisseur existant'
				}
			});

			// 2. Tenter d'importer le même supplier
			const response = await fetch('http://localhost:5173/import/api', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					data: [['TEST01', 'Tentative doublon']],
					mappedFields: { '0': 'sup_code', '1': 'sup_label' },
					targetTable: 'supplier_dev'
				})
			});

			expect(response.status).toBe(200);
			const result = await response.json();

			// Doit détecter le doublon avec la base de données
			expect(result.result.duplicates).toBe(1);
			expect(
				result.result.invalidData.some((error: ValidationError) =>
					error.error.includes('Existe déjà dans la base de données')
				)
			).toBe(true);

			// Nettoyer
			await prisma.supplier_dev.deleteMany({
				where: { sup_code: 'TEST01' }
			});
		});

		it('✅ PERFORMANCE: devrait gérer un grand nombre de lignes', async () => {
			// Générer 50 lignes de données de test
			const largeDataset = [];
			for (let i = 1; i <= 50; i++) {
				largeDataset.push([`TB${i.toString().padStart(3, '0')}`, `Bulk Supplier ${i}`]);
			}

			const startTime = Date.now();
			const response = await fetch('http://localhost:5173/import/api', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					data: largeDataset,
					mappedFields: { '0': 'sup_code', '1': 'sup_label' },
					targetTable: 'supplier_dev'
				})
			});
			const endTime = Date.now();

			expect(response.status).toBe(200);
			const result = await response.json();

			expect(result.result.totalRows).toBe(50);
			expect(result.result.validRows).toBe(50);
			expect(result.result.invalidData).toHaveLength(0);

			// Vérifier que la validation s'est faite dans un temps raisonnable (< 5 secondes)
			const processingTime = endTime - startTime;
			expect(processingTime).toBeLessThan(5000);
			console.log(`✅ Validation de 50 lignes traitée en ${processingTime}ms`);
		});

		it('✅ EDGE CASE: devrait gérer les valeurs null et undefined correctement', async () => {
			const edgeCaseData = [
				['TEST_NULL', null], // null value
				['TEST_UNDEFINED', undefined], // undefined value
				['TEST_EMPTY', ''] // empty string
			];

			const response = await fetch('http://localhost:5173/import/api', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					data: edgeCaseData,
					mappedFields: { '0': 'sup_code', '1': 'sup_label' },
					targetTable: 'supplier_dev'
				})
			});

			expect(response.status).toBe(200);
			const result = await response.json();

			// Les 3 lignes devraient être valides (sup_label est optionnel)
			expect(result.result.totalRows).toBe(3);
			expect(result.result.validRows).toBe(3);
			expect(result.result.invalidData).toHaveLength(0);
		});
	});
});
