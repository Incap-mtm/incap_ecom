import { useEffect } from 'react';
import { trackEcommerce } from '../../utils/analytics.js';
// Dispara el evento ecommerce `view_item` (GA4) al ver una página de producto.
// No renderiza nada; corre en cliente vía useEffect (SSR-safe).
export default function ProductViewTracker({ product }) {
    const name = product === null || product === void 0 ? void 0 : product.name;
    const sku = product === null || product === void 0 ? void 0 : product.sku;
    useEffect(() => {
        if (!name)
            return;
        const slug = ((product === null || product === void 0 ? void 0 : product.url) || '').split('/').filter(Boolean).pop() || '';
        trackEcommerce('view_item', {
            items: [
                {
                    item_id: sku || slug,
                    item_name: name,
                    item_brand: 'INCAP'
                }
            ]
        });
    }, [name, sku]);
    return null;
}
export const layout = {
    areaId: 'productPageBottom',
    sortOrder: 999
};
export const query = `
  query Query {
    product: currentProduct {
      name
      sku
      url
    }
  }
`;
