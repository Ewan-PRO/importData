# Système d'Alertes

Ce dossier contient un système d'alertes complet et centralisé pour votre application Svelte.

## 📁 Architecture des fichiers

### **Composants de base**

- **`alert.svelte`** - Composant racine (Root) avec les variantes de style
- **`alert-title.svelte`** - Composant pour afficher le titre d'une alerte
- **`alert-description.svelte`** - Composant pour afficher la description d'une alerte
- **`alert-icon.svelte`** - Composant pour afficher l'icône selon le type d'alerte

### **Composants avancés**

- **`alert-manager.svelte`** - Gestionnaire d'alertes avec contrôle local et méthodes
- **`global-alert.svelte`** - ⭐ **Composant principal** - Alerte globale connectée au store
- **`alert-store.ts`** - ⭐ **Store centralisé** - Gestion globale des alertes avec actions

### **Configuration**

- **`index.ts`** - Exports de tous les composants et fonctions
- **`README.md`** - Documentation (ce fichier)

## 🚀 Utilisation recommandée (Système centralisé)

### 1. **Dans votre layout principal** (`src/app.html` ou `+layout.svelte`)

```svelte
<script>
	import * as Alert from '$lib/components/ui/alert';
</script>

<main>
	<!-- Affiche les alertes globales partout dans l'app -->
	<Alert.GlobalAlert />
	<slot />
</main>
```

### 2. **Dans n'importe quelle page/composant**

```svelte
<script>
	import { alertActions } from '$lib/components/ui/alert';

	async function saveData() {
		try {
			await fetch('/api/save', { method: 'POST' });
			alertActions.success('Données sauvegardées avec succès !');
		} catch (error) {
			alertActions.error('Erreur lors de la sauvegarde');
		}
	}

	function showInfo() {
		alertActions.info('Vos données sont synchronisées');
	}

	function showWarning() {
		alertActions.warning('Vérifiez vos données avant de continuer');
	}
</script>

<button on:click={saveData}>Sauvegarder</button>
<button on:click={showInfo}>Info</button>
<button on:click={showWarning}>Attention</button>
```

## 🎯 Types d'alertes disponibles

| Type            | Méthode                  | Couleur | Utilisation          |
| --------------- | ------------------------ | ------- | -------------------- |
| **Succès**      | `alertActions.success()` | Vert    | Opérations réussies  |
| **Erreur**      | `alertActions.error()`   | Rouge   | Erreurs et échecs    |
| **Information** | `alertActions.info()`    | Bleu    | Messages informatifs |
| **Attention**   | `alertActions.warning()` | Jaune   | Avertissements       |

## 📋 API du store (`alertActions`)

### **Méthodes principales**

```typescript
// Affichage direct par type
alertActions.success('Message de succès');
alertActions.error("Message d'erreur");
alertActions.info("Message d'information");
alertActions.warning("Message d'avertissement");

// Méthode générique avec options
alertActions.show('Message personnalisé', 'success', 'Titre personnalisé', {
	autoHide: false,
	autoHideDelay: 10000
});

// Masquer l'alerte actuelle
alertActions.hide();
```

### **Options avancées**

```typescript
interface AlertOptions {
	autoHide?: boolean; // Fermeture automatique (défaut: true)
	autoHideDelay?: number; // Délai en ms (défaut: 5000)
}
```

## 🔧 Utilisation avancée (Composants modulaires)

### **Alerte personnalisée avec composants de base**

```svelte
<script>
	import * as Alert from '$lib/components/ui/alert';
</script>

<Alert.Root variant="success" class="my-custom-class">
	<Alert.Icon variant="success" />
	<div>
		<Alert.Title>Opération terminée</Alert.Title>
		<Alert.Description>Vos données ont été sauvegardées avec succès.</Alert.Description>
	</div>
</Alert.Root>
```

### **Gestionnaire local avec AlertManager**

```svelte
<script>
	import { Alert } from '$lib/components/ui/alert';

	let localAlert;

	function showLocalAlert() {
		localAlert.show('Alerte locale uniquement', 'info');
	}
</script>

<Alert.Manager bind:this={localAlert} autoHideDelay={8000} className="custom-alert-style" />

<button on:click={showLocalAlert}>Alerte locale</button>
```

## 🎨 Format d'affichage

Les alertes s'affichent sur une ligne avec le format :

```
[Icône] Titre : Message
```

Exemples :

- ✅ **Succès : Opération réussie avec succès !**
- ❌ **Erreur : Une erreur est survenue**
- ℹ️ **Information : Données mises à jour**
- ⚠️ **Attention : Vérifiez vos données**

## 🔄 Migration depuis un système manuel

### **Avant (code manuel)**

```svelte
<script>
	let alertVisible = false;
	let alertMessage = '';
	let alertType = 'success';

	function showAlert(message, type) {
		alertMessage = message;
		alertType = type;
		alertVisible = true;
		setTimeout(() => (alertVisible = false), 5000);
	}
</script>

{#if alertVisible}
	<Alert.Root variant={alertType}>
		<Alert.Title>{alertType === 'success' ? 'Succès' : 'Erreur'}</Alert.Title>
		<Alert.Description>{alertMessage}</Alert.Description>
	</Alert.Root>
{/if}
```

### **Après (système centralisé)**

```svelte
<script>
	import { alertActions } from '$lib/components/ui/alert';

	// Remplacer showAlert(message, type) par :
	// alertActions.success(message)
	// alertActions.error(message)
	// etc.
</script>

<!-- Plus besoin de code HTML, GlobalAlert gère tout -->
```

## ⚡ Avantages du système centralisé

- **Code plus propre** : Suppression de la logique manuelle
- **Cohérence** : Même style partout dans l'application
- **Centralisation** : Une seule source de vérité
- **Maintenance** : Plus facile à maintenir et déboguer
- **Performance** : Pas de duplication de composants
- **Flexibilité** : Personnalisation facile via le store

## 🛠️ Personnalisation

### **Modifier les titres par défaut**

Éditez `alert-store.ts` :

```typescript
function getDefaultTitle(type: AlertType): string {
	const titles: Record<AlertType, string> = {
		success: 'Réussi', // Au lieu de 'Succès'
		error: 'Problème', // Au lieu de 'Erreur'
		info: 'Info', // Au lieu de 'Information'
		warning: 'Alerte' // Au lieu de 'Attention'
	};
	return titles[type];
}
```

### **Modifier l'apparence**

Éditez `global-alert.svelte` pour changer les classes CSS ou la structure HTML.

### **Modifier la durée par défaut**

Dans `alert-store.ts`, changez `autoHideDelay: 5000` vers la valeur souhaitée.
