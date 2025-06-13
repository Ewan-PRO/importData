<script lang="ts">
	import { cn, type WithElementRef } from '$lib/utils.js';
	import type { HTMLTdAttributes } from 'svelte/elements';

	let {
		ref = $bindable(null),
		class: className,
		variant = 'default',
		rowIndex = 0,
		children,
		...restProps
	}: WithElementRef<HTMLTdAttributes> & {
		variant?: 'default' | 'striped' | 'success' | 'error';
		rowIndex?: number;
	} = $props();
</script>

<td
	bind:this={ref}
	data-slot="table-cell"
	class={cn(
		variant === 'default'
			? 'p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0'
			: variant === 'striped'
				? cn(
						'border-x border-black px-4 py-3 align-middle text-gray-900',
						rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-100'
					)
				: variant === 'success'
					? cn(
							'border-x border-black px-4 py-3 align-middle font-medium text-gray-900',
							rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-100'
						)
					: cn(
							'border-x border-black px-4 py-3 align-middle font-medium text-gray-900',
							rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-100'
						),
		className
	)}
	{...restProps}
>
	{@render children?.()}
</td>
