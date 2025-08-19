// Endpoint de test pour vérifier la connectivité à la base de données
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Types pour les résultats de test
interface TestResult {
	count?: number;
	status: 'OK' | 'ERROR';
	error?: string;
}

interface TestResults {
	timestamp: string;
	connection: boolean;
	tables: Record<string, TestResult>;
	views: Record<string, TestResult>;
	sampleQuery?: TestResult & { data?: unknown };
	errors: string[];
}

export const GET: RequestHandler = async () => {
	console.log('🚀 [DB-TEST] Début du test de base de données');

	const testResults: TestResults = {
		timestamp: new Date().toISOString(),
		connection: false,
		tables: {},
		views: {},
		errors: []
	};

	try {
		// Test 1: Connexion de base
		console.log('🔍 [DB-TEST] Test de connexion de base');
		await prisma.$connect();
		testResults.connection = true;
		console.log('✅ [DB-TEST] Connexion établie');

		// Test 2: Test des tables principales
		console.log('🔍 [DB-TEST] Test des tables principales');

		try {
			const attributeCount = await prisma.attribute_dev.count();
			testResults.tables['attribute_dev'] = { count: attributeCount, status: 'OK' };
			console.log(`📊 [DB-TEST] attribute_dev: ${attributeCount} enregistrements`);
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
			testResults.tables['attribute_dev'] = { status: 'ERROR', error: errorMessage };
			testResults.errors.push(`attribute_dev: ${errorMessage}`);
			console.error('❌ [DB-TEST] Erreur attribute_dev:', error);
		}

		try {
			const kitCount = await prisma.kit_dev.count();
			testResults.tables['kit_dev'] = { count: kitCount, status: 'OK' };
			console.log(`📊 [DB-TEST] kit_dev: ${kitCount} enregistrements`);
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
			testResults.tables['kit_dev'] = { status: 'ERROR', error: errorMessage };
			testResults.errors.push(`kit_dev: ${errorMessage}`);
			console.error('❌ [DB-TEST] Erreur kit_dev:', error);
		}

		try {
			const kitAttrCount = await prisma.kit_attribute_dev.count();
			testResults.tables['kit_attribute_dev'] = { count: kitAttrCount, status: 'OK' };
			console.log(`📊 [DB-TEST] kit_attribute_dev: ${kitAttrCount} enregistrements`);
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
			testResults.tables['kit_attribute_dev'] = { status: 'ERROR', error: errorMessage };
			testResults.errors.push(`kit_attribute_dev: ${errorMessage}`);
			console.error('❌ [DB-TEST] Erreur kit_attribute_dev:', error);
		}

		// Test 3: Test des vues
		console.log('🔍 [DB-TEST] Test des vues');

		try {
			const categoriesCount = await prisma.v_categories_dev.count();
			testResults.views['v_categories_dev'] = { count: categoriesCount, status: 'OK' };
			console.log(`📊 [DB-TEST] v_categories_dev: ${categoriesCount} enregistrements`);
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
			testResults.views['v_categories_dev'] = { status: 'ERROR', error: errorMessage };
			testResults.errors.push(`v_categories_dev: ${errorMessage}`);
			console.error('❌ [DB-TEST] Erreur v_categories_dev:', error);
		}

		try {
			const kitsViewCount = await prisma.v_kit_carac_dev.count();
			testResults.views['v_kit_carac_dev'] = { count: kitsViewCount, status: 'OK' };
			console.log(`📊 [DB-TEST] v_kit_carac_dev: ${kitsViewCount} enregistrements`);
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
			testResults.views['v_kit_carac_dev'] = { status: 'ERROR', error: errorMessage };
			testResults.errors.push(`v_kit_carac_dev: ${errorMessage}`);
			console.error('❌ [DB-TEST] Erreur v_kit_carac_dev:', error);
		}

		// Test 4: Test d'une requête simple
		console.log("🔍 [DB-TEST] Test d'une requête simple");
		try {
			const sampleData = await prisma.attribute_dev.findFirst({
				select: {
					atr_id: true,
					atr_nat: true,
					atr_val: true,
					atr_label: true
				}
			});
			testResults.sampleQuery = { status: 'OK', data: sampleData };
			console.log('📊 [DB-TEST] Exemple de données:', sampleData);
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
			testResults.sampleQuery = { status: 'ERROR', error: errorMessage };
			testResults.errors.push(`Sample query: ${errorMessage}`);
			console.error('❌ [DB-TEST] Erreur requête exemple:', error);
		}

		console.log('✅ [DB-TEST] Tests terminés');
		return json(testResults);
	} catch (error) {
		console.error('❌ [DB-TEST] Erreur générale:', error);
		const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
		testResults.errors.push(`General error: ${errorMessage}`);
		return json(testResults, { status: 500 });
	} finally {
		try {
			await prisma.$disconnect();
			console.log('🔌 [DB-TEST] Connexion fermée');
		} catch (disconnectError) {
			console.error('⚠️ [DB-TEST] Erreur lors de la déconnexion:', disconnectError);
		}
	}
};
