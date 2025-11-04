<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn, type WithElementRef } from '$lib/utils.js';

	type Props = WithElementRef<HTMLAttributes<HTMLDivElement>> & {
		variant?: 'blanc' | 'gris';
	};

	let {
		ref = $bindable(null),
		variant = 'blanc',
		class: className,
		children,
		...restProps
	}: Props = $props();

	const variantClasses = {
		blanc: 'bg-white',
		gris: 'bg-gray-50'
	};
</script>

<div
	bind:this={ref}
	data-slot="card"
	class={cn(
		'text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm',
		variantClasses[variant],
		className
	)}
	{...restProps}
>
	{@render children?.()}
</div>
