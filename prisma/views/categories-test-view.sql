SELECT row_number()
       OVER (ORDER BY COALESCE(atr_6.atr_id, atr_5.atr_id, atr_4.atr_id, atr_3.atr_id, atr_2.atr_id, atr_1.atr_id, atr_0.atr_id) DESC)::integer AS row_key,
       COALESCE(atr_6.atr_id, atr_5.atr_id, atr_4.atr_id, atr_3.atr_id, atr_2.atr_id, atr_1.atr_id,
                atr_0.atr_id)                                                                                                           AS atr_id,
       'Catégorie des produits'::character varying(100)                                                                                 AS atr_0_label,
       atr_0.atr_label                                                                                                                  AS atr_1_label,
       atr_1.atr_label                                                                                                                  AS atr_2_label,
       atr_2.atr_label                                                                                                                  AS atr_3_label,
       atr_3.atr_label                                                                                                                  AS atr_4_label,
       atr_4.atr_label                                                                                                                  AS atr_5_label,
       atr_5.atr_label                                                                                                                  AS atr_6_label,
       atr_6.atr_label                                                                                                                  AS atr_7_label
FROM attribute_dev atr_0
         LEFT JOIN attribute_dev atr_1 ON atr_0.atr_val::text = atr_1.atr_nat::text
         LEFT JOIN attribute_dev atr_2 ON atr_1.atr_val::text = atr_2.atr_nat::text
         LEFT JOIN attribute_dev atr_3 ON atr_2.atr_val::text = atr_3.atr_nat::text
         LEFT JOIN attribute_dev atr_4 ON atr_3.atr_val::text = atr_4.atr_nat::text
         LEFT JOIN attribute_dev atr_5 ON atr_4.atr_val::text = atr_5.atr_nat::text
         LEFT JOIN attribute_dev atr_6 ON atr_5.atr_val::text = atr_6.atr_nat::text
WHERE atr_0.atr_nat::text = 'CATEGORIE'::text
ORDER BY COALESCE(atr_6.atr_id, atr_5.atr_id, atr_4.atr_id, atr_3.atr_id, atr_2.atr_id, atr_1.atr_id, atr_0.atr_id) DESC;

-- CHANGEMENTS par rapport à la vue originale :
-- 1. row_number() OVER utilise maintenant COALESCE(...atr_id) DESC au lieu de atr_val
-- 2. ORDER BY final utilise COALESCE(...atr_id) DESC au lieu des atr_val
-- 
-- RÉSULTAT ATTENDU :
-- - "test" (atr_id: 1344) aura row_key: 1 (plus récent)
-- - "11" (atr_id: 1343) aura row_key: 2 (plus ancien)
-- 
-- POUR CRÉER LA VUE EN TEST :
-- CREATE VIEW v_categories_test AS (...contenu de ce fichier...);