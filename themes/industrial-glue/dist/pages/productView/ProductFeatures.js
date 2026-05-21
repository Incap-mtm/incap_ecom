import React from 'react';
export default function ProductFeatures({ product }) {
    var _a, _b;
    const raw = ((_b = (_a = product === null || product === void 0 ? void 0 : product.attributes) === null || _a === void 0 ? void 0 : _a.find(a => a.attributeCode === 'caracteristicas')) === null || _b === void 0 ? void 0 : _b.optionText) || '';
    const items = raw.split('|').map(s => s.trim()).filter(Boolean);
    if (items.length === 0)
        return null;
    return (React.createElement("div", { className: "py-8 border-t border-slate-100" },
        React.createElement("h3", { className: "text-base font-black text-[#181B1C] uppercase tracking-tight font-sora mb-1" }, "Caracter\u00EDsticas"),
        React.createElement("div", { className: "w-10 h-1 bg-[#85C639] mb-5" }),
        React.createElement("ul", { className: "space-y-3" }, items.map((item, i) => (React.createElement("li", { key: i, className: "flex items-start gap-3" },
            React.createElement("svg", { className: "flex-shrink-0 mt-0.5 w-5 h-5 text-[#85C639]", viewBox: "0 0 20 20", fill: "currentColor" },
                React.createElement("path", { fillRule: "evenodd", d: "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z", clipRule: "evenodd" })),
            React.createElement("span", { className: "text-sm text-[#181B1C] font-inter leading-snug" }, item)))))));
}
export const layout = {
    areaId: 'productPageMiddleRight',
    sortOrder: 5
};
export const query = `
query Query {
    product: currentProduct {
      attributes: attributeIndex {
        attributeCode
        optionText
      }
    }
}
`;
