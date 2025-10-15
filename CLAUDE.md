# CLAUDE.md

Ce fichier fournit des instructions à Claude Code (claude.ai/code) pour travailler sur ce dépôt.

## Commandes de Développement

**Gestionnaire de paquets :** Ce projet utilise pnpm par défaut. Utiliser `pnpm` au lieu de `npm` :

**Serveur de développement :**

```bash
pnpm dev
```

**Build et aperçu :**

```bash
pnpm build
pnpm preview
```

**Qualité du code :**

```bash
pnpm lint      # Vérification Prettier + ESLint
pnpm format    # Formatage avec Prettier
pnpm check     # Type checking avec Svelte
```

**Vérification qualité complète :**

```bash
/quality-check  # Commande slash : Lint + Format + Check en une seule fois
```

La commande `/quality-check` exécute les 3 vérifications (`lint`, `format`, `check`) et génère un rapport structuré des erreurs.

**Tests :**

```bash
pnpm test:unit    # Exécuter les tests Vitest
pnpm test         # Exécuter les tests une fois
```

**Opérations base de données :**

**Base CENOV (Principale - Production) :**

```bash
pnpm prisma:generate                        # Générer client Prisma (cenov)
pnpm prisma:migrate                        # Exécuter migrations base de données (cenov)
pnpm prisma:studio                         # Ouvrir Prisma Studio (cenov)
pnpm prisma:push                          # Pousser schéma vers base de données (cenov)
pnpm prisma:pull                          # Récupérer schéma depuis base de données (cenov)
```

**Base CENOV_DEV (Développement) :**

```bash
pnpm prisma:generate-dev                   # Générer client Prisma (cenov_dev)
pnpm prisma:migrate-dev                    # Exécuter migrations (cenov_dev)
pnpm prisma:studio-dev                     # Ouvrir Prisma Studio (cenov_dev)
pnpm prisma:push-dev                       # Pousser schéma vers BDD (cenov_dev)
pnpm prisma:pull-dev                       # Récupérer schéma depuis BDD (cenov_dev)
```

**Générer les deux clients :**

```bash
pnpm prisma:generate-all                   # Générer les deux clients (automatique au pnpm install)
```

**Commandes manuelles (si nécessaire) :**

```bash
# CENOV:
npx prisma generate --schema prisma/cenov/schema.prisma
npx prisma db push --schema prisma/cenov/schema.prisma
npx prisma db pull --schema prisma/cenov/schema.prisma
npx prisma studio --schema prisma/cenov/schema.prisma
npx prisma migrate dev --schema prisma/cenov/schema.prisma
npx prisma migrate deploy --schema prisma/cenov/schema.prisma

# CENOV_DEV:
npx prisma generate --schema prisma/cenov_dev/schema.prisma
npx prisma db push --schema prisma/cenov_dev/schema.prisma
npx prisma db pull --schema prisma/cenov_dev/schema.prisma
npx prisma studio --schema prisma/cenov_dev/schema.prisma
npx prisma migrate dev --schema prisma/cenov_dev/schema.prisma
npx prisma migrate deploy --schema prisma/cenov_dev/schema.prisma
```

**Installation des dépendances :**

```bash
pnpm install              # Installer toutes les dépendances
pnpm add <package>        # Ajouter une dépendance
pnpm add -D <package>     # Ajouter une dépendance de dev
```

**Scripts BDD-IA (Export base de données) :**

```bash
node scripts/BDD-IA/fetch-all-tables.mjs    # Exporter toutes les tables
node scripts/BDD-IA/fetch-all-views.mjs     # Exporter toutes les vues
node scripts/BDD-IA/fetch-cenov-data.mjs    # Tout exporter (recommandé)
```

_Exporte toutes les données Cenov en lecture seule vers des fichiers JSON dans `scripts/BDD-IA/output/`_

**Scripts DMMF (Métadonnées Prisma) :**

```bash
node scripts/Script\ DMMF/extract-dmmf-metadata.mjs    # Extraire métadonnées DMMF
```

