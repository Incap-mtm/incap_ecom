'use strict';
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

function removeAccents(str) {
  return str
    .replace(/á/g, 'a').replace(/é/g, 'e').replace(/í/g, 'i')
    .replace(/ó/g, 'o').replace(/ú/g, 'u').replace(/ü/g, 'u')
    .replace(/Á/g, 'A').replace(/É/g, 'E').replace(/Í/g, 'I')
    .replace(/Ó/g, 'O').replace(/Ú/g, 'U').replace(/Ü/g, 'U')
    .replace(/ñ/g, 'n').replace(/Ñ/g, 'N');
}

async function run() {
  const client = await pool.connect();
  try {
    const images = await client.query(`SELECT product_image_id, origin_image FROM product_image WHERE origin_image LIKE '/assets/products/%'`);
    let fixed = 0;
    for (const img of images.rows) {
      const newPath = removeAccents(img.origin_image);
      if (newPath !== img.origin_image) {
        await client.query(`UPDATE product_image SET origin_image = $1 WHERE product_image_id = $2`, [newPath, img.product_image_id]);
        fixed++;
      }
    }
    console.log('Paths con tildes corregidos:', fixed);
    const sample = await client.query(`SELECT origin_image FROM product_image WHERE origin_image LIKE '%mulsi%' LIMIT 2`);
    sample.rows.forEach(r => console.log(' ->', r.origin_image));
  } finally {
    client.release();
    pool.end();
  }
}
run().catch(console.error);
