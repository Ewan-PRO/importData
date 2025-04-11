<script>
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	onMount(() => {
		console.log("Page d'erreur chargée");
		console.log("Paramètres d'erreur:", $page.url.searchParams.get('error'));
	});
</script>

<div class="container mx-auto p-6">
	<div class="mx-auto max-w-lg rounded-lg bg-white p-8 shadow-md">
		<div class="mb-6 text-center text-5xl text-[#e31206]">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="mx-auto h-16 w-16"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
				/>
			</svg>
		</div>
		<h1 class="mb-4 text-center text-2xl font-bold">Accès Refusé</h1>
		<p class="mb-6 text-center text-gray-600">
			Une erreur s'est produite lors de votre authentification.
		</p>

		{#if $page.url.searchParams.get('error')}
			<div class="mb-4 rounded bg-gray-100 p-3 text-sm">
				<p class="font-medium">Détail de l'erreur:</p>
				<p class="text-red-600">{$page.url.searchParams.get('error')}</p>
			</div>
		{/if}

		<div class="flex justify-center">
			<a
				href="/"
				class="mr-2 rounded bg-gray-200 px-4 py-2 transition-colors duration-300 hover:bg-gray-300"
			>
				Retour à l'accueil
			</a>
			<form method="POST" action="/?/signIn">
				<button
					type="submit"
					class="rounded bg-[#2563eb] px-4 py-2 text-white transition-colors duration-300 hover:bg-[#3c24ac]"
				>
					Réessayer
				</button>
			</form>
		</div>
	</div>
</div>
