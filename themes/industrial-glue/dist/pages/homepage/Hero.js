import React, { useState, useEffect } from 'react';
const WHATSAPP_NUMBER = '5491112345678';
export default function Hero() {
    const [active, setActive] = useState(false);
    const waMessage = encodeURIComponent('Hola INCAP! Quiero solicitar una auditoría técnica en planta.');
    useEffect(()=>{
        const timer = setTimeout(()=>setActive(true), 100);
        return ()=>clearTimeout(timer);
    }, []);
    return /*#__PURE__*/ React.createElement("section", {
        className: `relative bg-[#181B1C] min-h-[90vh] flex items-center overflow-hidden hero-section ${active ? 'hero-active' : ''}`
    }, /*#__PURE__*/ React.createElement("div", {
        className: "absolute inset-0 z-0"
    }, /*#__PURE__*/ React.createElement("img", {
        src: "/images/Banner_Home_Principal.png",
        alt: "Producción industrial INCAP",
        className: "w-full h-full object-cover opacity-40 hero-zoom"
    }), /*#__PURE__*/ React.createElement("div", {
        className: "absolute inset-0 bg-gradient-to-r from-[#181B1C] via-[#181B1C]/70 to-transparent"
    }), /*#__PURE__*/ React.createElement("div", {
        className: "absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-[#181B1C]/90 to-transparent z-10"
    })), /*#__PURE__*/ React.createElement("div", {
        className: "relative z-10 max-w-[1536px] mx-auto px-6 sm:px-8 lg:px-12 w-full pt-32"
    }, /*#__PURE__*/ React.createElement("div", {
        className: `max-w-5xl transition-all duration-1000 transform ${active ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'}`
    }, /*#__PURE__*/ React.createElement("div", {
        className: "inline-block bg-white/5 backdrop-blur-3xl border border-white/10 px-8 py-3 rounded-full mb-12 reveal reveal-stagger-1 active"
    }, /*#__PURE__*/ React.createElement("span", {
        className: "text-[#85C639] font-black text-[11px] uppercase tracking-[0.5em] font-sora"
    }, "Respaldo Técnico • Calidad Industrial")), /*#__PURE__*/ React.createElement("h1", {
        className: "text-7xl md:text-9xl lg:text-[11rem] font-black text-white leading-[0.8] mb-12 font-sora tracking-tighter uppercase reveal reveal-stagger-2 active"
    }, "La química que ", /*#__PURE__*/ React.createElement("br", null), /*#__PURE__*/ React.createElement("span", {
        className: "text-[#85C639] italic"
    }, "construye país")), /*#__PURE__*/ React.createElement("p", {
        className: "text-xl md:text-3xl text-slate-400 mb-16 max-w-3xl font-inter font-light leading-relaxed reveal reveal-stagger-3 active"
    }, "Somos el socio estratégico que garantiza la eficiencia de tu planta y la durabilidad de cada producto que fabricas."), /*#__PURE__*/ React.createElement("div", {
        className: "flex flex-wrap gap-6 reveal reveal-stagger-3 active",
        style: {
            transitionDelay: '0.6s'
        }
    }, /*#__PURE__*/ React.createElement("a", {
        href: "/catalog",
        className: "btn-incap btn-primary-incap text-lg px-12 py-6"
    }, "Explorar Catálogo ", /*#__PURE__*/ React.createElement("span", {
        className: "inline-block ml-3"
    }, "→")), /*#__PURE__*/ React.createElement("a", {
        href: `https://wa.me/${WHATSAPP_NUMBER}?text=${waMessage}`,
        target: "_blank",
        rel: "noopener noreferrer",
        className: "btn-incap border-2 border-white/20 text-white text-lg px-12 py-6 hover:bg-white hover:text-black"
    }, "Asesoría Técnica")))));
}
export const layout = {
    areaId: 'content',
    sortOrder: 1
};
