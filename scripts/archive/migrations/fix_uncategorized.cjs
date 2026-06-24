'use strict';
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

pool.query(`
  UPDATE product
  SET category_id = (SELECT category_id FROM category_description WHERE url_key = 'maderas' LIMIT 1)
  WHERE sku IN ('CO-SL-003','CO-SL-010','CO-SL-020','CO-SL-360','LA-MA-530')
`).then(r => {
  console.log('Actualizados:', r.rowCount);
  pool.end();
});
