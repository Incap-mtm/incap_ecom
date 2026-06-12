import path from 'path';
import fs from 'fs';
import sharp from 'sharp';
import { CONSTANTS } from '@evershop/evershop/lib/helpers';
const MAX_PER_RUN = 300; // tope por llamada para no exceder timeouts
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
/**
 * Endpoint admin: convierte a WebP las imágenes de producto (JPG/PNG) que aún no
 * tienen su versión .webp en el volumen /media. El middleware webpNegotiation las
 * sirve automáticamente. Idempotente: salta las que ya tienen .webp.
 */
export default async function optimizeImages(request, response) {
    const admin = typeof request.getCurrentUser === 'function' ? request.getCurrentUser() : null;
    if (!admin) {
        return response.status(401).json({ success: false, error: 'No autorizado' });
    }
    try {
        const mediaPath = CONSTANTS.MEDIAPATH;
        const root = path.join(mediaPath, 'catalog');
        if (!fs.existsSync(root)) {
            return response.json({ success: true, convertidas: 0, message: 'No hay carpeta media/catalog todavía.' });
        }
        const files = walk(root).filter((f) => /\.(jpe?g|png)$/i.test(f));
        let convertidas = 0, yaOptimizadas = 0, errores = 0, pendientes = 0;
        for (const f of files) {
            const webp = f.replace(/\.(jpe?g|png)$/i, '.webp');
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
        return response.json({
            success: true,
            convertidas,
            yaOptimizadas,
            errores,
            pendientes,
            totalRevisadas: files.length,
            message: pendientes > 0
                ? `Quedaron ${pendientes} pendientes — volvé a ejecutar para continuar.`
                : 'Todas las imágenes de producto están optimizadas.',
        });
    }
    catch (err) {
        return response.status(500).json({ success: false, error: err.message });
    }
}
//# sourceMappingURL=%5BbodyParser%5DoptimizeImages.js.map