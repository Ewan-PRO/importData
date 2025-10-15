<script lang="ts">
	import type { WithElementRef } from '$lib/utils.js';
	import type { HTMLTableAttributes } from 'svelte/elements';
	import Root from './table.svelte';
	import Header from './table-header.svelte';
	import Row from './table-row.svelte';
	import Head from './table-head.svelte';
	import Body from './table-body.svelte';
	import Cell from './table-cell.svelte';

	let {
		ref = $bindable(null),
		class: className,
		headers = [],
		data = [],
		children,
		...restProps
	}: WithElementRef<HTMLTableAttributes> & {
		headers?: Array<{ key: string; label: string; class?: string }>;
		data?: Array<Record<string, any>>;
	} = $props();
</script>

{#if headers.length > 0 && data.length > 0}
	<Root variant="striped" bind:ref class={className} {...restProps}>
		<Header>
			<Row variant="striped">
				{#each headers as header (header.key)}
					<Head variant="striped" class={header.class}>
						{header.label}
					</Head>
				{/each}
			</Row>
		</Header>
		<Body>
			{#each data as row, rowIndex (rowIndex)}
				<Row variant="striped">
					{#each headers as header (header.key)}
						<Cell variant="striped" {rowIndex}>
							{row[header.key] || ''}
						</Cell>
					{/each}
				</Row>
			{/each}
		</Body>
	</Root>
{:else}
	<Root variant="striped" bind:ref class={className} {...restProps}>
		{@render children?.()}
	</Root>
{/if}
