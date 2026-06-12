import React from 'react';
const logos = [
    { name: 'Kenda Farben', src: '/images/logos/Logo_Kenda_Farben.svg' },
    { name: 'Intercom', src: '/images/logos/Logo_Intercom.svg' },
    { name: 'Tecno GI', src: '/images/logos/Logo_Tecno_GI.svg' },
    { name: 'CT Point', src: '/images/logos/Logo_CT_Point.svg' },
    { name: 'JAB', src: '/images/logos/jab-logo.png' },
];
export default function LogoStrip() {
    // 4 copias: cada mitad del track (2 copias) supera el ancho del viewport,
    // así el marquee nunca deja espacio vacío a la derecha antes de reiniciar.
    const loopLogos = [...logos, ...logos, ...logos, ...logos];
    return (React.createElement("section", { className: "bg-white border-y border-slate-100 py-10 overflow-hidden" },
        React.createElement("div", { className: "relative flex overflow-hidden" },
            React.createElement("div", { className: "absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10" }),
            React.createElement("div", { className: "absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10" }),
            React.createElement("div", { className: "flex animate-marquee whitespace-nowrap items-center py-4 grayscale hover:grayscale-0 transition-all duration-1000 opacity-40 hover:opacity-100" }, loopLogos.map((logo, i) => (React.createElement("img", { key: `${logo.name}-${i}`, src: logo.src, alt: logo.name, loading: "lazy", className: "h-10 w-auto object-contain flex-shrink-0 transition-transform hover:scale-110", style: { mixBlendMode: 'multiply', marginRight: '50px' } })))))));
}
export const layout = {
    areaId: 'content',
    sortOrder: 3
};
