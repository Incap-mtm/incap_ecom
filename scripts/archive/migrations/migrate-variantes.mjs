/**
 * migrate-variantes.mjs
 * Paso 1: Normaliza nombres de tamaño en product_description.name
 * Paso 2: Agrupa productos por familia en variant_groups de EverShop
 *
 * Uso:
 *   node scripts/migrate-variantes.mjs --dry-run   (solo muestra qué haría)
 *   node scripts/migrate-variantes.mjs             (ejecuta en DB)
 */
import pg from 'pg';
import crypto from 'crypto';

const { Client } = pg;
const DB_URL = process.env.DATABASE_URL;

const DRY_RUN = process.argv.includes('--dry-run');
const SIZE_ATTRIBUTE_ID = 2;
const ATTRIBUTE_GROUP_ID = 1;

// ──────────────────────────────────────────────
// Normalización de tamaños
// ──────────────────────────────────────────────
function normalizeSize(raw) {
  let s = raw.trim();
  s = s.replace(/(\d),(\d)/g, '$1.$2');                    // 4,5 → 4.5
  s = s.replace(/^(\d+\.?\d*)\s*[Gg]al$/i, '$1 Gal');     // N[.N]gal → N[.N] Gal
  if (/^\d+$/.test(s)) s = s + 'cc';                       // entero puro → añadir cc
  s = s.replace(/([0-9])Kg$/, '$1kg');                     // 30Kg → 30kg
  return s;
}

function getFamily(name) {
  const idx = name.lastIndexOf(' - ');
  return idx === -1 ? null : name.substring(0, idx).trim();
}

function getSize(name) {
  const idx = name.lastIndexOf(' - ');
  return idx === -1 ? null : name.substring(idx + 3).trim();
}

