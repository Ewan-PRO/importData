-- Script de test pour v_produit_categorie_attribut
-- Version 2.0 - AVEC SUFFIXE "-Test" pour nettoyage sécurisé
-- Base de données : CENOV_DEV

-- ========== AVANTAGE DE CETTE VERSION ==========
-- ✅ Tous les codes/labels ont le suffixe "-Test"
-- ✅ Impossible de confondre avec données réelles
-- ✅ Nettoyage 100% sûr via cleanup_test_data_v2.sql
-- ✅ Visibilité immédiate des données de test

-- ========== INSERTIONS AVEC SUFFIXE "-Test" ==========

-- 1. Insérer attributs avec suffixe "-Test"
WITH inserted_attributes AS (
  INSERT INTO public.attribute (atr_nature, atr_label, atr_code, atr_symbol_intl, atr_description)
  VALUES
    ('CARACTERISTIQUE', 'Puissance-Test', 'PWR-Test', 'kW', 'Puissance nominale en kilowatts (TEST)'),
    ('CARACTERISTIQUE', 'Débit-Test', 'FLOW-Test', 'm³/h', 'Débit volumique (TEST)'),
    ('CARACTERISTIQUE', 'Pression-Test', 'PRESS-Test', 'bar', 'Pression maximale (TEST)')
  ON CONFLICT (atr_nature, atr_value) DO UPDATE SET atr_label = EXCLUDED.atr_label
  RETURNING atr_id, atr_code, atr_label
)
SELECT 'Attributs créés:' AS info, atr_id, atr_code, atr_label FROM inserted_attributes;

-- 2. Insérer kits avec suffixe "-Test"
WITH inserted_kits AS (
  INSERT INTO public.kit (kit_label)
  VALUES
    ('Pompe Centrifuge Électrique-Test'),
    ('Pompe Immergée-Test'),
    ('Pompe Manuelle-Test')
  ON CONFLICT DO NOTHING
  RETURNING kit_id, kit_label
)
SELECT 'Kits créés:' AS info, kit_id, kit_label FROM inserted_kits;

-- 3. Insérer catégories avec suffixe "-Test"
WITH inserted_categories AS (
  INSERT INTO produit.category (cat_code, cat_label, fk_parent, cat_wp_name)
  VALUES
    ('CAT001-Test', 'Pompes Industrielles-Test', NULL, 'pompes-industrielles-test'),
    ('CAT002-Test', 'Pompes Électriques-Test', NULL, 'pompes-electriques-test')
  ON CONFLICT (fk_parent, cat_code) DO UPDATE SET cat_label = EXCLUDED.cat_label
  RETURNING cat_id, cat_code, cat_label
)
SELECT 'Catégories créées:' AS info, cat_id, cat_code, cat_label FROM inserted_categories;

-- ========== AFFICHER LES IDS POUR RÉFÉRENCE ==========

SELECT '=== IDs Générés ===' AS separator;

-- IDs des attributs
SELECT 'Attributs:' AS table_name, atr_id, atr_code, atr_label
FROM public.attribute
WHERE atr_code LIKE '%-Test'
ORDER BY atr_id;

-- IDs des kits
SELECT 'Kits:' AS table_name, kit_id, kit_label
FROM public.kit
WHERE kit_label LIKE '%-Test'
ORDER BY kit_id;

-- IDs des catégories
SELECT 'Catégories:' AS table_name, cat_id, cat_code, cat_label
FROM produit.category
WHERE cat_code LIKE '%-Test'
ORDER BY cat_id;

-- ========== INSERTIONS AVEC SOUS-REQUÊTES (IDs Dynamiques) ==========

-- 4. Lier catégories et attributs (DYNAMIQUE)
INSERT INTO produit.category_attribute (fk_category, fk_attribute, cat_atr_required)
SELECT
  c.cat_id,
  a.atr_id,
  CASE
    WHEN c.cat_code = 'CAT001-Test' AND a.atr_code = 'PWR-Test' THEN true
    WHEN c.cat_code = 'CAT001-Test' AND a.atr_code = 'FLOW-Test' THEN true
    WHEN c.cat_code = 'CAT001-Test' AND a.atr_code = 'PRESS-Test' THEN false
    WHEN c.cat_code = 'CAT002-Test' AND a.atr_code = 'PWR-Test' THEN true
    WHEN c.cat_code = 'CAT002-Test' AND a.atr_code = 'FLOW-Test' THEN false
    ELSE false
  END AS cat_atr_required
FROM produit.category c
CROSS JOIN public.attribute a
WHERE c.cat_code LIKE '%-Test'
  AND a.atr_code LIKE '%-Test'
  AND (
    (c.cat_code = 'CAT001-Test' AND a.atr_code IN ('PWR-Test', 'FLOW-Test', 'PRESS-Test'))
    OR (c.cat_code = 'CAT002-Test' AND a.atr_code IN ('PWR-Test', 'FLOW-Test'))
  )
ON CONFLICT (fk_category, fk_attribute) DO UPDATE
SET cat_atr_required = EXCLUDED.cat_atr_required;

SELECT 'Liens catégorie-attribut créés:' AS info, COUNT(*) AS count
FROM produit.category_attribute ca
JOIN produit.category c ON ca.fk_category = c.cat_id
WHERE c.cat_code LIKE '%-Test';

