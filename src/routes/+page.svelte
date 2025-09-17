<script lang="ts">
	import { LogIn } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import UserInfo from '$lib/components/UserInfo.svelte';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';

	export let data;

	// Afficher le toast d'erreur au chargement de la page si nécessaire
	onMount(() => {
		if (data.authError) {
			const routeNames: Record<string, string> = {
				categories: 'la page des catégories',
				kits: 'la page des kits',
				import: "la page d'import",
				export: "la page d'export"
			};

			const routeName = routeNames[data.authError] || 'cette page';
			const message = `Vous devez être connecté pour accéder à ${routeName}`;

			// Ajouter un délai pour s'assurer que le DOM est prêt
			setTimeout(() => {
				toast.error(message, {
					duration: 5000
				});
			}, 100);

			// Nettoyer l'URL pour éviter que le toast réapparaisse au refresh
			const url = new URL(window.location.href);
			url.searchParams.delete('error');
			url.searchParams.delete('route');
			window.history.replaceState({}, '', url.toString());
		}
	});
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
				<Button type="submit" variant="bleu" class="me-2 mb-2">
					<LogIn size={16} />
					Se connecter
				</Button>
			</form>
		</div>
	{/if}
</div>
