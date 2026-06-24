'use strict';
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

function getFamily(name) {
  const idx = name.lastIndexOf(' - ');
  if (idx === -1) return name.trim();
  return name.substring(0, idx).trim();
}

async function run() {
  const client = await pool.connect();
  try {
    const { rows } = await client.query(`
      SELECT cd.url_key, cd.name AS cat_name, pd.name
      FROM product p
      JOIN product_description pd ON p.product_id = pd.product_description_product_id
      LEFT JOIN category c ON p.category_id = c.category_id
      LEFT JOIN category_description cd ON c.category_id = cd.category_description_category_id
      WHERE p.status = true
      ORDER BY cd.url_key, pd.name
    `);

    const byCategory = {};
    for (const r of rows) {
      const cat = r.url_key || 'NULL';
      if (!byCategory[cat]) byCategory[cat] = {};
      const fam = getFamily(r.name);
      byCategory[cat][fam] = (byCategory[cat][fam] || 0) + 1;
    }

    for (const [cat, fams] of Object.entries(byCategory)) {
      const families = Object.entries(fams).sort((a, b) => b[1] - a[1]);
      console.log(`\n■ ${cat} (${Object.values(fams).reduce((a, b) => a + b, 0)} productos, ${families.length} familias):`);
      families.forEach(([f, c]) => console.log(`  ${String(c).padStart(2)} × ${f}`));
    }
  } finally {
    client.release();
    await pool.end();
  }
}
run().catch(e => { console.error(e); process.exit(1); });
