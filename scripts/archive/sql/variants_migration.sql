-- =============================================
-- INCAP Variant System Migration
-- =============================================

BEGIN;

-- 1. Create 'presentacion' select attribute
INSERT INTO attribute (attribute_code, attribute_name, type, is_required, display_on_frontend, sort_order, is_filterable)
VALUES ('presentacion', 'Presentación', 'select', false, true, 10, true)
ON CONFLICT (attribute_code) DO NOTHING;

-- 2. Insert presentacion options (21 sizes)
INSERT INTO attribute_option (attribute_id, attribute_code, option_text)
  SELECT attribute_id, 'presentacion', '10L' FROM attribute WHERE attribute_code = 'presentacion'
  ON CONFLICT DO NOTHING;
INSERT INTO attribute_option (attribute_id, attribute_code, option_text)
  SELECT attribute_id, 'presentacion', '120cc' FROM attribute WHERE attribute_code = 'presentacion'
  ON CONFLICT DO NOTHING;
INSERT INTO attribute_option (attribute_id, attribute_code, option_text)
  SELECT attribute_id, 'presentacion', '15 Gal' FROM attribute WHERE attribute_code = 'presentacion'
  ON CONFLICT DO NOTHING;
INSERT INTO attribute_option (attribute_id, attribute_code, option_text)
  SELECT attribute_id, 'presentacion', '1L' FROM attribute WHERE attribute_code = 'presentacion'
  ON CONFLICT DO NOTHING;
INSERT INTO attribute_option (attribute_id, attribute_code, option_text)
  SELECT attribute_id, 'presentacion', '250cc' FROM attribute WHERE attribute_code = 'presentacion'
  ON CONFLICT DO NOTHING;
INSERT INTO attribute_option (attribute_id, attribute_code, option_text)
  SELECT attribute_id, 'presentacion', '2L' FROM attribute WHERE attribute_code = 'presentacion'
  ON CONFLICT DO NOTHING;
INSERT INTO attribute_option (attribute_id, attribute_code, option_text)
  SELECT attribute_id, 'presentacion', '3.6L' FROM attribute WHERE attribute_code = 'presentacion'
  ON CONFLICT DO NOTHING;
INSERT INTO attribute_option (attribute_id, attribute_code, option_text)
  SELECT attribute_id, 'presentacion', '3.8 Gal' FROM attribute WHERE attribute_code = 'presentacion'
  ON CONFLICT DO NOTHING;
INSERT INTO attribute_option (attribute_id, attribute_code, option_text)
  SELECT attribute_id, 'presentacion', '375cc' FROM attribute WHERE attribute_code = 'presentacion'
  ON CONFLICT DO NOTHING;
INSERT INTO attribute_option (attribute_id, attribute_code, option_text)
  SELECT attribute_id, 'presentacion', '3L' FROM attribute WHERE attribute_code = 'presentacion'
  ON CONFLICT DO NOTHING;
INSERT INTO attribute_option (attribute_id, attribute_code, option_text)
  SELECT attribute_id, 'presentacion', '4 Gal' FROM attribute WHERE attribute_code = 'presentacion'
  ON CONFLICT DO NOTHING;
INSERT INTO attribute_option (attribute_id, attribute_code, option_text)
  SELECT attribute_id, 'presentacion', '4.3 Gal' FROM attribute WHERE attribute_code = 'presentacion'
  ON CONFLICT DO NOTHING;
INSERT INTO attribute_option (attribute_id, attribute_code, option_text)
  SELECT attribute_id, 'presentacion', '4.5 Gal' FROM attribute WHERE attribute_code = 'presentacion'
  ON CONFLICT DO NOTHING;
INSERT INTO attribute_option (attribute_id, attribute_code, option_text)
  SELECT attribute_id, 'presentacion', '5 Gal' FROM attribute WHERE attribute_code = 'presentacion'
  ON CONFLICT DO NOTHING;
INSERT INTO attribute_option (attribute_id, attribute_code, option_text)
  SELECT attribute_id, 'presentacion', '5.5 gal' FROM attribute WHERE attribute_code = 'presentacion'
  ON CONFLICT DO NOTHING;
INSERT INTO attribute_option (attribute_id, attribute_code, option_text)
  SELECT attribute_id, 'presentacion', '500cc' FROM attribute WHERE attribute_code = 'presentacion'
  ON CONFLICT DO NOTHING;
INSERT INTO attribute_option (attribute_id, attribute_code, option_text)
  SELECT attribute_id, 'presentacion', '53 Gal' FROM attribute WHERE attribute_code = 'presentacion'
  ON CONFLICT DO NOTHING;
INSERT INTO attribute_option (attribute_id, attribute_code, option_text)
  SELECT attribute_id, 'presentacion', '55 Gal' FROM attribute WHERE attribute_code = 'presentacion'
  ON CONFLICT DO NOTHING;
INSERT INTO attribute_option (attribute_id, attribute_code, option_text)
  SELECT attribute_id, 'presentacion', '5L' FROM attribute WHERE attribute_code = 'presentacion'
  ON CONFLICT DO NOTHING;
INSERT INTO attribute_option (attribute_id, attribute_code, option_text)
  SELECT attribute_id, 'presentacion', '750cc' FROM attribute WHERE attribute_code = 'presentacion'
  ON CONFLICT DO NOTHING;
INSERT INTO attribute_option (attribute_id, attribute_code, option_text)
  SELECT attribute_id, 'presentacion', '8 Gal' FROM attribute WHERE attribute_code = 'presentacion'
  ON CONFLICT DO NOTHING;

-- 3. Create variant_group entries via temp table
CREATE TEMP TABLE grupo_map (grupo_code TEXT, variant_group_id INTEGER);

WITH inserted AS (
  INSERT INTO variant_group (attribute_group_id, attribute_one, visibility)
  SELECT 1, attribute_id, true FROM attribute WHERE attribute_code = 'presentacion'
  RETURNING variant_group_id
)
INSERT INTO grupo_map (grupo_code, variant_group_id)
SELECT 'MA-BL', variant_group_id FROM inserted;

WITH inserted AS (
  INSERT INTO variant_group (attribute_group_id, attribute_one, visibility)
  SELECT 1, attribute_id, true FROM attribute WHERE attribute_code = 'presentacion'
  RETURNING variant_group_id
)
INSERT INTO grupo_map (grupo_code, variant_group_id)
SELECT 'MA-RP', variant_group_id FROM inserted;

WITH inserted AS (
  INSERT INTO variant_group (attribute_group_id, attribute_one, visibility)
  SELECT 1, attribute_id, true FROM attribute WHERE attribute_code = 'presentacion'
  RETURNING variant_group_id
)
INSERT INTO grupo_map (grupo_code, variant_group_id)
SELECT 'MA-UL', variant_group_id FROM inserted;

WITH inserted AS (
  INSERT INTO variant_group (attribute_group_id, attribute_one, visibility)
  SELECT 1, attribute_id, true FROM attribute WHERE attribute_code = 'presentacion'
  RETURNING variant_group_id
)
INSERT INTO grupo_map (grupo_code, variant_group_id)
SELECT 'IN-8D', variant_group_id FROM inserted;

