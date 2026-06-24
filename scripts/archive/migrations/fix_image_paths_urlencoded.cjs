'use strict';
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Decode %XX sequences using Latin-1 (single byte per %XX)
function decodeLatin1Percent(str) {
  return str.replace(/%([0-9A-Fa-f]{2})/g, (_, hex) => {
    return String.fromCharCode(parseInt(hex, 16));
  });
}

function removeAccents(str) {
  return str.normalize('NFD').replace(/[̀-ͯ]/g, '');
}

function cleanPath(p) {
  const decoded = decodeLatin1Percent(p);
  const noAccents = removeAccents(decoded);
  // Replace spaces with hyphens just in case
  return noAccents.replace(/ /g, '-');
}

async function run() {
  const client = await pool.connect();
  try {
    // Find paths that contain % (URL-encoded characters)
    const { rows } = await client.query(
      `SELECT product_image_id, origin_image FROM product_image WHERE origin_image LIKE '%\%%'`
    );
    console.log('Paths con caracteres codificados encontrados:', rows.length);
    let fixed = 0;
    for (const img of rows) {
      const newPath = cleanPath(img.origin_image);
      if (newPath !== img.origin_image) {
        await client.query(
          `UPDATE product_image SET origin_image = $1 WHERE product_image_id = $2`,
          [newPath, img.product_image_id]
        );
        console.log('  antes:', img.origin_image);
        console.log('  ahora:', newPath);
        fixed++;
      }
    }
    console.log('Total corregidos:', fixed);

    // Show any emulsion paths for verification
    const sample = await client.query(
      `SELECT origin_image FROM product_image WHERE origin_image ILIKE '%mulsi%' LIMIT 3`
    );
    console.log('Muestra Emulsion:');
    sample.rows.forEach(r => console.log(' ->', r.origin_image));
  } finally {
    client.release();
    pool.end();
  }
}
run().catch(console.error);
