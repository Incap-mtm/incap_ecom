import { pool } from '@evershop/evershop/lib/postgres';
import { getSetting } from '@evershop/evershop/setting/services';

/**
 * Sitemap dinámico servido en la URL canónica `/sitemap.xml` (raíz del sitio).
 *
 * Va como ruta frontStore (NO en `src/api/`) a propósito: las rutas bajo `api/`
 * reciben el prefijo `/api` → quedaban en `/api/sitemap.xml`, que robots.txt
 * bloquea con `Disallow: /api/`. Como ruta frontStore se sirve en `/sitemap.xml`.
 *
 * Patrón: middleware que responde y NO llama `next()` → corta el pipeline antes
 * del render de React (mismo patrón que el core usa en cms/.../images/images.js).
 *
 * URLs: usa las canónicas limpias desde `url_rewrite` (ej. `/calzado/maxon-…`),
 * no `/product/<uuid>`, para que el sitemap liste exactamente las URLs indexables.
 */

const SITE_URL = 'https://www.grupoincap.com.co';

// Páginas estáticas / custom (no están en url_rewrite). Todas verificadas 200.
const STATIC_PAGES = [
  { loc: '/',                     priority: '1.0', changefreq: 'weekly'  },
  { loc: '/quienes-somos',        priority: '0.8', changefreq: 'monthly' },
  { loc: '/fabricantes',          priority: '0.7', changefreq: 'monthly' },
  { loc: '/distribuidores',       priority: '0.7', changefreq: 'monthly' },
  { loc: '/catalog',              priority: '0.9', changefreq: 'weekly'  },
  { loc: '/industrias/madera',    priority: '0.9', changefreq: 'weekly'  },
  { loc: '/industrias/colchones', priority: '0.9', changefreq: 'weekly'  },
  { loc: '/industrias/calzado',   priority: '0.9', changefreq: 'weekly'  },
  { loc: '/industrias/hogar',     priority: '0.9', changefreq: 'weekly'  },
  { loc: '/blog',                 priority: '0.8', changefreq: 'weekly'  }
];

const escapeXml = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

function urlEntry({ loc, priority, changefreq }) {
  return `  <url>\n    <loc>${SITE_URL}${escapeXml(loc)}</loc>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
}

export default async function sendSitemap(request, response, next) {
  try {
    // Agregar URLs de posts del blog desde el setting blog_index
    const blogRaw = await getSetting('blog_index', '{}').catch(() => '{}');
    let blogEntries = [];
    try {
      const blogData = JSON.parse(blogRaw);
      if (Array.isArray(blogData.posts)) {
        blogEntries = blogData.posts.map((post) =>
          urlEntry({ loc: `/blog/${post.slug}`, priority: '0.7', changefreq: 'monthly' })
        );
      }
    } catch {}

    // URLs canónicas limpias: categorías (4) + productos activos (322).
    const { rows } = await pool.query(
      `SELECT DISTINCT ur.request_path, ur.entity_type
         FROM url_rewrite ur
         LEFT JOIN product p
           ON p.uuid = ur.entity_uuid AND ur.entity_type = 'product'
        WHERE ur.entity_type = 'category'
           OR (ur.entity_type = 'product' AND p.status = true)
        ORDER BY ur.request_path`
    );

    const dbEntries = rows.map((row) =>
      urlEntry({
        loc: row.request_path,
        priority: row.entity_type === 'category' ? '0.8' : '0.7',
        changefreq: 'weekly'
      })
    );

    const xml = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      ...STATIC_PAGES.map(urlEntry),
      ...blogEntries,
      ...dbEntries,
      '</urlset>'
    ].join('\n');

    response.setHeader('Content-Type', 'application/xml; charset=utf-8');
    response.setHeader('Cache-Control', 'public, max-age=3600');
    response.end(xml);
  } catch (err) {
    response.status(500).end('Sitemap error');
  }
}
