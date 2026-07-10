import { Button } from '@components/common/ui/Button.js';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@components/common/ui/Card.js';
import React, { useState } from 'react';
async function callEndpoint(url) {
    const res = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: '{}'
    });
    const data = await res.json().catch(() => ({}));
    return { ok: res.ok && data.success !== false, data };
}
export default function CatalogTools({ variantSizeOrderUrl }) {
    const [variants, setVariants] = useState({ kind: 'idle' });
    const [images, setImages] = useState({ kind: 'idle' });
    const runVariants = async () => {
        var _a, _b, _c;
        setVariants({ kind: 'loading' });
        try {
            const { ok, data } = await callEndpoint('/api/sync-variants');
            if (!ok)
                return setVariants({ kind: 'error', msg: data.error || 'Error al sincronizar.' });
            const s = data.summary || {};
            setVariants({
                kind: 'ok',
                msg: `Listo. Grupos creados: ${(_a = s.gruposCreados) !== null && _a !== void 0 ? _a : 0}, productos vinculados: ${(_b = s.productosVinculados) !== null && _b !== void 0 ? _b : 0}, nombres normalizados: ${(_c = s.nombresNormalizados) !== null && _c !== void 0 ? _c : 0}.`
            });
        }
        catch (e) {
            setVariants({ kind: 'error', msg: (e === null || e === void 0 ? void 0 : e.message) || 'Error de conexión.' });
        }
    };
    const runImages = async () => {
        var _a, _b, _c;
        setImages({ kind: 'loading' });
        try {
            const { ok, data } = await callEndpoint('/api/optimize-images');
            if (!ok)
                return setImages({ kind: 'error', msg: data.error || 'Error al optimizar.' });
            setImages({
                kind: 'ok',
                msg: `Convertidas: ${(_a = data.convertidas) !== null && _a !== void 0 ? _a : 0}, ya optimizadas: ${(_b = data.yaOptimizadas) !== null && _b !== void 0 ? _b : 0}, DB sincronizadas: ${(_c = data.dbActualizadas) !== null && _c !== void 0 ? _c : 0}${data.dbSinWebp ? `, sin webp: ${data.dbSinWebp}` : ''}${data.pendientes ? `, pendientes: ${data.pendientes}` : ''}.`
            });
        }
        catch (e) {
            setImages({ kind: 'error', msg: (e === null || e === void 0 ? void 0 : e.message) || 'Error de conexión.' });
        }
    };
    const statusColor = (k) => k === 'ok' ? '#16a34a' : k === 'error' ? '#dc2626' : '#64748b';
    return (React.createElement(Card, null,
        React.createElement(CardHeader, null,
            React.createElement(CardTitle, null, "Herramientas de carga de cat\u00E1logo"),
            React.createElement(CardDescription, null, "Tras crear o editar productos, ejecut\u00E1 estas acciones para reflejar los cambios en la tienda.")),
        React.createElement(CardContent, null,
            React.createElement("div", { className: "flex flex-col sm:flex-row gap-6" },
                React.createElement("div", { className: "flex-1" },
                    React.createElement(Button, { variant: "outline", onClick: runVariants, disabled: variants.kind === 'loading' }, variants.kind === 'loading' ? 'Sincronizando…' : 'Sincronizar variantes'),
                    React.createElement("p", { className: "text-xs mt-2", style: { color: statusColor(variants.kind) } }, variants.msg || 'Agrupa productos por familia (Tamaño) para el selector en la ficha.')),
                React.createElement("div", { className: "flex-1" },
                    React.createElement(Button, { variant: "outline", onClick: runImages, disabled: images.kind === 'loading' }, images.kind === 'loading' ? 'Optimizando…' : 'Optimizar imágenes a WebP'),
                    React.createElement("p", { className: "text-xs mt-2", style: { color: statusColor(images.kind) } }, images.msg || 'Convierte a WebP las imágenes nuevas subidas al servidor.')),
                React.createElement("div", { className: "flex-1" },
                    React.createElement(Button, { variant: "outline", onClick: () => { window.location.href = variantSizeOrderUrl || '/orden-tamanos'; } }, "Orden de tama\u00F1os"),
                    React.createElement("p", { className: "text-xs mt-2", style: { color: '#64748b' } }, "Define el orden de aparici\u00F3n de los tama\u00F1os en el selector de variantes."))))));
}
export const layout = {
    areaId: 'content',
    sortOrder: 5
};
export const query = `
  query CatalogToolsQuery {
    variantSizeOrderUrl: url(routeId: "sizeOrderAdmin")
  }
`;
//# sourceMappingURL=CatalogTools.js.map