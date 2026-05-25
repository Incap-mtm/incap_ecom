import React, { useState, useRef, useEffect } from 'react';
const AGENT_IMG = '/images/icons/imagen-chatflotante.png';
const CHIPS = [
    { label: '🔧 Tengo fallas de pegue', prompt: 'Tengo problemas de adhesión, el pegue está fallando. ¿Qué puede estar causando esto y qué producto me recomiendas?' },
    { label: '🧱 Necesito pegar materiales', prompt: 'Necesito pegar dos materiales específicos.' },
    { label: '🏭 ¿Qué producto para mi industria?', prompt: 'Trabajo en la industria de adhesivos y necesito orientación sobre qué producto usar.' },
    { label: '💬 Consulta libre', prompt: '' },
];
function AgentAvatar({ size }) {
    return (React.createElement("div", { style: { width: size, height: size, borderRadius: '50%', flexShrink: 0, overflow: 'hidden' } },
        React.createElement("img", { src: AGENT_IMG, alt: "Asesor INCAP", style: { width: '100%', height: '100%', objectFit: 'cover' } })));
}
function UserBubble({ content }) {
    return (React.createElement("div", { style: { display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' } },
        React.createElement("div", { style: { background: '#2A4899', color: '#fff', borderRadius: '16px 16px 4px 16px', padding: '10px 14px', maxWidth: '80%', fontSize: '13px', lineHeight: 1.5 } }, content)));
}
function AssistantBubble({ content, products }) {
    return (React.createElement("div", { style: { marginBottom: '12px' } },
        React.createElement("div", { style: { display: 'flex', gap: '8px', alignItems: 'flex-start' } },
            React.createElement(AgentAvatar, { size: 28 }),
            React.createElement("div", { style: { background: '#f8fafc', borderRadius: '4px 16px 16px 16px', padding: '10px 14px', maxWidth: '85%', fontSize: '13px', lineHeight: 1.6, color: '#374151', border: '1px solid #e2e8f0' } }, content)),
        products && products.length > 0 && (React.createElement("div", { style: { marginLeft: '36px', marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '6px' } }, products.map(p => (React.createElement("a", { key: p.sku, href: p.url, style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', textDecoration: 'none', transition: 'all 0.15s' }, onMouseEnter: e => { e.currentTarget.style.borderColor = '#2A4899'; e.currentTarget.style.background = '#f0f5ff'; }, onMouseLeave: e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '#fff'; } },
            React.createElement("div", null,
                React.createElement("div", { style: { fontSize: '12px', fontWeight: 700, color: '#181B1C' } }, p.name),
                React.createElement("div", { style: { fontSize: '10px', color: '#94a3b8', fontWeight: 600 } }, p.sku)),
            React.createElement("svg", { width: "14", height: "14", fill: "none", stroke: "#2A4899", viewBox: "0 0 24 24" },
                React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2.5, d: "M9 5l7 7-7 7" })))))))));
}
function TypingIndicator() {
    return (React.createElement("div", { style: { display: 'flex', gap: '8px', alignItems: 'flex-start', marginBottom: '12px' } },
        React.createElement(AgentAvatar, { size: 28 }),
        React.createElement("div", { style: { background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px 16px 16px 16px', padding: '12px 16px', display: 'flex', gap: '4px', alignItems: 'center' } }, [0, 1, 2].map(i => (React.createElement("div", { key: i, style: { width: '6px', height: '6px', borderRadius: '50%', background: '#2A4899', animation: 'bounce 1.2s infinite', animationDelay: `${i * 0.2}s`, opacity: 0.7 } }))))));
}
export default function TechnicalAdvisor() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [chipsUsed, setChipsUsed] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    useEffect(() => {
        var _a;
        (_a = messagesEndRef.current) === null || _a === void 0 ? void 0 : _a.scrollIntoView({ behavior: 'smooth' });
    }, [messages, loading]);
    useEffect(() => {
        if (isOpen)
            setTimeout(() => { var _a; return (_a = inputRef.current) === null || _a === void 0 ? void 0 : _a.focus(); }, 300);
    }, [isOpen]);
    const sendMessage = async (content) => {
        if (!content.trim() || loading)
            return;
        setChipsUsed(true);
        const userMsg = { role: 'user', content };
        const history = [...messages, userMsg];
        setMessages(history);
        setInput('');
        setLoading(true);
        try {
            const res = await fetch('/api/technical-advisor', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: history.map(m => ({ role: m.role, content: m.content })) }),
            });
            const data = await res.json();
            let reply = data.reply;
            if (!reply) {
                if (data.error === 'Servicio no configurado') {
                    reply = 'El servicio de IA no está disponible en este momento. Contáctanos por WhatsApp para asesoría.';
                }
                else {
                    reply = data.error || 'No pude procesar tu consulta. Intenta de nuevo.';
                }
            }
            setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: reply,
                    products: data.products || [],
                }]);
        }
        catch (_a) {
            setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: 'Ocurrió un error de conexión. Por favor intenta de nuevo.',
                    products: [],
                }]);
        }
        finally {
            setLoading(false);
        }
    };
    const handleChip = (chip) => {
        setChipsUsed(true);
        if (chip.prompt)
            sendMessage(chip.prompt);
    };
    const handleReset = () => {
        setMessages([]);
        setChipsUsed(false);
        setInput('');
    };
    return (React.createElement("div", { style: { position: 'fixed', bottom: '24px', right: '24px', zIndex: 100, fontFamily: 'Sora, sans-serif' } },
        React.createElement("style", null, `
        @keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-6px)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
      `),
        isOpen && (React.createElement("div", { style: { position: 'absolute', bottom: '72px', right: 0, width: '360px', maxWidth: 'calc(100vw - 32px)', background: '#fff', borderRadius: '20px', boxShadow: '0 24px 64px rgba(0,0,0,0.18)', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', overflow: 'hidden', animation: 'fadeUp 0.25s ease' } },
            React.createElement("div", { style: { background: 'linear-gradient(135deg, #2A4899 0%, #1e3576 100%)', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '10px' } },
                React.createElement(AgentAvatar, { size: 34 }),
                React.createElement("div", { style: { flex: 1 } },
                    React.createElement("div", { style: { color: '#fff', fontWeight: 800, fontSize: '13px' } }, "Asesor T\u00E9cnico INCAP"),
                    React.createElement("div", { style: { color: 'rgba(255,255,255,0.5)', fontSize: '10px', fontWeight: 600 } }, "IA \u00B7 Respuesta inmediata")),
                messages.length > 0 && (React.createElement("button", { onClick: handleReset, title: "Nueva consulta", style: { background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '6px', padding: '4px 8px', cursor: 'pointer', color: 'rgba(255,255,255,0.6)', fontSize: '10px', fontWeight: 700 } }, "Nueva"))),
            React.createElement("div", { style: { flex: 1, overflowY: 'auto', padding: '16px', maxHeight: '340px', minHeight: '160px' } },
                React.createElement(AssistantBubble, { content: "\u00A1Hola! Soy el asesor t\u00E9cnico de INCAP. Cu\u00E9ntame tu reto de adhesi\u00F3n \u2014 materiales, condiciones, proceso \u2014 y te recomiendo el producto exacto del portafolio." }),
                !chipsUsed && (React.createElement("div", { style: { display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px', marginLeft: '36px' } }, CHIPS.map(chip => (React.createElement("button", { key: chip.label, onClick: () => handleChip(chip), style: { padding: '6px 10px', borderRadius: '20px', border: '1.5px solid #e2e8f0', background: '#fff', fontSize: '11px', fontWeight: 700, color: '#374151', cursor: 'pointer', transition: 'all 0.15s' }, onMouseEnter: e => { e.currentTarget.style.borderColor = '#2A4899'; e.currentTarget.style.color = '#2A4899'; e.currentTarget.style.background = '#f0f5ff'; }, onMouseLeave: e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#374151'; e.currentTarget.style.background = '#fff'; } }, chip.label))))),
                messages.map((msg, i) => msg.role === 'user'
                    ? React.createElement(UserBubble, { key: i, content: msg.content })
                    : React.createElement(AssistantBubble, { key: i, content: msg.content, products: msg.products })),
                loading && React.createElement(TypingIndicator, null),
                React.createElement("div", { ref: messagesEndRef })),
            React.createElement("div", { style: { borderTop: '1px solid #f1f5f9', padding: '12px', display: 'flex', gap: '8px', alignItems: 'center' } },
                React.createElement("input", { ref: inputRef, value: input, onChange: e => setInput(e.target.value), onKeyDown: e => e.key === 'Enter' && !e.shiftKey && sendMessage(input), placeholder: "Describe tu reto t\u00E9cnico...", disabled: loading, style: { flex: 1, border: '1.5px solid #e2e8f0', borderRadius: '10px', padding: '8px 12px', fontSize: '12px', fontFamily: 'Sora, sans-serif', outline: 'none', background: loading ? '#f8fafc' : '#fff', color: '#374151' }, onFocus: e => { e.target.style.borderColor = '#2A4899'; }, onBlur: e => { e.target.style.borderColor = '#e2e8f0'; } }),
                React.createElement("button", { onClick: () => sendMessage(input), disabled: loading || !input.trim(), style: { width: '36px', height: '36px', borderRadius: '10px', border: 'none', background: loading || !input.trim() ? '#e2e8f0' : '#2A4899', color: '#fff', cursor: loading || !input.trim() ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background 0.15s' } },
                    React.createElement("svg", { width: "16", height: "16", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
                        React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2.5, d: "M12 19l9 2-9-18-9 18 9-2zm0 0v-8" })))))),
        React.createElement("button", { onClick: () => setIsOpen(!isOpen), style: { width: '56px', height: '56px', borderRadius: '50%', border: 'none', background: isOpen ? '#181B1C' : 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(42,72,153,0.4)', transition: 'all 0.3s', position: 'relative', padding: 0, overflow: 'hidden' } },
            !isOpen && (React.createElement("div", { style: { position: 'absolute', inset: 0, borderRadius: '50%', background: '#85C639', animation: 'ping 2s cubic-bezier(0,0,0.2,1) infinite', opacity: 0.25 } })),
            isOpen ? (React.createElement("svg", { width: "20", height: "20", fill: "none", stroke: "#fff", viewBox: "0 0 24 24" },
                React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2.5, d: "M6 18L18 6M6 6l12 12" }))) : (React.createElement("img", { src: AGENT_IMG, alt: "Asesor T\u00E9cnico INCAP", style: { width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' } })))));
}
export const layout = {
    areaId: 'content',
    sortOrder: 1000
};
