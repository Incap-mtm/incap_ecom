'use strict';
const fs = require('fs');
const path = require('path');

const ACCENTS = {'á':'a','é':'e','í':'i','ó':'o','ú':'u','Á':'A','É':'E','Í':'I','Ó':'O','Ú':'U','ü':'u','Ü':'U','ñ':'n','Ñ':'N',' ':'-'};

function clean(s) {
  return s.split('').map(c => ACCENTS[c] || c).join('');
}

function renameAll(dir) {
  fs.readdirSync(dir).forEach(f => {
    const fp = path.join(dir, f);
    const nn = clean(f);
    const np = path.join(dir, nn);
    if (f !== nn) fs.renameSync(fp, np);
    if (fs.statSync(np).isDirectory()) renameAll(np);
  });
}

function copyAll(src, dst) {
  fs.readdirSync(src).forEach(f => {
    const sp = path.join(src, f);
    const dp = path.join(dst, f);
    if (fs.statSync(sp).isDirectory()) {
      fs.mkdirSync(dp, { recursive: true });
      copyAll(sp, dp);
    } else {
      fs.copyFileSync(sp, dp);
    }
  });
}

const SRC = '/tmp/extract/Incap-main/media/products';
const DST = '/app/media/products';

console.log('Renombrando...');
renameAll(SRC);
console.log('Copiando a volumen...');
copyAll(SRC, DST);
console.log('Archivos copiados:', require('child_process').execSync('find ' + DST + ' -type f | wc -l').toString().trim());
