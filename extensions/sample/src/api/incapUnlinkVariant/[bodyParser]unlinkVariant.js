import { pool } from '@evershop/evershop/lib/postgres';

/**
 * POST /api/unlink-variant
 * Desvincula un producto de su grupo de variantes sin borrarlo.
 *
 * Corrección respecto al endpoint del core:
 *   El core hace SET visibility = NULL pero la columna es NOT NULL en esta DB.
 *   Aquí usamos visibility = false en su lugar.
 *
 * ⚠️ Esta carpeta se llama `incapUnlinkVariant` (NO `unlinkVariant`) A PROPÓSITO.
 * Evershop core trae su propio módulo `catalog/api/unlinkVariant/` (handler
 * `unlinkVariants.js`, ruta DELETE /variants/:id). Evershop agrupa los
 * middlewares por NOMBRE DE CARPETA (route id): si nuestra carpeta se llamara
 * `unlinkVariant` (igual que la del core), Evershop fusiona ambos grupos y corre
 * el handler del core con su `multerNone` (que no parsea JSON) → `request.body`
 * queda undefined → `request.body.id` → 500 "Cannot read properties of undefined
 * (reading 'id')". Con nombre único NO hay fusión. NO renombrar a `unlinkVariant`.
 *
 * Body JSON: { productId: number }
 */
export default async function unlinkVariant(request, response) {
  // Auth — rechazar si no hay admin autenticado
  const admin =
    typeof request.getCurrentUser === 'function'
      ? request.getCurrentUser()
      : null;
  if (!admin) {
    return response.status(401).json({ error: 'No autorizado' });
  }

  // Validar productId
  const productId = parseInt(request.body?.productId, 10);
  if (!productId || productId <= 0 || isNaN(productId)) {
    return response.status(400).json({ error: 'productId inválido' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Verificar que el producto pertenece a un grupo y obtener attribute_one
    const { rows } = await client.query(
      `SELECT vg.variant_group_id, vg.attribute_one
       FROM product p
       JOIN variant_group vg ON vg.variant_group_id = p.variant_group_id
       WHERE p.product_id = $1`,
      [productId]
    );

    if (!rows.length) {
      await client.query('ROLLBACK');
      return response
        .status(400)
        .json({ error: 'El producto no pertenece a un grupo de variantes.' });
    }

    const { attribute_one: attributeId } = rows[0];

    // 2. Desvincular: variant_group_id → NULL, visibility → false
    //    (no NULL — la columna es NOT NULL en esta DB)
    await client.query(
      `UPDATE product
       SET variant_group_id = NULL, visibility = false
       WHERE product_id = $1`,
      [productId]
    );

    // 3. Limpiar el valor de atributo de variante del índice
    await client.query(
      `DELETE FROM product_attribute_value_index
       WHERE product_id = $1 AND attribute_id = $2`,
      [productId, attributeId]
    );

    await client.query('COMMIT');

    return response.json({ success: true });
  } catch (e) {
    try {
      await client.query('ROLLBACK');
    } catch {
      /* noop */
    }
    return response.status(500).json({ error: e.message });
  } finally {
    client.release();
  }
}
