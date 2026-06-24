'use strict';
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
async function run() {
  const client = await pool.connect();
  try {
    // Productos con/sin imagen
    const { rows: counts } = await client.query(`
      SELECT
        (SELECT COUNT(*) FROM product) AS total_products,
        (SELECT COUNT(DISTINCT product_image_product_id) FROM product_image) AS products_with_images,
        (SELECT COUNT(*) FROM product_image) AS total_images
    `);
    console.log('Resumen:', counts[0]);

    // Productos sin imagen
    const { rows: noImg } = await client.query(`
      SELECT p.sku, pd.name FROM product p
      JOIN product_description pd ON p.product_id = pd.product_description_product_id
      WHERE p.product_id NOT IN (SELECT DISTINCT product_image_product_id FROM product_image)
      ORDER BY p.sku
    `);
    console.log('\nProductos SIN imagen (' + noImg.length + '):');
    noImg.slice(0, 20).forEach(p => console.log(`  ${p.sku.padEnd(15)} "${p.name}"`));
    if (noImg.length > 20) console.log(`  ... y ${noImg.length - 20} más`);

    // Productos con cuántas imágenes
    const { rows: dist } = await client.query(`
      SELECT cnt, COUNT(*) AS productos FROM (
        SELECT COUNT(*) AS cnt FROM product_image GROUP BY product_image_product_id
      ) t GROUP BY cnt ORDER BY cnt
    `);
    console.log('\nDistribución productos por # imágenes:');
    dist.forEach(d => console.log(`  ${d.cnt} imagen(es): ${d.productos} productos`));
  } finally {
    client.release();
    await pool.end();
  }
}
run().catch(e => { console.error(e); process.exit(1); });
