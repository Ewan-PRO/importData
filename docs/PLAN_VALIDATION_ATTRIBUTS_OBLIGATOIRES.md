# Plan Détaillé : Validation Attributs Obligatoires Hérités

## 📋 Objectif

Vérifier que le CSV contient TOUS les attributs obligatoires d'une catégorie, **y compris ceux hérités des parents**.

---

## 🎯 Exemple Concret (cat_id 52)

### Situation

```
Hiérarchie :
  cat_id 3 "equipement industriel" (0 attribut obligatoire)
      ↓ fk_parent = 3
  cat_id 14 "compresseurs industriels" (1 attribut : TYPE_ALIMENTATION obligatoire)
      ↓ fk_parent = 14
  cat_id 52 "surpresseurs" (0 attribut obligatoire direct)
```

### CSV Import

```csv
pro_cenov_id;pro_code;...;cat_code
PROD001;ABC123;...;surpresseurs
```

**Problème actuel :** Validation passe ✅ (car cat_id 52 a 0 attribut obligatoire direct)

**Comportement attendu :** Validation échoue ❌ (car TYPE_ALIMENTATION obligatoire hérité manquant)

---

## 📊 État Actuel du Code

### 1. Fonction Existante : `validateRequiredAttributes()`

**Localisation :** `src/routes/importV2/import-logic.ts:657`

**Logique actuelle :**

```typescript
export async function validateRequiredAttributes(
	data: CSVRow[],
	attributesByProduct: ProductAttributes[],
	database: 'cenov_dev' | 'cenov_preprod' = 'cenov_dev'
): Promise<ValidationResult>;
```

**Ce qu'elle fait :**

1. Charge les catégories depuis le CSV
2. Charge les attributs obligatoires **directs** de chaque catégorie
3. Vérifie que le CSV contient ces attributs

**Ce qu'elle NE fait PAS :**

- ❌ Ne remonte PAS la hiérarchie `fk_parent`
- ❌ Ne vérifie PAS les attributs obligatoires hérités

### 2. Fonction Existante : `loadRequiredAttributesByCategory()`

**Localisation :** `src/routes/importV2/import-logic.ts:620`

**Logique actuelle :**

```typescript
async function loadRequiredAttributesByCategory(
	categoryIds: number[],
	database: 'cenov_dev' | 'cenov_preprod' = 'cenov_dev'
): Promise<Map<number, Array<{ code: string; label: string }>>>;
```

**Ce qu'elle fait :**

```typescript
const requiredAttrs = await prisma.category_attribute.findMany({
	where: {
		fk_category: { in: categoryIds },
		cat_atr_required: true // ← Attributs obligatoires DIRECTS
	}
});
```

**Ce qu'elle NE fait PAS :**

- ❌ Ne remonte PAS la hiérarchie pour chaque catégorie
- ❌ Charge SEULEMENT les attributs directs, pas les hérités

---

## 🔧 Plan d'Implémentation - Étape par Étape

### ÉTAPE 1 : Créer fonction d'héritage pour attributs obligatoires

**Objectif :** Fonction qui remonte la hiérarchie et récupère TOUS les attributs obligatoires (directs + hérités)

**Nouvelle fonction :**

```typescript
async function getCategoryRequiredAttributesWithInheritance(
	catId: number,
	database: 'cenov_dev' | 'cenov_preprod' = 'cenov_dev'
): Promise<
	Array<{
		atr_id: number;
		atr_value: string;
		atr_label: string;
		inherited: boolean;
		fromCatId: number;
		fromCatLabel: string;
	}>
>;
```

**Logique :**

1. Remonter hiérarchie via `fk_parent` (similaire à `getCategoryTotalAttributeCount`)
2. Pour CHAQUE niveau de la hiérarchie :
   - Charger attributs obligatoires (`cat_atr_required: true`)
3. Dédupliquer (si même attribut dans parent et enfant)
4. Marquer l'origine (hérité ou direct)

**Implémentation :**

