SELECT
  DISTINCT ta.fk_product AS fk_produit,
  ta.pp_date AS taa_date,
  ta.pp_amount AS taa_montant,
  ta.pp_discount AS taa_remise,
  ta.pp_net_amount AS taa_montant_net
FROM
  (
    produit.price_purchase ta
    JOIN (
      SELECT
        price_purchase.fk_product AS fk_produit,
        max(price_purchase.pp_date) AS taa_date
      FROM
        produit.price_purchase
      GROUP BY
        price_purchase.fk_product
    ) ta_max ON (
      (
        (ta.fk_product = ta_max.fk_produit)
        AND (ta.pp_date = ta_max.taa_date)
      )
    )
  );