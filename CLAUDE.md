# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

**Package Manager:** This project uses pnpm by default. Use `pnpm` instead of `npm` for all commands:

**Development server:**

```bash
pnpm dev
```

**Build and preview:**

```bash
pnpm build
pnpm preview
```

**Code quality:**

```bash
pnpm lint      # Prettier + ESLint check
pnpm format    # Format with Prettier
pnpm check     # Type checking with Svelte
```

**Testing:**

```bash
pnpm test:unit    # Run Vitest tests
pnpm test         # Run tests once
```

**Database operations:**

**CENOV Database (Main - Production):**

```bash
pnpm prisma:generate                        # Generate Prisma client (cenov)
pnpm prisma:migrate                        # Run database migrations (cenov)
pnpm prisma:studio                         # Open Prisma Studio (cenov)
pnpm prisma:push                          # Push schema to database (cenov)
pnpm prisma:pull                          # Pull schema from database (cenov)
```

**CENOV_DEV Database (Development):**

```bash
pnpm prisma:generate-dev                   # Generate Prisma client (cenov_dev)
pnpm prisma:migrate-dev                    # Run database migrations (cenov_dev)
pnpm prisma:studio-dev                     # Open Prisma Studio (cenov_dev)
pnpm prisma:push-dev                       # Push schema to database (cenov_dev)
pnpm prisma:pull-dev                       # Pull schema from database (cenov_dev)
```

**Generate both clients:**

```bash
pnpm prisma:generate-all                   # Generate both clients (runs automatically on pnpm install)
```

**Manual commands (if needed):**

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

**Installing dependencies:**

```bash
pnpm install              # Install all dependencies
pnpm add <package>        # Add new dependency
pnpm add -D <package>     # Add dev dependency
```

**BDD-IA Scripts (Database Export):**

```bash
node scripts/BDD-IA/fetch-all-tables.mjs    # Export all tables
node scripts/BDD-IA/fetch-all-views.mjs     # Export all views
node scripts/BDD-IA/fetch-cenov-data.mjs    # Export everything (recommended)
```

_Exports all Cenov database data in read-only mode to JSON files in `scripts/BDD-IA/output/`_

## Architecture Overview

### Tech Stack

- **Frontend:** SvelteKit with TypeScript
- **Database:** PostgreSQL with Prisma ORM
- **Styling:** TailwindCSS with Flowbite components
- **Authentication:** Logto integration
- **File processing:** XLSX import capabilities
- **Testing:** Vitest with Testing Library

### Database Design

**Dual Database Architecture:**

The application uses **TWO separate databases**:

1. **CENOV Database** (`DATABASE_URL`) - Main production database
   - Primary kit and parts management system
   - Tables: attribute, document, kit, kit_attribute, kit_document, kit_kit, part, supplier
   - Views: v_categories, v_kit_carac with dev variants

2. **CENOV_DEV Database** (`CENOV_DEV_DATABASE_URL`) - Extended development database
   - Product catalog and supplier management
   - Schemas: `produit` and `public`
   - Tables: categorie, famille, produit, fournisseur, kit, attribut, etc.
   - Views: v_produit_categorie_attribut, v_tarif_achat, mv_categorie

**Database Export:** Complete Cenov database data (12 tables, 4 views) available as JSON files in `scripts/BDD-IA/output/` for AI analysis and consultation.

### Prisma Client Usage

**Import the correct client:**

```typescript
// For CENOV database (main):
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// For CENOV_DEV database:
import { PrismaClient as CenovDevPrismaClient } from '../../prisma/cenov_dev/generated';
const cenovDevPrisma = new CenovDevPrismaClient();

// Usage examples:
const kits = await prisma.kit.findMany(); // CENOV database
const products = await cenovDevPrisma.produit.findMany(); // CENOV_DEV database
```

**Database Connection Management:**

- CENOV: Standard Prisma client for main operations
- CENOV_DEV: Separate client for product catalog features
- Both databases can be used simultaneously in the same application

### Key Files Structure

- `src/routes/` - SvelteKit pages (categories, kits, import, products)
- `src/lib/components/` - Reusable Svelte components including UI library
- `src/lib/schemas/dbSchema.ts` - Zod validation schemas for all database entities
- `src/lib/prisma-meta.ts` - Centralized Prisma metadata utilities
- `prisma/cenov/schema.prisma` - Main database schema