_Extrait les métadonnées Prisma DMMF (Data Model Meta Format) de CENOV_DEV vers `scripts/Script DMMF/output/` - 8 fichiers optimisés pour différents usages_

**Fichiers DMMF générés :**

1. **quick-stats.json** (~60 lignes) - Aperçu rapide structure DB
2. **models-index.json** (~150 lignes) - Navigation modèles avec dépendances
3. **relations-graph.json** (~200 lignes) - Graphe complet relations FK
4. **import-order.json** (~120 lignes) - Ordre d'import optimal (tri topologique)
5. **validation-rules.json** (~400 lignes) - Règles validation par champ
6. **native-types.json** (~80 lignes) - Mapping Prisma ↔ PostgreSQL
7. **summary-dmmf.json** (~100 lignes) - Statistiques essentielles
8. **full-dmmf.json** (~13 580 lignes) - DMMF complet brut (référence technique)

**📖 Documentation complète :** Voir `scripts/Script DMMF/output/README.md` pour guide d'utilisation détaillé, cas d'usage et exemples

## Vue d'Ensemble de l'Architecture

### Stack Technique

- **Frontend:** SvelteKit avec TypeScript
- **Version Svelte:** **Svelte 5** (utiliser en priorité : `$state`, `$derived`, `$effect`, `$props`)
- **Base de données:** PostgreSQL avec Prisma ORM
- **Styles:** TailwindCSS avec composants Flowbite et Shadcn Svelte
- **Authentification:** Intégration Logto
- **Traitement fichiers:** Capacités d'import XLSX
- **Tests:** Vitest avec Testing Library

### Architecture Base de Données

**Architecture Double Base :**

L'application utilise **DEUX bases de données séparées** :

1. **Base CENOV** (`DATABASE_URL`) - Base principale de production
   - Système principal de gestion des produits, kits et pièces
   - **12 tables** (568 lignes totales) : 7 schéma `produit` (368 lignes) + 5 schéma `public` (200 lignes)
   - **Schéma produit** : categorie, categorie_attribut, cross_ref, famille, produit, produit_categorie, tarif_achat
   - **Schéma public** : attribut, fournisseur, kit, kit_attribute, part_nc
   - **6 vues** (1685 lignes totales) : 3 schéma `produit` (916 lignes) + 3 schéma `public` (769 lignes)
   - **Vues produit** : v_produit_categorie_attribut, v_tarif_achat, mv_categorie
   - **Vues public** : v_categorie, v_kit_caracteristique, v_produit_categorie_attribut

2. **Base CENOV_DEV** (`CENOV_DEV_DATABASE_URL`) - Base développement étendue
   - Catalogue produits étendu et gestion fournisseurs avancée
   - **15 tables** (572 lignes totales) : 7 schéma `produit` (371 lignes) + 8 schéma `public` (201 lignes)
   - **Schéma produit** : category, category_attribute, cross_ref, family, price_purchase, product, product_category
   - **Schéma public** : attribute, attribute_value, document, document_link, kit, kit_attribute, part_nc, supplier
   - **8 vues** (1791 lignes totales) : 4 schéma `produit` (1015 lignes) + 4 schéma `public` (776 lignes)
   - **Vues produit** : import_name, v_produit_categorie_attribut, v_tarif_achat, mv_categorie
   - **Vues public** : attribute_required, v_categorie, v_kit_caracteristique, v_produit_categorie_attribut

**Export base de données:** Données complètes exportées en JSON dans `scripts/BDD-IA/output/` pour analyse IA :

- **CENOV** : 12 tables (568 lignes), 6 vues (1685 lignes)
- **CENOV_DEV** : 15 tables (572 lignes), 8 vues (1791 lignes)

## Principe Anti-Hardcoding avec Prisma DMMF

**RÈGLE :** Toujours vérifier si un hardcoding peut être remplacé par des métadonnées Prisma DMMF.

