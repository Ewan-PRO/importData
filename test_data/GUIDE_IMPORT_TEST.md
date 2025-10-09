# 📋 Guide Import Test Vue via Interface Web

**Objectif:** Tester que l'import via l'interface `/import` met à jour automatiquement la vue `v_produit_categorie_attribut`

**Base de données:** CENOV_DEV

---

## 🎯 Résultat Attendu

Après l'import des 6 fichiers CSV, la vue `v_produit_categorie_attribut` devrait contenir **10 lignes** :

- **PUMP001-Test** : Lié à CAT001-Test → 3 attributs (PWR, FLOW, PRESS) = **3 lignes**
- **PUMP002-Test** : Lié à CAT001-Test + CAT002-Test → 3 + 2 attributs = **5 lignes**
- **PUMP003-Test** : Lié à CAT002-Test → 2 attributs (PWR, FLOW) = **2 lignes**

**Total attendu : 10 lignes**

---

## 📂 Fichiers CSV Créés

| Fichier | Table Cible | Dépendances | Ordre |
|---------|-------------|-------------|-------|
| `1_attribute-Test.csv` | `public.attribute` | Aucune | **1** |
| `2_kit-Test.csv` | `public.kit` | Aucune | **2** |
| `3_category-Test.csv` | `produit.category` | Aucune | **3** |
| `4_category_attribute-Test.csv` | `produit.category_attribute` | category + attribute | **4** |
| `5_product-Test.csv` | `produit.product` | kit | **5** |
| `6_product_category-Test.csv` | `produit.product_category` | product + category | **6** |

---

## 🚀 Procédure d'Import Étape par Étape

### ⚠️ LIMITATION ACTUELLE DE L'INTERFACE

**Problème:** Les fichiers CSV **4, 5 et 6** utilisent des **références textuelles** (ex: `kit_label`, `cat_code`) au lieu des **IDs numériques** requis par la base de données.

**Exemple problématique dans `5_product-Test.csv`:**
```csv
pro_code,kit_label,pro_cenov_id
PUMP001-Test,Pompe Centrifuge Électrique-Test,CEN001-Test
```

**Ce que la base attend:**
```csv
pro_code,fk_kit,pro_cenov_id
PUMP001-Test,68,CEN001-Test  # 68 = ID du kit créé à l'étape 2
```

### 🔧 Solutions Possibles

#### **Option A: Import Partiel (1-2-3 uniquement)**

✅ **Import possible SANS modification:**

1. **Étape 1:** Importer `1_attribute-Test.csv`
   - Table: `cenov_dev:attribute`
   - Mapping: auto-détecté

2. **Étape 2:** Importer `2_kit-Test.csv`
   - Table: `cenov_dev:kit`
   - Mapping: auto-détecté

3. **Étape 3:** Importer `3_category-Test.csv`
   - Table: `cenov_dev:category`
   - Mapping: `cat_code`, `cat_label`, `fk_parent` (laisser vide), `cat_wp_name`

**Résultat:** Tables de base créées, mais pas de produits ni liens → **Vue vide** (0 lignes)

---

#### **Option B: Modification CSV avec IDs (RECOMMANDÉ)**

✅ **Import complet possible APRÈS récupération IDs:**

**1. Importer fichiers 1-2-3 (comme Option A)**

**2. Récupérer les IDs via Prisma Studio ou SQL:**

```sql
-- Récupérer IDs des attributs
SELECT atr_id, atr_code FROM public.attribute WHERE atr_code LIKE '%-Test';
-- Résultat: PWR-Test=375, FLOW-Test=376, PRESS-Test=377 (exemple)

-- Récupérer IDs des kits
SELECT kit_id, kit_label FROM public.kit WHERE kit_label LIKE '%-Test';
-- Résultat: Pompe Centrifuge Électrique-Test=68, Pompe Immergée-Test=69, ...

-- Récupérer IDs des catégories
SELECT cat_id, cat_code FROM produit.category WHERE cat_code LIKE '%-Test';
-- Résultat: CAT001-Test=223, CAT002-Test=224 (exemple)
```

**3. Modifier les CSV avec les IDs réels:**

**Fichier: `4_category_attribute-Test-IDs.csv`**
```csv
fk_category,fk_attribute,cat_atr_required
223,375,true
223,376,true
223,377,false
224,375,true
224,376,false
```

