'use strict';
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
async function run() {
  const client = await pool.connect();
  try {
    // Check url_rewrite table structure
    const { rows: cols } = await client.query(`
      SELECT column_name FROM information_schema.columns WHERE table_name = 'url_rewrite'
    `);
    console.log('url_rewrite columns:', cols.map(r => r.column_name));

    // Sample rows
    const { rows } = await client.query(`SELECT * FROM url_rewrite LIMIT 10`);
    console.log('\nSample url_rewrite rows:');
    console.log(JSON.stringify(rows, null, 2));

    // Count total
    const { rows: cnt } = await client.query(`SELECT COUNT(*) FROM url_rewrite`);
    console.log('\nTotal rows:', cnt[0].count);

    // Check product url_keys
    const { rows: keys } = await client.query(`
      SELECT pd.url_key FROM product_description pd LIMIT 5
    `);
    console.log('\nSample product url_keys:', keys.map(r => r.url_key));
  } finally {
    client.release();
    pool.end();
  }
}
run().catch(console.error);
