// Utilitaire de fetch avec logs détaillés pour le débogage côté client

export interface DebugFetchOptions extends RequestInit {
	timeout?: number;
}

export async function debugFetch(
	url: string,
	options: DebugFetchOptions = {},
	context = 'UNKNOWN'
): Promise<Response> {
	const startTime = performance.now();
	const requestId = Math.random().toString(36).slice(2, 11);

	console.log(`🚀 [FETCH-${context}] [${requestId}] Début requête vers: ${url}`);
	console.log(`📋 [FETCH-${context}] [${requestId}] Options:`, {
		method: options.method || 'GET',
		headers: options.headers,
		body: options.body ? 'PRÉSENT' : 'ABSENT',
		timeout: options.timeout || 'DÉFAUT'
	});

	const { timeout, ...fetchOptions } = options;

	try {
		let response: Response;

		if (timeout) {
			// Créer un AbortController pour le timeout
			const controller = new AbortController();
			const timeoutId = setTimeout(() => controller.abort(), timeout);

			try {
				response = await fetch(url, {
					...fetchOptions,
					signal: controller.signal
				});
				clearTimeout(timeoutId);
			} catch (error) {
				clearTimeout(timeoutId);
				throw error;
			}
		} else {
			response = await fetch(url, fetchOptions);
		}

		const endTime = performance.now();
		const duration = Math.round(endTime - startTime);

		console.log(`📡 [FETCH-${context}] [${requestId}] Réponse reçue:`, {
			status: response.status,
			statusText: response.statusText,
			ok: response.ok,
			headers: Object.fromEntries(response.headers.entries()),
			duration: `${duration}ms`
		});

		if (response.ok) {
			console.log(`✅ [FETCH-${context}] [${requestId}] Succès en ${duration}ms`);
		} else {
			console.error(
				`❌ [FETCH-${context}] [${requestId}] Erreur HTTP: ${response.status} - ${response.statusText}`
			);
		}

		return response;
	} catch (error) {
		const endTime = performance.now();
		const duration = Math.round(endTime - startTime);

		console.error(`❌ [FETCH-${context}] [${requestId}] Erreur après ${duration}ms:`, error);

		if (error instanceof Error) {
			console.error(`❌ [FETCH-${context}] [${requestId}] Message:`, error.message);
			console.error(`❌ [FETCH-${context}] [${requestId}] Stack:`, error.stack);
		}

		// Ajouter des informations sur le type d'erreur
		if (error instanceof Error) {
			if (error.name === 'AbortError') {
				console.error(`⏱️ [FETCH-${context}] [${requestId}] Timeout atteint (${timeout}ms)`);
			} else if (error.name === 'TypeError') {
				console.error(`🌐 [FETCH-${context}] [${requestId}] Erreur réseau ou CORS`);
			}
		}

		throw error;
	}
}

// Fonction utilitaire pour faire un fetch JSON avec logs
export async function debugFetchJson<T = unknown>(
	url: string,
	options: DebugFetchOptions = {},
	context = 'UNKNOWN'
): Promise<T> {
	const response = await debugFetch(url, options, context);

	try {
		const data = await response.json();
		console.log(`📦 [FETCH-${context}] Données JSON parsées:`, {
			type: typeof data,
			isArray: Array.isArray(data),
			keys: typeof data === 'object' && data !== null ? Object.keys(data) : 'N/A',
			length: Array.isArray(data) ? data.length : 'N/A'
		});

		return data;
	} catch (error) {
		console.error(`❌ [FETCH-${context}] Erreur parsing JSON:`, error);
		console.error(`❌ [FETCH-${context}] Response text:`, await response.text());
		throw error;
	}
}
