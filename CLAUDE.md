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
```bash
pnpm prisma:generate  # Generate Prisma client (runs schema transform first)
pnpm prisma:migrate   # Run database migrations
pnpm prisma:studio    # Open Prisma Studio
pnpm prisma:push      # Push schema to database
pnpm prisma:pull      # Pull schema from database
```

**Installing dependencies:**
```bash
pnpm install              # Install all dependencies
pnpm add <package>        # Add new dependency
pnpm add -D <package>     # Add dev dependency
```

## Architecture Overview

### Tech Stack
- **Frontend:** SvelteKit with TypeScript
- **Database:** PostgreSQL with Prisma ORM
- **Styling:** TailwindCSS with Flowbite components
- **Authentication:** Logto integration
- **File processing:** XLSX import capabilities
- **Testing:** Vitest with Testing Library

### Database Design
The application manages a hierarchical kit and parts system with:
- **Kits:** Main entities that can contain parts and other kits (kit_kit relationships)
- **Attributes:** Key-value pairs with characteristics (attribute table)
- **Parts:** Components belonging to kits
- **Documents:** File attachments for kits
- **Views:** Materialized views for categories (v_categories, v_kit_carac) with dev variants

### Key Files Structure
- `src/routes/` - SvelteKit pages (categories, kits, import, products)
- `src/lib/components/` - Reusable Svelte components including UI library
- `src/lib/schemas/dbSchema.ts` - Zod validation schemas for all database entities
- `prisma/schema.prisma` - Main database schema
- `scripts/transform-prisma-schema.mjs` - Schema transformation utility

### Prisma Workflow
This project uses a custom Prisma workflow:
1. Edit `prisma/schema.prisma`
2. Run `pnpm prisma:transform` to create `schema.transformed.prisma`
3. All Prisma commands operate on the transformed schema

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
- Supports both production and development database schemas (_dev tables/views)
- Custom UI components built on bits-ui and Flowbite
- Form validation with Zod schemas and SvelteKit Superforms