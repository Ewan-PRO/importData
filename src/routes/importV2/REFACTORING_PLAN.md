# 🏗️ Plan de Refactorisation ImportV2 - Architecture en Couches

> **Date de création :** 2025-01-07
> **Objectif :** Refactoriser `import-logic.ts` (1797 lignes) en 4 fichiers suivant une architecture en couches

---

## 📊 Vue d'ensemble de l'architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   COUCHE PRÉSENTATION                        │
│                    +page.server.ts                          │
│  - Types pour le frontend (UI)                              │
│  - Schéma Zod de validation des formulaires                 │
│  - Actions SvelteKit (validate, process)                    │
│  - Load function (charge catégories)                        │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    COUCHE MÉTIER (BUSINESS)                  │
│  ┌────────────────────────┐  ┌──────────────────────────┐  │
│  │  import.validation.ts  │  │ import.orchestrator.ts   │  │
│  │  - Parse CSV          │  │ - Import BDD principal   │  │
│  │  - Validation CSV     │  │ - Transaction globale    │  │
│  │  - Validation attrs   │  │ - Upsert produits/prix   │  │
│  │  - Règles métier      │  │ - Import attributs       │  │
│  └────────────────────────┘  └──────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                  COUCHE ACCÈS DONNÉES                        │
│                 import.repository.ts                        │
│  - Chargement référentiels (supplier, kit, category)        │
│  - findOrCreate* (CRUD entités)                             │
│  - Résolution hiérarchies (familles)                        │
│  - Chargement métadonnées attributs                         │
│  - Accès Prisma (lectures)                                  │
└─────────────────────────────────────────────────────────────┘
                            ↓
                    ┌────────────────┐
                    │ Base de données│
                    │    Prisma      │
                    └────────────────┘
```

---

## 📁 Organisation des Dossiers (Option 1 - Recommandée)

```
importV2/
├── +page.svelte                    # 🎨 PRÉSENTATION (UI)
├── +page.server.ts                 # 🎨 PRÉSENTATION (Actions SvelteKit)
├── +server.ts                      # API Template CSV (non touché)
│
├── services/                       # 💼 COUCHE MÉTIER (Business Logic)
│   ├── import.validation.ts        # Validation CSV + Attributs
│   └── import.orchestrator.ts      # Transactions BDD + Import
│
├── repositories/                   # 🗄️ COUCHE DONNÉES (Data Access)
│   └── import.repository.ts        # Accès BDD (lecture seule)
│
└── import-logic.ts                 # ⚠️ À SUPPRIMER après migration
```

### **Justification de la Structure**

| Élément           | Responsabilité                                | Couche       |
| ----------------- | --------------------------------------------- | ------------ |
| `+page.server.ts` | Actions SvelteKit (validate, process, load)   | Présentation |
| `services/`       | Logique métier (validation + orchestration)   | Métier       |
| `repositories/`   | Accès données (requêtes Prisma, référentiels) | Données      |

### **Avantages de cette Structure**

- ✅ **Séparation claire** : Métier (`services/`) et Données (`repositories/`) bien séparés
- ✅ **Convention standard** : Nommage reconnu dans l'industrie
- ✅ **Évolutif** : Facile d'ajouter nouveaux services/repositories
- ✅ **Compatible SvelteKit** : Fichiers routes (`+page.*`) restent à la racine
- ✅ **Imports simples** : Chemins courts et cohérents

### **Exemples d'Imports**

```typescript
// Dans +page.server.ts (Présentation)
import { parseCSVContent, validateCSVData } from './services/import.validation';
import { importToDatabase } from './services/import.orchestrator';
import { getCategoryTotalAttributeCount } from './repositories/import.repository';

// Dans services/import.orchestrator.ts (Métier)
import { loadAttributeReference } from '../repositories/import.repository';
import type { CSVRow } from './import.validation';

