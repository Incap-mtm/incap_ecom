import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useQuery } from 'urql';
import { getFamily } from '../../utils/family.js';
function buildQuery(term) {
    return `
    query {
      products(filters: [
        { key: "fulltext", operation: eq, value: "${term.replace(/"/g, '').replace(/%/g, '')}" }
        { key: "limit",    operation: eq, value: "6" }
        { key: "status",   operation: eq, value: "1" }
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
function useDebounce(value, delay) {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const t = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(t);
    }, [value, delay]);
    return debounced;
}
export default function SearchBar() {
    var _a, _b, _c, _d, _e;
    const [term, setTerm] = useState('');
    const [open, setOpen] = useState(false);
    const debounced = useDebounce(term.trim(), 280);
    const wrapperRef = useRef(null);
    const inputRef = useRef(null);
    const [result] = useQuery({
        query: buildQuery(debounced),
        pause: debounced.length < 2,
        requestPolicy: 'cache-and-network',
    });
    const items = ((_b = (_a = result.data) === null || _a === void 0 ? void 0 : _a.products) === null || _b === void 0 ? void 0 : _b.items) || [];
    const total = (_e = (_d = (_c = result.data) === null || _c === void 0 ? void 0 : _c.products) === null || _d === void 0 ? void 0 : _d.total) !== null && _e !== void 0 ? _e : 0;
    useEffect(() => {
        const handler = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);
    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        const q = term.trim();
        if (q.length < 2)
            return;
        setOpen(false);
        window.location.href = `/buscar?q=${encodeURIComponent(q)}`;
    }, [term]);
    const handleKey = useCallback((e) => {
        var _a;
        if (e.key === 'Escape') {
            setOpen(false);
            (_a = inputRef.current) === null || _a === void 0 ? void 0 : _a.blur();
        }
    }, []);
    const showDropdown = open && debounced.length >= 2;
    return (React.createElement("div", { ref: wrapperRef, className: "incap-searchbar", style: { position: 'relative', background: '#85C639', borderBottom: '1px solid rgba(0,0,0,0.08)', zIndex: 99 } },
        React.createElement("form", { onSubmit: handleSubmit, style: { maxWidth: '1536px', margin: '0 auto', padding: '0 2rem', height: '44px', display: 'flex', alignItems: 'center', gap: '10px' } },
            React.createElement("svg", { width: "16", height: "16", fill: "none", stroke: "#181B1C", viewBox: "0 0 24 24", style: { flexShrink: 0, opacity: 0.6 } },
                React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2.5, d: "M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" })),
            React.createElement("input", { ref: inputRef, type: "text", value: term, onChange: e => { setTerm(e.target.value); setOpen(true); }, onFocus: () => debounced.length >= 2 && setOpen(true), onKeyDown: handleKey, placeholder: "Buscar productos, adhesivos, usos, aplicaciones...", style: {
                    flex: 1, border: 'none', outline: 'none', background: 'transparent',
                    fontSize: '0.8rem', fontFamily: "'Inter', sans-serif", color: '#181B1C',
                    fontWeight: 600, letterSpacing: '0.02em',
                }, autoComplete: "off" }),
            term && (React.createElement("button", { type: "button", onClick: () => { var _a; setTerm(''); setOpen(false); (_a = inputRef.current) === null || _a === void 0 ? void 0 : _a.focus(); }, style: { background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: '#181B1C', opacity: 0.5, flexShrink: 0 } },
                React.createElement("svg", { width: "14", height: "14", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
                    React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2.5, d: "M6 18L18 6M6 6l12 12" })))),
            React.createElement("button", { type: "submit", style: {
                    flexShrink: 0, background: '#2A4899', color: '#fff', border: 'none', borderRadius: '6px',
                    padding: '5px 14px', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em',
                    textTransform: 'uppercase', cursor: 'pointer', fontFamily: "'Sora', sans-serif",
                } }, "Buscar")),
        showDropdown && (React.createElement("div", { style: {
                position: 'absolute', top: '100%', left: 0, right: 0,
                background: '#fff', borderTop: '1px solid #e2e8f0',
                boxShadow: '0 8px 32px rgba(0,0,0,0.12)', zIndex: 999,
            } },
            result.fetching && items.length === 0 && (React.createElement("p", { style: { padding: '12px 20px', fontSize: '0.8rem', color: '#94a3b8', fontFamily: "'Inter', sans-serif" } }, "Buscando\u2026")),
            !result.fetching && items.length === 0 && (React.createElement("p", { style: { padding: '12px 20px', fontSize: '0.8rem', color: '#94a3b8', fontFamily: "'Inter', sans-serif" } },
                "Sin resultados para ",
                React.createElement("strong", null,
                    "\"",
                    debounced,
                    "\""))),
            items.map((item) => {
                var _a;
                return (React.createElement("a", { key: item.productId, href: item.url, onClick: () => setOpen(false), style: {
                        display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 20px',
                        textDecoration: 'none', borderBottom: '1px solid #f1f5f9', transition: 'background 0.12s',
                    }, onMouseEnter: e => { e.currentTarget.style.background = '#f8faff'; }, onMouseLeave: e => { e.currentTarget.style.background = 'transparent'; } },
                    ((_a = item.image) === null || _a === void 0 ? void 0 : _a.url) ? (React.createElement("img", { src: item.image.url, alt: item.image.alt || item.name, style: { width: '36px', height: '36px', objectFit: 'cover', borderRadius: '6px', flexShrink: 0, border: '1px solid #e2e8f0' } })) : (React.createElement("div", { style: { width: '36px', height: '36px', borderRadius: '6px', background: '#f1f5f9', flexShrink: 0 } })),
                    React.createElement("div", { style: { flex: 1, minWidth: 0 } },
                        React.createElement("p", { style: { margin: 0, fontSize: '0.8rem', fontWeight: 700, color: '#1e293b', fontFamily: "'Sora', sans-serif", whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } }, item.name),
                        React.createElement("p", { style: { margin: 0, fontSize: '0.7rem', color: '#64748b', fontFamily: "'Inter', sans-serif" } }, getFamily(item.name))),
                    React.createElement("svg", { width: "12", height: "12", fill: "none", stroke: "#2A4899", viewBox: "0 0 24 24", style: { flexShrink: 0, opacity: 0.5 } },
                        React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2.5, d: "M9 5l7 7-7 7" }))));
            }),
            total > 6 && (React.createElement("a", { href: `/buscar?q=${encodeURIComponent(debounced)}`, onClick: () => setOpen(false), style: {
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '10px 20px', textDecoration: 'none', background: '#f8faff',
                    borderTop: '1px solid #e2e8f0',
                } },
                React.createElement("span", { style: { fontSize: '0.75rem', fontWeight: 700, color: '#2A4899', fontFamily: "'Sora', sans-serif", textTransform: 'uppercase', letterSpacing: '0.06em' } },
                    "Ver todos (",
                    total,
                    ") resultados"),
                React.createElement("svg", { width: "14", height: "14", fill: "none", stroke: "#2A4899", viewBox: "0 0 24 24" },
                    React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2.5, d: "M9 5l7 7-7 7" }))))))));
}
export const layout = {
    areaId: 'headerTop',
    sortOrder: 10,
};
