<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { Button, Input } from 'flowbite-svelte';
	import { Search, Funnel } from 'lucide-svelte';

	export let fields: { key: string; label: String }[] = [];
	export let placeholder = 'Rechercher ...';

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
</script>

<div class="mb-4 flex flex-col gap-3 md:flex-row">
	{#if fields.length > 1}
		<div class="w-full md:w-1/4">
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

	<div class="w-full md:w-2/4">
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

	<div class="flex w-full gap-2 md:w-1/4">
		<Button color="blue" class="w-full" on:click={handleSearch}>
			<Funnel class="mr-2 h-4 w-4" />
			Filtrer1
		</Button>
		<Button color="light" class="w-full" on:click={handleReset}>Réinitialiser</Button>
	</div>
</div>
