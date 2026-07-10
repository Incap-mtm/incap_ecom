import React from 'react';
const AZUL = '#2A4899';
export default function RelatedProducts({ product }) {
    var _a;
    const items = ((_a = product === null || product === void 0 ? void 0 : product.relatedProducts) !== null && _a !== void 0 ? _a : []).filter((p) => Boolean(p));
    if (items.length === 0)
        return null;
    return (React.createElement("section", { className: "bg-slate-50 py-16 md:py-24 font-sora" },
        React.createElement("div", { className: "max-w-[1536px] mx-auto px-6 sm:px-8 lg:px-12" },
            React.createElement("div", { className: "mb-8 md:mb-12" },
                React.createElement("span", { className: "text-[#85C639] font-black text-[10px] md:text-xs uppercase tracking-[0.4em] block mb-3" }, "Sigue explorando"),
                React.createElement("h2", { className: "text-2xl sm:text-4xl md:text-5xl font-black text-[#181B1C] font-sora uppercase tracking-tighter leading-none" }, "Productos relacionados")),
            React.createElement("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8" }, items.map((p) => {
                var _a, _b, _c;
                return (React.createElement("a", { key: p.productId, href: p.url, className: "group bg-white rounded-[1.25rem] md:rounded-[2rem] shadow-lg border border-slate-100 hover:shadow-2xl transition-all overflow-hidden flex flex-col" },
                    React.createElement("div", { className: "h-40 md:h-56 overflow-hidden bg-white flex items-center justify-center p-4" }, ((_a = p.image) === null || _a === void 0 ? void 0 : _a.url) ? (React.createElement("img", { src: p.image.url, alt: p.image.alt || p.name, className: "w-full h-full object-contain group-hover:scale-105 transition-transform duration-700" })) : (React.createElement("div", { className: "w-full h-full flex items-center justify-center text-slate-300 font-sora font-black uppercase tracking-widest text-xs md:text-base" }, "Sin Imagen"))),
                    React.createElement("div", { className: "px-4 md:px-6 pt-4 md:pt-6 pb-5 md:pb-8 flex flex-col flex-grow" },
                        React.createElement("span", { className: "text-[#2A4899] font-black text-[9px] md:text-[10px] uppercase tracking-[0.3em] mb-2 block" }, "Adhesivo"),
                        React.createElement("h3", { className: "text-sm md:text-lg font-black font-sora text-[#181B1C] group-hover:text-[#2A4899] transition-colors uppercase tracking-tight leading-tight mb-3 md:mb-4 flex-grow" }, p.name),
                        ((_c = (_b = p.price) === null || _b === void 0 ? void 0 : _b.regular) === null || _c === void 0 ? void 0 : _c.text) && (React.createElement("span", { className: "inline-block text-sm md:text-base font-bold font-sora", style: { color: AZUL } }, p.price.regular.text)))));
            })))));
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
      name
      url
      image {
        url
        alt
      }
      price {
        regular {
          text
        }
      }
    }
  }
}
`;
