'use strict';
/**
 * test_sku_encoder.cjs — dev-only, NO se despliega.
 *
 * Conecta a la DB de prod, trae los 322 productos con SKU,
 * corre encodeSizeToken sobre la presentación de cada uno
 * y compara el token generado vs el segmento real [2] del SKU.
 *
 * Uso:
 *   node scripts/test_sku_encoder.cjs
 * (requiere DATABASE_URL o usa la connection string pública del CLAUDE.md)
 */

const { Pool } = require('pg');

const DB_URL = process.env.DATABASE_URL;

const pool = new Pool({ connectionString: DB_URL });

// ---------------------------------------------------------------------------
// Copia inline de encodeSizeToken (ESM → CJS workaround; fuente canónica en
// extensions/sample/src/api/suggestSku/encodeSize.js)
// ---------------------------------------------------------------------------
function encodeSizeToken(presentation) {
  if (!presentation || !presentation.trim()) {
    return { token: null, confident: false };
  }

  const s = presentation.trim().replace(',', '.');
  const match = s.match(/^([\d.]+)\s*([A-Za-záéíóúüñÁÉÍÓÚÜÑ]+)/i);
  if (!match) {
    return { token: null, confident: false };
  }

  const num = parseFloat(match[1]);
  const unit = match[2].toLowerCase();

  if (isNaN(num)) {
    return { token: null, confident: false };
  }

  const pad3 = (n) => String(Math.round(n)).padStart(3, '0');

  // cc / ml / cm3
  if (unit === 'cc' || unit === 'ml' || unit === 'cm3') {
    if (num < 1000) {
      return { token: pad3(num), confident: true };
    }
    const liters = num / 1000;
    if (Number.isInteger(liters)) {
      return { token: pad3(liters), confident: true };
    }
    return { token: pad3(Math.round(liters * 10)), confident: true };
  }

  // kg
  if (unit === 'kg') {
    return { token: pad3(num), confident: true };
  }

  // gr / g
  if (unit === 'gr' || unit === 'g') {
    return { token: pad3(num), confident: true };
  }

  // L (litros directos)
  if (unit === 'l') {
    if (Number.isInteger(num)) {
      return { token: pad3(num), confident: true };
    }
    return { token: pad3(Math.round(num * 10)), confident: true };
  }

  // Gal / galón / galon
  if (unit === 'gal' || unit === 'galón' || unit === 'galon') {
    const hasDecimal = !Number.isInteger(num);
    const token = pad3(Math.round(num * 10));
    return { token, confident: !hasDecimal };
  }

  return { token: null, confident: false };
}
// ---------------------------------------------------------------------------

// Derivar presentación (misma lógica que family.ts getPresentation)
function getPresentation(name) {
  if (!name) return '';
  const idx = name.lastIndexOf(' - ');
  return idx === -1 ? '' : name.substring(idx + 3).trim();
}

async function run() {
  const client = await pool.connect();
  try {
    const { rows } = await client.query(
      `SELECT p.sku, d.name
       FROM product p
       JOIN product_description d ON d.product_description_product_id = p.product_id
       WHERE p.sku IS NOT NULL AND p.sku <> ''
       ORDER BY p.sku`
    );

    console.log(`\nTotal productos con SKU: ${rows.length}\n`);

    let matches = 0;
    let noMatch = 0;
    let noUnit = 0;     // no hubo presentación o unidad no reconocida
    let notConfident = 0;

    const failList = [];
    const noUnitList = [];

    for (const row of rows) {
      const { sku, name } = row;
      const segments = sku.split('-');

      if (segments.length < 3) {
        // SKU con menos de 3 segmentos: no hay token de tamaño que comparar
        noUnitList.push({ sku, name, reason: 'SKU < 3 segmentos' });
        noUnit++;
        continue;
      }

      const realToken = segments[2]; // el segmento [2] es el token de tamaño real
      const presentation = getPresentation(name);

      if (!presentation) {
        noUnitList.push({ sku, name, reason: 'Sin presentación en el nombre' });
        noUnit++;
        continue;
      }

      const { token, confident } = encodeSizeToken(presentation);

      if (!token) {
        noUnitList.push({ sku, name, presentation, reason: 'Unidad no reconocida' });
        noUnit++;
        continue;
      }

      if (!confident) {
        notConfident++;
      }

      if (token === realToken) {
        matches++;
      } else {
        noMatch++;
        failList.push({ sku, name, presentation, realToken, generatedToken: token, confident });
      }
    }

    const comparable = rows.length - noUnit;
    const pct = comparable > 0 ? ((matches / comparable) * 100).toFixed(1) : 'N/A';

    console.log('='.repeat(70));
    console.log(`RESULTADOS ENCODER`);
    console.log('='.repeat(70));
    console.log(`Total SKU analizados  : ${rows.length}`);
    console.log(`Sin segmento token    : ${noUnit}  (excluidos de la tasa)`);
    console.log(`Comparables           : ${comparable}`);
    console.log(`  Match exacto        : ${matches}  (${pct}%)`);
    console.log(`  No match            : ${noMatch}`);
    console.log(`  No confident (Gal?) : ${notConfident}  (incluidos en match si el token era correcto)`);
    console.log('');

    if (failList.length > 0) {
      console.log(`NO-MATCH (${failList.length}):`);
      console.log('-'.repeat(70));
      for (const f of failList) {
        const conf = f.confident ? '' : ' [!confident]';
        console.log(
          `  SKU: ${f.sku.padEnd(14)} | Pres: "${f.presentation.padEnd(10)}" ` +
          `| Real: ${f.realToken} | Gen: ${f.generatedToken}${conf}`
        );
        console.log(`    Nombre: ${f.name}`);
      }
      console.log('');
    }

    if (noUnitList.length > 0) {
      console.log(`SIN UNIDAD RECONOCIDA / SIN SEGMENTO (${noUnitList.length}):`);
      console.log('-'.repeat(70));
      for (const f of noUnitList) {
        console.log(`  SKU: ${f.sku.padEnd(14)} | ${f.reason}${f.presentation ? ` | Pres: "${f.presentation}"` : ''}`);
      }
    }

  } finally {
    client.release();
    await pool.end();
  }
}

run().catch(e => {
  console.error('[test_sku_encoder] Error:', e.message);
  process.exit(1);
});
