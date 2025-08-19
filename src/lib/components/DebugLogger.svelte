<!-- Composant de débogage global pour traquer les erreurs côté client -->
<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	console.log('🔧 [DEBUG-LOGGER] Composant de debug initialisé');

	onMount(() => {
		console.log('🔧 [DEBUG-LOGGER] onMount appelé');
		console.log('🔍 [DEBUG-LOGGER] URL actuelle:', $page.url.pathname);
		console.log('🔍 [DEBUG-LOGGER] Données de page:', $page.data);
		console.log('🔍 [DEBUG-LOGGER] User-Agent:', navigator.userAgent);
		console.log('🔍 [DEBUG-LOGGER] Cookies:', document.cookie);

		// Intercepter les erreurs JavaScript
		const originalError = window.onerror;
		window.onerror = (message, source, lineno, colno, error) => {
			console.error('❌ [DEBUG-LOGGER] Erreur JavaScript interceptée:', {
				message,
				source,
				lineno,
				colno,
				error,
				url: window.location.href,
				timestamp: new Date().toISOString()
			});

			if (originalError) {
				return originalError(message, source, lineno, colno, error);
			}
			return false;
		};

		// Intercepter les promesses rejetées
		const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
			console.error('❌ [DEBUG-LOGGER] Promise rejetée interceptée:', {
				reason: event.reason,
				url: window.location.href,
				timestamp: new Date().toISOString()
			});
		};

		window.addEventListener('unhandledrejection', handleUnhandledRejection);

		// Intercepter tous les appels fetch
		const originalFetch = window.fetch;
		window.fetch = async (...args) => {
			const [url, options] = args;
			const startTime = performance.now();

			console.log('🌐 [DEBUG-LOGGER] Fetch intercepté:', {
				url: typeof url === 'string' ? url : url.toString(),
				method: options?.method || 'GET',
				headers: options?.headers,
				timestamp: new Date().toISOString()
			});

			try {
				const response = await originalFetch(...args);
				const endTime = performance.now();

				console.log('🌐 [DEBUG-LOGGER] Fetch réponse:', {
					url: typeof url === 'string' ? url : url.toString(),
					status: response.status,
					statusText: response.statusText,
					ok: response.ok,
					duration: `${Math.round(endTime - startTime)}ms`,
					timestamp: new Date().toISOString()
				});

				if (!response.ok) {
					console.error('❌ [DEBUG-LOGGER] Fetch échec:', {
						url: typeof url === 'string' ? url : url.toString(),
						status: response.status,
						statusText: response.statusText
					});
				}

				return response;
			} catch (error) {
				const endTime = performance.now();

				console.error('❌ [DEBUG-LOGGER] Fetch erreur:', {
					url: typeof url === 'string' ? url : url.toString(),
					error,
					duration: `${Math.round(endTime - startTime)}ms`,
					timestamp: new Date().toISOString()
				});

				throw error;
			}
		};

		// Log des changements de page
		const unsubscribe = page.subscribe((pageData) => {
			console.log('🔄 [DEBUG-LOGGER] Changement de page:', {
				pathname: pageData.url.pathname,
				params: pageData.params,
				route: pageData.route,
				timestamp: new Date().toISOString()
			});
		});

		return () => {
			// Restaurer les handlers originaux lors de la destruction
			window.onerror = originalError;
			window.removeEventListener('unhandledrejection', handleUnhandledRejection);
			window.fetch = originalFetch;
			unsubscribe();
			console.log('🔧 [DEBUG-LOGGER] Nettoyage effectué');
		};
	});
</script>

<!-- Ce composant n'affiche rien visuellement -->
<style>
	/* Aucun style nécessaire */
</style>
