import React from 'react';
export default function AuthoritySection() {
    const logos = [
        '/images/logos/Logo_Kenda_Farben.svg',
        '/images/logos/Logo_CT_Point.svg',
        '/images/logos/Logo_Intercom.svg',
        '/images/logos/Logo_Tecno_GI.svg',
        '/images/logos/jab-logo.png',
    ];
    return (React.createElement("section", { className: "py-24 bg-white border-y border-slate-100 overflow-hidden" },
        React.createElement("div", { className: "max-w-[1536px] mx-auto px-6 text-center mb-16" },
            React.createElement("h3", { className: "font-black text-slate-300 uppercase tracking-[0.5em]", style: { fontSize: '15px' } }, "L\u00EDderes globales que conf\u00EDan en nuestra qu\u00EDmica")),
        React.createElement("div", { className: "relative group" },
            React.createElement("div", { className: "absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-white to-transparent z-10" }),
            React.createElement("div", { className: "absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-white to-transparent z-10" }),
            React.createElement("div", { className: "flex animate-marquee whitespace-nowrap items-center py-4 grayscale hover:grayscale-0 transition-all duration-1000 opacity-40 hover:opacity-100" }, [...logos, ...logos, ...logos, ...logos].map((logo, i) => (React.createElement("img", { key: i, src: logo, loading: "lazy", className: "h-10 w-auto object-contain flex-shrink-0 transition-transform hover:scale-110", style: { marginRight: '80px' }, alt: "Partner Logo" })))))));
}
export const layout = {
    areaId: 'content',
    sortOrder: 15
};