### Prisma Meta Utilities

**`src/lib/prisma-meta.ts`** provides centralized database metadata functions using Prisma DMMF (Data Model Meta Format):

**Core Functions:**

- `getDatabases()` - Access to both database clients and metadata
- `getTableMetadata(database, tableName)` - Schema detection via DMMF
- `getAllTables(database)` - Tables with automatic schema detection
- `getAllDatabaseTables()` - Combined tables from both databases

**Best Practices:**

- **Avoid hardcoding** - Use Prisma DMMF metadata instead of hardcoded values
- Schema detection: Use `metadata.schema` from `getTableMetadata()`
- Table lists: Use `getAllTables()` instead of hardcoded table names
- Database info: Use DMMF properties instead of string matching
- Dynamic detection preferred over static lists for maintainability

### Prisma Workflow

**Dual Schema Workflow:**

**For CENOV Database (main):**

1. Edit `prisma/cenov/schema.prisma`
2. Run: `npx prisma generate --schema prisma/cenov/schema.prisma`
3. Run: `npx prisma db push --schema prisma/cenov/schema.prisma` (or migrate)

**For CENOV_DEV Database:**

1. Edit `prisma/cenov_dev/schema.prisma`
2. Run: `npx prisma generate --schema prisma/cenov_dev/schema.prisma`
3. Run: `npx prisma db push --schema prisma/cenov_dev/schema.prisma` (or migrate)

**⚠️ Common Issues & Solutions:**

- **"Model already exists" error:** Always specify `--schema` flag to avoid conflicts
- **Generation conflicts:** Never run `prisma generate` without `--schema` flag
- **Wrong client imported:** Check import paths - use generated clients from correct output directories

**Quick fixes:**

```bash
# Clear and regenerate both clients:
rm -rf prisma/generated/ node_modules/.prisma/
npx prisma generate --schema prisma/cenov/schema.prisma
npx prisma generate --schema prisma/cenov_dev/schema.prisma
```

### Authentication

Uses Logto for authentication with:

- Protected routes via `src/lib/auth/protect.ts`
- User session management in layouts
- Callback handling for OAuth flow

### Import System

Excel file import functionality for:

- Categories and attributes
- Kit hierarchies and characteristics
- Located in `/import` and `/products/import` routes

### Testing

Integration tests cover:

- CRUD operations for categories and kits
- Import functionality
- Located in `tests/integration/`

## Development Notes

- Uses pnpm as package manager
- Supports both production and development database schemas (\_dev tables/views)
- Custom UI components built on bits-ui and Flowbite
- Form validation with Zod schemas and SvelteKit Superforms

## TypeScript Best Practices

**Avoid using `any` type** - Prefer specific types to avoid @typescript-eslint/no-explicit-any errors:

```typescript
// ❌ BAD - Using any
const data: any[] = [];
const previewData: Record<string, any[]> = {};

// ✅ GOOD - Using specific types
const data: Record<string, unknown>[] = [];
const previewData: Record<string, unknown[]> = {};

// ✅ GOOD - Using interface definitions
interface TableData {
	id: number;
	name: string;
	[key: string]: unknown; // For dynamic properties
}
const data: TableData[] = [];
```

**Common TypeScript replacements:**

- `any[]` → `unknown[]` or `Record<string, unknown>[]`
- `any` → `unknown` or specific interface
- `Record<string, any>` → `Record<string, unknown>`
- For Prisma results: use generated types or `Record<string, unknown>`

**When to use `unknown`:**

- External API responses
- Dynamic data from databases
- User input that needs validation
- Generic data structures

## UI Component Guidelines

**Button variants available:**

- `bleu` (default) - Primary blue button
- `vert` - Success/confirmation actions
- `rouge` - Danger/delete actions
- `jaune` - Warning actions
- `noir` - Secondary dark actions
- `blanc` - Alternative/outline style
- `link` - Text link style

**Note:** `outline` variant does not exist - use `blanc` instead for outline-style buttons.

**Badge variants available:**

