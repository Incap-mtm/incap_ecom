'use strict';
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
async function run() {
  const client = await pool.connect();
  try {
    const { rows } = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'product_image' ORDER BY ordinal_position
    `);
    console.log('product_image schema:');
    rows.forEach(r => console.log(`  ${r.column_name.padEnd(28)} ${r.data_type.padEnd(20)} nullable=${r.is_nullable}`));
    const { rows: sample } = await client.query(`SELECT * FROM product_image LIMIT 2`);
    console.log('\nSample rows:');
    sample.forEach(r => console.log(JSON.stringify(r)));
  } finally {
    client.release();
    await pool.end();
  }
}
run().catch(e => { console.error(e); process.exit(1); });