// Dans services/import.validation.ts (Métier)
import { loadCategoriesMetadata } from '../repositories/import.repository';
```

### **Correspondance avec l'Architecture**

| Couche Architecture | Implémentation Fichiers             |
| ------------------- | ----------------------------------- |
| **Présentation**    | `+page.server.ts` (racine)          |
| **Métier**          | `services/import.validation.ts`     |
|                     | `services/import.orchestrator.ts`   |
| **Données**         | `repositories/import.repository.ts` |

---

## 🎯 Principe SOLID appliqué

| Principe                  | Application                                                  |
| ------------------------- | ------------------------------------------------------------ |
| **S**ingle Responsibility | Chaque fichier a UNE responsabilité claire                   |
| **O**pen/Closed           | Extension facile (nouveaux formats, validations)             |
| **L**iskov Substitution   | Types génériques pour entités                                |
| **I**nterface Segregation | Interfaces métier séparées                                   |
| **D**ependency Inversion  | Couches hautes ne dépendent pas des détails d'implémentation |

---

## 📁 Détail des Fichiers (4 fichiers dans 2 dossiers)

### 1️⃣ **`+page.server.ts`** (~200 lignes) - 🎨 COUCHE PRÉSENTATION

#### **Responsabilité**

Gère l'interface SvelteKit : reçoit les requêtes, valide les formulaires, orchestre les appels métier, renvoie les réponses.

#### **Contenu**

```typescript
// ==================== TYPES UI ====================
export interface ExportedValidationResult {
  // Types pour le frontend (JSON sérialisable)
}

// ==================== CONFIGURATION ====================
const CONFIG = {
  requiredFields: [...],
  fieldMapping: {...},
  // Configuration statique (pas de logique métier)
}

// ==================== HELPERS UI ====================
function formatError(err: unknown): string { ... }
function validateFormData(formData: FormData): { csvContent: string; error?: string } { ... }

// ==================== ACTIONS SVELTEKIT ====================
export const actions: Actions = {
  validate: async ({ request }) => {
    // 1. Récupérer formData
    // 2. Appeler import.validation.ts
    // 3. Retourner résultat pour UI
  },

  process: async ({ request }) => {
    // 1. Récupérer formData
    // 2. Valider via import.validation.ts
    // 3. Importer via import.orchestrator.ts
    // 4. Retourner résultat pour UI
  }
}

// ==================== LOAD FUNCTION ====================
export const load: PageServerLoad = async () => {
  // Charge catégories avec comptage attributs
  // Appelle import.repository.getCategoryTotalAttributeCount()
}
```

#### **Imports autorisés**

```typescript
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { parseCSVContent, validateCSVData, ... } from './services/import.validation';
import { importToDatabase } from './services/import.orchestrator';
import { getCategoryTotalAttributeCount } from './repositories/import.repository';
import { getClient } from '$lib/prisma-meta';
```

#### **Règles**

- ✅ Peut appeler les couches Métier et Données
- ❌ Pas de logique métier complexe
- ❌ Pas d'accès direct à Prisma (sauf pour load simple)
- ✅ Transforme les résultats pour le frontend

---

### 2️⃣ **`services/import.validation.ts`** (~500 lignes) - 💼 COUCHE MÉTIER (Validation)

#### **Responsabilité**

Parse et valide les données CSV selon les règles métier. Aucun accès base de données (sauf lecture référentiels via repository).

#### **Contenu**

```typescript
// ==================== TYPES MÉTIER ====================
export interface CSVRow {
  pro_cenov_id: string;
  pro_code: string;
  sup_code: string;
  // ... tous les champs CSV
}

export interface ValidationResult {
  success: boolean;
  totalRows: number;
  validRows: number;
  errors: ValidationError[];
  warnings: ValidationError[];
}

export interface AttributePair {
  atrValueCode: string;
  atrValue: string | null;
}

export interface ProductAttributes {
  pro_cenov_id: string;
  attributes: AttributePair[];
}

export interface ParsedCSVData {
  success: boolean;
  data: CSVRow[];
  attributes: ProductAttributes[];
  error?: string;
}

// ==================== UTILITAIRES ====================
function convertToISODate(dateStr: string): string | null { ... }

export function parseValueAndUnit(rawValue: string): { value: string; unit: string | null } {
  // Parse "10 bar" -> { value: "10", unit: "bar" }
}

