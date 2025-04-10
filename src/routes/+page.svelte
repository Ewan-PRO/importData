<script lang="ts">
	import UserInfo from '$lib/components/UserInfo.svelte';
	import { goto } from '$app/navigation';

	export let data;

	// Fonction pour gérer la connexion via JS au lieu d'un formulaire POST
	async function handleSignIn() {
		try {
			const response = await fetch('?/signIn', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				}
			});

			if (response.ok) {
				const result = await response.json();
				if (result.redirectUrl) {
					window.location.href = result.redirectUrl;
				}
			} else {
				console.error('Erreur lors de la tentative de connexion');
			}
		} catch (error) {
			console.error('Erreur lors de la connexion:', error);
		}
	}
</script>

<div class="mx-auto max-w-3xl">
	<h1 class="mb-6 text-3xl font-bold">Bienvenue sur CenovDistribution</h1>

	{#if data.user}
		<div class="mb-6 rounded-md bg-green-100 p-4 text-green-800">Vous êtes connecté !</div>
		<UserInfo user={data.user} />
	{:else}
		<div class="mb-6 rounded-md bg-blue-100 p-4">
			<p class="mb-2">
				Connectez-vous pour accéder à notre catalogue de pompes et moteurs industriels.
			</p>
			<form method="POST" action="?/signIn">
				<button
					type="submit"
					class="rme-2 mb-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 focus:outline-none dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
				>
					Se connecter
				</button>
			</form>
		</div>
	{/if}
</div>
