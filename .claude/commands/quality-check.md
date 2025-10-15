---
description: Vérification complète de la qualité du code
allowed-tools: Bash(pnpm lint:*), Bash(pnpm format:*), Bash(pnpm check:*)
---

# Vérification Qualité Complète du Projet

Exécute une vérification complète de la qualité du code en trois étapes :

## Étape 1 : Vérification Prettier + ESLint

Exécute `pnpm lint` pour vérifier le formatage et les règles de linting.

## Étape 2 : Formatage Automatique

Exécute `pnpm format` pour formater automatiquement le code avec Prettier.

## Étape 3 : Type Checking Svelte

Exécute `pnpm check` pour vérifier les types TypeScript dans les composants Svelte.

## Format du Résumé

Présente les résultats sous ce format structuré :

```
🔍 RAPPORT DE QUALITÉ DU CODE
═══════════════════════════════════════

✅ 1. LINT (Prettier + ESLint)
─────────────────────────────────────
[Statut: ✅ Succès / ⚠️ Avertissements / ❌ Erreurs]
[Nombre d'erreurs: X]
[Nombre d'avertissements: Y]

Problèmes principaux:
- [Liste des erreurs/avertissements les plus importants]

📝 2. FORMAT (Prettier)
─────────────────────────────────────
[Statut: ✅ Code formaté / ⚠️ Fichiers modifiés]
[Nombre de fichiers modifiés: X]

Fichiers formatés:
- [Liste des fichiers si pertinent]

🔎 3. TYPE CHECK (Svelte)
─────────────────────────────────────
[Statut: ✅ Pas d'erreurs / ❌ Erreurs TypeScript]
[Nombre d'erreurs: X]

Erreurs TypeScript:
- [Liste des erreurs avec fichier:ligne]

═══════════════════════════════════════
📊 RÉSUMÉ GLOBAL
─────────────────────────────────────
Statut: [✅ Tout est OK / ⚠️ Corrections nécessaires / ❌ Erreurs critiques]

Actions recommandées:
1. [Action prioritaire 1]
2. [Action prioritaire 2]
3. [...]

🔧 Commandes de correction rapide:
- [Commandes suggérées pour corriger les problèmes]
```

## Bonnes Pratiques à Vérifier

Après l'exécution, analyse également:

1. **Anti-patterns TypeScript** (selon CLAUDE.md):
   - Utilisation de `any` → suggérer `unknown` ou types spécifiques
   - `Record<string, any>` → suggérer `Record<string, unknown>`

2. **Problèmes Svelte 5** (selon CLAUDE.md):
   - Patterns `$:` obsolètes → suggérer `$derived` ou `$effect`
   - `export let` → suggérer `$props()`
   - `svelte:component` → suggérer `{@const Component}`
   - `console.log` dans déclarations réactives → warning réactivité

3. **Imports Problématiques**:
   - Import toast depuis mauvais chemin
   - Import Prisma Client incorrect (CENOV vs CENOV_DEV)

## Notes

- Cette commande ne modifie PAS le code automatiquement (sauf `pnpm format`)
- Les erreurs critiques doivent être corrigées avant tout commit
- Les avertissements peuvent être traités progressivement
- Toujours exécuter cette commande avant de créer un PR

## Exemples de Problèmes Courants

**Erreur ESLint courante:**

```
error  'variableName' is defined but never used  @typescript-eslint/no-unused-vars
```

→ Supprimer la variable ou préfixer avec `_` si intentionnel

**Erreur TypeScript courante:**

```
Type 'any' is not assignable to type 'unknown'
```

→ Remplacer `any` par un type spécifique ou `unknown`

**Erreur Svelte 5:**

```
Using $: for side effects is deprecated. Use $effect instead
```

→ Migrer vers `$effect(() => { ... })`

---

**Rappel:** Cette commande suit les standards définis dans `CLAUDE.md` et applique les bonnes pratiques du projet.
