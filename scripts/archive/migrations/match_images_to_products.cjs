'use strict';
/**
 * match_images_to_products.cjs
 *
 * Auto-matchea carpetas de imágenes existentes a productos sin imagen.
 * Estructura asumida: /app/media/products/{Family}/{Family_Size}/*.jpg
 *
 * Uso:
 *   node match_images_to_products.cjs           # dry-run (muestra matches)
 *   node match_images_to_products.cjs --apply   # aplica los matches
 */
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const APPLY = process.argv.includes('--apply');
const ROOT = 'D:\\Dev AI\\GitHub\\glue-ecommerce\\media\\products';
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

function normalize(s) {
  return String(s).toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function listFolders(dir) {
  return fs.readdirSync(dir).filter(f => fs.statSync(path.join(dir, f)).isDirectory());
}

function listFiles(dir) {
  return fs.readdirSync(dir).filter(f => {
    const p = path.join(dir, f);
    return fs.statSync(p).isFile() && /\.(jpg|jpeg|png|webp)$/i.test(f);
  });
}

async function run() {
  // Build subfolder index: [{ family, sub, fullPath, normFamily, normSub, files }, ...]
  const subfolders = [];
  for (const fam of listFolders(ROOT)) {
    const famPath = path.join(ROOT, fam);
    const subs = listFolders(famPath);
    if (subs.length === 0) {
      // Imágenes directas en la carpeta family
      const files = listFiles(famPath);
      if (files.length > 0) {
        subfolders.push({ family: fam, sub: null, files, normFamily: normalize(fam), normSub: '' });
      }
    } else {
      for (const sub of subs) {
        const subPath = path.join(famPath, sub);
        const files = listFiles(subPath);
        if (files.length > 0) {
          subfolders.push({ family: fam, sub, files, normFamily: normalize(fam), normSub: normalize(sub) });
        }
      }
    }
  }
  console.log(`Subcarpetas con imágenes: ${subfolders.length}`);

  // Get products without images
  const client = await pool.connect();
  try {
    const { rows: products } = await client.query(`
      SELECT p.product_id, p.sku, pd.name
      FROM product p
      JOIN product_description pd ON p.product_id = pd.product_description_product_id
      WHERE p.product_id NOT IN (SELECT DISTINCT product_image_product_id FROM product_image)
      ORDER BY pd.name
    `);
    console.log(`Productos sin imagen: ${products.length}`);

    // Get subfolders already used by other products (to avoid double-assign)
    const { rows: used } = await client.query(`
      SELECT DISTINCT regexp_replace(origin_image, '/[^/]+$', '') AS dir
      FROM product_image WHERE origin_image LIKE '/assets/products/%'
    `);
    const usedDirs = new Set(used.map(r => r.dir));
    console.log(`Subcarpetas ya en uso: ${usedDirs.size}`);

    // Match
    const matches = [];
    const ambiguous = [];
    const unmatched = [];

    for (const prod of products) {
      const normName = normalize(prod.name);
      // Generate candidates: full name, name without trailing size, etc.
      const candidates = subfolders.map(sf => {
        // Score: how many of the product name's tokens are in family+sub
        const productTokens = normName.split('-').filter(Boolean);
        const folderTokens = (sf.normFamily + '-' + sf.normSub).split('-').filter(Boolean);
        const folderSet = new Set(folderTokens);
        let hits = 0;
        for (const t of productTokens) {
          if (folderSet.has(t)) hits++;
          // Also accept numeric variants like 750 vs 750cc
          else if (/^\d+$/.test(t)) {
            if (folderTokens.some(ft => ft.startsWith(t) || t.startsWith(ft))) hits++;
          }
        }
        // Penalize if folder has tokens not in product (less specific match)
        const ratio = hits / Math.max(productTokens.length, 1);
        const folderUrl = sf.sub
          ? `/assets/products/${sf.family}/${sf.sub}/`
          : `/assets/products/${sf.family}/`;
        return { sf, hits, ratio, folderUrl };
      }).filter(c => c.ratio > 0).sort((a, b) => b.ratio - a.ratio || b.hits - a.hits);

      const best = candidates[0];
      if (!best || best.ratio < 0.5) {
        unmatched.push({ prod, candidates: candidates.slice(0, 3) });
        continue;
      }

      // Skip if folder already used
      if (usedDirs.has(best.folderUrl.replace(/\/$/, ''))) {
        ambiguous.push({ prod, reason: 'folder already used', best });
        continue;
      }

      // Check second-best: if very close, mark ambiguous
      if (candidates[1] && candidates[1].ratio === best.ratio && candidates[1].hits === best.hits) {
        ambiguous.push({ prod, reason: 'tie', candidates: candidates.slice(0, 3) });
        continue;
      }

      matches.push({ prod, sf: best.sf, folderUrl: best.folderUrl });
    }

    console.log(`\n=== Matches (${matches.length}) ===`);
    matches.forEach(m => {
      console.log(`  ${m.prod.sku.padEnd(15)} "${m.prod.name}"`);
      console.log(`    → ${m.folderUrl} (${m.sf.files.length} archivos)`);
    });

    console.log(`\n=== Ambiguos (${ambiguous.length}) ===`);
    ambiguous.forEach(a => {
      console.log(`  ${a.prod.sku.padEnd(15)} "${a.prod.name}" - ${a.reason}`);
      if (a.candidates) a.candidates.forEach(c => console.log(`    ? ${c.folderUrl} (ratio=${c.ratio.toFixed(2)})`));
      if (a.best) console.log(`    ? ${a.best.folderUrl} (ya en uso)`);
    });

    console.log(`\n=== Sin match (${unmatched.length}) ===`);
    unmatched.forEach(u => {
      console.log(`  ${u.prod.sku.padEnd(15)} "${u.prod.name}"`);
      if (u.candidates.length) u.candidates.forEach(c => console.log(`    ? ${c.folderUrl} (ratio=${c.ratio.toFixed(2)})`));
    });

    if (!APPLY) {
      console.log('\n[DRY RUN] Para aplicar: node match_images_to_products.cjs --apply');
      return;
    }

    // Apply matches
    console.log('\n=== Aplicando ===');
    await client.query('BEGIN');
    let inserted = 0;
    for (const m of matches) {
      const sortedFiles = m.sf.files.sort();
      for (let i = 0; i < sortedFiles.length; i++) {
        const filename = sortedFiles[i];
        const url = m.folderUrl + filename;
        const isMain = i === 0;
        await client.query(
          `INSERT INTO product_image (product_image_product_id, origin_image, is_main) VALUES ($1::int, $2::varchar, $3::boolean)`,
          [m.prod.product_id, url, isMain]
        );
        inserted++;
      }
    }
    await client.query('COMMIT');
    console.log(`Total imágenes insertadas: ${inserted}`);
  } catch (e) {
    if (APPLY) await client.query('ROLLBACK').catch(() => {});
    throw e;
  } finally {
    client.release();
    await pool.end();
  }
}
run().catch(e => { console.error(e); process.exit(1); });