```typescript
async function getCategoryRequiredAttributesWithInheritance(
	catId: number,
	database: 'cenov_dev' | 'cenov_preprod' = 'cenov_dev'
): Promise<
	Array<{
		atr_id: number;
		atr_value: string;
		atr_label: string;
		inherited: boolean;
		fromCatId: number;
		fromCatLabel: string;
	}>
> {
	const prisma = (await getClient(database)) as unknown as CenovDevPrismaClient;

	// 1. Remonter hiérarchie complète
	const hierarchy: Array<{ cat_id: number; cat_label: string }> = [];
	let currentCatId: number | null = catId;

	while (currentCatId !== null) {
		const category: { cat_id: number; cat_label: string; fk_parent: number | null } | null =
			await prisma.category.findUnique({
				where: { cat_id: currentCatId },
				select: { cat_id: true, cat_label: true, fk_parent: true }
			});

		if (!category) break;

		hierarchy.push({ cat_id: category.cat_id, cat_label: category.cat_label });
		currentCatId = category.fk_parent;
	}

	// 2. Charger TOUS les attributs obligatoires de la hiérarchie
	const categoryIds = hierarchy.map((h) => h.cat_id);

	const requiredAttrs = await prisma.category_attribute.findMany({
		where: {
			fk_category: { in: categoryIds },
			cat_atr_required: true // ← Attributs OBLIGATOIRES
		},
		include: {
			attribute: {
				select: { atr_id: true, atr_value: true, atr_label: true }
			},
			category: {
				select: { cat_label: true }
			}
		}
	});

	// 3. Dédupliquer et marquer l'origine
	const seen = new Set<number>();
	const result: Array<{
		atr_id: number;
		atr_value: string;
		atr_label: string;
		inherited: boolean;
		fromCatId: number;
		fromCatLabel: string;
	}> = [];

	for (const attr of requiredAttrs) {
		if (!seen.has(attr.attribute.atr_id)) {
			seen.add(attr.attribute.atr_id);
			result.push({
				atr_id: attr.attribute.atr_id,
				atr_value: attr.attribute.atr_value!,
				atr_label: attr.attribute.atr_label,
				inherited: attr.fk_category !== catId,
				fromCatId: attr.fk_category,
				fromCatLabel: attr.category.cat_label
			});
		}
	}

	return result;
}
```

**Test manuel :**

```typescript
// Test avec cat_id 52 (surpresseurs)
const attrs = await getCategoryRequiredAttributesWithInheritance(52, 'cenov_dev');
// Résultat attendu :
// [
//   {
//     atr_id: 309,
//     atr_value: "TYPE_ALIMENTATION",
//     atr_label: "Type d'alimentation",
//     inherited: true,
//     fromCatId: 14,
//     fromCatLabel: "compresseurs industriels"
//   }
// ]
```

---

### ÉTAPE 2 : Modifier `validateRequiredAttributes()`

**Objectif :** Utiliser la nouvelle fonction pour valider attributs directs + hérités

**Modifications à faire :**

**AVANT :**

```typescript
// CAS 2: Catégorie connue - vérifier attributs obligatoires
const requiredAttrs = requiredAttrsByCategory.get(category.cat_id) || [];
```

**APRÈS :**

```typescript
// CAS 2: Catégorie connue - vérifier attributs obligatoires (directs + hérités)
const requiredAttrs = await getCategoryRequiredAttributesWithInheritance(category.cat_id, database);
```

**Changement dans la logique de validation :**

**AVANT :**

```typescript
const missingAttrs = requiredAttrs.filter((req) => !csvAttrCodes.has(req.code));
```

**APRÈS :**

```typescript
const missingAttrs = requiredAttrs.filter((req) => !csvAttrCodes.has(req.atr_value));
```

**Amélioration du message d'erreur :**

**AVANT :**

```typescript
error: `Catégorie "${category.cat_label}" (${row.cat_code}) requiert ${missingAttrs.length} attribut(s) manquant(s): ${missingAttrs.map((m) => m.label).join(', ')}`;
```

