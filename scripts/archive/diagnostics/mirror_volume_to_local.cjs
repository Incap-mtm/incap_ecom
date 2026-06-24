'use strict';
const fs = require('fs');
const path = require('path');
const https = require('https');
const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const BASE_URL = 'https://www.grupoincap.com.co';
const OUT_ROOT = 'D:\\Dev AI\\GitHub\\glue-ecommerce\\media-clean';

function download(url, destPath) {
  return new Promise((resolve, reject) => {
    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    const file = fs.createWriteStream(destPath);
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        file.close();
        fs.unlinkSync(destPath);
        return reject(new Error('HTTP ' + res.statusCode + ' for ' + url));
      }
      res.pipe(file);
      file.on('finish', () => file.close(() => resolve()));
    }).on('error', (e) => {
      file.close();
      try { fs.unlinkSync(destPath); } catch {}
      reject(e);
    });
  });
}

async function run() {
  const client = await pool.connect();
  let paths;
  try {
    const { rows } = await client.query(`SELECT DISTINCT origin_image FROM product_image WHERE origin_image LIKE '/assets/products/%' ORDER BY origin_image`);
    paths = rows.map(r => r.origin_image);
  } finally {
    client.release();
    await pool.end();
  }
  console.log('Total imágenes a mirrorear:', paths.length);

  // Limpiar output dir
  if (fs.existsSync(OUT_ROOT)) {
    fs.rmSync(OUT_ROOT, { recursive: true });
  }

  let ok = 0, fail = 0;
  const errors = [];
  const concurrency = 8;
  let idx = 0;

  async function worker() {
    while (idx < paths.length) {
      const my = idx++;
      const p = paths[my];
      // p es algo como '/assets/products/Super-PVA/...jpg'
      // destPath: media-clean/products/Super-PVA/...jpg
      const relPath = p.replace(/^\/assets\//, '');
      const destPath = path.join(OUT_ROOT, relPath.replace(/\//g, path.sep));
      try {
        await download(BASE_URL + p, destPath);
        ok++;
        if (ok % 50 === 0) console.log('  ' + ok + '/' + paths.length);
      } catch (e) {
        fail++;
        errors.push({ url: p, error: e.message });
      }
    }
  }

  await Promise.all(Array.from({ length: concurrency }, worker));
  console.log('\nOK:', ok, 'FAIL:', fail);
  if (errors.length) {
    console.log('Errores:');
    errors.slice(0, 20).forEach(e => console.log('  ' + e.error + '  →  ' + e.url));
  }
}
run().catch(e => { console.error(e); process.exit(1); });