export function findUnitId(
  atr_id: number,
  unit_string: string,
  attributeUnitsMap: Map<...>
): number | null {
  // Trouve l'ID d'une unité dans le référentiel
}

// ==================== PARSING CSV ====================
function parseCSVNative(csvContent: string, delimiter: string): unknown[][] {
  // Parse CSV natif (sans PapaParse)
}

export async function parseCSVContent(
  csvContent: string,
  database: 'cenov_dev' | 'cenov_preprod' = 'cenov_dev'
): Promise<ParsedCSVData> {
  // 1. Parse le CSV en lignes
  // 2. Détecte colonnes métier vs attributs (via repository)
  // 3. Retourne données structurées
}

// ==================== VALIDATION CSV ====================
export async function validateCSVData(
  data: CSVRow[],
  config: {
    requiredFields: string[];
    numericFields: string[];
    dateFields: string[];
    fieldMapping: Record<string, { table: string; field: string }>;
    fieldMaxLengths: Record<string, number>;
  }
): Promise<ValidationResult> {
  // ✅ VALIDATION PRIORITÉ 1 : Format CSV
  // - Champs obligatoires
  // - Formats numériques
  // - Formats dates
  // - Longueurs max
  // - Hiérarchie familles
  // - Unicité (sup_code, pro_code)
  // - Cohérence interne (même sup_code → même sup_label)
}

// ==================== VALIDATION ATTRIBUTS ====================
export async function validateAttributes(
  attributes: AttributePair[],
  database: 'cenov_dev' | 'cenov_preprod' = 'cenov_dev'
): Promise<ValidationResult> {
  // ✅ VALIDATION PRIORITÉ 1.5 : Attributs produit
  // - Code attribut existe
  // - Valeurs autorisées (si liste fermée)
  // - Unités valides (si mesure)
  // Utilise repository pour charger référentiels
}

// ==================== VALIDATION ATTRIBUTS OBLIGATOIRES ====================
export async function validateRequiredAttributes(
  data: CSVRow[],
  attributesByProduct: ProductAttributes[],
  database: 'cenov_dev' | 'cenov_preprod' = 'cenov_dev'
): Promise<ValidationResult> {
  // ✅ VALIDATION PRIORITÉ 2 : Attributs obligatoires
  // - Charge catégories via repository
  // - Vérifie présence attributs requis par catégorie
  // - Gère catégories inconnues (warning)
  // - Détecte doublons cat_code (erreur bloquante BDD)
}
```

#### **Imports autorisés**

```typescript
import { getClient } from '$lib/prisma-meta';
import {
	loadAttributeReference,
	loadCategoriesMetadata,
	loadRequiredAttributesByCategory
} from '../repositories/import.repository';
import type { PrismaClient as CenovDevPrismaClient } from '...';
```

#### **Règles**

- ✅ Contient TOUTE la logique de validation
- ✅ Peut appeler import.repository pour charger référentiels
- ❌ Ne crée/modifie RIEN en base de données
- ✅ Retourne des résultats structurés (errors, warnings)

---

### 3️⃣ **`repositories/import.repository.ts`** (~400 lignes) - 🗄️ COUCHE ACCÈS DONNÉES

#### **Responsabilité**

Gère l'accès aux données : lectures de référentiels, chargement métadonnées, CRUD entités de base. Aucune logique métier.

#### **Contenu**

```typescript
// ==================== TYPES ====================
interface AttributeMetadata {
  attributeMap: Map<string, { atr_id: number; atr_value: string }>;
  attributeUnitsMap: Map<number, { ... }>;
  allowedValuesMap: Map<number, Set<string>>;
  categoryAttributesMap: Map<string, boolean>;
  kitAttributesMap: Map<string, { ... }>;
}

// ==================== CHARGEMENT RÉFÉRENTIELS ====================
export async function loadAttributeReference(
  database: 'cenov_dev' | 'cenov_preprod' = 'cenov_dev'
): Promise<Map<string, { atr_id: number; atr_value: string }>> {
  // Charge TOUS les codes attributs depuis BDD
  // Retourne Map: atr_value → { atr_id, atr_value }
}