```typescript
// ❌ MAUVAIS - Hardcoding de données DB
const databases = ['cenov', 'cenov_dev'];
if (dbName !== 'cenov' && dbName !== 'cenov_dev') throw new Error('BDD inconnue');
if (database === 'cenov') return 1;

// ✅ BON - Utiliser Prisma DMMF
const databases = await getAllDatabaseNames();
if (!validDatabases.includes(dbName)) throw new Error(`BDD inconnue`);
return a.database.localeCompare(b.database);

// ✅ OK - Config UI acceptable
export const DATABASE_CONFIG = { cenov: { icon: RocketIcon, variant: 'bleu' } };
const schema = metadata.schema || 'public'; // Standard SQL
```

**Fonctions DMMF :** `getAllDatabaseNames()`, `getTableMetadata()`, `getAllDatabaseTables()`

**Règle :** Données DB → Prisma DMMF | UI/Config → Fichier centralisé

### Utilisation Client Prisma

**Importer le bon client :**

```typescript
// Pour la base CENOV (principale):
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Pour la base CENOV_DEV:
import { PrismaClient as CenovDevPrismaClient } from '../../prisma/cenov_dev/generated';
const cenovDevPrisma = new CenovDevPrismaClient();

// Exemples d'utilisation:
const kits = await prisma.kit.findMany(); // Base CENOV
const products = await cenovDevPrisma.produit.findMany(); // Base CENOV_DEV
```

**Gestion des Connexions :**

- CENOV: Client Prisma standard pour opérations principales
- CENOV_DEV: Client séparé pour fonctionnalités catalogue produits
- Les deux bases peuvent être utilisées simultanément

### Structure des Fichiers Clés

- `src/routes/` - Pages SvelteKit (categories, kits, import, products)
- `src/lib/components/` - Composants Svelte réutilisables incluant bibliothèque UI
- `src/lib/schemas/dbSchema.ts` - Schémas de validation Zod pour toutes les entités
- `src/lib/prisma-meta.ts` - Utilitaires centralisés métadonnées Prisma
- `prisma/cenov/schema.prisma` - Schéma base de données principal

### Utilitaires Prisma Meta

**`src/lib/prisma-meta.ts`** fournit des fonctions centralisées de métadonnées via Prisma DMMF (Data Model Meta Format) :

**Fonctions Principales :**

- `getDatabases()` - Accès aux clients et métadonnées des deux bases
- `getTableMetadata(database, tableName)` - Détection schéma via DMMF
- `getAllTables(database)` - Tables avec détection automatique du schéma
- `getAllDatabaseTables()` - Tables combinées des deux bases

**Bonnes Pratiques :**

- **Éviter le hardcoding** - Utiliser métadonnées Prisma DMMF au lieu de valeurs hardcodées
- Détection schéma: Utiliser `metadata.schema` depuis `getTableMetadata()`
- Listes de tables: Utiliser `getAllTables()` au lieu de noms hardcodés
- Infos base: Utiliser propriétés DMMF au lieu de comparaisons de chaînes
- Détection dynamique préférée aux listes statiques pour la maintenabilité

### Workflow Prisma

**Workflow Double Schéma :**

**Pour la base CENOV (principale) :**

1. Éditer `prisma/cenov/schema.prisma`
2. Exécuter: `npx prisma generate --schema prisma/cenov/schema.prisma`
3. Exécuter: `npx prisma db push --schema prisma/cenov/schema.prisma` (ou migrate)

**Pour la base CENOV_DEV :**

1. Éditer `prisma/cenov_dev/schema.prisma`
2. Exécuter: `npx prisma generate --schema prisma/cenov_dev/schema.prisma`
3. Exécuter: `npx prisma db push --schema prisma/cenov_dev/schema.prisma` (ou migrate)

**⚠️ Problèmes Courants & Solutions :**

- **Erreur "Model already exists":** Toujours spécifier le flag `--schema` pour éviter les conflits
- **Conflits de génération:** Ne jamais exécuter `prisma generate` sans flag `--schema`
- **Mauvais client importé:** Vérifier les chemins d'import - utiliser les clients générés depuis les bons répertoires

**Corrections rapides :**

