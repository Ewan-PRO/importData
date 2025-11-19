# ImportV2 - Documentation Technique

## 📋 Vue d'ensemble

Module d'import CSV pour produits avec validation complète, gestion des attributs, et intégration bases de données (cenov_dev / cenov_preprod).

## 🏗️ Architecture en Couches

```
┌─────────────────────────────────────────────────────────────┐
│                    🎨 PRÉSENTATION                          │
│              +page.svelte, +page.server.ts                  │
│  (Interface utilisateur, Actions SvelteKit)                 │
└─────────────────────────┬───────────────────────────────────┘
                          │
          ┌───────────────┴────────────────┐
          │                                │
┌─────────▼──────────────┐    ┌───────────▼────────────────┐
│   💼 MÉTIER            │    │   💼 MÉTIER                │
│ import.validation.ts   │    │ import.orchestrator.ts     │
│ (Validation CSV)       │    │ (Transactions BDD)         │
└─────────┬──────────────┘    └───────────┬────────────────┘
          │                                │
          └───────────────┬────────────────┘
                          │
              ┌───────────▼────────────────┐
              │   🗄️ DONNÉES               │
              │  import.repository.ts      │
              │  (Accès base de données)   │
              └────────────────────────────┘
```

## 📁 Structure des Fichiers

```
importV2/
├── +page.svelte                    # Interface utilisateur (UI)
├── +page.server.ts                 # Actions SvelteKit (validate, process, load)
├── +server.ts                      # API génération template CSV
│
├── services/                       # 💼 COUCHE MÉTIER
│   ├── import.validation.ts        # Validation CSV + Attributs
│   └── import.orchestrator.ts      # Transactions BDD + Import
│
└── repositories/                   # 🗄️ COUCHE DONNÉES
    └── import.repository.ts        # Accès BDD (lecture seule)
```

## 🎯 Responsabilités des Fichiers

### 🎨 Présentation

#### `+page.svelte` (Interface utilisateur)
- Upload fichier CSV
- Sélection base de données (dev/preprod)
- Sélection catégorie
- Téléchargement template CSV
- Affichage résultats validation/import

#### `+page.server.ts` (Actions SvelteKit)
- **Action `validate`** : Valide fichier CSV uploadé
- **Action `process`** : Importe données en base de données
- **Load function** : Charge liste catégories (dev + preprod)

#### `+server.ts` (API Template)
- **GET** : Génère template CSV avec en-têtes pour catégorie sélectionnée
- Inclut attributs hérités de la hiérarchie de catégories
- Nom fichier : `template_{database}_{categorie}.csv`

### 💼 Métier - Validation

#### `services/import.validation.ts`
**Responsabilité** : Parse et valide données CSV selon règles métier

**Fonctions principales** :
- `parseCSVContent()` - Parse CSV et extrait attributs dynamiques
- `validateCSVData()` - Valide structure et champs obligatoires
- `validateRequiredAttributes()` - Vérifie attributs obligatoires par catégorie
- `validateAttributes()` - Valide valeurs, unités, listes fermées

**Exports** :
```typescript
// Types
CSVRow, AttributePair, ProductAttributes, ParsedCSVData,
ValidationError, ValidationResult

// Fonctions
parseCSVContent(), validateCSVData(),
validateRequiredAttributes(), validateAttributes(),
parseValueAndUnit(), findUnitId()
```

### 💼 Métier - Orchestration

#### `services/import.orchestrator.ts`
**Responsabilité** : Orchestre import complet en base de données (transaction)

**Fonction principale** :
- `importToDatabase()` - Transaction principale d'import

**Fonctions internes** :
- `findOrCreateSupplier()` - Gestion fournisseurs
- `findOrCreateKit()` - Gestion kits
- `findOrCreateCategory()` - Gestion catégories + auto-link attributs
- `autoLinkCategoryAttributes()` - Liaison automatique attributs catégorie
- `resolveFamilyHierarchy()` - Résolution hiérarchie famille/sous-famille
- `findOrCreateFamily()` - Gestion familles
- `upsertProduct()` - Création/mise à jour produits
- `upsertPricePurchase()` - Gestion prix d'achat
- `importAttributes()` - Import attributs produits

