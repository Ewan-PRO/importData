<!-- src/lib/components/Filter.svelte modifié -->
<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { Input } from 'flowbite-svelte';
	import { Button } from '$lib/components/ui/button';
	import { Search, Funnel, CirclePlus, RefreshCcw } from 'lucide-svelte';

	export let fields: { key: string; label: String }[] = [];
	export let placeholder = 'Rechercher ...';
	export let showAddButton = true; // Nouveau paramètre pour décider d'afficher ou non le bouton d'ajout
	export let addButtonText = 'Ajouter'; // Nouveau paramètre pour personnaliser le texte du bouton

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
						class="border-input flex h-10.5 w-full items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
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
		<Button variant="bleu" class="flex-1 sm:flex-initial" onclick={handleSearch}>
			<Funnel class="mr-2 h-4 w-4" />
			Filtrer
		</Button>
		<Button variant="noir" class="flex-1 sm:flex-initial" onclick={handleReset}>
			<RefreshCcw class="mr-2 h-4 w-4" />
			Réinitialiser
		</Button>
		{#if showAddButton}
			<Button variant="vert" class="flex-1 sm:flex-initial" onclick={handleAddClick}>
				<CirclePlus class="mr-2 h-4 w-4" />
				{addButtonText}
			</Button>
		{/if}
	</div>
</div>
