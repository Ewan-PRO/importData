SELECT
  p.pro_id,
  p.pro_cenov_id AS cenov_id,
  p.pro_code,
  s.sup_id AS supplier_id,
  s.sup_code AS supplier_code,
  s.sup_label AS supplier_name,
  f1.fam_label AS famille,
  f2.fam_label AS sous_famille,
  f3.fam_label AS sous_sous_famille,
  c.cat_label AS category_label,
  c.cat_code AS category_id,
  k.kit_label AS nom_commercial,
  max(
    (
      CASE
        WHEN ((a.atr_code) :: text = 'ATT0000039' :: text) THEN ka.kat_value
        ELSE NULL :: character varying
      END
    ) :: text
  ) AS pression_limite_mbar,
  max(
    (
      CASE
        WHEN ((a.atr_code) :: text = 'ATT0000040' :: text) THEN ka.kat_value
        ELSE NULL :: character varying
      END
    ) :: text
  ) AS puissance_kw,
  max(
    (
      CASE
        WHEN ((a.atr_code) :: text = 'ATT0000053' :: text) THEN ka.kat_value
        ELSE NULL :: character varying
      END
    ) :: text
  ) AS att0000053,
  max(
    (
      CASE
        WHEN ((a.atr_code) :: text = 'ATT0000054' :: text) THEN ka.kat_value
        ELSE NULL :: character varying
      END
    ) :: text
  ) AS att0000054,
  max(
    (
      CASE
        WHEN ((a.atr_code) :: text = 'ATT0000055' :: text) THEN ka.kat_value
        ELSE NULL :: character varying
      END
    ) :: text
  ) AS att0000055,
  max(
    (
      CASE
        WHEN ((a.atr_code) :: text = 'ATT0000056' :: text) THEN ka.kat_value
        ELSE NULL :: character varying
      END
    ) :: text
  ) AS att0000056,
  d.doc_data_source AS data_source,
  d.doc_type_file_source AS type_file_source,
  d.doc_link_source AS link_source,
  p.updated_at AS modification_date
FROM
  (
    (
      (
        (
          (
            (
              (
                (
                  (
                    (
                      (
                        produit.product p
                        LEFT JOIN supplier s ON ((p.fk_supplier = s.sup_id))
                      )
                      LEFT JOIN produit.family f1 ON ((p.fk_family = f1.fam_id))
                    )
                    LEFT JOIN produit.family f2 ON ((f1.fam_id = f2.fk_parent))
                  )
                  LEFT JOIN produit.family f3 ON ((f2.fam_id = f3.fk_parent))
                )
                LEFT JOIN produit.product_category pc ON ((p.pro_id = pc.fk_product))
              )
              LEFT JOIN produit.category c ON ((pc.fk_category = c.cat_id))
            )
            LEFT JOIN kit k ON ((p.fk_kit = k.kit_id))
          )
          LEFT JOIN kit_attribute ka ON ((k.kit_id = ka.fk_kit))
        )
        LEFT JOIN attribute a ON ((ka.fk_attribute_characteristic = a.atr_id))
      )
      LEFT JOIN document_link dl ON (
        (
          ((dl.entity_type) :: text = 'product' :: text)
          AND (dl.entity_id = p.pro_id)
        )
      )
    )
    LEFT JOIN document d ON ((dl.fk_document = d.doc_id))
  )
GROUP BY
  p.pro_id,
  p.pro_cenov_id,
  p.pro_code,
  s.sup_id,
  s.sup_code,
  s.sup_label,
  f1.fam_label,
  f2.fam_label,
  f3.fam_label,
  c.cat_label,
  c.cat_code,
  k.kit_label,
  d.doc_data_source,
  d.doc_type_file_source,
  d.doc_link_source,
  p.updated_at;