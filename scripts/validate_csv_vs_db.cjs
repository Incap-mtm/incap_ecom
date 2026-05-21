'use strict';
const fs = require('fs');
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Simple CSV parser that handles quoted fields with newlines/commas
function parseCSV(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;
  let i = 0;
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

// Map CSV categoria value to expected url_key
function csvCategoryToUrlKey(cat) {
  if (!cat) return null;
  const c = cat.trim().toLowerCase();
  if (c.includes('madera') || c.includes('mueble'))     return 'madera';
  if (c.includes('calzado') || c.includes('marroquin')) return 'calzado';
  if (c.includes('colchon') || c.includes('espuma') || c.includes('tapicer')) return 'colchones';
  if (c.includes('hogar') || c.includes('multi') || c.includes('manual') || c.includes('auxiliar')) return 'multiusos';
  return null;
}

async function run() {
  const csvPath = 'D:\\Dev AI\\GitHub\\glue-ecommerce\\Master -  Listado prod completo - images_updated.csv';
  const text = fs.readFileSync(csvPath, 'utf8');
  const rows = parseCSV(text);
  const headers = rows[0];
  const idx = {
    sku:        headers.indexOf('sku'),
    name:       headers.indexOf('nombre_producto'),
    categoria:  headers.indexOf('categoria'),
    publicar:   headers.indexOf('Publicar'),
  };

  // Build CSV map: sku → { name, categoria }
  const csvMap = new Map();
  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    if (!r[idx.sku]) continue;
    const publicar = r[idx.publicar]?.trim()?.toUpperCase();
    if (publicar && publicar !== 'SI' && publicar !== 'YES') continue;
    csvMap.set(r[idx.sku].trim(), {
      name: r[idx.name],
      categoria: r[idx.categoria],
      urlKey: csvCategoryToUrlKey(r[idx.categoria]),
    });
  }
  console.log('CSV: ' + csvMap.size + ' productos marcados publicar=SI');

  const client = await pool.connect();
  try {
    const { rows: dbRows } = await client.query(`
      SELECT p.sku, pd.name, cd.url_key, cd.name AS cat_name
      FROM product p
      JOIN product_description pd ON p.product_id = pd.product_description_product_id
      LEFT JOIN category c ON p.category_id = c.category_id
      LEFT JOIN category_description cd ON c.category_id = cd.category_description_category_id
    `);
    console.log('DB: ' + dbRows.length + ' productos');

    // Compare categorization
    const mismatches = [];
    const notInCsv = [];
    const notInDb = new Set(csvMap.keys());
    for (const r of dbRows) {
      const csv = csvMap.get(r.sku);
      if (!csv) { notInCsv.push(r.sku); continue; }
      notInDb.delete(r.sku);
      if (csv.urlKey && csv.urlKey !== r.url_key) {
        mismatches.push({ sku: r.sku, name: r.name, csv: csv.categoria, csvKey: csv.urlKey, dbKey: r.url_key });
      }
    }

    console.log('\n=== Mismatches de categoría (CSV vs DB) ===');
    if (mismatches.length === 0) console.log('  ninguno ✓');
    else mismatches.forEach(m => console.log(`  ${m.sku} "${m.name}" → CSV:"${m.csv}"(${m.csvKey}) DB:${m.dbKey}`));

    console.log('\n=== En DB pero NO en CSV (publicar=SI) ===');
    if (notInCsv.length === 0) console.log('  ninguno ✓');
    else notInCsv.slice(0, 30).forEach(s => console.log('  ' + s));

    console.log('\n=== En CSV pero NO en DB ===');
    if (notInDb.size === 0) console.log('  ninguno ✓');
    else [...notInDb].slice(0, 30).forEach(s => console.log('  ' + s));

    // Show counts per CSV category
    console.log('\n=== Conteos por categoría CSV ===');
    const byCat = {};
    for (const v of csvMap.values()) {
      const k = v.urlKey || 'SIN_MATCH(' + v.categoria + ')';
      byCat[k] = (byCat[k] || 0) + 1;
    }
    Object.entries(byCat).forEach(([k, c]) => console.log('  ' + k + ': ' + c));

    // DB counts
    const { rows: dbCounts } = await client.query(`
      SELECT cd.url_key, COUNT(*) AS c FROM product p
      LEFT JOIN category c ON p.category_id = c.category_id
      LEFT JOIN category_description cd ON c.category_id = cd.category_description_category_id
      GROUP BY cd.url_key ORDER BY c DESC
    `);
    console.log('\n=== Conteos por categoría DB ===');
    dbCounts.forEach(r => console.log('  ' + (r.url_key || 'NULL') + ': ' + r.c));
  } finally {
    client.release();
    await pool.end();
  }
}
run().catch(e => { console.error(e); process.exit(1); });
