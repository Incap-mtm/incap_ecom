'use strict';
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
async function run() {
  const client = await pool.connect();
  try {
    for (const t of ['attribute', 'product_attribute_value_index']) {
      const { rows } = await client.query(`SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = $1 ORDER BY ordinal_position`, [t]);
      console.log(`\n${t}:`);
      rows.forEach(r => console.log(`  ${r.column_name.padEnd(40)} ${r.data_type} nullable=${r.is_nullable}`));
    }
    const { rows: sample } = await client.query(`SELECT * FROM attribute LIMIT 1`);
    console.log('\nSample attribute:', JSON.stringify(sample[0], null, 2));
  } finally { client.release(); await pool.end(); }
}
run().catch(e => { console.error(e); process.exit(1); });
