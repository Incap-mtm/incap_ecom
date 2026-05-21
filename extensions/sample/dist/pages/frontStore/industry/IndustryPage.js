import React, { useState, useEffect, useMemo } from 'react';
// Deriva la "familia" de un producto a partir de su nombre.
// Ej: "Super PVA - 20kg" -> "Super PVA"; "Activador I-111 - 750cc" -> "Activador I-111".
function getFamily(name) {
    if (!name)
        return '';
    const idx = name.lastIndexOf(' - ');
    return (idx === -1 ? name : name.substring(0, idx)).trim();
}
const INDUSTRIES_DATA = {
    madera: {
        id: 'madera',
        slugs: ['madera', 'maderas', 'muebles'],
        name: 'Madera y Muebles',
        heroImage: '/images/banners/Banner_Maderas_Muebles.webp',
        icons: ['/images/icons/Icono_Categoria_Madera_Muebles.svg', '/images/icons/Icono_Categoria_Madera_Muebles_2.svg'],
        description: 'Soluciones adhesivas de alta ingeniería para la industria del mueble. De la ebanistería fina a la producción en serie.',
    },
    colchones: {
        id: 'colchones',
        slugs: ['colchones', 'espumas'],
        name: 'Colchones y Espumas',
        heroImage: '/images/banners/Banner_Colchones.webp',
        icons: ['/images/icons/INCAP_Icono_colchones_Espumas.svg', '/images/icons/INCAP_Icono_colchones_Espumas_2.svg'],
        description: 'Ingeniería para el descanso. Adhesivos que optimizan tu línea de producción y protegen la salud de tu equipo.',
    },
    calzado: {
        id: 'calzado',
        slugs: ['calzado', 'marroquineria'],
        name: 'Calzado y Marroquinería',
        heroImage: '/images/banners/Banner_Calzado_Marroquineria.webp',
        icons: ['/images/icons/INCAP_Icono_Calzado_y_Marroquinera_2.svg', '/images/icons/INCAP_Icono_Calzado_y_Marroquinera_2_alt.svg'],
        description: 'El estándar de las grandes fábricas. Un ecosistema completo para reducir garantías.',
    },
    hogar: {
        id: 'hogar',
        slugs: ['hogar', 'multiusos', 'manualidades'],
        name: 'Hogar y Multiusos',
        heroImage: '/images/banners/Banner_Hogar_Multiusos.webp',
        icons: ['/images/icons/INCAP_Icono_Hogar_Manualidades_y_Multisuos.svg', '/images/icons/INCAP_Icono_Hogar_Manualidades_y_Multisuos_2.svg', '/images/icons/INCAP_Icono_Hogar_Manualidades_y_Multisuos_3.svg'],
        description: 'Soluciones versátiles para el día a día. Reparaciones rápidas y proyectos creativos con calidad industrial.',
    }
};
const ConversionFooter = () => (React.createElement("section", { className: "py-16 md:py-32 bg-[#181B1C] relative overflow-hidden font-sora" },
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
                React.createElement("a", { href: "https://wa.me/573123786868", className: "inline-flex bg-[#85C639] text-[#181B1C] px-8 md:px-16 py-5 md:py-8 rounded-full font-black text-base md:text-2xl hover:bg-white hover:scale-105 transition-all duration-500 shadow-[0_20px_50px_-10px_rgba(133,198,57,0.5)] items-center gap-3 md:gap-6 uppercase tracking-tighter" }, "HABLAR CON UN EXPERTO")),
            React.createElement("div", { className: "relative group flex justify-center lg:justify-start" },
                React.createElement("div", { className: "relative max-w-md w-full" },
                    React.createElement("div", { className: "absolute -inset-10 bg-[#2A4899]/20 rounded-[4rem] blur-3xl group-hover:bg-[#2A4899]/30 transition-all duration-700" }),
                    React.createElement("div", { className: "relative rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl" },
                        React.createElement("img", { src: "/images/sections/Fallas_De_Pegue_contacto.png", className: "w-full h-auto object-cover transform scale-90 group-hover:scale-[0.945] transition-transform duration-1000", alt: "Soporte" }),
                        React.createElement("div", { className: "absolute inset-0 bg-gradient-to-t from-[#181B1C]/60 to-transparent" }))))))));