**Exports** :
```typescript
// Types
ImportStats, ChangeDetail, ImportResult

// Fonction
importToDatabase()
```

### 🗄️ Données

#### `repositories/import.repository.ts`
**Responsabilité** : Accès base de données (lecture seule)

**Fonctions principales** :
- `loadAttributeReference()` - Charge tous les attributs (Map)
- `loadAttributeUnitsEnriched()` - Charge unités par attribut
- `loadAllowedValues()` - Charge valeurs autorisées (listes fermées)
- `getCategoryRequiredAttributesWithInheritance()` - Attributs obligatoires (avec héritage)
- `loadCategoriesMetadata()` - Métadonnées catégories + détection doublons
- `getCategoryTotalAttributeCount()` - Compte attributs total (directs + hérités)

**Exports** :
```typescript
// Type
AttributeMetadata

// Fonctions
loadAttributeReference(), loadAttributeUnitsEnriched(),
loadAllowedValues(), getCategoryRequiredAttributesWithInheritance(),
loadCategoriesMetadata(), getCategoryTotalAttributeCount()
```

## 🔄 Flux de Données

### 1. Téléchargement Template
```
+page.svelte → +server.ts (GET)
                 ↓
         getCategoryRequiredAttributesWithInheritance()
                 ↓
         Génération CSV avec en-têtes
```

### 2. Validation CSV
```
+page.svelte (upload) → +page.server.ts (action validate)
                              ↓
                    import.validation.ts
                     ├─ parseCSVContent()
                     ├─ validateCSVData()
                     ├─ validateRequiredAttributes()
                     └─ validateAttributes()
                              ↓
                    import.repository.ts
                     ├─ loadAttributeReference()
                     ├─ loadCategoriesMetadata()
                     └─ getCategoryRequiredAttributesWithInheritance()
```

### 3. Import BDD
```
+page.svelte → +page.server.ts (action process)
                     ↓
           import.orchestrator.ts
            └─ importToDatabase() [TRANSACTION]
                ├─ findOrCreateSupplier()
                ├─ findOrCreateKit()
                ├─ findOrCreateCategory()
                ├─ autoLinkCategoryAttributes()
                ├─ resolveFamilyHierarchy()
                ├─ findOrCreateFamily()
                ├─ upsertProduct()
                ├─ upsertPricePurchase()
                └─ importAttributes()
                     ↓
           import.repository.ts
            ├─ loadAttributeReference()
            ├─ loadAttributeUnitsEnriched()
            └─ loadAllowedValues()
```

## 🎨 Règles de Dépendances

```
Présentation → Métier → Données
     ✅           ✅        ❌
```

**Autorisé** :
- ✅ Présentation peut importer Métier et Données
- ✅ Métier peut importer Données
- ✅ Métier peut importer types depuis autre service

**Interdit** :
- ❌ Données NE PEUT PAS importer Métier
- ❌ Pas de dépendances circulaires
- ❌ Présentation ne doit pas contenir logique métier complexe

## 🔑 Concepts Clés

### Héritage Attributs Catégories
Les catégories héritent des attributs de leurs parents via `fk_parent`.

**Exemple** : Catégorie "Pompe électrique" hérite de "Pompe" qui hérite de "Équipement"
```
Équipement (PUISSANCE, TENSION)
    ↓
Pompe (DEBIT_MAX) → Hérite PUISSANCE, TENSION
    ↓
Pompe électrique (VITESSE) → Hérite PUISSANCE, TENSION, DEBIT_MAX
```

### Auto-Link Attributs
Lors de la création d'une catégorie, tous les attributs du CSV sont automatiquement liés via `autoLinkCategoryAttributes()`.

