'use strict';
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
async function run() {
  const client = await pool.connect();
  try {
    const { rows } = await client.query(`
      SELECT pi.origin_image, pi.is_main FROM product_image pi
      JOIN product p ON pi.product_image_product_id = p.product_id
      WHERE p.uuid = '1fd0f84f-24f5-4493-ab38-93d944af0a90'
    `);
    console.log('Super PVA 20kg images:');
    rows.forEach(r => console.log('  ' + r.origin_image + (r.is_main ? ' (main)' : '')));
  } finally {
    client.release();
    await pool.end();
  }
}
run().catch(console.error);
