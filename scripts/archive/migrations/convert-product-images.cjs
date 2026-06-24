/**
 * Convierte imágenes de productos (JPG/PNG) a WebP en el volumen de Railway.
 *
 * Uso en Railway SSH:
 *   wget -q "https://raw.githubusercontent.com/Incap-mtm/incap_ecom/main/scripts/convert-product-images.cjs" -O /tmp/conv.cjs && node /tmp/conv.cjs
 *
 * Requisito: ffmpeg disponible en el container (instalar si no: apk add ffmpeg)
 */
'use strict';
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const MEDIA_DIR = '/app/media/products';
const QUALITY   = 82;

function walk(dir) {
  if (!fs.existsSync(dir)) { console.error('Directorio no encontrado:', dir); return []; }
  const result = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) result.push(...walk(full));
    else if (/\.(jpg|jpeg|png)$/i.test(entry.name)) result.push(full);
  }
  return result;
}

const files = walk(MEDIA_DIR);
console.log(`Encontradas ${files.length} imágenes`);

let ok = 0, skip = 0, fail = 0;
for (const input of files) {
  const output = input.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  if (fs.existsSync(output)) { skip++; continue; }
  try {
    execSync(`ffmpeg -i "${input}" -c:v libwebp -quality ${QUALITY} -y "${output}"`, { stdio: 'pipe' });
    ok++;
    if (ok % 50 === 0) console.log(`  ${ok + skip}/${files.length} procesadas...`);
  } catch {
    console.error(`❌ ${path.basename(input)}`);
    fail++;
  }
}
console.log(`\nListo: ${ok} convertidas, ${skip} ya existían, ${fail} errores`);
console.log('Nota: las URLs en DB siguen apuntando a .jpg/.png.');
console.log('El middleware de serving WebP (cuando esté activo) servirá .webp automáticamente.');
