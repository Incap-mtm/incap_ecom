'use strict';
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

pool.query(`
  SELECT p.sku, pd.name, pi.origin_image, pi.is_main
  FROM product p
  JOIN product_description pd ON p.product_id = pd.product_description_product_id
  LEFT JOIN product_image pi ON p.product_id = pi.product_image_product_id
  WHERE pd.name ILIKE '%emulsi%lavable%'
  ORDER BY p.sku, pi.is_main DESC
`).then(r => {
  r.rows.forEach(row => console.log(row.sku, '|', row.name, '| main:', row.is_main, '|', row.origin_image || 'SIN IMAGEN'));
  pool.end();
});
