'use strict';
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
async function run() {
  const client = await pool.connect();
  try {
    const { rows } = await client.query(`
      SELECT a.attribute_code, a.attribute_name,
        COUNT(DISTINCT pavi.product_id) AS prods,
        COUNT(*) AS values
      FROM attribute a
      LEFT JOIN product_attribute_value_index pavi ON a.attribute_id = pavi.attribute_id
      GROUP BY a.attribute_code, a.attribute_name
      ORDER BY a.attribute_code
    `);
    console.log('Atributos y cantidad de productos que los tienen:');
    rows.forEach(r => console.log(`  ${r.attribute_code.padEnd(28)} ${String(r.prods).padStart(4)} productos (${r.values} valores)`));

    // Sample Super PVA
    const { rows: pva } = await client.query(`
      SELECT a.attribute_code, pavi.option_text
      FROM product p
      JOIN product_attribute_value_index pavi ON pavi.product_id = p.product_id
      JOIN attribute a ON pavi.attribute_id = a.attribute_id
      WHERE p.sku = 'PV-SP-020'
      ORDER BY a.attribute_code
    `);
    console.log('\nAtributos de Super PVA 20kg:');
    pva.forEach(r => console.log(`  ${r.attribute_code.padEnd(28)} "${(r.option_text || '').substring(0, 100)}"`));
  } finally { client.release(); await pool.end(); }
}
run().catch(e => { console.error(e); process.exit(1); });
