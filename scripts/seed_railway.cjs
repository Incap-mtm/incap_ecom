'use strict';
/**
 * seed_railway.cjs
 * Runs at startup inside Railway (internal network access).
 * Skips if DB already has >= 300 products.
 */
const { execSync } = require('child_process');
const { Pool } = require('pg');

const pool = new Pool({
  host:     process.env.DB_HOST,
  port:     parseInt(process.env.DB_PORT || '5432'),
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl:      process.env.DB_SSLMODE === 'no-verify' ? { rejectUnauthorized: false } : false,
});

async function main() {
  let client;
  try {
    client = await pool.connect();
    const res = await client.query('SELECT COUNT(*) AS c FROM product');
    const count = parseInt(res.rows[0].c);
    console.log(`[seed] Productos en BD: ${count}`);
    if (count >= 300) {
      console.log('[seed] BD ya poblada — omitiendo import.');
      return;
    }
    console.log('[seed] Iniciando import completo...');
    const opts = { stdio: 'inherit', cwd: process.env.RAILWAY_ROOT || process.cwd() };
    execSync('node scripts/import_products.cjs', opts);
    execSync('node scripts/import_attrs.cjs',    opts);
    execSync('node scripts/import_images.cjs',   opts);

    // Assign categories by SKU prefix (same logic as manual SQL)
    await client.query(`
      UPDATE product SET category_id = (SELECT category_id FROM category_description WHERE url_key = 'calzado' LIMIT 1)
      WHERE sku SIMILAR TO 'AB-%|EM-%|MA-%|AC-%|AU-A1-%|AU-A7-%|AU-BP-%|AU-H3-%|AU-HB-%|AU-LV-%|AU-PG-%|AU-SZ-%|CO-FL-%|CO-IT-%|CO-MB-%|CO-MF-%|CO-MG-%|CO-MN-%|CO-MT-%|CO-SP-%|CO-CZ-%|CO-IF-%'
    `);
    await client.query(`
      UPDATE product SET category_id = (SELECT category_id FROM category_description WHERE url_key = 'colchones' LIMIT 1)
      WHERE sku LIKE 'IN-%' OR sku LIKE 'IS-%'
    `);
    await client.query(`
      UPDATE product SET category_id = (SELECT category_id FROM category_description WHERE url_key = 'maderas' LIMIT 1)
      WHERE sku LIKE 'LA-%' OR sku LIKE 'PV-%' OR sku LIKE 'CO-PC-%' OR sku LIKE 'CO-PI-%'
    `);
    await client.query(`
      UPDATE product SET category_id = (SELECT category_id FROM category_description WHERE url_key = 'multiusos' LIMIT 1)
      WHERE sku LIKE 'AU-PE-%' OR sku LIKE 'AU-RM-%' OR sku LIKE 'AU-VU-%' OR sku LIKE 'CO-PR-%' OR sku LIKE 'CO-SO-%' OR sku LIKE 'CO-AN-%' OR sku LIKE 'CO-CR-%' OR sku LIKE 'CO-SL-%'
    `);
    console.log('[seed] Import y categorización completados.');
  } catch (err) {
    console.error('[seed] ERROR:', err.message);
    // Don't crash the app — seed failure should not block startup
  } finally {
    if (client) client.release();
    await pool.end();
  }
}

main();
