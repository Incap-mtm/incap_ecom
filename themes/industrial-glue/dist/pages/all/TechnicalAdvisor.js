import React, { useState, useRef, useEffect } from 'react';
const AGENT_IMG = '/images/icons/imagen-chatflotante.png';
const CHIPS = [
    { label: '🔧 Tengo fallas de pegue', prompt: 'Tengo problemas de adhesión, el pegue está fallando. ¿Qué puede estar causando esto y qué producto me recomiendas?' },
    { label: '🧱 Necesito pegar materiales', prompt: 'Necesito pegar dos materiales específicos.' },
    { label: '🏭 ¿Qué producto para mi industria?', prompt: 'Trabajo en la industria de adhesivos y necesito orientación sobre qué producto usar.' },
    { label: '💬 Consulta libre', prompt: '' },
];
/**
 * Empuja un evento al dataLayer para GTM/GA4. Seguro en SSR (guarda window) y
 * en cualquier entorno: el dataLayer se puebla siempre; GTM solo se carga en
 * producción, así que staging/localhost no envían a GA4 pero sí permiten
 * verificar los eventos. Nunca se envía texto libre del usuario (posible PII).
 */
function trackChat(event, params) {
    if (typeof window === 'undefined')
        return;
    const w = window;
    w.dataLayer = w.dataLayer || [];
    w.dataLayer.push({ event, ...(params || {}) });
}
function AgentAvatar({ size }) {
    return (React.createElement("div", { style: { width: size, height: size, borderRadius: '50%', flexShrink: 0, overflow: 'hidden' } },
        React.createElement("img", { src: AGENT_IMG, alt: "Asesor INCAP", style: { width: '100%', height: '100%', objectFit: 'cover' } })));
}
function UserBubble({ content }) {
    return (React.createElement("div", { style: { display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' } },
        React.createElement("div", { style: { background: '#2A4899', color: '#fff', borderRadius: '16px 16px 4px 16px', padding: '10px 14px', maxWidth: '80%', fontSize: '13px', lineHeight: 1.5 } }, content)));
}
// Renderiza **negrita** inline como <strong> (seguro: nodos React, no innerHTML).
function renderInline(text, keyPrefix) {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts
        .filter(p => p !== '')
        .map((part, i) => /^\*\*[^*]+\*\*$/.test(part)
        ? React.createElement("strong", { key: `${keyPrefix}-${i}`, style: { fontWeight: 700, color: '#181B1C' } }, part.slice(2, -2))
        : React.createElement(React.Fragment, { key: `${keyPrefix}-${i}` }, part));
}
/**
 * Renderiza el Markdown ligero que produce el asesor como elementos React:
 * subtítulos (##/###), párrafos cortos, listas (- y 1.) y **negrita**.
 * No usa dangerouslySetInnerHTML → XSS-safe por construcción.
 */
function RichText({ content }) {
    const lines = content.split('\n');
    const blocks = [];
    let i = 0;
    let k = 0;
    // Marcadores tolerantes: la negrita del modelo puede envolver el marcador
    // (ej. "**1. Paso**" o "**- item**"), así que aceptamos un "**" opcional.
    const isHeading = (l) => /^#{1,3}\s+/.test(l.trim());
    const isOl = (l) => /^(?:\*\*)?\d+\.\s+/.test(l.trim());
    const isUl = (l) => /^(?:\*\*)?[-*]\s+/.test(l.trim());
    /** Índice de la próxima línea no vacía (o lines.length). */
    const nextNonBlank = (from) => {
        let j = from;
        while (j < lines.length && lines[j].trim() === '')
            j++;
        return j;
    };
    /**
     * Recolecta ítems de lista consecutivos, tolerando líneas en blanco entre
     * ítems (el modelo suele separarlos con \n\n). Quita el marcador ("N." o
     * "-"), incluso si el modelo lo envolvió en negrita ("**1. ...**"), sin
     * romper la negrita interna del caso limpio ("1. **label** — texto").
     */
    const collectList = (isKind, markerRe) => {
        const items = [];
        while (i < lines.length) {
            if (lines[i].trim() === '') {
                const j = nextNonBlank(i + 1);
                if (j < lines.length && isKind(lines[j])) {
                    i = j;
                    continue;
                }
                break;
            }
            if (!isKind(lines[i]))
                break;
            const raw = lines[i].trim();
            const boldMarker = raw.startsWith('**'); // el "**" envuelve al marcador
            let text = raw.replace(markerRe, ''); // quita ("**")? + "N." / "-"
            if (boldMarker)
                text = text.replace(/\*\*/, ''); // quita el "**" de cierre del marcador
            items.push(React.createElement("li", { key: k++, style: { marginBottom: '4px' } }, renderInline(text.trim(), `li${k}`)));
            i++;
        }
        return items;
    };
    while (i < lines.length) {
        const trimmed = lines[i].trim();
        if (trimmed === '') {
            i++;
            continue;
        }
        // Subtítulo (# / ## / ###) — todos compactos para el chat angosto
        const hm = trimmed.match(/^#{1,3}\s+(.+)/);
        if (hm) {
            blocks.push(React.createElement("div", { key: k++, style: { fontWeight: 800, fontSize: '13px', color: '#181B1C', margin: '12px 0 5px' } }, renderInline(hm[1], `h${k}`)));
            i++;
            continue;
        }
        // Lista numerada (mantiene la numeración del modelo vía <ol>)
        if (isOl(trimmed)) {
            const items = collectList(isOl, /^(?:\*\*)?\d+\.\s+/);
            blocks.push(React.createElement("ol", { key: k++, style: { margin: '4px 0 8px', paddingLeft: '20px' } }, items));
            continue;
        }
        // Lista con viñetas
        if (isUl(trimmed)) {
            const items = collectList(isUl, /^(?:\*\*)?[-*]\s+/);
            blocks.push(React.createElement("ul", { key: k++, style: { margin: '4px 0 8px', paddingLeft: '20px' } }, items));
            continue;
        }
        // Párrafo — junta líneas hasta blanco o inicio de bloque
        const paraLines = [];
        while (i < lines.length &&
            lines[i].trim() !== '' &&
            !isHeading(lines[i]) &&
            !isOl(lines[i]) &&
            !isUl(lines[i])) {
            paraLines.push(lines[i].trim());
            i++;
        }
        blocks.push(React.createElement("p", { key: k++, style: { margin: '0 0 8px' } }, renderInline(paraLines.join(' '), `p${k}`)));
    }
    return React.createElement(React.Fragment, null, blocks);
}
function AssistantBubble({ content, products, articles, whatsapp }) {
    return (React.createElement("div", { style: { marginBottom: '12px' } },
        React.createElement("div", { style: { display: 'flex', gap: '8px', alignItems: 'flex-start' } },
            React.createElement(AgentAvatar, { size: 28 }),
            React.createElement("div", { className: "incap-advisor-md", style: { background: '#f8fafc', borderRadius: '4px 16px 16px 16px', padding: '10px 14px', maxWidth: '85%', fontSize: '13px', lineHeight: 1.6, color: '#374151', border: '1px solid #e2e8f0' } },
                React.createElement(RichText, { content: content }))),
        products && products.length > 0 && (React.createElement("div", { style: { marginLeft: '36px', marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '6px' } }, products.map(p => (React.createElement("a", { key: p.sku, href: p.url, onClick: () => trackChat('chatbot_product_click', { chat_sku: p.sku, chat_product_name: p.name }), style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', textDecoration: 'none', transition: 'all 0.15s' }, onMouseEnter: e => { e.currentTarget.style.borderColor = '#2A4899'; e.currentTarget.style.background = '#f0f5ff'; }, onMouseLeave: e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '#fff'; } },
            React.createElement("div", null,
                React.createElement("div", { style: { fontSize: '12px', fontWeight: 700, color: '#181B1C' } }, p.name)),
            React.createElement("svg", { width: "14", height: "14", fill: "none", stroke: "#2A4899", viewBox: "0 0 24 24" },
                React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2.5, d: "M9 5l7 7-7 7" }))))))),
        articles && articles.length > 0 && (React.createElement("div", { style: { marginLeft: '36px', marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '6px' } }, articles.map(a => (React.createElement("a", { key: a.url, href: a.url, onClick: () => trackChat('chatbot_article_click', { chat_article_title: a.title }), style: { display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', textDecoration: 'none', transition: 'all 0.15s' }, onMouseEnter: e => { e.currentTarget.style.borderColor = '#85C639'; e.currentTarget.style.background = '#f4fbec'; }, onMouseLeave: e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '#fff'; } },
            React.createElement("svg", { width: "15", height: "15", fill: "none", stroke: "#85C639", viewBox: "0 0 24 24", style: { flexShrink: 0 } },
                React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" })),
            React.createElement("div", { style: { flex: 1 } },
                React.createElement("div", { style: { fontSize: '9px', fontWeight: 800, color: '#85C639', textTransform: 'uppercase', letterSpacing: '0.08em' } }, "Art\u00EDculo del blog"),
                React.createElement("div", { style: { fontSize: '12px', fontWeight: 700, color: '#181B1C', lineHeight: 1.3 } }, a.title)),
            React.createElement("svg", { width: "14", height: "14", fill: "none", stroke: "#85C639", viewBox: "0 0 24 24", style: { flexShrink: 0 } },
                React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2.5, d: "M9 5l7 7-7 7" }))))))),
        whatsapp && (React.createElement("div", { style: { marginLeft: '36px', marginTop: '8px' } },
            React.createElement("a", { href: whatsapp, target: "_blank", rel: "noopener noreferrer", onClick: () => trackChat('chatbot_whatsapp_click'), style: { display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: '#25D366', color: '#fff', borderRadius: '12px', textDecoration: 'none', fontSize: '12px', fontWeight: 800, boxShadow: '0 4px 12px rgba(37,211,102,0.3)', transition: 'transform 0.15s' }, onMouseEnter: e => { e.currentTarget.style.transform = 'translateY(-1px)'; }, onMouseLeave: e => { e.currentTarget.style.transform = 'translateY(0)'; } },
                React.createElement("svg", { width: "17", height: "17", fill: "currentColor", viewBox: "0 0 24 24", style: { flexShrink: 0 } },
                    React.createElement("path", { d: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" })),
                "Hablar con un asesor humano")))));
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
    const sendMessage = async (content, method = 'input', chipLabel) => {
        if (!content.trim() || loading)
            return;
        setChipsUsed(true);
        trackChat('chatbot_message_sent', chipLabel ? { chat_method: method, chat_chip: chipLabel } : { chat_method: method });
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
                    articles: data.articles || [],
                    whatsapp: data.whatsapp || null,
                }]);
            trackChat('chatbot_response', {
                chat_has_products: (data.products || []).length > 0,
                chat_has_articles: (data.articles || []).length > 0,
                chat_whatsapp_offered: Boolean(data.whatsapp),
            });
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
            sendMessage(chip.prompt, 'chip', chip.label);
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
        .incap-advisor-md > *:last-child { margin-bottom: 0 !important; }
        .incap-advisor-md > *:first-child { margin-top: 0 !important; }
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
                    : React.createElement(AssistantBubble, { key: i, content: msg.content, products: msg.products, articles: msg.articles, whatsapp: msg.whatsapp })),
                loading && React.createElement(TypingIndicator, null),
                React.createElement("div", { ref: messagesEndRef })),
            React.createElement("div", { style: { borderTop: '1px solid #f1f5f9', padding: '12px', display: 'flex', gap: '8px', alignItems: 'center' } },
                React.createElement("input", { ref: inputRef, value: input, onChange: e => setInput(e.target.value), onKeyDown: e => e.key === 'Enter' && !e.shiftKey && sendMessage(input), placeholder: "Describe tu reto t\u00E9cnico...", disabled: loading, style: { flex: 1, border: '1.5px solid #e2e8f0', borderRadius: '10px', padding: '8px 12px', fontSize: '12px', fontFamily: 'Sora, sans-serif', outline: 'none', background: loading ? '#f8fafc' : '#fff', color: '#374151' }, onFocus: e => { e.target.style.borderColor = '#2A4899'; }, onBlur: e => { e.target.style.borderColor = '#e2e8f0'; } }),
                React.createElement("button", { onClick: () => sendMessage(input), disabled: loading || !input.trim(), style: { width: '36px', height: '36px', borderRadius: '10px', border: 'none', background: loading || !input.trim() ? '#e2e8f0' : '#2A4899', color: '#fff', cursor: loading || !input.trim() ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background 0.15s' } },
                    React.createElement("svg", { width: "16", height: "16", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
                        React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2.5, d: "M12 19l9 2-9-18-9 18 9-2zm0 0v-8" })))))),
        React.createElement("div", { style: { position: 'relative', width: '56px', height: '56px' } },
            !isOpen && (React.createElement("div", { style: { position: 'absolute', inset: 0, borderRadius: '50%', background: '#85C639', animation: 'ping 2s cubic-bezier(0,0,0.2,1) infinite', opacity: 0.3 } })),
            React.createElement("button", { onClick: () => setIsOpen(prev => { const next = !prev; if (next)
                    trackChat('chatbot_open'); return next; }), style: { width: '56px', height: '56px', borderRadius: '50%', border: 'none', background: isOpen ? '#181B1C' : 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(42,72,153,0.4)', transition: 'all 0.3s', position: 'relative', zIndex: 1, padding: 0 } }, isOpen ? (React.createElement("svg", { width: "20", height: "20", fill: "none", stroke: "#fff", viewBox: "0 0 24 24" },
                React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2.5, d: "M6 18L18 6M6 6l12 12" }))) : (React.createElement("img", { src: AGENT_IMG, alt: "Asesor T\u00E9cnico INCAP", style: { width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' } }))))));
}
export const layout = {
    areaId: 'content',
    sortOrder: 1000
};
