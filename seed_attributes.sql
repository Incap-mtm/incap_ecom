-- ============================================================
-- Step 1: Create custom attributes (ON CONFLICT DO NOTHING)
-- ============================================================
INSERT INTO attribute (attribute_code, attribute_name, type, display_on_frontend, is_required, is_filterable, sort_order)
VALUES
  ('usos',                 'Usos',               'text', true, false, false, 10),
  ('caracteristicas',      'Características',    'text', true, false, false, 20),
  ('modo_empleo',          'Modo de Empleo',      'text', true, false, false, 30),
  ('codigo_industrial',    'Código Industrial',   'text', true, false, false, 40),
  ('ghs_pictogramas',      'Pictogramas GHS',     'text', true, false, false, 50),
  ('precauciones_h',       'Precauciones H',      'text', true, false, false, 60),
  ('consejos_prudencia_p', 'Consejos P',          'text', true, false, false, 70)
ON CONFLICT (attribute_code) DO NOTHING;

-- ============================================================
-- Step 2: Helper CTEs — gather attribute_ids once
-- ============================================================

-- We'll use a DO block so we can use variables cleanly
DO $$
DECLARE
  v_usos                 int;
  v_caracteristicas      int;
  v_modo_empleo          int;
  v_codigo_industrial    int;
  v_ghs_pictogramas      int;
  v_precauciones_h       int;
  v_consejos_prudencia_p int;

  -- Shared text values
  s1_usos           text := 'ADHESIVO DE ALTA COBERTURA PARA SUPERFICIES';
  s1_modo_empleo    text := 'Preparar: Superficies limpias, secas y libres de grasa.|Aplicar: Aplicar película delgada y uniforme con brocha, espátula o pistola.|Secar: Esperar tiempo de secado indicado antes de unir.|Unir: Presionar firmemente ambas superficies.';
  s1_ghs            text := 'GHS02|GHS07';
  s1_prec_h         text := 'H225: Líquido y vapores muy inflamables. H315: Provoca irritación cutánea. H336: Puede provocar somnolencia o vértigo.';
  s1_cons_p         text := 'P210: Mantener alejado de calor y llamas. P261: Evitar respirar vapores. P280: Usar guantes y protección ocular.';

  -- Incaspray 1 karakteristiken
  is1_caract        text := 'Ideal grandes superficies|Alta fuerza inicial y final|Ideal proceso post-formado|Aplicación manual o pistola';
  -- Incaspray 2 karakteristiken
  is2_caract        text := 'Ideal grandes superficies|Alta fuerza inicial y final|Sin tolueno|Aplicación manual o pistola';

