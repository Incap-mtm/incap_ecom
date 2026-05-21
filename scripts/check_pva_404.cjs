'use strict';
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
async function run() {
  const client = await pool.connect();
  try {
    // Check Super PVA url_rewrite
    const { rows: pva } = await client.query(`
      SELECT ur.request_path, ur.target_path, ur.entity_uuid, p.product_id, p.uuid, p.status, p.category_id
      FROM url_rewrite ur
      LEFT JOIN product p ON p.uuid = ur.entity_uuid
      WHERE ur.entity_type = 'product' AND ur.request_path LIKE '%super-pva%'
    `);
    console.log('Super PVA url_rewrites:');
    pva.forEach(r => console.log(JSON.stringify(r)));

    // Check the specific UUID
    const { rows: prod } = await client.query(`
      SELECT p.product_id, p.uuid, p.status, p.category_id, pd.name, pd.url_key
      FROM product p
      JOIN product_description pd ON p.product_id = pd.product_description_product_id
      WHERE pd.name ILIKE '%super pva%20kg%'
    `);
    console.log('\nSuper PVA en DB:');
    prod.forEach(r => console.log(JSON.stringify(r)));
  } finally {
    client.release();
    await pool.end();
  }
}
run().catch(e => { console.error(e); process.exit(1); });
