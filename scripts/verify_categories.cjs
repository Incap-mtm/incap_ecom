'use strict';
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
async function run() {
  const client = await pool.connect();
  try {
    // Raw category rows
    const { rows: cats } = await client.query(`SELECT category_id, uuid, status FROM category ORDER BY category_id`);
    console.log('=== category rows ===');
    cats.forEach(c => console.log(`  [${c.category_id}] uuid=${c.uuid} status=${c.status}`));

    // Raw description rows
    const { rows: descs } = await client.query(`SELECT category_description_id, category_description_category_id, url_key, name FROM category_description ORDER BY category_description_category_id`);
    console.log('\n=== category_description rows ===');
    descs.forEach(d => console.log(`  desc_id=${d.category_description_id} cat_id=${d.category_description_category_id} url_key=${d.url_key} name="${d.name}"`));

    // Products per category
    const { rows: prods } = await client.query(`
      SELECT category_id, COUNT(*) AS c FROM product GROUP BY category_id ORDER BY category_id
    `);
    console.log('\n=== Productos por category_id ===');
    prods.forEach(p => console.log(`  cat ${p.category_id}: ${p.c}`));
  } finally {
    client.release();
    await pool.end();
  }
}
run().catch(e => { console.error(e); process.exit(1); });
