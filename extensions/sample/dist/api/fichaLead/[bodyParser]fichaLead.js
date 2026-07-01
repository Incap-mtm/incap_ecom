import { pool } from '@evershop/evershop/lib/postgres';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
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
            nombre: nombre.trim(),
            cargo: (cargo || '').trim() || null,
            celular: celular.trim(),
            correo: correo.trim(),
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
                : `Nueva descarga de ficha técnica — ${productName || sku || 'producto'}`;
            const row = (label, value, alt) => `<tr${alt ? ' style="background:#f8f9fa"' : ''}><td style="padding:6px 12px;font-weight:bold;color:#555">${label}</td><td style="padding:6px 12px">${value}</td></tr>`;
            const filasProducto = esCatalogo
                ? ''
                : row('Producto', productName || '—', false) + row('SKU', sku || '—', true);
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
                ${row('Nombre', lead.nombre, false)}
                ${row('Cargo', lead.cargo || '—', true)}
                ${row('Celular', lead.celular, false)}
                ${row('Correo', `<a href="mailto:${lead.correo}">${lead.correo}</a>`, true)}
                ${row('¿Fabrica con nuestros productos?', lead.fabrica, false)}
                ${row('¿Comercializa con nuestros productos?', lead.comercializa, true)}
                ${filasProducto}
                ${row('Archivo', `<a href="${downloadUrl}">${downloadUrl}</a>`, false)}
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