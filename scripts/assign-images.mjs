/**
 * assign-images.mjs
 * Matchea archivos de imagen contra productos por nombre normalizado
 * e inserta en product_image (soporta múltiples imágenes por producto).
 *
 * Uso:
 *   node scripts/assign-images.mjs --dir ./media/products --dry-run
 *   node scripts/assign-images.mjs --dir ./media/products
 *
 * Convención de archivos esperada:
 *   {familia}_{tamaño}-01.ext  → imagen principal (is_main=true)
 *   {familia}_{tamaño}-02.ext  → imagen secundaria
 *   {familia}_{tamaño}-03.ext  → imagen secundaria
 *
 * El script busca archivos en TODAS las subcarpetas de --dir.
 *
 * IMPORTANTE: los archivos deben estar ya en /app/media/products/
 * en el container Railway antes de ejecutar sin --dry-run.
 */
import pg from 'pg';
import { readdirSync, statSync } from 'fs';
import { extname, basename, resolve, join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const { Client } = pg;
const __dirname = dirname(fileURLToPath(import.meta.url));

const DB_URL = process.env.DATABASE_URL ||
  'postgresql://postgres:jWUghBxUtgsWrmvxzocrtxTeblOlnprU@switchyard.proxy.rlwy.net:33426/railway';

const DRY_RUN  = process.argv.includes('--dry-run');
const dirArgIdx = process.argv.indexOf('--dir');
const IMAGES_DIR = dirArgIdx !== -1 ? resolve(process.argv[dirArgIdx + 1]) : null;
const VALID_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp']);

if (!IMAGES_DIR) {
  console.error('Uso: node scripts/assign-images.mjs --dir <carpeta> [--dry-run]');
  process.exit(1);
}

// ──────────────────────────────────────────────
// Normalización base: igual para DB y archivos
// ──────────────────────────────────────────────
function normalize(str) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')  // quitar diacríticos: á→a, é→e, ó→o
    .replace(/ñ/g, 'n')
    .replace(/\s+-\s+/g, '-')         // " - " → "-"
    .replace(/\s+/g, '-')             // espacios → "-"
    .replace(/[.,]/g, '-')            // puntos/comas → "-"  (4.5 → 4-5)
    .replace(/[^a-z0-9-]/g, '')       // eliminar resto
    .replace(/-+/g, '-')              // múltiples guiones → uno
    .replace(/^-|-$/g, '');
}

// Normalización del nombre en DB para el match:
//   "Maxón Blanco - 3600cc"  →  "maxon-blanco-3600"
//   "Maxón Blanco - 4.3 Gal" →  "maxon-blanco-43gal"
//   "Maxón Blanco - 53 Gal"  →  "maxon-blanco-53gal"
//   "Maxón Ultra - 3.6L"     →  "maxon-ultra-36l"
function dbKey(name) {
  let k = normalize(name);
  k = k.replace(/cc$/, '');                           // strip cc: 3600cc → 3600
  k = k.replace(/(\d)-(\d+)-gal$/, '$1$2gal');        // decimal gal: 4-3-gal → 43gal
  k = k.replace(/-gal$/, 'gal');                      // entero gal: 53-gal  → 53gal
  k = k.replace(/(\d)-(\d+)-?l$/, '$1$2l');           // decimal L:  3-6-l   → 36l
  k = k.replace(/-l$/, 'l');                          // entero L:   10-l    → 10l
  return k;
}

// Normalización del nombre de archivo para el match:
//   underscores → dashes, strip secuencia final -01/-02/_01
//   decimal en galones: 4,3gal → 43gal, strip cero inicial: 043gal → 43gal
function fileKey(filename) {
  let k = basename(filename, extname(filename))
    .replace(/_/g, '-')              // underscores → dashes
    .replace(/[-]\d{2}$/, '');       // strip -01, -02, -03 al final
  k = normalize(k);
  k = k.replace(/(\d)-(\d+)(gal|l)$/, '$1$2$3');     // 4-3gal → 43gal, 3-6l → 36l
  k = k.replace(/(^|-)0+(\d+gal)/, '$1$2');           // -043gal → -43gal
  return k;
}

// Número de secuencia del archivo: -01 → 1, -02 → 2 (default 1)
function seqNum(filename) {
  const m = basename(filename, extname(filename)).match(/[-_](\d{2})$/);
  return m ? parseInt(m[1], 10) : 1;
}

// ──────────────────────────────────────────────
// Leer archivos recursivamente
// ──────────────────────────────────────────────
function readFilesRecursive(dir) {
  const results = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      results.push(...readFilesRecursive(full));
    } else if (VALID_EXTS.has(extname(entry).toLowerCase())) {
      results.push({ filename: entry, fullPath: full });
    }
  }
  return results;
}

