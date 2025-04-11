<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { logtoClient } from '$lib/auth';

	let error = '';
	let loading = true;

	onMount(async () => {
		try {
			console.log("Traitement du callback d'authentification");

			// Passer une URL de redirection comme argument
			await logtoClient.handleSignInCallback(window.location.href);

			console.log('Authentification réussie, redirection...');
			loading = false;
			goto('/');
		} catch (err) {
			console.error("Erreur d'authentification:", err);
			loading = false;
			error = err instanceof Error ? err.message : 'Erreur inconnue';
		}
	});
</script>

{#if error}
	<div class="flex h-[50vh] flex-col items-center justify-center">
		<div class="max-w-lg rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
			<p class="font-bold">Erreur lors de l'authentification</p>
			<p class="text-sm">{error}</p>
			<p class="mt-4">
				<a href="/" class="text-blue-600 underline">Retourner à l'accueil</a> et réessayer.
			</p>
		</div>
	</div>
{:else}
	<div class="flex h-[50vh] flex-col items-center justify-center">
		<div class="h-16 w-16 animate-spin rounded-full border-t-4 border-[#e31206]"></div>
		<p class="mt-4 text-lg">Authentification en cours...</p>
	</div>
{/if}