WITH inserted AS (
  INSERT INTO variant_group (attribute_group_id, attribute_one, visibility)
  SELECT 1, attribute_id, true FROM attribute WHERE attribute_code = 'presentacion'
  RETURNING variant_group_id
)
INSERT INTO grupo_map (grupo_code, variant_group_id)
SELECT 'IN-81', variant_group_id FROM inserted;

WITH inserted AS (
  INSERT INTO variant_group (attribute_group_id, attribute_one, visibility)
  SELECT 1, attribute_id, true FROM attribute WHERE attribute_code = 'presentacion'
  RETURNING variant_group_id
)
INSERT INTO grupo_map (grupo_code, variant_group_id)
SELECT 'IN-HT', variant_group_id FROM inserted;

WITH inserted AS (
  INSERT INTO variant_group (attribute_group_id, attribute_one, visibility)
  SELECT 1, attribute_id, true FROM attribute WHERE attribute_code = 'presentacion'
  RETURNING variant_group_id
)
INSERT INTO grupo_map (grupo_code, variant_group_id)
SELECT 'IN-NF', variant_group_id FROM inserted;

WITH inserted AS (
  INSERT INTO variant_group (attribute_group_id, attribute_one, visibility)
  SELECT 1, attribute_id, true FROM attribute WHERE attribute_code = 'presentacion'
  RETURNING variant_group_id
)
INSERT INTO grupo_map (grupo_code, variant_group_id)
SELECT 'IS-1', variant_group_id FROM inserted;

WITH inserted AS (
  INSERT INTO variant_group (attribute_group_id, attribute_one, visibility)
  SELECT 1, attribute_id, true FROM attribute WHERE attribute_code = 'presentacion'
  RETURNING variant_group_id
)
INSERT INTO grupo_map (grupo_code, variant_group_id)
SELECT 'IS-2', variant_group_id FROM inserted;

WITH inserted AS (
  INSERT INTO variant_group (attribute_group_id, attribute_one, visibility)
  SELECT 1, attribute_id, true FROM attribute WHERE attribute_code = 'presentacion'
  RETURNING variant_group_id
)
INSERT INTO grupo_map (grupo_code, variant_group_id)
SELECT 'IS-FT', variant_group_id FROM inserted;

WITH inserted AS (
  INSERT INTO variant_group (attribute_group_id, attribute_one, visibility)
  SELECT 1, attribute_id, true FROM attribute WHERE attribute_code = 'presentacion'
  RETURNING variant_group_id
)
INSERT INTO grupo_map (grupo_code, variant_group_id)
SELECT 'IS-TA', variant_group_id FROM inserted;

WITH inserted AS (
  INSERT INTO variant_group (attribute_group_id, attribute_one, visibility)
  SELECT 1, attribute_id, true FROM attribute WHERE attribute_code = 'presentacion'
  RETURNING variant_group_id
)
INSERT INTO grupo_map (grupo_code, variant_group_id)
SELECT 'IS-LT', variant_group_id FROM inserted;

WITH inserted AS (
  INSERT INTO variant_group (attribute_group_id, attribute_one, visibility)
  SELECT 1, attribute_id, true FROM attribute WHERE attribute_code = 'presentacion'
  RETURNING variant_group_id
)
INSERT INTO grupo_map (grupo_code, variant_group_id)
SELECT 'LA-LF', variant_group_id FROM inserted;

WITH inserted AS (
  INSERT INTO variant_group (attribute_group_id, attribute_one, visibility)
  SELECT 1, attribute_id, true FROM attribute WHERE attribute_code = 'presentacion'
  RETURNING variant_group_id
)
INSERT INTO grupo_map (grupo_code, variant_group_id)
SELECT 'LA-MD', variant_group_id FROM inserted;

WITH inserted AS (
  INSERT INTO variant_group (attribute_group_id, attribute_one, visibility)
  SELECT 1, attribute_id, true FROM attribute WHERE attribute_code = 'presentacion'
  RETURNING variant_group_id
)
INSERT INTO grupo_map (grupo_code, variant_group_id)
SELECT 'LA-MA', variant_group_id FROM inserted;

WITH inserted AS (
  INSERT INTO variant_group (attribute_group_id, attribute_one, visibility)
  SELECT 1, attribute_id, true FROM attribute WHERE attribute_code = 'presentacion'
  RETURNING variant_group_id
)
INSERT INTO grupo_map (grupo_code, variant_group_id)
SELECT 'AU-PE', variant_group_id FROM inserted;

WITH inserted AS (
  INSERT INTO variant_group (attribute_group_id, attribute_one, visibility)
  SELECT 1, attribute_id, true FROM attribute WHERE attribute_code = 'presentacion'
  RETURNING variant_group_id
)
INSERT INTO grupo_map (grupo_code, variant_group_id)
SELECT 'AU-H3', variant_group_id FROM inserted;

WITH inserted AS (
  INSERT INTO variant_group (attribute_group_id, attribute_one, visibility)
  SELECT 1, attribute_id, true FROM attribute WHERE attribute_code = 'presentacion'
  RETURNING variant_group_id
)
INSERT INTO grupo_map (grupo_code, variant_group_id)
SELECT 'AU-RM', variant_group_id FROM inserted;

WITH inserted AS (
  INSERT INTO variant_group (attribute_group_id, attribute_one, visibility)
  SELECT 1, attribute_id, true FROM attribute WHERE attribute_code = 'presentacion'
  RETURNING variant_group_id
)
INSERT INTO grupo_map (grupo_code, variant_group_id)
SELECT 'AU-PG', variant_group_id FROM inserted;

WITH inserted AS (
  INSERT INTO variant_group (attribute_group_id, attribute_one, visibility)
  SELECT 1, attribute_id, true FROM attribute WHERE attribute_code = 'presentacion'
  RETURNING variant_group_id
)
INSERT INTO grupo_map (grupo_code, variant_group_id)
SELECT 'AU-VU', variant_group_id FROM inserted;

WITH inserted AS (
  INSERT INTO variant_group (attribute_group_id, attribute_one, visibility)
  SELECT 1, attribute_id, true FROM attribute WHERE attribute_code = 'presentacion'
  RETURNING variant_group_id
)
INSERT INTO grupo_map (grupo_code, variant_group_id)
SELECT 'AB-CN', variant_group_id FROM inserted;

WITH inserted AS (
  INSERT INTO variant_group (attribute_group_id, attribute_one, visibility)
  SELECT 1, attribute_id, true FROM attribute WHERE attribute_code = 'presentacion'
  RETURNING variant_group_id
)
INSERT INTO grupo_map (grupo_code, variant_group_id)
SELECT 'AB-CC', variant_group_id FROM inserted;

WITH inserted AS (
  INSERT INTO variant_group (attribute_group_id, attribute_one, visibility)
  SELECT 1, attribute_id, true FROM attribute WHERE attribute_code = 'presentacion'
  RETURNING variant_group_id
)
INSERT INTO grupo_map (grupo_code, variant_group_id)
SELECT 'EM-EM', variant_group_id FROM inserted;

