'use strict';
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
async function run() {
  const client = await pool.connect();
  try {
    const { rows } = await client.query(`SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_name LIKE '%attribute%'`);
    console.log('Attribute tables:');
    rows.forEach(r => console.log('  ' + r.table_name));
    const { rows: link } = await client.query(`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'attribute_group_link' ORDER BY ordinal_position`);
    console.log('\nattribute_group_link cols:', link.map(r => r.column_name));
    const { rows: s } = await client.query(`SELECT * FROM attribute_group_link LIMIT 2`);
    console.log('Sample:', JSON.stringify(s));
  } finally { client.release(); await pool.end(); }
}
run().catch(e => { console.error(e); process.exit(1); });
