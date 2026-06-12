/**
 * Arreglos para habilitar la carga manual de productos desde el admin:
 *  #1 Vincula los 8 atributos "sin grupo" al grupo Default → aparecen en el editor.
 *  #5 Renombra el atributo aplicacion_faq → preguntas_frecuentes (lo que lee el front).
 *
 * Idempotente. Uso:
 *   DATABASE_URL="<url>" node scripts/admin-product-load-fixes.cjs
 */
const { Client } = require('pg');

const connectionString =
  process.env.DATABASE_URL ||
  'postgresql://postgres:jWUghBxUtgsWrmvxzocrtxTeblOlnprU@switchyard.proxy.rlwy.net:33426/railway';

// Atributos que deben quedar editables en el form del producto (estaban sin grupo)
const ATTRS_TO_GROUP = [
  'usos',
  'caracteristicas',
  'modo_empleo',
  'codigo_industrial',
  'ghs_pictogramas',
  'precauciones_h',
  'consejos_prudencia_p',
  'presentacion',
];

async function run() {
  const client = new Client({
    connectionString,
    ssl: connectionString.includes('rlwy.net') ? { rejectUnauthorized: false } : false,
  });
  await client.connect();

  // Grupo "Default" (al que pertenecen todos los productos)
  const { rows: grp } = await client.query(
    `SELECT attribute_group_id FROM attribute_group WHERE group_name = 'Default' LIMIT 1`
  );
  if (!grp.length) throw new Error('No existe el grupo "Default"');
  const groupId = grp[0].attribute_group_id;

  // ── #1: vincular atributos al grupo (si no están ya) ──
  let linked = 0;
  for (const code of ATTRS_TO_GROUP) {
    const { rows: a } = await client.query(
      `SELECT attribute_id FROM attribute WHERE attribute_code = $1 LIMIT 1`,
      [code]
    );
    if (!a.length) { console.log(`  ⚠ atributo no encontrado: ${code}`); continue; }
    const attrId = a[0].attribute_id;
    const { rows: ex } = await client.query(
      `SELECT 1 FROM attribute_group_link WHERE attribute_id = $1 AND group_id = $2`,
      [attrId, groupId]
    );
    if (ex.length) { console.log(`  ⏭ ya vinculado: ${code}`); continue; }
    await client.query(
      `INSERT INTO attribute_group_link (attribute_id, group_id) VALUES ($1, $2)`,
      [attrId, groupId]
    );
    linked++;
    console.log(`  ✓ vinculado al grupo Default: ${code}`);
  }

  // ── #5: renombrar aplicacion_faq → preguntas_frecuentes ──
  const { rows: faqNew } = await client.query(
    `SELECT 1 FROM attribute WHERE attribute_code = 'preguntas_frecuentes' LIMIT 1`
  );
  if (faqNew.length) {
    console.log('  ⏭ preguntas_frecuentes ya existe — no se renombra');
  } else {
    const r = await client.query(
      `UPDATE attribute SET attribute_code = 'preguntas_frecuentes'
       WHERE attribute_code = 'aplicacion_faq'`
    );
    console.log(r.rowCount
      ? '  ✓ renombrado aplicacion_faq → preguntas_frecuentes'
      : '  ⚠ no existe aplicacion_faq para renombrar');
  }

  console.log(`\nListo. Atributos vinculados: ${linked}.`);
  await client.end();
}

run().catch((e) => { console.error('ERROR:', e.message); process.exit(1); });
