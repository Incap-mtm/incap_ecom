import { select } from '@evershop/postgres-query-builder';
const SIZE_ATTRIBUTE_ID = 2;
export default {
    Product: {
        sizeVariants: async (product, _, { pool })=>{
            const { variantGroupId, productId } = product;
            if (!variantGroupId) return null;
            const query = select();
            query.from('product');
            query.select('product.product_id');
            query.select('product.uuid');
            query.select('product_attribute_value_index.option_text');
            query.leftJoin('product_attribute_value_index').on('product.product_id', '=', 'product_attribute_value_index.product_id');
            query.where('product.variant_group_id', '=', variantGroupId);
            query.andWhere('product_attribute_value_index.attribute_id', '=', SIZE_ATTRIBUTE_ID);
            const rows = await query.execute(pool);
            return rows.map((r)=>({
                    label: r.option_text,
                    url: `/product/${r.uuid}`,
                    isCurrent: r.product_id === productId
                }));
        }
    }
};