```bash
# Nettoyer et régénérer les deux clients:
rm -rf prisma/generated/ node_modules/.prisma/
npx prisma generate --schema prisma/cenov/schema.prisma
npx prisma generate --schema prisma/cenov_dev/schema.prisma
```

### Authentification

Utilise Logto pour l'authentification avec :

- Routes protégées via `src/lib/auth/protect.ts`
- Gestion session utilisateur dans les layouts
- Gestion callback pour flux OAuth

### Système d'Import

Fonctionnalité d'import de fichiers Excel pour :

- Catégories et attributs
- Hiérarchies de kits et caractéristiques
- Localisé dans les routes `/import` et `/products/import`

### Tests

Les tests d'intégration couvrent :

- Opérations CRUD pour catégories et kits
- Fonctionnalité d'import
- Localisés dans `tests/integration/`

## Notes de Développement

- Utilise pnpm comme gestionnaire de paquets
- Support des schémas de production et développement (tables/vues \_dev)
- Composants UI personnalisés construits sur bits-ui et Flowbite
- Validation de formulaires avec schémas Zod et SvelteKit Superforms

## Bonnes Pratiques TypeScript

**Éviter le type `any`** - Préférer des types spécifiques pour éviter les erreurs @typescript-eslint/no-explicit-any :

```typescript
// ❌ MAUVAIS - Utiliser any
const data: any[] = [];
const previewData: Record<string, any[]> = {};

// ✅ BON - Utiliser des types spécifiques
const data: Record<string, unknown>[] = [];
const previewData: Record<string, unknown[]> = {};

// ✅ BON - Utiliser des définitions d'interface
interface TableData {
	id: number;
	name: string;
	[key: string]: unknown; // Pour propriétés dynamiques
}
const data: TableData[] = [];
```

**Remplacements TypeScript courants :**

- `any[]` → `unknown[]` ou `Record<string, unknown>[]`
- `any` → `unknown` ou interface spécifique
- `Record<string, any>` → `Record<string, unknown>`
- Pour résultats Prisma: utiliser types générés ou `Record<string, unknown>`

**Quand utiliser `unknown` :**

- Réponses API externes
- Données dynamiques depuis bases de données
- Entrées utilisateur nécessitant validation
- Structures de données génériques

## Guide Composants UI

**Variantes de boutons disponibles :**

- `bleu` (défaut) - Bouton bleu principal
- `vert` - Actions succès/confirmation
- `rouge` - Actions danger/suppression
- `jaune` - Actions avertissement
- `noir` - Actions secondaires sombres
- `blanc` - Style alternatif/outline
- `link` - Style lien texte

**Note:** La variante `outline` n'existe pas - utiliser `blanc` pour les boutons style outline.

**Variantes de badges disponibles :**

- `default` (défaut) - Style badge principal
- `bleu` - Badge informatif bleu
- `vert` - Badge succès/positif
- `rouge` - Badge erreur/danger
- `noir` - Badge secondaire/neutre
- `blanc` - Style alternatif/outline
- `orange` - Badge modification

**Note:** La variante `outline` n'existe pas pour les badges - utiliser `blanc` pour style outline.

### Intégration Icônes Badge

**IMPORTANT:** Le composant Badge gère automatiquement les icônes SVG avec style intégré :

```typescript
// ✅ CORRECT - Laisser le composant gérer taille et espacement
<Badge variant="vert">
  <Eye />
  Vues
</Badge>

// ❌ MAUVAIS - Ne pas ajouter manuellement classes taille/espacement
<Badge variant="vert">
  <Eye class="mr-1 h-3 w-3" />
  Vues
</Badge>
```

**Style Icône Badge Intégré :**

- `[&>svg]:size-3` - Toutes icônes SVG obtiennent automatiquement `size-3` (12x12px)
- `[&>svg]:pointer-events-none` - Icônes n'interfèrent pas avec événements clic
- `gap-1` - Espacement automatique entre icône et texte
- `items-center justify-center` - Alignement parfait

**Bonne Pratique :** Toujours lire les classes CSS du composant avant d'ajouter style manuel. La plupart des composants UI gèrent les icônes nativement.