**APRÈS (avec indication de l'origine) :**

```typescript
error: `Catégorie "${category.cat_label}" (${row.cat_code}) requiert ${missingAttrs.length} attribut(s) manquant(s):\n${missingAttrs
	.map((m) => {
		if (m.inherited) {
			return `  - ${m.atr_label} (hérité de "${m.fromCatLabel}")`;
		}
		return `  - ${m.atr_label}`;
	})
	.join('\n')}`;
```

---

### ÉTAPE 3 : Tester avec cat_id 52

**Scénario de test :**

**CSV valide (avec TYPE_ALIMENTATION) :**

```csv
pro_cenov_id;pro_code;sup_code;sup_label;cat_code;cat_label;kit_label;pp_amount;pp_date;TYPE_ALIMENTATION
PROD001;ABC123;SUP001;Fournisseur;surpresseurs;Surpresseurs;Kit Test;100;2024-01-01;Electrique
```

**Résultat attendu :** ✅ Validation passe

---

**CSV invalide (SANS TYPE_ALIMENTATION) :**

```csv
pro_cenov_id;pro_code;sup_code;sup_label;cat_code;cat_label;kit_label;pp_amount;pp_date
PROD001;ABC123;SUP001;Fournisseur;surpresseurs;Surpresseurs;Kit Test;100;2024-01-01
```

**Résultat attendu :** ❌ Validation échoue

**Message d'erreur attendu :**

```
❌ Ligne 2 : Catégorie "Surpresseurs" (surpresseurs) requiert 1 attribut(s) manquant(s):
  - Type d'alimentation (hérité de "compresseurs industriels")
```

---

### ÉTAPE 4 : Optimisation Performance

**Problème :** Boucle sur chaque produit = N requêtes BDD pour remonter hiérarchie

**Solution :** Cache des hiérarchies

```typescript
// Au début de validateRequiredAttributes()
const hierarchyCache = new Map<number, Array<{...}>>();

async function getCachedRequiredAttributes(catId: number) {
  if (hierarchyCache.has(catId)) {
    return hierarchyCache.get(catId)!;
  }

  const attrs = await getCategoryRequiredAttributesWithInheritance(catId, database);
  hierarchyCache.set(catId, attrs);
  return attrs;
}
```

**Amélioration :** Précharger TOUTES les hiérarchies au début (si nombre de catégories limité)

---

### ÉTAPE 5 : Mise à jour documentation

**Fichier :** `docs/LOGIQUE_HERITAGE_ATTRIBUTS.md`

**Ajouter section :**

```markdown
## ✅ Validation Implémentée

### Attributs Obligatoires Hérités

La validation vérifie maintenant :

- ✅ Attributs obligatoires directs (déjà implémenté)
- ✅ Attributs obligatoires hérités via fk_parent (nouveau)

Exemple :

- cat_id 52 "surpresseurs" hérite de cat_id 14 "compresseurs"
- Si TYPE_ALIMENTATION obligatoire dans cat_id 14
- → TYPE_ALIMENTATION devient obligatoire pour cat_id 52

Messages d'erreur :

- Indiquent l'origine de l'attribut obligatoire
- Format : "Type d'alimentation (hérité de 'compresseurs industriels')"
```

---

## 🧪 Plan de Test Complet

### Test 1 : Attribut obligatoire direct

```
Catégorie : cat_id 14 (1 attribut obligatoire direct)
CSV : AVEC TYPE_ALIMENTATION
Résultat : ✅ PASS
```

### Test 2 : Attribut obligatoire hérité présent

```
Catégorie : cat_id 52 (0 direct, 1 hérité)
CSV : AVEC TYPE_ALIMENTATION
Résultat : ✅ PASS
```

### Test 3 : Attribut obligatoire hérité manquant

```
Catégorie : cat_id 52 (0 direct, 1 hérité)
CSV : SANS TYPE_ALIMENTATION
Résultat : ❌ FAIL
Erreur : "Type d'alimentation (hérité de 'compresseurs industriels') manquant"
```

### Test 4 : Hiérarchie profonde (3 niveaux)

```
Catégorie : cat_id X (enfant de Y, enfant de Z)
cat_id Z : 1 attribut obligatoire
cat_id Y : 1 attribut obligatoire
cat_id X : 0 attribut obligatoire direct
CSV : DOIT contenir les 2 attributs hérités
Résultat : Validation correcte des 2 niveaux
```

### Test 5 : Dédoublonnage

```
Catégorie : cat_id X
Parent : 1 attribut ATTR_A obligatoire
Enfant : même attribut ATTR_A obligatoire (redéfini)
CSV : ATTR_A présent
Résultat : ✅ PASS (compté 1 seule fois)
```

---

## 📝 Checklist Implémentation

### Phase 1 : Code

- [ ] Créer `getCategoryRequiredAttributesWithInheritance()`
- [ ] Ajouter tests unitaires pour la fonction
- [ ] Modifier `validateRequiredAttributes()` pour utiliser la nouvelle fonction
- [ ] Améliorer messages d'erreur (indiquer origine héritage)
- [ ] Ajouter cache pour optimiser performance

### Phase 2 : Tests

- [ ] Test 1 : Attribut obligatoire direct
- [ ] Test 2 : Attribut obligatoire hérité présent
- [ ] Test 3 : Attribut obligatoire hérité manquant
- [ ] Test 4 : Hiérarchie profonde (3+ niveaux)
- [ ] Test 5 : Dédoublonnage

### Phase 3 : Documentation

- [ ] Mettre à jour `LOGIQUE_HERITAGE_ATTRIBUTS.md`
- [ ] Ajouter exemples dans `CLAUDE.md` si besoin
- [ ] Documenter messages d'erreur

### Phase 4 : Quality Check

- [ ] `pnpm format` - Formatage OK
- [ ] `pnpm lint` - Pas d'erreurs ESLint
- [ ] `pnpm check` - Pas d'erreurs TypeScript
- [ ] Test manuel avec cat_id 52

### Phase 5 : Commit & Push

- [ ] Commit avec gitmoji `:sparkles:` ou `:bug:`
- [ ] Message : "add required attributes inheritance validation"
- [ ] Push vers main

---

## 🚨 Points d'Attention

### 1. Performance

- Remonter hiérarchie pour CHAQUE produit peut être lent
- **Solution :** Cache des hiérarchies par cat_id
- **Alternative :** Précharger toutes les hiérarchies au début

### 2. Messages d'Erreur

- Doivent être clairs pour l'utilisateur
- Indiquer l'origine de l'attribut obligatoire
- Exemple : "Type d'alimentation (hérité de 'compresseurs')"

### 3. Dédoublonnage

- Si attribut présent dans parent ET enfant
- Compter 1 seule fois
- Priorité : attribut direct > attribut hérité

### 4. Boucles Infinies

- Vérifier qu'il n'y a pas de cycles dans fk_parent
- Protection : limiter profondeur max (ex: 10 niveaux)

---

## 💡 Améliorations Futures (Optionnelles)

### 1. UI/UX

- Afficher dans l'autocomplétion : "1 attribut (dont 0 obligatoire)"
- Tooltip au survol : "TYPE_ALIMENTATION (hérité de...)"

### 2. Performance

- Index BDD sur `fk_parent` pour accélérer remontée
- Cache Redis pour hiérarchies fréquemment utilisées

### 3. Validation Avancée

- Vérifier cohérence : attribut obligatoire dans enfant mais pas dans parent
- Warning si redéfinition d'attribut obligatoire dans enfant

---

## 📚 Résumé Exécutif

**Objectif :** Valider attributs obligatoires hérités via `fk_parent`

**Changements clés :**

1. Nouvelle fonction `getCategoryRequiredAttributesWithInheritance()`
2. Modification `validateRequiredAttributes()` pour utiliser héritage
3. Messages d'erreur améliorés (indiquer origine)

**Impact utilisateur :**

- ✅ Validation correcte des attributs obligatoires hérités
- ✅ Messages d'erreur clairs indiquant l'origine
- ✅ Cohérence logique métier avec hiérarchie BDD

**Effort estimé :** 2-3 heures

- 1h : Implémentation fonction + modification
- 1h : Tests
- 30min : Documentation + quality check
