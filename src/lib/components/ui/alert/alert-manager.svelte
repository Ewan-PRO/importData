<!-- AlertManager.svelte - Composant d'alerte réutilisable -->
<script lang="ts" context="module">
	export type AlertType = 'success' | 'error' | 'info' | 'warning';
	export type AlertVariant = 'success' | 'destructive' | 'default' | 'info' | 'warning';
</script>

<script lang="ts">
	import * as Alert from './index.js';
	import { createEventDispatcher } from 'svelte';

	// Props
	export let visible: boolean = false;
	export let message: string = '';
	export let type: AlertType = 'info';
	export let title: string = '';
	export let dismissible: boolean = true;
	export let autoHide: boolean = true;
	export let autoHideDelay: number = 5000;
	export let className: string = '';

	// Event dispatcher
	const dispatch = createEventDispatcher<{
		dismiss: void;
		show: { message: string; type: AlertType };
	}>();

	// Variables internes
	let timeoutId: number | null = null;

	// Mapping des types vers les variantes
	const typeToVariant: Record<AlertType, AlertVariant> = {
		success: 'success',
		error: 'destructive',
		info: 'info',
		warning: 'warning'
	};

	// Mapping des types vers les titres par défaut
	const typeToTitle: Record<AlertType, string> = {
		success: 'Succès',
		error: 'Erreur',
		info: 'Information',
		warning: 'Attention'
	};

	// Fonction pour afficher l'alerte
	export function show(newMessage: string, newType: AlertType = 'info', newTitle?: string): void {
		message = newMessage;
		type = newType;
		title = newTitle || typeToTitle[newType];
		visible = true;

		// Programmer la fermeture automatique
		if (autoHide) {
			if (timeoutId) clearTimeout(timeoutId);
			timeoutId = setTimeout(hide, autoHideDelay) as unknown as number;
		}

		dispatch('show', { message: newMessage, type: newType });
	}

	// Fonction pour masquer l'alerte
	export function hide(): void {
		visible = false;
		if (timeoutId) clearTimeout(timeoutId);
		dispatch('dismiss');
	}

	// Réactivité pour la fermeture automatique
	$: if (visible && autoHide) {
		if (timeoutId) clearTimeout(timeoutId);
		timeoutId = setTimeout(hide, autoHideDelay) as unknown as number;
	}

	// Nettoyage
	$: if (!visible && timeoutId) {
		clearTimeout(timeoutId);
		timeoutId = null;
	}
</script>

{#if visible}
	<Alert.Root variant={typeToVariant[type]} class="relative mb-4 {className}">
		<Alert.Icon variant={typeToVariant[type]} />

		{#if title}
			<Alert.Title>{title}</Alert.Title>
		{/if}

		<Alert.Description>{message}</Alert.Description>

		{#if dismissible}
			<button
				type="button"
				class="absolute top-2 right-2 rounded-lg p-1 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
				on:click={hide}
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
		{/if}
	</Alert.Root>
{/if}
