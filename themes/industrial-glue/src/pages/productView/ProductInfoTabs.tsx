import React, { useState } from 'react';

/**
 * Sección informativa de atributos del producto, presentada como pestañas.
 *
 * IMPORTANTE (SEO / AEO / chatbot): TODOS los paneles se renderizan en el HTML
 * del servidor y solo se alternan con el atributo `hidden` (CSS). El contenido
 * de cada pestaña queda en el DOM aunque no esté visible → indexable y legible
 * por crawlers y por el chatbot. Nunca renderizar paneles de forma condicional.
 */

interface Attribute { attributeCode: string; attributeName?: string; optionText: string; }
interface ProductProps {
  product?: {
    name?: string;
    sku?: string;
    attributes?: Attribute[];
  };
}

type Status = 'idle' | 'open' | 'submitting' | 'success' | 'error';

// ── helpers de parseo ──────────────────────────────────────────────
const splitDash = (txt: string) =>
  (txt || '').split(/\s+-\s+/).map(s => s.trim()).filter(Boolean);

const splitSteps = (txt: string) => {
  // Separar pasos solo antes de un "N." para no romper detalles que tengan " - ".
  const parts = (txt || '').split(/\s+-\s+(?=\d+\.)/).map(s => s.trim()).filter(Boolean);
  return parts.length ? parts : splitDash(txt);
};

const GHS_META: Record<string, { name: string; icon: string }> = {
  GHS01: { name: 'Explosivo',      icon: '💥' },
  GHS02: { name: 'Inflamable',     icon: '🔥' },
  GHS03: { name: 'Comburente',     icon: '🔆' },
  GHS04: { name: 'Gas comprimido', icon: '🔵' },
  GHS05: { name: 'Corrosivo',      icon: '⚗️'  },
  GHS06: { name: 'Tóxico',         icon: '☠️'  },
  GHS07: { name: 'Irritante',      icon: '⚠️'  },
  GHS08: { name: 'Riesgo salud',   icon: '👤'  },
  GHS09: { name: 'Medioambiente',  icon: '🌿'  },
};

// Acepta "SGA 02", "GHS02", "GHS 2", "SGA02" → "GHS02"
const normalizeGhs = (txt: string) =>
  (txt || '')
    .split(/\s+-\s+|\|/)
    .map(s => s.trim())
    .filter(Boolean)
    .map(tok => {
      const m = tok.match(/(\d{1,2})/);
      if (!m) return '';
      return 'GHS' + m[1].padStart(2, '0');
    })
    .filter(Boolean);

// Limpia separadores colgantes (" - ", "–") y espacios al inicio/fin de una respuesta.
const cleanAnswer = (s: string) =>
  (s || '').replace(/^[\s\-–]+/, '').replace(/[\s\-–]+$/, '').trim();

// FAQ: soporta JSON [{question,answer}] o texto plano.
// El texto plano puede venir como "¿P? R - ¿P2? R2" (separado por " - ") o
// "¿P? R. ¿P2? R2" (pares pegados sin separador). Para ser robusto a ambos,
// anclamos en los signos de apertura "¿": cada pregunta arranca en "¿" y su
// respuesta corre hasta el próximo "¿". Así no se pierde ninguna pregunta aunque
// falte el " - " entre pares (ver productos como el 199 en el catálogo).
const parseFaqs = (txt: string): Array<{ question: string; answer: string }> => {
  if (!txt) return [];
  try {
    const parsed = JSON.parse(txt);
    if (Array.isArray(parsed)) return parsed.filter((f: any) => f?.question);
  } catch { /* texto plano */ }

  const s = txt.trim();

  // Formato preferido: anclar en "¿" (preguntas en español).
  if (s.includes('¿')) {
    const faqs: Array<{ question: string; answer: string }> = [];
    const blocks = s.split(/(?=¿)/).map(b => b.trim()).filter(Boolean);
    for (const block of blocks) {
      const qi = block.indexOf('?');
      if (qi === -1) {
        // Bloque sin cierre de pregunta → es continuación de la respuesta anterior.
        if (faqs.length) faqs[faqs.length - 1].answer = cleanAnswer(faqs[faqs.length - 1].answer + ' ' + block);
        continue;
      }
      faqs.push({ question: block.slice(0, qi + 1).trim(), answer: cleanAnswer(block.slice(qi + 1)) });
    }
    if (faqs.length) return faqs;
  }

  // Fallback (sin "¿"): segmentos separados por " - " con un "?" interno.
  return splitDash(s)
    .map(seg => {
      const qi = seg.indexOf('?');
      if (qi === -1) return null;
      return { question: seg.slice(0, qi + 1).trim(), answer: cleanAnswer(seg.slice(qi + 1)) };
    })
    .filter(Boolean) as Array<{ question: string; answer: string }>;
};

