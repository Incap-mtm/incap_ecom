'use strict';
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
async function run() {
  const client = await pool.connect();
  try {
    // Check Super PVA product
    const { rows } = await client.query(`
      SELECT p.sku, pd.name, pd.url_key, p.category_id, cd.url_key as cat_url
      FROM product p
      JOIN product_description pd ON p.product_id = pd.product_description_id
      LEFT JOIN category c ON p.category_id = c.category_id
      LEFT JOIN category_description cd ON c.category_id = cd.category_description_id
      WHERE pd.name ILIKE '%super%pva%'
      LIMIT 5
    `);
    console.log('Super PVA products:');
    console.log(JSON.stringify(rows, null, 2));

    // Check a few more products to see url_key pattern
    const { rows: sample } = await client.query(`
      SELECT pd.name, pd.url_key
      FROM product_description pd
      LIMIT 5
    `);
    console.log('\nSample url_keys:');
    console.log(JSON.stringify(sample, null, 2));
  } finally {
    client.release();
    pool.end();
  }
}
run().catch(console.error);
