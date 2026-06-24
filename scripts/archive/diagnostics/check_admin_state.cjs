'use strict';
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
async function run() {
  const client = await pool.connect();
  try {
    // Active categories with product counts
    const { rows: cats } = await client.query(`
      SELECT cd.url_key, cd.name, c.category_id, c.status,
        (SELECT COUNT(*) FROM product WHERE category_id = c.category_id) AS product_count
      FROM category c
      JOIN category_description cd ON c.category_id = cd.category_description_category_id
      ORDER BY product_count DESC, c.category_id
    `);
    console.log('=== Categorías ===');
    cats.forEach(c => {
      console.log(`  [${c.category_id}] ${c.url_key.padEnd(45)} | "${c.name}" | productos: ${c.product_count} | status: ${c.status}`);
    });

    // Attributes
    const { rows: attrs } = await client.query(`
      SELECT attribute_id, attribute_code, attribute_name, type FROM attribute
      ORDER BY attribute_id
    `);
    console.log('\n=== Atributos ===');
    attrs.forEach(a => {
      console.log(`  [${a.attribute_id}] ${a.attribute_code.padEnd(25)} | "${a.attribute_name}" | tipo: ${a.type}`);
    });

    // Counts
    const { rows: counts } = await client.query(`
      SELECT
        (SELECT COUNT(*) FROM product) AS products,
        (SELECT COUNT(*) FROM product WHERE category_id IS NULL) AS uncategorized,
        (SELECT COUNT(*) FROM product_image) AS images,
        (SELECT COUNT(*) FROM admin_user) AS admins
    `);
    console.log('\n=== Resumen ===');
    console.log(JSON.stringify(counts[0], null, 2));
  } finally {
    client.release();
    pool.end();
  }
}
run().catch(console.error);