BEGIN
  -- Fetch attribute IDs
  SELECT attribute_id INTO v_usos                 FROM attribute WHERE attribute_code = 'usos';
  SELECT attribute_id INTO v_caracteristicas      FROM attribute WHERE attribute_code = 'caracteristicas';
  SELECT attribute_id INTO v_modo_empleo          FROM attribute WHERE attribute_code = 'modo_empleo';
  SELECT attribute_id INTO v_codigo_industrial    FROM attribute WHERE attribute_code = 'codigo_industrial';
  SELECT attribute_id INTO v_ghs_pictogramas      FROM attribute WHERE attribute_code = 'ghs_pictogramas';
  SELECT attribute_id INTO v_precauciones_h       FROM attribute WHERE attribute_code = 'precauciones_h';
  SELECT attribute_id INTO v_consejos_prudencia_p FROM attribute WHERE attribute_code = 'consejos_prudencia_p';

  -- ============================================================
  -- INCASPRAY 1 — product_ids: 50, 51, 52, 54, 55
  -- ============================================================

  -- product 50 (375cc) — codigo_industrial: 1111120104
  DELETE FROM product_attribute_value_index WHERE product_id = 50 AND attribute_id = v_usos;
  INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text) VALUES (50, v_usos, NULL, s1_usos);

  DELETE FROM product_attribute_value_index WHERE product_id = 50 AND attribute_id = v_caracteristicas;
  INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text) VALUES (50, v_caracteristicas, NULL, is1_caract);

  DELETE FROM product_attribute_value_index WHERE product_id = 50 AND attribute_id = v_modo_empleo;
  INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text) VALUES (50, v_modo_empleo, NULL, s1_modo_empleo);

  DELETE FROM product_attribute_value_index WHERE product_id = 50 AND attribute_id = v_codigo_industrial;
  INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text) VALUES (50, v_codigo_industrial, NULL, '1111120104');

  DELETE FROM product_attribute_value_index WHERE product_id = 50 AND attribute_id = v_ghs_pictogramas;
  INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text) VALUES (50, v_ghs_pictogramas, NULL, s1_ghs);

  DELETE FROM product_attribute_value_index WHERE product_id = 50 AND attribute_id = v_precauciones_h;
  INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text) VALUES (50, v_precauciones_h, NULL, s1_prec_h);

  DELETE FROM product_attribute_value_index WHERE product_id = 50 AND attribute_id = v_consejos_prudencia_p;
  INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text) VALUES (50, v_consejos_prudencia_p, NULL, s1_cons_p);

  -- product 51 (750cc) — codigo_industrial: 1111120109
  DELETE FROM product_attribute_value_index WHERE product_id = 51 AND attribute_id = v_usos;
  INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text) VALUES (51, v_usos, NULL, s1_usos);

  DELETE FROM product_attribute_value_index WHERE product_id = 51 AND attribute_id = v_caracteristicas;
  INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text) VALUES (51, v_caracteristicas, NULL, is1_caract);

  DELETE FROM product_attribute_value_index WHERE product_id = 51 AND attribute_id = v_modo_empleo;
  INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text) VALUES (51, v_modo_empleo, NULL, s1_modo_empleo);

  DELETE FROM product_attribute_value_index WHERE product_id = 51 AND attribute_id = v_codigo_industrial;
  INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text) VALUES (51, v_codigo_industrial, NULL, '1111120109');

  DELETE FROM product_attribute_value_index WHERE product_id = 51 AND attribute_id = v_ghs_pictogramas;
  INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text) VALUES (51, v_ghs_pictogramas, NULL, s1_ghs);

  DELETE FROM product_attribute_value_index WHERE product_id = 51 AND attribute_id = v_precauciones_h;
  INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text) VALUES (51, v_precauciones_h, NULL, s1_prec_h);

  DELETE FROM product_attribute_value_index WHERE product_id = 51 AND attribute_id = v_consejos_prudencia_p;
  INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text) VALUES (51, v_consejos_prudencia_p, NULL, s1_cons_p);

  -- product 52 (2L) — codigo_industrial: 1111120116
  DELETE FROM product_attribute_value_index WHERE product_id = 52 AND attribute_id = v_usos;
  INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text) VALUES (52, v_usos, NULL, s1_usos);

  DELETE FROM product_attribute_value_index WHERE product_id = 52 AND attribute_id = v_caracteristicas;
  INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text) VALUES (52, v_caracteristicas, NULL, is1_caract);

  DELETE FROM product_attribute_value_index WHERE product_id = 52 AND attribute_id = v_modo_empleo;
  INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text) VALUES (52, v_modo_empleo, NULL, s1_modo_empleo);

  DELETE FROM product_attribute_value_index WHERE product_id = 52 AND attribute_id = v_codigo_industrial;
  INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text) VALUES (52, v_codigo_industrial, NULL, '1111120116');

  DELETE FROM product_attribute_value_index WHERE product_id = 52 AND attribute_id = v_ghs_pictogramas;
  INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text) VALUES (52, v_ghs_pictogramas, NULL, s1_ghs);

  DELETE FROM product_attribute_value_index WHERE product_id = 52 AND attribute_id = v_precauciones_h;
  INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text) VALUES (52, v_precauciones_h, NULL, s1_prec_h);

  DELETE FROM product_attribute_value_index WHERE product_id = 52 AND attribute_id = v_consejos_prudencia_p;
  INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text) VALUES (52, v_consejos_prudencia_p, NULL, s1_cons_p);

  -- product 54 (4.5Gal) — codigo_industrial: 1111120127
  DELETE FROM product_attribute_value_index WHERE product_id = 54 AND attribute_id = v_usos;
  INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text) VALUES (54, v_usos, NULL, s1_usos);

  DELETE FROM product_attribute_value_index WHERE product_id = 54 AND attribute_id = v_caracteristicas;
  INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text) VALUES (54, v_caracteristicas, NULL, is1_caract);

  DELETE FROM product_attribute_value_index WHERE product_id = 54 AND attribute_id = v_modo_empleo;
  INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text) VALUES (54, v_modo_empleo, NULL, s1_modo_empleo);

  DELETE FROM product_attribute_value_index WHERE product_id = 54 AND attribute_id = v_codigo_industrial;
  INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text) VALUES (54, v_codigo_industrial, NULL, '1111120127');

  DELETE FROM product_attribute_value_index WHERE product_id = 54 AND attribute_id = v_ghs_pictogramas;
  INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text) VALUES (54, v_ghs_pictogramas, NULL, s1_ghs);

  DELETE FROM product_attribute_value_index WHERE product_id = 54 AND attribute_id = v_precauciones_h;
  INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text) VALUES (54, v_precauciones_h, NULL, s1_prec_h);

  DELETE FROM product_attribute_value_index WHERE product_id = 54 AND attribute_id = v_consejos_prudencia_p;
  INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text) VALUES (54, v_consejos_prudencia_p, NULL, s1_cons_p);

  -- product 55 (8Gal) — codigo_industrial: 1111120383
  DELETE FROM product_attribute_value_index WHERE product_id = 55 AND attribute_id = v_usos;
  INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text) VALUES (55, v_usos, NULL, s1_usos);

  DELETE FROM product_attribute_value_index WHERE product_id = 55 AND attribute_id = v_caracteristicas;
  INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text) VALUES (55, v_caracteristicas, NULL, is1_caract);

  DELETE FROM product_attribute_value_index WHERE product_id = 55 AND attribute_id = v_modo_empleo;
  INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text) VALUES (55, v_modo_empleo, NULL, s1_modo_empleo);

  DELETE FROM product_attribute_value_index WHERE product_id = 55 AND attribute_id = v_codigo_industrial;
  INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text) VALUES (55, v_codigo_industrial, NULL, '1111120383');

  DELETE FROM product_attribute_value_index WHERE product_id = 55 AND attribute_id = v_ghs_pictogramas;
  INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text) VALUES (55, v_ghs_pictogramas, NULL, s1_ghs);

  DELETE FROM product_attribute_value_index WHERE product_id = 55 AND attribute_id = v_precauciones_h;
  INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text) VALUES (55, v_precauciones_h, NULL, s1_prec_h);

  DELETE FROM product_attribute_value_index WHERE product_id = 55 AND attribute_id = v_consejos_prudencia_p;
  INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text) VALUES (55, v_consejos_prudencia_p, NULL, s1_cons_p);

  -- ============================================================
  -- INCASPRAY 2 — product_ids: 59, 60, 61, 63, 64
  -- ============================================================

  -- product 59 (375cc) — codigo_industrial: 1111120104
  DELETE FROM product_attribute_value_index WHERE product_id = 59 AND attribute_id = v_usos;
  INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text) VALUES (59, v_usos, NULL, s1_usos);

  DELETE FROM product_attribute_value_index WHERE product_id = 59 AND attribute_id = v_caracteristicas;
  INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text) VALUES (59, v_caracteristicas, NULL, is2_caract);

  DELETE FROM product_attribute_value_index WHERE product_id = 59 AND attribute_id = v_modo_empleo;
  INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text) VALUES (59, v_modo_empleo, NULL, s1_modo_empleo);

  DELETE FROM product_attribute_value_index WHERE product_id = 59 AND attribute_id = v_codigo_industrial;
  INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text) VALUES (59, v_codigo_industrial, NULL, '1111120104');

  DELETE FROM product_attribute_value_index WHERE product_id = 59 AND attribute_id = v_ghs_pictogramas;
  INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text) VALUES (59, v_ghs_pictogramas, NULL, s1_ghs);

  DELETE FROM product_attribute_value_index WHERE product_id = 59 AND attribute_id = v_precauciones_h;
  INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text) VALUES (59, v_precauciones_h, NULL, s1_prec_h);

  DELETE FROM product_attribute_value_index WHERE product_id = 59 AND attribute_id = v_consejos_prudencia_p;
  INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text) VALUES (59, v_consejos_prudencia_p, NULL, s1_cons_p);

  -- product 60 (750cc) — codigo_industrial: 1111120109
  DELETE FROM product_attribute_value_index WHERE product_id = 60 AND attribute_id = v_usos;
  INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text) VALUES (60, v_usos, NULL, s1_usos);

  DELETE FROM product_attribute_value_index WHERE product_id = 60 AND attribute_id = v_caracteristicas;
  INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text) VALUES (60, v_caracteristicas, NULL, is2_caract);

  DELETE FROM product_attribute_value_index WHERE product_id = 60 AND attribute_id = v_modo_empleo;
  INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text) VALUES (60, v_modo_empleo, NULL, s1_modo_empleo);

  DELETE FROM product_attribute_value_index WHERE product_id = 60 AND attribute_id = v_codigo_industrial;
  INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text) VALUES (60, v_codigo_industrial, NULL, '1111120109');

  DELETE FROM product_attribute_value_index WHERE product_id = 60 AND attribute_id = v_ghs_pictogramas;
  INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text) VALUES (60, v_ghs_pictogramas, NULL, s1_ghs);

  DELETE FROM product_attribute_value_index WHERE product_id = 60 AND attribute_id = v_precauciones_h;
  INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text) VALUES (60, v_precauciones_h, NULL, s1_prec_h);

  DELETE FROM product_attribute_value_index WHERE product_id = 60 AND attribute_id = v_consejos_prudencia_p;
  INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text) VALUES (60, v_consejos_prudencia_p, NULL, s1_cons_p);

  -- product 61 (2L) — codigo_industrial: 1111120116
  DELETE FROM product_attribute_value_index WHERE product_id = 61 AND attribute_id = v_usos;
  INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text) VALUES (61, v_usos, NULL, s1_usos);

  DELETE FROM product_attribute_value_index WHERE product_id = 61 AND attribute_id = v_caracteristicas;
  INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text) VALUES (61, v_caracteristicas, NULL, is2_caract);

  DELETE FROM product_attribute_value_index WHERE product_id = 61 AND attribute_id = v_modo_empleo;
  INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text) VALUES (61, v_modo_empleo, NULL, s1_modo_empleo);

  DELETE FROM product_attribute_value_index WHERE product_id = 61 AND attribute_id = v_codigo_industrial;
  INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text) VALUES (61, v_codigo_industrial, NULL, '1111120116');

  DELETE FROM product_attribute_value_index WHERE product_id = 61 AND attribute_id = v_ghs_pictogramas;
  INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text) VALUES (61, v_ghs_pictogramas, NULL, s1_ghs);

  DELETE FROM product_attribute_value_index WHERE product_id = 61 AND attribute_id = v_precauciones_h;
  INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text) VALUES (61, v_precauciones_h, NULL, s1_prec_h);

  DELETE FROM product_attribute_value_index WHERE product_id = 61 AND attribute_id = v_consejos_prudencia_p;
  INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text) VALUES (61, v_consejos_prudencia_p, NULL, s1_cons_p);

  -- product 63 (4.5Gal) — codigo_industrial: 1111120127
  DELETE FROM product_attribute_value_index WHERE product_id = 63 AND attribute_id = v_usos;
  INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text) VALUES (63, v_usos, NULL, s1_usos);

  DELETE FROM product_attribute_value_index WHERE product_id = 63 AND attribute_id = v_caracteristicas;
  INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text) VALUES (63, v_caracteristicas, NULL, is2_caract);

  DELETE FROM product_attribute_value_index WHERE product_id = 63 AND attribute_id = v_modo_empleo;
  INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text) VALUES (63, v_modo_empleo, NULL, s1_modo_empleo);

  DELETE FROM product_attribute_value_index WHERE product_id = 63 AND attribute_id = v_codigo_industrial;
  INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text) VALUES (63, v_codigo_industrial, NULL, '1111120127');

  DELETE FROM product_attribute_value_index WHERE product_id = 63 AND attribute_id = v_ghs_pictogramas;
  INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text) VALUES (63, v_ghs_pictogramas, NULL, s1_ghs);

  DELETE FROM product_attribute_value_index WHERE product_id = 63 AND attribute_id = v_precauciones_h;
  INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text) VALUES (63, v_precauciones_h, NULL, s1_prec_h);

  DELETE FROM product_attribute_value_index WHERE product_id = 63 AND attribute_id = v_consejos_prudencia_p;
  INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text) VALUES (63, v_consejos_prudencia_p, NULL, s1_cons_p);

  -- product 64 (8Gal) — codigo_industrial: 1111120383
  DELETE FROM product_attribute_value_index WHERE product_id = 64 AND attribute_id = v_usos;
  INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text) VALUES (64, v_usos, NULL, s1_usos);

  DELETE FROM product_attribute_value_index WHERE product_id = 64 AND attribute_id = v_caracteristicas;
  INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text) VALUES (64, v_caracteristicas, NULL, is2_caract);

  DELETE FROM product_attribute_value_index WHERE product_id = 64 AND attribute_id = v_modo_empleo;
  INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text) VALUES (64, v_modo_empleo, NULL, s1_modo_empleo);

  DELETE FROM product_attribute_value_index WHERE product_id = 64 AND attribute_id = v_codigo_industrial;
  INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text) VALUES (64, v_codigo_industrial, NULL, '1111120383');

  DELETE FROM product_attribute_value_index WHERE product_id = 64 AND attribute_id = v_ghs_pictogramas;
  INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text) VALUES (64, v_ghs_pictogramas, NULL, s1_ghs);

  DELETE FROM product_attribute_value_index WHERE product_id = 64 AND attribute_id = v_precauciones_h;
  INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text) VALUES (64, v_precauciones_h, NULL, s1_prec_h);

  DELETE FROM product_attribute_value_index WHERE product_id = 64 AND attribute_id = v_consejos_prudencia_p;
  INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text) VALUES (64, v_consejos_prudencia_p, NULL, s1_cons_p);

END $$;
