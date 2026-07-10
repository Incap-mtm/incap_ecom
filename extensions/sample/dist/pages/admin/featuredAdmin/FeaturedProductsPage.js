/**
 * Página admin /productos-destacados
 * El administrador elige (hasta 10) los productos que aparecen en el carrusel
 * "Productos Destacados" del home. La selección se guarda en el setting
 * `featured_products` (array JSON de uuids) vía /api/featured-products.
 */
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@components/common/ui/Card.js';
import { Button } from '@components/common/ui/Button.js';
const AZUL = '#2A4899';
const VERDE = '#85C639';
const MAX = 10;
function Thumb({ url }) {
    return (React.createElement("div", { style: {
            width: 44,
            height: 44,
            flexShrink: 0,
            borderRadius: 6,
            border: '1px solid #e2e8f0',
            background: '#f8fafc',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
        } }, url ? (React.createElement("img", { src: url, alt: "", style: { maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' } })) : (React.createElement("span", { style: { fontSize: 8, color: '#cbd5e1', textAlign: 'center' } }, "s/img"))));
}
export default function FeaturedProductsPage() {
    const [isClient, setIsClient] = useState(false);
    const [selected, setSelected] = useState([]);
    const [term, setTerm] = useState('');
    const [results, setResults] = useState([]);
    const [searching, setSearching] = useState(false);
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState({
        kind: 'idle'
    });
    useEffect(() => setIsClient(true), []);
    // Cargar selección actual
    useEffect(() => {
        if (!isClient)
            return;
        fetch('/api/featured-products', { credentials: 'include' })
            .then((r) => r.json())
            .then((d) => {
            if (Array.isArray(d === null || d === void 0 ? void 0 : d.selected))
                setSelected(d.selected);
        })
            .catch(() => { });
    }, [isClient]);
    // Búsqueda con debounce
    useEffect(() => {
        if (!isClient)
            return;
        const q = term.trim();
        if (q.length < 2) {
            setResults([]);
            return;
        }
        setSearching(true);
        const t = setTimeout(() => {
            fetch(`/api/featured-products?search=${encodeURIComponent(q)}`, { credentials: 'include' })
                .then((r) => r.json())
                .then((d) => setResults(Array.isArray(d === null || d === void 0 ? void 0 : d.results) ? d.results : []))
                .catch(() => setResults([]))
                .finally(() => setSearching(false));
        }, 300);
        return () => clearTimeout(t);
    }, [term, isClient]);
    const selectedUuids = new Set(selected.map((s) => s.uuid));
    const add = (p) => {
        if (selectedUuids.has(p.uuid))
            return;
        if (selected.length >= MAX) {
            setStatus({ kind: 'error', msg: `Máximo ${MAX} productos destacados.` });
            return;
        }
        setSelected([...selected, p]);
        setStatus({ kind: 'idle' });
    };
    const removeAt = (index) => {
        setSelected(selected.filter((_, i) => i !== index));
        setStatus({ kind: 'idle' });
    };
    const move = (index, dir) => {
        const next = [...selected];
        const target = index + dir;
        if (target < 0 || target >= next.length)
            return;
        [next[index], next[target]] = [next[target], next[index]];
        setSelected(next);
        setStatus({ kind: 'idle' });
    };
    const save = async () => {
        var _a;
        setSaving(true);
        setStatus({ kind: 'idle' });
        try {
            const res = await fetch('/api/featured-products', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ uuids: selected.map((s) => s.uuid) })
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok || (data === null || data === void 0 ? void 0 : data.error)) {
                const msg = typeof (data === null || data === void 0 ? void 0 : data.error) === 'string'
                    ? data.error
                    : ((_a = data === null || data === void 0 ? void 0 : data.error) === null || _a === void 0 ? void 0 : _a.message) || 'Error al guardar.';
                setStatus({ kind: 'error', msg });
            }
            else {
                setStatus({ kind: 'ok', msg: 'Productos destacados guardados.' });
            }
        }
        catch (e) {
            setStatus({ kind: 'error', msg: e instanceof Error ? e.message : 'Error de conexión.' });
        }
        finally {
            setSaving(false);
        }
    };
    const statusColor = status.kind === 'ok' ? VERDE : status.kind === 'error' ? '#dc2626' : '#64748b';
    const visibleResults = results.filter((r) => !selectedUuids.has(r.uuid));
    return (React.createElement(Card, null,
        React.createElement(CardHeader, null,
            React.createElement(CardTitle, null, "Productos destacados"),
            React.createElement(CardDescription, null,
                "Eleg\u00ED hasta ",
                MAX,
                " productos para el carrusel ",
                React.createElement("strong", null, "Productos Destacados"),
                ' ',
                "del home (debajo de la secci\u00F3n de industrias). Busc\u00E1 por nombre para agregarlos y orden\u00E1los con ",
                React.createElement("strong", null, "Subir"),
                " / ",
                React.createElement("strong", null, "Bajar"),
                ".")),
        React.createElement(CardContent, null,
            React.createElement("div", { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, maxWidth: 900 } },
                React.createElement("div", null,
                    React.createElement("p", { style: { fontSize: 12, fontWeight: 700, color: '#64748b', marginBottom: 8 } }, "Buscar producto"),
                    React.createElement("input", { type: "text", value: term, onChange: (e) => setTerm(e.target.value), placeholder: "Escrib\u00ED al menos 2 letras\u2026", style: {
                            width: '100%',
                            padding: '8px 12px',
                            border: '1px solid #cbd5e1',
                            borderRadius: 8,
                            fontSize: 14,
                            marginBottom: 10
                        } }),
                    React.createElement("div", { style: {
                            border: '1px solid #e2e8f0',
                            borderRadius: 8,
                            maxHeight: 340,
                            overflowY: 'auto'
                        } }, searching ? (React.createElement("p", { style: { padding: 12, fontSize: 13, color: '#94a3b8' } }, "Buscando\u2026")) : visibleResults.length === 0 ? (React.createElement("p", { style: { padding: 12, fontSize: 13, color: '#94a3b8' } }, term.trim().length < 2 ? 'Escribí para buscar.' : 'Sin resultados.')) : (visibleResults.map((p) => (React.createElement("div", { key: p.uuid, style: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                            padding: 8,
                            borderBottom: '1px solid #f1f5f9'
                        } },
                        React.createElement(Thumb, { url: p.image }),
                        React.createElement("span", { style: { flexGrow: 1, fontSize: 13, color: '#1e293b' } }, p.name),
                        React.createElement("button", { onClick: () => add(p), disabled: selected.length >= MAX, style: {
                                padding: '4px 10px',
                                fontSize: 12,
                                fontWeight: 700,
                                background: selected.length >= MAX ? '#e2e8f0' : AZUL,
                                color: selected.length >= MAX ? '#94a3b8' : '#fff',
                                border: 'none',
                                borderRadius: 6,
                                cursor: selected.length >= MAX ? 'default' : 'pointer',
                                flexShrink: 0
                            } }, "+ Agregar"))))))),
                React.createElement("div", null,
                    React.createElement("p", { style: { fontSize: 12, fontWeight: 700, color: '#64748b', marginBottom: 8 } },
                        "Destacados (",
                        selected.length,
                        "/",
                        MAX,
                        ")"),
                    React.createElement("div", { style: {
                            border: '1px solid #e2e8f0',
                            borderRadius: 8,
                            minHeight: 100,
                            maxHeight: 340,
                            overflowY: 'auto'
                        } }, selected.length === 0 ? (React.createElement("p", { style: { padding: 12, fontSize: 13, color: '#94a3b8' } }, "Todav\u00EDa no eleg\u00EDste productos.")) : (selected.map((p, idx) => (React.createElement("div", { key: p.uuid, style: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                            padding: 8,
                            borderBottom: '1px solid #f1f5f9',
                            background: idx === 0 ? 'rgba(133,198,57,0.08)' : '#fff'
                        } },
                        React.createElement("span", { style: { fontSize: 12, color: '#94a3b8', width: 18, textAlign: 'right' } }, idx + 1),
                        React.createElement(Thumb, { url: p.image }),
                        React.createElement("span", { style: { flexGrow: 1, fontSize: 13, color: '#1e293b' } }, p.name),
                        React.createElement("div", { style: { display: 'flex', gap: 4, flexShrink: 0 } },
                            React.createElement("button", { onClick: () => move(idx, -1), disabled: idx === 0, title: "Subir", style: miniBtn(idx === 0) }, "\u2191"),
                            React.createElement("button", { onClick: () => move(idx, 1), disabled: idx === selected.length - 1, title: "Bajar", style: miniBtn(idx === selected.length - 1) }, "\u2193"),
                            React.createElement("button", { onClick: () => removeAt(idx), title: "Quitar", style: {
                                    ...miniBtn(false),
                                    background: 'rgba(220,38,38,0.9)',
                                    color: '#fff',
                                    borderColor: 'transparent'
                                } }, "\u00D7"))))))))),
            React.createElement("div", { style: { marginTop: 20, display: 'flex', alignItems: 'center', gap: 16 } },
                React.createElement(Button, { onClick: save, disabled: saving }, saving ? 'Guardando…' : 'Guardar destacados'),
                status.msg && React.createElement("p", { style: { fontSize: 13, color: statusColor, margin: 0 } }, status.msg)))));
}
function miniBtn(disabled) {
    return {
        width: 24,
        height: 24,
        fontSize: 12,
        lineHeight: 1,
        background: disabled ? '#e2e8f0' : '#fff',
        color: disabled ? '#94a3b8' : AZUL,
        border: `1px solid ${disabled ? '#e2e8f0' : AZUL}`,
        borderRadius: 6,
        cursor: disabled ? 'default' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0
    };
}
export const layout = {
    areaId: 'content',
    sortOrder: 10
};
//# sourceMappingURL=FeaturedProductsPage.js.map