import React from 'react';
import { getFamily, getPresentation } from '../utils/family.js';
const CHIP_LIMIT = 6;
function memberHref(m) {
    return m.url || (m.uuid ? `/product/${m.uuid}` : '#');
}
function sortByPresentation(members) {
    const num = (s) => parseFloat(s.replace(/[^\d.]/g, '')) || 0;
    return [...members].sort((a, b) => num(getPresentation(a.name)) - num(getPresentation(b.name)));
}
/**
 * Card con el mismo diseño que el catálogo: imagen de familia + nombre +
 * chips de presentaciones que enlazan al producto específico. Se usa en
 * Productos Relacionados (ficha) y Destacados (home) para que el usuario
 * llegue directo al tamaño que necesita.
 */
export default function FamilyCard({ data }) {
    const { family, label, accent, repImage, repUrl } = data;
    const members = sortByPresentation(data.members);
    const shown = members.slice(0, CHIP_LIMIT);
    const extra = members.length - shown.length;
    return (React.createElement("div", { style: {
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            background: '#fff',
            borderRadius: '24px',
            boxShadow: '0 4px 16px rgba(42,72,153,0.07)',
            border: '1px solid #f1f5f9',
            overflow: 'hidden',
            transition: 'box-shadow 0.2s, transform 0.2s',
        }, onMouseEnter: (e) => {
            const el = e.currentTarget;
            el.style.boxShadow = '0 12px 36px rgba(42,72,153,0.16)';
            el.style.transform = 'translateY(-4px)';
        }, onMouseLeave: (e) => {
            const el = e.currentTarget;
            el.style.boxShadow = '0 4px 16px rgba(42,72,153,0.07)';
            el.style.transform = 'translateY(0)';
        } },
        React.createElement("a", { href: repUrl, style: { display: 'block', textDecoration: 'none' } },
            React.createElement("div", { style: {
                    height: '180px',
                    background: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '1rem',
                    overflow: 'hidden',
                    borderBottom: '1px solid #f8fafc',
                } }, repImage ? (React.createElement("img", { src: repImage, alt: family, loading: "lazy", style: { width: '100%', height: '100%', objectFit: 'contain' } })) : (React.createElement("div", { style: { width: '60px', height: '60px', borderRadius: '12px', background: '#f1f5f9' } }))),
            React.createElement("div", { style: { padding: '12px 14px 8px' } },
                React.createElement("span", { style: {
                        fontSize: '9px',
                        fontWeight: 800,
                        color: accent,
                        letterSpacing: '0.3em',
                        textTransform: 'uppercase',
                        display: 'block',
                        marginBottom: '4px',
                    } }, label),
                React.createElement("h3", { style: {
                        margin: 0,
                        fontSize: '13px',
                        fontWeight: 900,
                        color: '#181B1C',
                        fontFamily: 'Sora, sans-serif',
                        lineHeight: 1.25,
                        textTransform: 'uppercase',
                        letterSpacing: '-0.01em',
                    } }, getFamily(family) || family))),
        React.createElement("div", { style: { padding: '0 14px 14px', marginTop: 'auto' } },
            React.createElement("p", { style: {
                    fontSize: '9px',
                    fontWeight: 800,
                    color: '#94a3b8',
                    letterSpacing: '0.25em',
                    textTransform: 'uppercase',
                    margin: '0 0 6px',
                } }, "Presentaciones"),
            React.createElement("div", { style: { display: 'flex', flexWrap: 'wrap', gap: '4px' } },
                shown.map((m, i) => {
                    var _a, _b;
                    const pres = getPresentation(m.name) || m.name;
                    return (React.createElement("a", { key: `${(_b = (_a = m.productId) !== null && _a !== void 0 ? _a : m.uuid) !== null && _b !== void 0 ? _b : i}`, href: memberHref(m), style: {
                            display: 'inline-block',
                            padding: '3px 8px',
                            background: '#f1f5f9',
                            color: '#2A4899',
                            borderRadius: '6px',
                            fontSize: '10px',
                            fontWeight: 700,
                            fontFamily: 'Sora, sans-serif',
                            textDecoration: 'none',
                            transition: 'all 0.15s',
                        }, onMouseEnter: (e) => {
                            const el = e.currentTarget;
                            el.style.background = '#2A4899';
                            el.style.color = '#fff';
                        }, onMouseLeave: (e) => {
                            const el = e.currentTarget;
                            el.style.background = '#f1f5f9';
                            el.style.color = '#2A4899';
                        } }, pres));
                }),
                extra > 0 && (React.createElement("a", { href: repUrl, style: {
                        display: 'inline-block',
                        padding: '3px 8px',
                        background: '#e0e7ff',
                        color: '#2A4899',
                        borderRadius: '6px',
                        fontSize: '10px',
                        fontWeight: 700,
                        fontFamily: 'Sora, sans-serif',
                        textDecoration: 'none',
                    } },
                    "+",
                    extra))))));
}