WITH inserted AS (
  INSERT INTO variant_group (attribute_group_id, attribute_one, visibility)
  SELECT 1, attribute_id, true FROM attribute WHERE attribute_code = 'presentacion'
  RETURNING variant_group_id
)
INSERT INTO grupo_map (grupo_code, variant_group_id)
SELECT 'EM-DU', variant_group_id FROM inserted;

WITH inserted AS (
  INSERT INTO variant_group (attribute_group_id, attribute_one, visibility)
  SELECT 1, attribute_id, true FROM attribute WHERE attribute_code = 'presentacion'
  RETURNING variant_group_id
)
INSERT INTO grupo_map (grupo_code, variant_group_id)
SELECT 'EM-NT', variant_group_id FROM inserted;

WITH inserted AS (
  INSERT INTO variant_group (attribute_group_id, attribute_one, visibility)
  SELECT 1, attribute_id, true FROM attribute WHERE attribute_code = 'presentacion'
  RETURNING variant_group_id
)
INSERT INTO grupo_map (grupo_code, variant_group_id)
SELECT 'EM-NG', variant_group_id FROM inserted;

WITH inserted AS (
  INSERT INTO variant_group (attribute_group_id, attribute_one, visibility)
  SELECT 1, attribute_id, true FROM attribute WHERE attribute_code = 'presentacion'
  RETURNING variant_group_id
)
INSERT INTO grupo_map (grupo_code, variant_group_id)
SELECT 'EM-CF', variant_group_id FROM inserted;

WITH inserted AS (
  INSERT INTO variant_group (attribute_group_id, attribute_one, visibility)
  SELECT 1, attribute_id, true FROM attribute WHERE attribute_code = 'presentacion'
  RETURNING variant_group_id
)
INSERT INTO grupo_map (grupo_code, variant_group_id)
SELECT 'AU-A7', variant_group_id FROM inserted;

WITH inserted AS (
  INSERT INTO variant_group (attribute_group_id, attribute_one, visibility)
  SELECT 1, attribute_id, true FROM attribute WHERE attribute_code = 'presentacion'
  RETURNING variant_group_id
)
INSERT INTO grupo_map (grupo_code, variant_group_id)
SELECT 'CO-FL', variant_group_id FROM inserted;

WITH inserted AS (
  INSERT INTO variant_group (attribute_group_id, attribute_one, visibility)
  SELECT 1, attribute_id, true FROM attribute WHERE attribute_code = 'presentacion'
  RETURNING variant_group_id
)
INSERT INTO grupo_map (grupo_code, variant_group_id)
SELECT 'AB-LC', variant_group_id FROM inserted;

WITH inserted AS (
  INSERT INTO variant_group (attribute_group_id, attribute_one, visibility)
  SELECT 1, attribute_id, true FROM attribute WHERE attribute_code = 'presentacion'
  RETURNING variant_group_id
)
INSERT INTO grupo_map (grupo_code, variant_group_id)
SELECT 'AB-LT', variant_group_id FROM inserted;

WITH inserted AS (
  INSERT INTO variant_group (attribute_group_id, attribute_one, visibility)
  SELECT 1, attribute_id, true FROM attribute WHERE attribute_code = 'presentacion'
  RETURNING variant_group_id
)
INSERT INTO grupo_map (grupo_code, variant_group_id)
SELECT 'AB-LN', variant_group_id FROM inserted;

WITH inserted AS (
  INSERT INTO variant_group (attribute_group_id, attribute_one, visibility)
  SELECT 1, attribute_id, true FROM attribute WHERE attribute_code = 'presentacion'
  RETURNING variant_group_id
)
INSERT INTO grupo_map (grupo_code, variant_group_id)
SELECT 'CO-PR', variant_group_id FROM inserted;

WITH inserted AS (
  INSERT INTO variant_group (attribute_group_id, attribute_one, visibility)
  SELECT 1, attribute_id, true FROM attribute WHERE attribute_code = 'presentacion'
  RETURNING variant_group_id
)
INSERT INTO grupo_map (grupo_code, variant_group_id)
SELECT 'CO-SP', variant_group_id FROM inserted;

WITH inserted AS (
  INSERT INTO variant_group (attribute_group_id, attribute_one, visibility)
  SELECT 1, attribute_id, true FROM attribute WHERE attribute_code = 'presentacion'
  RETURNING variant_group_id
)
INSERT INTO grupo_map (grupo_code, variant_group_id)
SELECT 'CO-SO', variant_group_id FROM inserted;

WITH inserted AS (
  INSERT INTO variant_group (attribute_group_id, attribute_one, visibility)
  SELECT 1, attribute_id, true FROM attribute WHERE attribute_code = 'presentacion'
  RETURNING variant_group_id
)
INSERT INTO grupo_map (grupo_code, variant_group_id)
SELECT 'AC-FL', variant_group_id FROM inserted;

WITH inserted AS (
  INSERT INTO variant_group (attribute_group_id, attribute_one, visibility)
  SELECT 1, attribute_id, true FROM attribute WHERE attribute_code = 'presentacion'
  RETURNING variant_group_id
)
INSERT INTO grupo_map (grupo_code, variant_group_id)
SELECT 'CO-IT', variant_group_id FROM inserted;

WITH inserted AS (
  INSERT INTO variant_group (attribute_group_id, attribute_one, visibility)
  SELECT 1, attribute_id, true FROM attribute WHERE attribute_code = 'presentacion'
  RETURNING variant_group_id
)
INSERT INTO grupo_map (grupo_code, variant_group_id)
SELECT 'CO-PC', variant_group_id FROM inserted;

WITH inserted AS (
  INSERT INTO variant_group (attribute_group_id, attribute_one, visibility)
  SELECT 1, attribute_id, true FROM attribute WHERE attribute_code = 'presentacion'
  RETURNING variant_group_id
)
INSERT INTO grupo_map (grupo_code, variant_group_id)
SELECT 'CO-PI', variant_group_id FROM inserted;

WITH inserted AS (
  INSERT INTO variant_group (attribute_group_id, attribute_one, visibility)
  SELECT 1, attribute_id, true FROM attribute WHERE attribute_code = 'presentacion'
  RETURNING variant_group_id
)
INSERT INTO grupo_map (grupo_code, variant_group_id)
SELECT 'AU-A1', variant_group_id FROM inserted;

WITH inserted AS (
  INSERT INTO variant_group (attribute_group_id, attribute_one, visibility)
  SELECT 1, attribute_id, true FROM attribute WHERE attribute_code = 'presentacion'
  RETURNING variant_group_id
)
INSERT INTO grupo_map (grupo_code, variant_group_id)
SELECT 'AB-TI', variant_group_id FROM inserted;

WITH inserted AS (
  INSERT INTO variant_group (attribute_group_id, attribute_one, visibility)
  SELECT 1, attribute_id, true FROM attribute WHERE attribute_code = 'presentacion'
  RETURNING variant_group_id
)
INSERT INTO grupo_map (grupo_code, variant_group_id)
SELECT 'AC-PI', variant_group_id FROM inserted;

