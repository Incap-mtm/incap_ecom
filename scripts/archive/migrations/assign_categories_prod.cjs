'use strict';
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function run() {
  const client = await pool.connect();
  try {
    let r;
    r = await client.query(`UPDATE product SET category_id = (SELECT category_id FROM category_description WHERE url_key = 'calzado' LIMIT 1) WHERE sku SIMILAR TO 'AB-%|EM-%|MA-%|AC-%|AU-A1-%|AU-A7-%|AU-BP-%|AU-H3-%|AU-HB-%|AU-LV-%|AU-PG-%|AU-SZ-%|CO-FL-%|CO-IT-%|CO-MB-%|CO-MF-%|CO-MG-%|CO-MN-%|CO-MT-%|CO-SP-%|CO-CZ-%|CO-IF-%'`);
    console.log('calzado:', r.rowCount);
    r = await client.query(`UPDATE product SET category_id = (SELECT category_id FROM category_description WHERE url_key = 'colchones' LIMIT 1) WHERE sku LIKE 'IN-%' OR sku LIKE 'IS-%'`);
    console.log('colchones:', r.rowCount);
    r = await client.query(`UPDATE product SET category_id = (SELECT category_id FROM category_description WHERE url_key = 'maderas' LIMIT 1) WHERE sku LIKE 'LA-%' OR sku LIKE 'PV-%' OR sku LIKE 'CO-PC-%' OR sku LIKE 'CO-PI-%'`);
    console.log('maderas:', r.rowCount);
    r = await client.query(`UPDATE product SET category_id = (SELECT category_id FROM category_description WHERE url_key = 'multiusos' LIMIT 1) WHERE sku LIKE 'AU-PE-%' OR sku LIKE 'AU-RM-%' OR sku LIKE 'AU-VU-%' OR sku LIKE 'CO-PR-%' OR sku LIKE 'CO-SO-%' OR sku LIKE 'CO-AN-%' OR sku LIKE 'CO-CR-%' OR sku LIKE 'CO-SL-%'`);
    console.log('multiusos:', r.rowCount);
    const uncat = await client.query('SELECT COUNT(*) AS c FROM product WHERE category_id IS NULL');
    console.log('sin categoria:', uncat.rows[0].c);
  } finally {
    client.release();
    await pool.end();
  }
}
run().catch(e => { console.error(e.message); process.exit(1); });