export async function loadAttributeUnitsEnriched(
  database: 'cenov_dev' | 'cenov_preprod' = 'cenov_dev'
): Promise<Map<number, { default_unit_id: number | null; units: [...] }>> {
  // Charge TOUTES les unités disponibles par attribut
  // Retourne Map: atr_id → { default_unit_id, units[] }
}

export async function loadAllowedValues(
  atrIds: number[],
  database: 'cenov_dev' | 'cenov_preprod' = 'cenov_dev'
): Promise<Map<number, Set<string>>> {
  // Charge valeurs autorisées pour attributs (listes fermées)
  // Retourne Map: atr_id → Set<valeurs_autorisées>
}

// ==================== CATÉGORIES ====================
export async function loadCategoriesMetadata(
  catCodes: string[],
  database: 'cenov_dev' | 'cenov_preprod' = 'cenov_dev'
): Promise<{
  categoriesMap: Map<string, { cat_id: number; cat_label: string }>;
  duplicates: Array<{ cat_code: string; labels: string[] }>;
}> {
  // Charge catégories + détecte doublons cat_code
}

export async function loadRequiredAttributesByCategory(
  categoryIds: number[],
  database: 'cenov_dev' | 'cenov_preprod' = 'cenov_dev'
): Promise<Map<number, Array<{ code: string; label: string }>>> {
  // Charge attributs obligatoires (cat_atr_required = true)
  // Retourne Map: cat_id → attributs_requis[]
}

export async function getCategoryTotalAttributeCount(
  catId: number,
  database: 'cenov_dev' | 'cenov_preprod' = 'cenov_dev'
): Promise<number> {
  // Calcule TOTAL attributs (directs + hérités via fk_parent)
  // Remonte récursivement la hiérarchie
}

// ==================== CRUD ENTITÉS (LECTURE SEULEMENT) ====================
// Ces fonctions sont DÉPLACÉES vers import.orchestrator.ts
// car elles font des CREATE/UPDATE (logique transactionnelle)
//
// Repository = LECTURE uniquement (référentiels, métadonnées)
// Orchestrator = ÉCRITURE (transactions, upsert, import)
```

#### **Imports autorisés**

```typescript
import { getClient } from '$lib/prisma-meta';
import type { PrismaClient as CenovDevPrismaClient } from '...';
```

#### **Règles**

- ✅ Accès Prisma pour LECTURES de référentiels
- ❌ AUCUNE écriture en base (pas de create/update/upsert)
- ✅ Retourne données brutes (Maps, arrays)
- ❌ Pas de logique métier complexe (juste requêtes)

---

### 4️⃣ **`services/import.orchestrator.ts`** (~600 lignes) - 💼 COUCHE MÉTIER (Transactions)

#### **Responsabilité**

Orchestre l'import complet en base de données : gère la transaction principale, coordonne les CRUD, applique les règles métier d'import.

#### **Contenu**

```typescript
// ==================== TYPES ====================
export interface ImportStats {
	suppliers: number;
	kits: number;
	categories: number;
	families: number;
	products: number;
	productsUpdated: number;
	prices: number;
	categoryAttributes: number;
	kitAttributes: number;
}

export interface ChangeDetail {
	table: string;
	schema: string;
	column: string;
	oldValue: ChangeValue;
	newValue: ChangeValue;
	recordId: string;
}

export interface ImportResult {
	success: boolean;
	stats: ImportStats;
	changes: ChangeDetail[];
	error?: string;
}

// ==================== ORCHESTRATEUR PRINCIPAL ====================
export async function importToDatabase(
	data: CSVRow[],
	attributesByProduct: ProductAttributes[],
	database: 'cenov_dev' | 'cenov_preprod' = 'cenov_dev'
): Promise<ImportResult> {
	// 🎯 TRANSACTION PRINCIPALE
	// 1. Charger métadonnées (via repository)
	// 2. Précharger category_attribute et kit_attribute (OPTIMISATION)
	// 3. Démarrer transaction Prisma (timeout 60s)
	// 4. Pour chaque ligne CSV :
	//    - findOrCreateSupplier()
	//    - findOrCreateKit()
	//    - findOrCreateCategory()
	//    - resolveFamilyHierarchy()
	//    - upsertProduct()
	//    - upsertPricePurchase()
	//    - importAttributes()
	// 5. Retourner stats + changes
}

