# 📦 Scripts d'Import - Base CENOV_DEV

Scripts Node.js simples pour importer des données dans la base CENOV_DEV avec Prisma.

**Architecture :** Séparation données/logique pour faciliter la réutilisation.

---

## 📁 Structure

```
scripts/import/
├── README.md                  # Ce fichier
├── import-test-data.mjs       # Script d'import universel
└── data/
    └── test-data.json         # Données à importer (modifiable)
```

**Principe :**

- **Logique** = `import-test-data.mjs` (jamais touché)
- **Données** = fichiers JSON (modifiables facilement)

---

## 🚀 Utilisation Rapide

### Import avec fichier par défaut

```bash
node scripts/import/import-test-data.mjs
```

### Import avec fichier personnalisé

```bash
node scripts/import/import-test-data.mjs ./data/test-data.json
node scripts/import/import-test-data.mjs ./data/suppliers-grundfos.json
node scripts/import/import-test-data.mjs ./data/mon-import.json
```

---

## 📊 Ce que fait le script

**Import automatique dans l'ordre correct :**

1. ✅ **Attributes** (caractéristiques des produits)
2. ✅ **Kits** (familles de produits)
3. ✅ **Categories** (catégories de produits)
4. ✅ **Category-Attribute Links** (liens catégories ↔ attributs)
5. ✅ **Products** (produits)
6. ✅ **Product-Category Links** (liens produits ↔ catégories)
7. ✅ **Vérification vue** (v_produit_categorie_attribut)

**Résolution automatique des FK :**

- Trouve automatiquement les IDs des kits, catégories, etc.
- Pas besoin de connaître les IDs à l'avance

**Upsert automatique :**

- Si l'enregistrement existe → UPDATE
- Sinon → INSERT

---

## 📝 Format du Fichier JSON

### Structure Complète

```json
{
	"attributes": [
		{
			"atr_nature": "CARACTERISTIQUE",
			"atr_label": "Nom Attribut",
			"atr_code": "CODE-UNIQUE",
			"atr_symbol_intl": "unité",
			"atr_description": "Description"
		}
	],
	"kits": [{ "kit_label": "Nom Kit Unique" }],
	"categories": [
		{
			"cat_code": "CAT-CODE",
			"cat_label": "Nom Catégorie",
			"fk_parent": null,
			"cat_wp_name": "slug-url"
		}
	],
	"categoryAttributeLinks": [
		{
			"cat_code": "CAT-CODE",
			"atr_code": "CODE-UNIQUE",
			"cat_atr_required": true
		}
	],
	"products": [
		{
			"pro_code": "PRO-001",
			"kit_label": "Nom Kit Unique",
			"pro_cenov_id": "CENOV-ID"
		}
	],
	"productCategoryLinks": [
		{
			"pro_code": "PRO-001",
			"cat_codes": ["CAT-CODE", "CAT-CODE-2"]
		}
	]
}
```

### Champs Importants (Clés Uniques)

- **`atr_code`** : Identifiant unique pour attributes
- **`kit_label`** : Identifiant unique pour kits
- **`cat_code`** : Identifiant unique pour categories
- **`pro_code`** : Identifiant unique pour products

**Ces champs sont utilisés pour :**

