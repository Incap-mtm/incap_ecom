/**
 * Página admin /orden-tamanos
 * Permite al administrador definir el orden global de aparición de los tamaños
 * de variante en la ficha de producto del storefront.
 */
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@components/common/ui/Card.js';
import { Button } from '@components/common/ui/Button.js';
import { compareSizes } from '../../../lib/sizeSort.js';
const AZUL = '#2A4899';
const VERDE = '#85C639';
// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function buildOrderedList(orderIds, allOptions) {
    const map = new Map(allOptions.map((o) => [o.id, o]));
    // Primero los que están en el orden guardado (en ese orden)
    const ordered = [];
    for (const id of orderIds) {
        const opt = map.get(id);
        if (opt)
            ordered.push(opt);
    }
    // Luego los restantes (no listados), de menor a mayor por tamaño
    const orderedIds = new Set(orderIds);
    const rest = allOptions
        .filter((o) => !orderedIds.has(o.id))
        .sort((a, b) => compareSizes(a.text, b.text));
    return [...ordered, ...rest];
}
// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------
function VariantSizeOrderPage({ variantSizeOrderJson, sizeOptionsData }) {
    const [items, setItems] = useState([]);
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState({ kind: 'idle' });
    useEffect(() => {
        let orderIds = [];
        try {
            const parsed = JSON.parse(variantSizeOrderJson || '[]');
            if (Array.isArray(parsed))
                orderIds = parsed.map(Number);
        }
        catch (_a) {
            orderIds = [];
        }
        setItems(buildOrderedList(orderIds, sizeOptionsData || []));
    }, [variantSizeOrderJson, sizeOptionsData]);
    const move = (index, direction) => {
        const next = [...items];
        const target = index + direction;
        if (target < 0 || target >= next.length)
            return;
        [next[index], next[target]] = [next[target], next[index]];
        setItems(next);
        setStatus({ kind: 'idle' });
    };
    const sortAscending = () => {
        setItems((prev) => [...prev].sort((a, b) => compareSizes(a.text, b.text)));
        setStatus({ kind: 'idle' });
    };
    const handleSave = async () => {
        var _a;
        setSaving(true);
        setStatus({ kind: 'idle' });
        try {
            const order = items.map((o) => o.id);
            const res = await fetch('/api/variant-size-order', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ order })
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok || (data === null || data === void 0 ? void 0 : data.error)) {
                const msg = typeof (data === null || data === void 0 ? void 0 : data.error) === 'string'
                    ? data.error
                    : ((_a = data === null || data === void 0 ? void 0 : data.error) === null || _a === void 0 ? void 0 : _a.message) || 'Error al guardar.';
                setStatus({ kind: 'error', msg });
            }
            else {
                setStatus({ kind: 'ok', msg: 'Orden guardado correctamente.' });
            }
        }
        catch (e) {
            const msg = e instanceof Error ? e.message : 'Error de conexión.';
            setStatus({ kind: 'error', msg });
        }
        finally {
            setSaving(false);
        }
    };
    const statusColor = status.kind === 'ok' ? VERDE : status.kind === 'error' ? '#dc2626' : '#64748b';
    return (React.createElement(Card, null,
        React.createElement(CardHeader, null,
            React.createElement(CardTitle, null, "Orden de tama\u00F1os de variante"),
            React.createElement(CardDescription, null,
                "Define el orden en que aparecen los tama\u00F1os en el selector de variantes de la ficha de producto. Por defecto se ordenan ",
                React.createElement("strong", null, "de menor a mayor"),
                "; us\u00E1",
                ' ',
                React.createElement("strong", null, "Ordenar de menor a mayor"),
                " para reaplicarlo, o los botones",
                ' ',
                React.createElement("strong", null, "Subir"),
                " y ",
                React.createElement("strong", null, "Bajar"),
                " para ajustarlo manualmente.")),
        React.createElement(CardContent, null, items.length === 0 ? (React.createElement("p", { style: { color: '#6b7280', fontSize: 14 } }, "No hay tama\u00F1os de variante registrados. Ejecut\u00E1 primero \"Sincronizar variantes\" desde la grilla de productos.")) : (React.createElement("div", { style: { maxWidth: 480 } },
            React.createElement("div", { style: { marginBottom: 12 } },
                React.createElement("button", { onClick: sortAscending, style: {
                        padding: '6px 14px',
                        fontSize: 13,
                        background: '#fff',
                        color: AZUL,
                        border: `2px solid ${AZUL}`,
                        borderRadius: 6,
                        cursor: 'pointer',
                        fontWeight: 600
                    }, title: "Reordena todos los tama\u00F1os de menor a mayor" }, "\u2195 Ordenar de menor a mayor")),
            React.createElement("table", { style: { width: '100%', borderCollapse: 'collapse', fontSize: 14 } },
                React.createElement("thead", null,
                    React.createElement("tr", null,
                        React.createElement("th", { style: {
                                textAlign: 'left',
                                padding: '8px 12px',
                                background: AZUL,
                                color: '#fff',
                                fontWeight: 600,
                                borderRadius: '4px 0 0 0'
                            } }, "#"),
                        React.createElement("th", { style: {
                                textAlign: 'left',
                                padding: '8px 12px',
                                background: AZUL,
                                color: '#fff',
                                fontWeight: 600
                            } }, "Tama\u00F1o"),
                        React.createElement("th", { style: {
                                textAlign: 'center',
                                padding: '8px 12px',
                                background: AZUL,
                                color: '#fff',
                                fontWeight: 600,
                                borderRadius: '0 4px 0 0'
                            } }, "Mover"))),
                React.createElement("tbody", null, items.map((opt, idx) => (React.createElement("tr", { key: opt.id, style: {
                        background: idx % 2 === 0 ? '#f8f9fc' : '#fff',
                        borderBottom: '1px solid #e2e8f0'
                    } },
                    React.createElement("td", { style: { padding: '8px 12px', color: '#94a3b8', fontWeight: 500 } }, idx + 1),
                    React.createElement("td", { style: { padding: '8px 12px', color: '#1e293b', fontWeight: 500 } }, opt.text),
                    React.createElement("td", { style: { padding: '6px 12px', textAlign: 'center' } },
                        React.createElement("div", { style: { display: 'flex', gap: 6, justifyContent: 'center' } },
                            React.createElement("button", { onClick: () => move(idx, -1), disabled: idx === 0, style: {
                                    padding: '3px 10px',
                                    fontSize: 13,
                                    background: idx === 0 ? '#e2e8f0' : AZUL,
                                    color: idx === 0 ? '#94a3b8' : '#fff',
                                    border: 'none',
                                    borderRadius: 4,
                                    cursor: idx === 0 ? 'default' : 'pointer',
                                    fontWeight: 600
                                }, title: "Subir" }, "\u2191"),
                            React.createElement("button", { onClick: () => move(idx, 1), disabled: idx === items.length - 1, style: {
                                    padding: '3px 10px',
                                    fontSize: 13,
                                    background: idx === items.length - 1 ? '#e2e8f0' : AZUL,
                                    color: idx === items.length - 1 ? '#94a3b8' : '#fff',
                                    border: 'none',
                                    borderRadius: 4,
                                    cursor: idx === items.length - 1 ? 'default' : 'pointer',
                                    fontWeight: 600
                                }, title: "Bajar" }, "\u2193")))))))),
            React.createElement("div", { style: { marginTop: 20, display: 'flex', alignItems: 'center', gap: 16 } },
                React.createElement(Button, { onClick: handleSave, disabled: saving }, saving ? 'Guardando…' : 'Guardar orden'),
                status.msg && (React.createElement("p", { style: { fontSize: 13, color: statusColor, margin: 0 } }, status.msg))),
            React.createElement("p", { style: { fontSize: 12, color: '#94a3b8', marginTop: 12 } },
                "ID de opci\u00F3n: ",
                items.map((o) => o.id).join(', ')))))));
}
export const layout = {
    areaId: 'content',
    sortOrder: 10
};
export const query = `
  query VariantSizeOrderPageQuery {
    setting {
      variantSizeOrder
    }
    sizeOptions {
      id
      text
    }
  }
`;
// Evershop inyecta los campos del query como props flat si se usan en el componente.
// variantSizeOrder viene de setting.variantSizeOrder y sizeOptions del Query root.
// Para simplificar el mapeo, el componente recibe las props tal como las nombra Evershop.
export default function VariantSizeOrderPageWrapper({ setting, sizeOptions }) {
    return (React.createElement(VariantSizeOrderPage, { variantSizeOrderJson: (setting === null || setting === void 0 ? void 0 : setting.variantSizeOrder) || '[]', sizeOptionsData: sizeOptions || [] }));
}
//# sourceMappingURL=VariantSizeOrderPage.js.map