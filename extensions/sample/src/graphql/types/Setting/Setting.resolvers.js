import { pool } from '@evershop/evershop/lib/postgres';

const SIZE_ATTRIBUTE_ID = 2;

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
    }
  }
};
