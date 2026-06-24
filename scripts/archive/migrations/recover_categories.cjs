'use strict';
const { Pool } = require('pg');
const { randomUUID } = require('crypto');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function run() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Find root category UUID (parent for industries) — none in this schema, use NULL
    // Verify current state
    const before = await client.query(`SELECT category_id, uuid FROM category ORDER BY category_id`);
    console.log('Categorías existentes ANTES:', before.rows);

    // Insert madera and colchones — Evershop's category table needs uuid + status
    const maderaUuid = randomUUID();
    const colchonesUuid = randomUUID();

    const mInsert = await client.query(
      `INSERT INTO category (uuid, status, include_in_nav, position, show_products) VALUES ($1::uuid, true, true, 0, true) RETURNING category_id`,
      [maderaUuid]
    );
    const maderaId = mInsert.rows[0].category_id;
    console.log('madera creada con id:', maderaId);

    const cInsert = await client.query(
      `INSERT INTO category (uuid, status, include_in_nav, position, show_products) VALUES ($1::uuid, true, true, 0, true) RETURNING category_id`,
      [colchonesUuid]
    );
    const colchonesId = cInsert.rows[0].category_id;
    console.log('colchones creada con id:', colchonesId);

    // Create descriptions
    await client.query(
      `INSERT INTO category_description (category_description_category_id, name, url_key, meta_title)
       VALUES ($1::int, $2::varchar, $3::varchar, $2::varchar)`,
      [maderaId, 'Madera y Muebles', 'madera']
    );
    await client.query(
      `INSERT INTO category_description (category_description_category_id, name, url_key, meta_title)
       VALUES ($1::int, $2::varchar, $3::varchar, $2::varchar)`,
      [colchonesId, 'Colchones y Espumas', 'colchones']
    );

    // Create url_rewrite entries
    await client.query(
      `INSERT INTO url_rewrite (language, request_path, target_path, entity_uuid, entity_type)
       VALUES ('en', $1, $2, $3::uuid, 'category')`,
      ['/madera', '/category/' + maderaUuid, maderaUuid]
    );
    await client.query(
      `INSERT INTO url_rewrite (language, request_path, target_path, entity_uuid, entity_type)
       VALUES ('en', $1, $2, $3::uuid, 'category')`,
      ['/colchones', '/category/' + colchonesUuid, colchonesUuid]
    );

    // Reassign products by SKU
    const rMadera = await client.query(
      `UPDATE product SET category_id = $1::int WHERE sku LIKE 'LA-%' OR sku LIKE 'PV-%' OR sku LIKE 'CO-PC-%' OR sku LIKE 'CO-PI-%'`,
      [maderaId]
    );
    console.log('Productos a madera:', rMadera.rowCount);

    const rColchones = await client.query(
      `UPDATE product SET category_id = $1::int WHERE sku LIKE 'IN-%' OR sku LIKE 'IS-%'`,
      [colchonesId]
    );
    console.log('Productos a colchones:', rColchones.rowCount);

    await client.query('COMMIT');

    // Final state
    const { rows: final } = await client.query(
      `SELECT cd.url_key, cd.name, c.category_id,
        (SELECT COUNT(*) FROM product WHERE category_id = c.category_id) AS cnt
       FROM category c
       JOIN category_description cd ON c.category_id = cd.category_description_category_id
       ORDER BY c.category_id`
    );
    console.log('\n=== Estado final ===');
    final.forEach(c => console.log(`  [${c.category_id}] ${c.url_key.padEnd(12)} | "${c.name}" | ${c.cnt} productos`));

    const orphans = await client.query(`SELECT COUNT(*) AS c FROM product WHERE category_id IS NULL`);
    console.log(`Sin categoría: ${orphans.rows[0].c}`);
  } catch (e) {
    await client.query('ROLLBACK');
    console.error('ROLLBACK:', e.message);
    throw e;
  } finally {
    client.release();
    await pool.end();
  }
}
run().catch(e => { console.error(e); process.exit(1); });
