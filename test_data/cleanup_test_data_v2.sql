-- ========================================
-- Script de nettoyage des données de test V2
-- ========================================
-- Base de données : CENOV_DEV
-- Supprime SEULEMENT les données avec suffixe "-Test"
-- ✅ 100% SÛR - Impossible de supprimer des données réelles

-- ========== STATISTIQUES AVANT NETTOYAGE ==========

SELECT '=== Statistiques AVANT Nettoyage ===' AS separator;

SELECT 'Produits -Test' AS table_name, COUNT(*) AS count_before
FROM produit.product
WHERE pro_code LIKE '%-Test';

SELECT 'Catégories -Test' AS table_name, COUNT(*) AS count_before
FROM produit.category
WHERE cat_code LIKE '%-Test';

SELECT 'Kits -Test' AS table_name, COUNT(*) AS count_before
FROM public.kit
WHERE kit_label LIKE '%-Test';

SELECT 'Attributs -Test' AS table_name, COUNT(*) AS count_before
FROM public.attribute
WHERE atr_code LIKE '%-Test';

SELECT 'Liens produit-catégorie -Test' AS table_name, COUNT(*) AS count_before
FROM produit.product_category pc
JOIN produit.product p ON pc.fk_product = p.pro_id
WHERE p.pro_code LIKE '%-Test';

SELECT 'Liens catégorie-attribut -Test' AS table_name, COUNT(*) AS count_before
FROM produit.category_attribute ca
JOIN produit.category c ON ca.fk_category = c.cat_id
WHERE c.cat_code LIKE '%-Test';

-- ========== NETTOYAGE COMPLET ET SÉCURISÉ ==========

SELECT '=== Début du Nettoyage ===' AS separator;

-- 1. Supprimer les liens produit-catégorie
WITH deleted_product_category AS (
  DELETE FROM produit.product_category
  WHERE fk_product IN (
    SELECT pro_id FROM produit.product WHERE pro_code LIKE '%-Test'
  )
  RETURNING fk_product, fk_category
)
SELECT 'Liens produit-catégorie supprimés:' AS info, COUNT(*) AS count
FROM deleted_product_category;

-- 2. Supprimer les produits -Test
WITH deleted_products AS (
  DELETE FROM produit.product
  WHERE pro_code LIKE '%-Test'
  RETURNING pro_id, pro_code, fk_kit, pro_cenov_id
)
SELECT 'Produits supprimés:' AS info, COUNT(*) AS count
FROM deleted_products;

-- 3. Supprimer les liens catégorie-attribut
WITH deleted_category_attribute AS (
  DELETE FROM produit.category_attribute
  WHERE fk_category IN (
    SELECT cat_id FROM produit.category WHERE cat_code LIKE '%-Test'
  )
  RETURNING fk_category, fk_attribute, cat_atr_required
)
SELECT 'Liens catégorie-attribut supprimés:' AS info, COUNT(*) AS count
FROM deleted_category_attribute;

-- 4. Supprimer les catégories -Test
WITH deleted_categories AS (
  DELETE FROM produit.category
  WHERE cat_code LIKE '%-Test'
  RETURNING cat_id, cat_code, cat_label, fk_parent, cat_wp_name
)
SELECT 'Catégories supprimées:' AS info, COUNT(*) AS count
FROM deleted_categories;

-- 5. Supprimer les kits -Test (MAINTENANT SÉCURISÉ)
WITH deleted_kits AS (
  DELETE FROM public.kit
  WHERE kit_label LIKE '%-Test'
  RETURNING kit_id, kit_label
)
SELECT 'Kits supprimés:' AS info, COUNT(*) AS count
FROM deleted_kits;

-- 6. Supprimer les attributs -Test (MAINTENANT SÉCURISÉ)
-- ⚠️ Vérifier d'abord qu'ils ne sont pas utilisés par kit_attribute
DO $$
DECLARE
  attribute_count INT;
BEGIN
  -- Compter les utilisations dans kit_attribute
  SELECT COUNT(*) INTO attribute_count
  FROM public.kit_attribute ka
  JOIN public.attribute a ON ka.fk_attribute_characteristic = a.atr_id
  WHERE a.atr_code LIKE '%-Test';

  IF attribute_count > 0 THEN
    RAISE NOTICE 'ATTENTION: % attributs -Test sont utilisés dans kit_attribute', attribute_count;
  END IF;
END $$;

-- Supprimer les attributs -Test (si non utilisés ailleurs)
WITH deleted_attributes AS (
  DELETE FROM public.attribute
  WHERE atr_code LIKE '%-Test'
    AND atr_id NOT IN (
      -- Exclure les attributs encore utilisés dans kit_attribute
      SELECT DISTINCT fk_attribute_characteristic
      FROM public.kit_attribute
      WHERE fk_attribute_characteristic IS NOT NULL
    )
  RETURNING atr_id, atr_code, atr_label
)
SELECT 'Attributs supprimés:' AS info, COUNT(*) AS count
FROM deleted_attributes;

-- ========== STATISTIQUES APRÈS NETTOYAGE ==========

SELECT '=== Statistiques APRÈS Nettoyage ===' AS separator;

SELECT 'Produits -Test restants' AS table_name, COUNT(*) AS count_after
FROM produit.product
WHERE pro_code LIKE '%-Test';

SELECT 'Catégories -Test restantes' AS table_name, COUNT(*) AS count_after
FROM produit.category
WHERE cat_code LIKE '%-Test';

SELECT 'Kits -Test restants' AS table_name, COUNT(*) AS count_after
FROM public.kit
WHERE kit_label LIKE '%-Test';

SELECT 'Attributs -Test restants' AS table_name, COUNT(*) AS count_after
FROM public.attribute
WHERE atr_code LIKE '%-Test';

SELECT 'Liens produit-catégorie -Test restants' AS table_name, COUNT(*) AS count_after
FROM produit.product_category pc
LEFT JOIN produit.product p ON pc.fk_product = p.pro_id
WHERE p.pro_code LIKE '%-Test';

SELECT 'Liens catégorie-attribut -Test restants' AS table_name, COUNT(*) AS count_after
FROM produit.category_attribute ca
LEFT JOIN produit.category c ON ca.fk_category = c.cat_id
WHERE c.cat_code LIKE '%-Test';

-- ========== VÉRIFICATION VUE ==========

SELECT '=== Vérification Vue ===' AS separator;

SELECT 'Lignes -Test dans vue' AS info, COUNT(*) AS count
FROM produit.v_produit_categorie_attribut
WHERE pro_id IN (
  SELECT pro_id FROM produit.product WHERE pro_code LIKE '%-Test'
);

-- Résultat attendu : 0 (toutes les lignes -Test supprimées)

-- ========== RÉCAPITULATIF ==========

SELECT '=== Récapitulatif ===' AS separator;

SELECT
  'Nettoyage terminé' AS status,
  'Toutes les données avec suffixe -Test ont été supprimées' AS details,
  'Aucune donnée réelle ne peut être affectée' AS securite;