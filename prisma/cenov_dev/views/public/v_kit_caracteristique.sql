SELECT
  kit.kit_label,
  attribute_carac.atr_label,
  kat.kat_valeur AS valeur,
  attribut.atr_value AS unit
FROM
  (
    (
      (
        kit
        JOIN kit_attribute kat ON ((kit.kit_id = kat.fk_kit))
      )
      JOIN attribut attribute_carac ON (
        (
          (
            (attribute_carac.atr_nature) :: text = 'CARAC' :: text
          )
          AND (kat.fk_attribute_carac = attribute_carac.atr_id)
        )
      )
    )
    JOIN attribut ON ((kat.fk_attribute_unit = attribut.atr_id))
  );