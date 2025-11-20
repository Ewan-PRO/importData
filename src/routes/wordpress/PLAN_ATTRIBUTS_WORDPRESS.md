# Plan Logique : Export Attributs WordPress

## ✅ Ce qui est déjà fait

- Schéma BDD modifié : `kat_visible` et `kat_global` ajoutés à `kit_attribute`
- Migration appliquée : nouveaux champs disponibles dans la base

## 🎯 Objectif

Ajouter les attributs dans le CSV WordPress lors du clic sur "Télécharger CSV", **sans interface frontend**.

---

## 📊 Logique Métier : Flux de Données

### 1. Point de Départ : Produit

**Table : `produit.product`**

```
pro_id = 3
pro_cenov_id = "PROG052386-SUP0000005"
fk_kit = 175  ← CLEF pour trouver les attributs
```

### 2. Récupérer les Attributs du Kit

**Table : `public.kit_attribute`**

**Requête logique :**

> "Trouve tous les attributs du kit 175"

**Condition :** `WHERE fk_kit = 175`

**Résultat (exemple) :**

```
kat_id=500 | fk_kit=175 | fk_attribute_characteristic=30  | kat_value="4"   | kat_visible=true | kat_global=true
kat_id=501 | fk_kit=175 | fk_attribute_characteristic=358 | kat_value="230" | kat_visible=true | kat_global=true
kat_id=502 | fk_kit=175 | fk_attribute_characteristic=365 | kat_value="166" | kat_visible=false | kat_global=true
```

**Ce qu'on récupère ici :**

