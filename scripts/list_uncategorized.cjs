'use strict';
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

pool.query(`
  SELECT p.sku, pd.name
  FROM product p
  JOIN product_description pd ON p.product_id = pd.product_description_product_id
  WHERE p.category_id IS NULL
  ORDER BY p.sku
`).then(r => {
  r.rows.forEach(row => console.log(row.sku, '|', row.name));
  pool.end();
});
