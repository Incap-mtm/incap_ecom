import React, { useState } from 'react';
const EMPTY = { nombre: '', cargo: '', celular: '', correo: '', fabrica: '', comercializa: '' };
export default function LeadDownloadModal({ context, title, onClose }) {
    const [status, setStatus] = useState('form');
    const [form, setForm] = useState(EMPTY);
    const [errorMsg, setErrorMsg] = useState('');
    const downloadUrl = context.downloadUrl;
    const set = (key, value) => setForm(f => ({ ...f, [key]: value }));
    const handleSubmit = async (e) => {
        var _a;
        e.preventDefault();
        if (!form.fabrica || !form.comercializa) {
            setErrorMsg('Por favor respondé las dos últimas preguntas (Sí / No).');
            return;
        }
        setStatus('submitting');
        setErrorMsg('');
        try {
            const payload = {
                tipo: context.kind, // 'ficha' | 'catalogo'
                nombre: form.nombre,
                cargo: form.cargo,
                celular: form.celular,
                correo: form.correo,
                fabrica: form.fabrica,
                comercializa: form.comercializa,
                downloadUrl,
            };
            if (context.kind === 'ficha') {
                payload.productName = context.productName;
                payload.sku = context.sku;
            }
            const res = await fetch('/api/ficha-lead', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) {
                const msg = typeof (data === null || data === void 0 ? void 0 : data.error) === 'string' ? data.error : (((_a = data === null || data === void 0 ? void 0 : data.error) === null || _a === void 0 ? void 0 : _a.message) || 'Error al enviar. Intenta de nuevo.');
                setErrorMsg(msg);
                setStatus('error');
                return;
            }
            setStatus('success');
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.target = '_blank';
            a.rel = 'noopener noreferrer';
            a.click();
        }
        catch (_b) {
            setErrorMsg('Error de conexión. Intenta de nuevo.');
            setStatus('error');
        }
    };
    const labelStyle = {
        display: 'block', fontSize: '11px', fontWeight: 700, color: '#374151',
        textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px',
    };
    const inputStyle = {
        width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: '10px',
        fontSize: '13px', fontFamily: 'Inter, sans-serif', outline: 'none', boxSizing: 'border-box',
        background: status === 'submitting' ? '#f8fafc' : '#fff', color: '#181B1C',
    };
    const YesNoField = ({ field, label }) => (React.createElement("div", null,
        React.createElement("label", { style: labelStyle }, label),
        React.createElement("div", { style: { display: 'flex', gap: '8px' } }, ['si', 'no'].map(opt => {
            const active = form[field] === opt;
            return (React.createElement("button", { key: opt, type: "button", onClick: () => set(field, opt), disabled: status === 'submitting', style: {
                    flex: 1, padding: '9px', borderRadius: '10px', cursor: 'pointer',
                    border: `1.5px solid ${active ? '#2A4899' : '#e2e8f0'}`,
                    background: active ? '#2A4899' : '#fff',
                    color: active ? '#fff' : '#374151',
                    fontWeight: 700, fontSize: '13px', fontFamily: 'Sora, sans-serif',
                    transition: 'all 0.15s',
                } }, opt === 'si' ? 'Sí' : 'No'));
        }))));
    return (React.createElement("div", { style: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }, onClick: (e) => { if (e.target === e.currentTarget)
            onClose(); } },
        React.createElement("div", { style: { background: '#fff', borderRadius: '20px', padding: '2rem', width: '100%', maxWidth: '440px', maxHeight: '92vh', overflowY: 'auto', boxShadow: '0 24px 64px rgba(0,0,0,0.2)', fontFamily: 'Sora, sans-serif' } }, status === 'success' ? (React.createElement("div", { style: { textAlign: 'center', padding: '1rem 0' } },
            React.createElement("div", { style: { width: '56px', height: '56px', borderRadius: '50%', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' } },
                React.createElement("svg", { width: "28", height: "28", fill: "none", stroke: "#16a34a", viewBox: "0 0 24 24" },
                    React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2.5, d: "M5 13l4 4L19 7" }))),
            React.createElement("h3", { style: { fontSize: '18px', fontWeight: 800, color: '#181B1C', marginBottom: '8px' } }, "\u00A1Descarga iniciada!"),
            React.createElement("p", { style: { fontSize: '13px', color: '#64748b', lineHeight: 1.6, marginBottom: '1.5rem' } },
                "Tu descarga se est\u00E1 iniciando. Si no arranca autom\u00E1ticamente,",
                ' ',
                React.createElement("a", { href: downloadUrl, target: "_blank", rel: "noopener noreferrer", style: { color: '#2A4899', fontWeight: 700 } }, "haz clic aqu\u00ED"),
                "."),
            React.createElement("button", { onClick: onClose, style: { padding: '10px 24px', background: '#2A4899', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', fontSize: '13px' } }, "Cerrar"))) : (React.createElement(React.Fragment, null,
            React.createElement("div", { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' } },
                React.createElement("div", null,
                    React.createElement("h3", { style: { fontSize: '17px', fontWeight: 800, color: '#181B1C', margin: 0 } }, title),
                    React.createElement("p", { style: { fontSize: '12px', color: '#94a3b8', marginTop: '4px', fontFamily: 'Inter, sans-serif', fontWeight: 400 } }, "Completa tus datos para continuar")),
                React.createElement("button", { onClick: onClose, style: { background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '4px' } },
                    React.createElement("svg", { width: "20", height: "20", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
                        React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" })))),
            React.createElement("form", { onSubmit: handleSubmit, style: { display: 'flex', flexDirection: 'column', gap: '14px' } },
                React.createElement("div", null,
                    React.createElement("label", { style: labelStyle }, "Nombre (persona natural o empresa)"),
                    React.createElement("input", { type: "text", required: true, value: form.nombre, onChange: (e) => set('nombre', e.target.value), disabled: status === 'submitting', placeholder: "Tu nombre o raz\u00F3n social", style: inputStyle })),
                React.createElement("div", null,
                    React.createElement("label", { style: labelStyle },
                        "Cargo ",
                        React.createElement("span", { style: { textTransform: 'none', color: '#94a3b8', fontWeight: 400 } }, "(opcional)")),
                    React.createElement("input", { type: "text", value: form.cargo, onChange: (e) => set('cargo', e.target.value), disabled: status === 'submitting', placeholder: "Ej: Jefe de producci\u00F3n", style: inputStyle })),
                React.createElement("div", null,
                    React.createElement("label", { style: labelStyle }, "Celular"),
                    React.createElement("input", { type: "tel", required: true, value: form.celular, onChange: (e) => set('celular', e.target.value), disabled: status === 'submitting', placeholder: "+57 300 000 0000", style: inputStyle })),
                React.createElement("div", null,
                    React.createElement("label", { style: labelStyle }, "Correo"),
                    React.createElement("input", { type: "email", required: true, value: form.correo, onChange: (e) => set('correo', e.target.value), disabled: status === 'submitting', placeholder: "correo@empresa.com", style: inputStyle })),
                React.createElement(YesNoField, { field: "fabrica", label: "\u00BFFabricas con nuestros productos?" }),
                React.createElement(YesNoField, { field: "comercializa", label: "\u00BFComercializas con nuestros productos?" }),
                errorMsg && (React.createElement("p", { style: { fontSize: '12px', color: '#dc2626', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '8px 12px', margin: 0 } }, errorMsg)),
                React.createElement("button", { type: "submit", disabled: status === 'submitting', style: { padding: '12px', background: status === 'submitting' ? '#94a3b8' : '#2A4899', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 800, cursor: status === 'submitting' ? 'default' : 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '4px' } }, status === 'submitting' ? 'Enviando…' : 'Descargar PDF'),
                React.createElement("p", { style: { fontSize: '10px', color: '#94a3b8', textAlign: 'center', margin: 0, fontFamily: 'Inter, sans-serif' } }, "Tus datos son confidenciales y no se comparten con terceros.")))))));
}
