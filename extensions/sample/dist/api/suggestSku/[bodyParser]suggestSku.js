import { pool } from '@evershop/evershop/lib/postgres';
import { encodeSizeToken } from './encodeSize.js';
/**
 * POST /api/suggest-sku
 * Sugiere un SKU para un producto basándose en su nombre.
 *
 * Lógica:
 *  - Caso A (familia existente): toma el prefijo LINEA-VARIANTE de un hermano.
 *    source:'sibling', needsReview:false (salvo token no-confident).
 *  - Caso B (familia nueva): genera prefijo de 2+2 chars. source:'generated', needsReview:true.
 *  - Token de tamaño: encodeSizeToken(presentación). Si null o !confident → needsReview:true.
 *  - Unicidad: si el SKU ya existe → needsReview:true + note.
 *
 * Derivación familia/presentación: misma lógica que
 * themes/industrial-glue/src/utils/family.ts (getFamily / getPresentation).
 */
export default async function suggestSku(request, response) {
    try {
        const { name } = request.body || {};
        if (!name || !String(name).trim()) {
            return response.status(400).json({
                success: false,
                error: 'El nombre del producto es requerido.'
            });
        }
        const productName = String(name).trim();
        // --- Derivar familia y presentación (misma lógica que family.ts) ---
        const i = productName.lastIndexOf(' - ');
        const family = i === -1 ? productName : productName.substring(0, i).trim();
        const size = i === -1 ? '' : productName.substring(i + 3).trim();
        // --- Buscar hermanos: productos de la misma familia ---
        const siblingsResult = await pool.query(`SELECT p.sku, d.name
       FROM product p
       JOIN product_description d ON d.product_description_product_id = p.product_id
       WHERE p.sku <> '' AND p.sku IS NOT NULL AND d.name ILIKE $1
       ORDER BY p.sku`, [family + ' - %']);
        let prefix;
        let source;
        let needsReview;
        if (siblingsResult.rows.length > 0) {
            // --- Caso A: familia existente → copiar prefijo del hermano ---
            const sibSku = siblingsResult.rows[0].sku;
            const segments = sibSku.split('-');
            if (segments.length >= 2) {
                prefix = segments[0] + '-' + segments[1];
            }
            else {
                // SKU hermano malformado (solo 1 segmento) → usar como prefijo directamente
                prefix = sibSku;
            }
            source = 'sibling';
            needsReview = false;
        }
        else {
            // --- Caso B: familia nueva → generar prefijo ---
            // seg1: primeras 2 letras [A-Za-z] del nombre de la familia, mayúsculas
            const lettersOnly = family.replace(/[^A-Za-z]/g, '');
            const seg1 = lettersOnly.substring(0, 2).toUpperCase() || 'XX';
            // Verificar colisión de prefijo seg1 contra prefijos existentes
            // (no es bloqueante, solo informa needsReview)
            const prefixCheckResult = await pool.query(`SELECT DISTINCT UPPER(LEFT(sku, 2)) AS seg1
         FROM product
         WHERE sku <> '' AND sku IS NOT NULL AND UPPER(LEFT(sku, 2)) = $1`, [seg1]);
            const seg1Collision = prefixCheckResult.rows.length > 0;
            // seg2: 2 chars de la 2da palabra del family, o consonantes si solo hay una
            const words = family.split(/\s+/).filter(Boolean);
            let seg2Raw = '';
            if (words.length >= 2) {
                seg2Raw = words[1].replace(/[^A-Za-z]/g, '').substring(0, 2);
            }
            else {
                // Una sola palabra: tomar las primeras 2 consonantes
                const consonants = family.replace(/[^BCDFGHJKLMNPQRSTVWXYZbcdfghjklmnpqrstvwxyz]/g, '');
                seg2Raw = consonants.substring(0, 2);
            }
            const seg2 = (seg2Raw || 'XX').toUpperCase();
            prefix = seg1 + '-' + seg2;
            source = 'generated';
            needsReview = true; // siempre true para familia nueva
            // Loguear colisión pero sin bloquear
            if (seg1Collision) {
                console.warn(`[suggestSku] seg1 '${seg1}' colisiona con prefijos existentes (needsReview ya true)`);
            }
        }
        // --- Codificar token de tamaño ---
        const enc = encodeSizeToken(size);
        if (!enc.token || !enc.confident) {
            needsReview = true;
        }
        const sku = enc.token ? `${prefix}-${enc.token}` : `${prefix}-`;
        // --- Verificar unicidad del SKU resultante ---
        let note;
        if (enc.token) {
            const dupResult = await pool.query('SELECT 1 FROM product WHERE sku = $1 LIMIT 1', [sku]);
            if (dupResult.rows.length > 0) {
                needsReview = true;
                note = 'Ese SKU ya existe — ¿es un duplicado?';
            }
        }
        const responseData = {
            sku,
            needsReview,
            source,
            family,
            size,
            ...(note ? { note } : {})
        };
        return response.status(201).json({ success: true, data: responseData });
    }
    catch (err) {
        console.error('[suggestSku] Error:', err.message);
        return response.status(500).json({
            success: false,
            error: err.message || 'Error interno al sugerir SKU.'
        });
    }
}
//# sourceMappingURL=%5BbodyParser%5DsuggestSku.js.map