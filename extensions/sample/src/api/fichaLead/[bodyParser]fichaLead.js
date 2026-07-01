export default async function fichaLead(request, response) {
  try {
    const {
      tipo,           // 'ficha' | 'catalogo'
      nombre,
      cargo,
      celular,
      correo,
      fabrica,        // 'si' | 'no'
      comercializa,   // 'si' | 'no'
      productName,
      sku,
      downloadUrl,
    } = request.body || {};

    if (!nombre?.trim() || !celular?.trim() || !correo?.trim() || !downloadUrl) {
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
    const toEmail = process.env.FICHA_LEAD_EMAIL || process.env.STORE_OWNER_EMAIL || 'comercial@grupoincap.com.co';

    if (resendKey) {
      const asunto = esCatalogo
        ? 'Nueva descarga de catálogo'
        : `Nueva descarga de ficha técnica — ${productName || sku || 'producto'}`;
      const row = (label, value, alt) =>
        `<tr${alt ? ' style="background:#f8f9fa"' : ''}><td style="padding:6px 12px;font-weight:bold;color:#555">${label}</td><td style="padding:6px 12px">${value}</td></tr>`;
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
            to: [toEmail],
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
      } catch (mailErr) {
        console.error('[FichaLead] Error enviando email:', mailErr.message);
      }
    }

    return response.json({ success: true, downloadUrl });
  } catch (err) {
    console.error('[FichaLead] Error:', err.message);
    return response.status(500).json({ error: 'Error procesando la solicitud.' });
  }
}
