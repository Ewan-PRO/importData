<script lang="ts">
	import { Select as SelectPrimitive } from 'bits-ui';
	import { ChevronDown } from 'lucide-svelte';
	import { cn, type WithoutChild } from '$lib/utils.js';

	type SelectSize = 'sm' | 'md' | 'lg';

	let {
		ref = $bindable(null),
		class: className,
		children,
		size = 'md',
		...restProps
	}: WithoutChild<SelectPrimitive.TriggerProps> & {
		size?: SelectSize;
	} = $props();

	const sizeClasses = {
		sm: 'h-8 px-2.5 py-1.5 text-xs',
		md: 'h-10 px-3 py-2 text-sm',
		lg: 'h-12 px-4 py-3 text-base'
	};
</script>

<SelectPrimitive.Trigger
	bind:ref
	data-slot="select-trigger"
	data-size={size}
	class={cn(
		"border-input selection:bg-primary dark:bg-input/30 selection:text-primary-foreground ring-offset-background placeholder:text-muted-foreground flex w-full items-center justify-between gap-2 rounded-md border bg-white shadow-xs outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
		sizeClasses[size],
		className
	)}
	{...restProps}
>
	{@render children?.()}
	<ChevronDown class="size-4 opacity-50" />
</SelectPrimitive.Trigger>
