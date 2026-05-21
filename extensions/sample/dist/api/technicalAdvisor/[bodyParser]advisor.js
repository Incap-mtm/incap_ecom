import pkg from 'pg';
const { Pool } = pkg;
let pool;
function getPool() {
    if (!pool) {
        pool = new Pool({
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT || '5432'),
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            ssl: process.env.DB_SSLMODE && process.env.DB_SSLMODE !== 'disable'
                ? { rejectUnauthorized: false }
                : false,
            max: 2,
            idleTimeoutMillis: 30000,
        });
    }
    return pool;
}
function stripHtml(html) {
    return (html || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}
const SYSTEM_PROMPT = `Eres el asesor técnico de INCAP, empresa colombiana líder en adhesivos industriales con más de 30 años de experiencia.

Tu misión: recomendar el producto INCAP exacto según el problema técnico del usuario.

INSTRUCCIONES:
- Responde siempre en español, tono técnico pero cercano.
- Si necesitas más información para recomendar bien (materiales, temperatura, proceso), haz máximo 2 preguntas concretas.
- Cuando tengas suficiente información, recomienda 1 a 3 productos del catálogo.
- Para mencionar un producto, usa el formato exacto: [[SKU: CODIGO]] — el sistema lo convierte en tarjeta de producto automáticamente.
- Explica brevemente POR QUÉ ese producto resuelve el problema específico.
- Si el usuario tiene fallas de pegue existentes, pregunta: sustrato, preparación de superficie, temperatura y humedad del ambiente.
- Nunca inventes productos que no estén en el catálogo.
- Sé conciso: máximo 3 párrafos por respuesta.

CATÁLOGO INCAP:
`;
export default async function advisor(request, response) {
    var _a, _b;
    try {
        const { messages } = request.body || {};
        if (!Array.isArray(messages) || messages.length === 0) {
            return response.status(400).json({ error: 'messages requerido' });
        }
        if (!process.env.ANTHROPIC_API_KEY) {
            return response.status(500).json({ error: 'Servicio no configurado' });
        }
        // Fetch product catalog from DB
        const db = getPool();
        const result = await db.query(`
      SELECT
        p.sku,
        pd.name,
        pd.url_key,
        cd.url_key AS cat_url,
        MAX(CASE WHEN a.attribute_code = 'usos'           THEN avi.option_text END) AS usos,
        MAX(CASE WHEN a.attribute_code = 'caracteristicas' THEN avi.option_text END) AS caracteristicas,
        MAX(CASE WHEN a.attribute_code = 'modo_empleo'    THEN avi.option_text END) AS modo_empleo
      FROM product p
      JOIN product_description pd ON pd.product_description_product_id = p.product_id
      LEFT JOIN product_category pc ON pc.product_id = p.product_id
      LEFT JOIN category cat ON cat.category_id = pc.category_id
      LEFT JOIN category_description cd ON cd.category_description_category_id = cat.category_id
      LEFT JOIN product_attribute_value_index avi ON avi.product_id = p.product_id
      LEFT JOIN attribute a ON a.attribute_id = avi.attribute_id
      WHERE p.status = true
      GROUP BY p.sku, pd.name, pd.url_key, cd.url_key
      ORDER BY cd.url_key, pd.name
      LIMIT 150
    `);
        const catalog = result.rows.map(p => {
            const lines = [`SKU: ${p.sku} | ${p.name} | Industria: ${p.cat_url || 'general'}`];
            if (p.usos)
                lines.push(`Usos: ${stripHtml(p.usos).substring(0, 200)}`);
            if (p.caracteristicas)
                lines.push(`Características: ${stripHtml(p.caracteristicas).substring(0, 200)}`);
            if (p.modo_empleo)
                lines.push(`Aplicación: ${stripHtml(p.modo_empleo).substring(0, 150)}`);
            return lines.join('\n');
        }).join('\n---\n');
        // Call Claude API
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
                system: SYSTEM_PROMPT + catalog,
                messages: messages.map(m => ({ role: m.role, content: m.content })),
            }),
        });
        const data = await apiRes.json();
        if (!apiRes.ok) {
            console.error('Anthropic error:', data);
            return response.status(500).json({ error: 'Error en el servicio de IA' });
        }
        const reply = ((_b = (_a = data.content) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.text) || '';
        // Extract SKUs mentioned in the reply [[SKU: XXXX]]
        const skuMatches = [...reply.matchAll(/\[\[SKU:\s*([^\]]+)\]\]/gi)];
        const skus = [...new Set(skuMatches.map(m => m[1].trim().toUpperCase()))];
        let products = [];
        if (skus.length > 0) {
            const prodRes = await db.query(`SELECT p.sku, pd.name, pd.url_key, cd.url_key AS cat_url
         FROM product p
         JOIN product_description pd ON pd.product_description_product_id = p.product_id
         LEFT JOIN product_category pc ON pc.product_id = p.product_id
         LEFT JOIN category cat ON cat.category_id = pc.category_id
         LEFT JOIN category_description cd ON cd.category_description_category_id = cat.category_id
         WHERE UPPER(p.sku) = ANY($1)
         GROUP BY p.sku, pd.name, pd.url_key, cd.url_key`, [skus]);
            products = prodRes.rows.map(p => ({
                sku: p.sku,
                name: p.name,
                url: p.cat_url && p.url_key ? `/${p.cat_url}/${p.url_key}` : `/${p.url_key || ''}`,
            }));
        }
        // Clean markers from reply text
        const cleanReply = reply.replace(/\[\[SKU:\s*[^\]]+\]\]/gi, '').replace(/\s{2,}/g, ' ').trim();
        return response.json({ reply: cleanReply, products });
    }
    catch (err) {
        console.error('TechnicalAdvisor error:', err);
        return response.status(500).json({ error: 'Error procesando la consulta' });
    }
}
//# sourceMappingURL=%5BbodyParser%5Dadvisor.js.map