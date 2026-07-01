import React, { useState, useRef, useEffect } from 'react';

const AGENT_IMG = '/images/icons/imagen-chatflotante.png';

const CHIPS = [
  { label: '🔧 Tengo fallas de pegue', prompt: 'Tengo problemas de adhesión, el pegue está fallando. ¿Qué puede estar causando esto y qué producto me recomiendas?' },
  { label: '🧱 Necesito pegar materiales', prompt: 'Necesito pegar dos materiales específicos.' },
  { label: '🏭 ¿Qué producto para mi industria?', prompt: 'Trabajo en la industria de adhesivos y necesito orientación sobre qué producto usar.' },
  { label: '💬 Consulta libre', prompt: '' },
];

interface Product {
  sku: string;
  name: string;
  url: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  products?: Product[];
}

function AgentAvatar({ size }: { size: number }) {
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', flexShrink: 0, overflow: 'hidden' }}>
      <img src={AGENT_IMG} alt="Asesor INCAP" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    </div>
  );
}

function UserBubble({ content }: { content: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
      <div style={{ background: '#2A4899', color: '#fff', borderRadius: '16px 16px 4px 16px', padding: '10px 14px', maxWidth: '80%', fontSize: '13px', lineHeight: 1.5 }}>
        {content}
      </div>
    </div>
  );
}

// Renderiza **negrita** inline como <strong> (seguro: nodos React, no innerHTML).
function renderInline(text: string, keyPrefix: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts
    .filter(p => p !== '')
    .map((part, i) =>
      /^\*\*[^*]+\*\*$/.test(part)
        ? <strong key={`${keyPrefix}-${i}`} style={{ fontWeight: 700, color: '#181B1C' }}>{part.slice(2, -2)}</strong>
        : <React.Fragment key={`${keyPrefix}-${i}`}>{part}</React.Fragment>
    );
}

/**
 * Renderiza el Markdown ligero que produce el asesor como elementos React:
 * subtítulos (##/###), párrafos cortos, listas (- y 1.) y **negrita**.
 * No usa dangerouslySetInnerHTML → XSS-safe por construcción.
 */
function RichText({ content }: { content: string }) {
  const lines = content.split('\n');
  const blocks: React.ReactNode[] = [];
  let i = 0;
  let k = 0;

  const isHeading = (l: string) => /^#{2,3}\s+/.test(l.trim());
  const isOl = (l: string) => /^\d+\.\s+/.test(l.trim());
  const isUl = (l: string) => /^[-*]\s+/.test(l.trim());

  while (i < lines.length) {
    const trimmed = lines[i].trim();

    if (trimmed === '') { i++; continue; }

    // Subtítulo (## / ###)
    const hm = trimmed.match(/^#{2,3}\s+(.+)/);
    if (hm) {
      blocks.push(
        <div key={k++} style={{ fontWeight: 800, fontSize: '13px', color: '#181B1C', margin: '12px 0 4px' }}>
          {renderInline(hm[1], `h${k}`)}
        </div>
      );
      i++;
      continue;
    }

    // Lista numerada
    if (isOl(trimmed)) {
      const items: React.ReactNode[] = [];
      while (i < lines.length && isOl(lines[i])) {
        const m = lines[i].trim().match(/^\d+\.\s+(.+)/)!;
        items.push(<li key={k++} style={{ marginBottom: '3px' }}>{renderInline(m[1], `ol${k}`)}</li>);
        i++;
      }
      blocks.push(<ol key={k++} style={{ margin: '4px 0 8px', paddingLeft: '20px' }}>{items}</ol>);
      continue;
    }

    // Lista con viñetas
    if (isUl(trimmed)) {
      const items: React.ReactNode[] = [];
      while (i < lines.length && isUl(lines[i])) {
        const m = lines[i].trim().match(/^[-*]\s+(.+)/)!;
        items.push(<li key={k++} style={{ marginBottom: '3px' }}>{renderInline(m[1], `ul${k}`)}</li>);
        i++;
      }
      blocks.push(<ul key={k++} style={{ margin: '4px 0 8px', paddingLeft: '20px' }}>{items}</ul>);
      continue;
    }

    // Párrafo — junta líneas hasta blanco o inicio de bloque
    const paraLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !isHeading(lines[i]) &&
      !isOl(lines[i]) &&
      !isUl(lines[i])
    ) {
      paraLines.push(lines[i].trim());
      i++;
    }
    blocks.push(
      <p key={k++} style={{ margin: '0 0 8px' }}>{renderInline(paraLines.join(' '), `p${k}`)}</p>
    );
  }

  return <>{blocks}</>;
}

