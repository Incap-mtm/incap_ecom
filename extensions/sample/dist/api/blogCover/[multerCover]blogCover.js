import path from 'path';
import fs from 'fs';
import sharp from 'sharp';
import { CONSTANTS } from '@evershop/evershop/lib/helpers';
const MAX_WIDTH = 1200;
/**
 * Nombre de archivo seguro: sin tildes ni espacios (el static middleware de
 * Evershop no URL-decodea bien) → NFD + solo [a-z0-9._-].
 */
const sanitize = (s) => (s || 'portada')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
/**
 * Recibe la imagen de portada del blog, la convierte a WebP (máx 1200px,
 * calidad 75) con sharp y la guarda en el volumen de media de Railway.
 *
 * Disco:  <MEDIAPATH>/blog/<nombre>-<ts>.webp
 * URL:    /assets/blog/<nombre>-<ts>.webp
 *         (static.js mapea /assets → MEDIAPATH)
 */
export default async function blogCover(request, response) {
    const admin = typeof request.getCurrentUser === 'function' ? request.getCurrentUser() : null;
    if (!admin) {
        return response.status(401).json({ success: false, error: 'No autorizado' });
    }
    try {
        const file = request.file;
        if (!file) {
            return response
                .status(400)
                .json({ success: false, error: 'No se recibió ninguna imagen.' });
        }
        const dir = path.join(CONSTANTS.MEDIAPATH, 'blog');
        fs.mkdirSync(dir, { recursive: true });
        const baseName = sanitize(path.parse(file.originalname || 'portada').name);
        const ts = Date.now();
        const fileName = `${baseName}-${ts}.webp`;
        const filePath = path.join(dir, fileName);
        await sharp(file.buffer)
            .resize({ width: MAX_WIDTH, withoutEnlargement: true })
            .webp({ quality: 75 })
            .toFile(filePath);
        const url = `/assets/blog/${fileName}`;
        return response.json({ success: true, url });
    }
    catch (err) {
        return response.status(500).json({ success: false, error: err.message });
    }
}
//# sourceMappingURL=%5BmulterCover%5DblogCover.js.map