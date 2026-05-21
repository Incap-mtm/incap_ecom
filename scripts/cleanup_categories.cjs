'use strict';
/**
 * cleanup_categories.cjs
 *
 * 1. Reasigna los 322 productos a las 4 categorías oficiales según SKU prefix
 * 2. Renombra las 4 categorías con los nombres completos del menú de industrias
 * 3. Elimina url_rewrite y rows de TODAS las demás categorías
 * 4. Verifica el estado final
 *
 * IDs oficiales (mantener):
 *   4  → calzado    → "Calzado y Marroquinería"
 *   9  → colchones  → "Colchones y Espumas"
 *   10 → madera     → "Madera y Muebles"
 *   12 → multiusos  → "Hogar y Multiusos"
 */
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const OFFICIAL_IDS = [4, 9, 10, 12];

const RENAMES = {
  4:  'Calzado y Marroquinería',
  9:  'Colchones y Espumas',
  10: 'Madera y Muebles',
  12: 'Hogar y Multiusos',
};

const SKU_PATTERNS = {
  // Calzado (id 4)
  4: `sku SIMILAR TO 'AB-%|EM-%|MA-%|AC-%|AU-A1-%|AU-A7-%|AU-BP-%|AU-H3-%|AU-HB-%|AU-LV-%|AU-PG-%|AU-SZ-%|CO-FL-%|CO-IT-%|CO-MB-%|CO-MF-%|CO-MG-%|CO-MN-%|CO-MT-%|CO-SP-%|CO-CZ-%|CO-IF-%'`,
  // Colchones (id 9)
  9: `sku LIKE 'IN-%' OR sku LIKE 'IS-%'`,
  // Madera (id 10)
  10: `sku LIKE 'LA-%' OR sku LIKE 'PV-%' OR sku LIKE 'CO-PC-%' OR sku LIKE 'CO-PI-%'`,
  // Multiusos (id 12)
  12: `sku LIKE 'AU-PE-%' OR sku LIKE 'AU-RM-%' OR sku LIKE 'AU-VU-%' OR sku LIKE 'CO-PR-%' OR sku LIKE 'CO-SO-%' OR sku LIKE 'CO-AN-%' OR sku LIKE 'CO-CR-%' OR sku LIKE 'CO-SL-%'`,
};

async function run() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // ── 1. Reasignar productos por SKU prefix ───────────────────────
    console.log('=== Paso 1: Reasignación por SKU ===');
    for (const [catId, where] of Object.entries(SKU_PATTERNS)) {
      const r = await client.query(`UPDATE product SET category_id = ${catId} WHERE ${where}`);
      console.log(`  cat ${catId} → ${r.rowCount} productos`);
    }

    const uncatBefore = await client.query(`SELECT COUNT(*) AS c FROM product WHERE category_id IS NULL OR category_id NOT IN (${OFFICIAL_IDS.join(',')})`);
    console.log(`  Productos fuera de las 4 oficiales: ${uncatBefore.rows[0].c}`);

    // ── 2. Renombrar las 4 oficiales ────────────────────────────────
    console.log('\n=== Paso 2: Renombrar categorías oficiales ===');
    for (const [id, name] of Object.entries(RENAMES)) {
      const r = await client.query(
        `UPDATE category_description SET name = $1::varchar, meta_title = $1::varchar WHERE category_description_category_id = $2::int`,
        [name, parseInt(id)]
      );
      console.log(`  cat ${id} → "${name}" (${r.rowCount} rows)`);
    }

    // ── 3. Listar categorías a eliminar ─────────────────────────────
    console.log('\n=== Paso 3: Categorías a eliminar ===');
    const { rows: toDelete } = await client.query(
      `SELECT c.category_id, cd.url_key, cd.name FROM category c
       LEFT JOIN category_description cd ON c.category_id = cd.category_description_category_id
       WHERE c.category_id NOT IN (${OFFICIAL_IDS.join(',')})
       ORDER BY c.category_id`
    );
    toDelete.forEach(c => console.log(`  [${c.category_id}] ${c.url_key} ("${c.name}")`));

    const idsToDelete = toDelete.map(c => c.category_id);
    if (idsToDelete.length === 0) {
      console.log('  (ninguna)');
    } else {
      // Borrar url_rewrite de esas categorías
      const ru = await client.query(
        `DELETE FROM url_rewrite WHERE entity_type = 'category' AND entity_uuid IN
         (SELECT uuid FROM category WHERE category_id IN (${idsToDelete.join(',')}))`
      );
      console.log(`  url_rewrite borrados: ${ru.rowCount}`);

      // Borrar category_description
      const rd = await client.query(
        `DELETE FROM category_description WHERE category_description_category_id IN (${idsToDelete.join(',')})`
      );
      console.log(`  category_description borrados: ${rd.rowCount}`);

      // Borrar category
      const rc = await client.query(
        `DELETE FROM category WHERE category_id IN (${idsToDelete.join(',')})`
      );
      console.log(`  category borrados: ${rc.rowCount}`);
    }

    await client.query('COMMIT');

    // ── 4. Verificación final ───────────────────────────────────────
    console.log('\n=== Verificación final ===');
    const { rows: final } = await client.query(
      `SELECT cd.url_key, cd.name, c.category_id,
        (SELECT COUNT(*) FROM product WHERE category_id = c.category_id) AS product_count
       FROM category c
       JOIN category_description cd ON c.category_id = cd.category_description_category_id
       ORDER BY c.category_id`
    );
    final.forEach(c => console.log(`  [${c.category_id}] ${c.url_key.padEnd(12)} | "${c.name}" | ${c.product_count} productos`));

    const { rows: orphans } = await client.query(
      `SELECT COUNT(*) AS c FROM product WHERE category_id IS NULL OR category_id NOT IN (${OFFICIAL_IDS.join(',')})`
    );
    console.log(`\nProductos sin categoría oficial: ${orphans[0].c}`);
  } catch (e) {
    await client.query('ROLLBACK');
    console.error('ROLLBACK por error:', e.message);
    throw e;
  } finally {
    client.release();
    await pool.end();
  }
}
run().catch(e => { console.error(e); process.exit(1); });