WITH inserted AS (
  INSERT INTO variant_group (attribute_group_id, attribute_one, visibility)
  SELECT 1, attribute_id, true FROM attribute WHERE attribute_code = 'presentacion'
  RETURNING variant_group_id
)
INSERT INTO grupo_map (grupo_code, variant_group_id)
SELECT 'AC-PS', variant_group_id FROM inserted;

WITH inserted AS (
  INSERT INTO variant_group (attribute_group_id, attribute_one, visibility)
  SELECT 1, attribute_id, true FROM attribute WHERE attribute_code = 'presentacion'
  RETURNING variant_group_id
)
INSERT INTO grupo_map (grupo_code, variant_group_id)
SELECT 'AC-P1', variant_group_id FROM inserted;

WITH inserted AS (
  INSERT INTO variant_group (attribute_group_id, attribute_one, visibility)
  SELECT 1, attribute_id, true FROM attribute WHERE attribute_code = 'presentacion'
  RETURNING variant_group_id
)
INSERT INTO grupo_map (grupo_code, variant_group_id)
SELECT 'AC-P0', variant_group_id FROM inserted;

WITH inserted AS (
  INSERT INTO variant_group (attribute_group_id, attribute_one, visibility)
  SELECT 1, attribute_id, true FROM attribute WHERE attribute_code = 'presentacion'
  RETURNING variant_group_id
)
INSERT INTO grupo_map (grupo_code, variant_group_id)
SELECT 'AC-PN', variant_group_id FROM inserted;

WITH inserted AS (
  INSERT INTO variant_group (attribute_group_id, attribute_one, visibility)
  SELECT 1, attribute_id, true FROM attribute WHERE attribute_code = 'presentacion'
  RETURNING variant_group_id
)
INSERT INTO grupo_map (grupo_code, variant_group_id)
SELECT 'AC-PP', variant_group_id FROM inserted;

WITH inserted AS (
  INSERT INTO variant_group (attribute_group_id, attribute_one, visibility)
  SELECT 1, attribute_id, true FROM attribute WHERE attribute_code = 'presentacion'
  RETURNING variant_group_id
)
INSERT INTO grupo_map (grupo_code, variant_group_id)
SELECT 'AU-BP', variant_group_id FROM inserted;

WITH inserted AS (
  INSERT INTO variant_group (attribute_group_id, attribute_one, visibility)
  SELECT 1, attribute_id, true FROM attribute WHERE attribute_code = 'presentacion'
  RETURNING variant_group_id
)
INSERT INTO grupo_map (grupo_code, variant_group_id)
SELECT 'CO-MG', variant_group_id FROM inserted;

WITH inserted AS (
  INSERT INTO variant_group (attribute_group_id, attribute_one, visibility)
  SELECT 1, attribute_id, true FROM attribute WHERE attribute_code = 'presentacion'
  RETURNING variant_group_id
)
INSERT INTO grupo_map (grupo_code, variant_group_id)
SELECT 'AU-LV', variant_group_id FROM inserted;

WITH inserted AS (
  INSERT INTO variant_group (attribute_group_id, attribute_one, visibility)
  SELECT 1, attribute_id, true FROM attribute WHERE attribute_code = 'presentacion'
  RETURNING variant_group_id
)
INSERT INTO grupo_map (grupo_code, variant_group_id)
SELECT 'EM-LX', variant_group_id FROM inserted;

WITH inserted AS (
  INSERT INTO variant_group (attribute_group_id, attribute_one, visibility)
  SELECT 1, attribute_id, true FROM attribute WHERE attribute_code = 'presentacion'
  RETURNING variant_group_id
)
INSERT INTO grupo_map (grupo_code, variant_group_id)
SELECT 'EM-LN', variant_group_id FROM inserted;

WITH inserted AS (
  INSERT INTO variant_group (attribute_group_id, attribute_one, visibility)
  SELECT 1, attribute_id, true FROM attribute WHERE attribute_code = 'presentacion'
  RETURNING variant_group_id
)
INSERT INTO grupo_map (grupo_code, variant_group_id)
SELECT 'EM-LT', variant_group_id FROM inserted;

WITH inserted AS (
  INSERT INTO variant_group (attribute_group_id, attribute_one, visibility)
  SELECT 1, attribute_id, true FROM attribute WHERE attribute_code = 'presentacion'
  RETURNING variant_group_id
)
INSERT INTO grupo_map (grupo_code, variant_group_id)
SELECT 'CO-MF', variant_group_id FROM inserted;

WITH inserted AS (
  INSERT INTO variant_group (attribute_group_id, attribute_one, visibility)
  SELECT 1, attribute_id, true FROM attribute WHERE attribute_code = 'presentacion'
  RETURNING variant_group_id
)
INSERT INTO grupo_map (grupo_code, variant_group_id)
SELECT 'CO-MN', variant_group_id FROM inserted;

WITH inserted AS (
  INSERT INTO variant_group (attribute_group_id, attribute_one, visibility)
  SELECT 1, attribute_id, true FROM attribute WHERE attribute_code = 'presentacion'
  RETURNING variant_group_id
)
INSERT INTO grupo_map (grupo_code, variant_group_id)
SELECT 'CO-MT', variant_group_id FROM inserted;

WITH inserted AS (
  INSERT INTO variant_group (attribute_group_id, attribute_one, visibility)
  SELECT 1, attribute_id, true FROM attribute WHERE attribute_code = 'presentacion'
  RETURNING variant_group_id
)
INSERT INTO grupo_map (grupo_code, variant_group_id)
SELECT 'CO-MB', variant_group_id FROM inserted;

-- 4. Update product variant_group_id
UPDATE product SET variant_group_id =
  (SELECT variant_group_id FROM grupo_map WHERE grupo_code = 'MA-BL')
WHERE sku IN ('MA-BL-120', 'MA-BL-375', 'MA-BL-750', 'MA-BL-036', 'MA-BL-043', 'MA-BL-080', 'MA-BL-530');
UPDATE product SET variant_group_id =
  (SELECT variant_group_id FROM grupo_map WHERE grupo_code = 'MA-RP')
WHERE sku IN ('MA-RP-375', 'MA-RP-750', 'MA-RP-036', 'MA-RP-010', 'MA-RP-043', 'MA-RP-080', 'MA-RP-530');
UPDATE product SET variant_group_id =
  (SELECT variant_group_id FROM grupo_map WHERE grupo_code = 'MA-UL')
WHERE sku IN ('MA-UL-375', 'MA-UL-750', 'MA-UL-036', 'MA-UL-010', 'MA-UL-043', 'MA-UL-530');
UPDATE product SET variant_group_id =
  (SELECT variant_group_id FROM grupo_map WHERE grupo_code = 'IN-8D')
WHERE sku IN ('IN-8D-375', 'IN-8D-750', 'IN-8D-002', 'IN-8D-003', 'IN-8D-005', 'IN-8D-038', 'IN-8D-045', 'IN-8D-080', 'IN-8D-530');
UPDATE product SET variant_group_id =
  (SELECT variant_group_id FROM grupo_map WHERE grupo_code = 'IN-81')
