<!-- src/lib/components/Filter.svelte modifié -->
<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import * as Select from '$lib/components/ui/select';
	import { Search, CirclePlus, RefreshCcw } from 'lucide-svelte';

	let {
		fields = [],
		placeholder = 'Rechercher ...',
		showAddButton = true,
		addButtonText = 'Ajouter'
	}: {
		fields?: { key: string; label: string }[];
		placeholder?: string;
		showAddButton?: boolean;
		addButtonText?: string;
	} = $props();

	let searchTerm = $state('');
	let selectedField = $state(fields.length > 0 ? fields[0].key : '');

	const selectedFieldLabel = $derived(
		fields.find((f) => f.key === selectedField)?.label ?? 'Sélectionner un champ'
	);

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
					<Select.Root type="single" bind:value={selectedField}>
						<Select.Trigger class="w-full">
							{selectedFieldLabel}
						</Select.Trigger>
						<Select.Content>
							{#each fields as field (field.key)}
								<Select.Item value={field.key} label={field.label}>
									{field.label}
								</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
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
						class="w-full pr-20 pl-10"
						onkeyup={(e) => e.key === 'Enter' && handleSearch()}
					/>
					<div class="absolute inset-y-0 right-0 flex items-center pr-1">
						<Button variant="bleu" size="sm" onclick={handleSearch}>
							<Search class="h-4 w-4" />
							Rechercher
						</Button>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Groupe de boutons -->
	<div class="flex flex-wrap gap-3 sm:flex-nowrap sm:items-start">
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
