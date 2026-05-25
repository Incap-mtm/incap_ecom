import React from 'react';
import { useProduct } from '@components/frontStore/catalog/ProductContext.js';
const CATEGORY_TO_INDUSTRY = {
    // Madera
    madera: { url: '/industrias/madera', name: 'Madera y Muebles' },
    maderas: { url: '/industrias/madera', name: 'Madera y Muebles' },
    mueble: { url: '/industrias/madera', name: 'Madera y Muebles' },
    // Calzado
    calzado: { url: '/industrias/calzado', name: 'Calzado y Marroquinería' },
    marroquineria: { url: '/industrias/calzado', name: 'Calzado y Marroquinería' },
    maroquineria: { url: '/industrias/calzado', name: 'Calzado y Marroquinería' },
    // Colchones
    colchones: { url: '/industrias/colchones', name: 'Colchones y Espumas' },
    espumas: { url: '/industrias/colchones', name: 'Colchones y Espumas' },
    espuma: { url: '/industrias/colchones', name: 'Colchones y Espumas' },
    tapiceria: { url: '/industrias/colchones', name: 'Colchones y Espumas' },
    // Hogar
    multiusos: { url: '/industrias/hogar', name: 'Hogar y Multiusos' },
    multisusos: { url: '/industrias/hogar', name: 'Hogar y Multiusos' },
    hogar: { url: '/industrias/hogar', name: 'Hogar y Multiusos' },
    manualidades: { url: '/industrias/hogar', name: 'Hogar y Multiusos' },
    auxiliares: { url: '/industrias/hogar', name: 'Hogar y Multiusos' },
    auxiliar: { url: '/industrias/hogar', name: 'Hogar y Multiusos' },
};
export default function ProductBreadcrumb({ pageInfo, product: productProp }) {
    var _a, _b, _c, _d;
    const productCtx = useProduct();
    const name = productCtx === null || productCtx === void 0 ? void 0 : productCtx.name;
    const crumbs = (_a = pageInfo === null || pageInfo === void 0 ? void 0 : pageInfo.breadcrumbs) !== null && _a !== void 0 ? _a : [];
    const productUrl = (_b = productProp === null || productProp === void 0 ? void 0 : productProp.url) !== null && _b !== void 0 ? _b : (crumbs.length > 0 ? (_c = crumbs[crumbs.length - 1]) === null || _c === void 0 ? void 0 : _c.url : undefined);
    // Derive industry from product URL segments (e.g. /industrias/colchones/slug → colchones)
    let industry;
    const urlSegments = (productUrl !== null && productUrl !== void 0 ? productUrl : '').split('/').filter(Boolean);
    for (const seg of urlSegments) {
        if (CATEGORY_TO_INDUSTRY[seg]) {
            industry = CATEGORY_TO_INDUSTRY[seg];
            break;
        }
    }
    // Fallback: scan pageInfo breadcrumbs
    if (!industry) {
        const categoryCrumbs = crumbs.slice(1, crumbs.length > 1 ? -1 : undefined);
        for (let i = categoryCrumbs.length - 1; i >= 0; i--) {
            const key = (_d = categoryCrumbs[i].url.split('/').filter(Boolean).pop()) !== null && _d !== void 0 ? _d : '';
            if (CATEGORY_TO_INDUSTRY[key]) {
                industry = CATEGORY_TO_INDUSTRY[key];
                break;
            }
        }
    }
    return (React.createElement("nav", { className: "incap-breadcrumb pt-4 pb-2" },
        React.createElement("div", { className: "page-width" },
            React.createElement("ol", { className: "flex items-center gap-2 text-xs text-slate-400 font-inter flex-wrap" },
                React.createElement("li", null,
                    React.createElement("a", { href: "/", className: "hover:text-[#2A4899] transition-colors font-semibold" }, "Inicio")),
                industry && (React.createElement(React.Fragment, null,
                    React.createElement("li", { className: "text-slate-300" }, "/"),
                    React.createElement("li", null,
                        React.createElement("a", { href: industry.url, className: "hover:text-[#2A4899] transition-colors font-semibold" }, industry.name)))),
                name && (React.createElement(React.Fragment, null,
                    React.createElement("li", { className: "text-slate-300" }, "/"),
                    React.createElement("li", { className: "text-[#181B1C] font-semibold truncate max-w-[240px]" }, productUrl ? (React.createElement("a", { href: productUrl, className: "hover:text-[#2A4899] transition-colors" }, name)) : name)))))));
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