-- 5. Insérer produits avec suffixe "-Test" (DYNAMIQUE avec IDs de kits)
WITH inserted_products AS (
  INSERT INTO produit.product (pro_code, fk_kit, pro_cenov_id)
  SELECT 'PUMP001-Test', k.kit_id, 'CEN001-Test'
  FROM public.kit k WHERE k.kit_label = 'Pompe Centrifuge Électrique-Test'
  UNION ALL
  SELECT 'PUMP002-Test', k.kit_id, 'CEN002-Test'
  FROM public.kit k WHERE k.kit_label = 'Pompe Centrifuge Électrique-Test'
  UNION ALL
  SELECT 'PUMP003-Test', k.kit_id, 'CEN003-Test'
  FROM public.kit k WHERE k.kit_label = 'Pompe Immergée-Test'
  ON CONFLICT DO NOTHING
  RETURNING pro_id, pro_code, fk_kit
)
SELECT 'Produits créés:' AS info, pro_id, pro_code FROM inserted_products;

-- Afficher les IDs des produits créés
SELECT 'Produits:' AS table_name, pro_id, pro_code, fk_kit
FROM produit.product
WHERE pro_code LIKE '%-Test'
ORDER BY pro_id;

-- 6. Lier produits et catégories (DYNAMIQUE)
INSERT INTO produit.product_category (fk_product, fk_category)
SELECT p.pro_id, c.cat_id
FROM produit.product p
CROSS JOIN produit.category c
WHERE p.pro_code LIKE '%-Test'
  AND c.cat_code LIKE '%-Test'
  AND (
    (p.pro_code = 'PUMP001-Test' AND c.cat_code = 'CAT001-Test')
    OR (p.pro_code = 'PUMP002-Test' AND c.cat_code IN ('CAT001-Test', 'CAT002-Test'))
    OR (p.pro_code = 'PUMP003-Test' AND c.cat_code = 'CAT002-Test')
  )
ON CONFLICT (fk_product, fk_category) DO NOTHING;

SELECT 'Liens produit-catégorie créés:' AS info, COUNT(*) AS count
FROM produit.product_category pc
JOIN produit.product p ON pc.fk_product = p.pro_id
WHERE p.pro_code LIKE '%-Test';

-- ========== VÉRIFICATION DE LA VUE ==========

SELECT '=== Vue v_produit_categorie_attribut ===' AS separator;

-- Consulter la vue (DOIT être automatiquement à jour)
SELECT
  pro_id,
  kit_label,
  atr_id,
  atr_label,
  cat_label
FROM produit.v_produit_categorie_attribut
WHERE pro_id IN (
  SELECT pro_id FROM produit.product WHERE pro_code LIKE '%-Test'
)
ORDER BY pro_id, atr_id;

-- Statistiques
SELECT '=== Statistiques ===' AS separator;

SELECT
  'Nombre de lignes dans la vue pour produits -Test' AS info,
  COUNT(*) AS count
FROM produit.v_produit_categorie_attribut
WHERE pro_id IN (
  SELECT pro_id FROM produit.product WHERE pro_code LIKE '%-Test'
);

-- ========== TEST MISE À JOUR DYNAMIQUE ==========

SELECT '=== Test Mise à Jour Dynamique ===' AS separator;

-- Ajouter un nouveau produit (PUMP004-Test)
WITH new_product AS (
  INSERT INTO produit.product (pro_code, fk_kit, pro_cenov_id)
  SELECT 'PUMP004-Test', k.kit_id, 'CEN004-Test'
  FROM public.kit k WHERE k.kit_label = 'Pompe Manuelle-Test'
  ON CONFLICT DO NOTHING
  RETURNING pro_id, pro_code
)
SELECT 'Nouveau produit créé:' AS info, pro_id, pro_code FROM new_product;

-- Lier à une catégorie
INSERT INTO produit.product_category (fk_product, fk_category)
SELECT p.pro_id, c.cat_id
FROM produit.product p
JOIN produit.category c ON c.cat_code = 'CAT001-Test'
WHERE p.pro_code = 'PUMP004-Test'
ON CONFLICT (fk_product, fk_category) DO NOTHING;

-- Vérifier que la vue est IMMÉDIATEMENT à jour
SELECT '=== Vue après ajout PUMP004-Test (DOIT afficher 3 lignes) ===' AS separator;

SELECT *
FROM produit.v_produit_categorie_attribut
WHERE pro_id = (
  SELECT pro_id FROM produit.product WHERE pro_code = 'PUMP004-Test'
)
ORDER BY atr_id;

-- ========== RÉCAPITULATIF FINAL ==========

SELECT '=== Récapitulatif Final ===' AS separator;

SELECT
  'Total produits -Test' AS metrique,
  COUNT(*) AS valeur
FROM produit.product
WHERE pro_code LIKE '%-Test'
UNION ALL
SELECT
  'Total lignes dans vue',
  COUNT(*)
FROM produit.v_produit_categorie_attribut
WHERE pro_id IN (
  SELECT pro_id FROM produit.product WHERE pro_code LIKE '%-Test'
);

-- Résultat attendu :
-- Produits -Test : 4 lignes (PUMP001-Test, PUMP002-Test, PUMP003-Test, PUMP004-Test)
-- Vue : ~13 lignes (3+5+2+3)

-- ========== NETTOYAGE ==========
-- ⚠️ Pour nettoyer ces données de test, exécuter :
-- psql -d CENOV_DEV -f test_data/cleanup_test_data_v2.sql
