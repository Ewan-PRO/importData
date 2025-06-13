<script lang="ts">
	import type { HTMLTableAttributes } from 'svelte/elements';
	import { cn, type WithElementRef } from '$lib/utils.js';

	let {
		ref = $bindable(null),
		class: className,
		variant = 'default',
		children,
		...restProps
	}: WithElementRef<HTMLTableAttributes> & {
		variant?: 'default' | 'striped' | 'success' | 'error';
	} = $props();
</script>

<div data-slot="table-container" class="relative w-full overflow-x-auto">
	<table
		bind:this={ref}
		data-slot="table"
		class={cn(
			variant === 'default'
				? 'w-full caption-bottom text-sm'
				: variant === 'striped'
					? 'w-full border border-black text-left text-sm'
					: variant === 'success'
						? 'w-full rounded-lg border border-black bg-green-50 text-left text-sm shadow-sm'
						: 'w-full rounded-lg border border-black bg-red-50 text-left text-sm shadow-sm',
			className
		)}
		{...restProps}
	>
		{@render children?.()}
	</table>
</div>
