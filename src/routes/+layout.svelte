<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';
	import AuthButton from '$lib/components/AuthButton.svelte';
	import { isAuthenticated } from '$lib/auth';

	// Définir l'interface pour le type de data
	interface PageData {
		user?: any; // ou utilisez un type plus précis si disponible
	}

	export let data: PageData;
	$: user = data.user;
</script>

<div class="min-h-screen bg-gray-50">
	<header class="bg-white shadow">
		<div class="container mx-auto flex items-center justify-between px-4 py-4">
			<a href="/" class="text-xl font-bold text-[#e31206]">CenovDistribution</a>
			<div class="flex items-center space-x-4">
				{#if isAuthenticated(user)}
					<span>Bonjour, {user.name || 'Client'}</span>
				{/if}
				<AuthButton {user} />
			</div>
		</div>
	</header>

	<main class="container mx-auto px-4 py-8">
		<slot />
	</main>
</div>
