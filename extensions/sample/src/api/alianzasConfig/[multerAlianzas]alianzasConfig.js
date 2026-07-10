import path from 'path';
import fs from 'fs';
import sharp from 'sharp';
import { CONSTANTS } from '@evershop/evershop/lib/helpers';
import { pool } from '@evershop/evershop/lib/postgres';
import { refreshSetting } from '@evershop/evershop/setting/services';

/**
 * Guarda la sección "Alianzas que construyen país" de Quiénes Somos dentro del
 * setting JSON `quienes_somos` (mismo setting que alimenta toda la página).
 *
 * Campos editables desde el admin:
 *   - alianzas.titulo    → título de la sección
 *   - alianzas.intro     → párrafo introductorio
 *   - alianzas.ciudades  → array de nombres de ciudad (pastillas)
 *   - alianzas.mapa      → URL de la imagen de la derecha (opcional)
 *
 * La imagen, si se sube, se convierte a WebP con sharp y se guarda en el
 * volumen de media:
 *   Disco: <MEDIAPATH>/quienes-somos/mapa-alianzas-<ts>.webp
 *   URL:   /assets/quienes-somos/mapa-alianzas-<ts>.webp  (static.js mapea /assets → MEDIAPATH)
 *
 * El setting se persiste con is_json = true (igual que el seed) y el resolver
 * `Query.setting` lo lee fresh del DB, así que el frontstore refleja sin restart.
 */
const MAX_WIDTH = 1400;
const MAX_CIUDADES = 60;
const MAX_LEN_CIUDAD = 40;

async function upsertJsonSetting(name, value) {
  await pool.query(
    `INSERT INTO setting (name, value, is_json)
     VALUES ($1, $2, true)
     ON CONFLICT (name) DO UPDATE SET value = EXCLUDED.value, is_json = true`,
    [name, value],
  );
}

export default async function alianzasConfig(request, response) {
  const admin =
    typeof request.getCurrentUser === 'function' ? request.getCurrentUser() : null;
  if (!admin) {
    return response.status(401).json({ success: false, error: 'No autorizado' });
  }

  try {
    // --- Ciudades (JSON array de strings) ---
    let ciudades = [];
    try {
      const parsed = JSON.parse(request.body?.ciudades ?? '[]');
      if (Array.isArray(parsed)) ciudades = parsed;
    } catch {
      return response.status(400).json({ success: false, error: 'Lista de ciudades inválida.' });
    }
    ciudades = ciudades
      .map((c) => (typeof c === 'string' ? c.trim() : ''))
      .filter(Boolean)
      .map((c) => c.slice(0, MAX_LEN_CIUDAD))
      .slice(0, MAX_CIUDADES);

    const titulo = (request.body?.titulo ?? '').toString().trim().slice(0, 120);
    const intro = (request.body?.intro ?? '').toString().trim().slice(0, 800);

    // --- Contenido actual del setting quienes_somos ---
    const { rows } = await pool.query(
      `SELECT value FROM setting WHERE name = 'quienes_somos' LIMIT 1`,
    );
    let content = {};
    if (rows[0]?.value) {
      try { content = JSON.parse(rows[0].value); } catch { content = {}; }
    }
    if (!content || typeof content !== 'object') content = {};
    const alianzas = (content.alianzas && typeof content.alianzas === 'object')
      ? content.alianzas
      : {};

    // --- Imagen del mapa (opcional) ---
    let mapaUrl = alianzas.mapa || '';
    const file = request.file;
    if (file) {
      const dir = path.join(CONSTANTS.MEDIAPATH, 'quienes-somos');
      fs.mkdirSync(dir, { recursive: true });
      const ts = Date.now();
      const fileName = `mapa-alianzas-${ts}.webp`;
      await sharp(file.buffer)
        .resize({ width: MAX_WIDTH, withoutEnlargement: true })
        .webp({ quality: 82 })
        .toFile(path.join(dir, fileName));
      mapaUrl = `/assets/quienes-somos/${fileName}`;
    }

    // --- Merge y persistencia ---
    content.alianzas = {
      ...alianzas,
      titulo: titulo || alianzas.titulo || 'Alianzas que construyen país',
      intro: intro || alianzas.intro || '',
      ciudades,
      mapa: mapaUrl,
    };

    await upsertJsonSetting('quienes_somos', JSON.stringify(content));
    await refreshSetting();

    return response.json({ success: true, alianzas: content.alianzas });
  } catch (err) {
    console.error('[AlianzasConfig] Error:', err.message);
    return response.status(500).json({ success: false, error: err.message });
  }
}
