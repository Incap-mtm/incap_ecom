'use strict';
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

pool.query(`
  SELECT p.sku, pd.name, pi.origin_image
  FROM product p
  JOIN product_description pd ON p.product_id = pd.product_description_product_id
  LEFT JOIN product_image pi ON p.product_id = pi.product_image_product_id AND pi.is_main = true
  WHERE pd.name ILIKE '%calzafort%'
  ORDER BY p.sku
`).then(r => {
  r.rows.forEach(row => console.log(row.sku, '|', row.name, '|', row.origin_image || 'SIN IMAGEN'));
  pool.end();
});
