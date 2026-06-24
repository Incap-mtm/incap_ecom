'use strict';
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
async function run() {
  const client = await pool.connect();
  try {
    // Count nulls and zeros
    const { rows } = await client.query(`
      SELECT
        COUNT(*) FILTER (WHERE weight IS NULL) AS nulls,
        COUNT(*) FILTER (WHERE weight = 0) AS zeros,
        COUNT(*) FILTER (WHERE weight > 0) AS positive,
        COUNT(*) AS total
      FROM product
    `);
    console.log('Weight distribution:', rows[0]);

    // Sample of null/zero weight products
    const { rows: sample } = await client.query(`
      SELECT p.sku, pd.name, p.weight
      FROM product p JOIN product_description pd ON p.product_id = pd.product_description_product_id
      WHERE p.weight IS NULL OR p.weight = 0
      LIMIT 10
    `);
    console.log('\nSample con weight NULL o 0:');
    sample.forEach(r => console.log(`  ${r.sku.padEnd(15)} weight=${r.weight} "${r.name}"`));

    // Check column nullability
    const { rows: col } = await client.query(`
      SELECT data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'product' AND column_name = 'weight'
    `);
    console.log('\nColumn schema:', col[0]);
  } finally {
    client.release();
    await pool.end();
  }
}
run().catch(e => { console.error(e); process.exit(1); });
