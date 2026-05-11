const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

// --- CONFIGURATION ---
const INPUT_CSV = path.join(__dirname, '../plantilla_productos_incap.csv');
const pool = new Pool({
  user: 'evershop',
  host: 'localhost',
  database: 'evershop',
  password: 'evershop_password',
  port: 5435,
});

/**
 * Slugify helper
 */
function slugify(text) {
  return text.toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-').replace(/[^\w-]+/g, '').replace(/--+/g, '-').replace(/^-+/, '').replace(/-+$/, '');
}

/**
 * Robust CSV Parser that handles commas within quotes
 */
function parseCSV(content) {
  const lines = content.split(/\r?\n/).filter(line => line.trim());
  if (lines.length === 0) return [];

  // Simple regex for CSV with commas, handling quotes
  const regex = /,(?=(?:(?:[^"]*"){2})*[^"]*$)/;
  const headers = lines[0].split(regex).map(h => h.trim().replace(/^"|"$/g, ''));
  
  return lines.slice(1).map(line => {
    const values = line.split(regex);
    const obj = {};
    headers.forEach((header, i) => {
      let val = values[i] ? values[i].trim() : '';
      // Remove surrounding quotes
      val = val.replace(/^"|"$/g, '').replace(/""/g, '"');
      obj[header] = val;
    });
    return obj;
  });
}

async function importData() {
  console.log('🏗️  Iniciando Importación Directa a EverShop DB...');
  
  const client = await pool.connect();
  try {
    const rawData = fs.readFileSync(INPUT_CSV, 'utf-8');
    const products = parseCSV(rawData);

    await client.query('BEGIN');

    for (const p of products) {
      if (!p.nombre_producto || !p.sku) continue;

      // 1. Get or Create Category
      const categoryName = p.categoria || 'General';
      const catSlug = slugify(categoryName);
      let catRes = await client.query('SELECT category_description_category_id FROM category_description WHERE url_key = $1 OR name = $2', [catSlug, categoryName]);
      let catId;
      if (catRes.rows.length === 0) {
        const newCat = await client.query('INSERT INTO category (status, include_in_nav) VALUES (true, true) RETURNING category_id');
        catId = newCat.rows[0].category_id;
        await client.query('INSERT INTO category_description (category_description_category_id, name, url_key) VALUES ($1, $2, $3)', [catId, categoryName, catSlug]);
      } else {
        catId = catRes.rows[0].category_description_category_id;
      }

      // 2. Insert Product
      const productRes = await client.query(
        'INSERT INTO product (type, status, visibility, sku, group_id, category_id, price, weight, tax_class) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) ON CONFLICT (sku) DO UPDATE SET status = EXCLUDED.status RETURNING product_id',
        ['simple', true, true, p.sku, null, catId, parseFloat(p.precio_cop || 0), parseFloat(p.peso_kg || 0), null]
      );
      const productId = productRes.rows[0].product_id;

      // 4. Product Description
      const descHTML = `<h3>Descripción</h3><p>${p.Descripciones || ""}</p><h4>Características</h4><p>${p.caracteristicas || ""}</p><h4>Modo de Empleo</h4><p>${p.modo_empleo || ""}</p>`;
      await client.query(
        'INSERT INTO product_description (product_description_product_id, name, url_key, description) VALUES ($1, $2, $3, $4) ON CONFLICT (product_description_product_id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description',
        [productId, `${p.nombre_producto} - ${p.presentacion}`, p.url_slug || slugify(p.nombre_producto + '-' + p.presentacion), descHTML]
      );

      // 5. Inventory
      await client.query(
        'INSERT INTO product_inventory (product_inventory_product_id, qty, manage_stock, stock_availability) VALUES ($1, $2, $3, $4) ON CONFLICT (product_inventory_product_id) DO UPDATE SET qty = EXCLUDED.qty',
        [productId, parseInt(p.stock || 100), p.gestionar_stock === '1', true]
      );
    }

    await client.query('COMMIT');
    console.log(`✅ Importación finalizada. ${products.length} registros procesados.`);

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Error fatal:', err.message);
  } finally {
    client.release();
    await pool.end();
  }
}

importData();
