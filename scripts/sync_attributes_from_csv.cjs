'use strict';
const fs = require('fs');
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

function parseCSV(text) {
  const rows = [];
  let row = [], field = '', inQuotes = false, i = 0;
  while (i < text.length) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i += 2; continue; }
      if (c === '"') { inQuotes = false; i++; continue; }
      field += c; i++; continue;
    }
    if (c === '"') { inQuotes = true; i++; continue; }
    if (c === ',') { row.push(field); field = ''; i++; continue; }
    if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(field); rows.push(row); row = []; field = ''; i++; continue;
    }
    field += c; i++;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  return rows;
}

const ATTRS_TO_SYNC = [
  { code: 'usos',                   name: 'Usos' },
  { code: 'caracteristicas',        name: 'Características' },
  { code: 'modo_empleo',            name: 'Modo de Empleo' },
  { code: 'codigo_industrial',      name: 'Código Industrial' },
  { code: 'ghs_pictogramas',        name: 'Pictogramas GHS' },
  { code: 'precauciones_h',         name: 'Precauciones H' },
  { code: 'consejos_prudencia_p',   name: 'Consejos P' },
  { code: 'aplicacion_faq',         name: 'Aplicación y FAQ' },
  { code: 'pre_tratamiento',        name: 'Pre-tratamiento' },
  { code: 'ficha_tecnica_url',      name: 'Ficha Técnica (URL)' },
];

async function run() {
  const csvPath = require('path').join(__dirname, '../data/Master - Listado prod completo - images_updated.csv');
  const text = fs.readFileSync(csvPath, 'utf8');
  const rows = parseCSV(text);
  const h = rows[0];
  const iSku = h.indexOf('sku');
  const iPub = h.indexOf('Publicar');
  const attrCols = Object.fromEntries(ATTRS_TO_SYNC.map(a => [a.code, h.indexOf(a.code)]));

  // Build CSV map
  const csvMap = new Map();
  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    if (!r[iSku]) continue;
    const pub = (r[iPub] || '').trim().toUpperCase();
    if (pub && pub !== 'SI' && pub !== 'YES') continue;
    const data = {};
    for (const a of ATTRS_TO_SYNC) {
      const idx = attrCols[a.code];
      if (idx === -1) continue;
      data[a.code] = (r[idx] || '').trim();
    }
    csvMap.set(r[iSku].trim(), data);
  }
  console.log('CSV productos:', csvMap.size);

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Crear atributos faltantes
    const { rows: existing } = await client.query(`SELECT attribute_id, attribute_code FROM attribute`);
    const attrIdByCode = Object.fromEntries(existing.map(a => [a.attribute_code, a.attribute_id]));

    for (const a of ATTRS_TO_SYNC) {
      if (!attrIdByCode[a.code]) {
        const ins = await client.query(
          `INSERT INTO attribute (attribute_code, attribute_name, type, is_required, display_on_frontend, sort_order, is_filterable)
           VALUES ($1::varchar, $2::varchar, 'text', false, true, 10, false)
           RETURNING attribute_id`,
          [a.code, a.name]
        );
        const newId = ins.rows[0].attribute_id;
        await client.query(
          `INSERT INTO attribute_group_link (attribute_id, group_id) VALUES ($1::int, 1)`,
          [newId]
        );
        attrIdByCode[a.code] = newId;
        console.log(`Atributo creado: ${a.code} (id ${newId})`);
      }
    }

    // 2. Obtener product_ids por SKU
    const { rows: prods } = await client.query(`SELECT product_id, sku FROM product`);
    const productIdBySku = Object.fromEntries(prods.map(p => [p.sku, p.product_id]));

    // 3. Sync values
    let inserted = 0, updated = 0, skipped = 0;
    for (const [sku, csvData] of csvMap) {
      const productId = productIdBySku[sku];
      if (!productId) continue;
      for (const [code, value] of Object.entries(csvData)) {
        if (!value) continue;
        const attrId = attrIdByCode[code];
        const existing = await client.query(
          `SELECT product_attribute_value_index_id FROM product_attribute_value_index WHERE product_id = $1::int AND attribute_id = $2::int`,
          [productId, attrId]
        );
        if (existing.rows.length === 0) {
          await client.query(
            `INSERT INTO product_attribute_value_index (product_id, attribute_id, option_text) VALUES ($1::int, $2::int, $3::text)`,
            [productId, attrId, value]
          );
          inserted++;
        } else {
          await client.query(
            `UPDATE product_attribute_value_index SET option_text = $1::text WHERE product_id = $2::int AND attribute_id = $3::int`,
            [value, productId, attrId]
          );
          updated++;
        }
      }
    }
    await client.query('COMMIT');
    console.log(`\nValores insertados: ${inserted}`);
    console.log(`Valores actualizados: ${updated}`);

    // Verify final state
    const { rows: verify } = await client.query(`
      SELECT a.attribute_code, COUNT(DISTINCT pavi.product_id) AS prods
      FROM product_attribute_value_index pavi
      JOIN attribute a ON pavi.attribute_id = a.attribute_id
      WHERE a.attribute_code = ANY($1::text[])
      GROUP BY a.attribute_code ORDER BY a.attribute_code
    `, [ATTRS_TO_SYNC.map(a => a.code)]);
    console.log('\nProductos con cada atributo (DB):');
    verify.forEach(v => console.log(`  ${v.attribute_code.padEnd(28)} ${v.prods}`));
  } catch (e) {
    await client.query('ROLLBACK');
    console.error('ROLLBACK:', e.message);
    throw e;
  } finally {
    client.release();
    await pool.end();
  }
}
run().catch(e => { console.error(e); process.exit(1); });
