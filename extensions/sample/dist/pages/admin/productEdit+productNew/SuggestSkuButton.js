import { Button } from '@components/common/ui/Button.js';
import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
export default function SuggestSkuButton() {
    const { getValues, setValue } = useFormContext();
    const [status, setStatus] = useState('idle');
    const [message, setMessage] = useState('');
    const [result, setResult] = useState(null);
    const handleSuggest = async () => {
        var _a;
        const name = getValues('name');
        if (!name || !String(name).trim()) {
            setStatus('error');
            setMessage('Escribí primero el nombre del producto.');
            setResult(null);
            return;
        }
        setStatus('loading');
        setMessage('');
        setResult(null);
        try {
            const res = await fetch('/api/suggest-sku', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: String(name).trim() })
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok || data.success === false) {
                // Gotcha #4: extraer string del error para no crashear React
                const errMsg = typeof data.error === 'string'
                    ? data.error
                    : ((_a = data.error) === null || _a === void 0 ? void 0 : _a.message) || 'Error al sugerir SKU.';
                setStatus('error');
                setMessage(errMsg);
                return;
            }
            const suggestion = data.data;
            // Rellenar el campo sku (shouldDirty:true para que el form lo marque como modificado)
            setValue('sku', suggestion.sku, { shouldDirty: true });
            setStatus('ok');
            setResult(suggestion);
            const parts = [];
            if (suggestion.source === 'sibling') {
                parts.push('Prefijo copiado de un producto hermano.');
            }
            else {
                parts.push('Prefijo generado (familia nueva).');
            }
            if (suggestion.needsReview) {
                parts.push('Revisá el SKU sugerido antes de guardar.');
            }
            if (suggestion.note) {
                parts.push(suggestion.note);
            }
            setMessage(parts.join(' '));
        }
        catch (e) {
            setStatus('error');
            setMessage((e === null || e === void 0 ? void 0 : e.message) || 'Error de conexión.');
        }
    };
    const msgColor = status === 'ok'
        ? (result === null || result === void 0 ? void 0 : result.needsReview)
            ? '#b45309' // amber: ok pero revisar
            : '#16a34a' // verde: confiable
        : status === 'error'
            ? '#dc2626' // rojo
            : '#64748b'; // gris: idle/loading
    return (React.createElement("div", { style: { marginTop: '4px', marginBottom: '4px' } },
        React.createElement(Button, { variant: "outline", onClick: (e) => {
                e.preventDefault();
                handleSuggest();
            }, disabled: status === 'loading' }, status === 'loading' ? 'Sugiriendo…' : 'Sugerir SKU'),
        message && (React.createElement("p", { style: { fontSize: '12px', marginTop: '6px', color: msgColor } }, message))));
}
export const layout = {
    areaId: 'productEditGeneral',
    sortOrder: 21
};
//# sourceMappingURL=SuggestSkuButton.js.map