/**
 * Elimina JPG/PNG de /app/media/products que tengan un .webp equivalente.
 * Solo borra si el .webp existe — nunca elimina sin respaldo.
 *
 * Uso en Railway SSH (base64):
 *   echo "BASE64" | base64 -d > /tmp/del.cjs && node /tmp/del.cjs
 */
'use strict';
const fs   = require('fs');
const path = require('path');

const DIR = '/app/media/products';

function walk(d) {
  if (!fs.existsSync(d)) { console.error('Not found:', d); return []; }
  return fs.readdirSync(d, { withFileTypes: true }).flatMap(e => {
    const full = path.join(d, e.name);
    return e.isDirectory() ? walk(full)
      : /\.(jpg|jpeg|png)$/i.test(e.name) ? [full] : [];
  });
}

const originals = walk(DIR);
console.log(`Found ${originals.length} original images`);

let deleted = 0, skipped = 0;
for (const img of originals) {
  const webp = img.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  if (fs.existsSync(webp)) {
    fs.unlinkSync(img);
    deleted++;
  } else {
    console.warn('No WebP for:', path.basename(img), '— skipping');
    skipped++;
  }
}
console.log(`Done: ${deleted} deleted, ${skipped} kept (no WebP pair)`);
