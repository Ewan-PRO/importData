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

**CENOV_DEV_EWAN Database (Development):**
```bash
pnpm prisma:generate-dev                   # Generate Prisma client (cenov_dev_ewan)
pnpm prisma:migrate-dev                    # Run database migrations (cenov_dev_ewan)
pnpm prisma:studio-dev                     # Open Prisma Studio (cenov_dev_ewan)
pnpm prisma:push-dev                       # Push schema to database (cenov_dev_ewan)
pnpm prisma:pull-dev                       # Pull schema from database (cenov_dev_ewan)
```

**Generate both clients:**
```bash
pnpm prisma:generate-all                   # Generate both clients (runs automatically on pnpm install)
```

**Manual commands (if needed):**
```bash
# CENOV:
npx prisma generate --schema prisma/schema.prisma
npx prisma migrate dev --schema prisma/schema.prisma
npx prisma migrate deploy --schema prisma/schema.prisma
npx prisma db push --schema prisma/schema.prisma
npx prisma db pull --schema prisma/schema.prisma
npx prisma studio --schema prisma/schema.prisma

# CENOV_DEV_EWAN:
npx prisma generate --schema prisma/cenov_dev_ewan/schema.prisma
npx prisma migrate dev --schema prisma/cenov_dev_ewan/schema.prisma
npx prisma migrate deploy --schema prisma/cenov_dev_ewan/schema.prisma
npx prisma db push --schema prisma/cenov_dev_ewan/schema.prisma  
npx prisma db pull --schema prisma/cenov_dev_ewan/schema.prisma
npx prisma studio --schema prisma/cenov_dev_ewan/schema.prisma
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

2. **CENOV_DEV_EWAN Database** (`CENOV_DEV_DATABASE_URL`) - Extended development database  
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

// For CENOV_DEV_EWAN database:
import { PrismaClient as CenovDevPrismaClient } from '../../prisma/generated/cenov_dev_ewan';
const cenovDevPrisma = new CenovDevPrismaClient();

// Usage examples:
const kits = await prisma.kit.findMany();           // CENOV database
const products = await cenovDevPrisma.produit.findMany();  // CENOV_DEV_EWAN database
```

**Database Connection Management:**
- CENOV: Standard Prisma client for main operations
- CENOV_DEV_EWAN: Separate client for product catalog features
- Both databases can be used simultaneously in the same application

### Key Files Structure

- `src/routes/` - SvelteKit pages (categories, kits, import, products)
- `src/lib/components/` - Reusable Svelte components including UI library
- `src/lib/schemas/dbSchema.ts` - Zod validation schemas for all database entities
- `prisma/schema.prisma` - Main database schema

### Prisma Workflow

**Dual Schema Workflow:**

**For CENOV Database (main):**
1. Edit `prisma/schema.prisma`
2. Run: `npx prisma generate --schema prisma/schema.prisma`
3. Run: `npx prisma db push --schema prisma/schema.prisma` (or migrate)

**For CENOV_DEV_EWAN Database:**
1. Edit `prisma/cenov_dev_ewan/schema.prisma`  
2. Run: `npx prisma generate --schema prisma/cenov_dev_ewan/schema.prisma`
3. Run: `npx prisma db push --schema prisma/cenov_dev_ewan/schema.prisma` (or migrate)

**⚠️ Common Issues & Solutions:**

- **"Model already exists" error:** Always specify `--schema` flag to avoid conflicts
- **Generation conflicts:** Never run `prisma generate` without `--schema` flag
- **Wrong client imported:** Check import paths - use generated clients from correct output directories

**Quick fixes:**
```bash
# Clear and regenerate both clients:
rm -rf prisma/generated/ node_modules/.prisma/
npx prisma generate --schema prisma/schema.prisma
npx prisma generate --schema prisma/cenov_dev_ewan/schema.prisma
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
