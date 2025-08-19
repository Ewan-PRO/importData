// Test de connectivité réseau pour diagnostiquer les problèmes PostgreSQL
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	console.log('🚀 [NETWORK-TEST] Début des tests de connectivité réseau');

	interface TestResult {
		status: 'OK' | 'ERROR' | 'INFO';
		[key: string]: unknown;
	}

	const testResults = {
		timestamp: new Date().toISOString(),
		tests: {} as Record<string, TestResult>,
		environment: {
			nodeEnv: process.env.NODE_ENV,
			databaseUrl: process.env.DATABASE_URL ? 'DÉFINI' : 'NON DÉFINI'
		}
	};

	// Test 1: Résolution DNS
	try {
		console.log('🔍 [NETWORK-TEST] Test de résolution DNS');
		const dns = await import('dns');
		const { promisify } = await import('util');
		const lookup = promisify(dns.lookup);

		const result = await lookup('o4ggowc0808ccgo0w40c8gok');
		testResults.tests.dns = {
			status: 'OK',
			hostname: 'o4ggowc0808ccgo0w40c8gok',
			ip: result.address,
			family: result.family
		};
		console.log('✅ [NETWORK-TEST] DNS résolu:', result);
	} catch (error) {
		testResults.tests.dns = {
			status: 'ERROR',
			error: error instanceof Error ? error.message : 'Erreur inconnue'
		};
		console.error('❌ [NETWORK-TEST] Erreur DNS:', error);
	}

	// Test 2: Test de connectivité TCP
	try {
		console.log('🔍 [NETWORK-TEST] Test de connectivité TCP port 5432');
		const net = await import('net');

		const tcpTest = await new Promise((resolve, reject) => {
			const socket = new net.Socket();
			const timeout = setTimeout(() => {
				socket.destroy();
				reject(new Error('Timeout après 5 secondes'));
			}, 5000);

			socket.connect(5432, 'o4ggowc0808ccgo0w40c8gok', () => {
				clearTimeout(timeout);
				socket.end();
				resolve('Connexion TCP réussie');
			});

			socket.on('error', (err) => {
				clearTimeout(timeout);
				reject(err);
			});
		});

		testResults.tests.tcp = {
			status: 'OK',
			port: 5432,
			result: tcpTest
		};
		console.log('✅ [NETWORK-TEST] TCP connecté:', tcpTest);
	} catch (error) {
		testResults.tests.tcp = {
			status: 'ERROR',
			port: 5432,
			error: error instanceof Error ? error.message : 'Erreur inconnue'
		};
		console.error('❌ [NETWORK-TEST] Erreur TCP:', error);
	}

	// Test 3: Variables d'environnement
	console.log("🔍 [NETWORK-TEST] Vérification variables d'environnement");
	if (process.env.DATABASE_URL) {
		try {
			const url = new URL(process.env.DATABASE_URL);
			testResults.tests.envVars = {
				status: 'OK',
				protocol: url.protocol,
				hostname: url.hostname,
				port: url.port,
				database: url.pathname,
				username: url.username ? 'DÉFINI' : 'NON DÉFINI',
				password: url.password ? 'DÉFINI' : 'NON DÉFINI'
			};
		} catch {
			testResults.tests.envVars = {
				status: 'ERROR',
				error: 'URL malformée'
			};
		}
	} else {
		testResults.tests.envVars = {
			status: 'ERROR',
			error: 'DATABASE_URL non définie'
		};
	}

	// Test 4: Informations container
	try {
		console.log('🔍 [NETWORK-TEST] Informations container');
		const os = await import('os');
		testResults.tests.container = {
			status: 'OK',
			hostname: os.hostname(),
			platform: os.platform(),
			arch: os.arch(),
			networkInterfaces: Object.keys(os.networkInterfaces())
		};
	} catch (error) {
		testResults.tests.container = {
			status: 'ERROR',
			error: error instanceof Error ? error.message : 'Erreur inconnue'
		};
	}

	// Test 5: Informations de base pour PostgreSQL
	testResults.tests.postgresql = {
		status: 'INFO',
		note: 'Test Prisma disponible via /api/debug/db-test'
	};

	console.log('✅ [NETWORK-TEST] Tests terminés');
	return json(testResults);
};
