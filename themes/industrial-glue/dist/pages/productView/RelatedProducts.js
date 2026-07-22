import React from 'react';
import { getFamily } from '../../utils/family.js';
import FamilyCard from '../../components/FamilyCard.js';
export default function RelatedProducts({ product }) {
    var _a, _b, _c, _d;
    const raw = ((_a = product === null || product === void 0 ? void 0 : product.relatedProducts) !== null && _a !== void 0 ? _a : []).filter((p) => Boolean(p));
    // Un representante por familia (el resolver ya devuelve familias distintas,
    // pero deduplicamos por las dudas para no repetir cards).
    const seen = new Set();
    const cards = [];
    for (const p of raw) {
        const family = getFamily(p.name) || p.name;
        if (seen.has(family))
            continue;
        seen.add(family);
        const members = ((_b = p.familyMembers) !== null && _b !== void 0 ? _b : []).filter((m) => Boolean(m));
        cards.push({
            family,
            label: 'Relacionado',
            accent: '#2A4899',
            repImage: (_d = (_c = p.image) === null || _c === void 0 ? void 0 : _c.url) !== null && _d !== void 0 ? _d : null,
            repUrl: p.url,
            members: members.length ? members : [{ name: p.name, url: p.url, uuid: p.uuid }],
        });
    }
    if (cards.length === 0)
        return null;
    return (React.createElement("section", { className: "bg-slate-50 py-16 md:py-24 font-sora" },
        React.createElement("div", { className: "max-w-[1536px] mx-auto px-6 sm:px-8 lg:px-12" },
            React.createElement("div", { className: "mb-8 md:mb-12" },
                React.createElement("span", { className: "text-[#85C639] font-black text-[10px] md:text-xs uppercase tracking-[0.4em] block mb-3" }, "Sigue explorando"),
                React.createElement("h2", { className: "text-2xl sm:text-4xl md:text-5xl font-black text-[#181B1C] font-sora uppercase tracking-tighter leading-none" }, "Productos relacionados"),
                React.createElement("div", { className: "w-24 h-2 bg-[#85C639] mt-6" })),
            React.createElement("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6" }, cards.map((c) => (React.createElement(FamilyCard, { key: c.family, data: c })))))));
}
export const layout = {
    areaId: 'productPageBottom',
    sortOrder: 20
};
export const query = `
query RelatedProductsQuery {
  product: currentProduct {
    relatedProducts {
      productId
      uuid
      name
      url
      image {
        url
        alt
      }
      familyMembers {
        productId
        uuid
        name
        url
      }
    }
  }
}
`;
