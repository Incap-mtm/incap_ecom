import { pool } from '@evershop/evershop/lib/postgres';
import { refreshSetting } from '@evershop/evershop/setting/services';
import { getFamily, getPresentation } from '../../utils/family.js';
/**
 * GET  /api/family-covers  → { success:true, families:[{family, variants:[{uuid,name,presentation,image}]}], covers }
 *   Solo familias con 2+ variaciones (las de una sola presentación no necesitan portada elegible).
 * POST /api/family-covers  → body { covers: { [family]: uuid } } persiste el setting `family_covers`.
 */
export default async function familyCovers(request, response) {
    var _a;
    const admin = typeof request.getCurrentUser === 'function' ? request.getCurrentUser() : null;
    if (!admin) {
        return response.status(401).json({ error: 'No autorizado' });
    }
    if (request.method === 'GET') {
        try {
            const { rows } = await pool.query(`SELECT p.uuid, pd.name, pi.origin_image AS image
         FROM product p
         JOIN product_description pd
           ON pd.product_description_product_id = p.product_id
         LEFT JOIN product_image pi
           ON pi.product_image_product_id = p.product_id AND pi.is_main = true
         WHERE p.status = true AND p.visibility = true
         ORDER BY pd.name`);
            const familyMap = new Map();
            rows.forEach((r) => {
                const family = getFamily(r.name) || r.name;
                if (!familyMap.has(family))
                    familyMap.set(family, []);
                familyMap.get(family).push({
                    uuid: r.uuid,
                    name: r.name,
                    presentation: getPresentation(r.name),
                    image: r.image
                });
            });
            const families = Array.from(familyMap.entries())
                .filter(([, variants]) => variants.length >= 2)
                .map(([family, variants]) => ({ family, variants }))
                .sort((a, b) => a.family.localeCompare(b.family));
            const { rows: settingRows } = await pool.query(`SELECT value FROM setting WHERE name = 'family_covers' LIMIT 1`);
            let covers = {};
            try {
                covers = JSON.parse(((_a = settingRows[0]) === null || _a === void 0 ? void 0 : _a.value) || '{}');
            }
            catch (_b) {
                covers = {};
            }
            if (!covers || typeof covers !== 'object' || Array.isArray(covers))
                covers = {};
            return response.json({ success: true, families, covers });
        }
        catch (err) {
            return response.status(500).json({ error: err.message });
        }
    }
    // POST: persistir las portadas elegidas
    const { covers } = request.body || {};
    if (!covers ||
        typeof covers !== 'object' ||
        Array.isArray(covers) ||
        Object.values(covers).some((v) => typeof v !== 'string')) {
        return response
            .status(400)
            .json({ error: 'El campo "covers" debe ser un objeto { familia: uuid }.' });
    }
    try {
        await pool.query(`INSERT INTO setting (name, value, is_json)
       VALUES ('family_covers', $1, true)
       ON CONFLICT (name) DO UPDATE SET value = EXCLUDED.value, is_json = true`, [JSON.stringify(covers)]);
        await refreshSetting();
        return response.json({ success: true });
    }
    catch (err) {
        return response.status(500).json({ error: err.message });
    }
}
//# sourceMappingURL=%5BbodyParser%5DfamilyCovers.js.map