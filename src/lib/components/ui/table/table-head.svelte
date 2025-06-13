<script lang="ts">
	import { cn, type WithElementRef } from '$lib/utils.js';
	import type { HTMLThAttributes } from 'svelte/elements';

	let {
		ref = $bindable(null),
		class: className,
		variant = 'default',
		children,
		...restProps
	}: WithElementRef<HTMLThAttributes> & {
		variant?: 'default' | 'striped' | 'success' | 'error';
	} = $props();
</script>

<th
	bind:this={ref}
	data-slot="table-head"
	class={cn(
		variant === 'default'
			? 'text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0'
			: variant === 'striped'
				? 'border-x border-black bg-[#dbeafe] px-4 py-3 text-left align-middle font-semibold whitespace-nowrap text-gray-900'
				: variant === 'success'
					? 'border-x border-black bg-green-500 px-4 py-3 text-left align-middle font-bold whitespace-nowrap text-white'
					: 'border-x border-black bg-red-500 px-4 py-3 text-left align-middle font-bold whitespace-nowrap text-white',
		className
	)}
	{...restProps}
>
	{@render children?.()}
</th>