WHERE sku IN ('IN-81-120', 'IN-81-375', 'IN-81-750', 'IN-81-002', 'IN-81-003', 'IN-81-040', 'IN-81-045', 'IN-81-080', 'IN-81-530');
UPDATE product SET variant_group_id =
  (SELECT variant_group_id FROM grupo_map WHERE grupo_code = 'IN-HT')
WHERE sku IN ('IN-HT-375', 'IN-HT-750', 'IN-HT-002', 'IN-HT-003', 'IN-HT-045', 'IN-HT-080', 'IN-HT-530');
UPDATE product SET variant_group_id =
  (SELECT variant_group_id FROM grupo_map WHERE grupo_code = 'IN-NF')
WHERE sku IN ('IN-NF-045', 'IN-NF-55gal', 'IN-NF-530');
UPDATE product SET variant_group_id =
  (SELECT variant_group_id FROM grupo_map WHERE grupo_code = 'IS-1')
WHERE sku IN ('IS-1-375', 'IS-1-750', 'IS-1-002', 'IS-1-003', 'IS-1-045', 'IS-1-080', 'IS-1-150', 'IS-1-530', 'IS-1-550');
UPDATE product SET variant_group_id =
  (SELECT variant_group_id FROM grupo_map WHERE grupo_code = 'IS-2')
WHERE sku IN ('IS-2-375', 'IS-2-750', 'IS-2-002', 'IS-2-003', 'IS-2-045', 'IS-2-080', 'IS-2-150', 'IS-2-530');
UPDATE product SET variant_group_id =
  (SELECT variant_group_id FROM grupo_map WHERE grupo_code = 'IS-FT')
WHERE sku IN ('IS-FT-375', 'IS-FT-750', 'IS-FT-002', 'IS-FT-003', 'IS-FT-045', 'IS-FT-080', 'IS-FT-150', 'IS-FT-530');
UPDATE product SET variant_group_id =
  (SELECT variant_group_id FROM grupo_map WHERE grupo_code = 'IS-TA')
WHERE sku IN ('IS-TA-375', 'IS-TA-750', 'IS-TA-002', 'IS-TA-003', 'IS-TA-045', 'IS-TA-080', 'IS-TA-150', 'IS-TA-530');
UPDATE product SET variant_group_id =
  (SELECT variant_group_id FROM grupo_map WHERE grupo_code = 'IS-LT')
WHERE sku IN ('IS-LT-080', 'IS-LT-530');
UPDATE product SET variant_group_id =
  (SELECT variant_group_id FROM grupo_map WHERE grupo_code = 'LA-LF')
WHERE sku IN ('LA-LF-120', 'LA-LF-375', 'LA-LF-750', 'LA-LF-002', 'LA-LF-003', 'LA-LF-005', 'LA-LF-040', 'LA-LF-080', 'LA-LF-530');
UPDATE product SET variant_group_id =
  (SELECT variant_group_id FROM grupo_map WHERE grupo_code = 'LA-MD')
WHERE sku IN ('LA-MD-750', 'LA-MD-003', 'LA-MD-045', 'LA-MD-080', 'LA-MD-530');
UPDATE product SET variant_group_id =
  (SELECT variant_group_id FROM grupo_map WHERE grupo_code = 'LA-MA')
WHERE sku IN ('LA-MA-375', 'LA-MA-750', 'LA-MA-003', 'LA-MA-005', 'LA-MA-045', 'LA-MA-080', 'LA-MA-530');
UPDATE product SET variant_group_id =
  (SELECT variant_group_id FROM grupo_map WHERE grupo_code = 'AU-PE')
WHERE sku IN ('AU-PE-375', 'AU-PE-750', 'AU-PE-003', 'AU-PE-050');
UPDATE product SET variant_group_id =
  (SELECT variant_group_id FROM grupo_map WHERE grupo_code = 'AU-H3')
WHERE sku IN ('AU-H3-250', 'AU-H3-500', 'AU-H3-001');
UPDATE product SET variant_group_id =
  (SELECT variant_group_id FROM grupo_map WHERE grupo_code = 'AU-RM')
WHERE sku IN ('AU-RM-375', 'AU-RM-750', 'AU-RM-036', 'AU-RM-55gal');
UPDATE product SET variant_group_id =
  (SELECT variant_group_id FROM grupo_map WHERE grupo_code = 'AU-PG')
WHERE sku IN ('AU-PG-120', 'AU-PG-001');
UPDATE product SET variant_group_id =
  (SELECT variant_group_id FROM grupo_map WHERE grupo_code = 'AU-VU')
WHERE sku IN ('AU-VU-120', 'AU-VU-500');
UPDATE product SET variant_group_id =
  (SELECT variant_group_id FROM grupo_map WHERE grupo_code = 'AB-CN')
WHERE sku IN ('AB-CN-375', 'AB-CN-036', 'AB-CN-050');
UPDATE product SET variant_group_id =
  (SELECT variant_group_id FROM grupo_map WHERE grupo_code = 'AB-CC')
WHERE sku IN ('AB-CC-375', 'AB-CC-036', 'AB-CC-050');
UPDATE product SET variant_group_id =
  (SELECT variant_group_id FROM grupo_map WHERE grupo_code = 'EM-EM')
WHERE sku IN ('EM-EM-375', 'EM-EM-036');
UPDATE product SET variant_group_id =
  (SELECT variant_group_id FROM grupo_map WHERE grupo_code = 'EM-DU')
WHERE sku IN ('EM-DU-375', 'EM-DU-036');
UPDATE product SET variant_group_id =
  (SELECT variant_group_id FROM grupo_map WHERE grupo_code = 'EM-NT')
WHERE sku IN ('EM-NT-375', 'EM-NT-036');
UPDATE product SET variant_group_id =
  (SELECT variant_group_id FROM grupo_map WHERE grupo_code = 'EM-NG')
WHERE sku IN ('EM-NG-375', 'EM-NG-036');
UPDATE product SET variant_group_id =
  (SELECT variant_group_id FROM grupo_map WHERE grupo_code = 'EM-CF')
WHERE sku IN ('EM-CF-375', 'EM-CF-036');
UPDATE product SET variant_group_id =
  (SELECT variant_group_id FROM grupo_map WHERE grupo_code = 'AU-A7')
WHERE sku IN ('AU-A7-750', 'AU-A7-036', 'AU-A7-045');
UPDATE product SET variant_group_id =
  (SELECT variant_group_id FROM grupo_map WHERE grupo_code = 'CO-FL')
WHERE sku IN ('CO-FL-003', 'CO-FL-045', 'CO-FL-530');
UPDATE product SET variant_group_id =
  (SELECT variant_group_id FROM grupo_map WHERE grupo_code = 'AB-LC')
WHERE sku IN ('AB-LC-750', 'AB-LC-003');
UPDATE product SET variant_group_id =
  (SELECT variant_group_id FROM grupo_map WHERE grupo_code = 'AB-LT')