// ──────────────────────────────────────────────
// Main
// ──────────────────────────────────────────────
async function main() {
  const client = new Client({ connectionString: DB_URL, ssl: { rejectUnauthorized: false } });
  await client.connect();
  console.log(`Modo: ${DRY_RUN ? 'DRY-RUN (sin cambios en DB)' : 'EJECUCIÓN REAL'}\n`);

  // Leer todos los productos activos con nombre
  const { rows: products } = await client.query(`
    SELECT p.product_id, p.sku, p.variant_group_id, pd.product_description_id, pd.name
    FROM product p
    JOIN product_description pd ON pd.product_description_product_id = p.product_id
    WHERE p.status = true
    ORDER BY p.product_id
  `);
  console.log(`Productos activos: ${products.length}\n`);

  // ── PASO 1: Normalizar tamaños ──
  console.log('═══ PASO 1: Normalización de tamaños ═══');
  const toRename = [];
  for (const p of products) {
    const rawSize = getSize(p.name);
    if (!rawSize) continue;
    const normSize = normalizeSize(rawSize);
    if (normSize !== rawSize) {
      const family = getFamily(p.name);
      const newName = `${family} - ${normSize}`;
      toRename.push({ product_id: p.product_id, sku: p.sku, oldName: p.name, newName, product_description_id: p.product_description_id });
    }
  }

  console.log(`Productos con nombre a normalizar: ${toRename.length}`);
  for (const r of toRename) {
    console.log(`  ${r.sku}: "${r.oldName}" → "${r.newName}"`);
  }

  if (!DRY_RUN) {
    for (const r of toRename) {
      await client.query(
        'UPDATE product_description SET name = $1 WHERE product_description_id = $2',
        [r.newName, r.product_description_id]
      );
      // Actualizar el campo en memoria para el paso 2
      const prod = products.find(p => p.product_id === r.product_id);
      if (prod) prod.name = r.newName;
    }
    console.log(`\n${toRename.length} nombres actualizados en DB.`);
  }

  // ── PASO 2: Variant groups ──
  console.log('\n═══ PASO 2: Creación de variant groups ═══');

  const families = new Map();
  let sinFamilia = 0;
  for (const p of products) {
    const family = getFamily(p.name);
    if (!family) { sinFamilia++; continue; }
    const rawSize = getSize(p.name);
    const size = DRY_RUN ? normalizeSize(rawSize) : rawSize; // en real ya están normalizados
    if (!families.has(family)) families.set(family, []);
    families.get(family).push({ ...p, size });
  }

  const toMigrate = [...families.entries()].filter(([, ps]) => ps.length >= 2);
  const singles   = [...families.entries()].filter(([, ps]) => ps.length === 1);
  const alreadyDone = toMigrate.filter(([, ps]) => ps.some(p => p.variant_group_id !== null));

  console.log(`Familias con 2+ variantes: ${toMigrate.length}`);
  console.log(`Familias de 1 sola variante (sin grupo): ${singles.length}`);
  console.log(`Sin " - " en el nombre: ${sinFamilia}`);
  console.log(`Ya migradas (skip): ${alreadyDone.length}`);

  if (DRY_RUN) {
    const sizesNeeded = new Set();
    for (const [, ps] of toMigrate) ps.forEach(p => sizesNeeded.add(p.size));
    console.log(`\nTamaños únicos (post-normalización): ${sizesNeeded.size}`);
    console.log([...sizesNeeded].sort().join(', '));
    console.log('\n--- PREVIEW (primeras 15 familias) ---');
    for (const [family, ps] of toMigrate.slice(0, 15)) {
      console.log(`  ${family}`);
      ps.forEach(p => console.log(`    SKU:${p.sku}  tamaño:"${p.size}"`));
    }
    if (toMigrate.length > 15) console.log(`  ... y ${toMigrate.length - 15} familias más`);
    console.log('\nEjecuta sin --dry-run para aplicar los cambios.');
    await client.end();
    return;
  }

  // Obtener/crear opciones de tamaño
  const { rows: existingOpts } = await client.query(
    'SELECT attribute_option_id, option_text FROM attribute_option WHERE attribute_id = $1',
    [SIZE_ATTRIBUTE_ID]
  );
  const optionMap = new Map(existingOpts.map(o => [o.option_text, o.attribute_option_id]));

  // Recopilar todos los tamaños necesarios y crearlos
  const sizesNeeded = new Set();
  for (const [, ps] of toMigrate) ps.forEach(p => sizesNeeded.add(p.size));

  let optionsCreated = 0;
  for (const size of sizesNeeded) {
    if (!optionMap.has(size)) {
      const { rows: [opt] } = await client.query(
        `INSERT INTO attribute_option (uuid, attribute_id, attribute_code, option_text)
         VALUES ($1, $2, 'size', $3) RETURNING attribute_option_id`,
        [crypto.randomUUID(), SIZE_ATTRIBUTE_ID, size]
      );
      optionMap.set(size, opt.attribute_option_id);
      optionsCreated++;
    }
  }
  console.log(`\nOpciones de tamaño creadas: ${optionsCreated}`);

  // Crear variant_groups y vincular productos
  let groupsCreated = 0;
  let productsUpdated = 0;
  let paviInserted = 0;
  let skipped = 0;

  for (const [family, ps] of toMigrate) {
    // Determinar si la familia ya tiene un grupo asignado
    const existingGroupId = ps.find(p => p.variant_group_id !== null)?.variant_group_id ?? null;
    const newProducts = ps.filter(p => p.variant_group_id === null);

    if (existingGroupId !== null && newProducts.length === 0) {
      // Todos ya migrados — skip real
      skipped++;
      continue;
    }

    let variantGroupId;
    if (existingGroupId !== null) {
      // Familia ya existe — solo agregar los productos nuevos
      variantGroupId = existingGroupId;
      process.stdout.write(`  ↑ ${family}: agregando ${newProducts.length} variante(s) al grupo existente\n`);
    } else {
      // Familia nueva — crear el grupo
      const { rows: [vg] } = await client.query(
        `INSERT INTO variant_group (uuid, attribute_group_id, attribute_one, visibility)
         VALUES ($1, $2, $3, false) RETURNING variant_group_id`,
        [crypto.randomUUID(), ATTRIBUTE_GROUP_ID, SIZE_ATTRIBUTE_ID]
      );
      variantGroupId = vg.variant_group_id;
      groupsCreated++;
      process.stdout.write(`  ✓ ${family} (${ps.length} variantes)\n`);
    }

    for (const p of newProducts) {
      const optionId = optionMap.get(p.size);

      await client.query(
        'UPDATE product SET variant_group_id = $1 WHERE product_id = $2',
        [variantGroupId, p.product_id]
      );
      productsUpdated++;

      await client.query(
        'DELETE FROM product_attribute_value_index WHERE product_id = $1 AND attribute_id = $2',
        [p.product_id, SIZE_ATTRIBUTE_ID]
      );
      await client.query(
        `INSERT INTO product_attribute_value_index (product_id, attribute_id, option_id, option_text)
         VALUES ($1, $2, $3, $4)`,
        [p.product_id, SIZE_ATTRIBUTE_ID, optionId, p.size]
      );
      paviInserted++;
    }
  }

  console.log('\n═══ RESULTADO FINAL ═══');
  console.log(`Nombres normalizados: ${toRename.length}`);
  console.log(`Variant groups creados: ${groupsCreated}`);
  console.log(`Opciones de tamaño nuevas: ${optionsCreated}`);
  console.log(`Productos actualizados: ${productsUpdated}`);
  console.log(`PAVI insertados: ${paviInserted}`);
  console.log(`Familias ya migradas (skip): ${skipped}`);

  await client.end();
}

main().catch(e => { console.error('\nERROR:', e.message, e.stack); process.exit(1); });
