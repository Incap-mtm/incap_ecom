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

async function run() {
  const csvPath = 'D:\\Dev AI\\GitHub\\glue-ecommerce\\Master -  Listado prod completo - images_updated.csv';
  const text = fs.readFileSync(csvPath, 'utf8');
  const rows = parseCSV(text);
  const h = rows[0];
  const cols = ['Publicar','sku','nombre_producto','Descripciones','precio_cop','peso_kg','codigo_industrial','url_slug','imagen_principal','galeria_imagenes','usos','caracteristicas','aplicacion_faq','pre_tratamiento','ficha_tecnica_url','ghs_pictogramas','precauciones_h','consejos_prudencia_p','modo_empleo'];
  const idx = Object.fromEntries(cols.map(c => [c, h.indexOf(c)]));

  // Cargar productos del CSV
  const csvProducts = new Map();
  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    if (!r[idx.sku]) continue;
    const pub = (r[idx.Publicar] || '').trim().toUpperCase();
    if (pub && pub !== 'SI' && pub !== 'YES') continue;
    const obj = {};
    cols.forEach(c => obj[c] = r[idx[c]] || '');
    csvProducts.set(r[idx.sku].trim(), obj);
  }
  console.log('CSV productos publicar=SI:', csvProducts.size);

  // Cargar de DB
  const client = await pool.connect();
  try {
    const { rows: dbProducts } = await client.query(`
      SELECT p.product_id, p.sku, p.weight, pd.name, pd.description, pd.url_key,
        (SELECT json_agg(json_build_object('url', origin_image, 'is_main', is_main))
         FROM product_image WHERE product_image_product_id = p.product_id) AS images,
        (SELECT json_object_agg(a.attribute_code, COALESCE(pavi.option_text, ao.option_text))
         FROM product_attribute_value_index pavi
         JOIN attribute a ON pavi.attribute_id = a.attribute_id
         LEFT JOIN attribute_option ao ON pavi.option_id = ao.attribute_option_id
         WHERE pavi.product_id = p.product_id) AS attrs
      FROM product p
      JOIN product_description pd ON p.product_id = pd.product_description_product_id
    `);

    const dbMap = new Map(dbProducts.map(p => [p.sku, p]));

    // Atributos a verificar
    const attrsToCheck = ['usos','caracteristicas','aplicacion_faq','pre_tratamiento','ficha_tecnica_url','ghs_pictogramas','precauciones_h','consejos_prudencia_p','modo_empleo','codigo_industrial'];

    // Stats
    let imgMismatch = 0;
    let descMissing = 0;
    const attrMissing = Object.fromEntries(attrsToCheck.map(a => [a, 0]));
    const samples = { imgMismatch: [], descMissing: [], attrSample: {} };

    for (const [sku, csvProd] of csvProducts) {
      const dbProd = dbMap.get(sku);
      if (!dbProd) continue;

      // 1. Imágenes
      const csvImgs = [csvProd.imagen_principal, csvProd.galeria_imagenes].join('|').split(/[|,;]/).map(s => s.trim()).filter(Boolean);
      const dbImgs = (dbProd.images || []).map(i => i.url);
      const csvCount = csvImgs.length;
      const dbCount = dbImgs.length;
      if (csvCount !== dbCount) {
        imgMismatch++;
        if (samples.imgMismatch.length < 5) samples.imgMismatch.push({ sku, name: dbProd.name, csv: csvCount, db: dbCount, csvImgs: csvImgs.slice(0, 2), dbImgs: dbImgs.slice(0, 2) });
      }

      // 2. Descripción
      if (csvProd.Descripciones && csvProd.Descripciones.trim() && (!dbProd.description || dbProd.description.length < 50)) {
        descMissing++;
        if (samples.descMissing.length < 5) samples.descMissing.push({ sku, name: dbProd.name });
      }

      // 3. Atributos
      const dbAttrs = dbProd.attrs || {};
      for (const attr of attrsToCheck) {
        const csvVal = (csvProd[attr] || '').trim();
        const dbVal = (dbAttrs[attr] || '').toString().trim();
        if (csvVal && !dbVal) {
          attrMissing[attr]++;
          if (!samples.attrSample[attr] && attrMissing[attr] <= 3) {
            samples.attrSample[attr] = samples.attrSample[attr] || [];
            samples.attrSample[attr].push({ sku, name: dbProd.name, csv: csvVal.substring(0, 80) });
          }
        }
      }
    }

    console.log('\n=== 1. AUDITORÍA DE IMÁGENES ===');
    console.log(`Productos con # de imágenes distinto entre CSV y DB: ${imgMismatch}/${csvProducts.size}`);
    samples.imgMismatch.forEach(s => {
      console.log(`  ${s.sku} "${s.name}" — CSV: ${s.csv} imgs, DB: ${s.db} imgs`);
      console.log(`    CSV: ${s.csvImgs.join(' | ').substring(0, 100)}`);
      console.log(`    DB:  ${s.dbImgs.join(' | ').substring(0, 100)}`);
    });

    console.log('\n=== 2. DESCRIPCIONES FALTANTES ===');
    console.log(`Productos con descripción vacía/cortada (CSV tiene, DB no): ${descMissing}`);
    samples.descMissing.forEach(s => console.log(`  ${s.sku} "${s.name}"`));

    console.log('\n=== 3. ATRIBUTOS FALTANTES (CSV tiene, DB no) ===');
    for (const [attr, count] of Object.entries(attrMissing)) {
      console.log(`  ${attr.padEnd(28)} faltan en ${count} productos`);
      if (samples.attrSample[attr]) {
        samples.attrSample[attr].slice(0, 2).forEach(s => console.log(`    ej. ${s.sku} ← CSV: "${s.csv}..."`));
      }
    }

    // Stats globales DB
    const fichaCount = dbProducts.filter(p => p.attrs?.ficha_tecnica_url).length;
    console.log(`\nProductos con ficha_tecnica_url en DB: ${fichaCount} / ${dbProducts.length}`);
  } finally {
    client.release();
    await pool.end();
  }
}
run().catch(e => { console.error(e); process.exit(1); });