// ──────────────────────────────────────────────
// Main
// ──────────────────────────────────────────────
async function main() {
  let allFiles;
  try {
    allFiles = readFilesRecursive(IMAGES_DIR);
  } catch {
    console.error(`No se pudo leer la carpeta: ${IMAGES_DIR}`);
    process.exit(1);
  }

  if (allFiles.length === 0) {
    console.error(`No se encontraron imágenes en: ${IMAGES_DIR}`);
    process.exit(1);
  }

  console.log(`Modo: ${DRY_RUN ? 'DRY-RUN (sin cambios en DB)' : 'EJECUCIÓN REAL'}`);
  console.log(`Carpeta: ${IMAGES_DIR}`);
  console.log(`Archivos de imagen encontrados: ${allFiles.length}\n`);

  // Agrupar por base key: {key → [{filename, seq}]}
  const groups = new Map();
  for (const f of allFiles) {
    const k = fileKey(f.filename);
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k).push({ filename: f.filename, seq: seqNum(f.filename) });
  }
  // Ordenar cada grupo por secuencia
  for (const imgs of groups.values()) {
    imgs.sort((a, b) => a.seq - b.seq);
  }
  console.log(`Productos únicos detectados en archivos: ${groups.size}\n`);

  const client = new Client({ connectionString: DB_URL, ssl: { rejectUnauthorized: false } });
  await client.connect();

  // Leer todos los productos con estado de imagen
  const { rows: products } = await client.query(`
    SELECT
      p.product_id,
      p.sku,
      pd.name,
      EXISTS(
        SELECT 1 FROM product_image pi
        WHERE pi.product_image_product_id = p.product_id
      ) AS has_image
    FROM product p
    JOIN product_description pd ON pd.product_description_product_id = p.product_id
    WHERE p.status = true
    ORDER BY pd.name
  `);

  const withImg    = products.filter(p => p.has_image).length;
  const withoutImg = products.length - withImg;
  console.log(`Productos activos en DB: ${products.length}`);
  console.log(`  Con imagen:  ${withImg}`);
  console.log(`  Sin imagen:  ${withoutImg}\n`);

  // Mapa normalizado DB → producto
  const productMap = new Map();
  for (const p of products) {
    productMap.set(dbKey(p.name), p);
  }

  // ── Match ──
  const toAssign   = [];   // {key, imgs, product}
  const alreadyHas = [];   // {key, imgs, product}
  const noMatch    = [];   // {key, imgs}

  for (const [key, imgs] of groups) {
    const product = productMap.get(key);
    if (!product) {
      noMatch.push({ key, imgs });
    } else if (product.has_image) {
      alreadyHas.push({ key, imgs, product });
    } else {
      toAssign.push({ key, imgs, product });
    }
  }

  // ── Reporte ──
  console.log('═══ RESULTADO DEL MATCH ═══');
  console.log(`✓ Con match, se asignarán:      ${toAssign.length} productos (${toAssign.reduce((s, g) => s + g.imgs.length, 0)} imágenes)`);
  console.log(`~ Con match, ya tienen imagen:   ${alreadyHas.length} productos`);
  console.log(`✗ Sin match en DB:               ${noMatch.length} claves\n`);

  if (toAssign.length > 0) {
    console.log('--- ASIGNAR ---');
    toAssign.forEach(g => {
      const imgList = g.imgs.map(i => `${i.filename}(${i.seq === 1 ? 'principal' : 'extra'})`).join(', ');
      console.log(`  [${g.product.sku}] "${g.product.name}"`);
      console.log(`    → ${imgList}`);
    });
  }

  if (alreadyHas.length > 0) {
    console.log('\n--- YA TIENEN IMAGEN (skip) ---');
    alreadyHas.forEach(g =>
      console.log(`  [${g.product.sku}] "${g.product.name}"`)
    );
  }

  if (noMatch.length > 0) {
    console.log('\n--- SIN MATCH — revisar nombre del archivo ---');
    noMatch.forEach(({ key, imgs }) => {
      console.log(`  Archivos: ${imgs.map(i => i.filename).join(', ')}`);
      console.log(`    → clave normalizada: "${key}"`);
      // Sugerir producto con prefijo similar (primeros 12 chars)
      const prefix = key.substring(0, 12);
      const suggestions = [...productMap.entries()]
        .filter(([k]) => k.startsWith(prefix))
        .slice(0, 2);
      suggestions.forEach(([k, p]) =>
        console.log(`    → ¿"${p.name}"?  (clave DB: "${k}")`)
      );
    });
  }

  if (DRY_RUN) {
    console.log('\nEjecuta sin --dry-run para aplicar los cambios en DB.');
    await client.end();
    return;
  }

  // ── Insertar en DB ──
  let insertedProducts = 0;
  let insertedImages   = 0;

  for (const g of toAssign) {
    for (const img of g.imgs) {
      const isMain = img.seq === 1;
      await client.query(
        `INSERT INTO product_image
           (product_image_product_id, origin_image, is_main)
         VALUES ($1, $2, $3)`,
        [g.product.product_id, `/media/products/${img.filename}`, isMain]
      );
      insertedImages++;
    }
    insertedProducts++;
    console.log(`✓ [${g.product.sku}] ${g.imgs.length} imágenes`);
  }

  console.log(`\n${insertedProducts} productos actualizados, ${insertedImages} imágenes insertadas en DB.`);

  if (insertedImages > 0) {
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('PRÓXIMO PASO: copiar archivos al volumen Railway');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('1. Commit de las imágenes en la rama staging:');
    console.log('   git add media/products/');
    console.log('   git push origin staging');
    console.log('');
    console.log('2. En Railway SSH (railway ssh):');
    const allImgs = toAssign.flatMap(g => g.imgs);
    allImgs.forEach(img => {
      console.log(`   wget -q "https://raw.githubusercontent.com/Incap-mtm/incap_ecom/staging/media/products/${img.filename}" -O /app/media/products/${img.filename}`);
    });
  }

  await client.end();
}

main().catch(e => { console.error('\nERROR:', e.message, e.stack); process.exit(1); });
