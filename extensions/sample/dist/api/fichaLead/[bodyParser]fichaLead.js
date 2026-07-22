import { pool } from '@evershop/evershop/lib/postgres';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
/**
 * Escapa HTML para interpolar valores del usuario en el email SIN riesgo de
 * inyección (los campos del form van al cuerpo del correo que recibe el equipo).
 * El regex de email es laxo (permite comillas), así que hasta `correo` debe
 * escaparse antes de ir a un atributo href.
 */
function escapeHtml(v) {
    return String(v !== null && v !== void 0 ? v : '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}
/** Recorta a n caracteres para evitar payloads gigantes en el email/log. */
function clip(v, n) {
    const s = String(v !== null && v !== void 0 ? v : '').trim();
    return s.length > n ? s.slice(0, n) : s;
}
// Hosts propios permitidos para linkear el archivo en el email.
const ALLOWED_DOWNLOAD_HOSTS = new Set([
    'grupoincap.com.co',
    'www.grupoincap.com.co',
]);
/**
 * `downloadUrl` llega del cliente y puede POSTearse directo (evadiendo la UI).
 * Solo lo tratamos como enlace clicable si es una ruta relativa same-origin o
 * apunta a un host de INCAP; cualquier otra cosa (URL externa arbitraria) se
 * muestra como texto plano en el correo → neutraliza el phishing por link.
 */
function isSafeDownloadUrl(url) {
    if (typeof url !== 'string' || !url)
        return false;
    // Relativa same-origin (no protocolo-relativa "//host")
    if (url.startsWith('/') && !url.startsWith('//'))
        return true;
    try {
        const u = new URL(url);
        if (u.protocol !== 'https:' && u.protocol !== 'http:')
            return false;
        return ALLOWED_DOWNLOAD_HOSTS.has(u.hostname) || u.hostname.endsWith('.railway.app');
    }
    catch (_a) {
        return false;
    }
}
/**
 * Destinatarios de la notificación de lead. Lee FRESCO de la DB el setting
 * `lead_emails` (editable desde el admin, varios separados por coma/;/salto).
 * Fallback: env FICHA_LEAD_EMAIL / STORE_OWNER_EMAIL, o la casilla comercial.
 */
async function getRecipients() {
    var _a;
    try {
        const { rows } = await pool.query(`SELECT value FROM setting WHERE name = 'lead_emails' LIMIT 1`);
        const raw = ((_a = rows[0]) === null || _a === void 0 ? void 0 : _a.value) || '';
        const list = raw.split(/[,;\n]+/).map((s) => s.trim()).filter((e) => EMAIL_RE.test(e));
        if (list.length)
            return list;
    }
    catch (e) {
        console.error('[FichaLead] getRecipients:', e.message);
    }
    const envEmail = process.env.FICHA_LEAD_EMAIL || process.env.STORE_OWNER_EMAIL;
    return [envEmail || 'comercial@grupoincap.com.co'];
}
export default async function fichaLead(request, response) {
    try {
        const { tipo, // 'ficha' | 'catalogo'
        nombre, cargo, celular, correo, fabrica, // 'si' | 'no'
        comercializa, // 'si' | 'no'
        productName, sku, downloadUrl, } = request.body || {};
        if (!(nombre === null || nombre === void 0 ? void 0 : nombre.trim()) || !(celular === null || celular === void 0 ? void 0 : celular.trim()) || !(correo === null || correo === void 0 ? void 0 : correo.trim()) || !downloadUrl) {
            return response.status(400).json({ error: 'Nombre, celular, correo y el archivo son requeridos.' });
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
            return response.status(400).json({ error: 'Correo inválido.' });
        }
        const esCatalogo = tipo === 'catalogo';
        const yesNo = (v) => (v === 'si' ? 'Sí' : v === 'no' ? 'No' : '—');
        const lead = {
            tipo: esCatalogo ? 'catalogo' : 'ficha',
            nombre: clip(nombre, 120),
            cargo: clip(cargo, 120) || null,
            celular: clip(celular, 40),
            correo: clip(correo, 160),
            fabrica: yesNo(fabrica),
            comercializa: yesNo(comercializa),
            productName: productName || null,
            sku: sku || null,
            downloadUrl,
            ts: new Date().toISOString(),
        };
        console.log('[FichaLead]', JSON.stringify(lead));
        // Enviar email vía Resend si está configurado
        const resendKey = process.env.RESEND_API_KEY;
        if (resendKey) {
            const recipients = await getRecipients();
            const asunto = esCatalogo
                ? 'Nueva descarga de catálogo'
                : `Nueva descarga de ficha técnica — ${clip(productName || sku || 'producto', 120)}`;
            // `value` ya debe venir escapado por el caller; `label` es texto fijo nuestro.
            const row = (label, value, alt) => `<tr${alt ? ' style="background:#f8f9fa"' : ''}><td style="padding:6px 12px;font-weight:bold;color:#555">${label}</td><td style="padding:6px 12px">${value}</td></tr>`;
            const filasProducto = esCatalogo
                ? ''
                : row('Producto', escapeHtml(clip(productName, 200)) || '—', false) +
                    row('SKU', escapeHtml(clip(sku, 60)) || '—', true);
            // Archivo: linkeable solo si es una URL propia; si no, texto plano.
            const urlSafe = isSafeDownloadUrl(downloadUrl);
            const urlEsc = escapeHtml(clip(downloadUrl, 500));
            const celdaArchivo = urlSafe
                ? `<a href="${urlEsc}">${urlEsc}</a>`
                : `${urlEsc} <span style="color:#c0392b;font-size:12px">(enlace externo — no verificado)</span>`;
            const correoEsc = escapeHtml(lead.correo);
            try {
                await fetch('https://api.resend.com/emails', {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${resendKey}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        from: 'INCAP Web <noreply@grupoincap.com.co>',
                        to: recipients,
                        subject: asunto,
                        html: `
              <h2 style="color:#2A4899">${esCatalogo ? 'Nueva solicitud de catálogo' : 'Nueva solicitud de ficha técnica'}</h2>
              <table style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px">
                ${row('Nombre', escapeHtml(lead.nombre), false)}
                ${row('Cargo', escapeHtml(lead.cargo || '—'), true)}
                ${row('Celular', escapeHtml(lead.celular), false)}
                ${row('Correo', `<a href="mailto:${correoEsc}">${correoEsc}</a>`, true)}
                ${row('¿Fabrica con nuestros productos?', escapeHtml(lead.fabrica), false)}
                ${row('¿Comercializa con nuestros productos?', escapeHtml(lead.comercializa), true)}
                ${filasProducto}
                ${row('Archivo', celdaArchivo, false)}
              </table>
            `,
                    }),
                });
            }
            catch (mailErr) {
                console.error('[FichaLead] Error enviando email:', mailErr.message);
            }
        }
        return response.json({ success: true, downloadUrl });
    }
    catch (err) {
        console.error('[FichaLead] Error:', err.message);
        return response.status(500).json({ error: 'Error procesando la solicitud.' });
    }
}
//# sourceMappingURL=%5BbodyParser%5DfichaLead.js.map