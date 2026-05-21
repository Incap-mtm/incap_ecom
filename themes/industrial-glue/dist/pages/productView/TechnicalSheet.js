import React from 'react';
export default function TechnicalSheet({ product }) {
    var _a;
    // Acepta tanto 'ficha_tecnica_url' (atributo nuevo del CSV) como 'ficha_tecnica' (legacy)
    const fichaAttr = (_a = product === null || product === void 0 ? void 0 : product.attributes) === null || _a === void 0 ? void 0 : _a.find((a) => a.attributeCode === 'ficha_tecnica_url' || a.attributeCode === 'ficha_tecnica');
    const fichaUrl = fichaAttr === null || fichaAttr === void 0 ? void 0 : fichaAttr.optionText;
    // Don't render if no technical sheet is configured
    if (!fichaUrl)
        return null;
    return (React.createElement("div", { className: "mt-10 border-t border-slate-100 pt-10" },
        React.createElement("h3", { className: "text-lg font-bold text-[#181B1C] mb-4", style: { fontFamily: 'Sora, sans-serif' } }, "Ficha T\u00E9cnica"),
        React.createElement("a", { href: fichaUrl, target: "_blank", rel: "noopener noreferrer", download: true, className: "inline-flex items-center gap-3 px-6 py-3 bg-[#2A4899] hover:bg-[#1e3a7a] text-white font-semibold rounded-lg transition-all duration-300 group" },
            React.createElement("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
                React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" })),
            "Descargar Ficha T\u00E9cnica",
            React.createElement("span", { className: "text-xs opacity-70" }, "(PDF)")),
        React.createElement("p", { className: "mt-2 text-xs text-slate-400" }, "Incluye especificaciones, modo de aplicaci\u00F3n y seguridad.")));
}
export const layout = {
    areaId: 'productPageBottom',
    sortOrder: 10
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
