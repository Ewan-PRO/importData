# Tests de Validation - Attributs Obligatoires

## 📋 Contexte

Test de la validation des attributs obligatoires pour les catégories de produits.

### Catégories Testées

**CAT0000127 - "pompes à palettes" (cat_id 52)**

- 0 attribut obligatoire
- Utilisé pour le test VALIDE (validation devrait passer)

**CAT0000129 - "pompes à palettes sèches" (cat_id 92)**

- 18 attributs obligatoires dont :
  - Type d'alimentation
  - Tension nominale 50Hz
  - Poids
  - Courant nominal
  - Niveau de bruit 50Hz
  - Indice énergétique
  - Filtre à air intégré
  - Valve de régulation
  - Vide limite
  - Puissance utile nominale
  - Débit volumique nominal
  - ... et 7 autres
- Utilisé pour le test INVALIDE (validation devrait échouer)

---

## 🧪 Fichiers de Test

### 1. `test_surpresseurs_VALIDE.csv`

**Catégorie :** CAT0000127 (pompes à palettes)

**Contenu :** CSV avec `TYPE_ALIMENTATION: Triphasé`

**Résultat attendu :** ✅ Validation PASSE

**Raison :** Catégorie sans attributs obligatoires, validation passe

---

### 2. `test_surpresseurs_INVALIDE.csv`

**Catégorie :** CAT0000129 (pompes à palettes sèches)

**Contenu :** CSV SANS aucun attribut obligatoire (manque 18 attributs)

**Résultat attendu :** ❌ Validation ÉCHOUE

**Message d'erreur attendu :**

```
❌ Ligne 2 : Catégorie "pompes à palettes sèches" (CAT0000129) requiert 18 attribut(s) manquant(s):
Vide limite, Tension nominale 50Hz, Le débit volumique nominal à 50 Hz.,
Tension nominale courant continu, Courant nominal, Type d'alimentation,
Indice énergétique, Filtre à air intégré, Valve de régulation de vide intégré,
Niveau de bruit 50Hz, Le débit volumique nominal à 60 Hz.,
Puissance utile nominale 60Hz, Poids, Tension nominale 60Hz,
Puissance utile nominale 60Hz (2), Puissance utile nominale 60Hz (3),
Puissance utile nominale 60Hz (4), Puissance utile nominale
```

---

## 🚀 Comment Tester

### Via Interface Web

1. Aller sur `/importV2`

2. **Test VALIDE :**
   - Étape 1 : Uploader `test_surpresseurs_VALIDE.csv`
   - Étape 2 : Cliquer "Valider"
   - **Vérifier** : ✅ Validation passe, 1 produit valide

3. **Test INVALIDE :**
   - Étape 1 : Uploader `test_surpresseurs_INVALIDE.csv`
   - Étape 2 : Cliquer "Valider"
   - **Vérifier** : ❌ Message d'erreur liste 18 attributs manquants

### Via SQL (vérifier données BDD)

```sql
-- Vérifier catégories de test
SELECT cat_id, cat_code, cat_label, fk_parent
FROM produit.category
WHERE cat_code IN ('CAT0000127', 'CAT0000129');

-- Vérifier attributs obligatoires CAT0000127 (devrait être vide)
SELECT COUNT(*) as nb_required
FROM produit.category_attribute
WHERE fk_category = 52 AND cat_atr_required = true;

-- Vérifier attributs obligatoires CAT0000129 (devrait être 18)
SELECT
  a.atr_label,
  ca.cat_atr_required
FROM produit.category_attribute ca
JOIN public.attribute a ON a.atr_id = ca.fk_attribute
WHERE ca.fk_category = 92 AND ca.cat_atr_required = true;
```

---

## ✅ Checklist Tests

- [ ] Test 1 : CSV VALIDE (CAT0000127) passe la validation
- [ ] Test 2 : CSV INVALIDE (CAT0000129) échoue la validation
- [ ] Test 3 : Message d'erreur liste tous les 18 attributs manquants
- [ ] Test 4 : Message d'erreur affiche "pompes à palettes sèches" (CAT0000129)
- [ ] Test 5 : Validation des attributs obligatoires fonctionne correctement

---

## 📊 Données de Test

### Produit Test VALIDE

```
pro_cenov_id: TEST_SURPRESSEUR_001
pro_code: SUP001
cat_code: CAT0000127 (pompes à palettes)
TYPE_ALIMENTATION: Triphasé ← ✅ PRÉSENT (mais pas obligatoire pour CAT0000127)
Attributs obligatoires: 0
```

**Résultat :** ✅ Validation passe car aucun attribut n'est obligatoire

---

### Produit Test INVALIDE

```
pro_cenov_id: TEST_SURPRESSEUR_002
pro_code: SUP002
cat_code: CAT0000129 (pompes à palettes sèches)
Attributs obligatoires: 18
Attributs fournis: 0
```

**Résultat :** ❌ Validation échoue car manque tous les 18 attributs obligatoires

**Attributs manquants :**

- TYPE_ALIMENTATION
- TENSION_NOMINALE (50Hz et 60Hz)
- POIDS
- COURANT_NOMINAL
- NIVEAU_BRUIT
- INDICE_ENERGETIQUE
- FILTRE_AIR_INTEGRE
- VALVE_REGULATION
- PRESSION_LIMITE (Vide limite)
- DEBIT_VOL_NOMINALE (50Hz et 60Hz)
- PUISSANCE_UTILE_NOMINALE
- PUISSANCE_NOMINALE_60 (plusieurs variantes)
- TENSION_NOMINALE_CONTINU
