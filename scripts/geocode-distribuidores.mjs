import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const jsonPath = join(__dirname, '../themes/industrial-glue/public/data/distribuidores.json');
const data = JSON.parse(readFileSync(jsonPath, 'utf8'));

async function geocode(direccion, ciudad, pais = 'Colombia') {
  const query = encodeURIComponent(`${direccion}, ${ciudad}, ${pais}`);
  const url = `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1&countrycodes=co`;
  const res = await fetch(url, {
    headers: { 'User-Agent': 'INCAP-Geocoder/1.0 (grupoincap.com.co)' }
  });
  const json = await res.json();
  if (json.length > 0) {
    return { lat: parseFloat(json[0].lat), lng: parseFloat(json[0].lon) };
  }
  // Fallback: solo ciudad
  const fallback = encodeURIComponent(`${ciudad}, ${pais}`);
  const url2 = `https://nominatim.openstreetmap.org/search?q=${fallback}&format=json&limit=1&countrycodes=co`;
  const res2 = await fetch(url2, { headers: { 'User-Agent': 'INCAP-Geocoder/1.0 (grupoincap.com.co)' } });
  const json2 = await res2.json();
  if (json2.length > 0) {
    return { lat: parseFloat(json2[0].lat), lng: parseFloat(json2[0].lon), fallback: true };
  }
  return null;
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

console.log(`Geocodificando ${data.length} distribuidores con OpenStreetMap...`);
let updated = 0;
let fallbacks = 0;
let failed = 0;

for (let i = 0; i < data.length; i++) {
  const d = data[i];
  process.stdout.write(`[${i + 1}/${data.length}] ${d.nombre.substring(0, 40)}... `);

  const coords = await geocode(d.direccion, d.ciudad);
  if (coords) {
    data[i].lat = coords.lat;
    data[i].lng = coords.lng;
    if (coords.fallback) {
      console.log(`~ ciudad ${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`);
      fallbacks++;
    } else {
      console.log(`✓ ${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`);
      updated++;
    }
  } else {
    console.log(`✗ sin resultado`);
    failed++;
  }

  // Nominatim requiere max 1 req/s
  await sleep(1100);
}

writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf8');
console.log(`\nListo: ${updated} exactos, ${fallbacks} por ciudad, ${failed} sin resultado.`);
console.log(`Archivo guardado: ${jsonPath}`);
