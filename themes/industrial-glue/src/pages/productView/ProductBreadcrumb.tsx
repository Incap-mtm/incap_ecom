import React from 'react';
import { useProduct } from '@components/frontStore/catalog/ProductContext.js';

const CATEGORY_TO_INDUSTRY: Record<string, { url: string; name: string }> = {
  // Madera
  madera:        { url: '/industrias/madera',    name: 'Madera y Muebles' },
  maderas:       { url: '/industrias/madera',    name: 'Madera y Muebles' },
  mueble:        { url: '/industrias/madera',    name: 'Madera y Muebles' },
  // Calzado
  calzado:       { url: '/industrias/calzado',   name: 'Calzado y Marroquinería' },
  marroquineria: { url: '/industrias/calzado',   name: 'Calzado y Marroquinería' },
  maroquineria:  { url: '/industrias/calzado',   name: 'Calzado y Marroquinería' },
  // Colchones
  colchones:     { url: '/industrias/colchones', name: 'Colchones y Espumas' },
  espumas:       { url: '/industrias/colchones', name: 'Colchones y Espumas' },
  espuma:        { url: '/industrias/colchones', name: 'Colchones y Espumas' },
  tapiceria:     { url: '/industrias/colchones', name: 'Colchones y Espumas' },
  // Hogar
  multiusos:     { url: '/industrias/hogar',     name: 'Hogar y Multiusos' },
  multisusos:    { url: '/industrias/hogar',     name: 'Hogar y Multiusos' },
  hogar:         { url: '/industrias/hogar',     name: 'Hogar y Multiusos' },
  manualidades:  { url: '/industrias/hogar',     name: 'Hogar y Multiusos' },
  auxiliares:    { url: '/industrias/hogar',     name: 'Hogar y Multiusos' },
  auxiliar:      { url: '/industrias/hogar',     name: 'Hogar y Multiusos' },
};

interface Breadcrumb { url: string; title: string; }
interface Props {
  pageInfo?: { breadcrumbs?: Breadcrumb[] };
  product?:  { url?: string };
}

export default function ProductBreadcrumb({ pageInfo, product: productProp }: Props) {
  const productCtx = useProduct();
  const name = productCtx?.name;
  const crumbs = pageInfo?.breadcrumbs ?? [];

  // Product URL: from GraphQL prop (url field), or last breadcrumb
  const productUrl = productProp?.url
    ?? (crumbs.length > 0 ? crumbs[crumbs.length - 1]?.url : undefined);

  // Find industry from category breadcrumbs — scan from right (most specific) to left
  const categoryCrumbs = crumbs.slice(1, crumbs.length > 1 ? -1 : undefined);
  let industry: { url: string; name: string } | undefined;
  for (let i = categoryCrumbs.length - 1; i >= 0; i--) {
    const key = categoryCrumbs[i].url.split('/').filter(Boolean).pop() ?? '';
    if (CATEGORY_TO_INDUSTRY[key]) {
      industry = CATEGORY_TO_INDUSTRY[key];
      break;
    }
  }

  return (
    <nav className="incap-breadcrumb px-4 md:px-0 pt-4 pb-2">
      <ol className="flex items-center gap-2 text-xs text-slate-400 font-inter flex-wrap">
        <li>
          <a href="/" className="hover:text-[#2A4899] transition-colors font-semibold">Inicio</a>
        </li>
        {industry && (
          <>
            <li className="text-slate-300">/</li>
            <li>
              <a href={industry.url} className="hover:text-[#2A4899] transition-colors font-semibold">
                {industry.name}
              </a>
            </li>
          </>
        )}
        {name && (
          <>
            <li className="text-slate-300">/</li>
            <li className="text-[#181B1C] font-semibold truncate max-w-[240px]">
              {productUrl ? (
                <a href={productUrl} className="hover:text-[#2A4899] transition-colors">
                  {name}
                </a>
              ) : name}
            </li>
          </>
        )}
      </ol>
    </nav>
  );
}

export const layout = {
  areaId: 'productPageTop',
  sortOrder: 1
};

export const query = `
query Query {
  pageInfo {
    breadcrumbs {
      url
      title
    }
  }
  product: currentProduct {
    url
  }
}
`;
