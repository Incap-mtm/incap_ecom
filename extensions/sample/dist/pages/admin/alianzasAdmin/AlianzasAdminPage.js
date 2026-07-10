/**
 * Página admin /alianzas-admin — gestiona la sección "Alianzas que construyen
 * país" de la página Quiénes Somos.
 *
 * Permite al admin:
 *   - editar el título y el párrafo introductorio
 *   - agregar / quitar / editar las ciudades (pastillas)
 *   - cambiar la imagen de la derecha (se convierte a WebP en el servidor)
 *
 * Todo se guarda dentro del setting JSON `quienes_somos` vía
 * POST /api/alianzas-config y lo lee el frontstore por GraphQL (fresh del DB).
 */
import React, { useState, useRef } from 'react';
import { useQuery } from 'urql';
const AZUL = '#2A4899';
const VERDE = '#85C639';
const BORDER = '#e2e8f0';
const QUERY = `
  query AlianzasAdminQuery {
    setting {
      quienesSomos
    }
  }
`;
function extractError(data, fallback) {
    var _a;
    if (typeof (data === null || data === void 0 ? void 0 : data.error) === 'string')
        return data.error;
    if (typeof ((_a = data === null || data === void 0 ? void 0 : data.error) === null || _a === void 0 ? void 0 : _a.message) === 'string')
        return data.error.message;
    return fallback;
}
function parseAlianzas(raw) {
    var _a;
    let a = {};
    try {
        a = ((_a = JSON.parse(raw || '{}')) === null || _a === void 0 ? void 0 : _a.alianzas) || {};
    }
    catch (_b) {
        a = {};
    }
    return {
        titulo: typeof a.titulo === 'string' ? a.titulo : 'Alianzas que construyen país',
        intro: typeof a.intro === 'string' ? a.intro : '',
        ciudades: Array.isArray(a.ciudades) ? a.ciudades.filter((c) => typeof c === 'string') : [],
        mapa: typeof a.mapa === 'string' ? a.mapa : '',
    };
}
export default function AlianzasAdminPage() {
    var _a, _b;
    const [result] = useQuery({ query: QUERY, requestPolicy: 'cache-and-network' });
    const initial = parseAlianzas((_b = (_a = result.data) === null || _a === void 0 ? void 0 : _a.setting) === null || _b === void 0 ? void 0 : _b.quienesSomos);
    const [intro, setIntro] = useState(initial.intro);
    const [ciudades, setCiudades] = useState(initial.ciudades);
    const [mapa, setMapa] = useState(initial.mapa);
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState('');
    const [hydrated, setHydrated] = useState(false);
    const [busy, setBusy] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);
    // Cuando la query resuelve (cache-and-network puede llegar tras el primer
    // render), rehidratamos el formulario una sola vez con los datos del setting.
    React.useEffect(() => {
        var _a, _b;
        if (!hydrated && ((_b = (_a = result.data) === null || _a === void 0 ? void 0 : _a.setting) === null || _b === void 0 ? void 0 : _b.quienesSomos)) {
            const a = parseAlianzas(result.data.setting.quienesSomos);
            setIntro(a.intro);
            setCiudades(a.ciudades);
            setMapa(a.mapa);
            setHydrated(true);
        }
    }, [result.data, hydrated]);
    function updateCiudad(i, value) {
        setCiudades((prev) => prev.map((c, idx) => (idx === i ? value : c)));
    }
    function removeCiudad(i) {
        setCiudades((prev) => prev.filter((_, idx) => idx !== i));
    }
    function addCiudad() {
        setCiudades((prev) => [...prev, '']);
    }
    function onPickFile(f) {
        setFile(f);
        if (preview)
            URL.revokeObjectURL(preview);
        setPreview(f ? URL.createObjectURL(f) : '');
    }
    async function handleSave() {
        var _a, _b;
        const cleaned = ciudades.map((c) => c.trim()).filter(Boolean);
        if (!cleaned.length) {
            setError('Agregá al menos una ciudad.');
            return;
        }
        setBusy(true);
        setError('');
        setSuccessMsg('');
        try {
            const fd = new FormData();
            fd.append('intro', intro.trim());
            fd.append('ciudades', JSON.stringify(cleaned));
            if (file)
                fd.append('mapa', file);
            const res = await fetch('/api/alianzas-config', {
                method: 'POST',
                credentials: 'same-origin',
                body: fd,
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok || !data.success) {
                setError(extractError(data, 'Error al guardar los cambios.'));
            }
            else {
                if ((_a = data.alianzas) === null || _a === void 0 ? void 0 : _a.mapa)
                    setMapa(data.alianzas.mapa);
                if (Array.isArray((_b = data.alianzas) === null || _b === void 0 ? void 0 : _b.ciudades))
                    setCiudades(data.alianzas.ciudades);
                setFile(null);
                if (preview) {
                    URL.revokeObjectURL(preview);
                    setPreview('');
                }
                if (fileInputRef.current)
                    fileInputRef.current.value = '';
                setSuccessMsg('Sección de alianzas actualizada correctamente.');
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
    const currentImg = preview || mapa;
    return (React.createElement("div", { style: { fontFamily: 'Sora, sans-serif', padding: '2rem', maxWidth: '760px' } },
        React.createElement("h1", { style: { fontSize: '1.5rem', fontWeight: 900, color: AZUL, margin: '0 0 4px' } }, "Alianzas que construyen pa\u00EDs"),
        React.createElement("p", { style: { fontSize: '13px', color: '#64748b', margin: '0 0 1.5rem' } },
            "Edit\u00E1 el t\u00EDtulo, el texto, las ciudades (pastillas) y la imagen de la secci\u00F3n \"Alianzas que construyen pa\u00EDs\" de la p\u00E1gina ",
            React.createElement("strong", null, "Qui\u00E9nes Somos"),
            "."),
        error && (React.createElement("div", { style: { background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '8px', padding: '10px 16px', marginBottom: '1rem', color: '#dc2626', fontSize: '13px' } }, error)),
        successMsg && (React.createElement("div", { style: { background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '8px', padding: '10px 16px', marginBottom: '1rem', color: '#16a34a', fontSize: '13px' } }, successMsg)),
        React.createElement("div", { style: { background: '#fff', border: `1px solid ${BORDER}`, borderRadius: '16px', padding: '1.75rem' } },
            React.createElement("label", { style: labelStyle }, "P\u00E1rrafo introductorio"),
            React.createElement("textarea", { style: { ...inputStyle, minHeight: '80px', resize: 'vertical', marginBottom: '1.5rem' }, value: intro, onChange: (e) => setIntro(e.target.value), placeholder: "Nuestra red nacional de distribuidores\u2026", maxLength: 800 }),
            React.createElement("label", { style: labelStyle }, "Ciudades (pastillas)"),
            React.createElement("p", { style: { fontSize: '11px', color: '#94a3b8', margin: '0 0 10px', lineHeight: 1.5 } }, "Cada ciudad se muestra como una pastilla verde. Agreg\u00E1 o quit\u00E1 las que quieras."),
            React.createElement("div", { style: { display: 'grid', gap: '8px', marginBottom: '10px' } },
                ciudades.map((ciudad, i) => (React.createElement("div", { key: i, style: { display: 'flex', gap: '8px', alignItems: 'center' } },
                    React.createElement("input", { style: { ...inputStyle, flex: 1 }, value: ciudad, onChange: (e) => updateCiudad(i, e.target.value), placeholder: "Nombre de la ciudad", maxLength: 40 }),
                    React.createElement("button", { type: "button", onClick: () => removeCiudad(i), title: "Quitar ciudad", style: { flexShrink: 0, width: '38px', height: '38px', borderRadius: '8px', border: '1px solid #fca5a5', background: '#fef2f2', color: '#dc2626', fontSize: '18px', fontWeight: 700, cursor: 'pointer', lineHeight: 1 } }, "\u00D7")))),
                ciudades.length === 0 && (React.createElement("p", { style: { fontSize: '12px', color: '#94a3b8', margin: 0 } }, "A\u00FAn no hay ciudades. Agreg\u00E1 la primera."))),
            React.createElement("button", { type: "button", onClick: addCiudad, style: { background: '#fff', color: AZUL, border: `1px dashed ${AZUL}`, borderRadius: '8px', padding: '9px 18px', fontSize: '12px', fontWeight: 800, cursor: 'pointer', fontFamily: 'Sora, sans-serif' } }, "+ Agregar ciudad"),
            ciudades.some((c) => c.trim()) && (React.createElement("div", { style: { display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '14px' } }, ciudades.filter((c) => c.trim()).map((c, i) => (React.createElement("span", { key: i, style: { display: 'inline-block', background: VERDE, color: '#181B1C', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', padding: '5px 12px', borderRadius: '20px' } }, c.trim()))))),
            React.createElement("div", { style: { borderTop: `1px solid ${BORDER}`, margin: '1.75rem 0 1.5rem' } }),
            React.createElement("label", { style: labelStyle }, "Imagen de la derecha"),
            currentImg ? (React.createElement("img", { src: currentImg, alt: "Mapa de alianzas", style: { maxWidth: '100%', maxHeight: '280px', objectFit: 'contain', borderRadius: '12px', border: `1px solid ${BORDER}`, display: 'block', marginBottom: '12px', background: '#f8fafc' } })) : (React.createElement("p", { style: { fontSize: '13px', color: '#94a3b8', marginBottom: '12px' } }, "A\u00FAn no hay imagen configurada.")),
            React.createElement("input", { ref: fileInputRef, type: "file", accept: "image/*", onChange: (e) => { var _a; return onPickFile(((_a = e.target.files) === null || _a === void 0 ? void 0 : _a[0]) || null); }, style: { fontSize: '13px', fontFamily: 'Sora, sans-serif' } }),
            file && (React.createElement("p", { style: { fontSize: '12px', color: '#16a34a', margin: '8px 0 0' } },
                "Nueva imagen: ",
                React.createElement("strong", null, file.name),
                " (",
                (file.size / 1024 / 1024).toFixed(2),
                " MB)")),
            React.createElement("p", { style: { fontSize: '11px', color: '#94a3b8', margin: '6px 0 0', lineHeight: 1.5 } }, "M\u00E1ximo 8 MB. Se convierte a WebP (m\u00E1x 1400px de ancho) y se guarda en el volumen de media. Dej\u00E1 el campo vac\u00EDo para conservar la imagen actual."),
            React.createElement("button", { type: "button", onClick: handleSave, disabled: busy, style: {
                    marginTop: '1.75rem', background: busy ? '#94a3b8' : AZUL, color: '#fff', border: 'none',
                    borderRadius: '8px', padding: '11px 26px', fontSize: '12px', fontWeight: 900,
                    cursor: busy ? 'not-allowed' : 'pointer', fontFamily: 'Sora, sans-serif',
                    textTransform: 'uppercase', letterSpacing: '0.08em',
                } }, busy ? 'Guardando…' : 'Guardar cambios'))));
}
export const layout = {
    areaId: 'content',
    sortOrder: 10,
};
//# sourceMappingURL=AlianzasAdminPage.js.map