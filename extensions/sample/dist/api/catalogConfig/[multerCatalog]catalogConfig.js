import path from 'path';
import fs from 'fs';
import { CONSTANTS } from '@evershop/evershop/lib/helpers';
import { pool } from '@evershop/evershop/lib/postgres';
import { refreshSetting } from '@evershop/evershop/setting/services';
/**
 * Guarda la configuración del botón "Descargar Catálogo" del header:
 *   - catalog_button_text  → texto del botón (editable, se actualiza cada mes)
 *   - catalog_url          → URL pública del PDF (si se subió uno nuevo)
 *
 * El PDF se guarda en el volumen de media:
 *   Disco: <MEDIAPATH>/catalogo/catalogo-<ts>.pdf
 *   URL:   /assets/catalogo/catalogo-<ts>.pdf  (static.js mapea /assets → MEDIAPATH)
 *
 * El archivo es opcional: si no se sube PDF, solo se actualiza el texto.
 */
async function upsertSetting(name, value) {
    await pool.query(`INSERT INTO setting (name, value, is_json)
     VALUES ($1, $2, false)
     ON CONFLICT (name) DO UPDATE SET value = EXCLUDED.value, is_json = false`, [name, value]);
}
export default async function catalogConfig(request, response) {
    var _a;
    const admin = typeof request.getCurrentUser === 'function' ? request.getCurrentUser() : null;
    if (!admin) {
        return response.status(401).json({ success: false, error: 'No autorizado' });
    }
    try {
        const buttonText = (((_a = request.body) === null || _a === void 0 ? void 0 : _a.buttonText) || '').trim();
        if (!buttonText) {
            return response.status(400).json({ success: false, error: 'El texto del botón es requerido.' });
        }
        let catalogUrl = null;
        const file = request.file;
        if (file) {
            if (file.mimetype !== 'application/pdf') {
                return response.status(400).json({ success: false, error: 'El catálogo debe ser un PDF.' });
            }
            const dir = path.join(CONSTANTS.MEDIAPATH, 'catalogo');
            fs.mkdirSync(dir, { recursive: true });
            const ts = Date.now();
            const fileName = `catalogo-${ts}.pdf`;
            fs.writeFileSync(path.join(dir, fileName), file.buffer);
            catalogUrl = `/assets/catalogo/${fileName}`;
        }
        // Persistir settings
        await upsertSetting('catalog_button_text', buttonText);
        if (catalogUrl) {
            await upsertSetting('catalog_url', catalogUrl);
        }
        await refreshSetting();
        return response.json({ success: true, catalogButtonText: buttonText, catalogUrl });
    }
    catch (err) {
        console.error('[CatalogConfig] Error:', err.message);
        return response.status(500).json({ success: false, error: err.message });
    }
}
//# sourceMappingURL=%5BmulterCatalog%5DcatalogConfig.js.map