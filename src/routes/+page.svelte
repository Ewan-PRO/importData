<script>
	import { Button } from 'flowbite-svelte';
</script>

<svelte:head>
	<title>Accueil - Cenov Distribution</title>
</svelte:head>

<div class="container mx-auto p-4">
	<h1 class="mb-6 text-3xl font-bold">Cenov Distribution - Pompes et Moteurs</h1>

	<div class="mt-8 flex space-x-4">
		<a
			href="/products"
			class="rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-800"
		>
			Gérer les produits
		</a>
		<a
			href="/products/import"
			class="rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-800"
		>
			Importer des produits
		</a>
	</div>
</div>
