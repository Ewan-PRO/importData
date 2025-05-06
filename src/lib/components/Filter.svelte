<!-- src/lib/components/Filter.svelte modifié -->
<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { Button, Input } from 'flowbite-svelte';
	import { Search, Funnel, CirclePlus } from 'lucide-svelte';

	export let fields: { key: string; label: String }[] = [];
	export let placeholder = 'Rechercher ...';
	export let showAddButton = true; // Nouveau paramètre pour décider d'afficher ou non le bouton d'ajout

	let searchTerm = '';
	let selectedField = fields.length > 0 ? fields[0].key : '';

	const dispatch = createEventDispatcher();

	function handleSearch() {
		dispatch('filter', {
			field: selectedField,
			term: searchTerm
		});
	}

	function handleReset() {
		searchTerm = '';
		selectedField = fields.length > 0 ? fields[0].key : '';
		dispatch('reset');
	}

	function handleAddClick() {
		dispatch('add');
	}
</script>

<div class="mb-4 flex flex-col gap-3 sm:flex-row">
	<!-- Champ de recherche -->
	<div class="flex-grow">
		<div class="flex flex-col gap-3 sm:flex-row">
			{#if fields.length > 1}
				<div class="w-full sm:w-1/4">
					<select
						class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
						bind:value={selectedField}
					>
						{#each fields as field}
							<option value={field.key}>{field.label}</option>
						{/each}
					</select>
				</div>
			{/if}

			<div class="w-full sm:flex-1">
				<div class="relative">
					<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
						<Search class="h-4 w-4 text-gray-500" />
					</div>
					<Input
						type="search"
						bind:value={searchTerm}
						{placeholder}
						class="w-full pl-10"
						on:keyup={(e) => e.key === 'Enter' && handleSearch()}
					/>
				</div>
			</div>
		</div>
	</div>

	<!-- Groupe de boutons -->
	<div class="flex flex-wrap gap-3 sm:flex-nowrap sm:items-start">
		<Button color="blue" class="flex-1 sm:flex-initial" on:click={handleSearch}>
			<Funnel class="mr-2 h-4 w-4" />
			Filtrer
		</Button>
		<Button color="dark" class="flex-1 sm:flex-initial" on:click={handleReset}>
			Réinitialiser
		</Button>
		{#if showAddButton}
			<div class="flex w-full justify-center sm:w-auto sm:justify-start">
				<Button color="green" class="w-8/12 sm:w-auto" on:click={handleAddClick}>
					<CirclePlus class="mr-2 h-4 w-4" />
					Ajouter une catégorie
				</Button>
			</div>
		{/if}
	</div>
</div>
