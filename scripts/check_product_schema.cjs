'use strict';
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
async function run() {
  const client = await pool.connect();
  try {
    // Check product table columns
    const { rows: productCols } = await client.query(`
      SELECT column_name FROM information_schema.columns
      WHERE table_name = 'product' ORDER BY ordinal_position
    `);
    console.log('product columns:', productCols.map(r => r.column_name));

    // Check product_description columns
    const { rows: descCols } = await client.query(`
      SELECT column_name FROM information_schema.columns
      WHERE table_name = 'product_description' ORDER BY ordinal_position
    `);
    console.log('product_description columns:', descCols.map(r => r.column_name));

    // Test: what does a raw query return for Super PVA
    const { rows } = await client.query(`
      SELECT p.*, pd.*
      FROM product p
      LEFT JOIN product_description pd ON pd.product_description_product_id = p.product_id
      WHERE pd.url_key = 'super-pva-20kg'
    `);
    if (rows[0]) {
      console.log('\nAll fields for Super PVA:');
      Object.keys(rows[0]).forEach(k => {
        const v = rows[0][k];
        if (v !== null && typeof v !== 'object') console.log(`  ${k}: ${v}`);
      });
    }
  } finally {
    client.release();
    pool.end();
  }
}
run().catch(console.error);
