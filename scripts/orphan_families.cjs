'use strict';
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
async function run() {
  const client = await pool.connect();
  try {
    const { rows } = await client.query(`
      SELECT p.sku, pd.name FROM product p
      JOIN product_description pd ON p.product_id = pd.product_description_product_id
      WHERE p.product_id NOT IN (SELECT DISTINCT product_image_product_id FROM product_image)
      ORDER BY pd.name
    `);
    const families = {};
    for (const r of rows) {
      const fam = r.name.split('-')[0].trim().split(' ').slice(0, 2).join(' ').replace(/[,]/g, '');
      if (!families[fam]) families[fam] = [];
      families[fam].push(r.sku + ' — ' + r.name);
    }
    const sorted = Object.entries(families).sort((a, b) => b[1].length - a[1].length);
    console.log('Familias sin imagen (' + sorted.length + ' familias, ' + rows.length + ' productos):\n');
    for (const [fam, items] of sorted) {
      console.log(`■ ${fam} (${items.length} presentaciones)`);
      items.forEach(i => console.log('    ' + i));
      console.log('');
    }
  } finally {
    client.release();
    await pool.end();
  }
}
run().catch(e => { console.error(e); process.exit(1); });
