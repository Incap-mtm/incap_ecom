import React from 'react';
import { useReveal } from '../../hooks/useReveal';
const solutions = [
    {
        icon: '/images/icons/INCAP_Icono_Calzado_y_Marroquinera_2.svg',
        name: 'Calzado',
        description: 'Flexibilidad, alta resistencia a la tracción y pegado duradero en cuero, sintéticos y suelas.',
    },
    {
        icon: '/images/icons/INCAP_Icono_Calzado_y_Marroquinera_2_alt.svg',
        name: 'Marroquinería y Cuero',
        description: 'Para bolsos, cinturones, billeteras y artículos de moda en cuero natural y sintético.',
    },
    {
        icon: '/images/icons/INCAP_Icono_colchones_Espumas_2.svg',
        name: 'Colchones',
        description: 'Uniones silenciosas y alta durabilidad para capas, filtros y componentes de colchones.',
    },
    {
        icon: '/images/icons/INCAP_Icono_colchones_Espumas_alt.svg',
        name: 'Espumas y Poliuretano',
        description: 'Unión de espumas que mantienen la suavidad y resiliencia original del material.',
    },
    {
        icon: '/images/icons/INCAP_Icono_Hogar_Manualidades_y_Multisuos.svg',
        name: 'Hogar y Reparaciones',
        description: 'Prácticos y seguros para bricolaje, mantenimiento y mejoras locativas del hogar.',
    },
    {
        icon: '/images/icons/Icono_Categoria_Madera_Muebles.svg',
        name: 'Maderas y Carpintería',
        description: 'Familia PVA de alta resistencia para muebles, tableros, listones y proyectos estructurales.',
    },
    {
        icon: '/images/icons/Icono_Categoria_Madera_Muebles_2.svg',
        name: 'Fabricación de Muebles',
        description: 'Soluciones para enchapes, postformados y acabados con alta exigencia mecánica.',
    },
    {
        icon: '/images/icons/INCAP_Icono_Hogar_Manualidades_y_Multisuos_2.svg',
        name: 'Manualidades y Artesanías',
        description: 'Sin solventes tóxicos. Ideales para proyectos escolares, diseño artístico y creativos.',
    },
    {
        icon: '/images/icons/INCAP_Icono_Hogar_Manualidades_y_Multisuos_3.svg',
        name: 'Multiusos y Universales',
        description: 'Amplio espectro: plásticos, metales, maderas y cauchos en un solo producto.',
    },
];
export default function SolucionesPegado() {
    const reveal = useReveal();
    return (React.createElement("section", { className: `bg-[#181B1C] py-24 px-4 sm:px-6 lg:px-8 ${reveal.className}`, ref: reveal.ref },
        React.createElement("div", { className: "w-full max-w-[1920px] mx-auto" },
            React.createElement("div", { className: "text-center mb-16" },
                React.createElement("p", { className: "text-[#85C639] font-black text-[11px] uppercase tracking-[0.4em] font-sora mb-4" }, "Gu\u00EDa t\u00E9cnica de aplicaci\u00F3n"),
                React.createElement("h2", { className: "text-4xl md:text-6xl font-black text-white leading-tight uppercase font-sora" },
                    "ENCUENTRA LA SOLUCI\u00D3N",
                    React.createElement("br", null),
                    React.createElement("span", { className: "text-[#2A4899]" }, "IDEAL PARA TU SECTOR")),
                React.createElement("div", { className: "w-24 h-2 bg-[#85C639] mt-6 mx-auto" }),
                React.createElement("p", { className: "text-slate-400 text-sm md:text-base font-inter font-light mt-6 max-w-2xl mx-auto leading-relaxed" }, "Fabricamos soluciones espec\u00EDficas para optimizar tus procesos productivos. Identifica el icono de tu sector para elegir el adhesivo correcto.")),
            React.createElement("div", { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto" }, solutions.map((sol, i) => (React.createElement("div", { key: i, className: `flex flex-col items-center text-center bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-[#85C639]/40 transition-all duration-300 reveal reveal-stagger-${(i % 3) + 1} active` },
                React.createElement("div", { className: "w-16 h-16 mb-4 bg-[#2A4899] rounded-2xl flex items-center justify-center p-3 flex-shrink-0" },
                    React.createElement("img", { src: sol.icon, alt: sol.name, className: "w-full h-full object-contain" })),
                React.createElement("h3", { className: "text-white font-black text-sm uppercase tracking-wide font-sora mb-2 leading-tight" }, sol.name),
                React.createElement("p", { className: "text-slate-400 text-xs font-inter leading-relaxed" }, sol.description))))))));
}
export const layout = {
    areaId: 'content',
    sortOrder: 7,
};
