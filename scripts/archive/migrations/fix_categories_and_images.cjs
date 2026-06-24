'use strict';
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function run() {
  const client = await pool.connect();
  try {
    // 1. Get category IDs for 'madera' and 'maderas'
    const cats = await client.query(`
      SELECT cd.category_description_category_id AS cat_id, cd.url_key
      FROM category_description cd
      WHERE cd.url_key IN ('madera', 'maderas')
    `);
    const madera = cats.rows.find(r => r.url_key === 'madera');
    const maderas = cats.rows.find(r => r.url_key === 'maderas');

    console.log('madera cat_id:', madera?.cat_id);
    console.log('maderas cat_id:', maderas?.cat_id);

    if (!madera || !maderas) {
      console.log('No se encontraron ambas categorías'); return;
    }

    // 2. Move all products from 'maderas' to 'madera'
    const moved = await client.query(
      `UPDATE product SET category_id = $1 WHERE category_id = $2`,
      [madera.cat_id, maderas.cat_id]
    );
    console.log('Productos movidos a madera:', moved.rowCount);

    // 3. Delete 'maderas' category
    await client.query(`DELETE FROM category_description WHERE url_key = 'maderas'`);
    await client.query(`DELETE FROM category WHERE category_id = $1`, [maderas.cat_id]);
    console.log('Categoría maderas eliminada');

    // 4. Fix image paths: replace spaces with hyphens in folder names
    // Get all origin_image paths
    const images = await client.query(`SELECT product_image_id, origin_image FROM product_image WHERE origin_image LIKE '/assets/products/%'`);

    let fixed = 0;
    for (const img of images.rows) {
      // Only fix the folder part (first two path segments after /assets/), not the filename
      const parts = img.origin_image.split('/');
      // parts: ['', 'assets', 'products', 'FolderName', 'SubFolder', 'file.jpg']
      const fixedParts = parts.map((p, i) => {
        if (i <= 2) return p; // keep '', 'assets', 'products' as-is
        // Replace spaces with hyphens in folder names only (not filenames at last segment)
        if (i < parts.length - 1) return p.replace(/ /g, '-');
        return p; // keep filename as-is
      });
      const newPath = fixedParts.join('/');
      if (newPath !== img.origin_image) {
        await client.query(
          `UPDATE product_image SET origin_image = $1 WHERE product_image_id = $2`,
          [newPath, img.product_image_id]
        );
        fixed++;
      }
    }
    console.log('Rutas de imágenes corregidas:', fixed);

  } finally {
    client.release();
    pool.end();
  }
}

run().catch(console.error);
