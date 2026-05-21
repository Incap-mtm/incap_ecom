'use strict';
const { execSync } = require('child_process');
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Mismo algoritmo que rename_media.cjs (usado en el volumen)
const ACCENTS = {'á':'a','é':'e','í':'i','ó':'o','ú':'u','Á':'A','É':'E','Í':'I','Ó':'O','Ú':'U','ü':'u','Ü':'U','ñ':'n','Ñ':'N',' ':'-'};
function clean(s) {
  return s.split('').map(c => ACCENTS[c] || c).join('');
}

async function run() {
  // Lista de archivos en HEAD (con nombres originales)
  const headFiles = execSync('git -C "D:\\Dev AI\\GitHub\\glue-ecommerce" ls-tree -r --name-only HEAD -- media/products/', { encoding: 'utf8' })
    .split('\n').filter(Boolean);
  console.log('Archivos en HEAD:', headFiles.length);

  // Aplicar renombrado a cada path
  const renamed = headFiles.map(p => p.split('/').map(clean).join('/'));
  const renamedSet = new Set(renamed.map(p => p.replace(/^media\/products\//, '')));

  // Comparar con DB
  const client = await pool.connect();
  try {
    const { rows } = await client.query(`SELECT origin_image FROM product_image WHERE origin_image LIKE '/assets/products/%'`);
    const dbPaths = rows.map(r => r.origin_image.replace(/^\/assets\/products\//, ''));
    const dbSet = new Set(dbPaths);

    const missingFromRepo = dbPaths.filter(p => !renamedSet.has(p));
    const extraInRepo = [...renamedSet].filter(p => !dbSet.has(p));

    console.log('\nEn DB pero NO en HEAD renombrado (' + missingFromRepo.length + '):');
    missingFromRepo.slice(0, 15).forEach(p => console.log('  ' + p));

    console.log('\nEn HEAD renombrado pero NO en DB (' + extraInRepo.length + '):');
    extraInRepo.slice(0, 15).forEach(p => console.log('  ' + p));

    // Sample mapping
    console.log('\nSample rename mapping:');
    headFiles.slice(0, 3).forEach((orig, i) => {
      console.log('  ' + orig);
      console.log('  → ' + renamed[i]);
    });
  } finally {
    client.release();
    await pool.end();
  }
}
run().catch(e => { console.error(e); process.exit(1); });
