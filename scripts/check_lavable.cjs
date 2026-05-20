'use strict';
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
async function run() {
  const client = await pool.connect();
  try {
    // Check for any paths with Lavable (accent issue product)
    const { rows } = await client.query(
      "SELECT origin_image FROM product_image WHERE origin_image ILIKE '%lavable%'"
    );
    console.log('Lavable paths (' + rows.length + '):');
    rows.forEach(r => console.log(r.origin_image));

    // Also check for any paths with non-ASCII characters using regex
    const { rows: nonAscii } = await client.query(
      "SELECT product_image_id, origin_image FROM product_image WHERE origin_image ~ '[^[:ascii:]]'"
    );
    console.log('\nNon-ASCII paths:', nonAscii.length);
    nonAscii.slice(0, 5).forEach(r => console.log(r.origin_image));

    // Check for paths that literally contain % followed by hex digits (URL encoded)
    const { rows: encoded } = await client.query(
      "SELECT product_image_id, origin_image FROM product_image WHERE origin_image ~ '%[0-9a-fA-F]{2}'"
    );
    console.log('\nURL-encoded paths:', encoded.length);
    encoded.slice(0, 5).forEach(r => console.log(r.origin_image));
  } finally {
    client.release();
    pool.end();
  }
}
run().catch(console.error);
