/**
 * import_products.cjs
 *
 * Importa productos desde el CSV maestro a la base de datos de Evershop.
 *
 * Uso (local docker-compose):
 *   node scripts/import_products.cjs
 *
 * Uso (Railway DB):
 *   DATABASE_URL="postgresql://..." node scripts/import_products.cjs
 *
 * Flags opcionales:
 *   --dry-run    Muestra lo que haría sin escribir en la DB
 *   --clear      Borra todos los productos antes de importar
 */

'use strict';

const fs   = require('fs');
const path = require('path');
const { Pool } = require('pg');

// ── Config ───────────────────────────────────────────────────────────────────
const CSV_PATH = path.join(__dirname, '../Master -  Listado prod completo - images_updated.csv');

const DRY_RUN = process.argv.includes('--dry-run');
const CLEAR   = process.argv.includes('--clear');

const pool = process.env.DATABASE_URL
  ? new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } })
  : new Pool({
      host:     process.env.DB_HOST || 'localhost',
      port:     parseInt(process.env.DB_PORT || '5435'),
      user:     process.env.DB_USER || 'evershop',
      password: process.env.DB_PASS || 'evershop_password',
      database: process.env.DB_NAME || 'evershop',
    });

// ── Helpers ───────────────────────────────────────────────────────────────────
function slugify(text) {
  return (text || '')
    .toString().toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/\s+/g, '-').replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-').replace(/^-+|-+$/g, '');
}

function parseCSV(content) {
  const lines = content.split(/\r?\n/).filter(l => l.trim());
  if (!lines.length) return [];
  const split = line => {
    const res = []; let cur = ''; let inQ = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (c === '"') { if (inQ && line[i+1] === '"') { cur += '"'; i++; } else inQ = !inQ; }
      else if (c === ',' && !inQ) { res.push(cur); cur = ''; }
      else cur += c;
    }
    res.push(cur);
    return res;
  };
  const headers = split(lines[0]).map(h => h.trim().replace(/^"|"$/g, ''));
  return lines.slice(1).map(line => {
    const vals = split(line);
    const obj = {};
    headers.forEach((h, i) => { obj[h] = (vals[i] || '').trim().replace(/^"|"$/g, ''); });
    return obj;
  });
}

async function query(client, sql, params = []) {
  if (DRY_RUN && /^\s*(INSERT|UPDATE|DELETE|TRUNCATE)/i.test(sql)) {
    const preview = sql.trim().slice(0, 80).replace(/\s+/g, ' ');
    console.log(`  [dry-run] ${preview} ...`);
    // Return mock result for inserts
    if (/RETURNING/i.test(sql)) return { rows: [{ id: 0, variant_group_id: 0, category_id: 0 }] };
    return { rows: [] };
  }
  return client.query(sql, params);
}

// ── Category cache ────────────────────────────────────────────────────────────
const catCache = {};  // slug → category_id

async function getOrCreateCategory(client, name, parentId = null) {
  const slug = slugify(name);
  const cacheKey = `${parentId || 'root'}:${slug}`;
  if (catCache[cacheKey]) return catCache[cacheKey];

  const existing = await client.query(
    `SELECT c.category_id FROM category c
     JOIN category_description cd ON c.category_id = cd.category_description_category_id
     WHERE cd.url_key = $1`, [slug]
  );
  if (existing.rows.length) {
    catCache[cacheKey] = existing.rows[0].category_id;
    return existing.rows[0].category_id;
  }

  const res = await query(client,
    `INSERT INTO category (status, include_in_nav, parent_id)
     VALUES (true, false, $1) RETURNING category_id`, [parentId]
  );
  const catId = res.rows[0]?.category_id || 0;
  await query(client,
    `INSERT INTO category_description (category_description_category_id, name, url_key)
     VALUES ($1, $2, $3)`, [catId, name, slug]
  );
  catCache[cacheKey] = catId;
  console.log(`  + Categoría: ${name} (id=${catId})`);
  return catId;
}

// ── Attribute cache ───────────────────────────────────────────────────────────
const attrCache = {};  // code → attribute_id

async function getOrCreateAttribute(client, code, name, sortOrder = 0) {
  if (attrCache[code]) return attrCache[code];
  const existing = await client.query(
    `SELECT attribute_id FROM attribute WHERE attribute_code = $1`, [code]
  );
  if (existing.rows.length) {
    attrCache[code] = existing.rows[0].attribute_id;
    return existing.rows[0].attribute_id;
  }
  const res = await query(client,
    `INSERT INTO attribute (attribute_code, attribute_name, type, display_on_frontend, is_required, is_filterable, sort_order)
     VALUES ($1, $2, 'text', true, false, false, $3) RETURNING attribute_id`,
    [code, name, sortOrder]
  );
  const id = res.rows[0]?.attribute_id || 0;
  attrCache[code] = id;
  return id;
}

