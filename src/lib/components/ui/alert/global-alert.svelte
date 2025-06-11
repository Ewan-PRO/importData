<!-- GlobalAlert.svelte - Composant d'alerte globale utilisant le store -->
<script lang="ts">
	import { alertStore, alertActions } from './alert-store.js';
	import * as Alert from './index.js';

	// Mapping des types vers les variantes
	const typeToVariant = {
		success: 'success' as const,
		error: 'destructive' as const,
		info: 'info' as const,
		warning: 'warning' as const
	};

	// Timer pour la fermeture automatique
	let timeoutId: number | null = null;

	// Réactivité pour la fermeture automatique
	$: if ($alertStore.visible && $alertStore.autoHide) {
		if (timeoutId) clearTimeout(timeoutId);
		timeoutId = setTimeout(() => {
			alertActions.hide();
		}, $alertStore.autoHideDelay) as unknown as number;
	}

	// Nettoyage du timer
	$: if (!$alertStore.visible && timeoutId) {
		clearTimeout(timeoutId);
		timeoutId = null;
	}

	function handleDismiss() {
		alertActions.hide();
	}
</script>

{#if $alertStore.visible}
	<Alert.Root
		variant={typeToVariant[$alertStore.type]}
		class="relative mb-4 flex items-start gap-2"
	>
		<Alert.Icon variant={typeToVariant[$alertStore.type]} />
		<div class="flex-1">
			<span class="font-semibold">
				{$alertStore.title} :
			</span>
			<span class="ml-1">{$alertStore.message}</span>
		</div>
		<button
			type="button"
			class="absolute top-2 right-2 rounded-lg p-1 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
			on:click={handleDismiss}
			aria-label="Fermer l'alerte"
		>
			<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
				<path
					fill-rule="evenodd"
					d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
					clip-rule="evenodd"
				></path>
			</svg>
		</button>
	</Alert.Root>
{/if}