function AssistantBubble({ content, products }: { content: string; products?: Product[] }) {
  return (
    <div style={{ marginBottom: '12px' }}>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
        <AgentAvatar size={28} />
        <div className="incap-advisor-md" style={{ background: '#f8fafc', borderRadius: '4px 16px 16px 16px', padding: '10px 14px', maxWidth: '85%', fontSize: '13px', lineHeight: 1.6, color: '#374151', border: '1px solid #e2e8f0' }}>
          <RichText content={content} />
        </div>
      </div>
      {products && products.length > 0 && (
        <div style={{ marginLeft: '36px', marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {products.map(p => (
            <a
              key={p.sku}
              href={p.url}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', textDecoration: 'none', transition: 'all 0.15s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#2A4899'; (e.currentTarget as HTMLElement).style.background = '#f0f5ff'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#e2e8f0'; (e.currentTarget as HTMLElement).style.background = '#fff'; }}
            >
              <div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#181B1C' }}>{p.name}</div>
              </div>
              <svg width="14" height="14" fill="none" stroke="#2A4899" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

function TypingIndicator() {
  return (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', marginBottom: '12px' }}>
      <AgentAvatar size={28} />
      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px 16px 16px 16px', padding: '12px 16px', display: 'flex', gap: '4px', alignItems: 'center' }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#2A4899', animation: 'bounce 1.2s infinite', animationDelay: `${i * 0.2}s`, opacity: 0.7 }} />
        ))}
      </div>
    </div>
  );
}

export default function TechnicalAdvisor() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [chipsUsed, setChipsUsed] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 300);
  }, [isOpen]);

  const sendMessage = async (content: string) => {
    if (!content.trim() || loading) return;
    setChipsUsed(true);
    const userMsg: Message = { role: 'user', content };
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
        } else {
          reply = data.error || 'No pude procesar tu consulta. Intenta de nuevo.';
        }
      }
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: reply,
        products: data.products || [],
      }]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Ocurrió un error de conexión. Por favor intenta de nuevo.',
        products: [],
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleChip = (chip: typeof CHIPS[0]) => {
    setChipsUsed(true);
    if (chip.prompt) sendMessage(chip.prompt);
  };

  const handleReset = () => {
    setMessages([]);
    setChipsUsed(false);
    setInput('');
  };

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 100, fontFamily: 'Sora, sans-serif' }}>
      <style>{`
        @keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-6px)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        .incap-advisor-md > *:last-child { margin-bottom: 0 !important; }
        .incap-advisor-md > *:first-child { margin-top: 0 !important; }
      `}</style>

      {/* Chat window */}
      {isOpen && (
        <div style={{ position: 'absolute', bottom: '72px', right: 0, width: '360px', maxWidth: 'calc(100vw - 32px)', background: '#fff', borderRadius: '20px', boxShadow: '0 24px 64px rgba(0,0,0,0.18)', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', overflow: 'hidden', animation: 'fadeUp 0.25s ease' }}>

          {/* Header */}
          <div style={{ background: 'linear-gradient(135deg, #2A4899 0%, #1e3576 100%)', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AgentAvatar size={34} />
            <div style={{ flex: 1 }}>
              <div style={{ color: '#fff', fontWeight: 800, fontSize: '13px' }}>Asesor Técnico INCAP</div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px', fontWeight: 600 }}>IA · Respuesta inmediata</div>
            </div>
            {messages.length > 0 && (
              <button onClick={handleReset} title="Nueva consulta" style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '6px', padding: '4px 8px', cursor: 'pointer', color: 'rgba(255,255,255,0.6)', fontSize: '10px', fontWeight: 700 }}>
                Nueva
              </button>
            )}
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px', maxHeight: '340px', minHeight: '160px' }}>
            <AssistantBubble content="¡Hola! Soy el asesor técnico de INCAP. Cuéntame tu reto de adhesión — materiales, condiciones, proceso — y te recomiendo el producto exacto del portafolio." />

            {!chipsUsed && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px', marginLeft: '36px' }}>
                {CHIPS.map(chip => (
                  <button
                    key={chip.label}
                    onClick={() => handleChip(chip)}
                    style={{ padding: '6px 10px', borderRadius: '20px', border: '1.5px solid #e2e8f0', background: '#fff', fontSize: '11px', fontWeight: 700, color: '#374151', cursor: 'pointer', transition: 'all 0.15s' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#2A4899'; (e.currentTarget as HTMLElement).style.color = '#2A4899'; (e.currentTarget as HTMLElement).style.background = '#f0f5ff'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#e2e8f0'; (e.currentTarget as HTMLElement).style.color = '#374151'; (e.currentTarget as HTMLElement).style.background = '#fff'; }}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            )}

            {messages.map((msg, i) =>
              msg.role === 'user'
                ? <UserBubble key={i} content={msg.content} />
                : <AssistantBubble key={i} content={msg.content} products={msg.products} />
            )}

            {loading && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={{ borderTop: '1px solid #f1f5f9', padding: '12px', display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage(input)}
              placeholder="Describe tu reto técnico..."
              disabled={loading}
              style={{ flex: 1, border: '1.5px solid #e2e8f0', borderRadius: '10px', padding: '8px 12px', fontSize: '12px', fontFamily: 'Sora, sans-serif', outline: 'none', background: loading ? '#f8fafc' : '#fff', color: '#374151' }}
              onFocus={e => { (e.target as HTMLElement).style.borderColor = '#2A4899'; }}
              onBlur={e => { (e.target as HTMLElement).style.borderColor = '#e2e8f0'; }}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={loading || !input.trim()}
              style={{ width: '36px', height: '36px', borderRadius: '10px', border: 'none', background: loading || !input.trim() ? '#e2e8f0' : '#2A4899', color: '#fff', cursor: loading || !input.trim() ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background 0.15s' }}
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Floating button */}
      <div style={{ position: 'relative', width: '56px', height: '56px' }}>
        {!isOpen && (
          <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#85C639', animation: 'ping 2s cubic-bezier(0,0,0.2,1) infinite', opacity: 0.3 }} />
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{ width: '56px', height: '56px', borderRadius: '50%', border: 'none', background: isOpen ? '#181B1C' : 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(42,72,153,0.4)', transition: 'all 0.3s', position: 'relative', zIndex: 1, padding: 0 }}
        >
          {isOpen ? (
            <svg width="20" height="20" fill="none" stroke="#fff" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <img src={AGENT_IMG} alt="Asesor Técnico INCAP" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
          )}
        </button>
      </div>
    </div>
  );
}

export const layout = {
  areaId: 'content',
  sortOrder: 1000
};
