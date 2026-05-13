import { select } from '@evershop/postgres-query-builder';
import { pool } from '@evershop/evershop/lib/postgres';
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export default (async (request, _response, next)=>{
    const param = request.params.uuid;
    if (!param || UUID_RE.test(param)) {
        return next();
    }
    try {
        const query = select();
        query.from('product', 'p');
        query.leftJoin('product_description', 'pd').on('p.product_id', '=', 'pd.product_description_product_id');
        query.where('pd.url_key', '=', param);
        query.andWhere('p.status', '=', 1);
        const product = await query.load(pool);
        if (product?.uuid) {
            request.params.uuid = product.uuid;
        }
    } catch  {
    // slug lookup failed — let index.ts handle the 404
    }
    next();
});
