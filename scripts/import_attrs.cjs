'use strict';
const fs   = require('fs');
const path = require('path');
const { Pool } = require('pg');

const CSV_PATH = path.join(__dirname, '../Master -  Listado prod completo - images_updated.csv');

const pool = process.env.DATABASE_URL
  ? new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } })
  : new Pool({ host: 'localhost', port: 5435, user: 'evershop', password: 'evershop_password', database: 'evershop' });

function parseCSV(content) {
  const records = [];
  let fields = [], cur = '', inQ = false, i = 0;
  while (i < content.length) {
    const c = content[i];
    if (inQ) {
      if (c === '"') { if (content[i+1] === '"') { cur += '"'; i += 2; continue; } inQ = false; i++; continue; }
      cur += c; i++; continue;
    }
    if (c === '"') { inQ = true; i++; continue; }
    if (c === ',') { fields.push(cur.trim()); cur = ''; i++; continue; }
    if (c === '\r' && content[i+1] === '\n') { fields.push(cur.trim()); records.push(fields); fields = []; cur = ''; i += 2; continue; }
    if (c === '\n') { fields.push(cur.trim()); records.push(fields); fields = []; cur = ''; i++; continue; }
    cur += c; i++;
  }
  if (cur.trim() || fields.length) { fields.push(cur.trim()); records.push(fields); }
  if (!records.length) return [];
  const headers = records[0].map(h => h.replace(/^"|"$/g, ''));
  return records.slice(1).filter(r => r.some(f => f)).map(vals => {
    const obj = {};
    headers.forEach((h, idx) => { obj[h] = (vals[idx] || '').replace(/^"|"$/g, ''); });
    return obj;
  });
}

const CUSTOM_ATTRS = [
  ['presentacion',       'Presentación',      0],
  ['usos',               'Usos',              10],
  ['caracteristicas',    'Características',   20],
  ['modo_empleo',        'Modo de Empleo',    30],
  ['codigo_industrial',  'Código Industrial', 40],
  ['ghs_pictogramas',    'Pictogramas GHS',   50],
  ['precauciones_h',     'Precauciones H',    60],
  ['consejos_prudencia_p','Consejos P',       70],
];

async function getOrCreateAttr(client, code, name, sort) {
  const ex = await client.query('SELECT attribute_id FROM attribute WHERE attribute_code = $1', [code]);
  if (ex.rows.length) return ex.rows[0].attribute_id;
  const r = await client.query(
    `INSERT INTO attribute (attribute_code, attribute_name, type, display_on_frontend, is_required, is_filterable, sort_order)
     VALUES ($1, $2, 'text', true, false, false, $3) RETURNING attribute_id`,
    [code, name, sort]
  );
  return r.rows[0].attribute_id;
}

async function main() {
  const rows = parseCSV(fs.readFileSync(CSV_PATH, 'utf-8'))
    .filter(r => r.Publicar === 'SI' && r.sku);

  console.log(`Filas a procesar: ${rows.length}`);

  const client = await pool.connect();
  let ok = 0, skip = 0;
  try {
    await client.query('BEGIN');

    // Ensure attributes exist
    const attrIds = {};
    for (const [code, name, sort] of CUSTOM_ATTRS) {
      attrIds[code] = await getOrCreateAttr(client, code, name, sort);
    }

    for (const row of rows) {
      const res = await client.query('SELECT product_id FROM product WHERE sku = $1', [row.sku.trim()]);
      if (!res.rows.length) { skip++; continue; }
      const pid = res.rows[0].product_id;

      // Update product description (name + full description HTML)
      const nombre       = row.nombre_producto.trim();
      const presentacion = row.presentacion.trim();
      const productName  = presentacion ? `${nombre} - ${presentacion}` : nombre;

      const descHTML = [
        row.Descripciones    ? `<p>${row.Descripciones}</p>`                         : '',
        row.usos             ? `<h4>Usos</h4><p>${row.usos}</p>`                     : '',
        row.caracteristicas  ? `<h4>Características</h4><p>${row.caracteristicas}</p>` : '',
        row.modo_empleo      ? `<h4>Modo de Empleo</h4><p>${row.modo_empleo}</p>`    : '',
        row.aplicacion_faq   ? `<h4>Aplicación</h4><p>${row.aplicacion_faq}</p>`     : '',
        row.pre_tratamiento  ? `<h4>Pre-tratamiento</h4><p>${row.pre_tratamiento}</p>` : '',
      ].filter(Boolean).join('\n');

      await client.query(
        `UPDATE product_description SET name = $1, description = $2, meta_title = $3
         WHERE product_description_product_id = $4`,
        [productName, descHTML || null, productName, pid]
      );

      // Upsert attribute values
      const vals = {
        presentacion:         presentacion,
        usos:                 row.usos,
        caracteristicas:      row.caracteristicas,
        modo_empleo:          row.modo_empleo,
        codigo_industrial:    row.codigo_industrial,
        ghs_pictogramas:      row.ghs_pictogramas,
        precauciones_h:       row.precauciones_h,
        consejos_prudencia_p: row.consejos_prudencia_p,
      };

      for (const [code, val] of Object.entries(vals)) {
        if (!val) continue;
        await client.query(
          'DELETE FROM product_attribute_value_index WHERE product_id = $1 AND attribute_id = $2',
          [pid, attrIds[code]]
        );
        await client.query(
          'INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text) VALUES ($1, $2, NULL, $3)',
          [pid, attrIds[code], val]
        );
      }
      ok++;
    }

    await client.query('COMMIT');
    console.log(`✓ Actualizados: ${ok} | Saltados: ${skip}`);
  } catch (e) {
    await client.query('ROLLBACK');
    console.error('ERROR:', e.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

main();
