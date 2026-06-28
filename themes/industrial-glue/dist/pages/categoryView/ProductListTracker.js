import { useEffect, useMemo } from 'react';
import { trackEcommerce } from '../../utils/analytics.js';
// Normaliza una URL/href a su pathname para comparar clicks con productos.
function pathOf(href) {
    try {
        return new URL(href, window.location.origin).pathname.replace(/\/$/, '');
    }
    catch (_a) {
        return (href || '').split('?')[0].replace(/\/$/, '');
    }
}
// Trackers de listado de categoría: `view_item_list` al cargar y `select_item`
// al hacer click en un producto. No renderiza nada (solo efectos).
export default function ProductListTracker({ category }) {
    const listName = (category === null || category === void 0 ? void 0 : category.name) || 'Categoría';
    const items = useMemo(() => { var _a; return (((_a = category === null || category === void 0 ? void 0 : category.products) === null || _a === void 0 ? void 0 : _a.items) || []).filter((p) => p === null || p === void 0 ? void 0 : p.name); }, [category]);
    // view_item_list (primeros 30 para no saturar el evento)
    useEffect(() => {
        if (!items.length)
            return;
        trackEcommerce('view_item_list', {
            item_list_name: listName,
            items: items.slice(0, 30).map((p, i) => ({
                item_id: p.sku || pathOf(p.url || '').split('/').pop() || '',
                item_name: p.name,
                item_brand: 'INCAP',
                index: i
            }))
        });
    }, [items, listName]);
    // select_item — delegación de click matcheando href con un producto del listado
    useEffect(() => {
        if (!items.length)
            return;
        const byPath = new Map();
        items.forEach((p) => {
            if (p.url)
                byPath.set(pathOf(p.url), p);
        });
        const handler = (e) => {
            var _a, _b;
            const a = (_b = (_a = e.target) === null || _a === void 0 ? void 0 : _a.closest) === null || _b === void 0 ? void 0 : _b.call(_a, 'a');
            if (!a)
                return;
            const href = a.getAttribute('href') || a.href || '';
            if (!href)
                return;
            const p = byPath.get(pathOf(href));
            if (!p)
                return;
            trackEcommerce('select_item', {
                item_list_name: listName,
                items: [
                    {
                        item_id: p.sku || pathOf(p.url || '').split('/').pop() || '',
                        item_name: p.name,
                        item_brand: 'INCAP'
                    }
                ]
            });
        };
        document.addEventListener('click', handler, true);
        return () => document.removeEventListener('click', handler, true);
    }, [items, listName]);
    return null;
}
export const layout = {
    areaId: 'categoryPageBottom',
    sortOrder: 999
};
export const query = `
  query Query {
    category: currentCategory {
      name
      products(filters: [{ key: "limit", operation: eq, value: "500" }]) {
        items {
          name
          sku
          url
        }
      }
    }
  }
`;
