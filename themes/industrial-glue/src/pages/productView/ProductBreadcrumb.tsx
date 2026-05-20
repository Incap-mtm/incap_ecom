import React from 'react';

const CATEGORY_TO_INDUSTRY: Record<string, { url: string; name: string }> = {
  madera:        { url: '/industrias/madera',    name: 'Madera y Muebles' },
  maderas:       { url: '/industrias/madera',    name: 'Madera y Muebles' },
  mueble:        { url: '/industrias/madera',    name: 'Madera y Muebles' },
  calzado:       { url: '/industrias/calzado',   name: 'Calzado y Marroquinería' },
  marroquineria: { url: '/industrias/calzado',   name: 'Calzado y Marroquinería' },
  colchones:     { url: '/industrias/colchones', name: 'Colchones y Espumas' },
  espumas:       { url: '/industrias/colchones', name: 'Colchones y Espumas' },
  tapiceria:     { url: '/industrias/colchones', name: 'Colchones y Espumas' },
  multiusos:     { url: '/industrias/hogar',     name: 'Hogar y Multiusos' },
  hogar:         { url: '/industrias/hogar',     name: 'Hogar y Multiusos' },
  manualidades:  { url: '/industrias/hogar',     name: 'Hogar y Multiusos' },
};

interface Breadcrumb { url: string; title: string; }
interface Props {
  pageInfo?: { breadcrumbs?: Breadcrumb[] };
  product?:  { name?: string };
}

export default function ProductBreadcrumb({ pageInfo, product }: Props) {
  const crumbs   = pageInfo?.breadcrumbs ?? [];
  const name     = product?.name;

  // Find a category breadcrumb (anything between Home and the product)
  const categoryItem = crumbs.find(c =>
    c.url !== '/' && !c.url.includes('/product/')
  );

  let industry: { url: string; name: string } | undefined;
  if (categoryItem) {
    // Extract last segment of the URL to use as key
    const key = categoryItem.url.split('/').filter(Boolean).pop() ?? '';
    industry = CATEGORY_TO_INDUSTRY[key];
    if (!industry) {
      // Fallback: use the original breadcrumb if we don't have a mapping
      industry = { url: categoryItem.url, name: categoryItem.title };
    }
  }

  return (
    <nav className="breadcrumb px-4 md:px-0 pt-4 pb-2">
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
            <li className="text-[#181B1C] font-semibold truncate max-w-[240px]">{name}</li>
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
    name
  }
}
`;
