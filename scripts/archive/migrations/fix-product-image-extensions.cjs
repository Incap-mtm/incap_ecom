/**
 * Arregla las imágenes rotas en la ficha de producto.
 *
 * Causa: la optimización a WebP borró los originales JPG/PNG del volumen, pero
 * en la DB product_image.origin_image siguió apuntando a .jpg/.png. El image
 * processor (/images?src=...) lee el archivo por su path exacto y da 404 (no hace
 * webp-negotiation), por eso las imágenes no se ven en el detalle/listado.
 *
 * Fix: cambia origin_image de .jpg/.jpeg/.png → .webp, PERO solo si el .webp existe
 * realmente (lo verifica por HTTP). Reporta las filas sin .webp (re-subir esas).
 *
 * Uso: DATABASE_URL="<prod>" SITE_URL="https://www.grupoincap.com.co" node scripts/fix-product-image-extensions.cjs
 *   Agregá --dry-run para solo ver qué haría.
 */
const { Client } = require('pg');
const https = require('https');

const connectionString =
  process.env.DATABASE_URL ||
  'postgresql://postgres:jWUghBxUtgsWrmvxzocrtxTeblOlnprU@switchyard.proxy.rlwy.net:33426/railway';
const SITE_URL = process.env.SITE_URL || 'https://www.grupoincap.com.co';
const DRY_RUN = process.argv.includes('--dry-run');
const CONCURRENCY = 16;

function toWebp(p) {
  return p.replace(/\.(jpe?g|png)$/i, '.webp');
}

// GET al .webp directo (el server da 404 a HEAD en estáticos) → 200 si existe.
// Se aborta apenas llegan los headers para no descargar el cuerpo.
function webpExists(path) {
  return new Promise((resolve) => {
    const url = new URL(SITE_URL + encodeURI(path));
    const req = https.request(url, { method: 'GET', timeout: 15000 }, (res) => {
      const ok = res.statusCode === 200;
      res.destroy(); // no descargar el body
      resolve(ok);
    });
    req.on('error', () => resolve(false));
    req.on('timeout', () => { req.destroy(); resolve(false); });
    req.end();
  });
}

async function mapLimit(items, limit, fn) {
  const out = new Array(items.length);
  let i = 0;
  async function worker() {
    while (i < items.length) {
      const idx = i++;
      out[idx] = await fn(items[idx], idx);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return out;
}

async function run() {
  const client = new Client({
    connectionString,
    ssl: connectionString.includes('rlwy.net') ? { rejectUnauthorized: false } : false,
  });
  await client.connect();

  const { rows } = await client.query(
    `SELECT product_image_id, origin_image FROM product_image
     WHERE origin_image ~* '\\.(jpe?g|png)$'`
  );
  console.log(`Filas con .jpg/.png: ${rows.length}`);

  // Verificar existencia de cada .webp
  console.log('Verificando .webp por HTTP…');
  const checked = await mapLimit(rows, CONCURRENCY, async (r) => {
    const webp = toWebp(r.origin_image);
    const exists = await webpExists(webp);
    return { ...r, webp, exists };
  });

  const fixable = checked.filter((r) => r.exists);
  const missing = checked.filter((r) => !r.exists);

  console.log(`  con .webp disponible (se arreglan): ${fixable.length}`);
  console.log(`  SIN .webp (no recuperables, re-subir): ${missing.length}`);

  if (missing.length) {
    console.log('\n=== Imágenes sin .webp (revisar / re-subir) ===');
    missing.forEach((r) => console.log('  ' + r.origin_image));
  }

  if (DRY_RUN) {
    console.log('\n--dry-run: no se aplicaron cambios.');
    await client.end();
    return;
  }

  let updated = 0;
  for (const r of fixable) {
    await client.query(
      'UPDATE product_image SET origin_image = $1 WHERE product_image_id = $2',
      [r.webp, r.product_image_id]
    );
    updated++;
  }
  console.log(`\n✓ origin_image actualizados a .webp: ${updated}`);
  await client.end();
}

run().catch((e) => { console.error('ERROR:', e.message); process.exit(1); });