const isValidFichaUrl = (raw: string) =>
  /^https?:\/\/\S+$/i.test(raw) || (raw.startsWith('/') && !/\s/.test(raw));

// ── sub-componentes de presentación ───────────────────────────────
const CheckList = ({ items }: { items: string[] }) => (
  <ul className="space-y-3">
    {items.map((item, i) => (
      <li key={i} className="flex items-start gap-3">
        <svg className="flex-shrink-0 mt-0.5 w-5 h-5 text-[#85C639]" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
        <span className="text-sm text-white font-inter leading-snug">{item}</span>
      </li>
    ))}
  </ul>
);

const PlainList = ({ items, accent = '#85C639' }: { items: string[]; accent?: string }) => (
  <ul className="space-y-2.5">
    {items.map((item, i) => (
      <li key={i} className="flex items-start gap-3 text-sm text-white/80 font-inter leading-relaxed">
        <span className="flex-shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full" style={{ background: accent }} />
        {item}
      </li>
    ))}
  </ul>
);

export default function ProductInfoTabs({ product }: ProductProps) {
  const get = (code: string) =>
    product?.attributes?.find(a => a.attributeCode === code)?.optionText?.trim() || '';

  // ── Ficha técnica (descarga con captura de lead) ──
  const fichaRaw   = get('ficha_tecnica_url') || get('ficha_tecnica');
  const fichaUrl   = isValidFichaUrl(fichaRaw) ? fichaRaw : '';
  const [status, setStatus] = useState<Status>('idle');
  const [form, setForm]     = useState({ nombre: '', email: '', telefono: '' });
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg('');
    try {
      const res = await fetch('/api/ficha-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, productName: product?.name || '', sku: product?.sku || '', fichaUrl }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg = typeof data?.error === 'string' ? data.error : (data?.error?.message || 'Error al enviar. Intenta de nuevo.');
        setErrorMsg(msg);
        setStatus('error');
        return;
      }
      setStatus('success');
      const a = document.createElement('a');
      a.href = fichaUrl; a.target = '_blank'; a.rel = 'noopener noreferrer'; a.click();
    } catch {
      setErrorMsg('Error de conexión. Intenta de nuevo.');
      setStatus('error');
    }
  };
  const closeModal = () => { setStatus('idle'); setErrorMsg(''); };

  // ── construcción de las pestañas en el orden pedido ──
  const usos       = get('usos');
  const caract     = get('caracteristicas');
  const modo       = get('modo_empleo');
  const codigo     = get('codigo_industrial');
  const ghs        = normalizeGhs(get('ghs_pictogramas'));
  const precH      = get('precauciones_h');
  const consP      = get('consejos_prudencia_p');
  const preTrat    = get('pre_tratamiento');
  const faqs       = parseFaqs(get('preguntas_frecuentes'));

  const [faqOpen, setFaqOpen] = useState<number | null>(0);

  const tabs: Array<{ key: string; label: string; content: React.ReactNode }> = [];

  if (usos)   tabs.push({ key: 'usos',   label: 'Usos',           content: <CheckList items={splitDash(usos)} /> });
  if (caract) tabs.push({ key: 'caract', label: 'Características', content: <CheckList items={splitDash(caract)} /> });
  if (modo)   tabs.push({
    key: 'modo', label: 'Modo de Empleo',
    content: (
      <ol className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {splitSteps(modo).map((step, i) => {
          const ci = step.replace(/^\d+\.\s*/, '').indexOf(':');
          const body  = step.replace(/^\d+\.\s*/, '');
          const label = ci > -1 ? body.slice(0, ci).trim() : `Paso ${i + 1}`;
          const detail = ci > -1 ? body.slice(ci + 1).trim() : body;
          return (
            <li key={i} className="flex gap-4 bg-white/5 rounded-2xl p-5 border border-white/10">
              <span className="flex-shrink-0 w-9 h-9 rounded-full bg-[#85C639] flex items-center justify-center text-sm font-black text-[#181B1C] font-sora">{i + 1}</span>
              <div>
                <p className="font-black text-white text-sm uppercase tracking-wide font-sora mb-1">{label}</p>
                <p className="text-white/70 text-sm leading-relaxed font-inter">{detail}</p>
              </div>
            </li>
          );
        })}
      </ol>
    ),
  });
  if (codigo) tabs.push({
    key: 'codigo', label: 'Código Industrial',
    content: <p className="text-sm text-white font-inter">Referencia industrial: <strong className="font-bold">{codigo}</strong></p>,
  });
  if (ghs.length) tabs.push({
    key: 'ghs', label: 'Pictogramas GHS',
    content: (
      <div className="flex flex-wrap gap-3">
        {ghs.map(code => {
          const p = GHS_META[code] || { name: code, icon: '⚠️' };
          return (
            <div key={code} className="flex items-center gap-3 px-4 py-3 border border-white/15 rounded-2xl bg-white/5">
              <span className="text-2xl leading-none">{p.icon}</span>
              <div>
                <p className="text-[9px] font-black uppercase tracking-wider text-white/40">{code}</p>
                <p className="text-sm font-bold text-white leading-tight">{p.name}</p>
              </div>
            </div>
          );
        })}
      </div>
    ),
  });
  if (precH) tabs.push({ key: 'precH', label: 'Precauciones H', content: <PlainList items={splitDash(precH)} accent="#fca5a5" /> });
  if (consP) tabs.push({ key: 'consP', label: 'Consejos P',     content: <PlainList items={splitDash(consP)} accent="#85C639" /> });
  if (preTrat) tabs.push({
    key: 'preTrat', label: 'Pre-tratamiento',
    content: <p className="text-sm text-white/80 font-inter leading-relaxed">{preTrat}</p>,
  });
  if (fichaUrl) tabs.push({
    key: 'ficha', label: 'Ficha Técnica',
    content: (
      <div>
        <p className="text-sm text-white/80 font-inter mb-4 leading-relaxed">
          Descargá la ficha técnica en PDF con especificaciones, modo de aplicación y seguridad.
        </p>
        <button
          onClick={() => setStatus('open')}
          className="inline-flex items-center gap-3 px-6 py-3 bg-[#85C639] hover:bg-[#76b330] text-[#181B1C] font-semibold rounded-lg transition-all duration-300"
          style={{ fontFamily: 'Sora, sans-serif' }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Descargar Ficha Técnica
          <span className="text-xs opacity-70">(PDF)</span>
        </button>
      </div>
    ),
  });
  if (faqs.length) tabs.push({
    key: 'faq', label: 'Aplicación y FAQ',
    content: (
      <div className="divide-y divide-white/10">
        {faqs.map((faq, i) => {
          const open = faqOpen === i;
          return (
            <div key={i}>
              <button
                onClick={() => setFaqOpen(open ? null : i)}
                className="w-full flex items-center justify-between py-4 text-left gap-4 group"
                aria-expanded={open}
              >
                <span className="text-sm font-bold text-white group-hover:text-[#85C639] transition-colors font-sora">{faq.question}</span>
                <span className={`flex-shrink-0 w-6 h-6 rounded-full border flex items-center justify-center transition-all ${open ? 'bg-[#85C639] border-[#85C639]' : 'border-white/30'}`}>
                  <svg className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180 text-[#181B1C]' : 'text-white/50'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </button>
              <div className="pb-4 pr-8 text-white/60 text-sm leading-relaxed font-inter" hidden={!open}>{faq.answer}</div>
            </div>
          );
        })}
      </div>
    ),
  });

  const [active, setActive] = useState(0);
  if (tabs.length === 0) return null;
  const activeKey = tabs[Math.min(active, tabs.length - 1)]?.key;

  // FAQ schema (SEO/AEO) — siempre en el DOM
  const faqSchema = faqs.length ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.question, acceptedAnswer: { '@type': 'Answer', text: f.answer } })),
  } : null;

  return (
    <section className="bg-[#2A4899] py-16 relative overflow-hidden">
      {faqSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      )}
      {/* Decoración de fondo */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#85C639]/10 blur-[140px] rounded-full -translate-y-1/3 translate-x-1/3 pointer-events-none" />
      <div className="max-w-[1536px] mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight font-sora mb-2">
          Información del Producto
        </h2>
        <div className="w-24 h-2 bg-[#85C639] mb-8" />

        {/* Barra de pestañas */}
        <div className="flex flex-wrap gap-2 border-b border-white/20 mb-8" role="tablist">
          {tabs.map((t, i) => {
            const isActive = t.key === activeKey;
            return (
              <button
                key={t.key}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActive(i)}
                className={`px-4 py-2.5 -mb-px text-sm font-semibold font-sora border-b-2 transition-colors ${
                  isActive
                    ? 'border-[#85C639] text-white'
                    : 'border-transparent text-white/60 hover:text-white'
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Paneles — TODOS en el DOM, ocultos con `hidden` (SEO/AEO) */}
        {tabs.map((t) => (
          <div key={t.key} role="tabpanel" aria-label={t.label} hidden={t.key !== activeKey} className="min-h-[80px]">
            {t.content}
          </div>
        ))}
      </div>

      {/* Modal de descarga de ficha (captura de lead) */}
      {(status === 'open' || status === 'submitting' || status === 'success' || status === 'error') && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
          onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
        >
          <div style={{ background: '#fff', borderRadius: '20px', padding: '2rem', width: '100%', maxWidth: '420px', boxShadow: '0 24px 64px rgba(0,0,0,0.2)', fontFamily: 'Sora, sans-serif' }}>
            {status === 'success' ? (
              <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                  <svg width="28" height="28" fill="none" stroke="#16a34a" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#181B1C', marginBottom: '8px' }}>¡Descarga iniciada!</h3>
                <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                  Tu ficha técnica se está descargando. Si no inicia automáticamente,{' '}
                  <a href={fichaUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#2A4899', fontWeight: 700 }}>haz clic aquí</a>.
                </p>
                <button onClick={closeModal} style={{ padding: '10px 24px', background: '#2A4899', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', fontSize: '13px' }}>Cerrar</button>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                  <div>
                    <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#181B1C', margin: 0 }}>Descargar Ficha Técnica</h3>
                    <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px', fontFamily: 'Inter, sans-serif', fontWeight: 400 }}>Completa tus datos para continuar</p>
                  </div>
                  <button onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '4px' }}>
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {(['nombre', 'email', 'telefono'] as const).map((field) => (
                    <div key={field}>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
                        {field === 'nombre' ? 'Nombre completo' : field === 'email' ? 'Correo electrónico' : 'Teléfono'}
                      </label>
                      <input
                        type={field === 'email' ? 'email' : field === 'telefono' ? 'tel' : 'text'}
                        required
                        value={form[field]}
                        onChange={(e) => setForm(f => ({ ...f, [field]: e.target.value }))}
                        disabled={status === 'submitting'}
                        placeholder={field === 'nombre' ? 'Tu nombre' : field === 'email' ? 'correo@empresa.com' : '+57 300 000 0000'}
                        style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '13px', fontFamily: 'Inter, sans-serif', outline: 'none', boxSizing: 'border-box', background: status === 'submitting' ? '#f8fafc' : '#fff', color: '#181B1C' }}
                      />
                    </div>
                  ))}
                  {errorMsg && (
                    <p style={{ fontSize: '12px', color: '#dc2626', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '8px 12px', margin: 0 }}>{errorMsg}</p>
                  )}
                  <button type="submit" disabled={status === 'submitting'} style={{ padding: '12px', background: status === 'submitting' ? '#94a3b8' : '#2A4899', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 800, cursor: status === 'submitting' ? 'default' : 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '4px' }}>
                    {status === 'submitting' ? 'Enviando…' : 'Descargar PDF'}
                  </button>
                  <p style={{ fontSize: '10px', color: '#94a3b8', textAlign: 'center', margin: 0, fontFamily: 'Inter, sans-serif' }}>Tus datos son confidenciales y no se comparten con terceros.</p>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

export const layout = {
  areaId: 'productPageBottom',
  sortOrder: 10,
};

export const query = `
query Query {
    product: currentProduct {
      name
      sku
      attributes: attributeIndex {
        attributeCode
        attributeName
        optionText
      }
    }
}
`;