- Les upserts (éviter doublons)
- Les résolutions FK (ex: `kit_label` dans products → trouve l'ID du kit)

---

## ✏️ Créer un Nouveau Fichier de Données

### Option 1 : Copier l'exemple

```bash
cp scripts/import/data/test-data.json scripts/import/data/mon-import.json
# Modifier mon-import.json avec vos données
```

### Option 2 : Template Minimal

```json
{
	"attributes": [],
	"kits": [{ "kit_label": "Mon Nouveau Kit" }],
	"categories": [
		{
			"cat_code": "NEW-CAT",
			"cat_label": "Ma Nouvelle Catégorie",
			"fk_parent": null,
			"cat_wp_name": "nouvelle-categorie"
		}
	],
	"categoryAttributeLinks": [],
	"products": [
		{
			"pro_code": "NEW-PRO-001",
			"kit_label": "Mon Nouveau Kit",
			"pro_cenov_id": "CENOV-NEW-001"
		}
	],
	"productCategoryLinks": [
		{
			"pro_code": "NEW-PRO-001",
			"cat_codes": ["NEW-CAT"]
		}
	]
}
```

**Puis importer :**

```bash
node scripts/import/import-test-data.mjs ./data/mon-import.json
```

---

## 📖 Exemples

### Exemple 1 : Import Données Test MVP

**Fichier :** `data/test-data.json`

```bash
node scripts/import/import-test-data.mjs
```

**Résultat :**

```
✅ 3 attributs créés
✅ 3 kits créés
✅ 2 catégories créées
✅ 5 liens catégorie-attribut créés
✅ 3 produits créés
✅ 4 liens produit-catégorie créés
✅ 10 lignes dans la vue
⏱️  Durée: 2s
```

### Exemple 2 : Import Fournisseur Grundfos

**Créer :** `data/suppliers-grundfos.json`

```json
{
	"attributes": [
		{
			"atr_nature": "CARACTERISTIQUE",
			"atr_label": "Débit Maximum",
			"atr_code": "Q-MAX",
			"atr_symbol_intl": "m³/h",
			"atr_description": "Débit maximal de la pompe"
		}
	],
	"kits": [{ "kit_label": "Pompe CR Grundfos" }],
	"categories": [
		{
			"cat_code": "GRUNDFOS",
			"cat_label": "Pompes Grundfos",
			"fk_parent": null,
			"cat_wp_name": "grundfos"
		}
	],
	"categoryAttributeLinks": [
		{
			"cat_code": "GRUNDFOS",
			"atr_code": "Q-MAX",
			"cat_atr_required": true
		}
	],
	"products": [
		{
			"pro_code": "CR32-4",
			"kit_label": "Pompe CR Grundfos",
			"pro_cenov_id": "GRDF-CR32-4"
		}
	],
	"productCategoryLinks": [
		{
			"pro_code": "CR32-4",
			"cat_codes": ["GRUNDFOS"]
		}
	]
}
```

**Importer :**

```bash
node scripts/import/import-test-data.mjs ./data/suppliers-grundfos.json
```

---

## 🎓 Concepts Clés

### 1. Upsert (Insert ou Update)

Le script utilise Prisma `upsert()` pour éviter les doublons :

```javascript
await prisma.attribute.upsert({
	where: { atr_nature_atr_value: { atr_nature, atr_value } },
	create: { ...data }, // ← Si n'existe pas
	update: { ...data } // ← Si existe déjà
});
```

**Équivalent SQL :**

```sql
INSERT INTO attribute (...) VALUES (...)
ON CONFLICT (atr_nature, atr_value) DO UPDATE SET ...;
```

### 2. Résolution FK Automatique

Le script trouve automatiquement les IDs des relations :

```javascript
// Dans le JSON vous écrivez :
"kit_label": "Pompe CR Grundfos"

// Le script fait automatiquement :
const kit = insertedKits.find(k => k.kit_label === "Pompe CR Grundfos");
const fk_kit = kit.kit_id; // ← Récupéré automatiquement
```

**Avantage :** Pas besoin de connaître les IDs de la base

### 3. Ordre d'Import

Le script respecte automatiquement l'ordre des dépendances :

```
1. Attributes   (pas de FK)
2. Kits         (pas de FK)
3. Categories   (FK vers Categories)
4. Category-Attribute (FK vers Categories + Attributes)
5. Products     (FK vers Kits)
6. Product-Category (FK vers Products + Categories)
```

---

## ⚠️ Points d'Attention

### 1. Foreign Keys Doivent Exister

```json
// ❌ ERREUR : kit_label n'existe pas
{
  "products": [
    {
      "pro_code": "PRO-001",
      "kit_label": "Kit Inexistant"  // ← Crash !
    }
  ]
}

// ✅ OK : kit_label existe dans kits
{
  "kits": [
    { "kit_label": "Mon Kit" }
  ],
  "products": [
    {
      "pro_code": "PRO-001",
      "kit_label": "Mon Kit"  // ← Match !
    }
  ]
}
```

### 2. Clés Uniques Doivent Être Uniques

```json
// ❌ ERREUR : atr_code dupliqué
{
  "attributes": [
    { "atr_code": "PWR", ... },
    { "atr_code": "PWR", ... }  // ← Doublon !
  ]
}

// ✅ OK : codes différents
{
  "attributes": [
    { "atr_code": "PWR-001", ... },
    { "atr_code": "PWR-002", ... }
  ]
}
```

### 3. Validation JSON

Avant d'importer, vérifiez votre JSON :

- Syntaxe correcte (pas de virgules manquantes, guillemets fermés)
- Structure respectée (tous les champs requis présents)

**Astuce :** Utilisez un validateur JSON en ligne ou VSCode

---

## 🔧 Personnalisation pour Autres Tables

Le script actuel gère :

- attributes
- kits
- categories
- category_attribute
- products
- product_category

**Pour ajouter d'autres tables (supplier, family, price_purchase, etc.) :**

Créer un nouveau script similaire adapté à vos tables, ou étendre `import-test-data.mjs`.

**Exemple : Import Suppliers + Price Purchase**

1. Copier `import-test-data.mjs` → `import-suppliers.mjs`
2. Modifier pour lire structure JSON adaptée :
   ```json
   {
     "suppliers": [...],
     "products": [...],
     "prices": [...]
   }
   ```
3. Adapter la logique d'import

---

## 🐛 Debugging

### Activer Logs Prisma

Pour voir toutes les requêtes SQL exécutées :

```javascript
const prisma = new CenovDevPrismaClient({
	log: ['query', 'info', 'warn', 'error'],
	datasources: { cenov_dev_db: { url: process.env.CENOV_DEV_DATABASE_URL } }
});
```

### Erreurs Courantes

| Erreur                        | Cause                    | Solution                           |
| ----------------------------- | ------------------------ | ---------------------------------- |
| `Kit non trouvé`              | `kit_label` n'existe pas | Vérifier kits[] dans JSON          |
| `Unique constraint violation` | Doublon de clé unique    | Changer atr_code/cat_code/pro_code |
| `JSON parse error`            | Syntaxe JSON invalide    | Valider JSON                       |

---

## 📚 Ressources

- **Schéma Prisma :** `prisma/cenov_dev/schema.prisma`
- **Métadonnées DMMF :** `scripts/Script DMMF/output/`
- **Documentation Prisma :** https://www.prisma.io/docs

---

## 🎯 Prochaines Étapes Suggérées

1. **Créer scripts pour autres tables**
   - `import-suppliers.mjs` (suppliers + families)
   - `import-prices.mjs` (price_purchase)
   - `import-documents.mjs` (documents + document_link)

2. **Ajouter validation pre-import** (optionnel)
   - Vérifier structure JSON avant import
   - Valider FK existent

3. **Créer converter CSV → JSON** (optionnel)
   - Automatiser conversion depuis CSV

---

## 💡 Avantages de cette Approche

| Aspect                         | Bénéfice                           |
| ------------------------------ | ---------------------------------- |
| **Séparation données/logique** | Modifier données sans toucher code |
| **Réutilisabilité**            | 1 script, N fichiers de données    |
| **Maintenabilité**             | Code simple et clair               |
| **Traçabilité**                | Logs détaillés de chaque étape     |
| **Sécurité**                   | Upsert évite doublons              |
| **Automatisable**              | Intégrable dans CI/CD              |

---

**Besoin d'aide ?** Consultez les exemples dans `data/test-data.json` ou créez un nouveau fichier JSON basé sur le template ci-dessus.
