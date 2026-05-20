import React from 'react';
export default function ProductHeaderInfo({ product }) {
    const get = (code)=>product?.attributes?.find((a)=>a.attributeCode === code)?.optionText;
    const usos = get('usos');
    const codigoIndustrial = get('codigo_industrial');
    const sku = product?.sku;
    return /*#__PURE__*/ React.createElement("div", {
        className: "mb-3"
    }, usos && /*#__PURE__*/ React.createElement("div", {
        className: "inline-block bg-[#2A4899]/8 border border-[#2A4899]/20 px-4 py-1.5 rounded-full mb-4"
    }, /*#__PURE__*/ React.createElement("span", {
        className: "text-[10px] font-black text-[#2A4899] uppercase tracking-[0.3em] font-sora"
    }, usos)), (sku || codigoIndustrial) && /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400 font-inter"
    }, sku && /*#__PURE__*/ React.createElement("span", null, "SKU", ' ', /*#__PURE__*/ React.createElement("strong", {
        className: "text-[#181B1C] font-bold"
    }, sku)), sku && codigoIndustrial && /*#__PURE__*/ React.createElement("span", {
        className: "text-slate-200"
    }, "·"), codigoIndustrial && /*#__PURE__*/ React.createElement("span", null, "Ref. industrial", ' ', /*#__PURE__*/ React.createElement("strong", {
        className: "text-[#181B1C] font-bold"
    }, codigoIndustrial))));
}
export const layout = {
    areaId: 'productPageMiddleRight',
    sortOrder: 1
};
export const query = `
query Query {
    product: currentProduct {
      sku
      attributes: attributeIndex {
        attributeCode
        optionText
      }
    }
}
`;
