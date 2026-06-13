import { pool } from '@evershop/evershop/lib/postgres';

const SITE_URL = 'https://www.grupoincap.com.co';

const STATIC_PAGES = [
  { loc: '/',                    priority: '1.0', changefreq: 'weekly'  },
  { loc: '/quienes-somos',       priority: '0.8', changefreq: 'monthly' },
  { loc: '/fabricantes',         priority: '0.7', changefreq: 'monthly' },
  { loc: '/distribuidores',      priority: '0.7', changefreq: 'monthly' },
  { loc: '/catalog',             priority: '0.9', changefreq: 'weekly'  },
  { loc: '/industrias/madera',   priority: '0.9', changefreq: 'weekly'  },
  { loc: '/industrias/colchones',priority: '0.9', changefreq: 'weekly'  },
  { loc: '/industrias/calzado',  priority: '0.9', changefreq: 'weekly'  },
  { loc: '/industrias/hogar',    priority: '0.9', changefreq: 'weekly'  },
  { loc: '/catalog/madera',      priority: '0.8', changefreq: 'weekly'  },
  { loc: '/catalog/colchones',   priority: '0.8', changefreq: 'weekly'  },
  { loc: '/catalog/calzado',     priority: '0.8', changefreq: 'weekly'  },
  { loc: '/catalog/multiusos',   priority: '0.8', changefreq: 'weekly'  },
];

function urlEntry({ loc, priority, changefreq }) {
  return `  <url>\n    <loc>${SITE_URL}${loc}</loc>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
}

export default async function sendSitemap(request, response) {
  try {
    const result = await pool.query(
      `SELECT p.uuid FROM product p WHERE p.status = true ORDER BY p.product_id`
    );

    const productEntries = result.rows.map(row =>
      urlEntry({ loc: `/product/${row.uuid}`, priority: '0.7', changefreq: 'weekly' })
    );

    const staticEntries = STATIC_PAGES.map(urlEntry);

    const xml = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      ...staticEntries,
      ...productEntries,
      '</urlset>',
    ].join('\n');

    response.setHeader('Content-Type', 'application/xml; charset=utf-8');
    response.setHeader('Cache-Control', 'public, max-age=3600');
    response.end(xml);
  } catch (err) {
    response.status(500).end('Sitemap error');
  }
}
