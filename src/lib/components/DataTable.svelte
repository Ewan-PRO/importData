<!-- DataTable.svelte - Solution cartes améliorée -->
<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { Button } from '$lib/components/ui/button';
	import { SquarePen, Trash2, CheckSquare, Square } from 'lucide-svelte';

	export let data: any[] = [];
	export let columns: { key: string; header: string; formatter?: (value: any) => string }[] = [];
	export let selectable = false;
	export let multiSelect = false;
	export let actions = true;

	const dispatch = createEventDispatcher();
	let selectedItems: any[] = multiSelect ? [] : [];
	let selectAll = false;

	$: selectedCount = selectedItems.length;
	$: hasSelection = selectedCount > 0;

	function handleSelectAll() {
		selectAll = !selectAll;
		if (selectAll) {
			selectedItems = [...data];
		} else {
			selectedItems = [];
		}
		dispatch('select', { selected: selectedItems });
	}

	function handleSelect(item: any) {
		if (multiSelect) {
			if (selectedItems.includes(item)) {
				selectedItems = selectedItems.filter((i) => i !== item);
			} else {
				selectedItems = [...selectedItems, item];
			}
			selectAll = selectedItems.length === data.length;
		} else {
			selectedItems = selectedItems.includes(item) ? [] : [item];
		}
		dispatch('select', { selected: selectedItems });
	}

	function handleEdit(item: any) {
		dispatch('edit', { item });
	}

	function handleDelete(item: any) {
		dispatch('delete', { item });
	}

	function handleDeleteSelected() {
		dispatch('deleteSelected', { items: selectedItems });
		selectedItems = [];
		selectAll = false;
	}

	function formatValue(item: any, column: any) {
		const value = item[column.key];
		return column.formatter ? column.formatter(value) : value;
	}

	// Fonction pour extraire le numéro de niveau
	function getNiveauNumber(key: string): number | null {
		const match = key.match(/atr_(\d+)_label/);
		return match ? parseInt(match[1]) : null;
	}
</script>

