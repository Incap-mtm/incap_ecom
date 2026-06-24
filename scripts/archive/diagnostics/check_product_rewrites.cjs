'use strict';
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
async function run() {
  const client = await pool.connect();
  try {
    // Check Super PVA url_rewrite
    const { rows: pva } = await client.query(`
      SELECT ur.request_path, ur.target_path
      FROM url_rewrite ur
      WHERE ur.request_path ILIKE '%super-pva%'
    `);
    console.log('Super PVA rewrites:', JSON.stringify(pva, null, 2));

    // Check what categories are there
    const { rows: cats } = await client.query(`
      SELECT cd.url_key, cd.name, c.category_id FROM category c
      JOIN category_description cd ON c.category_id = cd.category_description_category_id
    `);
    console.log('\nAll categories:', JSON.stringify(cats, null, 2));

    // Count products by url_rewrite path pattern
    const { rows: paths } = await client.query(`
      SELECT
        CASE WHEN request_path LIKE '/%/%/%' THEN 'category/subcategory/product'
             WHEN request_path LIKE '/%/%' THEN 'category/product'
             ELSE 'product only'
        END as pattern,
        COUNT(*) as cnt
      FROM url_rewrite WHERE entity_type = 'product'
      GROUP BY pattern
    `);
    console.log('\nProduct URL patterns:', JSON.stringify(paths, null, 2));
  } finally {
    client.release();
    pool.end();
  }
}
run().catch(console.error);
