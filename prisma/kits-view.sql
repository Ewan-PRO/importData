SELECT kat.kat_id AS id,
       kit.kit_label,
       attribute_carac.atr_label,
       attribute.atr_val,
       kat.kat_valeur
FROM kit
         JOIN kit_attribute kat ON kit.kit_id = kat.fk_kit
         JOIN attribute attribute_carac
              ON attribute_carac.atr_nat::text = 'CARAC'::text AND kat.fk_attribute_carac = attribute_carac.atr_id
         JOIN attribute ON kat.fk_attribute = attribute.atr_id