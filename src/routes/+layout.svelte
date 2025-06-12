<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import AuthButton from '$lib/components/AuthButton.svelte';
	import { isAuthenticated } from '$lib/auth';
	import { page } from '$app/stores';
	import { Toaster } from '$lib/components/ui/sonner';

	interface PageData {
		user?: any;
	}

	export let data: PageData;
	$: user = data.user;
	let loaded = false;

	onMount(() => {
		loaded = true;
	});

	// Navigation items
	const navItems = [
		{ href: '/', label: 'Accueil' },
		{ href: '/categories', label: 'Catégories' },
		{ href: '/kits', label: 'Kits' },
		{ href: '/products', label: 'Produits' },
		{ href: '/import', label: 'Import' }
	];
</script>

<div
	class="min-h-screen bg-gray-50 transition-opacity duration-300 {loaded
		? 'opacity-100'
		: 'opacity-0'}"
>
	<header class="bg-white shadow">
		<div class="container mx-auto px-4">
			<!-- Top bar -->
			<div class="flex items-center justify-between py-4">
				<a href="/" class="text-xl font-bold text-[#e31206]">CenovDistribution</a>
				<div class="flex items-center space-x-4">
					{#if isAuthenticated(user)}
						<span>Bonjour, {user.name || 'Client'}</span>
					{/if}
					<AuthButton {user} />
				</div>
			</div>

			<!-- Navigation -->
			{#if isAuthenticated(user)}
				<nav class="border-t border-gray-200">
					<div class="flex space-x-8 py-3">
						{#each navItems as item}
							<a
								href={item.href}
								class="text-sm font-medium transition-colors hover:text-[#e31206] {$page.url
									.pathname === item.href
									? 'border-b-2 border-[#e31206] pb-3 text-[#e31206]'
									: 'text-gray-600'}"
							>
								{item.label}
							</a>
						{/each}
					</div>
				</nav>
			{/if}
		</div>
	</header>

	<main class="container mx-auto px-4 py-8">
		<slot />
	</main>

	<!-- Toaster pour les notifications Sonner -->
	<Toaster />
</div>
