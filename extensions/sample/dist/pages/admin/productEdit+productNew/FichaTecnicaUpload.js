import { Button } from '@components/common/ui/Button.js';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@components/common/ui/Card.js';
import React, { useState } from 'react';
const MAX_BYTES = 1024 * 1024; // 1 MB
export default function FichaTecnicaUpload({ product }) {
    var _a, _b;
    const productId = product === null || product === void 0 ? void 0 : product.productId;
    const current = ((_b = (_a = product === null || product === void 0 ? void 0 : product.attributes) === null || _a === void 0 ? void 0 : _a.find((a) => a.attributeCode === 'ficha_tecnica_url')) === null || _b === void 0 ? void 0 : _b.optionText) || '';
    const [status, setStatus] = useState('idle');
    const [message, setMessage] = useState('');
    const [url, setUrl] = useState(current);
    const handleFile = async (e) => {
        var _a, _b;
        const file = (_a = e.target.files) === null || _a === void 0 ? void 0 : _a[0];
        e.target.value = ''; // permitir re-seleccionar el mismo archivo
        if (!file)
            return;
        if (file.type !== 'application/pdf') {
            setStatus('error');
            setMessage('El archivo debe ser un PDF.');
            return;
        }
        if (file.size > MAX_BYTES) {
            setStatus('error');
            setMessage('El PDF supera el límite de 1 MB.');
            return;
        }
        if (!productId) {
            setStatus('error');
            setMessage('Guardá el producto antes de subir la ficha.');
            return;
        }
        setStatus('uploading');
        setMessage('');
        try {
            const fd = new FormData();
            fd.append('file', file);
            fd.append('productId', String(productId));
            const res = await fetch('/api/upload-ficha', {
                method: 'POST',
                credentials: 'include',
                body: fd
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok || data.success === false) {
                // Gotcha: extraer string del error para no crashear React
                const msg = typeof data.error === 'string'
                    ? data.error
                    : ((_b = data.error) === null || _b === void 0 ? void 0 : _b.message) || 'Error al subir la ficha.';
                setStatus('error');
                setMessage(msg);
                return;
            }
            setStatus('ok');
            setUrl(data.url);
            setMessage('Ficha técnica subida y guardada correctamente.');
        }
        catch (err) {
            setStatus('error');
            setMessage((err === null || err === void 0 ? void 0 : err.message) || 'Error de conexión.');
        }
    };
    const color = status === 'ok' ? '#16a34a' : status === 'error' ? '#dc2626' : '#64748b';
    return (React.createElement(Card, null,
        React.createElement(CardHeader, null,
            React.createElement(CardTitle, null, "Ficha T\u00E9cnica (PDF)"),
            React.createElement(CardDescription, null, "Sub\u00ED la ficha t\u00E9cnica del producto en PDF. Se guarda en el servidor y queda disponible para descarga en la p\u00E1gina del producto. El archivo no debe pesar m\u00E1s de 1\u00A0MB.")),
        React.createElement(CardContent, null,
            !productId ? (React.createElement("p", { style: { fontSize: '13px', color: '#b45309' } }, "Guard\u00E1 el producto primero para poder subir la ficha t\u00E9cnica.")) : (React.createElement(React.Fragment, null,
                React.createElement("input", { id: "ficha-pdf-input", type: "file", accept: "application/pdf,.pdf", style: { display: 'none' }, onChange: handleFile, disabled: status === 'uploading' }),
                React.createElement(Button, { variant: "outline", onClick: (e) => {
                        var _a;
                        e.preventDefault();
                        (_a = document.getElementById('ficha-pdf-input')) === null || _a === void 0 ? void 0 : _a.click();
                    }, disabled: status === 'uploading' }, status === 'uploading'
                    ? 'Subiendo…'
                    : url
                        ? 'Reemplazar PDF'
                        : 'Subir PDF'),
                url && (React.createElement("p", { style: { fontSize: '12px', marginTop: '8px', color: '#374151' } },
                    "Ficha actual:",
                    ' ',
                    React.createElement("a", { href: url, target: "_blank", rel: "noopener noreferrer", style: { color: '#2A4899', fontWeight: 600 } }, url))),
                React.createElement("p", { style: { fontSize: '11px', color: '#94a3b8', marginTop: '6px' } }, "Solo PDF \u00B7 m\u00E1ximo 1\u00A0MB"))),
            message && (React.createElement("p", { style: { fontSize: '12px', marginTop: '6px', color } }, message)))));
}
export const layout = {
    areaId: 'productEditGeneral',
    sortOrder: 25
};
export const query = `
  query Query {
    product(id: getContextValue("productId", null)) {
      productId
      sku
      attributes: attributeIndex {
        attributeCode
        optionText
      }
    }
  }
`;
//# sourceMappingURL=FichaTecnicaUpload.js.map