WHERE sku IN ('AB-LT-750', 'AB-LT-003');
UPDATE product SET variant_group_id =
  (SELECT variant_group_id FROM grupo_map WHERE grupo_code = 'AB-LN')
WHERE sku IN ('AB-LN-750', 'AB-LN-003');
UPDATE product SET variant_group_id =
  (SELECT variant_group_id FROM grupo_map WHERE grupo_code = 'CO-PR')
WHERE sku IN ('CO-PR-375', 'CO-PR-750', 'CO-PR-002', 'CO-PR-003', 'CO-PR-040', 'CO-PR-080', 'CO-PR-530');
UPDATE product SET variant_group_id =
  (SELECT variant_group_id FROM grupo_map WHERE grupo_code = 'CO-SP')
WHERE sku IN ('CO-SP-375', 'CO-SP-750', 'CO-SP-002', 'CO-SP-003', 'CO-SP-005');
UPDATE product SET variant_group_id =
  (SELECT variant_group_id FROM grupo_map WHERE grupo_code = 'CO-SO')
WHERE sku IN ('CO-SO-750', 'CO-SO-003', 'CO-SO-045', 'CO-SO-150', 'CO-SO-530', 'CO-SO-550');
UPDATE product SET variant_group_id =
  (SELECT variant_group_id FROM grupo_map WHERE grupo_code = 'AC-FL')
WHERE sku IN ('AC-FL-040', 'AC-FL-55gal');
UPDATE product SET variant_group_id =
  (SELECT variant_group_id FROM grupo_map WHERE grupo_code = 'CO-IT')
WHERE sku IN ('CO-IT-375', 'CO-IT-750', 'CO-IT-003', 'CO-IT-045', 'CO-IT-080', 'CO-IT-530');
UPDATE product SET variant_group_id =
  (SELECT variant_group_id FROM grupo_map WHERE grupo_code = 'CO-PC')
WHERE sku IN ('CO-PC-375', 'CO-PC-750', 'CO-PC-002', 'CO-PC-003', 'CO-PC-040', 'CO-PC-080', 'CO-PC-530');
UPDATE product SET variant_group_id =
  (SELECT variant_group_id FROM grupo_map WHERE grupo_code = 'CO-PI')
WHERE sku IN ('CO-PI-003', 'CO-PI-040', 'CO-PI-080');
UPDATE product SET variant_group_id =
  (SELECT variant_group_id FROM grupo_map WHERE grupo_code = 'AU-A1')
WHERE sku IN ('AU-A1-750', 'AU-A1-003', 'AU-A1-045');
UPDATE product SET variant_group_id =
  (SELECT variant_group_id FROM grupo_map WHERE grupo_code = 'AB-TI')
WHERE sku IN ('AB-TI-375', 'AB-TI-036');
UPDATE product SET variant_group_id =
  (SELECT variant_group_id FROM grupo_map WHERE grupo_code = 'AC-PI')
WHERE sku IN ('AC-PI-750', 'AC-PI-040', 'AC-PI-045', 'AC-PI-150');
UPDATE product SET variant_group_id =
  (SELECT variant_group_id FROM grupo_map WHERE grupo_code = 'AC-PS')
WHERE sku IN ('AC-PS-750', 'AC-PS-040', 'AC-PS-045', 'AC-PS-150');
UPDATE product SET variant_group_id =
  (SELECT variant_group_id FROM grupo_map WHERE grupo_code = 'AC-P1')
WHERE sku IN ('AC-P1-750', 'AC-P1-040', 'AC-P1-045', 'AC-P1-150');
UPDATE product SET variant_group_id =
  (SELECT variant_group_id FROM grupo_map WHERE grupo_code = 'AC-P0')
WHERE sku IN ('AC-P0-750', 'AC-P0-040', 'AC-P0-045', 'AC-P0-150');
UPDATE product SET variant_group_id =
  (SELECT variant_group_id FROM grupo_map WHERE grupo_code = 'AC-PN')
WHERE sku IN ('AC-PN-750', 'AC-PN-040', 'AC-PN-045', 'AC-PN-150');
UPDATE product SET variant_group_id =
  (SELECT variant_group_id FROM grupo_map WHERE grupo_code = 'AC-PP')
WHERE sku IN ('AC-PP-750', 'AC-PP-040', 'AC-PP-045', 'AC-PP-150');
UPDATE product SET variant_group_id =
  (SELECT variant_group_id FROM grupo_map WHERE grupo_code = 'AU-BP')
WHERE sku IN ('AU-BP-750', 'AU-BP-036', 'AU-BP-045');
UPDATE product SET variant_group_id =
  (SELECT variant_group_id FROM grupo_map WHERE grupo_code = 'CO-MG')
WHERE sku IN ('CO-MG-045', 'CO-MG-530');
UPDATE product SET variant_group_id =
  (SELECT variant_group_id FROM grupo_map WHERE grupo_code = 'AU-LV')
WHERE sku IN ('AU-LV-750', 'AU-LV-003');
UPDATE product SET variant_group_id =
  (SELECT variant_group_id FROM grupo_map WHERE grupo_code = 'EM-LX')
WHERE sku IN ('EM-LX-375');
UPDATE product SET variant_group_id =
  (SELECT variant_group_id FROM grupo_map WHERE grupo_code = 'EM-LN')
WHERE sku IN ('EM-LN-375', 'EM-LN-036');
UPDATE product SET variant_group_id =
  (SELECT variant_group_id FROM grupo_map WHERE grupo_code = 'EM-LT')
WHERE sku IN ('EM-LT-375', 'EM-LT-036');
UPDATE product SET variant_group_id =
  (SELECT variant_group_id FROM grupo_map WHERE grupo_code = 'CO-MF')
WHERE sku IN ('CO-MF-003', 'CO-MF-045', 'CO-MF-080', 'CO-MF-530');
UPDATE product SET variant_group_id =
  (SELECT variant_group_id FROM grupo_map WHERE grupo_code = 'CO-MN')
WHERE sku IN ('CO-MN-003', 'CO-MN-045', 'CO-MN-080', 'CO-MN-530');
UPDATE product SET variant_group_id =
  (SELECT variant_group_id FROM grupo_map WHERE grupo_code = 'CO-MT')
WHERE sku IN ('CO-MT-003', 'CO-MT-045', 'CO-MT-080', 'CO-MT-530');
UPDATE product SET variant_group_id =
  (SELECT variant_group_id FROM grupo_map WHERE grupo_code = 'CO-MB')
WHERE sku IN ('CO-MB-003', 'CO-MB-045', 'CO-MB-080');

