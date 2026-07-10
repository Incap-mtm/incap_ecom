import React, { useRef, useEffect } from 'react';
export default function FeaturedProducts({ products }) {
    const items = (products !== null && products !== void 0 ? products : []).filter((p) => Boolean(p));
    const trackRef = useRef(null);
    const pausedRef = useRef(false);
    // Rotación automática muy suave + loop sin cortes (contenido duplicado)
    useEffect(() => {
        const el = trackRef.current;
        if (!el)
            return;
        let raf = 0;
        const speed = 0.35; // px por frame → desplazamiento lento y fluido
        const step = () => {
            if (!pausedRef.current && el.scrollWidth > el.clientWidth + 4) {
                el.scrollLeft += speed;
                const half = el.scrollWidth / 2; // el track está duplicado
                if (el.scrollLeft >= half)
                    el.scrollLeft -= half;
            }
            raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
        return () => cancelAnimationFrame(raf);
    }, [items.length]);
    if (items.length === 0)
        return null;
    const pause = () => { pausedRef.current = true; };
    const resume = () => { pausedRef.current = false; };
    const nudge = (dir) => {
        const el = trackRef.current;
        if (!el)
            return;
        pausedRef.current = true;
        el.scrollBy({ left: dir * 300, behavior: 'smooth' });
        window.setTimeout(() => { pausedRef.current = false; }, 1800);
    };
    // Duplicamos los items para que el loop automático sea continuo/sin salto
    const loop = items.concat(items);
    return (React.createElement("section", { className: "bg-white py-20 md:py-28 px-4 sm:px-6 lg:px-8 font-sora" },
        React.createElement("style", null, `
        .featured-track { scrollbar-width: none; -ms-overflow-style: none; }
        .featured-track::-webkit-scrollbar { display: none; width: 0; height: 0; }
      `),
        React.createElement("div", { className: "w-full max-w-[1920px] mx-auto" },
            React.createElement("div", { className: "flex items-end justify-between mb-10 md:mb-14" },
                React.createElement("div", null,
                    React.createElement("span", { className: "text-[#85C639] font-black text-[10px] md:text-xs uppercase tracking-[0.4em] block mb-3" }, "Lo que recomendamos"),
                    React.createElement("h2", { className: "text-4xl md:text-7xl font-black text-[#181B1C] leading-[0.9] uppercase font-sora" },
                        "Productos ",
                        React.createElement("span", { className: "text-[#2A4899]" }, "Destacados")),
                    React.createElement("div", { className: "w-24 h-2 bg-[#85C639] mt-6" })),
                React.createElement("div", { className: "hidden md:flex gap-3" },
                    React.createElement("button", { type: "button", "aria-label": "Anterior", onClick: () => nudge(-1), className: "w-12 h-12 rounded-full border-2 border-[#2A4899] text-[#2A4899] hover:bg-[#2A4899] hover:text-white transition-all flex items-center justify-center text-xl font-black" }, "\u2190"),
                    React.createElement("button", { type: "button", "aria-label": "Siguiente", onClick: () => nudge(1), className: "w-12 h-12 rounded-full border-2 border-[#2A4899] text-[#2A4899] hover:bg-[#2A4899] hover:text-white transition-all flex items-center justify-center text-xl font-black" }, "\u2192"))),
            React.createElement("div", { ref: trackRef, className: "featured-track flex gap-5 md:gap-6 overflow-x-auto pb-2", onMouseEnter: pause, onMouseLeave: resume, onTouchStart: pause }, loop.map((p, i) => {
                var _a, _b, _c;
                return (React.createElement("a", { key: `${p.uuid}-${i}`, href: p.url, "aria-hidden": i >= items.length ? true : undefined, tabIndex: i >= items.length ? -1 : undefined, className: "group shrink-0 w-[240px] md:w-[280px] bg-white rounded-[1.5rem] md:rounded-[2rem] shadow-lg border border-slate-100 hover:shadow-2xl transition-all overflow-hidden flex flex-col" },
                    React.createElement("div", { className: "h-48 md:h-60 overflow-hidden bg-white flex items-center justify-center p-5" }, ((_a = p.image) === null || _a === void 0 ? void 0 : _a.url) ? (React.createElement("img", { src: p.image.url, alt: p.image.alt || p.name, loading: "lazy", className: "w-full h-full object-contain group-hover:scale-105 transition-transform duration-700" })) : (React.createElement("div", { className: "w-full h-full flex items-center justify-center text-slate-300 font-sora font-black uppercase tracking-widest text-sm" }, "Sin Imagen"))),
                    React.createElement("div", { className: "px-5 md:px-7 pt-5 md:pt-6 pb-6 md:pb-8 flex flex-col flex-grow border-t border-slate-100" },
                        React.createElement("span", { className: "text-[#2A4899] font-black text-[9px] md:text-[10px] uppercase tracking-[0.3em] mb-2 block" }, "Destacado"),
                        React.createElement("h3", { className: "text-base md:text-lg font-black font-sora text-[#181B1C] group-hover:text-[#2A4899] transition-colors uppercase tracking-tight leading-tight mb-3 flex-grow" }, p.name),
                        ((_c = (_b = p.price) === null || _b === void 0 ? void 0 : _b.regular) === null || _c === void 0 ? void 0 : _c.text) && (React.createElement("span", { className: "inline-block text-sm md:text-base font-bold font-sora text-[#2A4899]" }, p.price.regular.text)))));
            })))));
}
export const layout = {
    areaId: 'content',
    sortOrder: 7
};
export const query = `
query FeaturedProductsQuery {
  products: featuredProductsSelected {
    uuid
    name
    url
    image {
      url
      alt
    }
    price {
      regular {
        text
      }
    }
  }
}
`;
