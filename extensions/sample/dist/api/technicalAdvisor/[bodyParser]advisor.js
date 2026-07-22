// No pg import — uses EverShop's internal GraphQL to fetch the catalog.
import { getSetting } from '@evershop/evershop/setting/services';
import { parseBlogIndex } from '../../components/blogData.js';
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
Tu misión: ayudar al usuario recomendando el producto INCAP exacto según su problema, y también responder dudas sobre la empresa (Grupo INCAP) y su contenido (blog).

INSTRUCCIONES:
- Responde en español, tono técnico pero cercano.
- Si necesitas más datos, haz máximo 2 preguntas concretas.
- Recomienda 1 a 3 productos usando el formato [[SKU: CODIGO]] justo después del nombre del producto en negrita.
- Explica brevemente por qué ese producto resuelve el problema.
- Si hay fallas de pegue, pregunta: material, preparación, temperatura, humedad.
- Sé conciso: máximo ~4 bloques cortos.
- Nunca inventes productos que no estén en el catálogo.

SOBRE LA EMPRESA Y EL BLOG:
- Si el usuario pregunta quiénes son, qué hacen, su historia, misión, visión, marcas o valores, respóndelo usando SOLO la sección "SOBRE NOSOTROS".
- Si un artículo del BLOG es relevante para la consulta, menciónalo y enlázalo con el marcador [[BLOG: slug]] usando el slug exacto de la lista. Usa el marcador como máximo para 2 artículos.
- No inventes datos de la empresa ni artículos que no estén en las secciones provistas.

CUÁNDO DERIVAR A UN ASESOR HUMANO:
- Si NO tienes una respuesta acertiva y confiable (el catálogo no cubre el caso, la pregunta excede la información disponible, piden precios/stock/pedidos, o el usuario quiere atención personalizada), NO inventes: dilo con honestidad e incluye el marcador [[WHATSAPP]] invitando a hablar con un asesor humano por WhatsApp.
- No abuses del marcador: úsalo solo cuando de verdad no puedas resolver con la información disponible.

