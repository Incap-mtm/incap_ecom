import React, { useState, useEffect, useMemo } from 'react';
import { useQuery } from 'urql';
import { getFamily, getPresentation, pickRepresentative } from '../../../utils/family.js';
const INDUSTRIES_DATA = {
    madera: {
        id: 'madera',
        slugs: ['madera', 'maderas', 'muebles'],
        name: 'Madera y Muebles',
        heroImage: '/images/banners/Banner_Maderas_Muebles.webp',
        icons: ['/images/icons/Icono_Maderas.png', '/images/icons/Icono_Muebles.png'],
        description: 'Soluciones adhesivas de alta ingeniería para la industria del mueble. De la ebanistería fina a la producción en serie.',
    },
    colchones: {
        id: 'colchones',
        slugs: ['colchones', 'espumas'],
        name: 'Colchones y Espumas',
        heroImage: '/images/banners/Banner_Colchones.webp',
        icons: ['/images/icons/Icono_Colchones.png', '/images/icons/icono_Espuma.png'],
        description: 'Ingeniería para el descanso. Adhesivos que optimizan tu línea de producción y protegen la salud de tu equipo.',
    },
    calzado: {
        id: 'calzado',
        slugs: ['calzado', 'marroquineria'],
        name: 'Calzado y Marroquinería',
        heroImage: '/images/banners/Banner_Calzado_Marroquineria.webp',
        icons: ['/images/icons/Icono_Calzado.png', '/images/icons/Icono_Marroquinería.png'],
        description: 'El estándar de las grandes fábricas. Un ecosistema completo para reducir garantías.',
    },
    hogar: {
        id: 'hogar',
        slugs: ['hogar', 'multiusos', 'manualidades'],
        name: 'Hogar y Multiusos',
        heroImage: '/images/banners/Banner_Hogar_Multiusos.webp',
        icons: ['/images/icons/Icono_Hogar.png', '/images/icons/Icono_manualidades.png', '/images/icons/Icono_Multiusos.png'],
        description: 'Soluciones versátiles para el día a día. Reparaciones rápidas y proyectos creativos con calidad industrial.',
    }
};
const ConversionFooter = ({ whatsappNumber }) => (React.createElement("section", { className: "py-16 md:py-32 bg-[#181B1C] relative overflow-hidden font-sora" },
    React.createElement("div", { className: "max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10" },
        React.createElement("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 items-center" },
            React.createElement("div", { className: "text-left" },
                React.createElement("div", { className: "inline-block bg-[#85C639]/10 border border-[#85C639]/20 px-4 py-1.5 md:px-6 md:py-2 rounded-lg mb-6 md:mb-10" },
                    React.createElement("span", { className: "text-[#85C639] font-black text-xs uppercase tracking-[0.4em]" }, "Soporte T\u00E9cnico")),
                React.createElement("h2", { className: "text-3xl sm:text-5xl md:text-8xl font-black font-sora mb-6 md:mb-10 uppercase tracking-tighter leading-none text-white" },
                    "\u00BFFallas de ",
                    React.createElement("br", null),
                    React.createElement("span", { className: "text-[#85C639]" }, "Pegue?")),
                React.createElement("p", { className: "text-base md:text-2xl text-slate-400 mb-8 md:mb-16 font-inter font-light max-w-2xl leading-relaxed" }, "Recibe un diagn\u00F3stico t\u00E9cnico gratuito en menos de 24 horas. Protege la calidad de tu producto final con expertos de planta."),
                React.createElement("a", { href: `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Quiero más información')}`, className: "inline-flex bg-[#85C639] text-[#181B1C] px-8 md:px-16 py-5 md:py-8 rounded-full font-black text-base md:text-2xl hover:bg-white hover:scale-105 transition-all duration-500 shadow-[0_20px_50px_-10px_rgba(133,198,57,0.5)] items-center gap-3 md:gap-6 uppercase tracking-tighter" }, "HABLAR CON UN EXPERTO")),
            React.createElement("div", { className: "relative group flex justify-center lg:justify-start" },
                React.createElement("div", { className: "relative max-w-md w-full" },
                    React.createElement("div", { className: "absolute -inset-10 bg-[#2A4899]/20 rounded-[4rem] blur-3xl group-hover:bg-[#2A4899]/30 transition-all duration-700" }),
                    React.createElement("div", { className: "relative rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl" },
                        React.createElement("img", { src: "/images/sections/Fallas_De_Pegue_contacto.png", className: "w-full h-auto object-cover transform scale-90 group-hover:scale-[0.945] transition-transform duration-1000", alt: "Soporte" }),
                        React.createElement("div", { className: "absolute inset-0 bg-gradient-to-t from-[#181B1C]/60 to-transparent" }))))))));
