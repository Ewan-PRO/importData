<script lang="ts">
	import { CircleCheck, CircleX, Info, TriangleAlert } from 'lucide-svelte';
	import type { AlertVariant } from './alert.svelte';

	let { variant = 'default' }: { variant?: AlertVariant } = $props();

	function getIcon(variant: AlertVariant) {
		switch (variant) {
			case 'success':
				return CircleCheck;
			case 'destructive':
				return CircleX;
			case 'info':
				return Info;
			case 'warning':
				return TriangleAlert;
			default:
				return Info;
		}
	}

	const IconComponent = $derived(getIcon(variant));
</script>

<IconComponent />
