'use strict';
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
async function run() {
  const client = await pool.connect();
  try {
    const { rows } = await client.query(
      "SELECT origin_image FROM product_image WHERE origin_image LIKE '%\\%%' LIMIT 10"
    );
    console.log('Sample paths with %:');
    rows.forEach(r => console.log(r.origin_image));
  } finally {
    client.release();
    pool.end();
  }
}
run().catch(console.error);
