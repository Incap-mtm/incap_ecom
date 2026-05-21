'use strict';
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
async function run() {
  const client = await pool.connect();
  try {
    const r = await client.query(`UPDATE product SET weight = 0 WHERE weight IS NULL`);
    console.log('Productos actualizados con weight=0:', r.rowCount);
    const check = await client.query(`SELECT COUNT(*) AS c FROM product WHERE weight IS NULL`);
    console.log('Productos con weight NULL después:', check.rows[0].c);
  } finally {
    client.release();
    await pool.end();
  }
}
run().catch(e => { console.error(e); process.exit(1); });