<div class="relative overflow-x-auto">
	{#if hasSelection}
		<div
			class="mb-4 flex items-center justify-between rounded-lg border border-blue-200 bg-blue-50 p-4"
		>
			<div class="flex items-center space-x-2">
				<span class="text-sm font-medium text-blue-700"
					>{selectedCount} élément{selectedCount > 1 ? 's' : ''} sélectionné{selectedCount > 1
						? 's'
						: ''}</span
				>
			</div>
			<Button size="default" variant="rouge" onclick={handleDeleteSelected}>
				<Trash2 class="mr-2 h-4 w-4" />
				Supprimer les éléments sélectionnés
			</Button>
		</div>
	{/if}

	<!-- Affichage bureau reste inchangé -->
	<div class="hidden sm:block">
		<table class="w-full border-x border-black text-left text-sm">
			<thead class="bg-blue-700 text-xs text-white uppercase">
				<tr>
					{#if selectable}
						<th scope="col" class="w-14 border-x border-black px-4 py-3">
							{#if multiSelect}
								<button
									class="flex items-center"
									on:click={handleSelectAll}
									title={selectAll ? 'Désélectionner tout' : 'Sélectionner tout'}
								>
									{#if selectAll}
										<CheckSquare class="h-4 w-4" />
									{:else}
										<Square class="h-4 w-4" />
									{/if}
								</button>
							{:else}
								<span class="sr-only">Select</span>
							{/if}
						</th>
					{/if}
					{#each columns as column}
						<th scope="col" class="w-14 border-x border-black px-4 py-3 whitespace-nowrap">
							{column.header}
						</th>
					{/each}
					{#if actions}
						<th scope="col" class="w-14 border-x border-black px-4 py-3 text-right">
							<span class="sr-only">Actions</span>
						</th>
					{/if}
				</tr>
			</thead>
			<tbody>
				{#each data as item, i}
					<tr class="group border-b" class:bg-blue-100={selectedItems.includes(item)}>
						{#if selectable}
							<td class="w-14 px-4 py-3 {i % 2 === 0 ? 'bg-white' : 'bg-gray-100'}">
								<input
									type="checkbox"
									class="h-4 w-4 rounded text-blue-600"
									checked={selectedItems.includes(item)}
									on:change={() => handleSelect(item)}
									aria-label="Sélectionner cet élément"
								/>
							</td>
						{/if}
						{#each columns as column}
							<td
								class="w-14 border-x border-black px-4 py-3 {i % 2 === 0
									? 'bg-white'
									: 'bg-gray-100'}"
							>
								{formatValue(item, column)}
							</td>
						{/each}
						{#if actions}
							<td
								class="w-14 border-x border-black px-4 py-3 text-right {i % 2 === 0
									? 'bg-white'
									: 'bg-gray-100'}"
							>
								<div class="flex flex-col items-end space-y-2">
									<Button size="sm" variant="bleu" class="w-full" onclick={() => handleEdit(item)}>
										<SquarePen class="mr-2 h-4 w-4" />
										Modifier
									</Button>
									<Button
										size="sm"
										variant="rouge"
										class="w-full"
										onclick={() => handleDelete(item)}
									>
										<Trash2 class="mr-2 h-4 w-4" />
										Supprimer
									</Button>
								</div>
							</td>
						{/if}
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<!-- Affichage mobile sous forme de cartes -->
	<div class="sm:hidden">
		{#each data as item}
			<div class="mb-4 rounded-lg border border-gray-200 bg-white p-4">
				<div class="mb-2 flex justify-between">
					{#if selectable}
						<div class="flex items-center">
							<input
								type="checkbox"
								class="mr-3 h-4 w-4 rounded text-blue-600"
								checked={selectedItems.includes(item)}
								on:change={() => handleSelect(item)}
								aria-label="Sélectionner cet élément"
							/>
							<h2 class="font-bold">Niv 1 : {item.atr_0_label || ''}</h2>
						</div>
					{:else}
						<h2 class="font-bold">Niv 1 : {item.atr_0_label || ''}</h2>
					{/if}
					<div class="flex space-x-2">
						<button
							class="text-blue-600"
							on:click={() => handleEdit(item)}
							aria-label="Modifier cet élément"
						>
							<SquarePen class="h-4 w-4" />
						</button>
						<button
							class="text-red-600"
							on:click={() => handleDelete(item)}
							aria-label="Supprimer cet élément"
						>
							<Trash2 class="h-4 w-4" />
						</button>
					</div>
				</div>

				<!-- Affichage des données par niveau -->
				{#each columns as column, colIndex}
					{#if item[column.key] && column.key !== 'atr_0_label' && colIndex > 0}
						<div class="mb-2">
							<div class="font-medium">
								<span class="inline"
									>Niveau {getNiveauNumber(column.key) !== null
										? getNiveauNumber(column.key)! + 1
										: ''} :
								</span>
								<span class="inline break-words">{formatValue(item, column)}</span>
							</div>
						</div>
					{/if}
				{/each}

				{#if actions}
					<div class="mt-4 flex space-x-2">
						<Button size="sm" variant="bleu" class="w-1/2" onclick={() => handleEdit(item)}>
							<SquarePen class="mr-2 h-4 w-4" />
							Modifier
						</Button>
						<Button size="sm" variant="rouge" class="w-1/2" onclick={() => handleDelete(item)}>
							<Trash2 class="mr-2 h-4 w-4" />
							Supprimer
						</Button>
					</div>
				{/if}
			</div>
		{/each}
	</div>
</div>

<style>
	.break-words {
		overflow-wrap: break-word;
		word-wrap: break-word;
		hyphens: auto;
	}

	.group:hover :global(td) {
		background-color: #bfdbfe !important;
	}
</style>
