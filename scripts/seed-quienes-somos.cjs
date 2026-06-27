/**
 * seed-quienes-somos.cjs
 * Siembra (o actualiza) el setting `quienes_somos` en PostgreSQL
 * con el contenido de docs/quienes-somos/quienes-somos.content.json.
 *
 * Uso:
 *   DATABASE_URL=postgres://... node scripts/seed-quienes-somos.cjs
 *
 * En Railway container:
 *   wget -q "https://raw.githubusercontent.com/.../seed-quienes-somos.cjs" -O /tmp/s.cjs && node /tmp/s.cjs
 */
'use strict';

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const contentPath = path.join(__dirname, '..', 'docs', 'quienes-somos', 'quienes-somos.content.json');

if (!process.env.DATABASE_URL) {
  console.error('ERROR: DATABASE_URL no definido.');
  process.exit(1);
}

if (!fs.existsSync(contentPath)) {
  console.error('ERROR: No se encontró el archivo de contenido en:', contentPath);
  process.exit(1);
}

const content = JSON.parse(fs.readFileSync(contentPath, 'utf8'));

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function run() {
  const value = JSON.stringify(content);
  await pool.query(
    `INSERT INTO setting (name, value, is_json)
     VALUES ('quienes_somos', $1, true)
     ON CONFLICT (name) DO UPDATE SET value = EXCLUDED.value, is_json = true`,
    [value]
  );
  console.log('OK: setting "quienes_somos" sembrado correctamente.');
  await pool.end();
}

run().catch((err) => {
  console.error('ERROR al sembrar:', err.message);
  pool.end().finally(() => process.exit(1));
});
