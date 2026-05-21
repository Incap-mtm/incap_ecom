import React, { useState } from 'react';
function AccordionItem({ item, isOpen, onToggle }) {
    return (React.createElement("div", { className: "border-b border-white/10 last:border-0" },
        React.createElement("button", { onClick: onToggle, className: "w-full flex items-center justify-between py-6 text-left gap-4 group", "aria-expanded": isOpen },
            React.createElement("span", { className: "text-sm font-bold text-white group-hover:text-[#85C639] transition-colors duration-200 font-sora uppercase tracking-wide" }, item.question),
            React.createElement("span", { className: `flex-shrink-0 w-7 h-7 rounded-full border border-white/20 flex items-center justify-center transition-all duration-300 ${isOpen ? 'bg-[#85C639] border-[#85C639]' : 'group-hover:border-[#85C639]'}` },
                React.createElement("svg", { className: `w-3.5 h-3.5 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#181B1C]' : 'text-white/60'}`, fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
                    React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2.5, d: "M19 9l-7 7-7-7" })))),
        isOpen && (React.createElement("div", { className: "pb-6 pr-10 text-white/50 text-sm leading-relaxed font-inter" }, item.answer))));
}
export default function ProductFAQ({ product }) {
    var _a;
    const faqAttr = (_a = product === null || product === void 0 ? void 0 : product.attributes) === null || _a === void 0 ? void 0 : _a.find(a => a.attributeCode === 'preguntas_frecuentes');
    let faqs = [];
    if (faqAttr === null || faqAttr === void 0 ? void 0 : faqAttr.optionText) {
        try {
            faqs = JSON.parse(faqAttr.optionText);
        }
        catch (_b) { }
    }
    if (faqs.length === 0) {
        faqs = [
            {
                question: '¿Cuál es el tiempo de secado?',
                answer: 'El tiempo de secado inicial es de 15 minutos, con curado completo a las 24 horas bajo condiciones normales de temperatura y humedad.'
            },
            {
                question: '¿Cuál es el rendimiento por galón?',
                answer: 'Aproximadamente 4 a 5 m² por galón, dependiendo de la porosidad del sustrato y el método de aplicación.'
            },
            {
                question: '¿Cómo se debe almacenar?',
                answer: 'En lugar fresco y seco (15–25 °C), alejado de luz solar directa y fuentes de calor. Mantener el envase bien cerrado.'
            },
        ];
    }
    const [openIndex, setOpenIndex] = useState(0);
    const toggle = (i) => setOpenIndex(openIndex === i ? null : i);
    return (React.createElement("section", { className: "bg-[#181B1C] py-20 relative overflow-hidden" },
        React.createElement("div", { className: "absolute bottom-0 left-0 w-96 h-96 bg-[#85C639]/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" }),
        React.createElement("div", { className: "max-w-[1536px] mx-auto px-6 sm:px-8 lg:px-12 relative z-10" },
            React.createElement("div", { className: "grid grid-cols-1 lg:grid-cols-5 gap-16" },
                React.createElement("div", { className: "lg:col-span-2" },
                    React.createElement("h2", { className: "text-4xl md:text-5xl font-black text-white uppercase tracking-tight font-sora mb-2" },
                        "Preguntas",
                        React.createElement("br", null),
                        React.createElement("span", { className: "text-[#85C639] italic" }, "Frecuentes")),
                    React.createElement("div", { className: "w-24 h-2 bg-[#85C639] mb-6" }),
                    React.createElement("p", { className: "text-sm text-white/40 leading-relaxed font-inter" }, "Informaci\u00F3n t\u00E9cnica esencial para optimizar el uso de este producto en sus procesos industriales.")),
                React.createElement("div", { className: "lg:col-span-3" }, faqs.map((faq, i) => (React.createElement(AccordionItem, { key: i, item: faq, isOpen: openIndex === i, onToggle: () => toggle(i) }))))))));
}
export const layout = {
    areaId: 'productPageBottom',
    sortOrder: 20
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
