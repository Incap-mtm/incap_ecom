import React, { useState } from 'react';
export default function TechnicalSheet({ product }) {
    const fichaAttr = product?.attributes?.find((a)=>a.attributeCode === 'ficha_tecnica_url' || a.attributeCode === 'ficha_tecnica');
    const fichaUrl = fichaAttr?.optionText;
    const [status, setStatus] = useState('idle');
    const [form, setForm] = useState({
        nombre: '',
        email: '',
        telefono: ''
    });
    const [errorMsg, setErrorMsg] = useState('');
    if (!fichaUrl) return null;
    const handleSubmit = async (e)=>{
        e.preventDefault();
        setStatus('submitting');
        setErrorMsg('');
        try {
            const res = await fetch('/api/ficha-lead', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...form,
                    productName: product?.name || '',
                    sku: product?.sku || '',
                    fichaUrl
                })
            });
            const data = await res.json();
            if (!res.ok) {
                setErrorMsg(data.error || 'Error al enviar. Intenta de nuevo.');
                setStatus('error');
                return;
            }
            setStatus('success');
            // Trigger download
            const a = document.createElement('a');
            a.href = fichaUrl;
            a.target = '_blank';
            a.rel = 'noopener noreferrer';
            a.click();
        } catch  {
            setErrorMsg('Error de conexión. Intenta de nuevo.');
            setStatus('error');
        }
    };
    const close = ()=>{
        setStatus('idle');
        setErrorMsg('');
    };
    return /*#__PURE__*/ React.createElement("div", {
        className: "mt-10 border-t border-slate-100 pt-10"
    }, /*#__PURE__*/ React.createElement("h3", {
        className: "text-lg font-bold text-[#181B1C] mb-4",
        style: {
            fontFamily: 'Sora, sans-serif'
        }
    }, "Ficha Técnica"), /*#__PURE__*/ React.createElement("button", {
        onClick: ()=>setStatus('open'),
        className: "inline-flex items-center gap-3 px-6 py-3 bg-[#2A4899] hover:bg-[#1e3a7a] text-white font-semibold rounded-lg transition-all duration-300 group",
        style: {
            fontFamily: 'Sora, sans-serif'
        }
    }, /*#__PURE__*/ React.createElement("svg", {
        className: "w-5 h-5",
        fill: "none",
        stroke: "currentColor",
        viewBox: "0 0 24 24"
    }, /*#__PURE__*/ React.createElement("path", {
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeWidth: 2,
        d: "M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    })), "Descargar Ficha Técnica", /*#__PURE__*/ React.createElement("span", {
        className: "text-xs opacity-70"
    }, "(PDF)")), /*#__PURE__*/ React.createElement("p", {
        className: "mt-2 text-xs text-slate-400"
    }, "Incluye especificaciones, modo de aplicación y seguridad."), (status === 'open' || status === 'submitting' || status === 'success' || status === 'error') && /*#__PURE__*/ React.createElement("div", {
        style: {
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.55)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
        },
        onClick: (e)=>{
            if (e.target === e.currentTarget) close();
        }
    }, /*#__PURE__*/ React.createElement("div", {
        style: {
            background: '#fff',
            borderRadius: '20px',
            padding: '2rem',
            width: '100%',
            maxWidth: '420px',
            boxShadow: '0 24px 64px rgba(0,0,0,0.2)',
            fontFamily: 'Sora, sans-serif'
        }
    }, status === 'success' ? /*#__PURE__*/ React.createElement("div", {
        style: {
            textAlign: 'center',
            padding: '1rem 0'
        }
    }, /*#__PURE__*/ React.createElement("div", {
        style: {
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: '#f0fdf4',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem'
        }
    }, /*#__PURE__*/ React.createElement("svg", {
        width: "28",
        height: "28",
        fill: "none",
        stroke: "#16a34a",
        viewBox: "0 0 24 24"
    }, /*#__PURE__*/ React.createElement("path", {
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeWidth: 2.5,
        d: "M5 13l4 4L19 7"
    }))), /*#__PURE__*/ React.createElement("h3", {
        style: {
            fontSize: '18px',
            fontWeight: 800,
            color: '#181B1C',
            marginBottom: '8px'
        }
    }, "¡Descarga iniciada!"), /*#__PURE__*/ React.createElement("p", {
        style: {
            fontSize: '13px',
            color: '#64748b',
            lineHeight: 1.6,
            marginBottom: '1.5rem'
        }
    }, "Tu ficha técnica se está descargando. Si no inicia automáticamente,", ' ', /*#__PURE__*/ React.createElement("a", {
        href: fichaUrl,
        target: "_blank",
        rel: "noopener noreferrer",
        style: {
            color: '#2A4899',
            fontWeight: 700
        }
    }, "haz clic aquí"), "."), /*#__PURE__*/ React.createElement("button", {
        onClick: close,
        style: {
            padding: '10px 24px',
            background: '#2A4899',
            color: '#fff',
            border: 'none',
            borderRadius: '10px',
            fontWeight: 700,
            cursor: 'pointer',
            fontSize: '13px'
        }
    }, "Cerrar")) : /*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement("div", {
        style: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.5rem'
        }
    }, /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("h3", {
        style: {
            fontSize: '17px',
            fontWeight: 800,
            color: '#181B1C',
            margin: 0
        }
    }, "Descargar Ficha Técnica"), /*#__PURE__*/ React.createElement("p", {
        style: {
            fontSize: '12px',
            color: '#94a3b8',
            marginTop: '4px',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 400
        }
    }, "Completa tus datos para continuar")), /*#__PURE__*/ React.createElement("button", {
        onClick: close,
        style: {
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#94a3b8',
            padding: '4px'
        }
    }, /*#__PURE__*/ React.createElement("svg", {
        width: "20",
        height: "20",
        fill: "none",
        stroke: "currentColor",
        viewBox: "0 0 24 24"
    }, /*#__PURE__*/ React.createElement("path", {
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeWidth: 2,
        d: "M6 18L18 6M6 6l12 12"
    })))), /*#__PURE__*/ React.createElement("form", {
        onSubmit: handleSubmit,
        style: {
            display: 'flex',
            flexDirection: 'column',
            gap: '14px'
        }
    }, [
        'nombre',
        'email',
        'telefono'
    ].map((field)=>/*#__PURE__*/ React.createElement("div", {
            key: field
        }, /*#__PURE__*/ React.createElement("label", {
            style: {
                display: 'block',
                fontSize: '11px',
                fontWeight: 700,
                color: '#374151',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '6px'
            }
        }, field === 'nombre' ? 'Nombre completo' : field === 'email' ? 'Correo electrónico' : 'Teléfono'), /*#__PURE__*/ React.createElement("input", {
            type: field === 'email' ? 'email' : field === 'telefono' ? 'tel' : 'text',
            required: true,
            value: form[field],
            onChange: (e)=>setForm((f)=>({
                        ...f,
                        [field]: e.target.value
                    })),
            disabled: status === 'submitting',
            placeholder: field === 'nombre' ? 'Tu nombre' : field === 'email' ? 'correo@empresa.com' : '+57 300 000 0000',
            style: {
                width: '100%',
                padding: '10px 14px',
                border: '1.5px solid #e2e8f0',
                borderRadius: '10px',
                fontSize: '13px',
                fontFamily: 'Inter, sans-serif',
                outline: 'none',
                boxSizing: 'border-box',
                background: status === 'submitting' ? '#f8fafc' : '#fff',
                color: '#181B1C'
            },
            onFocus: (e)=>{
                e.target.style.borderColor = '#2A4899';
            },
            onBlur: (e)=>{
                e.target.style.borderColor = '#e2e8f0';
            }
        }))), errorMsg && /*#__PURE__*/ React.createElement("p", {
        style: {
            fontSize: '12px',
            color: '#dc2626',
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '8px',
            padding: '8px 12px',
            margin: 0
        }
    }, errorMsg), /*#__PURE__*/ React.createElement("button", {
        type: "submit",
        disabled: status === 'submitting',
        style: {
            padding: '12px',
            background: status === 'submitting' ? '#94a3b8' : '#2A4899',
            color: '#fff',
            border: 'none',
            borderRadius: '12px',
            fontWeight: 800,
            cursor: status === 'submitting' ? 'default' : 'pointer',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'background 0.2s',
            marginTop: '4px'
        }
    }, status === 'submitting' ? /*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement("svg", {
        style: {
            animation: 'spin 1s linear infinite'
        },
        width: "16",
        height: "16",
        fill: "none",
        stroke: "currentColor",
        viewBox: "0 0 24 24"
    }, /*#__PURE__*/ React.createElement("path", {
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeWidth: 2,
        d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
    })), "Enviando…") : /*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement("svg", {
        width: "16",
        height: "16",
        fill: "none",
        stroke: "currentColor",
        viewBox: "0 0 24 24"
    }, /*#__PURE__*/ React.createElement("path", {
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeWidth: 2,
        d: "M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    })), "Descargar PDF")), /*#__PURE__*/ React.createElement("p", {
        style: {
            fontSize: '10px',
            color: '#94a3b8',
            textAlign: 'center',
            margin: 0,
            fontFamily: 'Inter, sans-serif'
        }
    }, "Tus datos son confidenciales y no se comparten con terceros."))))), /*#__PURE__*/ React.createElement("style", null, `@keyframes spin { to { transform: rotate(360deg); } }`));
}
export const layout = {
    areaId: 'productPageBottom',
    sortOrder: 10
};
export const query = `
query Query {
    product: currentProduct {
      name
      sku
      attributes: attributeIndex {
        attributeCode
        optionText
      }
    }
}
`;