## Bonnes Pratiques Svelte - Clés dans les Boucles {#each}

### Problème : Erreur `svelte/require-each-key`

**⚠️ Symptôme :** ESLint signale "Each block should have a key" - cause bugs d'affichage et problèmes de performance.

**✅ Solution :** Toujours ajouter une clé unique

```svelte
<!-- ✅ CORRECT -->
{#each items as item (item.id)}           <!-- ID unique (meilleur) -->
{#each columns as column (column.key)}    <!-- Propriété unique -->
{#each databases as db (db)}              <!-- Valeur primitive unique -->
{#each rows as row, i (i)}                <!-- Index (dernier recours) -->

<!-- ❌ MAUVAIS -->
{#each items as item}                     <!-- Sans clé -->
```

**Priorité de choix :** ID unique > Propriété unique > Valeur primitive > Index

**Éviter ce problème à l'avenir :**
- Toujours ajouter la clé dès la création de la boucle : `{#each items as item (item.id)}`
- Vérifier avec `/quality-check` avant de commit
- Si hésitation, utiliser l'index : `{#each items as item, i (i)}`

**Correction en masse :**
```bash
# Corriger ligne spécifique avec sed
sed -i '113s/{#each columns as column}/{#each columns as column (column.key)}/' src/file.svelte
```

## Notifications Toast (Sonner)

Ce projet utilise **svelte-sonner** pour les notifications toast.

### Prérequis

1. **Installation :** Déjà installé comme dépendance
2. **Composant Toaster :** Doit être placé dans layout racine (`+layout.svelte`)
3. **Import :** Toujours importer directement depuis `'svelte-sonner'`

### Utilisation Correcte

```typescript
// ✅ CORRECT Import
import { toast } from 'svelte-sonner';

// ✅ CORRECT Configuration Toaster (déjà dans +layout.svelte)
import { Toaster } from 'svelte-sonner';
<Toaster position="top-center" richColors={true} />

// ✅ CORRECT Utilisation
toast.error('Message erreur');
toast.success('Message succès');
toast('Message info');
```

### Erreurs Courantes à Éviter

```typescript
// ❌ MAUVAIS - Ne pas importer depuis composants UI
import { toast } from '$lib/components/ui/sonner';

// ❌ MAUVAIS - Ne pas utiliser wrapper personnalisé pour toasts basiques
import { Toaster } from '$lib/components/ui/sonner/sonner.svelte';
```

### Bonnes Pratiques Timing

- **Toasts au chargement page :** Utiliser `setTimeout` avec petit délai (100ms) dans `onMount`
- **Gestionnaires événements :** Appeler directement sans délai
- **Après navigation :** Fonctionne immédiatement après redirections

### Intégration Authentification

Le projet a des toasts d'erreur auth intégrés :

- Routes protégées affichent automatiquement toast si accès non autorisé
- Géré via paramètres URL et `onMount` dans homepage

## Résolution Conflits Édition Fichiers

**Lors d'erreurs "File has been unexpectedly modified" :**

Cela se produit typiquement quand fichiers sont automatiquement formatés par linters/formatters (Prettier, ESLint) après lecture.

**Étapes de résolution :**

1. **Utiliser chemins Windows absolus D'ABORD :** Toujours utiliser chemins Windows absolus avec lettres de lecteur et backslashes pour TOUTES opérations fichiers :

   ```bash
   # ✅ CORRECT - Utiliser chemins Windows absolus
   C:\Users\EwanSenergous\OneDrive - jll.spear\Bureau\Projet\importData\file.js

   # ❌ MAUVAIS - Chemins relatifs ou style Unix peuvent échouer
   ./file.js
   /c/Users/.../file.js
   ```

2. **Formater avec Prettier (si conflits persistent) :** Les erreurs viennent souvent du formatage automatique Prettier/TypeScript. Relancer le formatage :

   ```bash
   pnpm format
   ```

3. **Relire avant édition :** Toujours utiliser outil Read pour obtenir dernier état fichier après formatage

4. **Comportement attendu :** Les linters peuvent formater automatiquement, c'est intentionnel et doit être préservé

