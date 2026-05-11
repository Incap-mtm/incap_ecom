import React from 'react';
export default function AuthoritySection() {
    const logos = [
        '/Logo%20Aliados/Logo%20Kenda%20Farben.svg',
        '/Logo%20Aliados/Logo%20CT%20Point.svg',
        '/Logo%20Aliados/Logo%20Intercom.svg',
        '/Logo%20Aliados/Logo%20Tecno%20GI.svg'
    ];
    return /*#__PURE__*/ React.createElement("section", {
        className: "py-24 bg-white border-y border-slate-100 overflow-hidden"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "max-w-[1536px] mx-auto px-6 text-center mb-16"
    }, /*#__PURE__*/ React.createElement("h3", {
        className: "text-[10px] font-black text-slate-300 uppercase tracking-[0.5em]"
    }, "Líderes globales que confían en nuestra química")), /*#__PURE__*/ React.createElement("div", {
        className: "relative group"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-white to-transparent z-10"
    }), /*#__PURE__*/ React.createElement("div", {
        className: "absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-white to-transparent z-10"
    }), /*#__PURE__*/ React.createElement("div", {
        className: "flex animate-marquee whitespace-nowrap items-center py-4 grayscale hover:grayscale-0 transition-all duration-1000 opacity-40 hover:opacity-100 gap-[80px]"
    }, [
        ...logos,
        ...logos,
        ...logos,
        ...logos
    ].map((logo, i)=>/*#__PURE__*/ React.createElement("img", {
            key: i,
            src: logo,
            className: "h-10 w-auto object-contain flex-shrink-0 transition-transform hover:scale-110",
            alt: "Partner Logo"
        })))));
}
export const layout = {
    areaId: 'content',
    sortOrder: 15
};
