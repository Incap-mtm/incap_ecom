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

function csvToUrlKey(cat) {
  if (!cat) return null;
  const c = cat.trim().toLowerCase();
  if (c.includes('madera') || c.includes('mueble'))     return 'madera';
  if (c.includes('calzado') || c.includes('marroquin')) return 'calzado';
  if (c.includes('colchon') || c.includes('espuma') || c.includes('tapicer')) return 'colchones';
  if (c.includes('hogar') || c.includes('multi') || c.includes('manual') || c.includes('auxiliar')) return 'multiusos';
  return null;
}

async function run() {
  const csvPath = require('path').join(__dirname, '../data/Master - Listado prod completo - images_updated.csv');
  const text = fs.readFileSync(csvPath, 'utf8');
  const rows = parseCSV(text);
  const h = rows[0];
  const iSku = h.indexOf('sku');
  const iName = h.indexOf('nombre_producto');
  const iCat = h.indexOf('categoria');
  const iPub = h.indexOf('Publicar');

  const csvByCategory = { madera: [], calzado: [], colchones: [], multiusos: [], unmatched: [] };
  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    if (!r[iSku]) continue;
    const pub = (r[iPub] || '').trim().toUpperCase();
    if (pub && pub !== 'SI' && pub !== 'YES') continue;
    const sku = r[iSku].trim();
    const name = r[iName];
    const cat = r[iCat] || '';
    const key = csvToUrlKey(cat);
    if (key) csvByCategory[key].push(sku);
    else csvByCategory.unmatched.push({ sku, name, categoria: cat });
  }

  console.log('CSV resumen:');
  console.log(`  madera: ${csvByCategory.madera.length}`);
  console.log(`  calzado: ${csvByCategory.calzado.length}`);
  console.log(`  colchones: ${csvByCategory.colchones.length}`);
  console.log(`  multiusos: ${csvByCategory.multiusos.length}`);
  console.log(`  unmatched: ${csvByCategory.unmatched.length}`);

  console.log('\n=== Productos en CSV sin categoría reconocida ===');
  csvByCategory.unmatched.forEach(p => console.log(`  ${p.sku.padEnd(15)} "${p.name}" categoria="${p.categoria}"`));

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Get cat IDs by url_key
    const { rows: cats } = await client.query(
      `SELECT cd.url_key, c.category_id FROM category c
       JOIN category_description cd ON c.category_id = cd.category_description_category_id`
    );
    const idByKey = Object.fromEntries(cats.map(c => [c.url_key, c.category_id]));
    console.log('\nIDs por url_key:', idByKey);

    // Apply category assignments per CSV
    let total = 0;
    for (const key of ['madera', 'calzado', 'colchones', 'multiusos']) {
      const skus = csvByCategory[key];
      if (!skus.length) continue;
      const r = await client.query(
        `UPDATE product SET category_id = $1::int WHERE sku = ANY($2::text[])`,
        [idByKey[key], skus]
      );
      console.log(`  ${key} (id ${idByKey[key]}): ${r.rowCount} actualizados`);
      total += r.rowCount;
    }
    console.log(`Total actualizados: ${total}`);

    await client.query('COMMIT');

    // Final state
    const { rows: final } = await client.query(`
      SELECT cd.url_key, cd.name, c.category_id,
        (SELECT COUNT(*) FROM product WHERE category_id = c.category_id) AS cnt
      FROM category c
      JOIN category_description cd ON c.category_id = cd.category_description_category_id
      ORDER BY c.category_id
    `);
    console.log('\n=== Estado final DB ===');
    final.forEach(c => console.log(`  [${c.category_id}] ${c.url_key.padEnd(12)} | "${c.name}" | ${c.cnt}`));

    const { rows: orphans } = await client.query(`SELECT sku, name FROM product p JOIN product_description pd ON p.product_id = pd.product_description_product_id WHERE category_id IS NULL`);
    console.log(`\nSin categoría (${orphans.length}):`);
    orphans.forEach(o => console.log(`  ${o.sku.padEnd(15)} "${o.name}"`));
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
