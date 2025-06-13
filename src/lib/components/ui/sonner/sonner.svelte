<script lang="ts">
	import { Toaster } from 'svelte-sonner';
	import type { ToasterProps } from 'svelte-sonner';

	let { ...restProps }: ToasterProps = $props();
</script>

<Toaster
	theme="light"
	position="top-center"
	duration={5000}
	closeButton={true}
	richColors={true}
	class="toaster group rounded-lg border border-gray-200 bg-white shadow-lg"
	{...restProps}
/>
