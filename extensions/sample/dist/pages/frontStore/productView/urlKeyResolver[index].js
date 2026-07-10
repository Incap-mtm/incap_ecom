import { select } from '@evershop/postgres-query-builder';
import { pool } from '@evershop/evershop/lib/postgres';
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export default async (request, response, next) => {
    const param = request.params.uuid;
    if (!param) {
        return next();
    }
    // Caso 1: el param ES un UUID. Si la request entró literalmente por la URL "sucia"
    // /product/<uuid> y el producto tiene una URL limpia (/categoria/url_key) en
    // url_rewrite, redirigir 301 a la limpia (evita contenido duplicado / canónica UUID).
    // Guard por originalUrl: las URLs limpias se reescriben internamente sin cambiar
    // originalUrl, así que ese caso no matchea y NO se produce loop de redirección.
    if (UUID_RE.test(param)) {
        const currentPath = request.originalUrl.split('?')[0].split('#')[0];
        if (currentPath === `/product/${param}`) {
            try {
                const rewrite = await select()
                    .from('url_rewrite')
                    .where('entity_uuid', '=', param)
                    .andWhere('entity_type', '=', 'product')
                    .load(pool);
                if ((rewrite === null || rewrite === void 0 ? void 0 : rewrite.request_path) && rewrite.request_path !== currentPath) {
                    response.redirect(301, rewrite.request_path);
                    return;
                }
            }
            catch (_a) {
                // si falla la consulta, seguir sirviendo por uuid (fallback)
            }
        }
        return next();
    }
    // Caso 2: el param NO es UUID → resolver slug (url_key) → uuid real.
    try {
        const query = select();
        query.from('product', 'p');
        query.leftJoin('product_description', 'pd').on('p.product_id', '=', 'pd.product_description_product_id');
        query.where('pd.url_key', '=', param);
        query.andWhere('p.status', '=', 1);
        const product = await query.load(pool);
        if (product === null || product === void 0 ? void 0 : product.uuid) {
            request.params.uuid = product.uuid;
        }
    }
    catch (_b) {
        // slug lookup failed — let index.ts handle the 404
    }
    next();
};
//# sourceMappingURL=urlKeyResolver%5Bindex%5D.js.map