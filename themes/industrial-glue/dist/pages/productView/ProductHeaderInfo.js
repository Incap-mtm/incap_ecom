import React from 'react';
import { useProduct } from '@components/frontStore/catalog/ProductContext.js';
export default function ProductHeaderInfo() {
    const product = useProduct();
    const get = (code) => { var _a, _b; return (_b = (_a = product === null || product === void 0 ? void 0 : product.attributes) === null || _a === void 0 ? void 0 : _a.find((a) => a.attributeCode === code)) === null || _b === void 0 ? void 0 : _b.optionText; };
    const usos = get('usos');
    const codigoIndustrial = get('codigo_industrial');
    const sku = product === null || product === void 0 ? void 0 : product.sku;
    const name = product === null || product === void 0 ? void 0 : product.name;
    return (React.createElement("div", { className: "mb-3" },
        usos && (React.createElement("div", { className: "inline-block bg-[#2A4899]/8 border border-[#2A4899]/20 px-4 py-1.5 rounded-full mb-4" },
            React.createElement("span", { className: "text-[10px] font-black text-[#2A4899] uppercase tracking-[0.3em] font-sora" }, usos))),
        name && (React.createElement("h1", { className: "text-2xl md:text-4xl font-black text-[#181B1C] font-sora mb-3 leading-tight tracking-tight uppercase" }, name)),
        (sku || codigoIndustrial) && (React.createElement("div", { className: "flex items-center flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400 font-inter" },
            sku && (React.createElement("span", null,
                "SKU",
                ' ',
                React.createElement("strong", { className: "text-[#181B1C] font-bold" }, sku))),
            sku && codigoIndustrial && React.createElement("span", { className: "text-slate-200" }, "\u00B7"),
            codigoIndustrial && (React.createElement("span", null,
                "Ref. industrial",
                ' ',
                React.createElement("strong", { className: "text-[#181B1C] font-bold" }, codigoIndustrial)))))));
}
export const layout = {
    areaId: 'productPageMiddleRight',
    sortOrder: 1
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