5. **Git restore (dernière option seulement) :** Si tous les autres essais échouent, restaurer le fichier à son état original :

   ```bash
   git restore src/path/to/file.svelte
   ```

**Scénarios courants :**

- Prettier reformate espacement et sauts de ligne
- ESLint corrige automatiquement problèmes de style
- Ces changements sont intentionnels et améliorent qualité du code

**Bonnes pratiques :**

- **TOUJOURS essayer chemins Windows absolus d'abord** avant toute autre solution
- **Utiliser `pnpm format` ensuite** pour synchroniser le formatage
- Ne pas annuler changements linter sauf demande explicite
- **Git restore est la DERNIÈRE option** - à utiliser seulement si tout le reste échoue
- Relire fichiers après formatage pour obtenir état actuel

**Appliquer chemins Windows absolus à tous les outils :**

- Outil Read: Toujours utiliser chemins `C:\...`
- Outil Write: Toujours utiliser chemins `C:\...`
- Outil Edit: Toujours utiliser chemins `C:\...`
- Outil MultiEdit: Toujours utiliser chemins `C:\...`

## Debugging Problèmes de Réactivité Svelte

Cette section documente les techniques pour diagnostiquer et résoudre les problèmes de réactivité dans Svelte, particulièrement lors de la migration vers Svelte 5.

### Problème : Console.log Accidentellement Réactifs

**⚠️ Symptôme courant :** Une fonctionnalité cesse de marcher après suppression de `console.log` "innocents".

**🔍 Diagnostic :**

```typescript
// ❌ PROBLÉMATIQUE - console.log maintient accidentellement la réactivité
$: if (condition) {
	someVariable = newValue;
	console.log('Debug:', someVariable); // ← Force l'évaluation réactive !
}

// ❌ Quand ce log est supprimé, la réactivité peut se casser
$: if (condition) {
	someVariable = newValue;
	// La variable peut ne plus être "observée" par Svelte
}
```

**🎯 Techniques de Diagnostic :**

1. **Identifier les logs suspects :**

   ```bash
   # Chercher tous les console.log dans les déclarations réactives
   grep -n "console\.(log\|warn\|error)" src/routes/export/*.svelte
   ```

2. **Vérifier les logs dans les déclarations réactives :**
   - `$: { ... console.log(...) ... }` ← Suspect
   - `$: console.log(...)` ← Très suspect
   - Dans les `$effect(() => { console.log(...) })` ← OK (informatif)

3. **Tester la théorie :**
   - Supprimer temporairement un `console.log` suspect
   - Tester si la fonctionnalité se casse
   - Si oui → le log maintenait la réactivité

### Solution : Migration Svelte 5 Propre

**✅ Remplacer les hacks réactifs par des primitives explicites :**

```typescript
// ❌ ANCIEN - Hack avec console.log
$: if (step === 3 && data.length > 0 && !config) {
	config = { ...formData };
	console.log('Config sauvée:', config); // ← Maintient la réactivité
}

// ✅ NOUVEAU - Svelte 5 propre
let config = $state(null);

let shouldSaveConfig = $derived(step === 3 && data.length > 0 && !config);

$effect(() => {
	if (shouldSaveConfig) {
		config = { ...formData };
		console.log('Config sauvée:', config); // ← Informatif seulement
	}
});
```

### Patterns de Migration Svelte 5

**1. Variables d'État :**

```typescript
// ❌ Ancien
let state = initialValue;

// ✅ Nouveau
let state = $state(initialValue);
```

**2. Props :**

```typescript
// ❌ Ancien
export let data;

// ✅ Nouveau
let { data } = $props();
```

**3. Déclarations Réactives :**

```typescript
// ❌ Ancien
$: filteredData = data.filter((item) => item.active);

// ✅ Nouveau
let filteredData = $derived(data.filter((item) => item.active));
```

**4. Effets de Bord :**