// ── Variant group cache ───────────────────────────────────────────────────────
const vgCache = {};  // groupKey → variant_group_id

async function getOrCreateVariantGroup(client, groupKey, attrGroupId, presentacionAttrId) {
  if (vgCache[groupKey]) return vgCache[groupKey];

  const res = await query(client,
    `INSERT INTO variant_group (attribute_group_id, attribute_one, visibility)
     VALUES ($1, $2, true) RETURNING variant_group_id`,
    [attrGroupId, presentacionAttrId]
  );
  const id = res.rows[0]?.variant_group_id || 0;
  vgCache[groupKey] = id;
  return id;
}

// ── URL key deduplication ─────────────────────────────────────────────────────
const usedUrlKeys = new Set();

async function ensureUniqueUrlKey(client, base) {
  // Load existing url_keys into cache once
  if (!ensureUniqueUrlKey._loaded) {
    const existing = await client.query(`SELECT url_key FROM product_description`);
    existing.rows.forEach(r => usedUrlKeys.add(r.url_key));
    ensureUniqueUrlKey._loaded = true;
  }
  let key = base; let n = 2;
  while (usedUrlKeys.has(key)) { key = `${base}-${n++}`; }
  usedUrlKeys.add(key);
  return key;
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log(DRY_RUN ? '=== DRY RUN — no se escribirá nada ===' : '=== Importando productos ===');

  const raw = fs.readFileSync(CSV_PATH, 'utf-8');
  const all = parseCSV(raw);
  const rows = all.filter(r => r.Publicar === 'SI' && r.sku && r.nombre_producto);
  console.log(`CSV: ${all.length} filas totales, ${rows.length} para importar (Publicar=SI)`);

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    if (CLEAR) {
      console.log('⚠  Borrando productos existentes...');
      await query(client, `DELETE FROM product`);
      await query(client, `DELETE FROM category WHERE parent_id IS NOT NULL`);
      await query(client, `DELETE FROM variant_group`);
    }

    // ── Ensure default attribute group exists ──────────────────────────────
    const agRes = await client.query(
      `SELECT attribute_group_id FROM attribute_group ORDER BY attribute_group_id LIMIT 1`
    );
    const attrGroupId = agRes.rows[0]?.attribute_group_id || 1;

    // ── Ensure "presentacion" attribute exists ─────────────────────────────
    const presentacionAttrId = await getOrCreateAttribute(client, 'presentacion', 'Presentación', 0);

    // ── Ensure custom attributes exist ────────────────────────────────────
    const CUSTOM_ATTRS = [
      ['usos',                 'Usos',               10],
      ['caracteristicas',      'Características',    20],
      ['modo_empleo',          'Modo de Empleo',      30],
      ['codigo_industrial',    'Código Industrial',   40],
      ['ghs_pictogramas',      'Pictogramas GHS',     50],
      ['precauciones_h',       'Precauciones H',      60],
      ['consejos_prudencia_p', 'Consejos P',          70],
    ];
    const customAttrIds = {};
    for (const [code, name, sort] of CUSTOM_ATTRS) {
      customAttrIds[code] = await getOrCreateAttribute(client, code, name, sort);
    }

    // ── Process rows ──────────────────────────────────────────────────────
    let inserted = 0, updated = 0, skipped = 0;

    for (const row of rows) {
      const sku          = row.sku.trim();
      const nombre       = row.nombre_producto.trim();
      const presentacion = row.presentacion.trim();
      const groupKey     = slugify(row.grupo_variante || nombre);
      const price        = parseFloat((row.precio_cop || '0').replace(/[^0-9.]/g, '')) || 0;
      const qty          = parseInt(row.stock || '100') || 100;
      const manageStock  = row.gestionar_stock === '1';
      const weight       = parseFloat(row.peso_kg || '0') || null;

      // ── Category ────────────────────────────────────────────────────────
      const catName  = (row.categoria || '').trim();
      const subName  = (row.subcategoria || '').trim();
      let categoryId = null;
      if (catName) {
        const parentCatId = await getOrCreateCategory(client, catName, null);
        categoryId = subName
          ? await getOrCreateCategory(client, subName, parentCatId)
          : parentCatId;
      }

      // ── Variant group ────────────────────────────────────────────────────
      const vgId = await getOrCreateVariantGroup(client, groupKey, attrGroupId, presentacionAttrId);

      // ── Product ──────────────────────────────────────────────────────────
      const existingProd = await client.query(
        `SELECT product_id FROM product WHERE sku = $1`, [sku]
      );

      let productId;
      if (existingProd.rows.length) {
        productId = existingProd.rows[0].product_id;
        await query(client,
          `UPDATE product SET
             variant_group_id = $1, group_id = $2, price = $3, qty = $4,
             manage_stock = $5, stock_availability = $6, weight = $7,
             status = true, visibility = true
           WHERE product_id = $8`,
          [vgId, attrGroupId, price, qty, manageStock, qty > 0, weight, productId]
        );
        updated++;
      } else {
        const res = await query(client,
          `INSERT INTO product
             (type, variant_group_id, visibility, group_id, sku, price, qty,
              weight, manage_stock, stock_availability, status)
           VALUES ('simple', $1, true, $2, $3, $4, $5, $6, $7, $8, true)
           RETURNING product_id`,
          [vgId, attrGroupId, sku, price, qty, weight, manageStock, qty > 0]
        );
        productId = res.rows[0]?.product_id || 0;
        inserted++;
      }

      // ── Product description ──────────────────────────────────────────────
      const productName = `${nombre} - ${presentacion}`;
      const baseSlug    = row.url_slug || slugify(`${nombre}-${presentacion}`);
      const urlKey      = await ensureUniqueUrlKey(client, baseSlug);

      const descHTML = [
        row.Descripciones       ? `<p>${row.Descripciones}</p>`          : '',
        row.usos                ? `<h4>Usos</h4><p>${row.usos}</p>`      : '',
        row.caracteristicas     ? `<h4>Características</h4><p>${row.caracteristicas}</p>` : '',
        row.modo_empleo         ? `<h4>Modo de Empleo</h4><p>${row.modo_empleo}</p>` : '',
        row.aplicacion_faq      ? `<h4>Aplicación</h4><p>${row.aplicacion_faq}</p>` : '',
        row.pre_tratamiento     ? `<h4>Pre-tratamiento</h4><p>${row.pre_tratamiento}</p>` : '',
      ].filter(Boolean).join('\n');

      await query(client,
        `INSERT INTO product_description
           (product_description_product_id, name, url_key, description, meta_title)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (product_description_product_id)
           DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description`,
        [productId, productName, urlKey, descHTML || null, productName]
      );

      // ── Category link ────────────────────────────────────────────────────
      if (categoryId) {
        await query(client,
          `INSERT INTO product_category (category_id, product_id)
           VALUES ($1, $2) ON CONFLICT DO NOTHING`,
          [categoryId, productId]
        );
      }

      // ── Images ──────────────────────────────────────────────────────────
      if (productId && row.imagen_principal) {
        // Remove old images to avoid duplicates on re-import
        await query(client,
          `DELETE FROM product_image WHERE product_image_product_id = $1`, [productId]
        );

        const mainImg = `/assets/${row.imagen_principal}`;
        await query(client,
          `INSERT INTO product_image (product_image_product_id, origin_image, is_main)
           VALUES ($1, $2, true)`,
          [productId, mainImg]
        );

        if (row.galeria_imagenes) {
          for (const img of row.galeria_imagenes.split('|').filter(Boolean)) {
            await query(client,
              `INSERT INTO product_image (product_image_product_id, origin_image, is_main)
               VALUES ($1, $2, false)`,
              [productId, `/assets/${img}`]
            );
          }
        }
      }

      // ── Custom attribute values ──────────────────────────────────────────
      const attrValues = {
        presentacion:        presentacion,
        usos:                row.usos,
        caracteristicas:     row.caracteristicas,
        modo_empleo:         row.modo_empleo,
        codigo_industrial:   row.codigo_industrial,
        ghs_pictogramas:     row.ghs_pictogramas,
        precauciones_h:      row.precauciones_h,
        consejos_prudencia_p: row.consejos_prudencia_p,
      };

      const allAttrIds = { presentacion: presentacionAttrId, ...customAttrIds };

      for (const [code, val] of Object.entries(attrValues)) {
        if (!val || !allAttrIds[code]) continue;
        await query(client,
          `INSERT INTO product_attribute_value_index
             (product_id, attribute_id, option_id, option_text)
           VALUES ($1, $2, NULL, $3)
           ON CONFLICT (product_id, attribute_id)
             DO UPDATE SET option_text = EXCLUDED.option_text`,
          [productId, allAttrIds[code], val]
        );
      }
    }

    await client.query('COMMIT');

    console.log(`\n✓ Insertados : ${inserted}`);
    console.log(`✓ Actualizados: ${updated}`);
    console.log(`  Saltados    : ${skipped}`);

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('\n✗ Error — ROLLBACK:', err.message);
    console.error(err.stack);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

main();
