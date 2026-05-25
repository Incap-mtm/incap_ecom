import React, { useState, useEffect, useMemo } from 'react';
import { useQuery } from 'urql';
import { getFamily } from '../../utils/family.js';
const industries = [
    { id: 'madera', name: 'Madera y Muebles', href: '/industrias/madera', icon: '/images/icons/Icono_Categoria_Madera_Muebles.svg', catUrlKey: 'madera' },
    { id: 'colchones', name: 'Colchones y Espumas', href: '/industrias/colchones', icon: '/images/icons/INCAP_Icono_colchones_Espumas.svg', catUrlKey: 'colchones' },
    { id: 'calzado', name: 'Calzado y Marroquinería', href: '/industrias/calzado', icon: '/images/icons/INCAP_Icono_Calzado_y_Marroquinera_2.svg', catUrlKey: 'calzado' },
    { id: 'hogar', name: 'Hogar y Multiusos', href: '/industrias/hogar', icon: '/images/icons/INCAP_Icono_Hogar_Manualidades_y_Multisuos.svg', catUrlKey: 'multiusos' },
];
const FAMILIES_QUERY = `
  query {
    categories(filters: [{ key: "limit", operation: eq, value: "100" }]) {
      items {
        urlKey
        products(filters: [{ key: "limit", operation: eq, value: "500" }]) {
          items { name status }
        }
      }
    }
  }
`;
export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [mobileExpandedInd, setMobileExpandedInd] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [hoveredInd, setHoveredInd] = useState(industries[0].id);
    const [scrolled, setScrolled] = useState(false);
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    const [result] = useQuery({ query: FAMILIES_QUERY });
    // Construir map: industria.id → [{family, count}]
    const familiesByIndustry = useMemo(() => {
        var _a, _b, _c;
        const out = {};
        const cats = ((_b = (_a = result.data) === null || _a === void 0 ? void 0 : _a.categories) === null || _b === void 0 ? void 0 : _b.items) || [];
        for (const ind of industries) {
            const cat = cats.find((c) => c.urlKey === ind.catUrlKey);
            const products = (((_c = cat === null || cat === void 0 ? void 0 : cat.products) === null || _c === void 0 ? void 0 : _c.items) || []).filter((p) => p.status === 1);
            const counts = {};
            products.forEach((p) => {
                const f = getFamily(p.name);
                if (f)
                    counts[f] = (counts[f] || 0) + 1;
            });
            out[ind.id] = Object.entries(counts)
                .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
                .map(([family, count]) => ({ family, count }));
        }
        return out;
    }, [result.data]);
    return (React.createElement("nav", { className: `incap-navbar ${scrolled ? 'scrolled' : ''}` },
        React.createElement("div", { className: "incap-navbar__inner" },
            React.createElement("a", { href: "/", className: "incap-navbar__logo group" },
                React.createElement("svg", { viewBox: "0 0 231.9 68.2", className: "h-8 md:h-10 w-auto transition-transform duration-500 group-hover:scale-110" },
                    React.createElement("path", { fill: "#FFFFFF", d: "M69.8,40.6v-40H51.2V21h-0.5L41.9,0.6H23.6c-1.8,0-3.3,1.5-3.3,3.3v40h18.5V23.5h0.5l8.8,20.4h18.4 C68.3,43.9,69.8,42.4,69.8,40.6z" }),
                    React.createElement("path", { fill: "#FFFFFF", d: "M0,11.4c0,1.6,1.3,2.9,2.9,2.9H13L0,23.7v17.9c0,1.2,1,2.2,2.2,2.2h16.3V0.6H0V11.4z" }),
                    React.createElement("path", { fill: "#FFFFFF", d: "M112,24.9c-1.9-0.1-3.7,0.9-4.6,2.6c-0.5,0.8-1.1,1.5-1.8,2c-1.5,1-3.6,1.5-6.3,1.5c-3,0-5.3-0.7-6.7-2.1 c-1.4-1.4-2.1-3.6-2.1-6.5s0.7-5.1,2.1-6.5s3.7-2.1,6.7-2.1c2.6,0,4.5,0.5,5.9,1.5c0.7,0.5,1.2,1.2,1.7,2c1,1.7,2.9,2.7,4.8,2.5 l14-1c-0.2-6.3-2.4-11-6.8-14.1C114.6,1.5,108,0,99.1,0c-9.4,0-16.3,1.8-20.6,5.4v0c-4.4,3.6-6.5,9.2-6.5,16.9s2.2,13.3,6.6,16.9 c4.4,3.6,11.3,5.4,20.8,5.4c8.9,0,15.6-1.5,20.1-4.6c4.5-3.1,6.8-7.8,6.9-14.1L112,24.9z" }),
                    React.createElement("path", { fill: "#FFFFFF", d: "M159.3,43.9h20.4L166.5,3.8c-0.6-1.9-2.4-3.1-4.3-3.1h-24.5l-14.2,43.3h20.4l1.5-6.2h12.5L159.3,43.9z M148.1,26.6l3.3-13.6h0.5l3.3,13.6H148.1z" }),
                    React.createElement("path", { fill: "#FFFFFF", d: "M228.4,6.2c-2.4-2.5-5.2-4.1-8.6-4.7c-3.4-0.6-7.8-0.9-13.4-0.9h-24.6h0v43.3h14.7c2.1,0,3.8-1.7,3.8-3.8v-4.8 h6.1c5.6,0,10.1-0.3,13.5-0.8c3.4-0.5,6.2-2.1,8.5-4.6c2.3-2.5,3.5-6.4,3.5-11.8C231.9,12.7,230.8,8.7,228.4,6.2z M211.9,21.9 c-1,0.6-2.8,0.9-5.5,0.9v0h-6.1v-8.7h6.1c2.7,0,4.5,0.3,5.5,0.9c1,0.6,1.5,1.8,1.5,3.4C213.4,20.2,212.9,21.3,211.9,21.9z" }))),
            React.createElement("div", { className: "incap-navbar__links" },
                React.createElement("a", { href: "/quienes-somos", className: "incap-navbar__link" }, "Qui\u00E9nes Somos"),
                React.createElement("a", { href: "/fabricantes", className: "incap-navbar__link" }, "Fabricantes"),
                React.createElement("div", { className: "relative", onMouseEnter: () => setDropdownOpen(true), onMouseLeave: () => setDropdownOpen(false) },
                    React.createElement("a", { href: "#", className: "incap-navbar__link flex items-center gap-2" },
                        "Industrias",
                        React.createElement("svg", { className: `transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`, fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", width: "14", height: "14" },
                            React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2.5, d: "M19 9l-7 7-7-7" }))),
                    React.createElement("div", { className: `fixed top-[80px] bg-white shadow-2xl border-t-4 border-[#2A4899] transition-all duration-300 ${dropdownOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`, style: { left: 'auto', width: '520px' } },
                        React.createElement("div", { className: "flex" },
                            React.createElement("div", { style: { width: '200px', flexShrink: 0, borderRight: '1px solid #e2e8f0', padding: '8px 0' } }, industries.map((ind) => {
                                const active = hoveredInd === ind.id;
                                return (React.createElement("div", { key: ind.id, onMouseEnter: () => setHoveredInd(ind.id), style: {
                                        display: 'flex', alignItems: 'center', gap: '10px',
                                        padding: '10px 14px', cursor: 'pointer',
                                        background: active ? '#2A4899' : 'transparent',
                                        borderLeft: active ? '3px solid #85C639' : '3px solid transparent',
                                        transition: 'all 0.15s',
                                    } },
                                    React.createElement("div", { style: {
                                            width: '30px', height: '30px', flexShrink: 0,
                                            background: active ? 'rgba(255,255,255,0.15)' : '#f1f5f9',
                                            borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            transition: 'background 0.15s',
                                        } },
                                        React.createElement("img", { src: ind.icon, style: { width: '18px', height: '18px', objectFit: 'contain', filter: active ? 'brightness(0) invert(1)' : 'none' }, alt: "" })),
                                    React.createElement("a", { href: ind.href, style: {
                                            fontSize: '11px', fontWeight: 800,
                                            color: active ? '#ffffff' : '#374151',
                                            textTransform: 'uppercase', letterSpacing: '0.06em',
                                            lineHeight: 1.2, textDecoration: 'none', flex: 1,
                                        }, onClick: (e) => e.stopPropagation() }, ind.name),
                                    React.createElement("svg", { width: "12", height: "12", fill: "none", stroke: active ? '#85C639' : '#cbd5e1', viewBox: "0 0 24 24", style: { flexShrink: 0 } },
                                        React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2.5, d: "M9 5l7 7-7 7" }))));
                            })),
                            (() => {
                                const activeInd = industries.find(i => i.id === hoveredInd);
                                const fams = familiesByIndustry[hoveredInd] || [];
                                return (React.createElement("div", { style: { flex: 1, padding: '12px 0', display: 'flex', flexDirection: 'column' } },
                                    React.createElement("div", { style: { padding: '4px 16px 10px', borderBottom: '1px solid #f1f5f9', marginBottom: '4px' } },
                                        React.createElement("span", { style: { fontSize: '9px', fontWeight: 700, color: '#85C639', letterSpacing: '0.25em', textTransform: 'uppercase' } }, "Familias de producto")),
                                    React.createElement("div", { style: { overflowY: 'auto', maxHeight: '280px' } },
                                        result.fetching && fams.length === 0 && (React.createElement("p", { style: { fontSize: '11px', color: '#94a3b8', padding: '8px 16px' } }, "Cargando\u2026")),
                                        !result.fetching && fams.length === 0 && (React.createElement("p", { style: { fontSize: '11px', color: '#94a3b8', padding: '8px 16px' } }, "Sin familias")),
                                        fams.map(({ family, count }) => (React.createElement("a", { key: family, href: `${activeInd.href}?familia=${encodeURIComponent(family)}`, style: {
                                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                                padding: '7px 16px', textDecoration: 'none',
                                                fontSize: '12px', fontWeight: 600, color: '#374151',
                                                transition: 'all 0.12s',
                                            }, onMouseEnter: e => { e.currentTarget.style.background = '#f8faff'; e.currentTarget.style.color = '#2A4899'; }, onMouseLeave: e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#374151'; } },
                                            React.createElement("span", null, family),
                                            React.createElement("span", { style: { fontSize: '10px', color: '#94a3b8', fontWeight: 700 } }, count))))),
                                    React.createElement("div", { style: { borderTop: '1px solid #f1f5f9', marginTop: 'auto', padding: '10px 16px 8px' } },
                                        React.createElement("a", { href: activeInd.href, style: { fontSize: '11px', fontWeight: 700, color: '#2A4899', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' } },
                                            "Ver todo ",
                                            activeInd.name,
                                            React.createElement("svg", { width: "12", height: "12", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
                                                React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2.5, d: "M9 5l7 7-7 7" }))))));
                            })()))),
                React.createElement("a", { href: "/distribuidores", className: "incap-navbar__link" }, "Distribuidores")),
            React.createElement("a", { href: "/catalog", className: "btn-incap btn-primary-incap text-xs py-3 px-6" }, "Solicitar Asesor\u00EDa"),
            React.createElement("button", { className: "incap-navbar__toggle", onClick: () => setMobileOpen(!mobileOpen), "aria-label": "Men\u00FA" },
                React.createElement("svg", { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", width: "28", height: "28" }, mobileOpen
                    ? React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" })
                    : React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 6h16M4 12h16M4 18h16" })))),
        mobileOpen && (React.createElement("div", { className: "incap-navbar__mobile glass-header" },
            React.createElement("div", { className: "pb-6" },
                React.createElement("p", { className: "text-[11px] font-black uppercase tracking-[0.3em] text-white/40 mb-4 px-2" }, "Industrias"),
                React.createElement("div", { className: "grid grid-cols-1 gap-1" }, industries.map((ind) => {
                    const fams = familiesByIndustry[ind.id] || [];
                    const expanded = mobileExpandedInd === ind.id;
                    return (React.createElement("div", { key: ind.id },
                        React.createElement("div", { className: "incap-navbar__mobile-link justify-between", style: { cursor: 'pointer' }, onClick: () => setMobileExpandedInd(expanded ? null : ind.id) },
                            React.createElement("a", { href: ind.href, className: "flex-1 text-white", onClick: (e) => e.stopPropagation() }, ind.name),
                            React.createElement("svg", { className: `h-4 w-4 text-[#85C639] flex-shrink-0 transition-transform ${expanded ? 'rotate-180' : ''}`, fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
                                React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2.5, d: "M19 9l-7 7-7-7" }))),
                        expanded && (React.createElement("div", { className: "pl-4 pb-2" },
                            fams.length === 0 && React.createElement("p", { className: "text-[11px] text-white/40 py-2" }, "Sin familias"),
                            fams.map(({ family, count }) => (React.createElement("a", { key: family, href: `${ind.href}?familia=${encodeURIComponent(family)}`, className: "block text-[12px] text-white/80 hover:text-[#85C639] py-2 font-sora" },
                                family,
                                " ",
                                React.createElement("span", { className: "text-white/40 text-[10px]" },
                                    "(",
                                    count,
                                    ")"))))))));
                }))),
            React.createElement("a", { href: "/quienes-somos", className: "incap-navbar__mobile-link" },
                "Qui\u00E9nes Somos",
                React.createElement("svg", { className: "h-4 w-4 text-[#85C639] flex-shrink-0", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
                    React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2.5, d: "M9 5l7 7-7 7" }))),
            React.createElement("a", { href: "/fabricantes", className: "incap-navbar__mobile-link" },
                "Fabricantes",
                React.createElement("svg", { className: "h-4 w-4 text-[#85C639] flex-shrink-0", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
                    React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2.5, d: "M9 5l7 7-7 7" }))),
            React.createElement("a", { href: "/distribuidores", className: "incap-navbar__mobile-link" },
                "Distribuidores",
                React.createElement("svg", { className: "h-4 w-4 text-[#85C639] flex-shrink-0", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
                    React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2.5, d: "M9 5l7 7-7 7" }))),
            React.createElement("a", { href: "/catalog", className: "btn-incap btn-primary-incap mt-6 justify-center" }, "Solicitar Asesor\u00EDa")))));
}
export const layout = {
    areaId: 'headerTop',
    sortOrder: 1
};
