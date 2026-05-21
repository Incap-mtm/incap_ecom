'use strict';
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function run() {
  const client = await pool.connect();
  try {
    // Revert hyphens back to spaces in folder names (undo the previous fix)
    const images = await client.query(`SELECT product_image_id, origin_image FROM product_image WHERE origin_image LIKE '/assets/products/%'`);

    let fixed = 0;
    for (const img of images.rows) {
      const parts = img.origin_image.split('/');
      // parts: ['', 'assets', 'products', 'FolderName', 'SubFolder', 'file.jpg']
      const fixedParts = parts.map((p, i) => {
        if (i <= 2) return p; // keep '', 'assets', 'products'
        if (i < parts.length - 1) return p.replace(/-/g, ' '); // revert hyphens to spaces in folders
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
    console.log('Rutas revertidas a espacios:', fixed);

    // Verify a sample
    const sample = await client.query(`SELECT origin_image FROM product_image LIMIT 3`);
    sample.rows.forEach(r => console.log(' ->', r.origin_image));
  } finally {
    client.release();
    pool.end();
  }
}

run().catch(console.error);
