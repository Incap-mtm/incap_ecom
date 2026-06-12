/**
 * Siembra la instancia del widget `hero_slider` en la tabla `widget` con los
 * banners actuales del Hero. Idempotente: si ya existe un widget hero_slider,
 * NO lo sobrescribe (para no pisar ediciones hechas desde el admin).
 *
 * Uso local (contra DB de Railway):
 *   node scripts/seed-hero-widget.cjs
 * Uso en container Railway (CLAUDE.md → wget pattern):
 *   wget -q "https://raw.githubusercontent.com/.../scripts/seed-hero-widget.cjs" -O /tmp/s.cjs && node /tmp/s.cjs
 */
const { Client } = require('pg');

const connectionString =
  process.env.DATABASE_URL ||
  'postgresql://postgres:jWUghBxUtgsWrmvxzocrtxTeblOlnprU@switchyard.proxy.rlwy.net:33426/railway';

// Banners actuales del Hero (themes/industrial-glue/public/images/banners/Hero/).
// El cliente podrá reemplazarlos desde Admin → CMS → Widgets (suben a /media/).
// Orden de visualización: banner-05 primero (el último cargado), luego 01–04.
const slides = [
  {
    id: 'hero-05',
    deskImage: '/images/banners/Hero/banner-05-desk.webp',
    mobileImage: '/images/banners/Hero/banner-05-mobile.webp',
    alt: 'INCAP — Adhesivos industriales en presentaciones de canecas y galones'
  },
  {
    id: 'hero-01',
    deskImage: '/images/banners/Hero/banner-01-desk.webp',
    mobileImage: '/images/banners/Hero/banner-01-mobile.webp',
    alt: 'Adhesivos industriales INCAP — Calidad y respaldo técnico'
  },
  {
    id: 'hero-02',
    deskImage: '/images/banners/Hero/banner-02-desk.webp',
    mobileImage: '/images/banners/Hero/banner-02-mobile.webp',
    alt: 'Soluciones de pegado para la industria colombiana'
  },
  {
    id: 'hero-03',
    deskImage: '/images/banners/Hero/banner-03-desk.webp',
    mobileImage: '/images/banners/Hero/banner-03-mobile.webp',
    alt: 'INCAP — La química que construye país'
  },
  {
    id: 'hero-04',
    deskImage: '/images/banners/Hero/banner-04-desk.webp',
    mobileImage: '/images/banners/Hero/banner-04-mobile.webp',
    alt: 'Grupo INCAP — Fabricantes de adhesivos industriales'
  }
];

async function run() {
  const client = new Client({
    connectionString,
    ssl: connectionString.includes('rlwy.net') ? { rejectUnauthorized: false } : false
  });
  await client.connect();

  const existing = await client.query(
    `SELECT widget_id FROM widget WHERE type = 'hero_slider' LIMIT 1`
  );
  if (existing.rows.length) {
    console.log(`⏭  Ya existe un widget hero_slider (id ${existing.rows[0].widget_id}). No se sobrescribe.`);
    await client.end();
    return;
  }

  const settings = {
    slides, // cada slide ya trae su id estable (el render usa slide.id como key)
    autoplaySpeed: 8000
  };

  await client.query(
    `INSERT INTO widget (name, type, route, area, sort_order, settings, status)
     VALUES ($1, $2, $3::jsonb, $4::jsonb, $5, $6::jsonb, $7)`,
    [
      'Hero Home',
      'hero_slider',
      JSON.stringify(['homepage']),
      JSON.stringify(['content']),
      1,
      JSON.stringify(settings),
      true
    ]
  );

  console.log(`✓ Widget hero_slider creado con ${slides.length} slides (area=content, route=homepage, sort_order=1).`);
  await client.end();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
