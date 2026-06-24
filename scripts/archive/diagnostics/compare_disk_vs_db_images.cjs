'use strict';
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const ROOT = 'D:\\Dev AI\\GitHub\\glue-ecommerce\\media\\products';

function walkDir(dir, base = '') {
  const out = [];
  for (const f of fs.readdirSync(dir)) {
    const fp = path.join(dir, f);
    const rel = base ? `${base}/${f}` : f;
    if (fs.statSync(fp).isDirectory()) {
      out.push(...walkDir(fp, rel));
    } else {
      out.push(rel.replace(/\\/g, '/'));
    }
  }
  return out;
}

async function run() {
  const diskFiles = new Set(walkDir(ROOT));
  console.log('Archivos en disco:', diskFiles.size);

  const client = await pool.connect();
  try {
    const { rows } = await client.query(`SELECT origin_image FROM product_image WHERE origin_image LIKE '/assets/products/%'`);
    const dbPaths = rows.map(r => r.origin_image.replace(/^\/assets\/products\//, ''));
    console.log('Paths en DB:', dbPaths.length);

    // En DB pero no en disco (faltarían en repo)
    const missingFromDisk = dbPaths.filter(p => !diskFiles.has(p));
    // En disco pero no en DB (huérfanos, opcionalmente removibles)
    const dbPathSet = new Set(dbPaths);
    const orphansOnDisk = [...diskFiles].filter(p => !dbPathSet.has(p));

    console.log('\nEn DB pero NO en disco (' + missingFromDisk.length + '):');
    missingFromDisk.slice(0, 10).forEach(p => console.log('  ' + p));

    console.log('\nEn disco pero NO en DB (' + orphansOnDisk.length + '):');
    orphansOnDisk.slice(0, 10).forEach(p => console.log('  ' + p));
  } finally {
    client.release();
    await pool.end();
  }
}
run().catch(e => { console.error(e); process.exit(1); });
