'use strict';
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
async function run() {
  const client = await pool.connect();
  try {
    const { rows } = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'category'
      ORDER BY ordinal_position
    `);
    console.log('=== category columns ===');
    rows.forEach(r => console.log(`  ${r.column_name.padEnd(25)} ${r.data_type.padEnd(20)} nullable=${r.is_nullable} default=${r.column_default || 'none'}`));

    // Also look at an existing row for reference
    const { rows: sample } = await client.query(`SELECT * FROM category LIMIT 1`);
    console.log('\n=== Sample row ===');
    console.log(JSON.stringify(sample[0], null, 2));
  } finally {
    client.release();
    await pool.end();
  }
}
run().catch(e => { console.error(e); process.exit(1); });