- `default` (default) - Primary badge style
- `bleu` - Blue informational badge
- `vert` - Success/positive badge
- `rouge` - Error/danger badge
- `noir` - Secondary/neutral badge
- `blanc` - Alternative/outline style badge
- `orange` - Modification badge

**Note:** `outline` variant does not exist for badges - use `blanc` instead for outline-style badges.

### Badge Icon Integration

**IMPORTANT:** The Badge component automatically handles SVG icons with built-in styling:

```typescript
// ✅ CORRECT - Let the component handle icon sizing and spacing
<Badge variant="vert">
  <Eye />
  Vues
</Badge>

// ❌ WRONG - Don't manually add size or spacing classes
<Badge variant="vert">
  <Eye class="mr-1 h-3 w-3" />
  Vues
</Badge>
```

**Built-in Badge Icon Styling:**

- `[&>svg]:size-3` - All SVG icons automatically get `size-3` (12x12px)
- `[&>svg]:pointer-events-none` - Icons don't interfere with click events
- `gap-1` - Automatic spacing between icon and text
- `items-center justify-center` - Perfect alignment

**Best Practice:** Always read the component's CSS classes before adding manual styling. Most UI components have built-in icon handling.

## Toast Notifications (Sonner)

This project uses **svelte-sonner** for toast notifications.

### Setup Requirements

1. **Installation:** Already installed as dependency
2. **Toaster Component:** Must be placed in root layout (`+layout.svelte`)
3. **Import:** Always import directly from `'svelte-sonner'`

### Correct Usage

```typescript
// ✅ CORRECT Import
import { toast } from 'svelte-sonner';

// ✅ CORRECT Toaster setup (already in +layout.svelte)
import { Toaster } from 'svelte-sonner';
<Toaster position="top-center" richColors={true} />

// ✅ CORRECT Usage
toast.error('Error message');
toast.success('Success message');
toast('Info message');
```

### Common Mistakes to Avoid

```typescript
// ❌ WRONG - Don't import from UI components
import { toast } from '$lib/components/ui/sonner';

// ❌ WRONG - Don't use custom wrapper component for basic toasts
import { Toaster } from '$lib/components/ui/sonner/sonner.svelte';
```

### Timing Best Practices

- **Page load toasts:** Use `setTimeout` with small delay (100ms) in `onMount`
- **Event handlers:** Call directly without delay
- **After navigation:** Works immediately after redirects

### Authentication Integration

The project has built-in auth error toasts:

- Protected routes automatically show toast on unauthorized access
- Handled via URL params and `onMount` in homepage

## File Editing Conflict Resolution

**When encountering "File has been unexpectedly modified" errors:**

This typically occurs when files are automatically formatted by linters/formatters (Prettier, ESLint) after reading them.

**Solution steps:**

1. **Use absolute Windows paths FIRST:** Always use absolute Windows paths with drive letters and backslashes for ALL file operations:

   ```bash
   # ✅ CORRECT - Use absolute Windows paths
   C:\Users\EwanSenergous\OneDrive - jll.spear\Bureau\Projet\importData\file.js

   # ❌ WRONG - Relative or Unix-style paths may fail
   ./file.js
   /c/Users/.../file.js
   ```

2. **Git restore (if absolute paths don't work):** If editing conflicts persist, restore the file to its original state:

   ```bash
   git restore path/to/file.svelte
   ```

3. **Re-read before editing:** Always use the Read tool to get the latest file state before making edits

4. **Expected behavior:** Linters may automatically format files, this is intentional and should be preserved

**Common scenarios:**

- Prettier reformats spacing and line breaks
- ESLint auto-fixes code style issues
- These changes are intentional and improve code quality

**Best practices:**

- **ALWAYS try absolute Windows paths first** before using git restore
- Don't revert linter changes unless explicitly requested
- Use git restore only when absolute paths and edit conflicts prevent progress
- Re-read files after any formatting to get current state

**Apply absolute Windows paths to all tools:**

- Read tool: Always use `C:\...` paths
- Write tool: Always use `C:\...` paths
- Edit tool: Always use `C:\...` paths
- MultiEdit tool: Always use `C:\...` paths

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
// ❌ Ancien - Hack réactif
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
# - Dans des handlers d'événements (OK - informatuf)
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
