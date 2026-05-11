import React from 'react';
export default function ProductHeaderInfo({ product }) {
    const getAttr = (code)=>product?.attributes?.find((a)=>a.attribute_code === code)?.attribute_value;
    const feature = getAttr('feature_principal') || 'Calidad Industrial';
    const sapCode = getAttr('codigo_sap') || 'N/A';
    return /*#__PURE__*/ React.createElement("div", {
        className: "mb-8 flex justify-between items-start animate-fadeIn"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex flex-col gap-2"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "inline-flex items-center space-x-3 bg-[#85C639]/10 px-4 py-1.5 rounded-full border border-[#85C639]/20"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "w-1.5 h-1.5 rounded-full bg-[#85C639] animate-pulse"
    }), /*#__PURE__*/ React.createElement("span", {
        className: "text-[#181B1C] text-[9px] font-black uppercase tracking-[0.3em] font-inter"
    }, feature))), /*#__PURE__*/ React.createElement("div", {
        className: "bg-white/80 backdrop-blur-md px-6 py-4 rounded-2xl shadow-xl border border-slate-100 flex flex-col items-end transform hover:scale-105 transition-transform duration-300"
    }, /*#__PURE__*/ React.createElement("span", {
        className: "text-slate-400 text-[8px] font-black uppercase tracking-[0.5em] mb-1"
    }, "CÓDIGO SAP"), /*#__PURE__*/ React.createElement("span", {
        className: "text-[#2A4899] font-black text-xl font-sora tracking-tighter"
    }, sapCode)));
}
export const layout = {
    areaId: 'productPageMiddleRight',
    sortOrder: 1
};
