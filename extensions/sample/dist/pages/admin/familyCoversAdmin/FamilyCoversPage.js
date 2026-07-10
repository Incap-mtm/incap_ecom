/**
 * Página admin /portadas-familia
 * El administrador elige, para cada familia de productos (agrupación por
 * nombre antes de " - ", ej. "Incafort"), qué variación (presentación) es
 * la imagen de portada de la card de esa familia en buscador/catálogo/industrias.
 * La selección se guarda en el setting `family_covers` (objeto JSON
 * { [familia]: uuid }) vía /api/family-covers. Familias sin portada elegida
 * siguen usando la heurística automática (pickRepresentative).
 */
import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@components/common/ui/Card.js';
import { Button } from '@components/common/ui/Button.js';
const AZUL = '#2A4899';
const VERDE = '#85C639';
function Thumb({ url }) {
    return (React.createElement("div", { style: {
            width: 52,
            height: 52,
            flexShrink: 0,
            borderRadius: 8,
            border: '1px solid #e2e8f0',
            background: '#f8fafc',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
        } }, url ? (React.createElement("img", { src: url, alt: "", style: { maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' } })) : (React.createElement("span", { style: { fontSize: 8, color: '#cbd5e1', textAlign: 'center' } }, "s/img"))));
}
export default function FamilyCoversPage() {
    const [isClient, setIsClient] = useState(false);
    const [families, setFamilies] = useState([]);
    const [covers, setCovers] = useState({});
    const [loading, setLoading] = useState(true);
    const [term, setTerm] = useState('');
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState({
        kind: 'idle'
    });
    useEffect(() => setIsClient(true), []);
    useEffect(() => {
        if (!isClient)
            return;
        setLoading(true);
        fetch('/api/family-covers', { credentials: 'include' })
            .then((r) => r.json())
            .then((d) => {
            if (Array.isArray(d === null || d === void 0 ? void 0 : d.families))
                setFamilies(d.families);
            if ((d === null || d === void 0 ? void 0 : d.covers) && typeof d.covers === 'object')
                setCovers(d.covers);
        })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, [isClient]);
    const filteredFamilies = useMemo(() => {
        const q = term.trim().toLowerCase();
        if (!q)
            return families;
        return families.filter((f) => f.family.toLowerCase().includes(q));
    }, [families, term]);
    const setFamilyCover = (family, uuid) => {
        setCovers((prev) => ({ ...prev, [family]: uuid }));
        setStatus({ kind: 'idle' });
    };
    const save = async () => {
        var _a;
        setSaving(true);
        setStatus({ kind: 'idle' });
        try {
            const res = await fetch('/api/family-covers', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ covers })
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok || (data === null || data === void 0 ? void 0 : data.error)) {
                const msg = typeof (data === null || data === void 0 ? void 0 : data.error) === 'string'
                    ? data.error
                    : ((_a = data === null || data === void 0 ? void 0 : data.error) === null || _a === void 0 ? void 0 : _a.message) || 'Error al guardar.';
                setStatus({ kind: 'error', msg });
            }
            else {
                setStatus({ kind: 'ok', msg: 'Portadas guardadas.' });
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
    return (React.createElement(Card, null,
        React.createElement(CardHeader, null,
            React.createElement(CardTitle, null, "Portadas de familia"),
            React.createElement(CardDescription, null,
                "Eleg\u00ED qu\u00E9 presentaci\u00F3n de cada familia de productos aparece como imagen de portada en las cards del ",
                React.createElement("strong", null, "buscador"),
                ", el",
                ' ',
                React.createElement("strong", null, "cat\u00E1logo"),
                " y las p\u00E1ginas de ",
                React.createElement("strong", null, "industrias"),
                ". Las familias sin portada elegida usan autom\u00E1ticamente la presentaci\u00F3n de tama\u00F1o intermedio.")),
        React.createElement(CardContent, null,
            React.createElement("div", { style: { maxWidth: 900 } },
                React.createElement("input", { type: "text", value: term, onChange: (e) => setTerm(e.target.value), placeholder: "Filtrar familias por nombre\u2026", style: {
                        width: '100%',
                        padding: '8px 12px',
                        border: '1px solid #cbd5e1',
                        borderRadius: 8,
                        fontSize: 14,
                        marginBottom: 16
                    } }),
                loading ? (React.createElement("p", { style: { padding: 12, fontSize: 13, color: '#94a3b8' } }, "Cargando familias\u2026")) : filteredFamilies.length === 0 ? (React.createElement("p", { style: { padding: 12, fontSize: 13, color: '#94a3b8' } }, term.trim() ? 'Sin resultados.' : 'No hay familias con 2 o más presentaciones.')) : (React.createElement("div", { style: {
                        border: '1px solid #e2e8f0',
                        borderRadius: 8,
                        maxHeight: 560,
                        overflowY: 'auto'
                    } }, filteredFamilies.map((fg) => {
                    var _a;
                    const selectedUuid = covers[fg.family] || ((_a = fg.variants[0]) === null || _a === void 0 ? void 0 : _a.uuid) || '';
                    const selectedVariant = fg.variants.find((v) => v.uuid === selectedUuid) || fg.variants[0];
                    return (React.createElement("div", { key: fg.family, style: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12,
                            padding: 10,
                            borderBottom: '1px solid #f1f5f9'
                        } },
                        React.createElement(Thumb, { url: selectedVariant === null || selectedVariant === void 0 ? void 0 : selectedVariant.image }),
                        React.createElement("span", { style: {
                                flexGrow: 1,
                                fontSize: 13,
                                fontWeight: 700,
                                color: '#1e293b',
                                minWidth: 0
                            } }, fg.family),
                        React.createElement("div", { style: { position: 'relative', flexShrink: 0 } },
                            React.createElement("select", { value: selectedUuid, onChange: (e) => setFamilyCover(fg.family, e.target.value), style: {
                                    padding: '6px 30px 6px 10px',
                                    borderRadius: 8,
                                    border: `1px solid ${covers[fg.family] ? AZUL : '#cbd5e1'}`,
                                    background: covers[fg.family] ? 'rgba(42,72,153,0.06)' : '#fff',
                                    color: '#1e293b',
                                    fontSize: 12,
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    minWidth: 200
                                } }, fg.variants.map((v) => (React.createElement("option", { key: v.uuid, value: v.uuid }, v.presentation || v.name)))))));
                }))),
                React.createElement("div", { style: { marginTop: 20, display: 'flex', alignItems: 'center', gap: 16 } },
                    React.createElement(Button, { onClick: save, disabled: saving || loading }, saving ? 'Guardando…' : 'Guardar portadas'),
                    status.msg && React.createElement("p", { style: { fontSize: 13, color: statusColor, margin: 0 } }, status.msg))))));
}
export const layout = {
    areaId: 'content',
    sortOrder: 10
};
//# sourceMappingURL=FamilyCoversPage.js.map