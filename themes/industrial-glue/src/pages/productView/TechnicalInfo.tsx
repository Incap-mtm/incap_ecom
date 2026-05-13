import React from 'react';

interface Attribute { attributeCode: string; optionText: string; }
interface ProductProps {
  product?: {
    attributes?: Attribute[];
  };
}

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

const GHSBadge = ({ code }: { code: string }) => {
  const p = GHS_META[code] || { name: code, icon: '?' };
  return (
    <div className="flex items-center gap-3 px-4 py-3 border border-white/10 rounded-2xl bg-white/5">
      <span className="text-2xl leading-none">{p.icon}</span>
      <div>
        <p className="text-[9px] font-black uppercase tracking-wider text-white/40">{code}</p>
        <p className="text-sm font-bold text-white leading-tight">{p.name}</p>
      </div>
    </div>
  );
};

export default function TechnicalInfo({ product }: ProductProps) {
  const get = (code: string) =>
    product?.attributes?.find(a => a.attributeCode === code)?.optionText;

  const steps    = (get('modo_empleo') || '').split('|').map(s => s.trim()).filter(Boolean);
  const ghsCodes = (get('ghs_pictogramas') || '').split('|').map(s => s.trim()).filter(Boolean);
  const precH    = get('precauciones_h') || '';
  const consP    = get('consejos_prudencia_p') || '';
  const hasSafety = ghsCodes.length > 0 || precH || consP;

  return (
    <>
      {/* ── Modo de Empleo — fondo gris claro ── */}
      {steps.length > 0 && (
        <section className="bg-[#f8f9fa] py-20">
          <div className="max-w-[1536px] mx-auto px-6 sm:px-8 lg:px-12">
            <h2 className="text-4xl md:text-5xl font-black text-[#181B1C] uppercase tracking-tight font-sora mb-2">
              Modo de Empleo
            </h2>
            <div className="w-24 h-2 bg-[#85C639] mb-12"></div>

            <ol className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {steps.map((step, i) => {
                const colonIdx = step.indexOf(':');
                const label    = colonIdx > -1 ? step.slice(0, colonIdx).trim() : `Paso ${i + 1}`;
                const detail   = colonIdx > -1 ? step.slice(colonIdx + 1).trim() : step;
                return (
                  <li key={i} className="flex gap-5 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                    <span className="flex-shrink-0 w-10 h-10 rounded-full bg-[#181B1C] flex items-center justify-center text-sm font-black text-white font-sora">
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-black text-[#181B1C] text-sm uppercase tracking-wide font-sora mb-1">{label}</p>
                      <p className="text-slate-500 text-sm leading-relaxed font-inter">{detail}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>
      )}

      {/* ── Seguridad y Manejo — fondo oscuro ── */}
      {hasSafety && (
        <section className="bg-[#181B1C] py-20 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#2A4899]/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

          <div className="max-w-[1536px] mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
            <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight font-sora mb-2">
              Seguridad y Manejo
            </h2>
            <div className="w-24 h-2 bg-[#85C639] mb-12"></div>

            {/* GHS Badges */}
            {ghsCodes.length > 0 && (
              <div className="mb-10">
                <p className="text-[9px] font-black text-[#85C639] uppercase tracking-[0.3em] font-sora mb-4">
                  Pictogramas GHS
                </p>
                <div className="flex flex-wrap gap-3">
                  {ghsCodes.map(c => <GHSBadge key={c} code={c} />)}
                </div>
              </div>
            )}

            {/* H & P */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {precH && (
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                  <p className="text-[9px] font-black text-[#85C639] uppercase tracking-[0.3em] font-sora mb-3">
                    Precauciones H
                  </p>
                  <p className="text-sm text-white/70 leading-relaxed font-inter">{precH}</p>
                </div>
              )}
              {consP && (
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                  <p className="text-[9px] font-black text-[#85C639] uppercase tracking-[0.3em] font-sora mb-3">
                    Consejos de Prudencia P
                  </p>
                  <p className="text-sm text-white/70 leading-relaxed font-inter">{consP}</p>
                </div>
              )}
            </div>

            <p className="mt-8 text-xs text-white/25 font-inter">
              Consulte la hoja de seguridad completa (SDS) antes de manipular este producto. Use siempre el equipo de protección personal (EPP) adecuado.
            </p>
          </div>
        </section>
      )}
    </>
  );
}

export const layout = {
  areaId: 'productPageBottom',
  sortOrder: 15
};

export const query = `
query Query {
    product: currentProduct {
      attributes: attributeIndex {
        attributeCode
        optionText
      }
    }
}
`;
