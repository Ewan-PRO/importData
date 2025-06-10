# Système d'Alertes

Ce dossier contient un système d'alertes complet et réutilisable pour votre application Svelte.

## Fichiers inclus

- `alert.svelte` - Composant de base (Root)
- `alert-title.svelte` - Composant pour le titre
- `alert-description.svelte` - Composant pour la description
- `alert-manager.svelte` - Composant d'alerte avec gestion automatique
- `alert-store.ts` - Store Svelte pour les alertes globales
- `global-alert.svelte` - Composant d'alerte globale
- `index.ts` - Exports principaux

## Utilisation

### 1. Alerte basique (composants modulaires)

```svelte
<script>
	import * as Alert from '$lib/components/ui/alert';
</script>

<Alert.Root variant="success">
	<Alert.Title>Succès</Alert.Title>
	<Alert.Description>Votre action a été effectuée avec succès.</Alert.Description>
</Alert.Root>
```

### 2. AlertManager (composant tout-en-un)

```svelte
<script>
	import { AlertManager } from '$lib/components/ui/alert';

	let alertRef;

	function showSuccess() {
		alertRef.show('Opération réussie !', 'success');
	}
</script>

<AlertManager bind:this={alertRef} />
<button on:click={showSuccess}>Afficher succès</button>
```

### 3. Alertes globales (avec store)

#### Dans votre layout principal (`+layout.svelte`)

```svelte
<script>
	import { GlobalAlert } from '$lib/components/ui/alert';
</script>

<main>
	<GlobalAlert />
	<slot />
</main>
```

#### Dans n'importe quelle page/composant

```svelte
<script>
	import { alertActions } from '$lib/components/ui/alert';

	function handleSuccess() {
		alertActions.success('Kit créé avec succès !');
	}

	function handleError() {
		alertActions.error('Erreur lors de la création');
	}

	function handleInfo() {
		alertActions.info('Information importante');
	}
</script>

<button on:click={handleSuccess}>Succès</button>
<button on:click={handleError}>Erreur</button>
<button on:click={handleInfo}>Info</button>
```

## Types d'alertes

- `success` - Alerte verte pour les succès
- `error` - Alerte rouge pour les erreurs
- `info` - Alerte neutre pour les informations

## Props du AlertManager

- `visible: boolean` - Contrôle la visibilité
- `message: string` - Message à afficher
- `type: 'success' | 'error' | 'info'` - Type d'alerte
- `title: string` - Titre (optionnel)
- `dismissible: boolean` - Bouton de fermeture (défaut: true)
- `autoHide: boolean` - Fermeture automatique (défaut: true)
- `autoHideDelay: number` - Délai en ms (défaut: 5000)
- `className: string` - Classes CSS supplémentaires

## Méthodes du AlertManager

- `show(message, type, title?)` - Afficher une alerte
- `hide()` - Masquer l'alerte

## Store Actions

- `alertActions.show(message, type, title?, options?)` - Afficher
- `alertActions.hide()` - Masquer
- `alertActions.success(message, title?)` - Raccourci succès
- `alertActions.error(message, title?)` - Raccourci erreur
- `alertActions.info(message, title?)` - Raccourci info

## Exemple complet

```svelte
<!-- Page avec alertes locales et globales -->
<script>
	import { AlertManager, alertActions } from '$lib/components/ui/alert';

	let localAlert;

	async function saveData() {
		try {
			// Simulation d'une sauvegarde
			await fetch('/api/save', { method: 'POST' });

			// Alerte locale
			localAlert.show('Données sauvegardées localement', 'success');

			// Alerte globale (visible partout)
			alertActions.success('Données synchronisées avec le serveur');
		} catch (error) {
			alertActions.error('Erreur lors de la sauvegarde');
		}
	}
</script>

<AlertManager bind:this={localAlert} />
<button on:click={saveData}>Sauvegarder</button>
```

## Migration depuis votre code actuel

Remplacez votre code actuel :

```svelte
<!-- Ancien code -->
{#if alertVisible}
	<Alert.Root variant={alertType === 'success' ? 'success' : 'destructive'}>
		<Alert.Title>{alertType === 'success' ? 'Succès' : 'Erreur'}</Alert.Title>
		<Alert.Description>{alertMessage}</Alert.Description>
		<!-- bouton de fermeture manuel -->
	</Alert.Root>
{/if}
```

Par :

```svelte
<script>
	// Remplacer showAlert par :
	function showAlert(message, type) {
		alertRef.show(message, type);
	}
</script>

<!-- Nouveau code -->
<AlertManager bind:this={alertRef} />
```