// ==================== CRUD ENTITÉS (UPSERT) ====================
async function findOrCreateSupplier(
	tx: PrismaTransaction,
	sup_code: string,
	sup_label: string,
	changes: ChangeDetail[]
) {
	// Upsert supplier + track changes
}

async function findOrCreateKit(tx: PrismaTransaction, kit_label: string, changes: ChangeDetail[]) {
	// Upsert kit + track changes
}

async function findOrCreateCategory(
	tx: PrismaTransaction,
	cat_code: string,
	cat_label: string,
	changes: ChangeDetail[]
) {
	// ✅ AMÉLIORATION : Recherche dans toute hiérarchie (pas seulement racines)
	// ✅ ROBUSTESSE : Vérifier unicité du cat_code (erreur si doublons)
	// Upsert category + track changes
}

// ==================== HIÉRARCHIE FAMILLES ====================
async function resolveFamilyHierarchy(
	tx: PrismaTransaction,
	row: CSVRow,
	fk_supplier: number,
	stats: ImportStats,
	changes: ChangeDetail[]
) {
	// Crée hiérarchie : famille → sous_famille → sous_sous_famille
}

async function findOrCreateFamily(
	tx: PrismaTransaction,
	fam_label: string,
	fk_parent: number | null,
	fk_supplier: number,
	changes: ChangeDetail[]
) {
	// Upsert family avec gestion parent
}

// ==================== PRODUITS ET PRIX ====================
async function upsertProduct(
	tx: PrismaTransaction,
	row: CSVRow,
	fk_supplier: number,
	fk_kit: number,
	familyIds: { fam_id: number | null; sfam_id: number | null; ssfam_id: number | null },
	categoryResult: { entity: { cat_id: number }; isNew: boolean } | null,
	changes: ChangeDetail[]
) {
	// Upsert product + product_category
	// Track tous les changements (création ou mise à jour)
}

async function upsertPricePurchase(
	tx: PrismaTransaction,
	fk_product: number,
	row: CSVRow,
	changes: ChangeDetail[]
) {
	// Upsert price_purchase (clé composite : fk_product + pp_date)
	// Track changements prix/remise/document
}

// ==================== ATTRIBUTS ====================
async function importAttributes(
	tx: PrismaTransaction,
	cat_id: number,
	kit_id: number,
	kit_label: string,
	attributes: AttributePair[],
	changes: ChangeDetail[],
	metadata: AttributeMetadata
) {
	// Pour chaque attribut :
	// 1. Créer category_attribute si manquant (utilise cache préchargé)
	// 2. Upsert kit_attribute (avec valeur + unité)
	// Track tous les changements
}

async function autoLinkCategoryAttributes(
	tx: PrismaTransaction,
	cat_id: number,
	cat_code: string,
	attributeCodes: string[],
	changes: ChangeDetail[],
	metadata: AttributeMetadata
): Promise<number> {
	// Auto-liaison attributs CSV → nouvelle catégorie (tous optionnels)
	// Évite duplicatas via cache
}
```

#### **Imports autorisés**

```typescript
import { getClient } from '$lib/prisma-meta';
import {
  loadAttributeReference,
  loadAttributeUnitsEnriched,
  loadAllowedValues
} from '../repositories/import.repository';
import type { CSVRow, ProductAttributes, AttributePair } from './import.validation';
import type { PrismaClient as CenovDevPrismaClient } from '...';

type PrismaTransaction = Omit<CenovDevPrismaClient, '$connect' | '$disconnect' | ...>;
```

#### **Règles**

- ✅ Contient TOUTE la logique transactionnelle
- ✅ Utilise repository pour charger référentiels
- ✅ Gère transaction Prisma (timeout 60s)
- ✅ Track tous les changements (ChangeDetail[])
- ❌ Ne valide pas les données (déjà fait par validation.ts)

---

## 🔄 Flux de dépendances entre couches

```
+page.server.ts (Présentation)
    ↓ imports
    ├── services/import.validation.ts (Métier - Validation)
    │       ↓ imports
    │       └── repositories/import.repository.ts (Données)
    │
    └── services/import.orchestrator.ts (Métier - Transactions)
            ↓ imports
            ├── repositories/import.repository.ts (Données)
            └── services/import.validation.ts (Types seulement)
