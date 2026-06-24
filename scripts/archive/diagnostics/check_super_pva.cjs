'use strict';
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
async function run() {
  const client = await pool.connect();
  try {
    const { rows } = await client.query(`
      SELECT p.sku, pd.name, pd.url_key, p.category_id, cd.url_key as cat_url
      FROM product p
      JOIN product_description pd ON p.product_id = pd.product_id
      LEFT JOIN category c ON p.category_id = c.category_id
      LEFT JOIN category_description cd ON c.category_id = cd.category_id
      WHERE pd.name ILIKE '%super%pva%'
      LIMIT 5
    `);
    console.log(JSON.stringify(rows, null, 2));
  } finally {
    client.release();
    pool.end();
  }
}
run().catch(console.error);
