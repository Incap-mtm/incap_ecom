// No pg import — uses EverShop's internal GraphQL to fetch the catalog.
const GQL_CATALOG = JSON.stringify({
  query: `{
    categories(filters:[{key:"limit",operation:eq,value:"100"}]) {
      items {
        urlKey
        products(filters:[{key:"limit",operation:eq,value:"500"}]) {
          items {
            sku name status url
            attributes: attributeIndex { attributeCode optionText }
          }
        }
      }
    }
  }`
});

function stripHtml(h) {
  return (h || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().substring(0, 250);
}

function attr(attrs, code) {
  const a = (attrs || []).find(x => x.attributeCode === code);
  return a ? a.optionText : '';
}

const SYSTEM = `Eres el asesor técnico de INCAP, empresa colombiana líder en adhesivos industriales.
Tu misión: recomendar el producto INCAP exacto según el problema del usuario.

INSTRUCCIONES:
- Responde en español, tono técnico pero cercano.
- Si necesitas más datos, haz máximo 2 preguntas concretas.
- Recomienda 1 a 3 productos usando el formato [[SKU: CODIGO]].
- Explica brevemente por qué ese producto resuelve el problema.
- Si hay fallas de pegue, pregunta: material, preparación, temperatura, humedad.
- Máximo 3 párrafos por respuesta.
- Nunca inventes productos que no estén en el catálogo.

CATÁLOGO:
`;

async function fetchCatalog(port) {
  const res = await fetch(`http://localhost:${port}/graphql`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: GQL_CATALOG,
  });
  const { data } = await res.json();
  const lines = [];
  for (const cat of (data?.categories?.items || [])) {
    for (const p of (cat.products?.items || [])) {
      if (!p.status) continue;
      const usos = stripHtml(attr(p.attributes, 'usos'));
      const caract = stripHtml(attr(p.attributes, 'caracteristicas'));
      const modo = stripHtml(attr(p.attributes, 'modo_empleo'));
      lines.push(
        `SKU:${p.sku} | ${p.name} | ${cat.urlKey}` +
        (usos ? ` | Usos: ${usos}` : '') +
        (caract ? ` | Características: ${caract}` : '') +
        (modo ? ` | Modo: ${modo}` : '')
      );
    }
  }
  return { catalog: lines.join('\n'), cats: data?.categories?.items || [] };
}

export default async function advisor(request, response) {
  try {
    const { messages } = request.body || {};
    if (!Array.isArray(messages) || messages.length === 0) {
      return response.status(400).json({ error: 'messages requerido' });
    }
    if (!process.env.ANTHROPIC_API_KEY) {
      return response.status(500).json({ error: 'Servicio no configurado' });
    }

    const port = process.env.PORT || 8080;

    // Fetch catalog
    let catalog = '';
    let cats = [];
    try {
      ({ catalog, cats } = await fetchCatalog(port));
    } catch (e) {
      catalog = '(catálogo no disponible)';
    }

    // Call Claude
    const apiRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 800,
        system: SYSTEM + catalog,
        messages: messages.map(m => ({ role: m.role, content: m.content })),
      }),
    });

    const claudeData = await apiRes.json();
    if (!apiRes.ok) {
      console.error('Anthropic error:', JSON.stringify(claudeData));
      return response.status(500).json({ error: 'Error en el servicio de IA' });
    }

    const reply = claudeData.content?.[0]?.text || '';

    // Extract SKU markers [[SKU: XXXX]]
    const skuMatches = [...reply.matchAll(/\[\[SKU:\s*([^\]]+)\]\]/gi)];
    const skus = [...new Set(skuMatches.map(m => m[1].trim().toUpperCase()))];

    // Build product cards from catalog
    const products = [];
    for (const cat of cats) {
      for (const p of (cat.products?.items || [])) {
        if (skus.includes((p.sku || '').toUpperCase())) {
          products.push({ sku: p.sku, name: p.name, url: p.url || `/${cat.urlKey}` });
        }
      }
    }

    const cleanReply = reply.replace(/\[\[SKU:\s*[^\]]+\]\]/gi, '').replace(/\s{2,}/g, ' ').trim();
    return response.json({ reply: cleanReply, products });

  } catch (err) {
    console.error('TechnicalAdvisor error:', err.message);
    return response.status(500).json({ error: 'Error procesando la consulta' });
  }
}
