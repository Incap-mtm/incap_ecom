'use strict';
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
async function run() {
  const client = await pool.connect();
  try {
    // Find all tables that reference category
    const { rows: fks } = await client.query(`
      SELECT
        tc.table_name,
        kcu.column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name,
        rc.delete_rule
      FROM information_schema.table_constraints tc
      JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
      JOIN information_schema.constraint_column_usage ccu ON ccu.constraint_name = tc.constraint_name
      JOIN information_schema.referential_constraints rc ON rc.constraint_name = tc.constraint_name
      WHERE tc.constraint_type = 'FOREIGN KEY' AND ccu.table_name = 'category'
    `);
    console.log('=== FKs apuntando a category ===');
    fks.forEach(f => console.log(`  ${f.table_name}.${f.column_name} → ${f.foreign_table_name}.${f.foreign_column_name} (on delete: ${f.delete_rule})`));

    // List tables with category-related names
    const { rows: tables } = await client.query(`
      SELECT table_name FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name LIKE '%category%'
      ORDER BY table_name
    `);
    console.log('\n=== Tablas con "category" en el nombre ===');
    tables.forEach(t => console.log(`  ${t.table_name}`));
  } finally {
    client.release();
    await pool.end();
  }
}
run().catch(e => { console.error(e); process.exit(1); });
