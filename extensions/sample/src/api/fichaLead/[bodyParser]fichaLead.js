export default async function fichaLead(request, response) {
  try {
    const { nombre, email, telefono, productName, sku, fichaUrl } = request.body || {};

    if (!nombre?.trim() || !email?.trim() || !telefono?.trim() || !fichaUrl) {
      return response.status(400).json({ error: 'Todos los campos son requeridos.' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return response.status(400).json({ error: 'Email inválido.' });
    }

    const lead = { nombre: nombre.trim(), email: email.trim(), telefono: telefono.trim(), productName, sku, fichaUrl, ts: new Date().toISOString() };
    console.log('[FichaLead]', JSON.stringify(lead));

    // Intentar enviar email vía Resend si está configurado
    const resendKey = process.env.RESEND_API_KEY;
    const toEmail = process.env.FICHA_LEAD_EMAIL || process.env.STORE_OWNER_EMAIL || 'comercial@grupoincap.com.co';

    if (resendKey) {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'INCAP Web <noreply@grupoincap.com.co>',
            to: [toEmail],
            subject: `Nueva descarga de ficha técnica — ${productName || sku || 'producto'}`,
            html: `
              <h2 style="color:#2A4899">Nueva solicitud de ficha técnica</h2>
              <table style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px">
                <tr><td style="padding:6px 12px;font-weight:bold;color:#555">Nombre</td><td style="padding:6px 12px">${nombre.trim()}</td></tr>
                <tr style="background:#f8f9fa"><td style="padding:6px 12px;font-weight:bold;color:#555">Email</td><td style="padding:6px 12px"><a href="mailto:${email.trim()}">${email.trim()}</a></td></tr>
                <tr><td style="padding:6px 12px;font-weight:bold;color:#555">Teléfono</td><td style="padding:6px 12px">${telefono.trim()}</td></tr>
                <tr style="background:#f8f9fa"><td style="padding:6px 12px;font-weight:bold;color:#555">Producto</td><td style="padding:6px 12px">${productName || '—'}</td></tr>
                <tr><td style="padding:6px 12px;font-weight:bold;color:#555">SKU</td><td style="padding:6px 12px">${sku || '—'}</td></tr>
                <tr style="background:#f8f9fa"><td style="padding:6px 12px;font-weight:bold;color:#555">Ficha</td><td style="padding:6px 12px"><a href="${fichaUrl}">${fichaUrl}</a></td></tr>
              </table>
            `,
          }),
        });
      } catch (mailErr) {
        console.error('[FichaLead] Error enviando email:', mailErr.message);
      }
    }

    return response.json({ success: true, fichaUrl });

  } catch (err) {
    console.error('[FichaLead] Error:', err.message);
    return response.status(500).json({ error: 'Error procesando la solicitud.' });
  }
}