const PRODUCTS_QUERY = `
  query {
    setting {
      storeWhatsappNumber
    }
    categories(filters: [{ key: "limit", operation: eq, value: "100" }]) {
      items {
        urlKey
        products(filters: [{ key: "limit", operation: eq, value: "500" }]) {
          items {
            productId
            uuid
            name
            status
            price {
              regular { text }
            }
            image { url alt }
            url
          }
        }
      }
    }
  }
`;
export default function IndustryPage() {
    var _a, _b, _c, _d, _e;
    const [data, setData] = useState(INDUSTRIES_DATA.madera);
    useEffect(() => {
        // Extract ID from the path: /industrias/madera -> madera
        const pathParts = window.location.pathname.split('/');
        const id = pathParts[pathParts.length - 1] || 'madera';
        if (INDUSTRIES_DATA[id]) {
            setData(INDUSTRIES_DATA[id]);
        }
    }, []);
    const [result] = useQuery({
        query: PRODUCTS_QUERY,
        requestPolicy: 'network-only' // Fuerza a ignorar el caché y siempre pedir los datos más recientes a la base de datos
    });
    const whatsappNumber = (_c = (_b = (_a = result.data) === null || _a === void 0 ? void 0 : _a.setting) === null || _b === void 0 ? void 0 : _b.storeWhatsappNumber) !== null && _c !== void 0 ? _c : '573002171521';
    const allCategories = ((_e = (_d = result.data) === null || _d === void 0 ? void 0 : _d.categories) === null || _e === void 0 ? void 0 : _e.items) || [];
    // Extraemos todos los productos que pertenezcan a las categorías (urlKey) mapeadas en nuestros slugs
    const matchedCategories = allCategories.filter((cat) => data.slugs.includes(cat.urlKey));
    const realProductsRaw = matchedCategories.flatMap((cat) => { var _a; return ((_a = cat.products) === null || _a === void 0 ? void 0 : _a.items) || []; });
    // 1. Removemos duplicados (en caso de que un producto esté en múltiples categorías de esta industria)
    // 2. Filtramos los productos para mostrar SÓLO los que estén activos (status === 1)
    const uniqueProducts = Array.from(new Map(realProductsRaw.map((p) => [p.productId, p])).values());
    const realProducts = uniqueProducts.filter((p) => p.status === 1);
    // Agrupar productos por familia — una card por familia
    const familyGroups = useMemo(() => {
        const map = new Map();
        realProducts.forEach((p) => {
            const fam = getFamily(p.name);
            if (!map.has(fam))
                map.set(fam, []);
            map.get(fam).push(p);
        });
        return Array.from(map.entries())
            .map(([family, products]) => ({
            family,
            products,
            representative: pickRepresentative(products),
        }))
            .sort((a, b) => b.products.length - a.products.length || a.family.localeCompare(b.family));
    }, [realProducts]);
    const families = familyGroups.map(g => [g.family, g.products.length]);
    const [activeFamily, setActiveFamily] = useState('');
    useEffect(() => {
        try {
            const params = new URLSearchParams(window.location.search);
            setActiveFamily(params.get('familia') || '');
        }
        catch (_a) {
            setActiveFamily('');
        }
    }, [data.id]);
    const filteredGroups = activeFamily
        ? familyGroups.filter(g => g.family === activeFamily)
        : familyGroups;
    return (React.createElement("div", { className: "min-h-screen animate-fadeIn bg-white font-sora -mt-[124px]" },
        React.createElement("div", { className: "relative min-h-[60vh] md:min-h-[70vh] lg:min-h-[80vh] flex items-center overflow-hidden bg-[#181B1C] pt-[124px]" },
            React.createElement("img", { src: data.heroImage, className: "absolute inset-0 w-full h-full object-cover object-center opacity-50", alt: data.name }),
            React.createElement("div", { className: "absolute inset-0 bg-gradient-to-t from-[#181B1C] via-[#181B1C]/30 to-transparent" }),
            React.createElement("div", { className: "absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-[#181B1C]/80 to-transparent z-10" }),
            React.createElement("div", { className: "max-w-[1536px] mx-auto w-full px-4 sm:px-6 lg:px-8 relative z-20" },
                React.createElement("div", { className: "flex items-center gap-6 mb-6" },
                    React.createElement("span", { className: "text-[#85C639] font-black uppercase tracking-[0.5em] text-xs font-sora" }, "Sistemas de Adherencia"),
                    React.createElement("div", { className: "flex gap-3" }, data.icons && data.icons.map((icon, i) => (React.createElement("div", { key: i, className: "bg-[#2A4899] rounded-xl p-2.5 w-14 h-14 flex items-center justify-center shadow-lg" },
                        React.createElement("img", { src: icon, className: "w-full h-full object-contain", alt: "" })))))),
                React.createElement("h1", { className: "text-4xl sm:text-6xl md:text-9xl font-black text-white font-sora mb-4 md:mb-8 leading-none uppercase tracking-tighter" }, data.name),
                React.createElement("p", { className: "text-base sm:text-xl md:text-3xl text-slate-300 max-w-4xl font-inter font-light leading-relaxed" }, data.description))),
        React.createElement("section", { className: "py-16 md:py-32 bg-slate-50" },
            React.createElement("div", { className: "max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8" },
                React.createElement("h2", { className: "text-3xl sm:text-5xl md:text-6xl font-black text-[#181B1C] font-sora mb-8 md:mb-12 uppercase text-center tracking-tighter" }, "Portafolio T\u00E9cnico"),
                !result.fetching && familyGroups.length > 0 && (React.createElement("div", { style: { marginBottom: '40px' } },
                    React.createElement("div", { style: { display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '12px 16px' } },
                        React.createElement("span", { style: { fontSize: '9px', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.25em', textTransform: 'uppercase', flexShrink: 0 } }, "Filtrar"),
                        React.createElement("div", { style: { width: '1px', height: '20px', background: '#e2e8f0', flexShrink: 0 } }),
                        families.length > 1 && (React.createElement("div", { style: { display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 } },
                            React.createElement("div", { style: { position: 'relative' } },
                                React.createElement("select", { value: activeFamily, onChange: e => setActiveFamily(e.target.value), style: {
                                        appearance: 'none', WebkitAppearance: 'none',
                                        padding: '7px 32px 7px 12px', borderRadius: '8px', border: 'none',
                                        background: activeFamily ? '#2A4899' : '#f8fafc',
                                        color: activeFamily ? '#fff' : '#374151',
                                        fontSize: '12px', fontWeight: 700, cursor: 'pointer',
                                        fontFamily: 'Sora, sans-serif', outline: 'none',
                                    } },
                                    React.createElement("option", { value: "" }, "Todos los productos"),
                                    families.map(([fam, count]) => (React.createElement("option", { key: fam, value: fam },
                                        fam,
                                        " (",
                                        count,
                                        " presentaciones)")))),
                                React.createElement("svg", { style: { position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }, width: "10", height: "10", fill: "none", stroke: activeFamily ? '#fff' : '#94a3b8', viewBox: "0 0 24 24" },
                                    React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2.5, d: "M19 9l-7 7-7-7" }))),
                            activeFamily && (React.createElement("button", { onClick: () => setActiveFamily(''), style: { width: '22px', height: '22px', borderRadius: '50%', border: 'none', background: '#e2e8f0', color: '#64748b', cursor: 'pointer', fontSize: '13px', lineHeight: 1, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 } }, "\u00D7")))),
                        React.createElement("span", { style: { marginLeft: 'auto', fontSize: '11px', color: '#94a3b8', fontWeight: 600 } },
                            filteredGroups.length,
                            " familia",
                            filteredGroups.length !== 1 ? 's' : '')))),
                result.fetching ? (React.createElement("div", { className: "text-center py-20 text-slate-400" }, "Cargando portafolio...")) : filteredGroups.length > 0 ? (React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12" }, filteredGroups.map((group) => {
                    var _a;
                    const rep = group.representative;
                    const firstUrl = `/product/${rep.uuid}`;
                    const sortedProducts = [...group.products].sort((a, b) => {
                        const num = (s) => parseFloat(s.replace(/[^\d.]/g, '')) || 0;
                        return num(getPresentation(a.name)) - num(getPresentation(b.name));
                    });
                    return (React.createElement("div", { key: group.family, className: "bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-xl border border-slate-100 hover:shadow-2xl transition-all overflow-hidden" },
                        React.createElement("a", { href: firstUrl, className: "block" },
                            React.createElement("div", { className: "h-52 md:h-64 overflow-hidden bg-white flex items-center justify-center p-4" }, ((_a = rep.image) === null || _a === void 0 ? void 0 : _a.url) ? (React.createElement("img", { src: rep.image.url, className: "w-full h-full object-contain hover:scale-105 transition-transform duration-700", alt: group.family })) : (React.createElement("div", { className: "w-full h-full flex items-center justify-center text-slate-300 font-sora font-black uppercase tracking-widest text-base md:text-xl" }, "Sin Imagen"))),
                            React.createElement("div", { className: "px-6 md:px-10 pt-6 md:pt-8" },
                                React.createElement("span", { className: "text-[#2A4899] font-black text-[10px] uppercase tracking-[0.4em] mb-2 block" }, "Especializado"),
                                React.createElement("h3", { className: "text-xl md:text-2xl font-black mb-3 font-sora text-[#181B1C] hover:text-[#2A4899] transition-colors uppercase tracking-tight leading-none" }, group.family))),
                        React.createElement("div", { className: "px-6 md:px-10 pb-6 md:pb-10" },
                            React.createElement("p", { style: { fontSize: '9px', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '10px' } }, "Presentaciones"),
                            React.createElement("div", { style: { display: 'flex', flexWrap: 'wrap', gap: '6px' } }, sortedProducts.map((p) => (React.createElement("a", { key: p.productId, href: `/product/${p.uuid}`, style: {
                                    display: 'inline-block',
                                    padding: '4px 10px',
                                    background: '#f1f5f9',
                                    color: '#2A4899',
                                    borderRadius: '6px',
                                    fontSize: '11px',
                                    fontWeight: 700,
                                    fontFamily: 'Sora, sans-serif',
                                    textDecoration: 'none',
                                    border: '1.5px solid transparent',
                                    transition: 'all 0.15s',
                                }, onMouseOver: (e) => {
                                    e.currentTarget.style.background = '#2A4899';
                                    e.currentTarget.style.color = '#fff';
                                }, onMouseOut: (e) => {
                                    e.currentTarget.style.background = '#f1f5f9';
                                    e.currentTarget.style.color = '#2A4899';
                                } }, getPresentation(p.name))))))));
                }))) : (React.createElement("div", { className: "text-center py-20 bg-white rounded-[3rem] border border-slate-100 shadow-sm" },
                    React.createElement("p", { className: "text-2xl text-slate-400 font-light mb-6" },
                        "A\u00FAn no hay productos asignados a la industria de ",
                        React.createElement("strong", null, data.name),
                        " en el cat\u00E1logo."),
                    React.createElement("a", { href: "/admin/products", className: "inline-block px-8 py-4 bg-[#2A4899] text-white rounded-full font-black text-xs uppercase tracking-widest hover:bg-[#181B1C] transition-colors" }, "A\u00F1adir Productos"))))),
        React.createElement(ConversionFooter, { whatsappNumber: whatsappNumber })));
}
export const layout = {
    areaId: 'content',
    sortOrder: 1
};
//# sourceMappingURL=IndustryPage.js.map