SELECT row_number()
       OVER (ORDER BY atr_0.atr_val, atr_1.atr_val, atr_2.atr_val, atr_3.atr_val, atr_4.atr_val, atr_5.atr_val, atr_6.atr_val)::integer AS row_key,
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
ORDER BY atr_0.atr_val, atr_1.atr_val, atr_2.atr_val, atr_3.atr_val, atr_4.atr_val, atr_5.atr_val, atr_6.atr_val