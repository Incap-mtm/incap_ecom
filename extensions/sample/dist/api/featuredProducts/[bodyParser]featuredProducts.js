import { pool } from '@evershop/evershop/lib/postgres';
import { refreshSetting } from '@evershop/evershop/setting/services';
const FEATURED_LIMIT = 10;
// Devuelve {uuid, name, image} para una lista de uuids (preservando el orden)
async function resolveByUuids(uuids) {
    if (!Array.isArray(uuids) || uuids.length === 0)
        return [];
    const { rows } = await pool.query(`SELECT p.uuid, pd.name, pi.origin_image AS image
     FROM product p
     JOIN product_description pd
       ON pd.product_description_product_id = p.product_id
     LEFT JOIN product_image pi
       ON pi.product_image_product_id = p.product_id AND pi.is_main = true
     WHERE p.uuid = ANY($1::uuid[])`, [uuids]);
    const byUuid = new Map(rows.map((r) => [r.uuid, r]));
    return uuids.map((u) => byUuid.get(u)).filter(Boolean);
}
/**
 * GET  /api/featured-products            → { selected: [{uuid,name,image}] }
 * GET  /api/featured-products?search=kw  → { results:  [{uuid,name,image}] }
 * POST /api/featured-products            → { uuids: string[] } persiste el setting
 */
export default async function featuredProducts(request, response) {
    var _a, _b;
    const admin = typeof request.getCurrentUser === 'function' ? request.getCurrentUser() : null;
    if (!admin) {
        return response.status(401).json({ error: 'No autorizado' });
    }
    if (request.method === 'GET') {
        try {
            const search = (((_a = request.query) === null || _a === void 0 ? void 0 : _a.search) || '').toString().trim();
            if (search) {
                const { rows } = await pool.query(`SELECT p.uuid, pd.name, pi.origin_image AS image
           FROM product p
           JOIN product_description pd
             ON pd.product_description_product_id = p.product_id
           LEFT JOIN product_image pi
             ON pi.product_image_product_id = p.product_id AND pi.is_main = true
           WHERE pd.name ILIKE $1
             AND p.status = true
             AND p.visibility = true
           ORDER BY pd.name ASC
           LIMIT 20`, [`%${search}%`]);
                return response.json({ success: true, results: rows });
            }
            // Sin búsqueda: devolver la selección actual resuelta
            const { rows: settingRows } = await pool.query(`SELECT value FROM setting WHERE name = 'featured_products' LIMIT 1`);
            let uuids = [];
            try {
                uuids = JSON.parse(((_b = settingRows[0]) === null || _b === void 0 ? void 0 : _b.value) || '[]');
            }
            catch (_c) {
                uuids = [];
            }
            if (!Array.isArray(uuids))
                uuids = [];
            const selected = await resolveByUuids(uuids.filter((u) => typeof u === 'string'));
            return response.json({ success: true, selected });
        }
        catch (err) {
            return response.status(500).json({ error: err.message });
        }
    }
    // POST: persistir la selección
    const { uuids } = request.body || {};
    if (!Array.isArray(uuids) || uuids.some((u) => typeof u !== 'string')) {
        return response
            .status(400)
            .json({ error: 'El campo "uuids" debe ser un array de strings (uuids de producto).' });
    }
    const cleaned = uuids.slice(0, FEATURED_LIMIT);
    try {
        await pool.query(`INSERT INTO setting (name, value, is_json)
       VALUES ('featured_products', $1, true)
       ON CONFLICT (name) DO UPDATE SET value = EXCLUDED.value, is_json = true`, [JSON.stringify(cleaned)]);
        await refreshSetting();
        return response.json({ success: true, count: cleaned.length });
    }
    catch (err) {
        return response.status(500).json({ error: err.message });
    }
}
//# sourceMappingURL=%5BbodyParser%5DfeaturedProducts.js.map