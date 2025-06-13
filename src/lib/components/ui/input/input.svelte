<script lang="ts">
	import type { HTMLInputAttributes, HTMLInputTypeAttribute } from 'svelte/elements';
	import { cn, type WithElementRef } from '$lib/utils.js';

	type InputType = Exclude<HTMLInputTypeAttribute, 'file'>;

	type Props = WithElementRef<
		Omit<HTMLInputAttributes, 'type'> &
			({ type: 'file'; files?: FileList } | { type?: InputType; files?: undefined })
	>;

	let {
		ref = $bindable(null),
		value = $bindable(),
		type,
		files = $bindable(),
		class: className,
		...restProps
	}: Props = $props();
</script>

{#if type === 'file'}
	<input
		bind:this={ref}
		data-slot="input"
		class={cn(
			'selection:bg-primary dark:bg-input/30 selection:text-primary-foreground border-input ring-offset-background placeholder:text-muted-foreground flex h-10 w-full min-w-0 rounded-md border bg-transparent px-3 pt-1.5 text-sm font-medium shadow-xs transition-[color,box-shadow,background-color] outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
			'focus:border-blue-500 focus:ring-2 focus:ring-blue-500',
			'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
			// Styles pour les champs remplis (fichiers) - même couleur que webkit-autofill
			files && files.length > 0 ? 'bg-[rgb(232,240,254)]' : 'bg-transparent',
			className
		)}
		type="file"
		bind:files
		bind:value
		{...restProps}
	/>
{:else}
	<input
		bind:this={ref}
		data-slot="input"
		class={cn(
			'border-input bg-background selection:bg-primary dark:bg-input/30 selection:text-primary-foreground ring-offset-background placeholder:text-muted-foreground flex h-10 w-full min-w-0 rounded-md border px-3 py-1 text-base shadow-xs outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
			'focus:border-blue-500 focus:ring-2 focus:ring-blue-500',
			'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
			// Styles pour les champs remplis - même couleur que webkit-autofill
			'[-webkit-autofill]:!shadow-[inset_0_0_0px_1000px_rgb(232,240,254)]',
			'[-webkit-autofill:focus]:!shadow-[inset_0_0_0px_1000px_rgb(232,240,254)]',
			'[-webkit-autofill:hover]:!shadow-[inset_0_0_0px_1000px_rgb(232,240,254)]',
			// Style conditionnel pour les valeurs préremplies - même couleur
			value && value.toString().trim() !== '' ? 'bg-[rgb(232,240,254)]' : 'bg-background',
			className
		)}
		{type}
		bind:value
		{...restProps}
	/>
{/if}