FORMATO (Markdown, para legibilidad en un chat angosto):
- Separa las ideas en párrafos cortos, con UNA línea en blanco entre ellos.
- Usa **negrita** para nombres de producto y términos clave.
- Antes de una sección, podés usar un subtítulo con "## " cuando aporte claridad (ej. "## Cómo aplicarlo").
- Usa listas con "- " (viñetas) o "1." (pasos numerados) para enumerar características o pasos. Cada ítem va en su PROPIA línea; nunca juntes varios ítems en una sola línea.
- No pongas en negrita el número o el guión del ítem; la negrita es solo para palabras clave dentro del texto.
- No uses tablas ni bloques de código.
`;
/** Recorta un texto a n caracteres sin cortar feo. */
function truncate(s, n) {
    const t = (s || '').toString().trim();
    return t.length > n ? t.slice(0, n).trim() + '…' : t;
}
/**
 * Arma el bloque "SOBRE NOSOTROS" a partir del setting JSON quienes_somos
 * (hero, somos/marcas, misión, visión, pilares, cifras). Tolerante a campos
 * ausentes: solo incluye lo que exista.
 */
function buildAbout(qsRaw) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    try {
        const qs = JSON.parse(qsRaw || '{}');
        const parts = [];
        if ((_a = qs.hero) === null || _a === void 0 ? void 0 : _a.titulo)
            parts.push(qs.hero.titulo);
        if ((_b = qs.hero) === null || _b === void 0 ? void 0 : _b.subtitulo)
            parts.push(qs.hero.subtitulo);
        if ((_c = qs.somos) === null || _c === void 0 ? void 0 : _c.intro)
            parts.push(qs.somos.intro);
        if (Array.isArray((_d = qs.somos) === null || _d === void 0 ? void 0 : _d.marcas)) {
            qs.somos.marcas.forEach((m) => {
                if (m === null || m === void 0 ? void 0 : m.descripcion)
                    parts.push(`Marca${m.tag ? ` (${m.tag})` : ''}: ${m.descripcion}`);
            });
        }
        if ((_e = qs.misionVision) === null || _e === void 0 ? void 0 : _e.mision)
            parts.push(`Misión: ${qs.misionVision.mision}`);
        if ((_f = qs.misionVision) === null || _f === void 0 ? void 0 : _f.vision)
            parts.push(`Visión: ${qs.misionVision.vision}`);
        if (Array.isArray((_g = qs.pilares) === null || _g === void 0 ? void 0 : _g.items)) {
            const pil = qs.pilares.items
                .map((p) => ((p === null || p === void 0 ? void 0 : p.titulo) ? `${p.titulo}: ${p.descripcion || ''}`.trim() : ''))
                .filter(Boolean)
                .join(' | ');
            if (pil)
                parts.push(`Pilares — ${pil}`);
        }
        if (Array.isArray((_h = qs.hero) === null || _h === void 0 ? void 0 : _h.stats)) {
            const stats = qs.hero.stats
                .map((s) => ((s === null || s === void 0 ? void 0 : s.valor) ? `${s.valor} ${s.label || ''}`.trim() : ''))
                .filter(Boolean)
                .join(', ');
            if (stats)
                parts.push(`Cifras: ${stats}`);
        }
        return truncate(parts.join('\n'), 2800);
    }
    catch (_j) {
        return '';
    }
}
/** Arma el listado del BLOG (slug + título + extracto) para el prompt. */
function buildBlogContext(posts) {
    return (posts || [])
        .map((p) => `- slug:${p.slug} | "${p.title}" | ${truncate(p.excerpt, 180)}`)
        .join('\n');
}
async function fetchCatalog(port) {
    var _a, _b, _c;
    // El endpoint GraphQL de Evershop vive bajo el prefijo /api → /api/graphql.
    // (Sin el prefijo, /graphql resuelve a una página del frontStore "Not found"
    //  que devuelve HTML → res.json() falla → catálogo vacío → el asesor no
    //  puede recomendar productos reales.)
    const res = await fetch(`http://localhost:${port}/api/graphql`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: GQL_CATALOG,
    });
    const { data } = await res.json();
    const lines = [];
    for (const cat of (((_a = data === null || data === void 0 ? void 0 : data.categories) === null || _a === void 0 ? void 0 : _a.items) || [])) {
        for (const p of (((_b = cat.products) === null || _b === void 0 ? void 0 : _b.items) || [])) {
            if (!p.status)
                continue;
            const usos = stripHtml(attr(p.attributes, 'usos'));
            const caract = stripHtml(attr(p.attributes, 'caracteristicas'));
            const modo = stripHtml(attr(p.attributes, 'modo_empleo'));
            lines.push(`SKU:${p.sku} | ${p.name} | ${cat.urlKey}` +
                (usos ? ` | Usos: ${usos}` : '') +
                (caract ? ` | Características: ${caract}` : '') +
                (modo ? ` | Modo: ${modo}` : ''));
        }
    }
    return { catalog: lines.join('\n'), cats: ((_c = data === null || data === void 0 ? void 0 : data.categories) === null || _c === void 0 ? void 0 : _c.items) || [] };
}
export default async function advisor(request, response) {
    var _a, _b, _c;
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
        }
        catch (e) {
            catalog = '(catálogo no disponible)';
        }
        // Fetch contexto de empresa + blog + WhatsApp (settings). Nunca romper el
        // asesor si un setting falta: cada uno cae a su fallback.
        const [qsRaw, blogRaw, waNumber] = await Promise.all([
            getSetting('quienes_somos', '{}').catch(() => '{}'),
            getSetting('blog_index', '').catch(() => ''),
            getSetting('storeWhatsappNumber', '573002171521').catch(() => '573002171521'),
        ]);
        const about = buildAbout(qsRaw);
        const blogData = parseBlogIndex(blogRaw);
        const blogPosts = Array.isArray(blogData === null || blogData === void 0 ? void 0 : blogData.posts) ? blogData.posts : [];
        const blogContext = buildBlogContext(blogPosts);
        const waDigits = String(waNumber || '573002171521').replace(/[^\d]/g, '') || '573002171521';
        const waUrl = `https://api.whatsapp.com/send?phone=${waDigits}` +
            `&text=${encodeURIComponent('Hola, vengo del asesor virtual y quiero hablar con un asesor humano.')}`;
        const fullSystem = SYSTEM +
            '\n## SOBRE NOSOTROS (Grupo INCAP)\n' +
            (about || '(información no disponible)') +
            '\n\n## BLOG / ARTÍCULOS (enlaza con [[BLOG: slug]] usando el slug exacto)\n' +
            (blogContext || '(sin artículos)') +
            '\n\n## CATÁLOGO\n' +
            catalog;
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
                system: fullSystem,
                messages: messages.map(m => ({ role: m.role, content: m.content })),
            }),
        });
        const claudeData = await apiRes.json();
        if (!apiRes.ok) {
            console.error('Anthropic error:', JSON.stringify(claudeData));
            return response.status(500).json({ error: 'Error en el servicio de IA' });
        }
        const reply = ((_b = (_a = claudeData.content) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.text) || '';
        // Extract SKU markers [[SKU: XXXX]]
        const skuMatches = [...reply.matchAll(/\[\[SKU:\s*([^\]]+)\]\]/gi)];
        const skus = [...new Set(skuMatches.map(m => m[1].trim().toUpperCase()))];
        // Build product cards from catalog
        const products = [];
        for (const cat of cats) {
            for (const p of (((_c = cat.products) === null || _c === void 0 ? void 0 : _c.items) || [])) {
                if (skus.includes((p.sku || '').toUpperCase())) {
                    products.push({ sku: p.sku, name: p.name, url: p.url || `/${cat.urlKey}` });
                }
            }
        }
        // Extract blog markers [[BLOG: slug]] → tarjetas de artículo
        const blogMatches = [...reply.matchAll(/\[\[BLOG:\s*([^\]]+)\]\]/gi)];
        const blogSlugs = [...new Set(blogMatches.map(m => m[1].trim().toLowerCase()))];
        const articles = [];
        for (const slug of blogSlugs) {
            const post = blogPosts.find(p => (p.slug || '').toLowerCase() === slug);
            if (post)
                articles.push({ title: post.title, url: `/blog/${post.slug}` });
        }
        // Fallback humano: si el modelo pidió derivar, devolvemos el link de WhatsApp
        const wantsWhatsapp = /\[\[WHATSAPP\]\]/i.test(reply);
        // Limpiar marcadores PRESERVANDO los saltos de línea (párrafos/listas)
        // que el front necesita para dar formato. Solo colapsamos espacios/tabs.
        const cleanReply = reply
            .replace(/\[\[SKU:\s*[^\]]+\]\]/gi, '') // quitar marcadores [[SKU: ...]]
            .replace(/\[\[BLOG:\s*[^\]]+\]\]/gi, '') // quitar marcadores [[BLOG: ...]]
            .replace(/\[\[WHATSAPP\]\]/gi, '') // quitar marcador [[WHATSAPP]]
            .replace(/\*\*\s*\*\*/g, '') // limpiar **negrita vacía** que dejó el marcador
            .replace(/[ \t]{2,}/g, ' ') // colapsar espacios/tabs SIN tocar '\n'
            .replace(/ +\n/g, '\n') // sin espacios colgando antes del salto
            .replace(/\n{3,}/g, '\n\n') // máximo una línea en blanco entre bloques
            .trim();
        return response.json({
            reply: cleanReply,
            products,
            articles,
            whatsapp: wantsWhatsapp ? waUrl : null,
        });
    }
    catch (err) {
        console.error('TechnicalAdvisor error:', err.message);
        return response.status(500).json({ error: 'Error procesando la consulta' });
    }
}
//# sourceMappingURL=%5BbodyParser%5Dadvisor.js.map