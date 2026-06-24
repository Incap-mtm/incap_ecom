'use strict';
const fs   = require('fs');
const path = require('path');
const { Pool } = require('pg');

const CSV_PATH = path.join(__dirname, '../data/Master - Listado prod completo - images_updated.csv');

const pool = process.env.DATABASE_URL
  ? new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } })
  : new Pool({ host: 'localhost', port: 5435, user: 'evershop', password: 'evershop_password', database: 'evershop' });

function parseCSV(content) {
  // Proper parser: scans char-by-char to handle quoted fields with embedded newlines
  const records = [];
  let fields = [];
  let cur = '';
  let inQ = false;
  let i = 0;
  while (i < content.length) {
    const c = content[i];
    if (inQ) {
      if (c === '"') {
        if (content[i + 1] === '"') { cur += '"'; i += 2; continue; }
        inQ = false; i++; continue;
      }
      cur += c; i++; continue;
    }
    if (c === '"') { inQ = true; i++; continue; }
    if (c === ',') { fields.push(cur.trim()); cur = ''; i++; continue; }
    if (c === '\r' && content[i + 1] === '\n') { fields.push(cur.trim()); records.push(fields); fields = []; cur = ''; i += 2; continue; }
    if (c === '\n') { fields.push(cur.trim()); records.push(fields); fields = []; cur = ''; i++; continue; }
    cur += c; i++;
  }
  if (cur.trim() || fields.length) { fields.push(cur.trim()); records.push(fields); }

  if (!records.length) return [];
  const headers = records[0].map(h => h.replace(/^"|"$/g, ''));
  return records.slice(1)
    .filter(r => r.some(f => f))
    .map(vals => {
      const obj = {};
      headers.forEach((h, i) => { obj[h] = (vals[i] || '').replace(/^"|"$/g, ''); });
      return obj;
    });
}

async function main() {
  const rows = parseCSV(fs.readFileSync(CSV_PATH, 'utf-8'))
    .filter(r => r.Publicar === 'SI' && r.sku && r.imagen_principal);

  console.log(`Filas con imagen: ${rows.length}`);
  const client = await pool.connect();
  let ok = 0, skip = 0;

  try {
    await client.query('BEGIN');
    for (const row of rows) {
      const res = await client.query('SELECT product_id FROM product WHERE sku = $1', [row.sku.trim()]);
      if (!res.rows.length) { skip++; continue; }
      const pid = res.rows[0].product_id;

      await client.query('DELETE FROM product_image WHERE product_image_product_id = $1', [pid]);

      await client.query(
        'INSERT INTO product_image (product_image_product_id, origin_image, is_main) VALUES ($1, $2, true)',
        [pid, `/assets/${row.imagen_principal}`]
      );

      if (row.galeria_imagenes) {
        for (const img of row.galeria_imagenes.split('|').filter(Boolean)) {
          await client.query(
            'INSERT INTO product_image (product_image_product_id, origin_image, is_main) VALUES ($1, $2, false)',
            [pid, `/assets/${img.trim()}`]
          );
        }
      }
      ok++;
    }
    await client.query('COMMIT');
    console.log(`✓ Imágenes importadas: ${ok} productos | saltados (sin SKU en DB): ${skip}`);
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
