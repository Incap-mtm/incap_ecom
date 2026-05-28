import React, { useState, useEffect, useMemo } from 'react';
import { useQuery } from 'urql';
import { getFamily, getPresentation, pickRepresentative } from '../../../utils/family.js';
const CAT_META = {
    madera: { name: 'Madera y Muebles', color: '#8B6914', href: '/industrias/madera' },
    colchones: { name: 'Colchones y Espumas', color: '#2A4899', href: '/industrias/colchones' },
    calzado: { name: 'Calzado y Marroquinería', color: '#181B1C', href: '/industrias/calzado' },
    multiusos: { name: 'Hogar y Multiusos', color: '#85C639', href: '/industrias/hogar' },
};
const CAT_ORDER = ['madera', 'colchones', 'calzado', 'multiusos'];
const CATALOG_QUERY = `
  query {
    categories(filters: [{ key: "limit", operation: eq, value: "100" }]) {
      items {
        urlKey
        products(filters: [{ key: "limit", operation: eq, value: "500" }]) {
          items {
            productId
            uuid
            name
            url
            status
            image { url alt }
          }
        }
      }
    }
  }
`;
export default function CatalogPage() {
    const [isClient, setIsClient] = useState(false);
    useEffect(() => setIsClient(true), []);
    const [result] = useQuery({ query: CATALOG_QUERY, pause: !isClient, requestPolicy: 'cache-and-network' });
    const initialOpen = CAT_ORDER.reduce((acc, k) => ({ ...acc, [k]: true }), {});
    const [openIndustries, setOpenIndustries] = useState(initialOpen);
    const sections = useMemo(() => {
        var _a, _b, _c, _d, _e, _f;
        const cats = (_c = (_b = (_a = result.data) === null || _a === void 0 ? void 0 : _a.categories) === null || _b === void 0 ? void 0 : _b.items) !== null && _c !== void 0 ? _c : [];
        const out = [];
        for (const urlKey of CAT_ORDER) {
            const cat = cats.find((c) => c.urlKey === urlKey);
            if (!cat)
                continue;
            const products = ((_e = (_d = cat.products) === null || _d === void 0 ? void 0 : _d.items) !== null && _e !== void 0 ? _e : []).filter((p) => p.status === 1);
            const familyMap = {};
            for (const p of products) {
                const f = getFamily(p.name) || p.name;
                if (!familyMap[f])
                    familyMap[f] = [];
                familyMap[f].push(p);
            }
            const families = Object.entries(familyMap)
                .sort((a, b) => a[0].localeCompare(b[0]))
                .map(([family, prods]) => {
                var _a, _b, _c, _d;
                const rep = pickRepresentative(prods);
                return {
                    family,
                    count: prods.length,
                    repImage: (_b = (_a = rep === null || rep === void 0 ? void 0 : rep.image) === null || _a === void 0 ? void 0 : _a.url) !== null && _b !== void 0 ? _b : null,
                    products: prods,
                    href: `${(_d = (_c = CAT_META[urlKey]) === null || _c === void 0 ? void 0 : _c.href) !== null && _d !== void 0 ? _d : '/catalog'}?familia=${encodeURIComponent(family)}`,
                };
            });
            out.push({
                urlKey,
                meta: (_f = CAT_META[urlKey]) !== null && _f !== void 0 ? _f : { name: urlKey, color: '#2A4899', href: '/catalog' },
                families,
                total: products.length,
            });
        }
        return out;
    }, [result.data]);
    const toggleIndustry = (key) => setOpenIndustries(prev => ({ ...prev, [key]: !prev[key] }));
    return (React.createElement("div", { style: { fontFamily: 'Sora, Inter, sans-serif', background: '#f8fafc', minHeight: '100vh' } },
        React.createElement("div", { style: { background: 'linear-gradient(135deg, #2A4899 0%, #1e3576 100%)', padding: '4rem 2rem 3rem', textAlign: 'center', position: 'relative', overflow: 'hidden' } },
            React.createElement("div", { style: { position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 70% 50%, rgba(133,198,57,0.08) 0%, transparent 70%)', pointerEvents: 'none' } }),
            React.createElement("div", { style: { fontSize: '10px', fontWeight: 700, color: '#85C639', letterSpacing: '0.35em', textTransform: 'uppercase', marginBottom: '12px' } }, "Portafolio completo"),
            React.createElement("h1", { style: { fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, color: '#fff', margin: '0 0 1rem', letterSpacing: '-0.02em', textTransform: 'uppercase', lineHeight: 1 } }, "Cat\u00E1logo INCAP"),
            React.createElement("p", { style: { color: 'rgba(255,255,255,0.7)', fontSize: 'clamp(14px, 2vw, 17px)', maxWidth: '680px', margin: '0 auto', lineHeight: 1.7, fontWeight: 400, fontFamily: 'Inter, sans-serif' } }, "322 productos para las principales industrias colombianas. Encuentra tu soluci\u00F3n de adhesi\u00F3n exacta.")),
        React.createElement("div", { style: { maxWidth: '1536px', margin: '0 auto', display: 'flex', gap: '1.5rem', padding: '2rem 1.5rem', alignItems: 'flex-start' } },
            React.createElement("aside", { style: { width: '240px', flexShrink: 0, position: 'sticky', top: '140px', background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', maxHeight: 'calc(100vh - 160px)', overflowY: 'auto' } },
                React.createElement("div", { style: { padding: '1rem 1rem 0.5rem', borderBottom: '1px solid #f1f5f9' } },
                    React.createElement("p", { style: { margin: 0, fontSize: '9px', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.3em', textTransform: 'uppercase' } }, "Industrias")),
                CAT_ORDER.map(key => {
                    const meta = CAT_META[key];
                    const sec = sections.find(s => s.urlKey === key);
                    const open = openIndustries[key];
                    return (React.createElement("div", { key: key },
                        React.createElement("button", { onClick: () => toggleIndustry(key), style: {
                                width: '100%', display: 'flex', alignItems: 'center', gap: '8px',
                                padding: '10px 14px', border: 'none', borderBottom: '1px solid #f1f5f9',
                                background: open ? `${meta.color}08` : '#fff',
                                cursor: 'pointer', textAlign: 'left',
                            } },
                            React.createElement("div", { style: { width: '8px', height: '8px', borderRadius: '2px', background: meta.color, flexShrink: 0 } }),
                            React.createElement("span", { style: { flex: 1, fontSize: '11px', fontWeight: 800, color: '#181B1C', textTransform: 'uppercase', letterSpacing: '0.04em', fontFamily: 'Sora, sans-serif', lineHeight: 1.3 } }, meta.name),
                            React.createElement("svg", { width: "10", height: "10", fill: "none", stroke: "#94a3b8", viewBox: "0 0 24 24", style: { transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 } },
                                React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2.5, d: "M19 9l-7 7-7-7" }))),
                        open && sec && (React.createElement("div", { style: { background: '#fafbfc', borderBottom: '1px solid #f1f5f9' } },
                            React.createElement("a", { href: `#cat-${key}`, style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 14px 7px 22px', fontSize: '10px', fontWeight: 700, color: meta.color, fontFamily: 'Sora, sans-serif', textDecoration: 'none', borderBottom: '1px solid #f1f5f9', background: `${meta.color}06` } },
                                React.createElement("span", null, "Ver todos"),
                                React.createElement("span", { style: { fontSize: '9px', color: '#94a3b8', fontWeight: 600 } }, sec.total)),
                            sec.families.map(fc => (React.createElement("a", { key: fc.family, href: fc.href, style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '5px 14px 5px 22px', fontSize: '11px', color: '#475569', fontFamily: 'Inter, sans-serif', textDecoration: 'none', lineHeight: 1.4, transition: 'background 0.12s, color 0.12s' }, onMouseEnter: e => { const el = e.currentTarget; el.style.background = `${meta.color}0c`; el.style.color = meta.color; }, onMouseLeave: e => { const el = e.currentTarget; el.style.background = 'transparent'; el.style.color = '#475569'; } },
                                React.createElement("span", null, fc.family),
                                React.createElement("span", { style: { fontSize: '9px', color: '#94a3b8', fontWeight: 600, flexShrink: 0, marginLeft: '4px' } }, fc.count))))))));
                })),
            React.createElement("main", { style: { flex: 1, minWidth: 0 } },
                result.fetching && sections.length === 0 && (React.createElement("div", { style: { textAlign: 'center', padding: '5rem 2rem', color: '#94a3b8', fontSize: '14px', fontFamily: 'Inter, sans-serif' } }, "Cargando cat\u00E1logo\u2026")),
                sections.map((sec) => (React.createElement("section", { key: sec.urlKey, id: `cat-${sec.urlKey}`, style: { marginBottom: '4rem' } },
                    React.createElement("div", { style: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem', flexWrap: 'wrap', paddingBottom: '1rem', borderBottom: `2px solid ${sec.meta.color}20` } },
                        React.createElement("div", { style: { width: '6px', height: '32px', background: sec.meta.color, borderRadius: '3px', flexShrink: 0 } }),
                        React.createElement("h2", { style: { fontSize: 'clamp(1.2rem, 2.5vw, 1.8rem)', fontWeight: 900, color: '#181B1C', margin: 0, textTransform: 'uppercase', letterSpacing: '-0.01em', fontFamily: 'Sora, sans-serif' } }, sec.meta.name),
                        React.createElement("span", { style: { marginLeft: 'auto', fontSize: '11px', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase', whiteSpace: 'nowrap' } },
                            sec.total,
                            " prod. \u00B7 ",
                            sec.families.length,
                            " familias"),
                        React.createElement("a", { href: sec.meta.href, style: { fontSize: '11px', fontWeight: 700, color: sec.meta.color, textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.06em', flexShrink: 0 } }, "Ver industria \u2192")),
                    React.createElement("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '1.25rem' } }, sec.families.map((fc) => {
                        const sortedProds = [...fc.products].sort((a, b) => {
                            const num = (s) => parseFloat(s.replace(/[^\d.]/g, '')) || 0;
                            return num(getPresentation(a.name)) - num(getPresentation(b.name));
                        });
                        return (React.createElement("div", { key: fc.family, style: { background: '#fff', borderRadius: '24px', boxShadow: '0 4px 16px rgba(42,72,153,0.07)', border: '1px solid #f1f5f9', overflow: 'hidden', transition: 'box-shadow 0.2s, transform 0.2s' }, onMouseEnter: e => { const el = e.currentTarget; el.style.boxShadow = '0 12px 36px rgba(42,72,153,0.16)'; el.style.transform = 'translateY(-4px)'; }, onMouseLeave: e => { const el = e.currentTarget; el.style.boxShadow = '0 4px 16px rgba(42,72,153,0.07)'; el.style.transform = 'translateY(0)'; } },
                            React.createElement("a", { href: fc.href, style: { display: 'block', textDecoration: 'none' } },
                                React.createElement("div", { style: { height: '180px', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', overflow: 'hidden', borderBottom: '1px solid #f8fafc' } }, fc.repImage ? (React.createElement("img", { src: fc.repImage, alt: fc.family, style: { width: '100%', height: '100%', objectFit: 'contain', transition: 'transform 0.4s' }, loading: "lazy" })) : (React.createElement("div", { style: { width: '60px', height: '60px', borderRadius: '12px', background: '#f1f5f9' } }))),
                                React.createElement("div", { style: { padding: '12px 14px 8px' } },
                                    React.createElement("span", { style: { fontSize: '9px', fontWeight: 800, color: sec.meta.color, letterSpacing: '0.3em', textTransform: 'uppercase', display: 'block', marginBottom: '4px' } }, "Especializado"),
                                    React.createElement("h3", { style: { margin: 0, fontSize: '13px', fontWeight: 900, color: '#181B1C', fontFamily: 'Sora, sans-serif', lineHeight: 1.25, textTransform: 'uppercase', letterSpacing: '-0.01em' } }, fc.family))),
                            React.createElement("div", { style: { padding: '0 14px 14px' } },
                                React.createElement("p", { style: { fontSize: '9px', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.25em', textTransform: 'uppercase', margin: '0 0 6px' } }, "Presentaciones"),
                                React.createElement("div", { style: { display: 'flex', flexWrap: 'wrap', gap: '4px' } },
                                    sortedProds.slice(0, 5).map((p) => (React.createElement("a", { key: p.productId, href: `/product/${p.uuid}`, style: { display: 'inline-block', padding: '3px 8px', background: '#f1f5f9', color: '#2A4899', borderRadius: '6px', fontSize: '10px', fontWeight: 700, fontFamily: 'Sora, sans-serif', textDecoration: 'none', transition: 'all 0.15s' }, onMouseEnter: e => { const el = e.currentTarget; el.style.background = '#2A4899'; el.style.color = '#fff'; }, onMouseLeave: e => { const el = e.currentTarget; el.style.background = '#f1f5f9'; el.style.color = '#2A4899'; } }, getPresentation(p.name)))),
                                    sortedProds.length > 5 && (React.createElement("a", { href: fc.href, style: { display: 'inline-block', padding: '3px 8px', background: '#e0e7ff', color: '#2A4899', borderRadius: '6px', fontSize: '10px', fontWeight: 700, fontFamily: 'Sora, sans-serif', textDecoration: 'none' } },
                                        "+",
                                        sortedProds.length - 5))))));
                    }))))))),
        React.createElement("div", { style: { background: '#181B1C', padding: '3rem 1.5rem', textAlign: 'center', marginTop: '1rem' } },
            React.createElement("p", { style: { color: 'rgba(255,255,255,0.6)', fontFamily: 'Inter, sans-serif', fontSize: '14px', marginBottom: '1.5rem' } }, "\u00BFNo encuentras lo que necesitas? Nuestros asesores t\u00E9cnicos pueden ayudarte."),
            React.createElement("a", { href: "https://api.whatsapp.com/send?phone=+573002171521&text=Quiero%20m%C3%A1s%20informaci%C3%B3n", target: "_blank", rel: "noopener noreferrer", style: { display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#85C639', color: '#181B1C', fontFamily: 'Sora, sans-serif', fontWeight: 800, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.2em', padding: '14px 32px', borderRadius: '50px', textDecoration: 'none' } }, "Solicitar Asesor\u00EDa T\u00E9cnica \u2192"))));
}
export const layout = {
    areaId: 'content',
    sortOrder: 1,
};
//# sourceMappingURL=CatalogPage.js.map