**Fichier: `5_product-Test-IDs.csv`**
```csv
pro_code,fk_kit,pro_cenov_id
PUMP001-Test,68,CEN001-Test
PUMP002-Test,68,CEN002-Test
PUMP003-Test,69,CEN003-Test
```

**Fichier: `6_product_category-Test-IDs.csv`**
```csv
fk_product,fk_category
<ID_PUMP001>,223
<ID_PUMP002>,223
<ID_PUMP002>,224
<ID_PUMP003>,224
```

⚠️ **Note:** Pour le fichier 6, vous devrez récupérer les IDs des produits après l'import du fichier 5.

**4. Importer fichiers modifiés 4-5-6**

**5. Vérifier la vue:**

```sql
SELECT COUNT(*) FROM produit.v_produit_categorie_attribut
WHERE pro_id IN (
  SELECT pro_id FROM produit.product WHERE pro_code LIKE 'PUMP%-Test'
);
-- Résultat attendu: 10 lignes
```

---

#### **Option C: Utiliser Script SQL Direct (PLUS RAPIDE)**

✅ **Import via `test_vue_SAFE_v2.sql` déjà testé et validé**

Si vous voulez juste **vérifier que la vue se met à jour**, utilisez directement le script SQL :

```bash
# Exécuter script SQL (déjà testé, fonctionne)
psql -d CENOV_DEV -f test_data/test_vue_SAFE_v2.sql

# Vérifier la vue
psql -d CENOV_DEV -c "SELECT COUNT(*) FROM produit.v_produit_categorie_attribut WHERE pro_id IN (SELECT pro_id FROM produit.product WHERE pro_code LIKE '%-Test')"

# Nettoyer
psql -d CENOV_DEV -f test_data/cleanup_test_data_v2.sql
```

---

## 🔍 Vérification Résultats

### Via SQL (après import complet)

```sql
-- Compter lignes dans la vue
SELECT COUNT(*) AS total_lignes_test
FROM produit.v_produit_categorie_attribut
WHERE pro_id IN (
  SELECT pro_id FROM produit.product WHERE pro_code LIKE '%-Test'
);
-- Attendu: 10

-- Détail par produit
SELECT
  pro_id,
  kit_label,
  atr_label,
  cat_label
FROM produit.v_produit_categorie_attribut
WHERE pro_id IN (
  SELECT pro_id FROM produit.product WHERE pro_code LIKE '%-Test'
)
ORDER BY pro_id, atr_id;
-- Attendu: 10 lignes détaillées
```

### Via Interface `/import` (après étape 3)

✅ **Validation** affiche:
- **Lignes totales:** 3 (pour chaque fichier)
- **Lignes valides:** 3
- **Doublons:** 0
- **Erreurs:** 0

✅ **Import réussi** affiche:
- "3 lignes ont été importées dans la table : attribute"

---

## 🎓 Conclusion

### ✅ Ce qui fonctionne ACTUELLEMENT

1. **Import simple** (fichiers 1-2-3) → **Tables créées**
2. **Vue automatiquement vide** car pas de produits

### ⚠️ Ce qui nécessite MODIFICATION

3. **Import avec FK** (fichiers 4-5-6) → **Nécessite IDs réels** au lieu de labels

### 🎯 Recommandation

**Pour tester rapidement que la vue se met à jour:**

👉 **Utilisez Option C** (script SQL direct `test_vue_SAFE_v2.sql`)

**Pour tester l'interface complète:**

👉 **Utilisez Option B** (modifier CSV avec IDs après étapes 1-2-3)

---

## 🔮 Amélioration Future

Pour simplifier l'import via interface, il faudrait implémenter un **lookup automatique** dans le code serveur :

```typescript
// Dans formatValueForDatabase()
if (fieldName === 'fk_kit' && typeof value === 'string') {
  // Si l'utilisateur fournit un label au lieu d'un ID
  const kit = await findRecord('cenov_dev', 'kit', { kit_label: value });
  return kit ? kit.kit_id : null;
}
```

**Complexité:** Moyenne (nécessite modification `+page.server.ts`)
**Valeur:** Haute (simplifie drastiquement UX import)

---

**Fichiers créés:**
- ✅ `1_attribute-Test.csv` (prêt)
- ✅ `2_kit-Test.csv` (prêt)
- ✅ `3_category-Test.csv` (prêt)
- ⚠️ `4_category_attribute-Test.csv` (nécessite IDs)
- ⚠️ `5_product-Test.csv` (nécessite IDs)
- ⚠️ `6_product_category-Test.csv` (nécessite IDs)
