-- Script de test pour v_produit_categorie_attribut
-- Version ADAPTATIVE (fonctionne même si les tables contiennent déjà des données)
-- Base de données : CENOV_DEV

-- ========== NETTOYAGE (OPTIONNEL) ==========
-- ⚠️ Décommentez seulement si vous voulez supprimer les données de test existantes

-- DELETE FROM produit.product_category WHERE fk_product IN (
--   SELECT pro_id FROM produit.product WHERE pro_code LIKE 'PUMP%'
-- );
-- DELETE FROM produit.product WHERE pro_code LIKE 'PUMP%';
-- DELETE FROM produit.category_attribute WHERE fk_category IN (
--   SELECT cat_id FROM produit.category WHERE cat_code LIKE 'CAT%'
-- );
-- DELETE FROM produit.category WHERE cat_code LIKE 'CAT%';
-- DELETE FROM public.kit WHERE kit_label LIKE 'Pompe%';
-- DELETE FROM public.attribute WHERE atr_code IN ('PWR', 'FLOW', 'PRESS');

-- ========== INSERTIONS AVEC CAPTURE D'IDS ==========

-- 1. Insérer attributs et capturer les IDs
WITH inserted_attributes AS (
  INSERT INTO public.attribute (atr_nature, atr_label, atr_code, atr_symbol_intl, atr_description)
  VALUES
    ('CARACTERISTIQUE', 'Puissance', 'PWR', 'kW', 'Puissance nominale en kilowatts'),
    ('CARACTERISTIQUE', 'Débit', 'FLOW', 'm³/h', 'Débit volumique'),
    ('CARACTERISTIQUE', 'Pression', 'PRESS', 'bar', 'Pression maximale')
  ON CONFLICT (atr_nature, atr_value) DO UPDATE SET atr_label = EXCLUDED.atr_label
  RETURNING atr_id, atr_code, atr_label
)
SELECT 'Attributs créés:' AS info, atr_id, atr_code, atr_label FROM inserted_attributes;

-- 2. Insérer kits et capturer les IDs
WITH inserted_kits AS (
  INSERT INTO public.kit (kit_label)
  VALUES
    ('Pompe Centrifuge Électrique'),
    ('Pompe Immergée'),
    ('Pompe Manuelle')
  ON CONFLICT DO NOTHING
  RETURNING kit_id, kit_label
)
SELECT 'Kits créés:' AS info, kit_id, kit_label FROM inserted_kits;

-- 3. Insérer catégories et capturer les IDs
WITH inserted_categories AS (
  INSERT INTO produit.category (cat_code, cat_label, fk_parent, cat_wp_name)
  VALUES
    ('CAT001', 'Pompes Industrielles', NULL, 'pompes-industrielles'),
    ('CAT002', 'Pompes Électriques', NULL, 'pompes-electriques')
  ON CONFLICT (fk_parent, cat_code) DO UPDATE SET cat_label = EXCLUDED.cat_label
  RETURNING cat_id, cat_code, cat_label
)
SELECT 'Catégories créées:' AS info, cat_id, cat_code, cat_label FROM inserted_categories;

-- ========== AFFICHER LES IDS POUR RÉFÉRENCE ==========
SELECT '=== IDs Générés ===' AS separator;

-- IDs des attributs
SELECT 'Attributs:' AS table_name, atr_id, atr_code, atr_label
FROM public.attribute
WHERE atr_code IN ('PWR', 'FLOW', 'PRESS')
ORDER BY atr_id;

-- IDs des kits
SELECT 'Kits:' AS table_name, kit_id, kit_label
FROM public.kit
WHERE kit_label LIKE 'Pompe%'
ORDER BY kit_id;

-- IDs des catégories
SELECT 'Catégories:' AS table_name, cat_id, cat_code, cat_label
FROM produit.category
WHERE cat_code LIKE 'CAT%'
ORDER BY cat_id;

-- ========== INSERTIONS AVEC SOUS-REQUÊTES (IDs Dynamiques) ==========

-- 4. Lier catégories et attributs (DYNAMIQUE)
INSERT INTO produit.category_attribute (fk_category, fk_attribute, cat_atr_required)
SELECT
  c.cat_id,
  a.atr_id,
  CASE
    WHEN c.cat_code = 'CAT001' AND a.atr_code = 'PWR' THEN true
    WHEN c.cat_code = 'CAT001' AND a.atr_code = 'FLOW' THEN true
    WHEN c.cat_code = 'CAT001' AND a.atr_code = 'PRESS' THEN false
    WHEN c.cat_code = 'CAT002' AND a.atr_code = 'PWR' THEN true
    WHEN c.cat_code = 'CAT002' AND a.atr_code = 'FLOW' THEN false
    ELSE false
  END AS cat_atr_required
FROM produit.category c
CROSS JOIN public.attribute a
WHERE c.cat_code IN ('CAT001', 'CAT002')
  AND a.atr_code IN ('PWR', 'FLOW', 'PRESS')
  AND (
    (c.cat_code = 'CAT001' AND a.atr_code IN ('PWR', 'FLOW', 'PRESS'))
    OR (c.cat_code = 'CAT002' AND a.atr_code IN ('PWR', 'FLOW'))
  )
