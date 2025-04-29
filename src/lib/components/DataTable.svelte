<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { Button } from 'flowbite-svelte';
	import { SquarePen, Trash2 } from 'lucide-svelte';

	export let data: any[] = [];
	export let columns: { key: string; header: string; formatter?: (value: any) => string }[] = [];
	export let selectable = false;
	export let multiSelect = false;
	export let actions = true;

	const dispatch = createEventDispatcher();
	let selectedItems: any[] | null = multiSelect ? [] : null;

	function handleSelect(item: any) {
		if (multiSelect) {
			const items = selectedItems as any[];
			if (items.includes(item)) {
				selectedItems = items.filter((i) => i !== item);
			} else {
				selectedItems = [...items, item];
			}
		} else {
			selectedItems = selectedItems === item ? null : item;
		}
		dispatch('select', { selected: selectedItems });
	}

	function handleEdit(item: any) {
		dispatch('edit', { item });
	}

	function handleDelete(item: any) {
		dispatch('delete', { item });
	}

	function formatValue(item: any, column: any) {
		const value = item[column.key];
		return column.formatter ? column.formatter(value) : value;
	}
</script>

<div class="relative overflow-x-auto shadow-md sm:rounded-lg">
	<table class="w-full text-left text-sm">
		<thead class="bg-blue-700 text-xs text-white uppercase">
			<tr>
				{#if selectable}
					<th scope="col" class="px-6 py-3">
						<span class="sr-only">Select</span>
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
					class:bg-blue-100={selectedItems === item ||
						(Array.isArray(selectedItems) && selectedItems.includes(item))}
				>
					{#if selectable}
						<td class="px-6 py-4">
							<input
								type="checkbox"
								class="h-4 w-4 rounded text-blue-600 focus:ring-blue-600"
								checked={selectedItems === item ||
									(Array.isArray(selectedItems) && selectedItems.includes(item))}
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
						<td class="space-x-2 px-6 py-4 text-right">
							<Button color="green" size="xs" on:click={() => handleEdit(item)}>
								<SquarePen class="mr-2 h-4 w-4" />
								Modifier
							</Button>
							<Button size="xs" color="red" on:click={() => handleDelete(item)}>
								<Trash2 class="mr-2 h-4 w-4" />
								Supprimer
							</Button>
						</td>
					{/if}
				</tr>
			{/each}
		</tbody>
	</table>
</div>
