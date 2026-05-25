import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const jsonPath = join(__dirname, '../themes/industrial-glue/public/data/distribuidores.json');
const data = JSON.parse(readFileSync(jsonPath, 'utf8'));

const API_KEY = process.env.GOOGLE_MAPS_API_KEY || 'AIzaSyBgAPlNxa43i6XQNlUz_AfwEBC104y0pns';

async function geocode(direccion, ciudad, pais = 'Colombia') {
  const query = encodeURIComponent(`${direccion}, ${ciudad}, ${pais}`);
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${query}&key=${API_KEY}&region=co&language=es`;
  const res = await fetch(url);
  const json = await res.json();

  if (json.status === 'OK' && json.results.length > 0) {
    const { lat, lng } = json.results[0].geometry.location;
    return { lat, lng };
  }

  // Fallback: solo ciudad
  const fallback = encodeURIComponent(`${ciudad}, ${pais}`);
  const url2 = `https://maps.googleapis.com/maps/api/geocode/json?address=${fallback}&key=${API_KEY}&region=co&language=es`;
  const res2 = await fetch(url2);
  const json2 = await res2.json();

  if (json2.status === 'OK' && json2.results.length > 0) {
    const { lat, lng } = json2.results[0].geometry.location;
    return { lat, lng, fallback: true };
  }

  return null;
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

console.log(`Geocodificando ${data.length} distribuidores con Google Maps API...`);
let exact = 0;
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
      exact++;
    }
  } else {
    console.log(`✗ sin resultado`);
    failed++;
  }

  // Pequeña pausa para no saturar la API
  await sleep(100);
}

writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf8');
console.log(`\nListo: ${exact} exactos, ${fallbacks} por ciudad, ${failed} sin resultado.`);
console.log(`Archivo guardado: ${jsonPath}`);
