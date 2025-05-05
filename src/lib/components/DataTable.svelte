<!-- src/lib/components/DataTable.svelte -->
<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { Button } from 'flowbite-svelte';
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
		console.log('=== Début handleDelete ===');
		console.log('Item à supprimer:', item);
		dispatch('delete', { item });
		console.log('=== Fin handleDelete ===');
	}

	function handleDeleteSelected() {
		console.log('=== Début handleDeleteSelected ===');
		console.log('Items à supprimer:', selectedItems);
		dispatch('deleteSelected', { items: selectedItems });
		console.log('=== Fin handleDeleteSelected ===');
		selectedItems = [];
		selectAll = false;
	}

	function formatValue(item: any, column: any) {
		const value = item[column.key];
		return column.formatter ? column.formatter(value) : value;
	}
</script>

<div class="relative overflow-x-auto shadow-md sm:rounded-lg">
	{#if hasSelection}
		<div class="mb-4 flex items-center justify-between rounded-lg bg-blue-50 p-4">
			<div class="flex items-center space-x-2">
				<span class="text-sm font-medium text-blue-700"
					>{selectedCount} élément{selectedCount > 1 ? 's' : ''} sélectionné{selectedCount > 1
						? 's'
						: ''}</span
				>
			</div>
			<Button size="xs" color="red" on:click={handleDeleteSelected}>
				<Trash2 class="mr-2 h-4 w-4" />
				Supprimer les éléments sélectionnés
			</Button>
		</div>
	{/if}

	<table class="w-full text-left text-sm">
		<thead class="bg-blue-700 text-xs text-white uppercase">
			<tr>
				{#if selectable}
					<th scope="col" class="px-6 py-3">
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
					<th scope="col" class="px-6 py-3">
						{column.header}
					</th>
				{/each}
				{#if actions}
					<th scope="col" class="px-6 py-3">
						<span class="sr-only">Actions</span>
					</th>
				{/if}
			</tr>
		</thead>
		<tbody>
			{#each data as item, i}
				<tr
					class="border-b bg-white hover:bg-gray-50 {i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}"
					class:bg-blue-100={selectedItems.includes(item)}
				>
					{#if selectable}
						<td class="px-6 py-4">
							<input
								type="checkbox"
								class="h-4 w-4 rounded text-blue-600 focus:ring-blue-600"
								checked={selectedItems.includes(item)}
								on:change={() => handleSelect(item)}
							/>
						</td>
					{/if}
					{#each columns as column}
						<td class="px-6 py-4">
							{formatValue(item, column)}
						</td>
					{/each}
					{#if actions}
						<td class="px-6 py-4 text-right">
							<div class="w-25=8 flex flex-col items-end space-y-2">
								<Button size="xs" color="blue" class="w-full" on:click={() => handleEdit(item)}>
									<SquarePen class="mr-2 h-4 w-4" />
									Modifier
								</Button>
								<Button size="xs" color="red" class="w-full" on:click={() => handleDelete(item)}>
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
