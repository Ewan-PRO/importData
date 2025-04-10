<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte'; // Ajoutez cet import
	import AuthButton from '$lib/components/AuthButton.svelte';
	import { isAuthenticated } from '$lib/auth';

	interface PageData {
		user?: any;
	}

	export let data: PageData;
	$: user = data.user;
	let loaded = false;

	onMount(() => {
		loaded = true;
	});
</script>

<div
	class="min-h-screen bg-gray-50 transition-opacity duration-300 {loaded
		? 'opacity-100'
		: 'opacity-0'}"
>
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
