const { Pool } = require('pg');

const pool = new Pool({
  user: 'evershop',
  host: 'localhost',
  database: 'evershop',
  password: 'evershop_password',
  port: 5435,
});

async function repairCatalog() {
  console.log('🛠️  Iniciando Reparación de Rutas Anidadas...');
  
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Mapeo de categorías industriales para pluralización
    const industryMapping = {
      'madera': 'maderas',
      'maderas': 'maderas',
      'colchones': 'colchones',
      'calzado': 'calzado',
      'hogar': 'hogar',
      'multiusos': 'hogar'
    };

    // 1. Limpiar rewrites antiguos de productos para evitar conflictos
    console.log('🧹 Limpiando rutas antiguas...');
    await client.query("DELETE FROM url_rewrite WHERE entity_type = 'product'");

    // 2. Reparar rutas de productos con el patrón /industrias/[cat]/[slug]
    console.log('📦 Reparando rutas de productos (Patrón Industrial)...');
    const products = await client.query(`
      SELECT p.product_id, p.uuid, p.category_id, d.url_key as slug, cd.url_key as cat_slug
      FROM product p
      JOIN product_description d ON p.product_id = d.product_description_product_id
      LEFT JOIN category_description cd ON p.category_id = cd.category_description_category_id
    `);

    for (const p of products.rows) {
      let finalPath = p.slug;
      
      if (p.cat_slug && industryMapping[p.cat_slug]) {
        const pluralCat = industryMapping[p.cat_slug];
        finalPath = `industrias/${pluralCat}/${p.slug}`;
      } else {
        // Si no tiene categoría industrial, lo dejamos en la raíz o en su categoría
        finalPath = p.cat_slug ? `${p.cat_slug}/${p.slug}` : p.slug;
      }

      console.log(`   > Mapping: ${finalPath} -> /product/${p.product_id}`);
      
      await client.query(
        'INSERT INTO url_rewrite (entity_type, entity_uuid, request_path, target_path, language) VALUES ($1, $2, $3, $4, $5)',
        ['product', p.uuid, finalPath, `/product/${p.product_id}`, 'en']
      );
    }

    // 3. Asegurar que las categorías industriales tengan su ruta /industrias/[slug]
    console.log('🔗 Reparando rutas de categorías...');
    const categories = await client.query(`
      SELECT c.category_id, c.uuid, d.url_key as slug 
      FROM category c
      JOIN category_description d ON c.category_id = d.category_description_category_id
    `);

    for (const cat of categories.rows) {
      let catPath = cat.slug;
      if (industryMapping[cat.slug]) {
        catPath = `industrias/${industryMapping[cat.slug]}`;
      }

      await client.query(
        'INSERT INTO url_rewrite (entity_type, entity_uuid, request_path, target_path, language) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (language, entity_uuid) DO UPDATE SET request_path = EXCLUDED.request_path, target_path = EXCLUDED.target_path',
        ['category', cat.uuid, catPath, `/category/${cat.category_id}`, 'en']
      );
    }

    await client.query('COMMIT');
    console.log('✅ Rutas anidadas reparadas con éxito.');

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Error en reparación:', err.message);
  } finally {
    client.release();
    await pool.end();
  }
}

repairCatalog();

