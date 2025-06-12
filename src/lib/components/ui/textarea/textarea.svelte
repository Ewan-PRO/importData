<script lang="ts">
	import { cn, type WithElementRef, type WithoutChildren } from '$lib/utils.js';
	import type { HTMLTextareaAttributes } from 'svelte/elements';

	type TextareaSize = 'sm' | 'md' | 'lg';

	let {
		ref = $bindable(null),
		value = $bindable(),
		size = 'md',
		class: className,
		...restProps
	}: WithoutChildren<WithElementRef<HTMLTextareaAttributes>> & {
		size?: TextareaSize;
	} = $props();

	const sizeClasses = {
		sm: 'min-h-12 px-2.5 py-1.5 text-xs',
		md: 'min-h-16 px-3 py-2 text-base md:text-sm',
		lg: 'min-h-20 px-4 py-3 text-base'
	};
</script>

<textarea
	bind:this={ref}
	data-slot="textarea"
	class={cn(
		'border-input placeholder:text-muted-foreground aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content w-full rounded-md border bg-transparent shadow-xs outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50',
		sizeClasses[size],
		className
	)}
	bind:value
	{...restProps}
></textarea>
