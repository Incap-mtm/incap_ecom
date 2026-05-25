import React from 'react';
import { useProduct } from '@components/frontStore/catalog/ProductContext.js';
const CATEGORY_TO_INDUSTRY = {
    // Madera
    madera: {
        url: '/industrias/madera',
        name: 'Madera y Muebles'
    },
    maderas: {
        url: '/industrias/madera',
        name: 'Madera y Muebles'
    },
    mueble: {
        url: '/industrias/madera',
        name: 'Madera y Muebles'
    },
    // Calzado
    calzado: {
        url: '/industrias/calzado',
        name: 'Calzado y Marroquinería'
    },
    marroquineria: {
        url: '/industrias/calzado',
        name: 'Calzado y Marroquinería'
    },
    maroquineria: {
        url: '/industrias/calzado',
        name: 'Calzado y Marroquinería'
    },
    // Colchones
    colchones: {
        url: '/industrias/colchones',
        name: 'Colchones y Espumas'
    },
    espumas: {
        url: '/industrias/colchones',
        name: 'Colchones y Espumas'
    },
    espuma: {
        url: '/industrias/colchones',
        name: 'Colchones y Espumas'
    },
    tapiceria: {
        url: '/industrias/colchones',
        name: 'Colchones y Espumas'
    },
    // Hogar
    multiusos: {
        url: '/industrias/hogar',
        name: 'Hogar y Multiusos'
    },
    multisusos: {
        url: '/industrias/hogar',
        name: 'Hogar y Multiusos'
    },
    hogar: {
        url: '/industrias/hogar',
        name: 'Hogar y Multiusos'
    },
    manualidades: {
        url: '/industrias/hogar',
        name: 'Hogar y Multiusos'
    },
    auxiliares: {
        url: '/industrias/hogar',
        name: 'Hogar y Multiusos'
    },
    auxiliar: {
        url: '/industrias/hogar',
        name: 'Hogar y Multiusos'
    }
};
export default function ProductBreadcrumb({ pageInfo, product: productProp }) {
    const productCtx = useProduct();
    const name = productCtx?.name;
    const crumbs = pageInfo?.breadcrumbs ?? [];
    const productUrl = productProp?.url ?? (crumbs.length > 0 ? crumbs[crumbs.length - 1]?.url : undefined);
    // Derive industry from product URL segments (e.g. /industrias/colchones/slug → colchones)
    let industry;
    const urlSegments = (productUrl ?? '').split('/').filter(Boolean);
    for (const seg of urlSegments){
        if (CATEGORY_TO_INDUSTRY[seg]) {
            industry = CATEGORY_TO_INDUSTRY[seg];
            break;
        }
    }
    // Fallback: scan pageInfo breadcrumbs
    if (!industry) {
        const categoryCrumbs = crumbs.slice(1, crumbs.length > 1 ? -1 : undefined);
        for(let i = categoryCrumbs.length - 1; i >= 0; i--){
            const key = categoryCrumbs[i].url.split('/').filter(Boolean).pop() ?? '';
            if (CATEGORY_TO_INDUSTRY[key]) {
                industry = CATEGORY_TO_INDUSTRY[key];
                break;
            }
        }
    }
    return /*#__PURE__*/ React.createElement("nav", {
        className: "incap-breadcrumb pt-4 pb-2"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "page-width"
    }, /*#__PURE__*/ React.createElement("ol", {
        className: "flex items-center gap-2 text-xs text-slate-400 font-inter flex-wrap"
    }, /*#__PURE__*/ React.createElement("li", null, /*#__PURE__*/ React.createElement("a", {
        href: "/",
        className: "hover:text-[#2A4899] transition-colors font-semibold"
    }, "Inicio")), industry && /*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement("li", {
        className: "text-slate-300"
    }, "/"), /*#__PURE__*/ React.createElement("li", null, /*#__PURE__*/ React.createElement("a", {
        href: industry.url,
        className: "hover:text-[#2A4899] transition-colors font-semibold"
    }, industry.name))), name && /*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement("li", {
        className: "text-slate-300"
    }, "/"), /*#__PURE__*/ React.createElement("li", {
        className: "text-[#181B1C] font-semibold truncate max-w-[240px]"
    }, productUrl ? /*#__PURE__*/ React.createElement("a", {
        href: productUrl,
        className: "hover:text-[#2A4899] transition-colors"
    }, name) : name)))));
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
