import { pool } from '@evershop/evershop/lib/postgres';
import { getSetting, refreshSetting } from '@evershop/evershop/setting/services';

const SIZE_ATTRIBUTE_ID = 2;

/**
 * GET  /api/variant-size-order  → devuelve el orden guardado + todas las opciones size
 * POST /api/variant-size-order  → recibe { order: number[] } y persiste el setting
 */
export default async function variantSizeOrder(request, response) {
  const admin = typeof request.getCurrentUser === 'function' ? request.getCurrentUser() : null;
  if (!admin) {
    return response.status(401).json({ error: 'No autorizado' });
  }

  // ---- GET: devolver orden actual + opciones disponibles ----
  if (request.method === 'GET') {
    try {
      const { rows: options } = await pool.query(
        `SELECT attribute_option_id, option_text
         FROM attribute_option
         WHERE attribute_id = $1
         ORDER BY attribute_option_id ASC`,
        [SIZE_ATTRIBUTE_ID]
      );

      const raw = await getSetting('variant_size_order', '[]');
      let order = [];
      try { order = JSON.parse(raw); } catch { order = []; }
      if (!Array.isArray(order)) order = [];

      return response.json({ success: true, order, options });
    } catch (err) {
      return response.status(500).json({ error: err.message });
    }
  }

  // ---- POST: persistir el nuevo orden ----
  const { order } = request.body || {};

  if (!Array.isArray(order) || order.some((id) => !Number.isInteger(id))) {
    return response
      .status(400)
      .json({ error: 'El campo "order" debe ser un array de enteros.' });
  }

  try {
    await pool.query(
      `INSERT INTO setting (name, value, is_json)
       VALUES ('variant_size_order', $1, 1)
       ON CONFLICT (name) DO UPDATE SET value = EXCLUDED.value, is_json = 1`,
      [JSON.stringify(order)]
    );
    // Invalida caché interna del módulo de settings
    await refreshSetting();
    return response.json({ success: true });
  } catch (err) {
    return response.status(500).json({ error: err.message });
  }
}
