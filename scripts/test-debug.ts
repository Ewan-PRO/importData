// Script de test pour vérifier le système de logs de débogage
// Usage: npx tsx scripts/test-debug.ts

const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';

interface TestResult {
	endpoint: string;
	status: number;
	success: boolean;
	duration: number;
	error?: string;
}

async function testEndpoint(path: string): Promise<TestResult> {
	const url = `${BASE_URL}${path}`;
	const startTime = Date.now();

	console.log(`🧪 Test de ${path}...`);

	try {
		const response = await fetch(url);
		const duration = Date.now() - startTime;

		const result = {
			endpoint: path,
			status: response.status,
			success: response.ok,
			duration
		};

		if (response.ok) {
			console.log(`✅ ${path} - ${response.status} (${duration}ms)`);
		} else {
			console.log(`❌ ${path} - ${response.status} (${duration}ms)`);
		}

		return result;
	} catch (error) {
		const duration = Date.now() - startTime;
		const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';

		console.log(`❌ ${path} - ERREUR: ${errorMessage} (${duration}ms)`);

		return {
			endpoint: path,
			status: 0,
			success: false,
			duration,
			error: errorMessage
		};
	}
}

async function runTests() {
	console.log('🔧 Test du système de logs de débogage');
	console.log('=====================================');
	console.log(`Base URL: ${BASE_URL}`);
	console.log('');

	const endpoints = ['/api/debug/db-test', '/categories/api', '/kits/api'];

	const results: TestResult[] = [];

	for (const endpoint of endpoints) {
		const result = await testEndpoint(endpoint);
		results.push(result);
		console.log('');
	}

	// Résumé
	console.log('📊 Résumé des tests:');
	console.log('====================');

	const successful = results.filter((r) => r.success).length;
	const total = results.length;

	console.log(`✅ Succès: ${successful}/${total}`);
	console.log(`❌ Échecs: ${total - successful}/${total}`);
	console.log('');

	// Détails des échecs
	const failures = results.filter((r) => !r.success);
	if (failures.length > 0) {
		console.log('❌ Détails des échecs:');
		failures.forEach((f) => {
			console.log(`  - ${f.endpoint}: ${f.error || `HTTP ${f.status}`}`);
		});
		console.log('');
	}

	// Instructions
	console.log('📋 Prochaines étapes:');
	console.log('=====================');

	if (failures.length === 0) {
		console.log('✅ Tous les tests passent !');
		console.log('🔍 Vérifiez maintenant les logs dans la console du serveur');
		console.log('🌐 Testez manuellement les pages dans le navigateur');
	} else {
		console.log('❌ Des endpoints échouent');
		console.log('🔧 Vérifiez la configuration et les logs du serveur');
		console.log('📡 Assurez-vous que la base de données est accessible');
	}

	console.log('');
	console.log('📝 Logs à surveiller:');
	console.log("  - [HOOKS] Variables d'environnement et authentification");
	console.log('  - [API-*] Connexions base de données et requêtes');
	console.log('  - [DB-TEST] Résultats des tests de connectivité');

	process.exit(failures.length > 0 ? 1 : 0);
}

runTests().catch((error) => {
	console.error('❌ Erreur lors des tests:', error);
	process.exit(1);
});