```

### **Règles de dépendances**

1. **Présentation** peut importer **Métier** et **Données**
2. **Métier** peut importer **Données** (mais pas l'inverse)
3. **Données** ne dépend de PERSONNE (sauf Prisma)
4. **Pas de dépendances circulaires**

---

## 📋 Mapping détaillé des fonctions

### **Depuis `import-logic.ts` (1797 lignes) → 4 fichiers (2 dossiers)**

| Fonction actuelle                    | Destination                         | Ligne actuelle | Raison                  |
| ------------------------------------ | ----------------------------------- | -------------- | ----------------------- |
| **TYPES**                            |                                     |                |                         |
| `CSVRow`                             | `services/import.validation.ts`     | 12-27          | Type métier validation  |
| `AttributePair`                      | `services/import.validation.ts`     | 29-32          | Type métier validation  |
| `ProductAttributes`                  | `services/import.validation.ts`     | 34-37          | Type métier validation  |
| `ParsedCSVData`                      | `services/import.validation.ts`     | 39-44          | Type métier validation  |
| `ValidationError`                    | `services/import.validation.ts`     | 46-51          | Type métier validation  |
| `ValidationResult`                   | `services/import.validation.ts`     | 53-59          | Type métier validation  |
| `ImportStats`                        | `services/import.orchestrator.ts`   | 61-71          | Type métier import      |
| `ChangeDetail`                       | `services/import.orchestrator.ts`   | 73-82          | Type métier import      |
| `ImportResult`                       | `services/import.orchestrator.ts`   | 84-89          | Type métier import      |
| `AttributeMetadata`                  | `repositories/import.repository.ts` | 91-106         | Type données (interne)  |
| `PrismaTransaction`                  | `services/import.orchestrator.ts`   | 4-7            | Type transaction        |
| **UTILITAIRES**                      |                                     |                |                         |
| `convertToISODate()`                 | `services/import.validation.ts`     | 111-123        | Utilitaire validation   |
| `parseValueAndUnit()`                | `services/import.validation.ts`     | 125-138        | Utilitaire validation   |
| `findUnitId()`                       | `services/import.validation.ts`     | 140-162        | Utilitaire validation   |
| `parseCSVNative()`                   | `services/import.validation.ts`     | 167-178        | Parse CSV               |
| **PARSING**                          |                                     |                |                         |
| `parseCSVContent()`                  | `services/import.validation.ts`     | 180-255        | Parse CSV principal     |
| **VALIDATION CSV**                   |                                     |                |                         |
| `validateCSVData()`                  | `services/import.validation.ts`     | 260-474        | Validation CSV complète |
| **VALIDATION ATTRIBUTS**             |                                     |                |                         |
| `loadAttributeReference()`           | `repositories/import.repository.ts` | 479-492        | Charge référentiel      |
| `loadAttributeUnitsEnriched()`       | `repositories/import.repository.ts` | 494-536        | Charge référentiel      |
| `loadAllowedValues()`                | `repositories/import.repository.ts` | 538-560        | Charge référentiel      |
| `getCategoryTotalAttributeCount()`   | `repositories/import.repository.ts` | 570-602        | Calcul hiérarchie       |
| `loadCategoriesMetadata()`           | `repositories/import.repository.ts` | 612-657        | Charge référentiel      |
| `loadRequiredAttributesByCategory()` | `repositories/import.repository.ts` | 662-694        | Charge référentiel      |
| `validateRequiredAttributes()`       | `services/import.validation.ts`     | 699-798        | Validation métier       |
| `validateAttributes()`               | `services/import.validation.ts`     | 800-870        | Validation métier       |
| **IMPORT BDD**                       |                                     |                |                         |
| `importToDatabase()`                 | `services/import.orchestrator.ts`   | 875-1075       | Orchestrateur principal |
| `findOrCreateSupplier()`             | `services/import.orchestrator.ts`   | 1077-1125      | CRUD entité             |
| `findOrCreateKit()`                  | `services/import.orchestrator.ts`   | 1127-1148      | CRUD entité             |
| `findOrCreateCategory()`             | `services/import.orchestrator.ts`   | 1150-1226      | CRUD entité             |
| `autoLinkCategoryAttributes()`       | `services/import.orchestrator.ts`   | 1231-1292      | Logique métier import   |
| `resolveFamilyHierarchy()`           | `services/import.orchestrator.ts`   | 1294-1335      | Logique hiérarchie      |
| `findOrCreateFamily()`               | `services/import.orchestrator.ts`   | 1337-1375      | CRUD entité             |
| `upsertProduct()`                    | `services/import.orchestrator.ts`   | 1377-1532      | CRUD produit            |
| `upsertPricePurchase()`              | `services/import.orchestrator.ts`   | 1534-1640      | CRUD prix               |
| `importAttributes()`                 | `services/import.orchestrator.ts`   | 1642-1796      | Import attributs        |

---

## 🚀 Plan d'action étape par étape

### **Phase 1 : Créer les nouveaux fichiers et dossiers** ✅

#### Étape 0 : Créer la structure de dossiers

```bash
# Créer les dossiers services/ et repositories/
mkdir src/routes/importV2/services
mkdir src/routes/importV2/repositories
```

**Structure finale :**

```
importV2/
├── services/           # ✨ NOUVEAU - Logique métier
├── repositories/       # ✨ NOUVEAU - Accès données
└── (fichiers existants...)
```

---

#### Étape 1 : Créer `services/import.validation.ts`

```bash
# Copier depuis import-logic.ts :
- Lignes 12-59 : Types validation
- Lignes 111-162 : Utilitaires
- Lignes 167-255 : Parse CSV
- Lignes 260-474 : validateCSVData()
- Lignes 699-798 : validateRequiredAttributes()
- Lignes 800-870 : validateAttributes()
```

**Actions :**

1. Copier les types métier
2. Copier les utilitaires (convertToISODate, parseValueAndUnit, etc.)
3. Copier les fonctions de parsing et validation
4. Ajouter imports nécessaires (repository, prisma-meta)
5. Exporter toutes les fonctions publiques

**Taille estimée :** ~500 lignes

---

#### Étape 2 : Créer `repositories/import.repository.ts`

```bash
# Copier depuis import-logic.ts :
- Ligne 91-106 : Type AttributeMetadata
- Lignes 479-492 : loadAttributeReference()
- Lignes 494-536 : loadAttributeUnitsEnriched()
- Lignes 538-560 : loadAllowedValues()
- Lignes 570-602 : getCategoryTotalAttributeCount()
- Lignes 612-657 : loadCategoriesMetadata()
- Lignes 662-694 : loadRequiredAttributesByCategory()
```

**Actions :**

1. Copier toutes les fonctions de chargement référentiels
2. Ajouter imports Prisma
3. Exporter toutes les fonctions publiques
4. Documenter chaque fonction (JSDoc)

**Taille estimée :** ~400 lignes

---

#### Étape 3 : Créer `services/import.orchestrator.ts`

```bash
# Copier depuis import-logic.ts :
- Lignes 4-7 : Type PrismaTransaction
- Lignes 61-89 : Types ImportStats, ChangeDetail, ImportResult
- Lignes 875-1796 : Tout l'import BDD
```

**Actions :**

1. Copier type PrismaTransaction
2. Copier tous les types d'import (stats, changes, result)
3. Copier toutes les fonctions d'import BDD
4. Importer depuis repository (référentiels)
5. Importer depuis validation (types seulement)
6. Exporter importToDatabase() comme fonction principale

**Taille estimée :** ~600 lignes

---

#### Étape 4 : Refactoriser `+page.server.ts`

```bash
# Modifier imports :
- Remplacer import depuis import-logic.ts
- Importer depuis validation, orchestrator, repository
```

**Actions :**

1. Mettre à jour imports
2. Vérifier que actions (validate, process) fonctionnent
3. Vérifier que load() fonctionne
4. Supprimer code inutile si nécessaire

**Taille estimée :** ~200 lignes (déjà proche)

---

### **Phase 2 : Tester et valider** ✅

#### Test 1 : Validation CSV

```bash
# Tester action validate
- Upload CSV valide → doit retourner validation.success = true
- Upload CSV invalide → doit retourner erreurs détaillées
```

#### Test 2 : Import BDD

```bash
# Tester action process
- Import produits simples → vérifier stats
- Import avec attributs → vérifier category_attribute et kit_attribute
- Import avec erreurs → vérifier rollback transaction
```

#### Test 3 : Performance

```bash
# Vérifier qu'aucune régression
- Import 100 produits → comparer temps avant/après
- Vérifier logs Prisma (nombre de requêtes)
```

---

### **Phase 3 : Nettoyage** ✅

#### Étape finale : Supprimer `import-logic.ts`

```bash
# Une fois que tout fonctionne :
1. Vérifier qu'aucun import ne pointe vers import-logic.ts
2. Renommer import-logic.ts → import-logic.ts.OLD (backup)
3. Attendre 1 semaine sans bug
4. Supprimer définitivement import-logic.ts.OLD
```

---

## 📊 Métriques de succès

### Avant refactorisation

```
import-logic.ts : 1797 lignes (fichier monolithique)
+page.server.ts : 213 lignes
Total : 2010 lignes
```

### Après refactorisation

```
+page.server.ts                      : ~200 lignes (Présentation)
services/import.validation.ts        : ~500 lignes (Métier - Validation)
services/import.orchestrator.ts      : ~600 lignes (Métier - Transactions)
repositories/import.repository.ts    : ~400 lignes (Données)
Total : ~1700 lignes (répartis sur 2 dossiers)
```

**Réduction :** ~300 lignes (suppression duplications, simplification)

---

## 🎯 Avantages de l'architecture en couches

### **1. Maintenabilité** ✅

- Chaque fichier a une responsabilité unique
- Plus facile de trouver où modifier le code
- Réduction complexité cognitive

### **2. Testabilité** ✅

```typescript
// Tester validation sans BDD
const result = await validateCSVData(mockData, mockConfig);

