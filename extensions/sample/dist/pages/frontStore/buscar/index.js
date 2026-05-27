import React, { useState, useEffect, useMemo } from 'react';
import { useQuery } from 'urql';
import { getFamily } from '../../../utils/family.js';
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
    const familyGroups = useMemo(() => {
        const map = new Map();
        items.forEach((p) => {
            const fam = getFamily(p.name);
            if (!map.has(fam))
                map.set(fam, []);
            map.get(fam).push(p);
        });
        return Array.from(map.entries())
            .map(([family, products]) => ({
            family,
            products,
            representative: products.find((p) => { var _a; return (_a = p.image) === null || _a === void 0 ? void 0 : _a.url; }) || products[0],
        }))
            .sort((a, b) => a.family.localeCompare(b.family));
    }, [items]);
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
    return (React.createElement("div", { className: "min-h-screen bg-white font-sora", style: { paddingTop: '124px' } },
        React.createElement("section", { style: { background: 'linear-gradient(160deg, #2A4899 0%, #1e3576 100%)', padding: '40px 0 48px' } },
            React.createElement("div", { style: { maxWidth: '1536px', margin: '0 auto', padding: '0 2rem' } },
                React.createElement("p", { style: { fontSize: '0.65rem', fontWeight: 800, color: '#85C639', letterSpacing: '0.4em', textTransform: 'uppercase', marginBottom: '10px', fontFamily: "'Sora', sans-serif" } }, "Cat\u00E1logo INCAP"),
                React.createElement("h1", { style: { fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, color: '#fff', fontFamily: "'Sora', sans-serif", lineHeight: 1.1, textTransform: 'uppercase', letterSpacing: '-0.03em', marginBottom: '24px' } }, keyword
                    ? React.createElement(React.Fragment, null,
                        React.createElement("span", { style: { color: '#85C639' } },
                            "\"",
                            keyword,
                            "\""))
                    : 'Buscador de productos'),
                React.createElement("form", { onSubmit: handleSubmit, style: { display: 'flex', gap: '10px', maxWidth: '600px' } },
                    React.createElement("input", { type: "text", value: inputValue, onChange: e => setInputValue(e.target.value), placeholder: "Nombre, uso, aplicaci\u00F3n...", style: { flex: 1, padding: '12px 16px', borderRadius: '8px', border: 'none', outline: 'none', fontSize: '0.9rem', fontFamily: "'Inter', sans-serif", fontWeight: 500, color: '#1e293b' } }),
                    React.createElement("button", { type: "submit", style: { background: '#85C639', color: '#181B1C', border: 'none', borderRadius: '8px', padding: '12px 24px', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: "'Sora', sans-serif", whiteSpace: 'nowrap' } }, "Buscar")))),
        React.createElement("section", { style: { maxWidth: '1536px', margin: '0 auto', padding: '48px 2rem' } },
            keyword.length < 2 && (React.createElement("div", { style: { textAlign: 'center', padding: '60px 0' } },
                React.createElement("svg", { width: "48", height: "48", fill: "none", stroke: "#cbd5e1", viewBox: "0 0 24 24", style: { margin: '0 auto 16px', display: 'block' } },
                    React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.5, d: "M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" })),
                React.createElement("p", { style: { color: '#94a3b8', fontSize: '1rem', fontFamily: "'Inter', sans-serif" } }, "Escribe al menos 2 caracteres para buscar"))),
            keyword.length >= 2 && result.fetching && (React.createElement("p", { style: { color: '#94a3b8', fontSize: '0.9rem', fontFamily: "'Inter', sans-serif" } }, "Buscando\u2026")),
            keyword.length >= 2 && !result.fetching && items.length === 0 && (React.createElement("div", { style: { textAlign: 'center', padding: '60px 0' } },
                React.createElement("p", { style: { fontSize: '1.1rem', fontWeight: 700, color: '#1e293b', fontFamily: "'Sora', sans-serif", marginBottom: '8px' } },
                    "Sin resultados para \"",
                    keyword,
                    "\""),
                React.createElement("p", { style: { color: '#64748b', fontFamily: "'Inter', sans-serif", fontSize: '0.9rem' } },
                    "Intenta con otro t\u00E9rmino o",
                    ' ',
                    React.createElement("a", { href: `https://wa.me/${whatsapp}?text=${encodeURIComponent(`Busco información sobre: ${keyword}`)}`, style: { color: '#2A4899', fontWeight: 600 } }, "consulta con un asesor")))),
            !result.fetching && items.length > 0 && (React.createElement(React.Fragment, null,
                React.createElement("p", { style: { fontSize: '0.8rem', color: '#64748b', fontFamily: "'Inter', sans-serif", marginBottom: '32px', fontWeight: 500 } },
                    React.createElement("strong", { style: { color: '#2A4899' } }, total),
                    " ",
                    total === 1 ? 'producto' : 'productos',
                    " para ",
                    React.createElement("strong", null,
                        "\"",
                        keyword,
                        "\"")),
                React.createElement("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' } }, familyGroups.map(({ family, products, representative }) => {
                    var _a;
                    return (React.createElement("a", { key: family, href: representative.url, style: { textDecoration: 'none', display: 'block', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0', background: '#fff', transition: 'all 0.2s' }, onMouseEnter: e => { const el = e.currentTarget; el.style.boxShadow = '0 8px 24px rgba(42,72,153,0.12)'; el.style.transform = 'translateY(-2px)'; }, onMouseLeave: e => { const el = e.currentTarget; el.style.boxShadow = 'none'; el.style.transform = 'none'; } },
                        React.createElement("div", { style: { aspectRatio: '1', background: '#f8faff', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' } }, ((_a = representative.image) === null || _a === void 0 ? void 0 : _a.url)
                            ? React.createElement("img", { src: representative.image.url, alt: representative.image.alt || family, style: { width: '100%', height: '100%', objectFit: 'cover' } })
                            : React.createElement("svg", { width: "40", height: "40", fill: "none", stroke: "#cbd5e1", viewBox: "0 0 24 24" },
                                React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.5, d: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 20M6 8h.01M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2z" }))),
                        React.createElement("div", { style: { padding: '14px' } },
                            React.createElement("p", { style: { margin: '0 0 4px', fontSize: '0.85rem', fontWeight: 800, color: '#1e293b', fontFamily: "'Sora', sans-serif", lineHeight: 1.2 } }, family),
                            React.createElement("p", { style: { margin: 0, fontSize: '0.72rem', color: '#64748b', fontFamily: "'Inter', sans-serif" } },
                                products.length,
                                " ",
                                products.length === 1 ? 'presentación' : 'presentaciones'),
                            React.createElement("div", { style: { display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '8px' } },
                                products.slice(0, 4).map((p) => {
                                    const size = p.name.includes(' - ') ? p.name.split(' - ').pop() : '';
                                    return size ? (React.createElement("span", { key: p.productId, style: { fontSize: '0.62rem', fontWeight: 700, background: '#f1f5f9', color: '#475569', borderRadius: '4px', padding: '2px 6px' } }, size)) : null;
                                }),
                                products.length > 4 && (React.createElement("span", { style: { fontSize: '0.62rem', fontWeight: 700, background: '#e0e7ff', color: '#2A4899', borderRadius: '4px', padding: '2px 6px' } },
                                    "+",
                                    products.length - 4))))));
                })))))));
}
export const layout = {
    areaId: 'content',
    sortOrder: 1,
};
//# sourceMappingURL=index.js.map