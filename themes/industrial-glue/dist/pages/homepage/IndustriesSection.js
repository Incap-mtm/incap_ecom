import React from 'react';
import { useReveal } from '../../hooks/useReveal';
const industries = [
    {
        id: 'madera',
        title: 'Madera y Muebles',
        description: '¿Tu PVA se quiebra en las uniones? Tenemos la viscosidad exacta para tu proceso de prensado en frío o caliente.',
        href: '/industrias/madera',
        image: '/images/sections/Categoria_Maderas_Muebles_Seccion_Home.webp',
        icons: [
            { src: '/images/icons/Icono_Maderas.webp', label: 'Maderas' },
            { src: '/images/icons/Icono_Muebles.webp', label: 'Muebles' }
        ],
    },
    {
        id: 'colchones',
        title: 'Colchones y Espumas',
        description: 'Tus operarios llevan 8 horas al día con la pistola en la mano. Tenemos fórmulas LT que no comprometen su salud ni el rendimiento de pegue.',
        href: '/industrias/colchones',
        image: '/images/sections/Colchones_Seccion_Home.webp',
        icons: [
            { src: '/images/icons/Icono_Colchones.webp', label: 'Colchones' },
            { src: '/images/icons/icono_Espuma.webp', label: 'Espumas' }
        ],
    },
    {
        id: 'calzado',
        title: 'Calzado y Marroquinería',
        description: 'Del aparado a la suela: un solo proveedor con el adhesivo correcto para cada etapa de tu línea.',
        href: '/industrias/calzado',
        image: '/images/sections/Calzado_Marroquinera_Seccion_Home.webp',
        icons: [
            { src: '/images/icons/Icono_Calzado.webp', label: 'Calzado' },
            { src: '/images/icons/Icono_Marroquineria.webp', label: 'Marroquinería' },
        ],
    },
    {
        id: 'hogar',
        title: 'Hogar y Multiusos',
        description: 'Soluciones versátiles para reparaciones del hogar y proyectos creativos.',
        href: '/industrias/hogar',
        image: '/images/sections/Hogar_Multiusos_Seccion_Home.webp',
        icons: [
            { src: '/images/icons/Icono_Hogar.webp', label: 'Hogar' },
            { src: '/images/icons/Icono_manualidades.webp', label: 'Manualidades' },
            { src: '/images/icons/Icono_Multiusos.webp', label: 'Multiusos' }
        ],
    },
];
export default function IndustriesSection() {
    const reveal = useReveal();
    return (React.createElement("section", { className: `bg-[#f8f9fa] py-24 px-4 sm:px-6 lg:px-8 ${reveal.className}`, ref: reveal.ref },
        React.createElement("div", { className: "w-full max-w-[1920px] mx-auto" },
            React.createElement("div", { className: "flex flex-col md:flex-row md:items-end md:justify-between mb-12" },
                React.createElement("div", null,
                    React.createElement("h2", { className: "text-5xl md:text-7xl font-black text-[#181B1C] leading-[0.9] uppercase font-sora" },
                        "INDUSTRIAS QUE",
                        React.createElement("br", null),
                        React.createElement("span", { className: "text-[#2A4899]" }, "IMPULSAMOS")),
                    React.createElement("div", { className: "w-24 h-2 bg-[#85C639] mt-6" })),
                React.createElement("a", { href: "/catalog", className: "mt-8 md:mt-0 text-[10px] font-black text-[#2A4899] hover:text-[#85C639] tracking-[0.2em] uppercase flex items-center gap-2 transition-all group" },
                    "VER TODO EL PORTAFOLIO",
                    React.createElement("span", { className: "group-hover:translate-x-2 transition-transform" }, "\u2192"))),
            React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" }, industries.map((ind, idx) => (React.createElement("div", { key: ind.id, className: `flex flex-col bg-white rounded-3xl overflow-hidden shadow-xl shadow-slate-200/40 border border-slate-100 reveal reveal-stagger-${idx + 1} active group` },
                React.createElement("div", { className: "relative h-[280px] overflow-hidden bg-slate-100" },
                    React.createElement("img", { src: ind.image, alt: ind.title, loading: "lazy", className: "w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" }),
                    React.createElement("div", { className: "absolute inset-0 bg-gradient-to-t from-[#181B1C]/90 via-[#181B1C]/20 to-transparent" }),
                    React.createElement("div", { className: "absolute top-0 left-6 bg-[#2A4899] w-[72px] rounded-b-2xl flex flex-col items-center py-5 gap-5 shadow-lg z-10" }, ind.icons.map((icon, i) => (React.createElement("img", { key: i, src: icon.src, loading: "lazy", className: "w-8 h-8 object-contain", alt: icon.label })))),
                    React.createElement("div", { className: "absolute bottom-5 left-6 right-6 z-10" },
                        React.createElement("h3", { className: "text-xl md:text-2xl font-black text-white uppercase leading-tight tracking-tight font-sora shadow-sm" }, ind.title))),
                React.createElement("div", { className: "p-6 flex flex-col flex-1" },
                    React.createElement("p", { className: "text-slate-500 text-xs md:text-sm font-medium leading-relaxed mb-6 flex-1" }, ind.description),
                    React.createElement("a", { href: ind.href, className: "w-full py-3 border border-[#2A4899] text-[#2A4899] rounded-xl text-[10px] md:text-xs font-bold uppercase tracking-widest text-center hover:bg-[#2A4899] hover:text-white transition-all duration-300" }, "VER SOLUCIONES ESPECIALIZADAS")))))))));
}
export const layout = {
    areaId: 'content',
    sortOrder: 5
};
