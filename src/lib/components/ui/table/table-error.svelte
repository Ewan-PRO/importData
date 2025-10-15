<script lang="ts">
	import type { WithElementRef } from '$lib/utils.js';
	import type { HTMLTableAttributes } from 'svelte/elements';
	import Root from './table.svelte';
	import Header from './table-header.svelte';
	import Row from './table-row.svelte';
	import Head from './table-head.svelte';
	import Body from './table-body.svelte';
	import Cell from './table-cell.svelte';
	import { AlertCircle, X } from 'lucide-svelte';

	let {
		ref = $bindable(null),
		class: className,
		headers = [],
		data = [],
		title = 'Lignes avec erreurs',
		children,
		...restProps
	}: WithElementRef<HTMLTableAttributes> & {
		headers?: Array<{ key: string; label: string; class?: string }>;
		data?: Array<Record<string, any>>;
		title?: string;
	} = $props();
</script>

<div class="mb-6">
	<div class="mb-4 flex items-center">
		<div class="flex items-center rounded-full border border-red-500 bg-red-100 px-3 py-1">
			<AlertCircle class="mr-2 h-5 w-5 text-red-600" />
			<h3 class="font-semibold text-red-800">{title}</h3>
			<span
				class="ml-2 flex h-6 w-6 items-center justify-center rounded-full border border-red-500 bg-red-200 text-sm font-bold text-red-800"
			>
				{data.length}
			</span>
		</div>
	</div>

	{#if headers.length > 0 && data.length > 0}
		<Root variant="error" bind:ref class={className} {...restProps}>
			<Header>
				<Row variant="error">
					<Head variant="error" class="w-12">
						<X class="h-4 w-4 text-white" />
					</Head>
					{#each headers as header}
						<Head variant="error" class={header.class}>
							{header.label}
						</Head>
					{/each}
				</Row>
			</Header>
			<Body>
				{#each data as row, rowIndex}
					<Row variant="error">
						<Cell variant="error" {rowIndex}>
							<X class="h-4 w-4 text-red-600" />
						</Cell>
						{#each headers as header}
							<Cell variant="error" {rowIndex}>
								{row[header.key] !== undefined && row[header.key] !== null ? row[header.key] : ''}
							</Cell>
						{/each}
					</Row>
				{/each}
			</Body>
		</Root>
	{:else}
		<Root variant="error" bind:ref class={className} {...restProps}>
			{@render children?.()}
		</Root>
	{/if}
</div>
