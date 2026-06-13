import path from 'path';
import fs from 'fs';
import sharp from 'sharp';
import { CONSTANTS } from '@evershop/evershop/lib/helpers';
import { pool } from '@evershop/evershop/lib/postgres';
const MAX_PER_RUN = 300; // tope de conversiones por llamada (evita timeouts)
const ROOTS = ['catalog', 'products']; // dónde viven imágenes de producto en /media
function walk(dir, acc = []) {
    let entries = [];
    try {
        entries = fs.readdirSync(dir, { withFileTypes: true });
    }
    catch (_a) {
        return acc;
    }
    for (const e of entries) {
        const full = path.join(dir, e.name);
        if (e.isDirectory())
            walk(full, acc);
        else
            acc.push(full);
    }
    return acc;
}
const toWebp = (p) => p.replace(/\.(jpe?g|png)$/i, '.webp');
// /assets/products/foo.jpg → <MEDIAPATH>/products/foo.jpg
const urlToDisk = (mediaPath, url) => path.join(mediaPath, url.replace(/^\/?assets\//, ''));
/**
 * Endpoint admin (2 fases):
 *  1) Convierte a WebP las imágenes JPG/PNG que aún no tienen su .webp (sharp).
 *  2) Sincroniza la DB: product_image.origin_image .jpg/.png → .webp cuando el
 *     .webp existe en disco (así el image processor de la ficha sirve el WebP en
 *     vez de 404 sobre el original). Idempotente.
 */
export default async function optimizeImages(request, response) {
    const admin = typeof request.getCurrentUser === 'function' ? request.getCurrentUser() : null;
    if (!admin) {
        return response.status(401).json({ success: false, error: 'No autorizado' });
    }
    try {
        const mediaPath = CONSTANTS.MEDIAPATH;
        // ── Fase 1: convertir en disco ──
        let convertidas = 0, yaOptimizadas = 0, errores = 0, pendientes = 0;
        for (const root of ROOTS) {
            const base = path.join(mediaPath, root);
            if (!fs.existsSync(base))
                continue;
            const files = walk(base).filter((f) => /\.(jpe?g|png)$/i.test(f));
            for (const f of files) {
                const webp = toWebp(f);
                if (fs.existsSync(webp)) {
                    yaOptimizadas++;
                    continue;
                }
                if (convertidas >= MAX_PER_RUN) {
                    pendientes++;
                    continue;
                }
                try {
                    await sharp(f).webp({ quality: 82 }).toFile(webp);
                    convertidas++;
                }
                catch (_a) {
                    errores++;
                }
            }
        }
        // ── Fase 2: sincronizar DB origin_image → .webp ──
        const { rows } = await pool.query(`SELECT product_image_id, origin_image FROM product_image
       WHERE origin_image ~* '\\.(jpe?g|png)$'`);
        const fixableIds = [];
        let dbSinWebp = 0;
        for (const r of rows) {
            if (fs.existsSync(urlToDisk(mediaPath, toWebp(r.origin_image)))) {
                fixableIds.push(r.product_image_id);
            }
            else {
                dbSinWebp++;
            }
        }
        // Un solo UPDATE atómico: cada fila recibe su propio .webp vía regexp_replace
        if (fixableIds.length) {
            await pool.query(`UPDATE product_image
         SET origin_image = regexp_replace(origin_image, '\\.(jpe?g|png)$', '.webp', 'i')
         WHERE product_image_id = ANY($1::int[])`, [fixableIds]);
        }
        const dbActualizadas = fixableIds.length;
        return response.json({
            success: true,
            convertidas,
            yaOptimizadas,
            errores,
            pendientes,
            dbActualizadas,
            dbSinWebp,
            message: (pendientes > 0 ? `Quedaron ${pendientes} por convertir — re-ejecutá. ` : '') +
                (dbSinWebp > 0 ? `${dbSinWebp} imágenes sin .webp (revisar/re-subir). ` : '') +
                (pendientes === 0 && dbSinWebp === 0 ? 'Todo optimizado y sincronizado.' : ''),
        });
    }
    catch (err) {
        return response.status(500).json({ success: false, error: err.message });
    }
}
//# sourceMappingURL=%5BbodyParser%5DoptimizeImages.js.map