ON CONFLICT (fk_category, fk_attribute) DO UPDATE
SET cat_atr_required = EXCLUDED.cat_atr_required;

SELECT 'Liens catégorie-attribut créés:' AS info, COUNT(*) AS count
FROM produit.category_attribute ca
JOIN produit.category c ON ca.fk_category = c.cat_id
WHERE c.cat_code IN ('CAT001', 'CAT002');

-- 5. Insérer produits (DYNAMIQUE avec IDs de kits)
WITH inserted_products AS (
  INSERT INTO produit.product (pro_code, fk_kit, pro_cenov_id)
  SELECT 'PUMP001', k.kit_id, 'CEN001'
  FROM public.kit k WHERE k.kit_label = 'Pompe Centrifuge Électrique'
  UNION ALL
  SELECT 'PUMP002', k.kit_id, 'CEN002'
  FROM public.kit k WHERE k.kit_label = 'Pompe Centrifuge Électrique'
  UNION ALL
  SELECT 'PUMP003', k.kit_id, 'CEN003'
  FROM public.kit k WHERE k.kit_label = 'Pompe Immergée'
  ON CONFLICT DO NOTHING
  RETURNING pro_id, pro_code, fk_kit
)
SELECT 'Produits créés:' AS info, pro_id, pro_code FROM inserted_products;

-- Afficher les IDs des produits créés
SELECT 'Produits:' AS table_name, pro_id, pro_code, fk_kit
FROM produit.product
WHERE pro_code LIKE 'PUMP%'
ORDER BY pro_id;

-- 6. Lier produits et catégories (DYNAMIQUE)
INSERT INTO produit.product_category (fk_product, fk_category)
SELECT p.pro_id, c.cat_id
FROM produit.product p
CROSS JOIN produit.category c
WHERE p.pro_code IN ('PUMP001', 'PUMP002', 'PUMP003')
  AND c.cat_code IN ('CAT001', 'CAT002')
  AND (
    (p.pro_code = 'PUMP001' AND c.cat_code = 'CAT001')
    OR (p.pro_code = 'PUMP002' AND c.cat_code IN ('CAT001', 'CAT002'))
    OR (p.pro_code = 'PUMP003' AND c.cat_code = 'CAT002')
  )
ON CONFLICT (fk_product, fk_category) DO NOTHING;

SELECT 'Liens produit-catégorie créés:' AS info, COUNT(*) AS count
FROM produit.product_category pc
JOIN produit.product p ON pc.fk_product = p.pro_id
WHERE p.pro_code LIKE 'PUMP%';

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
  SELECT pro_id FROM produit.product WHERE pro_code LIKE 'PUMP%'
)
ORDER BY pro_id, atr_id;

-- Statistiques
SELECT '=== Statistiques ===' AS separator;

SELECT
  'Nombre de lignes dans la vue pour produits PUMP' AS info,
  COUNT(*) AS count
FROM produit.v_produit_categorie_attribut
WHERE pro_id IN (
  SELECT pro_id FROM produit.product WHERE pro_code LIKE 'PUMP%'
);

-- ========== TEST MISE À JOUR DYNAMIQUE ==========

SELECT '=== Test Mise à Jour Dynamique ===' AS separator;

-- Ajouter un nouveau produit (PUMP004)
WITH new_product AS (
  INSERT INTO produit.product (pro_code, fk_kit, pro_cenov_id)
  SELECT 'PUMP004', k.kit_id, 'CEN004'
  FROM public.kit k WHERE k.kit_label = 'Pompe Manuelle'
  ON CONFLICT DO NOTHING
  RETURNING pro_id, pro_code
)
SELECT 'Nouveau produit créé:' AS info, pro_id, pro_code FROM new_product;

-- Lier à une catégorie
INSERT INTO produit.product_category (fk_product, fk_category)
SELECT p.pro_id, c.cat_id
FROM produit.product p
JOIN produit.category c ON c.cat_code = 'CAT001'
WHERE p.pro_code = 'PUMP004'
ON CONFLICT (fk_product, fk_category) DO NOTHING;

-- Vérifier que la vue est IMMÉDIATEMENT à jour
SELECT '=== Vue après ajout PUMP004 (DOIT afficher 3 lignes) ===' AS separator;

SELECT *
FROM produit.v_produit_categorie_attribut
WHERE pro_id = (
  SELECT pro_id FROM produit.product WHERE pro_code = 'PUMP004'
)
ORDER BY atr_id;

-- ========== RÉCAPITULATIF FINAL ==========

SELECT '=== Récapitulatif Final ===' AS separator;

SELECT
  'Total produits PUMP' AS metrique,
  COUNT(*) AS valeur
FROM produit.product
WHERE pro_code LIKE 'PUMP%'
UNION ALL
SELECT
  'Total lignes dans vue',
  COUNT(*)
FROM produit.v_produit_categorie_attribut
WHERE pro_id IN (
  SELECT pro_id FROM produit.product WHERE pro_code LIKE 'PUMP%'
);

-- Résultat attendu :
-- Produits PUMP : 4 lignes (PUMP001, PUMP002, PUMP003, PUMP004)
-- Vue : ~14 lignes (3+6+2+3)
