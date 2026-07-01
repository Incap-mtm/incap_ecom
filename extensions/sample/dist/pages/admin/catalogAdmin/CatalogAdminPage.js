/**
 * Página admin /catalog-admin — gestiona el botón "Descargar Catálogo" del header.
 *
 * Permite actualizar (se actualiza cada mes):
 *   - el PDF del catálogo (subida al volumen de media → /assets/catalogo/...)
 *   - el texto del botón
 *
 * Ambos se guardan en settings (catalog_url, catalog_button_text) vía
 * POST /api/catalog-config y se leen en el Navbar por GraphQL.
 */
import React, { useState, useRef } from 'react';
const AZUL = '#2A4899';
const VERDE = '#85C639';
const BORDER = '#e2e8f0';
function extractError(data, fallback) {
    var _a;
    if (typeof (data === null || data === void 0 ? void 0 : data.error) === 'string')
        return data.error;
    if (typeof ((_a = data === null || data === void 0 ? void 0 : data.error) === null || _a === void 0 ? void 0 : _a.message) === 'string')
        return data.error.message;
    return fallback;
}
export default function CatalogAdminPage({ setting }) {
    const [buttonText, setButtonText] = useState((setting === null || setting === void 0 ? void 0 : setting.catalogButtonText) || 'Descargar Catálogo');
    const [currentUrl, setCurrentUrl] = useState((setting === null || setting === void 0 ? void 0 : setting.catalogUrl) || '');
    const [leadEmails, setLeadEmails] = useState((setting === null || setting === void 0 ? void 0 : setting.leadEmails) || '');
    const [file, setFile] = useState(null);
    const [busy, setBusy] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);
    async function handleSave() {
        if (!buttonText.trim()) {
            setError('El texto del botón es requerido.');
            return;
        }
        setBusy(true);
        setError('');
        setSuccessMsg('');
        try {
            const fd = new FormData();
            fd.append('buttonText', buttonText.trim());
            fd.append('leadEmails', leadEmails.trim());
            if (file)
                fd.append('catalog', file);
            const res = await fetch('/api/catalog-config', {
                method: 'POST',
                credentials: 'same-origin',
                body: fd,
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok || !data.success) {
                setError(extractError(data, 'Error al guardar la configuración.'));
            }
            else {
                if (data.catalogUrl)
                    setCurrentUrl(data.catalogUrl);
                setFile(null);
                if (fileInputRef.current)
                    fileInputRef.current.value = '';
                setSuccessMsg('Catálogo actualizado correctamente.');
                setTimeout(() => setSuccessMsg(''), 4000);
            }
        }
        catch (e) {
            setError((e === null || e === void 0 ? void 0 : e.message) || 'Error de conexión.');
        }
        finally {
            setBusy(false);
        }
    }
    const labelStyle = {
        fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase',
        letterSpacing: '0.1em', display: 'block', marginBottom: '6px', fontFamily: 'Sora, sans-serif',
    };
    const inputStyle = {
        width: '100%', padding: '10px 14px', border: `1px solid ${BORDER}`, borderRadius: '8px',
        fontSize: '13px', fontFamily: 'Sora, sans-serif', color: '#181B1C', outline: 'none',
        boxSizing: 'border-box', background: '#f8fafc',
    };
    return (React.createElement("div", { style: { fontFamily: 'Sora, sans-serif', padding: '2rem', maxWidth: '720px' } },
        React.createElement("h1", { style: { fontSize: '1.5rem', fontWeight: 900, color: AZUL, margin: '0 0 4px' } }, "Cat\u00E1logo descargable"),
        React.createElement("p", { style: { fontSize: '13px', color: '#64748b', margin: '0 0 1.5rem' } }, "Actualiz\u00E1 el PDF del cat\u00E1logo y el texto del bot\u00F3n del header (se actualiza cada mes), y gestion\u00E1 los correos que reciben las descargas de fichas y cat\u00E1logo."),
        error && (React.createElement("div", { style: { background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '8px', padding: '10px 16px', marginBottom: '1rem', color: '#dc2626', fontSize: '13px' } }, error)),
        successMsg && (React.createElement("div", { style: { background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '8px', padding: '10px 16px', marginBottom: '1rem', color: '#16a34a', fontSize: '13px' } }, successMsg)),
        React.createElement("div", { style: { background: '#fff', border: `1px solid ${BORDER}`, borderRadius: '16px', padding: '1.75rem' } },
            React.createElement("label", { style: labelStyle }, "Texto del bot\u00F3n"),
            React.createElement("input", { style: { ...inputStyle, marginBottom: '1.5rem' }, value: buttonText, onChange: (e) => setButtonText(e.target.value), placeholder: "Descargar Cat\u00E1logo", maxLength: 40 }),
            React.createElement("label", { style: labelStyle }, "Cat\u00E1logo actual (PDF)"),
            currentUrl ? (React.createElement("a", { href: currentUrl, target: "_blank", rel: "noopener noreferrer", style: { display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: AZUL, fontWeight: 700, textDecoration: 'none', marginBottom: '1rem' } },
                React.createElement("svg", { width: "16", height: "16", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
                    React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" })),
                "Ver cat\u00E1logo actual \u2192")) : (React.createElement("p", { style: { fontSize: '13px', color: '#94a3b8', marginBottom: '1rem' } }, "A\u00FAn no hay un PDF configurado.")),
            React.createElement("div", { style: { marginTop: '0.75rem' } },
                React.createElement("label", { style: labelStyle },
                    "Subir nuevo PDF ",
                    React.createElement("span", { style: { textTransform: 'none', color: '#94a3b8', fontWeight: 400 } }, "(opcional \u2014 dejalo vac\u00EDo para solo cambiar el texto)")),
                React.createElement("input", { ref: fileInputRef, type: "file", accept: "application/pdf", onChange: (e) => { var _a; return setFile(((_a = e.target.files) === null || _a === void 0 ? void 0 : _a[0]) || null); }, style: { fontSize: '13px', fontFamily: 'Sora, sans-serif' } }),
                file && (React.createElement("p", { style: { fontSize: '12px', color: '#16a34a', margin: '8px 0 0' } },
                    "Nuevo archivo seleccionado: ",
                    React.createElement("strong", null, file.name),
                    " (",
                    (file.size / 1024 / 1024).toFixed(2),
                    " MB)")),
                React.createElement("p", { style: { fontSize: '11px', color: '#94a3b8', margin: '6px 0 0', lineHeight: 1.5 } }, "M\u00E1ximo 15 MB. El PDF queda en el volumen de media y se sirve en /assets/catalogo/...")),
            React.createElement("div", { style: { borderTop: `1px solid ${BORDER}`, margin: '1.75rem 0 1.5rem' } }),
            React.createElement("label", { style: labelStyle }, "Correos de notificaci\u00F3n de leads"),
            React.createElement("textarea", { style: { ...inputStyle, minHeight: '70px', resize: 'vertical', fontFamily: 'Inter, sans-serif' }, value: leadEmails, onChange: (e) => setLeadEmails(e.target.value), placeholder: "correo1@empresa.com, correo2@empresa.com" }),
            React.createElement("p", { style: { fontSize: '11px', color: '#94a3b8', margin: '6px 0 0', lineHeight: 1.5 } },
                "A estos correos llega cada descarga de ",
                React.createElement("strong", null, "ficha t\u00E9cnica"),
                " y de ",
                React.createElement("strong", null, "cat\u00E1logo"),
                ". Pod\u00E9s poner varios separados por coma. Si lo dej\u00E1s vac\u00EDo, se usa el correo por defecto del sistema."),
            React.createElement("button", { type: "button", onClick: handleSave, disabled: busy, style: {
                    marginTop: '1.5rem', background: busy ? '#94a3b8' : AZUL, color: '#fff', border: 'none',
                    borderRadius: '8px', padding: '11px 26px', fontSize: '12px', fontWeight: 900,
                    cursor: busy ? 'not-allowed' : 'pointer', fontFamily: 'Sora, sans-serif',
                    textTransform: 'uppercase', letterSpacing: '0.08em',
                } }, busy ? 'Guardando…' : 'Guardar cambios')),
        React.createElement("p", { style: { fontSize: '11px', color: '#94a3b8', marginTop: '1rem', lineHeight: 1.6 } }, "El bot\u00F3n aparece en el header (escritorio y m\u00F3vil). Al hacer clic, el visitante completa un formulario breve y luego descarga el cat\u00E1logo \u2014 igual que las fichas t\u00E9cnicas.")));
}
export const layout = {
    areaId: 'content',
    sortOrder: 10,
};
export const query = `
  query CatalogAdminQuery {
    setting {
      catalogUrl
      catalogButtonText
      leadEmails
    }
  }
`;
//# sourceMappingURL=CatalogAdminPage.js.map