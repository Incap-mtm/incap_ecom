'use strict';
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
async function run() {
  const client = await pool.connect();
  try {
    const { rows } = await client.query(`SELECT attribute_code, attribute_name, type FROM attribute ORDER BY attribute_id`);
    console.log('Atributos en DB:');
    rows.forEach(r => console.log(`  ${r.attribute_code.padEnd(28)} "${r.attribute_name}" tipo=${r.type}`));
  } finally { client.release(); await pool.end(); }
}
run().catch(e => { console.error(e); process.exit(1); });
