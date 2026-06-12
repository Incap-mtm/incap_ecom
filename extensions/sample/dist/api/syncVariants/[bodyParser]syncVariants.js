import { pool } from '@evershop/evershop/lib/postgres/connection';
import crypto from 'crypto';
/* ── Helpers (portados de scripts/migrate-variantes.mjs) ── */
function normalizeSize(raw) {
    let s = raw.trim();
    s = s.replace(/(\d),(\d)/g, '$1.$2');
    s = s.replace(/^(\d+\.?\d*)\s*[Gg]al$/i, '$1 Gal');
    if (/^\d+$/.test(s))
        s = s + 'cc';
    s = s.replace(/([0-9])Kg$/, '$1kg');
    return s;
}
function getFamily(name) {
    const idx = name.lastIndexOf(' - ');
    return idx === -1 ? null : name.substring(0, idx).trim();
}
function getSize(name) {
    const idx = name.lastIndexOf(' - ');
    return idx === -1 ? null : name.substring(idx + 3).trim();
}
/**
 * Endpoint admin: normaliza tamaños y agrupa productos por familia en variant_groups.
 * Es idempotente: solo crea grupos/variantes faltantes, no toca los ya migrados.
 */
export default async function syncVariants(request, response) {
    var _a, _b;
    // Defensa extra (la ruta ya es access:private → exige admin logueado)
    const admin = typeof request.getCurrentUser === 'function' ? request.getCurrentUser() : null;
    if (!admin) {
        return response.status(401).json({ success: false, error: 'No autorizado' });
    }
    try {
        // IDs dinámicos (en vez de hardcodear)
        const { rows: attrRows } = await pool.query(`SELECT attribute_id FROM attribute WHERE attribute_code = 'size' LIMIT 1`);
        if (!attrRows.length) {
            return response.status(400).json({ success: false, error: 'El atributo "size" no existe.' });
        }
        const SIZE_ATTRIBUTE_ID = attrRows[0].attribute_id;
        const { rows: grpRows } = await pool.query(`SELECT attribute_group_id FROM attribute_group WHERE group_name = 'Default' LIMIT 1`);
        const ATTRIBUTE_GROUP_ID = grpRows.length ? grpRows[0].attribute_group_id : 1;
        const { rows: products } = await pool.query(`
      SELECT p.product_id, p.sku, p.variant_group_id, pd.product_description_id, pd.name
      FROM product p
      JOIN product_description pd ON pd.product_description_product_id = p.product_id
      WHERE p.status = true
      ORDER BY p.product_id
    `);
        // PASO 1 — normalizar nombres de tamaño
        let renamed = 0;
        for (const p of products) {
            const rawSize = getSize(p.name);
            if (!rawSize)
                continue;
            const normSize = normalizeSize(rawSize);
            if (normSize !== rawSize) {
                const newName = `${getFamily(p.name)} - ${normSize}`;
                await pool.query('UPDATE product_description SET name = $1 WHERE product_description_id = $2', [newName, p.product_description_id]);
                p.name = newName;
                renamed++;
            }
        }
        // PASO 2 — agrupar por familia
        const families = new Map();
        for (const p of products) {
            const family = getFamily(p.name);
            if (!family)
                continue;
            if (!families.has(family))
                families.set(family, []);
            families.get(family).push({ ...p, size: getSize(p.name) });
        }
        const toMigrate = [...families.entries()].filter(([, ps]) => ps.length >= 2);
        // Opciones de tamaño existentes
        const { rows: existingOpts } = await pool.query('SELECT attribute_option_id, option_text FROM attribute_option WHERE attribute_id = $1', [SIZE_ATTRIBUTE_ID]);
        const optionMap = new Map(existingOpts.map((o) => [o.option_text, o.attribute_option_id]));
        const sizesNeeded = new Set();
        for (const [, ps] of toMigrate)
            ps.forEach((p) => p.size && sizesNeeded.add(p.size));
        let optionsCreated = 0;
        for (const size of sizesNeeded) {
            if (!optionMap.has(size)) {
                const { rows: [opt] } = await pool.query(`INSERT INTO attribute_option (uuid, attribute_id, attribute_code, option_text)
           VALUES ($1, $2, 'size', $3) RETURNING attribute_option_id`, [crypto.randomUUID(), SIZE_ATTRIBUTE_ID, size]);
                optionMap.set(size, opt.attribute_option_id);
                optionsCreated++;
            }
        }
        let groupsCreated = 0, productsUpdated = 0, skipped = 0;
        for (const [, ps] of toMigrate) {
            const existingGroupId = (_b = (_a = ps.find((p) => p.variant_group_id !== null)) === null || _a === void 0 ? void 0 : _a.variant_group_id) !== null && _b !== void 0 ? _b : null;
            const newProducts = ps.filter((p) => p.variant_group_id === null);
            if (existingGroupId !== null && newProducts.length === 0) {
                skipped++;
                continue;
            }
            let variantGroupId = existingGroupId;
            if (variantGroupId === null) {
                const { rows: [vg] } = await pool.query(`INSERT INTO variant_group (uuid, attribute_group_id, attribute_one, visibility)
           VALUES ($1, $2, $3, false) RETURNING variant_group_id`, [crypto.randomUUID(), ATTRIBUTE_GROUP_ID, SIZE_ATTRIBUTE_ID]);
                variantGroupId = vg.variant_group_id;
                groupsCreated++;
            }
            for (const p of newProducts) {
                const optionId = optionMap.get(p.size);
                await pool.query('UPDATE product SET variant_group_id = $1 WHERE product_id = $2', [variantGroupId, p.product_id]);
                await pool.query('DELETE FROM product_attribute_value_index WHERE product_id = $1 AND attribute_id = $2', [p.product_id, SIZE_ATTRIBUTE_ID]);
                await pool.query(`INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
           VALUES ($1, $2, $3, $4)`, [p.product_id, SIZE_ATTRIBUTE_ID, optionId, p.size]);
                productsUpdated++;
            }
        }
        return response.json({
            success: true,
            summary: {
                productosActivos: products.length,
                nombresNormalizados: renamed,
                gruposCreados: groupsCreated,
                opcionesTamanoNuevas: optionsCreated,
                productosVinculados: productsUpdated,
                familiasYaMigradas: skipped,
            },
        });
    }
    catch (err) {
        return response.status(500).json({ success: false, error: err.message });
    }
}
//# sourceMappingURL=%5BbodyParser%5DsyncVariants.js.map