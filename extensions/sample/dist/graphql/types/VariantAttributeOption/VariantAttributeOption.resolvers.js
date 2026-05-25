import { select } from '@evershop/postgres-query-builder';
export default {
    VariantAttributeOption: {
        url: async ({ productId }, _, { pool })=>{
            if (!productId) return null;
            const result = await select('url_key').from('product_description').where('product_description_product_id', '=', productId).load(pool);
            return result ? `/${result.url_key}` : null;
        }
    }
};