```typescript
// ❌ Ancien
$: {
	if (condition) {
		performSideEffect();
		console.log('Side effect triggered'); // ← Maintient réactivité
	}
}

// ✅ Nouveau - Effet explicite
$effect(() => {
	if (condition) {
		performSideEffect();
		console.log('Side effect triggered'); // ← Informatif seulement
	}
});
```

**5. Composants Dynamiques :**

```typescript
// ❌ Ancien - Svelte 4
<svelte:component this={getComponent(type)} />

// ✅ Nouveau - Svelte 5
{@const Component = getComponent(type)}
<Component />

// Ou dans les boucles :
{#each items as item}
    {@const ItemComponent = getComponent(item.type)}
    <ItemComponent />
{/each}
```

### Workflow de Diagnostic Complet

**Étape 1 : Identifier le Problème**

```bash
# Chercher les patterns suspects
grep -rn "console\.log.*\$" src/routes/
grep -rn "\$:.*console" src/routes/
```

**Étape 2 : Tester l'Hypothèse**

- Commenter temporairement les `console.log` suspects
- Vérifier si la fonctionnalité se casse
- Si oui → confirmer le problème de réactivité accidentelle

**Étape 3 : Analyser la Réactivité**

```typescript
// Ajouter des logs de debug pour comprendre le flux
$effect(() => {
	console.log('🔄 Reactive state changed:', stateVariable);
});

$effect(() => {
	console.log('📊 Derived value updated:', derivedValue);
});
```

**Étape 4 : Migrer vers Svelte 5**

- Remplacer `export let` → `$props()`
- Remplacer `let` variables modifiées → `$state()`
- Remplacer `$:` → `$derived` ou `$effect`
- Remplacer `<svelte:component>` → `{@const Component}`

**Étape 5 : Vérifier la Propreté**

```bash
# Vérifier qu'aucun console.log ne déclenche plus la réactivité
grep -n "console\.log" src/routes/export/*.svelte

# Les logs restants doivent être soit :
# - Dans des $effect (OK - informatif)
# - Dans des fonctions (OK - informatif)
# - Dans des handlers d'événements (OK - informatif)
# - PAS dans des déclarations réactives directes
```

### Indicateurs de Réactivité Propre

**✅ Signes que la réactivité est correcte :**

1. **Séparation claire :**
   - `$derived` pour les valeurs calculées
   - `$effect` pour les effets de bord
   - `$state` pour les variables modifiables
   - `console.log` uniquement informatifs

2. **Pas de dépendance aux logs :**
   - Supprimer tous les `console.log` ne casse rien
   - La logique fonctionne sans les logs de debug

3. **Architecture explicite :**

   ```typescript
   // ✅ Réactivité explicite et intentionnelle
   let data = $state([]);
   let filteredData = $derived(data.filter((item) => item.active));
   let count = $derived(filteredData.length);

   $effect(() => {
   	console.log('Data changed, new count:', count); // ← Informatif
   });
   ```

### Erreurs Communes à Éviter

**❌ Console.log dans déclarations réactives :**

```typescript
$: if (condition) doSomething() && console.log('done'); // ← Danger !
```

**❌ Mélanger logique et debug :**

```typescript
$: {
	processData();
	console.log('Processing...'); // ← Peut maintenir réactivité
	updateUI();
}
```

**✅ Séparer logique et debug :**

```typescript
$effect(() => {
	processData();
	updateUI();
});

$effect(() => {
	console.log('Processing...'); // ← Debug séparé
});
```

### Outils de Vérification

**Commandes utiles pour vérifier la migration :**

```bash
# Vérifier les patterns Svelte 5
grep -rn "export let" src/routes/        # Doit être vide après migration
grep -rn "\$:" src/routes/               # Doit être minimal après migration
grep -rn "svelte:component" src/routes/  # Doit être vide après migration

# Vérifier la réactivité propre
grep -rn "console\.log.*\$" src/routes/  # Ne doit pas exister
grep -rn "\$:.*console" src/routes/      # Ne doit pas exister
```

Cette approche systématique permet de diagnostiquer et résoudre efficacement les problèmes de réactivité subtils dans Svelte, particulièrement lors des migrations vers Svelte 5.
