import React, { useState, useEffect } from 'react';
const WHATSAPP_NUMBER = '5491112345678';
export default function Hero() {
    const [active, setActive] = useState(false);
    const waMessage = encodeURIComponent('Hola INCAP! Quiero solicitar una auditoría técnica en planta.');
    useEffect(() => {
        const timer = setTimeout(() => setActive(true), 100);
        return () => clearTimeout(timer);
    }, []);
    return (React.createElement("section", { className: `relative bg-[#181B1C] min-h-[90vh] flex items-center overflow-hidden hero-section ${active ? 'hero-active' : ''}` },
        React.createElement("div", { className: "absolute inset-0 z-0" },
            React.createElement("img", { src: "/images/banners/Banner_Home_Principal.webp", alt: "Producci\u00F3n industrial INCAP", className: "w-full h-full object-cover opacity-40 hero-zoom" }),
            React.createElement("div", { className: "absolute inset-0 bg-gradient-to-r from-[#181B1C] via-[#181B1C]/70 to-transparent" }),
            React.createElement("div", { className: "absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-[#181B1C]/90 to-transparent z-10" })),
        React.createElement("div", { className: "relative z-10 max-w-[1536px] mx-auto px-6 sm:px-8 lg:px-12 w-full pt-32 pb-[9.6rem]" },
            React.createElement("div", { className: `max-w-5xl transition-all duration-1000 transform ${active ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'}` },
                React.createElement("div", { className: "inline-block bg-white/5 backdrop-blur-3xl border border-white/10 px-8 py-3 rounded-full mb-12 reveal reveal-stagger-1 active" },
                    React.createElement("span", { className: "text-[#85C639] font-black text-[11px] uppercase tracking-[0.5em] font-sora" }, "Respaldo T\u00E9cnico \u2022 Calidad Industrial")),
                React.createElement("h1", { className: "text-[3.15rem] md:text-[4.725rem] lg:text-[9.45rem] font-black text-white leading-[0.8] mb-12 font-sora tracking-tighter uppercase reveal reveal-stagger-2 active" },
                    "La qu\u00EDmica que ",
                    React.createElement("br", null),
                    React.createElement("span", { className: "text-[#85C639] italic" }, "construye pa\u00EDs")),
                React.createElement("p", { className: "text-[1.05rem] md:text-[1.3125rem] text-slate-400 mb-8 max-w-3xl font-inter font-light leading-relaxed reveal reveal-stagger-3 active" }, "Somos el socio estrat\u00E9gico que garantiza la eficiencia de tu planta y la durabilidad de cada producto que fabricas."),
                React.createElement("div", { className: "flex flex-wrap gap-6 reveal reveal-stagger-3 active", style: { transitionDelay: '0.6s' } },
                    React.createElement("a", { href: "/catalog", className: "btn-incap btn-primary-incap text-lg px-12 py-6" },
                        "Explorar Cat\u00E1logo ",
                        React.createElement("span", { className: "inline-block ml-3" }, "\u2192")),
                    React.createElement("a", { href: `https://wa.me/${WHATSAPP_NUMBER}?text=${waMessage}`, target: "_blank", rel: "noopener noreferrer", className: "btn-incap border-2 border-white/20 text-white text-lg px-12 py-6 hover:bg-white hover:text-black" }, "Asesor\u00EDa T\u00E9cnica"))))));
}
export const layout = {
    areaId: 'content',
    sortOrder: 1
};