- ✅ `kat_value` (valeur de l'attribut : "4", "230", "166")
- ✅ `kat_visible` (true/false → 1/0 dans CSV)
- ✅ `kat_global` (true/false → 1/0 dans CSV)
- ❓ `fk_attribute_characteristic` (ID qui pointe vers la table `attribute`)

### 3. Récupérer le Nom de l'Attribut

**Table : `public.attribute`**

**Requête logique :**

> "Pour chaque `fk_attribute_characteristic`, trouve le nom de l'attribut"

**Condition :** `WHERE atr_id = fk_attribute_characteristic`

**IMPORTANT :** Utiliser `atr_value` (PAS `atr_label`) selon ta demande

**Résultat (exemple) :**

```
atr_id=30  | atr_value="POIDS"          | atr_label="Poids"
atr_id=358 | atr_value="TENSION_60HZ"   | atr_label="Tension nominale 60Hz"
atr_id=365 | atr_value="LARGEUR"        | atr_label="Largeur"
```

**Ce qu'on récupère ici :**

- ✅ `atr_value` (nom technique de l'attribut : "POIDS", "TENSION_60HZ", "LARGEUR")

---

## 🔗 Schéma de Jointure Complet

### Flux Logique

```
PRODUIT (pro_id=3, fk_kit=175)
   ↓
   └── KIT_ATTRIBUTE (WHERE fk_kit=175)
         ↓
         ├── kat_value = "4"
         ├── kat_visible = true
         ├── kat_global = true
         └── fk_attribute_characteristic = 30
               ↓
               └── ATTRIBUTE (WHERE atr_id=30)
                     └── atr_value = "POIDS"
```

**Jointure logique :**

1. `product.fk_kit` → `kit_attribute.fk_kit` (trouver les attributs du kit)
2. `kit_attribute.fk_attribute_characteristic` → `attribute.atr_id` (trouver le nom de l'attribut)

---

## 📋 Format CSV WordPress Attendu

### Structure Finale par Produit

**Pour le produit 3 (3 attributs) :**

| Nom attribut 1 | Valeur attribut 1 | Visible 1 | Global 1 | Nom attribut 2 | Valeur attribut 2 | Visible 2 | Global 2 | Nom attribut 3 | Valeur attribut 3 | Visible 3 | Global 3 |
| -------------- | ----------------- | --------- | -------- | -------------- | ----------------- | --------- | -------- | -------------- | ----------------- | --------- | -------- |
| POIDS          | 4                 | 1         | 1        | TENSION_60HZ   | 230               | 1         | 1        | LARGEUR        | 166               | 0         | 1        |

### Conversion Boolean → 0/1

**Logique :**

- `kat_visible = true` → `1`
- `kat_visible = false` → `0`
- `kat_global = true` → `1`
- `kat_global = false` → `0`

---

## 🔄 Logique de Génération CSV

### Étape 1 : Charger les Produits

**Pour chaque produit sélectionné (ou tous si aucun sélectionné) :**

1. Récupérer `pro_id`, `pro_cenov_id`, `fk_kit`, etc.
2. Si `fk_kit` est NULL → **produit sans attributs** → colonnes attributs vides

### Étape 2 : Charger les Attributs par Produit

**Pour chaque produit avec `fk_kit` non NULL :**

**Requête logique :**

```
Trouver dans kit_attribute :
  - WHERE fk_kit = product.fk_kit
  - JOINDRE attribute WHERE atr_id = fk_attribute_characteristic
  - RÉCUPÉRER : atr_value, kat_value, kat_visible, kat_global
```

**Structure de données intermédiaire :**

```javascript
Produit {
  pro_id: 3,
  pro_cenov_id: "PROG052386-SUP0000005",
  // ... autres champs produit

  attributs: [
    { nom: "POIDS",        valeur: "4",   visible: true,  global: true  },
    { nom: "TENSION_60HZ", valeur: "230", visible: true,  global: true  },
    { nom: "LARGEUR",      valeur: "166", visible: false, global: true  }
  ]
}
```

### Étape 3 : Calculer le Nombre Max d'Attributs

**Logique :**

> "Trouve le produit avec le plus grand nombre d'attributs"

**Exemple :**

- Produit 1 : 2 attributs
- Produit 2 : 5 attributs
- Produit 3 : 3 attributs

**Résultat :** `maxAttributs = 5`

**Pourquoi ?** Le CSV doit avoir le même nombre de colonnes pour tous les produits.

### Étape 4 : Générer les Headers CSV

**Colonnes fixes (déjà existantes) :**

```
Type, SKU, Name, Published, Visibility, Short description, Description,
Regular price, Image 1, Image 2, Image 3, Brand
```

**Colonnes dynamiques (à ajouter) :**

```
Nom de l'attribut 1, Valeur(s) de l'attribut 1, Attribut 1 visible, Attribut 1 global,
Nom de l'attribut 2, Valeur(s) de l'attribut 2, Attribut 2 visible, Attribut 2 global,
...
Nom de l'attribut N, Valeur(s) de l'attribut N, Attribut N visible, Attribut N global
```

**N = maxAttributs**

### Étape 5 : Remplir les Lignes CSV

**Pour chaque produit :**

1. **Colonnes fixes :** Remplir avec les données existantes (Type, SKU, Name, etc.)

2. **Colonnes attributs :**
   - Pour i = 1 à maxAttributs :
     - Si le produit a un attribut à la position i :
       - Nom attribut i = `atr_value`
       - Valeur attribut i = `kat_value`
       - Visible i = `kat_visible ? "1" : "0"`
       - Global i = `kat_global ? "1" : "0"`
     - Sinon :
       - Nom attribut i = `""`
       - Valeur attribut i = `""`
       - Visible i = `""`
       - Global i = `""`

**Exemple pour Produit 3 (3 attributs, max=5) :**

```csv
simple,PROG052386-SUP0000005,...,POIDS,4,1,1,TENSION_60HZ,230,1,1,LARGEUR,166,0,1,,,,,,,
                                 ↑attribut 1↑    ↑attribut 2↑      ↑attribut 3↑    ↑4 et 5 vides↑
```

---

## 🧩 Cas Particuliers à Gérer

### Cas 1 : Produit sans Kit (fk_kit = NULL)

**Exemple :**

```
pro_id=10, fk_kit=NULL
```

**Logique :**

- Ne pas chercher d'attributs
- Colonnes attributs = toutes vides (`"","","",""`)

**Ligne CSV :**

```csv
simple,PROG000010-SUP0000001,...,,,,,,,,,,,
```

### Cas 2 : Kit sans Attributs (kit existe mais vide)

**Exemple :**

```
pro_id=11, fk_kit=200
kit_attribute : aucune ligne WHERE fk_kit=200
```

**Logique :**

- Kit existe mais aucun attribut lié
- Colonnes attributs = toutes vides

**Ligne CSV :**

```csv
simple,PROG000011-SUP0000001,...,,,,,,,,,,,
```

### Cas 3 : Attribut avec Valeur NULL (kat_value = NULL)

**Exemple :**

```
kat_id=600 | fk_kit=175 | fk_attribute_characteristic=999 | kat_value=NULL
```

**Logique :**

- L'attribut existe mais sans valeur
- **Option 1 :** Ignorer cet attribut (ne pas l'inclure dans le CSV)
- **Option 2 :** Inclure avec valeur vide (`""`)

**Recommandation :** **Ignorer** (ne compter que les attributs avec `kat_value` non NULL)

### Cas 4 : Attribut avec Valeur Spéciale "!NP!"

**Exemple :**

```
kat_value = "!NP!"  (signifie "Non Précisé")
```

**Logique :**

- **Option 1 :** Remplacer par `""` (vide)
- **Option 2 :** Garder `"!NP!"`
- **Option 3 :** Ignorer cet attribut

**Recommandation :** **Remplacer par vide** (`""`) pour ne pas polluer WordPress

### Cas 5 : Valeur avec Virgules (CSV Escape)

**Exemple :**

```
kat_value = "1,234.56"
atr_value = "Débit (50 Hz)"
```

**Logique :**

- Les virgules et guillemets doivent être échappés en CSV
- **Échappement CSV :**
  - Guillemets doubles : `"` → `""`
  - Valeur avec virgule : `1,234.56` → `"1,234.56"`

**Ligne CSV (échappée) :**

```csv
..., "Débit (50 Hz)", "1,234.56", 1, 1
```

### Cas 6 : Produits avec Nombre Variable d'Attributs

**Exemple :**

- Produit 1 : 2 attributs
- Produit 2 : 8 attributs
- Produit 3 : 3 attributs

**Logique :**

- **Max = 8** → CSV aura 8 × 4 = 32 colonnes attributs
- Produit 1 : 2 attributs remplis + 6 attributs vides (24 colonnes vides)
- Produit 3 : 3 attributs remplis + 5 attributs vides (20 colonnes vides)

**Impact :** CSV peut être large si un produit a beaucoup d'attributs.

---

## 🎨 Logique Repository (Abstrait)

### Fonction 1 : `getProductsWithAttributes()`

**Entrée :** Liste d'IDs produits (optionnel)

**Sortie :** Liste de produits avec leurs attributs

**Logique :**

1. Charger les produits (`product`)
2. Pour chaque produit avec `fk_kit` non NULL :
   - Charger `kit_attribute` WHERE `fk_kit = product.fk_kit`
   - Pour chaque `kit_attribute` :
     - Charger `attribute` WHERE `atr_id = fk_attribute_characteristic`
     - Construire objet `{ nom: atr_value, valeur: kat_value, visible: kat_visible, global: kat_global }`
3. Retourner produits avec liste d'attributs

**Pseudo-structure :**

```
[
  {
    pro_id: 3,
    pro_cenov_id: "...",
    attributs: [
      { nom: "POIDS", valeur: "4", visible: true, global: true },
      { nom: "TENSION_60HZ", valeur: "230", visible: true, global: true }
    ]
  },
  ...
]
```

---

## 📄 Logique Génération CSV (Abstrait)

### Fonction 2 : `generateCSVWithAttributes()`

**Entrée :** Liste de produits avec attributs

**Sortie :** Chaîne CSV

**Logique :**

**Étape A : Calculer maxAttributs**

```
maxAttributs = 0
Pour chaque produit :
  Si produit.attributs.length > maxAttributs :
    maxAttributs = produit.attributs.length
```

**Étape B : Générer headers**

```
headers = ["Type", "SKU", "Name", ..., "Brand"]

Pour i de 1 à maxAttributs :
  headers.ajouter("Nom de l'attribut " + i)
  headers.ajouter("Valeur(s) de l'attribut " + i)
  headers.ajouter("Attribut " + i + " visible")
  headers.ajouter("Attribut " + i + " global")
```

**Étape C : Générer lignes**

```
lignes = []

Pour chaque produit :
  ligne = [Type, SKU, Name, ..., Brand]  // Colonnes fixes

  Pour i de 1 à maxAttributs :
    Si produit.attributs[i] existe :
      ligne.ajouter(attribut.nom)          // atr_value
      ligne.ajouter(attribut.valeur)       // kat_value
      ligne.ajouter(attribut.visible ? "1" : "0")
      ligne.ajouter(attribut.global ? "1" : "0")
    Sinon :
      ligne.ajouter("")  // Nom vide
      ligne.ajouter("")  // Valeur vide
      ligne.ajouter("")  // Visible vide
      ligne.ajouter("")  // Global vide

  lignes.ajouter(ligne)
```

**Étape D : Échapper et formater CSV**

```
Pour chaque cellule :
  Si cellule contient virgule OU guillemet OU retour ligne :
    cellule = '"' + cellule.remplacer('"', '""') + '"'

csvFinal = headers.joindre(",") + "\n"
Pour chaque ligne :
  csvFinal += ligne.joindre(",") + "\n"

Retourner csvFinal
```

---

## 🔍 Validation Logique

### Questions à Se Poser

**Q1 :** Que faire si `atr_value` est NULL ?

- **Réponse :** Utiliser `atr_label` comme fallback OU ignorer l'attribut

**Q2 :** Ordre des attributs important ?

- **Réponse :** Non, WordPress accepte dans n'importe quel ordre. Mais pour cohérence, trier par `kat_id` ou `atr_value`.

**Q3 :** Faut-il filtrer les attributs selon `kat_visible` ?

- **Réponse :** NON, exporter tous les attributs. Les flags `visible/global` sont juste des métadonnées pour WordPress.

**Q4 :** Que faire si deux attributs ont le même nom (`atr_value` dupliqué) ?

- **Réponse :** Les garder tous les deux. WordPress gérera les doublons (ou les ignorera).

**Q5 :** Unités (`fk_attribute_unite`) : les inclure ?

- **Réponse :** PAS pour cette version. On ignore les unités pour l'instant.

---

## 📦 Résumé Flux Complet

### Vue d'ensemble en 5 étapes

```
1. CHARGER PRODUITS
   ↓
2. POUR CHAQUE PRODUIT : CHARGER ATTRIBUTS (via fk_kit)
   ↓
3. CALCULER MAX ATTRIBUTS (pour dimensionner CSV)
   ↓
4. GÉNÉRER HEADERS CSV (colonnes fixes + colonnes attributs dynamiques)
   ↓
5. REMPLIR LIGNES CSV (padding avec vides si < max attributs)
   ↓
6. TÉLÉCHARGER CSV
```

---

## ✅ Checklist Logique

### Avant de Coder

- [ ] Comprendre jointure `product → kit_attribute → attribute`
- [ ] Identifier le bon champ : `atr_value` (PAS `atr_label`)
- [ ] Décider du comportement pour `kat_value = NULL` (ignorer OU vide)
- [ ] Décider du comportement pour `kat_value = "!NP!"` (ignorer OU remplacer)
- [ ] Valider format CSV WordPress avec colonnes dynamiques
- [ ] Tester avec produit sans kit, kit sans attributs, produit avec 10+ attributs

---

## 🧪 Scénarios de Test Logique

### Test 1 : Produit Simple (2 attributs)

```
Produit 5 | fk_kit=100
  → kit_attribute (fk_kit=100) : 2 lignes
    → attribut 1 : POIDS = 5kg
    → attribut 2 : HAUTEUR = 200mm
```

**CSV attendu (si max=2) :**

```csv
...,POIDS,5,1,1,HAUTEUR,200,1,1
```

### Test 2 : Produit sans Kit

```
Produit 8 | fk_kit=NULL
```

**CSV attendu (si max=2) :**

```csv
...,,,,,,,
```

### Test 3 : Produit avec 10 Attributs (max du dataset)

```
Produit 12 | fk_kit=300
  → kit_attribute (fk_kit=300) : 10 lignes
```

**CSV attendu :**

- 10 × 4 = 40 colonnes attributs remplies

### Test 4 : Mélange (3 produits : 0, 2, 10 attributs)

```
Produit A : 0 attributs
Produit B : 2 attributs
Produit C : 10 attributs
```

**Max = 10** → Tous les produits auront 40 colonnes attributs

- Produit A : 40 colonnes vides
- Produit B : 8 colonnes remplies + 32 vides
- Produit C : 40 colonnes remplies

---

## 📌 Points Clés à Retenir

1. **Jointure :** `product.fk_kit = kit_attribute.fk_kit`
2. **Nom attribut :** `attribute.atr_value` (PAS `atr_label`)
3. **Valeur attribut :** `kit_attribute.kat_value`
4. **Flags :** `kat_visible` et `kat_global` (boolean → 0/1)
5. **Colonnes dynamiques :** Calculer `maxAttributs` pour dimensionner CSV
6. **Padding :** Produits avec moins d'attributs → remplir avec vides
7. **Échappement CSV :** Virgules et guillemets doivent être échappés
8. **Valeurs NULL :** Décider si ignorer ou remplacer par vide

---

**Prochain pas :** Implémenter le repository et la génération CSV selon cette logique.
