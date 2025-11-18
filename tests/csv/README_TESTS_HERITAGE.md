# Tests de Validation - Héritage Attributs Obligatoires

## 📋 Contexte

Test de la validation des attributs obligatoires **hérités** via la hiérarchie `fk_parent`.

### Hiérarchie Testée

```
cat_id 17 "pompe à vide" (CAT0000017)
    → 1 attribut obligatoire: DEBIT (Débit)
    ↓ fk_parent = 17
cat_id 65 "pompe à spirale" (CAT0000018)
    → 0 attribut obligatoire direct
    → HÉRITE de DEBIT obligatoire du parent
```

**Logique métier :**

- cat_id 65 a 0 attribut obligatoire direct
- MAIS hérite de DEBIT obligatoire du parent (cat_id 17)
- Donc un CSV pour CAT0000018 DOIT contenir la colonne DEBIT

---

## 🧪 Fichiers de Test

### 1. `test_heritage_VALIDE.csv`

**Catégorie :** CAT0000018 (pompe à spirale)

**Contenu :** CSV avec colonne `DEBIT: 100`

**Résultat attendu :** ✅ Validation PASSE

**Raison :** Contient l'attribut obligatoire hérité du parent

---

### 2. `test_heritage_INVALIDE.csv`

**Catégorie :** CAT0000018 (pompe à spirale)

**Contenu :** CSV SANS colonne `DEBIT`

**Résultat attendu :** ❌ Validation ÉCHOUE

**Message d'erreur attendu :**

```
❌ Ligne 2 : Catégorie "pompe à spirale" (CAT0000018) requiert 1 attribut(s) manquant(s):
Débit (hérité de "pompe à vide")
```

---

## 🚀 Comment Tester

### Via Interface Web

1. Aller sur `/importV2`

2. **Test VALIDE :**
   - Étape 1 : Uploader `test_heritage_VALIDE.csv`
   - Étape 2 : Cliquer "Valider"
   - **Vérifier** : ✅ Validation passe, 1 produit valide

3. **Test INVALIDE :**
   - Étape 1 : Uploader `test_heritage_INVALIDE.csv`
   - Étape 2 : Cliquer "Valider"
   - **Vérifier** : ❌ Message d'erreur avec **"hérité de 'pompe à vide'"**

### Via SQL (vérifier données BDD)

```sql
-- Vérifier hiérarchie
SELECT cat_id, cat_code, cat_label, fk_parent
FROM produit.category
WHERE cat_id IN (17, 65);

-- Vérifier attribut obligatoire parent (cat_id 17)
SELECT
  a.atr_value,
  a.atr_label,
  ca.cat_atr_required
FROM produit.category_attribute ca
JOIN public.attribute a ON a.atr_id = ca.fk_attribute
WHERE ca.fk_category = 17 AND ca.cat_atr_required = true;

-- Vérifier attributs obligatoires enfant (cat_id 65) - devrait être vide
SELECT COUNT(*) as nb_direct_required
FROM produit.category_attribute
WHERE fk_category = 65 AND cat_atr_required = true;
```

**Résultats attendus :**

- Parent (cat_id 17) : 1 attribut obligatoire (DEBIT)
- Enfant (cat_id 65) : 0 attributs obligatoires directs
- Enfant hérite donc de DEBIT

---

## ✅ Checklist Tests

- [ ] Test 1 : CSV VALIDE (avec DEBIT) passe la validation
- [ ] Test 2 : CSV INVALIDE (sans DEBIT) échoue la validation
- [ ] Test 3 : Message d'erreur indique **"hérité de 'pompe à vide'"**
- [ ] Test 4 : Validation fonctionne pour attributs hérités
- [ ] Test 5 : Pas de régression sur attributs directs

---

## 📊 Données de Test

### Produit Test VALIDE

```
pro_cenov_id: TEST_HERITAGE_001
pro_code: HER001
cat_code: CAT0000018 (pompe à spirale)
DEBIT: 100 ← ✅ PRÉSENT (hérité de parent)
Attributs obligatoires directs: 0
Attributs obligatoires hérités: 1 (DEBIT)
```

**Résultat :** ✅ Validation passe car attribut hérité satisfait

---

### Produit Test INVALIDE

```
pro_cenov_id: TEST_HERITAGE_002
pro_code: HER002
cat_code: CAT0000018 (pompe à spirale)
DEBIT: ← ❌ MANQUANT
Attributs obligatoires directs: 0
Attributs obligatoires hérités: 1 (DEBIT)
```

**Résultat :** ❌ Validation échoue car attribut hérité manquant

**Message attendu :**

```
Débit (hérité de "pompe à vide")
```

---

## 🎯 Différence avec README_TESTS_VALIDATION.md

| Aspect                      | VALIDATION (direct)            | HERITAGE (hérité)                  |
| --------------------------- | ------------------------------ | ---------------------------------- |
| **Catégorie test INVALIDE** | CAT0000129 (18 attr directs)   | CAT0000018 (0 direct, 1 hérité)    |
| **Type d'attribut**         | Attributs obligatoires directs | Attributs obligatoires **hérités** |
| **Message d'erreur**        | Liste attributs                | Indique **"hérité de..."**         |
| **Objectif**                | Validation basique             | Validation avec héritage           |
