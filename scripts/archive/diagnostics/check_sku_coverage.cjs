'use strict';
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const CALZADO = ['AB-', 'EM-', 'MA-', 'AC-', 'AU-A1-', 'AU-A7-', 'AU-BP-', 'AU-H3-', 'AU-HB-', 'AU-LV-', 'AU-PG-', 'AU-SZ-', 'CO-FL-', 'CO-IT-', 'CO-MB-', 'CO-MF-', 'CO-MG-', 'CO-MN-', 'CO-MT-', 'CO-SP-', 'CO-CZ-', 'CO-IF-'];
const COLCHONES = ['IN-', 'IS-'];
const MADERA = ['LA-', 'PV-', 'CO-PC-', 'CO-PI-'];
const MULTIUSOS = ['AU-PE-', 'AU-RM-', 'AU-VU-', 'CO-PR-', 'CO-SO-', 'CO-AN-', 'CO-CR-', 'CO-SL-'];

function categorize(sku) {
  if (!sku) return null;
  if (CALZADO.some(p => sku.startsWith(p))) return 'calzado';
  if (COLCHONES.some(p => sku.startsWith(p))) return 'colchones';
  if (MADERA.some(p => sku.startsWith(p))) return 'madera';
  if (MULTIUSOS.some(p => sku.startsWith(p))) return 'multiusos';
  return 'NO_MATCH';
}

async function run() {
  const client = await pool.connect();
  try {
    const { rows } = await client.query(`SELECT p.sku, pd.name FROM product p JOIN product_description pd ON p.product_id = pd.product_description_product_id ORDER BY p.sku`);
    const buckets = { calzado: 0, colchones: 0, madera: 0, multiusos: 0, NO_MATCH: [] };
    const prefixes = {};
    for (const r of rows) {
      const cat = categorize(r.sku);
      if (cat === 'NO_MATCH') {
        buckets.NO_MATCH.push({ sku: r.sku, name: r.name });
      } else {
        buckets[cat]++;
      }
      // Track all 2-letter and 5-letter prefixes
      const p2 = r.sku.slice(0, 3);
      const p5 = r.sku.slice(0, 6);
      prefixes[p2] = (prefixes[p2] || 0) + 1;
    }
    console.log('Total productos:', rows.length);
    console.log('Calzado:',   buckets.calzado);
    console.log('Colchones:', buckets.colchones);
    console.log('Madera:',    buckets.madera);
    console.log('Multiusos:', buckets.multiusos);
    console.log('\nSIN MATCH (' + buckets.NO_MATCH.length + '):');
    buckets.NO_MATCH.forEach(p => console.log('  ' + p.sku.padEnd(15) + ' - ' + p.name));
    console.log('\nTodos los prefixes (3 chars):');
    Object.keys(prefixes).sort().forEach(p => console.log('  ' + p.padEnd(6) + ' : ' + prefixes[p]));
  } finally {
    client.release();
    await pool.end();
  }
}
run().catch(e => { console.error(e.message); process.exit(1); });
