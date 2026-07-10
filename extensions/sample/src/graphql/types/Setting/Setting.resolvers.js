import { pool } from '@evershop/evershop/lib/postgres';
import { getSetting } from '@evershop/evershop/setting/services';
import { getProductsBaseQuery } from '@evershop/evershop/catalog/services';
import { camelCase } from '@evershop/evershop/lib/util/camelCase';
import { parseBlogIndex } from '../../../components/blogData.js';

const SIZE_ATTRIBUTE_ID = 2;
const FEATURED_LIMIT = 10;
const HOME_BLOG_LIMIT = 3;

const findSetting = (setting, name, fallback = '') =>
  (setting.find((item) => item.name === name) || {}).value || fallback;

export default {
  Setting: {
    storeWhatsappNumber: (setting) => findSetting(setting, 'storeWhatsappNumber', '573002171521'),
    googleMapsKey: () => process.env.GOOGLE_MAPS_API_KEY || '',
    storeInstagram: (setting) => findSetting(setting, 'storeInstagram'),
    storeFacebook:  (setting) => findSetting(setting, 'storeFacebook'),
    storeLinkedin:  (setting) => findSetting(setting, 'storeLinkedin'),
    storeTiktok:    (setting) => findSetting(setting, 'storeTiktok'),
    storeYoutube:   (setting) => findSetting(setting, 'storeYoutube'),
    variantSizeOrder: (setting) => findSetting(setting, 'variant_size_order', '[]'),
    quienesSomos: (setting) => findSetting(setting, 'quienes_somos', '{}'),
    blogIndex: (setting) => findSetting(setting, 'blog_index', '{}'),
    catalogUrl: (setting) => findSetting(setting, 'catalog_url', '/assets/catalogo-incap.pdf'),
    catalogButtonText: (setting) => findSetting(setting, 'catalog_button_text', 'Descargar Catálogo'),
    leadEmails: (setting) => findSetting(setting, 'lead_emails', ''),
    featuredProducts: (setting) => findSetting(setting, 'featured_products', '[]'),
    familyCovers: (setting) => findSetting(setting, 'family_covers', '{}'),
  },
  Query: {
    sizeOptions: async (_, __, { pool: ctxPool }) => {
      const p = ctxPool || pool;
      const { rows } = await p.query(
        `SELECT attribute_option_id AS id, option_text AS text
         FROM attribute_option
         WHERE attribute_id = $1
         ORDER BY attribute_option_id ASC`,
        [SIZE_ATTRIBUTE_ID]
      );
      return rows;
    },

    /**
     * Productos destacados curados por el admin (setting `featured_products` =
     * array JSON de uuids). Devuelve objetos Product completos, en el mismo
     * orden elegido, solo activos y visibles. Máximo FEATURED_LIMIT.
     */
    featuredProductsSelected: async (_, __, { pool: ctxPool }) => {
      const p = ctxPool || pool;
      let uuids = [];
      try {
        const raw = await getSetting('featured_products', '[]');
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) uuids = parsed.filter((u) => typeof u === 'string');
      } catch {
        uuids = [];
      }
      if (uuids.length === 0) return [];
      const capped = uuids.slice(0, FEATURED_LIMIT);

      const query = getProductsBaseQuery();
      query.where('product.uuid', 'IN', capped);
      query.andWhere('product.status', '=', true);
      query.andWhere('product.visibility', '=', true);
      const rows = await query.execute(p);

      // Preservar el orden elegido por el admin
      const byUuid = new Map(rows.map((r) => [r.uuid, camelCase(r)]));
      return capped.map((u) => byUuid.get(u)).filter(Boolean);
    },

    /**
     * Últimos posts del blog para la sección del home. Misma fuente que /blog:
     * setting `blog_index` con fallback a DEFAULT_BLOG (parseBlogIndex) → funciona
     * aunque el setting no esté sembrado. Devuelve los más recientes por fecha.
     */
    homeBlogPosts: async (_, { limit }) => {
      const raw = await getSetting('blog_index', '');
      const data = parseBlogIndex(raw);
      const posts = Array.isArray(data?.posts) ? data.posts : [];
      const n = Number.isInteger(limit) && limit > 0 ? limit : HOME_BLOG_LIMIT;
      return [...posts]
        .sort((a, b) => (b.date || '').localeCompare(a.date || ''))
        .slice(0, n)
        .map((p) => ({
          slug: p.slug,
          title: p.title,
          excerpt: p.excerpt,
          cover: p.cover,
          date: p.date,
          tag: Array.isArray(p.tags) && p.tags.length ? p.tags[0] : null
        }));
    }
  }
};