import { useQuery } from 'urql';
const PRODUCTS_QUERY = `
  query {
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
    var _a, _b;
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
    const allCategories = ((_b = (_a = result.data) === null || _a === void 0 ? void 0 : _a.categories) === null || _b === void 0 ? void 0 : _b.items) || [];
    // Extraemos todos los productos que pertenezcan a las categorías (urlKey) mapeadas en nuestros slugs
    const matchedCategories = allCategories.filter((cat) => data.slugs.includes(cat.urlKey));
    const realProductsRaw = matchedCategories.flatMap((cat) => { var _a; return ((_a = cat.products) === null || _a === void 0 ? void 0 : _a.items) || []; });
    // 1. Removemos duplicados (en caso de que un producto esté en múltiples categorías de esta industria)
    // 2. Filtramos los productos para mostrar SÓLO los que estén activos (status === 1)
    const uniqueProducts = Array.from(new Map(realProductsRaw.map((p) => [p.productId, p])).values());
    const realProducts = uniqueProducts.filter((p) => p.status === 1);
    // Calcular familias y conteo por familia
    const families = useMemo(() => {
        const counts = {};
        realProducts.forEach((p) => {
            const fam = getFamily(p.name);
            counts[fam] = (counts[fam] || 0) + 1;
        });
        return Object.entries(counts).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
    }, [realProducts]);
    const [activeFamily, setActiveFamily] = useState(null);
    // Reset filter al cambiar industria
    useEffect(() => { setActiveFamily(null); }, [data.id]);
    const filteredProducts = activeFamily
        ? realProducts.filter((p) => getFamily(p.name) === activeFamily)
        : realProducts;
    return (React.createElement("div", { className: "min-h-screen animate-fadeIn bg-white font-sora -mt-[90px]" },
        React.createElement("div", { className: "relative min-h-[60vh] md:min-h-[70vh] lg:min-h-[80vh] flex items-center overflow-hidden bg-[#181B1C] pt-[90px]" },
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
                !result.fetching && families.length > 1 && (React.createElement("div", { className: "mb-10 md:mb-16" },
                    React.createElement("div", { className: "text-center mb-4" },
                        React.createElement("span", { className: "text-[#85C639] font-black text-[10px] uppercase tracking-[0.4em] font-sora" }, "Filtrar por familia")),
                    React.createElement("div", { className: "flex flex-wrap justify-center gap-2 md:gap-3" },
                        React.createElement("button", { onClick: () => setActiveFamily(null), className: `px-4 md:px-5 py-2 md:py-2.5 rounded-full text-[11px] md:text-xs font-black uppercase tracking-widest font-sora transition-all border-2 ${activeFamily === null
                                ? 'bg-[#2A4899] text-white border-[#2A4899] shadow-lg'
                                : 'bg-white text-slate-600 border-slate-200 hover:border-[#2A4899] hover:text-[#2A4899]'}` },
                            "Todas ",
                            React.createElement("span", { className: "opacity-60 ml-1" },
                                "(",
                                realProducts.length,
                                ")")),
                        families.map(([fam, count]) => (React.createElement("button", { key: fam, onClick: () => setActiveFamily(fam), className: `px-4 md:px-5 py-2 md:py-2.5 rounded-full text-[11px] md:text-xs font-black uppercase tracking-widest font-sora transition-all border-2 ${activeFamily === fam
                                ? 'bg-[#2A4899] text-white border-[#2A4899] shadow-lg'
                                : 'bg-white text-slate-600 border-slate-200 hover:border-[#2A4899] hover:text-[#2A4899]'}` },
                            fam,
                            " ",
                            React.createElement("span", { className: "opacity-60 ml-1" },
                                "(",
                                count,
                                ")"))))))),
                result.fetching ? (React.createElement("div", { className: "text-center py-20 text-slate-400" }, "Cargando portafolio...")) : filteredProducts.length > 0 ? (React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12" }, filteredProducts.map((prod) => {
                    var _a, _b, _c;
                    return (React.createElement("a", { href: `/product/${prod.uuid}`, key: prod.productId, className: "bg-white p-0 rounded-[2rem] md:rounded-[2.5rem] shadow-xl border border-slate-100 hover:shadow-2xl transition-all cursor-pointer group overflow-hidden block" },
                        React.createElement("div", { className: "h-52 md:h-80 overflow-hidden bg-slate-100" }, ((_a = prod.image) === null || _a === void 0 ? void 0 : _a.url) ? (React.createElement("img", { src: prod.image.url, className: "w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000", alt: prod.name })) : (React.createElement("div", { className: "w-full h-full flex items-center justify-center text-slate-300 font-sora font-black uppercase tracking-widest text-base md:text-xl" }, "Sin Imagen"))),
                        React.createElement("div", { className: "p-6 md:p-12" },
                            React.createElement("span", { className: "text-[#2A4899] font-black text-[10px] uppercase tracking-[0.4em] mb-3 block" }, "Especializado"),
                            React.createElement("h3", { className: "text-xl md:text-3xl font-black mb-4 md:mb-6 font-sora text-[#181B1C] group-hover:text-[#2A4899] transition-colors uppercase tracking-tight leading-none" }, prod.name),
                            React.createElement("div", { className: "inline-block px-3 py-1.5 md:px-4 md:py-2 bg-slate-50 rounded-lg text-[10px] font-black text-slate-400 mb-6 md:mb-10 uppercase tracking-[0.3em]" }, ((_c = (_b = prod.price) === null || _b === void 0 ? void 0 : _b.regular) === null || _c === void 0 ? void 0 : _c.text) || 'Consultar'),
                            React.createElement("div", { className: "flex items-center justify-between" },
                                React.createElement("span", { className: "text-[#2A4899] font-black font-sora text-xs md:text-sm uppercase tracking-widest" }, "Ver Ficha T\u00E9cnica"),
                                React.createElement("div", { className: "w-10 h-10 md:w-14 md:h-14 rounded-full border-2 border-slate-100 flex items-center justify-center group-hover:bg-[#2A4899] group-hover:text-white transition-all duration-500" }, "\u2192")))));
                }))) : (React.createElement("div", { className: "text-center py-20 bg-white rounded-[3rem] border border-slate-100 shadow-sm" },
                    React.createElement("p", { className: "text-2xl text-slate-400 font-light mb-6" },
                        "A\u00FAn no hay productos asignados a la industria de ",
                        React.createElement("strong", null, data.name),
                        " en el cat\u00E1logo."),
                    React.createElement("a", { href: "/admin/products", className: "inline-block px-8 py-4 bg-[#2A4899] text-white rounded-full font-black text-xs uppercase tracking-widest hover:bg-[#181B1C] transition-colors" }, "A\u00F1adir Productos"))))),
        React.createElement(ConversionFooter, null)));
}
export const layout = {
    areaId: 'content',
    sortOrder: 1
};
//# sourceMappingURL=IndustryPage.js.map