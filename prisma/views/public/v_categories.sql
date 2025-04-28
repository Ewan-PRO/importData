SELECT
  atr_0.atr_label AS atr_0_label,
  atr_1.atr_label AS atr_1_label,
  atr_2.atr_label AS atr_2_label,
  atr_3.atr_label AS atr_3_label,
  atr_4.atr_label AS atr_4_label,
  atr_5.atr_label AS atr_5_label,
  atr_6.atr_label AS atr_6_label,
  atr_7.atr_label AS atr_7_label
FROM
  (
    (
      (
        (
          (
            (
              (
                attribute atr_0
                LEFT JOIN attribute atr_1 ON (((atr_0.atr_val) :: text = (atr_1.atr_nat) :: text))
              )
              LEFT JOIN attribute atr_2 ON (((atr_1.atr_val) :: text = (atr_2.atr_nat) :: text))
            )
            LEFT JOIN attribute atr_3 ON (((atr_2.atr_val) :: text = (atr_3.atr_nat) :: text))
          )
          LEFT JOIN attribute atr_4 ON (((atr_3.atr_val) :: text = (atr_4.atr_nat) :: text))
        )
        LEFT JOIN attribute atr_5 ON (((atr_4.atr_val) :: text = (atr_5.atr_nat) :: text))
      )
      LEFT JOIN attribute atr_6 ON (((atr_5.atr_val) :: text = (atr_6.atr_nat) :: text))
    )
    LEFT JOIN attribute atr_7 ON (((atr_6.atr_val) :: text = (atr_7.atr_nat) :: text))
  )
WHERE
  ((atr_0.atr_val) :: text = 'CATEGORIE' :: text)
ORDER BY
  atr_0.atr_val,
  atr_1.atr_val,
  atr_2.atr_val,
  atr_3.atr_val,
  atr_4.atr_val,
  atr_5.atr_val,
  atr_6.atr_val,
  atr_7.atr_val;