-- 5. Set presentacion value index for each product
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '120cc'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'MA-BL-120'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '120cc'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '375cc'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'MA-BL-375'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '375cc'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '750cc'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'MA-BL-750'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '750cc'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '3.6L'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'MA-BL-036'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '3.6L'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '4.3 Gal'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'MA-BL-043'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '4.3 Gal'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '8 Gal'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'MA-BL-080'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '8 Gal'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '53 Gal'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'MA-BL-530'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '53 Gal'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '375cc'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'MA-RP-375'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '375cc'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '750cc'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'MA-RP-750'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '750cc'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '3.6L'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'MA-RP-036'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '3.6L'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '10L'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'MA-RP-010'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '10L'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '4.3 Gal'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'MA-RP-043'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '4.3 Gal'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '8 Gal'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'MA-RP-080'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '8 Gal'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '53 Gal'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'MA-RP-530'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '53 Gal'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '375cc'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'MA-UL-375'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '375cc'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '750cc'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'MA-UL-750'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '750cc'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '3.6L'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'MA-UL-036'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '3.6L'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '10L'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'MA-UL-010'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '10L'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '4.3 Gal'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'MA-UL-043'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '4.3 Gal'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '53 Gal'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'MA-UL-530'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '53 Gal'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '375cc'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'IN-8D-375'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '375cc'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '750cc'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'IN-8D-750'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '750cc'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '2L'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'IN-8D-002'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '2L'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '3L'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'IN-8D-003'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '3L'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '5L'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'IN-8D-005'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '5L'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '3.8 Gal'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'IN-8D-038'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '3.8 Gal'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '4.5 Gal'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'IN-8D-045'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '4.5 Gal'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '8 Gal'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'IN-8D-080'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '8 Gal'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '53 Gal'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'IN-8D-530'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '53 Gal'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '120cc'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'IN-81-120'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '120cc'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '375cc'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'IN-81-375'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '375cc'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '750cc'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'IN-81-750'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '750cc'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '2L'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'IN-81-002'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '2L'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '3L'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'IN-81-003'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '3L'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '4 Gal'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'IN-81-040'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '4 Gal'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '4.5 Gal'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'IN-81-045'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '4.5 Gal'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '8 Gal'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'IN-81-080'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '8 Gal'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '53 Gal'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'IN-81-530'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '53 Gal'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '375cc'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'IN-HT-375'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '375cc'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '750cc'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'IN-HT-750'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '750cc'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '2L'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'IN-HT-002'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '2L'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '3L'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'IN-HT-003'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '3L'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '4.5 Gal'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'IN-HT-045'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '4.5 Gal'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '8 Gal'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'IN-HT-080'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '8 Gal'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '53 Gal'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'IN-HT-530'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '53 Gal'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '4.5 Gal'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'IN-NF-045'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '4.5 Gal'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '5.5 gal'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'IN-NF-55gal'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '5.5 gal'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '53 Gal'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'IN-NF-530'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '53 Gal'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '375cc'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'IS-1-375'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '375cc'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '750cc'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'IS-1-750'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '750cc'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '2L'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'IS-1-002'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '2L'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '3L'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'IS-1-003'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '3L'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '4.5 Gal'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'IS-1-045'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '4.5 Gal'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '8 Gal'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'IS-1-080'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '8 Gal'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '15 Gal'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'IS-1-150'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '15 Gal'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '53 Gal'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'IS-1-530'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '53 Gal'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '55 Gal'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'IS-1-550'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '55 Gal'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '375cc'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'IS-2-375'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '375cc'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '750cc'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'IS-2-750'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '750cc'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '2L'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'IS-2-002'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '2L'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '3L'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'IS-2-003'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '3L'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '4.5 Gal'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'IS-2-045'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '4.5 Gal'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '8 Gal'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'IS-2-080'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '8 Gal'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '15 Gal'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'IS-2-150'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '15 Gal'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '53 Gal'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'IS-2-530'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '53 Gal'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '375cc'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'IS-FT-375'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '375cc'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '750cc'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'IS-FT-750'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '750cc'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '2L'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'IS-FT-002'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '2L'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '3L'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'IS-FT-003'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '3L'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '4.5 Gal'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'IS-FT-045'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '4.5 Gal'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '8 Gal'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'IS-FT-080'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '8 Gal'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '15 Gal'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'IS-FT-150'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '15 Gal'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '53 Gal'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'IS-FT-530'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '53 Gal'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '375cc'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'IS-TA-375'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '375cc'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '750cc'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'IS-TA-750'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '750cc'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '2L'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'IS-TA-002'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '2L'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '3L'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'IS-TA-003'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '3L'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '4.5 Gal'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'IS-TA-045'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '4.5 Gal'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '8 Gal'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'IS-TA-080'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '8 Gal'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '15 Gal'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'IS-TA-150'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '15 Gal'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '53 Gal'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'IS-TA-530'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '53 Gal'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '8 Gal'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'IS-LT-080'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '8 Gal'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '53 Gal'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'IS-LT-530'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '53 Gal'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '120cc'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'LA-LF-120'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '120cc'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '375cc'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'LA-LF-375'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '375cc'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '750cc'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'LA-LF-750'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '750cc'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '2L'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'LA-LF-002'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '2L'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '3L'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'LA-LF-003'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '3L'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '5L'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'LA-LF-005'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '5L'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '4 Gal'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'LA-LF-040'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '4 Gal'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '8 Gal'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'LA-LF-080'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '8 Gal'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '53 Gal'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'LA-LF-530'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '53 Gal'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '750cc'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'LA-MD-750'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '750cc'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '3L'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'LA-MD-003'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '3L'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '4.5 Gal'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'LA-MD-045'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '4.5 Gal'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '8 Gal'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'LA-MD-080'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '8 Gal'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '53 Gal'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'LA-MD-530'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '53 Gal'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '375cc'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'LA-MA-375'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '375cc'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '750cc'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'LA-MA-750'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '750cc'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '3L'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'LA-MA-003'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '3L'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '5L'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'LA-MA-005'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '5L'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '4.5 Gal'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'LA-MA-045'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '4.5 Gal'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '8 Gal'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'LA-MA-080'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '8 Gal'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '53 Gal'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'LA-MA-530'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '53 Gal'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '375cc'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'AU-PE-375'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '375cc'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '750cc'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'AU-PE-750'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '750cc'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '3L'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'AU-PE-003'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '3L'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '5 Gal'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'AU-PE-050'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '5 Gal'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '250cc'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'AU-H3-250'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '250cc'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '500cc'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'AU-H3-500'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '500cc'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '1L'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'AU-H3-001'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '1L'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '375cc'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'AU-RM-375'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '375cc'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '750cc'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'AU-RM-750'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '750cc'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '3.6L'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'AU-RM-036'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '3.6L'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '5.5 gal'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'AU-RM-55gal'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '5.5 gal'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '120cc'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'AU-PG-120'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '120cc'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '1L'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'AU-PG-001'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '1L'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '120cc'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'AU-VU-120'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '120cc'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '500cc'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'AU-VU-500'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '500cc'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '375cc'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'AB-CN-375'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '375cc'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '3.6L'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'AB-CN-036'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '3.6L'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '5 Gal'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'AB-CN-050'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '5 Gal'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '375cc'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'AB-CC-375'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '375cc'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '3.6L'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'AB-CC-036'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '3.6L'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '5 Gal'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'AB-CC-050'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '5 Gal'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '375cc'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'EM-EM-375'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '375cc'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '3.6L'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'EM-EM-036'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '3.6L'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '375cc'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'EM-DU-375'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '375cc'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '3.6L'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'EM-DU-036'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '3.6L'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '375cc'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'EM-NT-375'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '375cc'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '3.6L'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'EM-NT-036'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '3.6L'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '375cc'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'EM-NG-375'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '375cc'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '3.6L'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'EM-NG-036'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '3.6L'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '375cc'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'EM-CF-375'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '375cc'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '3.6L'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'EM-CF-036'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '3.6L'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '750cc'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'AU-A7-750'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '750cc'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '3.6L'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'AU-A7-036'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '3.6L'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '4.5 Gal'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'AU-A7-045'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '4.5 Gal'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '3L'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'CO-FL-003'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '3L'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '4.5 Gal'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'CO-FL-045'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '4.5 Gal'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '53 Gal'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'CO-FL-530'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '53 Gal'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '750cc'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'AB-LC-750'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '750cc'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '3L'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'AB-LC-003'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '3L'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '750cc'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'AB-LT-750'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '750cc'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '3L'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'AB-LT-003'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '3L'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '750cc'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'AB-LN-750'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '750cc'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '3L'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'AB-LN-003'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '3L'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '375cc'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'CO-PR-375'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '375cc'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '750cc'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'CO-PR-750'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '750cc'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '2L'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'CO-PR-002'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '2L'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '3L'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'CO-PR-003'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '3L'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '4 Gal'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'CO-PR-040'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '4 Gal'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '8 Gal'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'CO-PR-080'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '8 Gal'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '53 Gal'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'CO-PR-530'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '53 Gal'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '375cc'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'CO-SP-375'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '375cc'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '750cc'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'CO-SP-750'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '750cc'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '2L'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'CO-SP-002'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '2L'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '3L'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'CO-SP-003'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '3L'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '5L'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'CO-SP-005'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '5L'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '750cc'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'CO-SO-750'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '750cc'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '3L'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'CO-SO-003'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '3L'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '4.5 Gal'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'CO-SO-045'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '4.5 Gal'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '15 Gal'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'CO-SO-150'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '15 Gal'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '53 Gal'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'CO-SO-530'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '53 Gal'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '55 Gal'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'CO-SO-550'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '55 Gal'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '4 Gal'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'AC-FL-040'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '4 Gal'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '5.5 gal'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'AC-FL-55gal'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '5.5 gal'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '375cc'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'CO-IT-375'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '375cc'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '750cc'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'CO-IT-750'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '750cc'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '3L'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'CO-IT-003'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '3L'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '4.5 Gal'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'CO-IT-045'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '4.5 Gal'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '8 Gal'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'CO-IT-080'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '8 Gal'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '53 Gal'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'CO-IT-530'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '53 Gal'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '375cc'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'CO-PC-375'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '375cc'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '750cc'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'CO-PC-750'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '750cc'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '2L'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'CO-PC-002'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '2L'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '3L'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'CO-PC-003'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '3L'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '4 Gal'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'CO-PC-040'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '4 Gal'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '8 Gal'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'CO-PC-080'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '8 Gal'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '53 Gal'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'CO-PC-530'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '53 Gal'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '3L'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'CO-PI-003'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '3L'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '4 Gal'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'CO-PI-040'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '4 Gal'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '8 Gal'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'CO-PI-080'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '8 Gal'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '750cc'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'AU-A1-750'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '750cc'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '3L'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'AU-A1-003'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '3L'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '4.5 Gal'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'AU-A1-045'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '4.5 Gal'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '375cc'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'AB-TI-375'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '375cc'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '3.6L'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'AB-TI-036'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '3.6L'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '750cc'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'AC-PI-750'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '750cc'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '4 Gal'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'AC-PI-040'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '4 Gal'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '4.5 Gal'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'AC-PI-045'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '4.5 Gal'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '15 Gal'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'AC-PI-150'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '15 Gal'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '750cc'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'AC-PS-750'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '750cc'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '4 Gal'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'AC-PS-040'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '4 Gal'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '4.5 Gal'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'AC-PS-045'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '4.5 Gal'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '15 Gal'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'AC-PS-150'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '15 Gal'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '750cc'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'AC-P1-750'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '750cc'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '4 Gal'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'AC-P1-040'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '4 Gal'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '4.5 Gal'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'AC-P1-045'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '4.5 Gal'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '15 Gal'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'AC-P1-150'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '15 Gal'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '750cc'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'AC-P0-750'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '750cc'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '4 Gal'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'AC-P0-040'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '4 Gal'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '4.5 Gal'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'AC-P0-045'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '4.5 Gal'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '15 Gal'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'AC-P0-150'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '15 Gal'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '750cc'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'AC-PN-750'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '750cc'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '4 Gal'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'AC-PN-040'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '4 Gal'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '4.5 Gal'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'AC-PN-045'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '4.5 Gal'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '15 Gal'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'AC-PN-150'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '15 Gal'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '750cc'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'AC-PP-750'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '750cc'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '4 Gal'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'AC-PP-040'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '4 Gal'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '4.5 Gal'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'AC-PP-045'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '4.5 Gal'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '15 Gal'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'AC-PP-150'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '15 Gal'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '750cc'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'AU-BP-750'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '750cc'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '3.6L'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'AU-BP-036'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '3.6L'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '4.5 Gal'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'AU-BP-045'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '4.5 Gal'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '4.5 Gal'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'CO-MG-045'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '4.5 Gal'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '53 Gal'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'CO-MG-530'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '53 Gal'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '750cc'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'AU-LV-750'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '750cc'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '3L'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'AU-LV-003'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '3L'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '375cc'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'EM-LX-375'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '375cc'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '375cc'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'EM-LN-375'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '375cc'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '3.6L'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'EM-LN-036'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '3.6L'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '375cc'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'EM-LT-375'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '375cc'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '3.6L'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'EM-LT-036'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '3.6L'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '3L'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'CO-MF-003'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '3L'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '4.5 Gal'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'CO-MF-045'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '4.5 Gal'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '8 Gal'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'CO-MF-080'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '8 Gal'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '53 Gal'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'CO-MF-530'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '53 Gal'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '3L'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'CO-MN-003'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '3L'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '4.5 Gal'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'CO-MN-045'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '4.5 Gal'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '8 Gal'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'CO-MN-080'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '8 Gal'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '53 Gal'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'CO-MN-530'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '53 Gal'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '3L'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'CO-MT-003'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '3L'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '4.5 Gal'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'CO-MT-045'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '4.5 Gal'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '8 Gal'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'CO-MT-080'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '8 Gal'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '53 Gal'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'CO-MT-530'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '53 Gal'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '3L'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'CO-MB-003'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '3L'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '4.5 Gal'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'CO-MB-045'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '4.5 Gal'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;
INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
  SELECT p.product_id, a.attribute_id, ao.attribute_option_id, '8 Gal'
  FROM product p, attribute a, attribute_option ao
  WHERE p.sku = 'CO-MB-080'
    AND a.attribute_code = 'presentacion'
    AND ao.attribute_id = a.attribute_id
    AND ao.option_text = '8 Gal'
  ON CONFLICT (product_id, attribute_id, option_id) DO NOTHING;

DROP TABLE grupo_map;

COMMIT;