// Tester repository avec mock Prisma
const categories = await loadCategoriesMetadata(['CAT001']);

// Tester orchestrator avec mock repository
const importResult = await importToDatabase(mockData, mockAttrs);
```

### **3. Réutilisabilité** ✅

```typescript
// Réutiliser validation dans d'autres imports
import { validateCSVData } from './import.validation';

// Réutiliser repository pour autres pages
import { getCategoryTotalAttributeCount } from './import.repository';
```

### **4. Scalabilité** ✅

- Ajouter nouveau format CSV → modifier uniquement validation.ts
- Ajouter nouvelle entité → modifier uniquement orchestrator.ts
- Changer BDD → modifier uniquement repository.ts

---

## 📚 Références architecture

### **Patterns appliqués**

1. **Layered Architecture** (3 couches : Présentation / Métier / Données)
2. **Repository Pattern** (abstraction accès données)
3. **Service Pattern** (orchestrator = service métier)
4. **Dependency Injection** (via imports ES6)

### **Principes respectés**

- **Separation of Concerns** (SoC)
- **Single Responsibility Principle** (SRP)
- **Don't Repeat Yourself** (DRY)
- **Keep It Simple, Stupid** (KISS)

---

## ✅ Checklist finale

- [ ] Dossiers `services/` et `repositories/` créés
- [ ] `services/import.validation.ts` créé et testé
- [ ] `repositories/import.repository.ts` créé et testé
- [ ] `services/import.orchestrator.ts` créé et testé
- [ ] `+page.server.ts` refactorisé (imports mis à jour)
- [ ] Tests validation passent
- [ ] Tests import BDD passent
- [ ] Performance identique ou meilleure
- [ ] Aucun import vers `import-logic.ts`
- [ ] Documentation mise à jour
- [ ] `import-logic.ts` supprimé

---

**Date de finalisation prévue :** [À compléter après implémentation]
