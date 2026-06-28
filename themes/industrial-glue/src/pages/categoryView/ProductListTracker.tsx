import { useEffect, useMemo } from 'react';
import { trackEcommerce } from '../../utils/analytics.js';

interface Item { name?: string; sku?: string; url?: string }
interface Props {
  category?: { name?: string; products?: { items?: Item[] } };
}

// Normaliza una URL/href a su pathname para comparar clicks con productos.
function pathOf(href: string): string {
  try {
    return new URL(href, window.location.origin).pathname.replace(/\/$/, '');
  } catch {
    return (href || '').split('?')[0].replace(/\/$/, '');
  }
}

// Trackers de listado de categoría: `view_item_list` al cargar y `select_item`
// al hacer click en un producto. No renderiza nada (solo efectos).
export default function ProductListTracker({ category }: Props): null {
  const listName = category?.name || 'Categoría';
  const items = useMemo(
    () => (category?.products?.items || []).filter((p) => p?.name),
    [category]
  );

  // view_item_list (primeros 30 para no saturar el evento)
  useEffect(() => {
    if (!items.length) return;
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
    if (!items.length) return;
    const byPath = new Map<string, Item>();
    items.forEach((p) => {
      if (p.url) byPath.set(pathOf(p.url), p);
    });

    const handler = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest?.('a') as HTMLAnchorElement | null;
      if (!a) return;
      const href = a.getAttribute('href') || a.href || '';
      if (!href) return;
      const p = byPath.get(pathOf(href));
      if (!p) return;
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
