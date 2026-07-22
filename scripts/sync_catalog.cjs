const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL || 'postgresql://evershop:evershop_password@localhost:5435/evershop' });

/**
 * EverShop Catalog Sync
 * This script populates the product_attribute_value_index which is required
 * for products to appear in the frontend catalog.
 */
async function syncCatalog() {
  console.log('🔄 Sincronizando catálogo con el front-end...');
  
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Sync Categories
    const categories = await client.query('SELECT category_id, uuid FROM category');
    for (const cat of categories.rows) {
      const descRes = await client.query('SELECT url_key FROM category_description WHERE category_description_category_id = $1', [cat.category_id]);
      if (descRes.rows.length > 0) {
        await client.query(
          'INSERT INTO url_rewrite (entity_type, entity_uuid, request_path, target_path) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING',
          ['category', cat.uuid, descRes.rows[0].url_key, `index.php?route=catalog/category/view&id=${cat.category_id}`]
        );
      }
    }

    // 2. Sync Products
    const products = await client.query('SELECT product_id, uuid, category_id FROM product');
    console.log(`📦 Procesando ${products.rows.length} productos...`);

    for (const p of products.rows) {
      const descRes = await client.query('SELECT url_key, name FROM product_description WHERE product_description_product_id = $1', [p.product_id]);
      if (descRes.rows.length > 0) {
        const { url_key } = descRes.rows[0];
        await client.query(
          'INSERT INTO url_rewrite (entity_type, entity_uuid, request_path, target_path) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING',
          ['product', p.uuid, url_key, `index.php?route=catalog/product/view&id=${p.product_id}`]
        );
      }
    }

    await client.query('COMMIT');
    console.log('✅ Sincronización de rutas completada.');
    console.log('💡 Tip: Si aún no se ven, intenta reiniciar el comando "npm run dev".');

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Error en sincronización:', err.message);
  } finally {
    client.release();
    await pool.end();
  }
}

syncCatalog();