### Validation à Trois Niveaux
1. **Structure CSV** : Champs obligatoires, format dates/nombres
2. **Attributs obligatoires** : Vérification présence (avec héritage)
3. **Valeurs attributs** : Unités, listes fermées, types de données

### Gestion Changements
L'import détecte et logue tous les changements :
- Création/modification fournisseurs, kits, catégories, familles
- Création/mise à jour produits et prix
- Ajout/modification/suppression attributs

## 📊 Types de Données Principaux

### Validation
```typescript
interface CSVRow {
  pro_cenov_id: string;      // ID produit
  pro_code: string;          // Code produit
  sup_code: string;          // Code fournisseur
  cat_code: string;          // Code catégorie
  kit_label: string;         // Nom kit
  famille?: string;          // Famille
  sous_famille?: string;     // Sous-famille
  sous_sous_famille?: string; // Sous-sous-famille
  pp_amount: string;         // Prix
  pp_date: string;           // Date prix
  // + attributs dynamiques
}

interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: string[];
}
```

### Import
```typescript
interface ImportResult {
  success: boolean;
  stats: ImportStats;         // Compteurs (created, updated, deleted)
  changes: ChangeDetail[];    // Détail changements
  error?: string;
}
```

## 🚀 Utilisation

### Ajouter une Nouvelle Validation
**Fichier** : `services/import.validation.ts`

```typescript
// Dans validateCSVData()
if (nouvelleCritere) {
  errors.push({
    line: i + 2,
    field: 'champ',
    value: row.champ,
    error: 'Message erreur'
  });
}
```

### Ajouter un Nouveau Champ Métier
1. Modifier interface `CSVRow` dans `services/import.validation.ts`
2. Ajouter validation dans `validateCSVData()`
3. Ajouter logique import dans `services/import.orchestrator.ts`

### Ajouter une Nouvelle Fonction Repository
**Fichier** : `repositories/import.repository.ts`

```typescript
export async function loadNewData(
  database: 'cenov_dev' | 'cenov_preprod' = 'cenov_dev'
): Promise<Map<string, DataType>> {
  const prisma = await getClient(database) as unknown as CenovDevPrismaClient;
  // Requête Prisma...
  return map;
}
```

## 🔍 Debugging

### Logs Importants
```typescript
// Validation
console.log('📊 Données parsées:', data.length, 'lignes');
console.log('⚠️ Erreurs validation:', errors.length);

// Import
console.log('🔄 Import démarré:', data.length, 'produits');
console.log('✅ Import terminé:', stats);
console.log('📝 Changements:', changes.length);
```

### Erreurs Courantes
- **"Catégorie XXX introuvable"** → Vérifier `cat_code` existe en BDD
- **"Attribut YYY obligatoire manquant"** → Vérifier héritage catégorie
- **"Valeur non autorisée"** → Vérifier liste fermée dans `attribute_value`
- **"Transaction timeout"** → Réduire taille batch ou augmenter timeout

## 📝 Notes Techniques

### Performance
- **Load catégories** : 2 requêtes batch au lieu de N×M (optimisé)
- **Validation attributs** : Chargement référentiels en amont (Maps)
- **Import** : Transaction unique avec timeout 60s

### Bases de Données
- **cenov_dev** : Développement/tests
- **cenov_preprod** : Pré-production

Les deux bases partagent le même schéma mais sont isolées.

### Gestion Erreurs
- Validation : Accumule toutes les erreurs avant retour
- Import : Transaction rollback automatique en cas d'erreur
- Logs détaillés à chaque étape

## 📚 Références

- **Prisma Meta** : `src/lib/prisma-meta.ts` - Utilitaires accès BDD
- **Schémas Zod** : `src/lib/schemas/dbSchema.ts` - Validation formulaires
- **Types Prisma** : `prisma/cenov_dev/generated/` - Types générés

---

**Dernière mise à jour** : 2025-01-19
**Architecture** : Layered Architecture (Présentation / Métier / Données)
**Statut** : ✅ Production-ready
