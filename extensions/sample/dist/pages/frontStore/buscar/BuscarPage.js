import React, { useState, useEffect, useMemo } from 'react';
import { useQuery } from 'urql';
import { getFamily, pickRepresentative } from '../../../utils/family.js';
function buildQuery(term) {
    const safe = term.replace(/"/g, '').replace(/%/g, '');
    return `
    query {
      setting { storeWhatsappNumber }
      products(filters: [
        { key: "fulltext", operation: eq, value: "${safe}" }
        { key: "limit",  operation: eq,    value: "500" }
        { key: "status", operation: eq,    value: "1" }
      ]) {
        items {
          productId
          name
          sku
          url
          image { url alt }
        }
        total
      }
    }
  `;
}
const AZUL = '#2A4899';
const VERDE = '#85C639';
export default function BuscarPage() {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const [keyword, setKeyword] = useState('');
    const [inputValue, setInputValue] = useState('');
    useEffect(() => {
        try {
            const q = new URLSearchParams(window.location.search).get('q') || '';
            setKeyword(q);
            setInputValue(q);
        }
        catch ( /* SSR guard */_a) { /* SSR guard */ }
    }, []);
    const [result] = useQuery({
        query: buildQuery(keyword),
        pause: keyword.length < 2,
        requestPolicy: 'cache-and-network',
    });
    const whatsapp = (_c = (_b = (_a = result.data) === null || _a === void 0 ? void 0 : _a.setting) === null || _b === void 0 ? void 0 : _b.storeWhatsappNumber) !== null && _c !== void 0 ? _c : '573002171521';
    const items = ((_e = (_d = result.data) === null || _d === void 0 ? void 0 : _d.products) === null || _e === void 0 ? void 0 : _e.items) || [];
    const total = (_h = (_g = (_f = result.data) === null || _f === void 0 ? void 0 : _f.products) === null || _g === void 0 ? void 0 : _g.total) !== null && _h !== void 0 ? _h : 0;
    const hasKeyword = keyword.length >= 2;
    // Ordenar por relevancia: empieza con → contiene → resto
    const sortedItems = useMemo(() => {
        if (!keyword || items.length === 0)
            return items;
        const lower = keyword.toLowerCase().trim();
        return [...items].sort((a, b) => {
            const an = (a.name || '').toLowerCase();
            const bn = (b.name || '').toLowerCase();
            const aStarts = an.startsWith(lower) ? 0 : 1;
            const bStarts = bn.startsWith(lower) ? 0 : 1;
            const aContains = an.includes(lower) ? 0 : 1;
            const bContains = bn.includes(lower) ? 0 : 1;
            return (aStarts - bStarts) || (aContains - bContains) || an.localeCompare(bn);
        });
    }, [items, keyword]);
    const familyGroups = useMemo(() => {
        const map = new Map();
        sortedItems.forEach((p) => {
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
            .sort((a, b) => a.family.localeCompare(b.family));
    }, [sortedItems]);
    const handleSubmit = (e) => {
        e.preventDefault();
        const q = inputValue.trim();
        if (q.length < 2)
            return;
        setKeyword(q);
        try {
            window.history.pushState({}, '', `/buscar?q=${encodeURIComponent(q)}`);
        }
        catch ( /* */_a) { /* */ }
    };
    return (React.createElement("div", { className: "min-h-screen bg-white font-sora" },
        React.createElement("section", { style: { background: `linear-gradient(160deg, ${AZUL} 0%, #1e3576 100%)`, padding: '32px 0 34px' } },
            React.createElement("div", { style: { maxWidth: '1536px', margin: '0 auto', padding: '0 2rem' } },
                React.createElement("p", { style: { fontSize: '0.65rem', fontWeight: 800, color: VERDE, letterSpacing: '0.4em', textTransform: 'uppercase', marginBottom: '10px' } }, "Resultados de b\u00FAsqueda"),
                hasKeyword ? (React.createElement("div", { style: { display: 'flex', alignItems: 'baseline', gap: '18px', flexWrap: 'wrap' } },
                    React.createElement("h1", { style: { fontSize: 'clamp(1.9rem, 4.5vw, 3.2rem)', fontWeight: 900, color: '#fff', lineHeight: 1.05, textTransform: 'uppercase', letterSpacing: '-0.03em', margin: 0 } },
                        React.createElement("span", { style: { color: VERDE } },
                            "\u201C",
                            keyword,
                            "\u201D")),
                    !result.fetching && (React.createElement("span", { style: { fontSize: '0.85rem', fontWeight: 600, color: '#c7d2fe', fontFamily: "'Inter', sans-serif" } },
                        total,
                        " ",
                        total === 1 ? 'producto' : 'productos')))) : (React.createElement(React.Fragment, null,
                    React.createElement("h1", { style: { fontSize: 'clamp(1.9rem, 4.5vw, 3.2rem)', fontWeight: 900, color: '#fff', lineHeight: 1.05, textTransform: 'uppercase', letterSpacing: '-0.03em', margin: '0 0 22px' } }, "Buscador de productos"),
                    React.createElement("form", { onSubmit: handleSubmit, style: { display: 'flex', gap: '10px', maxWidth: '600px' } },
                        React.createElement("input", { type: "text", value: inputValue, onChange: e => setInputValue(e.target.value), placeholder: "Nombre, uso, aplicaci\u00F3n\u2026", style: { flex: 1, padding: '13px 16px', borderRadius: '10px', border: 'none', outline: 'none', fontSize: '0.9rem', fontFamily: "'Inter', sans-serif", fontWeight: 500, color: '#1e293b', boxShadow: '0 4px 14px rgba(0,0,0,0.12)' } }),
                        React.createElement("button", { type: "submit", style: { background: VERDE, color: '#181B1C', border: 'none', borderRadius: '10px', padding: '13px 26px', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer', whiteSpace: 'nowrap' } }, "Buscar")))))),
        React.createElement("section", { style: { maxWidth: '1536px', margin: '0 auto', padding: '40px 2rem 72px' } },
            hasKeyword && result.fetching && (React.createElement("p", { style: { color: '#94a3b8', fontSize: '0.9rem', fontFamily: "'Inter', sans-serif" } }, "Buscando\u2026")),
            hasKeyword && !result.fetching && items.length === 0 && (React.createElement("div", { style: { textAlign: 'center', padding: '72px 0' } },
                React.createElement("svg", { width: "52", height: "52", fill: "none", stroke: "#cbd5e1", viewBox: "0 0 24 24", style: { margin: '0 auto 18px', display: 'block' } },
                    React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.5, d: "M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" })),
                React.createElement("p", { style: { fontSize: '1.15rem', fontWeight: 700, color: '#1e293b', marginBottom: '8px' } },
                    "Sin resultados para \u201C",
                    keyword,
                    "\u201D"),
                React.createElement("p", { style: { color: '#64748b', fontFamily: "'Inter', sans-serif", fontSize: '0.9rem' } },
                    "Prob\u00E1 con otro t\u00E9rmino o",
                    ' ',
                    React.createElement("a", { href: `https://wa.me/${whatsapp}?text=${encodeURIComponent(`Busco información sobre: ${keyword}`)}`, style: { color: AZUL, fontWeight: 600 } }, "consult\u00E1 con un asesor")))),
            hasKeyword && !result.fetching && items.length > 0 && (React.createElement("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: '24px' } }, familyGroups.map(({ family, products, representative }) => {
                var _a;
                return (React.createElement("a", { key: family, href: representative.url, style: { textDecoration: 'none', display: 'flex', flexDirection: 'column', borderRadius: '18px', overflow: 'hidden', border: '1px solid #e8edf5', background: '#fff', boxShadow: '0 2px 10px rgba(42,72,153,0.05)', transition: 'box-shadow 0.2s, transform 0.2s' }, onMouseEnter: e => { const el = e.currentTarget; el.style.boxShadow = '0 14px 34px rgba(42,72,153,0.15)'; el.style.transform = 'translateY(-3px)'; }, onMouseLeave: e => { const el = e.currentTarget; el.style.boxShadow = '0 2px 10px rgba(42,72,153,0.05)'; el.style.transform = 'none'; } },
                    React.createElement("div", { style: { aspectRatio: '1', background: '#fff', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '18px', borderBottom: '1px solid #f1f5f9' } }, ((_a = representative.image) === null || _a === void 0 ? void 0 : _a.url)
                        ? React.createElement("img", { src: representative.image.url, alt: representative.image.alt || family, loading: "lazy", style: { width: '100%', height: '100%', objectFit: 'contain' } })
                        : React.createElement("svg", { width: "44", height: "44", fill: "none", stroke: "#cbd5e1", viewBox: "0 0 24 24" },
                            React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.5, d: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 20M6 8h.01M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2z" }))),
                    React.createElement("div", { style: { padding: '16px 18px 18px', display: 'flex', flexDirection: 'column', flexGrow: 1 } },
                        React.createElement("p", { style: { margin: '0 0 3px', fontSize: '0.95rem', fontWeight: 800, color: '#181B1C', lineHeight: 1.2, textTransform: 'uppercase', letterSpacing: '-0.01em' } }, family),
                        React.createElement("p", { style: { margin: '0 0 12px', fontSize: '0.72rem', color: '#94a3b8', fontFamily: "'Inter', sans-serif" } },
                            products.length,
                            " ",
                            products.length === 1 ? 'presentación' : 'presentaciones'),
                        React.createElement("div", { style: { display: 'flex', gap: '5px', flexWrap: 'wrap', marginTop: 'auto' } },
                            products.slice(0, 4).map((p) => {
                                const size = p.name.includes(' - ') ? p.name.split(' - ').pop() : '';
                                return size ? (React.createElement("span", { key: p.productId, style: { fontSize: '0.65rem', fontWeight: 700, background: '#eef2fb', color: AZUL, borderRadius: '6px', padding: '3px 8px', fontFamily: "'Sora', sans-serif" } }, size)) : null;
                            }),
                            products.length > 4 && (React.createElement("span", { style: { fontSize: '0.65rem', fontWeight: 700, background: AZUL, color: '#fff', borderRadius: '6px', padding: '3px 8px' } },
                                "+",
                                products.length - 4))))));
            }))))));
}
export const layout = {
    areaId: 'content',
    sortOrder: 1,
};
//# sourceMappingURL=BuscarPage.js.map