<script lang="ts">
	import { Toaster as Sonner, type ToasterProps as SonnerProps } from 'svelte-sonner';

	let { ...restProps }: SonnerProps = $props();
</script>

<Sonner
	theme="light"
	position="top-center"
	duration={5000}
	closeButton={true}
	richColors={true}
	class="toaster group"
	{...restProps}
/>

<style>
	:global(.toaster .sonner-toast) {
		background: white !important;
		border: 1px solid #e5e7eb !important;
		border-radius: 8px !important;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
	}
</style>
