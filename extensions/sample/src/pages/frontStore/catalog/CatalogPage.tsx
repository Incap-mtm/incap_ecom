import React, { useState, useEffect, useMemo } from 'react';
import { useQuery } from 'urql';
import { getFamily, getPresentation, pickRepresentative } from '../../../utils/family.js';

interface FamilyCard {
  family: string;
  count: number;
  repImage: string | null;
  products: any[];
  href: string;
}

interface CatSection {
  urlKey: string;
  meta: { name: string; color: string; href: string };
  families: FamilyCard[];
  total: number;
}

const CAT_META: Record<string, { name: string; color: string; href: string }> = {
  madera:    { name: 'Madera y Muebles',        color: '#8B6914', href: '/industrias/madera' },
  colchones: { name: 'Colchones y Espumas',      color: '#2A4899', href: '/industrias/colchones' },
  calzado:   { name: 'Calzado y Marroquinería',  color: '#181B1C', href: '/industrias/calzado' },
  multiusos: { name: 'Hogar y Multiusos',        color: '#85C639', href: '/industrias/hogar' },
};

const CAT_ORDER = ['madera', 'colchones', 'calzado', 'multiusos'];

const CATALOG_QUERY = `
  query {
    categories(filters: [{ key: "limit", operation: eq, value: "100" }]) {
      items {
        urlKey
        products(filters: [{ key: "limit", operation: eq, value: "500" }]) {
          items {
            productId
            uuid
            name
            url
            status
            image { url alt }
          }
        }
      }
    }
  }
`;

export default function CatalogPage() {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);

  const [result] = useQuery({ query: CATALOG_QUERY, pause: !isClient, requestPolicy: 'cache-and-network' });

  const initialOpen = CAT_ORDER.reduce((acc, k) => ({ ...acc, [k]: true }), {} as Record<string, boolean>);
  const [openIndustries, setOpenIndustries] = useState<Record<string, boolean>>(initialOpen);

  const sections: CatSection[] = useMemo(() => {
    const cats: any[] = result.data?.categories?.items ?? [];
    const out: CatSection[] = [];
    for (const urlKey of CAT_ORDER) {
      const cat = cats.find((c: any) => c.urlKey === urlKey);
      if (!cat) continue;
      const products: any[] = (cat.products?.items ?? []).filter((p: any) => p.status === 1);
      const familyMap: Record<string, any[]> = {};
      for (const p of products) {
        const f = getFamily(p.name) || p.name;
        if (!familyMap[f]) familyMap[f] = [];
        familyMap[f].push(p);
      }
      const families: FamilyCard[] = Object.entries(familyMap)
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([family, prods]) => {
          const rep = pickRepresentative(prods);
          return {
            family,
            count: prods.length,
            repImage: rep?.image?.url ?? null,
            products: prods,
            href: `${CAT_META[urlKey]?.href ?? '/catalog'}?familia=${encodeURIComponent(family)}`,
          };
        });
      out.push({
        urlKey,
        meta: CAT_META[urlKey] ?? { name: urlKey, color: '#2A4899', href: '/catalog' },
        families,
        total: products.length,
      });
    }
    return out;
  }, [result.data]);

  const toggleIndustry = (key: string) =>
    setOpenIndustries(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <div style={{ fontFamily: 'Sora, Inter, sans-serif', background: '#f8fafc', minHeight: '100vh' }}>

      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #2A4899 0%, #1e3576 100%)', padding: '4rem 2rem 3rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 70% 50%, rgba(133,198,57,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ fontSize: '10px', fontWeight: 700, color: '#85C639', letterSpacing: '0.35em', textTransform: 'uppercase', marginBottom: '12px' }}>
          Portafolio completo
        </div>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, color: '#fff', margin: '0 0 1rem', letterSpacing: '-0.02em', textTransform: 'uppercase', lineHeight: 1 }}>
          Catálogo INCAP
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 'clamp(14px, 2vw, 17px)', maxWidth: '680px', margin: '0 auto', lineHeight: 1.7, fontWeight: 400, fontFamily: 'Inter, sans-serif' }}>
          322 productos para las principales industrias colombianas. Encuentra tu solución de adhesión exacta.
        </p>
      </div>

      {/* Body: sidebar + grid */}
      <div style={{ maxWidth: '1536px', margin: '0 auto', display: 'flex', gap: '1.5rem', padding: '2rem 1.5rem', alignItems: 'flex-start' }}>

        {/* Sidebar */}
        <aside style={{ width: '240px', flexShrink: 0, position: 'sticky', top: '140px', background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', maxHeight: 'calc(100vh - 160px)', overflowY: 'auto' }}>
          <div style={{ padding: '1rem 1rem 0.5rem', borderBottom: '1px solid #f1f5f9' }}>
            <p style={{ margin: 0, fontSize: '9px', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.3em', textTransform: 'uppercase' }}>Industrias</p>
          </div>

          {CAT_ORDER.map(key => {
            const meta = CAT_META[key];
            const sec = sections.find(s => s.urlKey === key);
            const open = openIndustries[key];
            return (
              <div key={key}>
                {/* Industry toggle */}
                <button
                  onClick={() => toggleIndustry(key)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '10px 14px', border: 'none', borderBottom: '1px solid #f1f5f9',
                    background: open ? `${meta.color}08` : '#fff',
                    cursor: 'pointer', textAlign: 'left',
                  }}
                >
                  <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: meta.color, flexShrink: 0 }} />
                  <span style={{ flex: 1, fontSize: '11px', fontWeight: 800, color: '#181B1C', textTransform: 'uppercase', letterSpacing: '0.04em', fontFamily: 'Sora, sans-serif', lineHeight: 1.3 }}>
                    {meta.name}
                  </span>
                  <svg width="10" height="10" fill="none" stroke="#94a3b8" viewBox="0 0 24 24"
                    style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Family links */}
                {open && sec && (
                  <div style={{ background: '#fafbfc', borderBottom: '1px solid #f1f5f9' }}>
                    <a
                      href={`#cat-${key}`}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 14px 7px 22px', fontSize: '10px', fontWeight: 700, color: meta.color, fontFamily: 'Sora, sans-serif', textDecoration: 'none', borderBottom: '1px solid #f1f5f9', background: `${meta.color}06` }}
                    >
                      <span>Ver todos</span>
                      <span style={{ fontSize: '9px', color: '#94a3b8', fontWeight: 600 }}>{sec.total}</span>
                    </a>
                    {sec.families.map(fc => (
                      <a
                        key={fc.family}
                        href={fc.href}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '5px 14px 5px 22px', fontSize: '11px', color: '#475569', fontFamily: 'Inter, sans-serif', textDecoration: 'none', lineHeight: 1.4, transition: 'background 0.12s, color 0.12s' }}
                        onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = `${meta.color}0c`; el.style.color = meta.color; }}
                        onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'transparent'; el.style.color = '#475569'; }}
                      >
                        <span>{fc.family}</span>
                        <span style={{ fontSize: '9px', color: '#94a3b8', fontWeight: 600, flexShrink: 0, marginLeft: '4px' }}>{fc.count}</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </aside>

        {/* Main content */}
        <main style={{ flex: 1, minWidth: 0 }}>
          {result.fetching && sections.length === 0 && (
            <div style={{ textAlign: 'center', padding: '5rem 2rem', color: '#94a3b8', fontSize: '14px', fontFamily: 'Inter, sans-serif' }}>
              Cargando catálogo…
            </div>
          )}

          {sections.map((sec: CatSection) => (
            <section key={sec.urlKey} id={`cat-${sec.urlKey}`} style={{ marginBottom: '4rem' }}>

              {/* Section header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem', flexWrap: 'wrap', paddingBottom: '1rem', borderBottom: `2px solid ${sec.meta.color}20` }}>
                <div style={{ width: '6px', height: '32px', background: sec.meta.color, borderRadius: '3px', flexShrink: 0 }} />
                <h2 style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.8rem)', fontWeight: 900, color: '#181B1C', margin: 0, textTransform: 'uppercase', letterSpacing: '-0.01em', fontFamily: 'Sora, sans-serif' }}>
                  {sec.meta.name}
                </h2>
                <span style={{ marginLeft: 'auto', fontSize: '11px', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                  {sec.total} prod. · {sec.families.length} familias
                </span>
                <a href={sec.meta.href} style={{ fontSize: '11px', fontWeight: 700, color: sec.meta.color, textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.06em', flexShrink: 0 }}>
                  Ver industria →
                </a>
              </div>

              {/* Cards grid — same style as IndustryPage */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '1.25rem' }}>
                {sec.families.map((fc: FamilyCard) => {
                  const sortedProds = [...fc.products].sort((a: any, b: any) => {
                    const num = (s: string) => parseFloat(s.replace(/[^\d.]/g, '')) || 0;
                    return num(getPresentation(a.name)) - num(getPresentation(b.name));
                  });
                  return (
                    <div
                      key={fc.family}
                      style={{ background: '#fff', borderRadius: '24px', boxShadow: '0 4px 16px rgba(42,72,153,0.07)', border: '1px solid #f1f5f9', overflow: 'hidden', transition: 'box-shadow 0.2s, transform 0.2s' }}
                      onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = '0 12px 36px rgba(42,72,153,0.16)'; el.style.transform = 'translateY(-4px)'; }}
                      onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = '0 4px 16px rgba(42,72,153,0.07)'; el.style.transform = 'translateY(0)'; }}
                    >
                      <a href={fc.href} style={{ display: 'block', textDecoration: 'none' }}>
                        {/* Image — object-contain, full product visible */}
                        <div style={{ height: '180px', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', overflow: 'hidden', borderBottom: '1px solid #f8fafc' }}>
                          {fc.repImage ? (
                            <img
                              src={fc.repImage}
                              alt={fc.family}
                              style={{ width: '100%', height: '100%', objectFit: 'contain', transition: 'transform 0.4s' }}
                              loading="lazy"
                            />
                          ) : (
                            <div style={{ width: '60px', height: '60px', borderRadius: '12px', background: '#f1f5f9' }} />
                          )}
                        </div>

                        <div style={{ padding: '12px 14px 8px' }}>
                          <span style={{ fontSize: '9px', fontWeight: 800, color: sec.meta.color, letterSpacing: '0.3em', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                            Especializado
                          </span>
                          <h3 style={{ margin: 0, fontSize: '13px', fontWeight: 900, color: '#181B1C', fontFamily: 'Sora, sans-serif', lineHeight: 1.25, textTransform: 'uppercase', letterSpacing: '-0.01em' }}>
                            {fc.family}
                          </h3>
                        </div>
                      </a>

                      {/* Presentation chips */}
                      <div style={{ padding: '0 14px 14px' }}>
                        <p style={{ fontSize: '9px', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.25em', textTransform: 'uppercase', margin: '0 0 6px' }}>
                          Presentaciones
                        </p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                          {sortedProds.slice(0, 5).map((p: any) => (
                            <a
                              key={p.productId}
                              href={`/product/${p.uuid}`}
                              style={{ display: 'inline-block', padding: '3px 8px', background: '#f1f5f9', color: '#2A4899', borderRadius: '6px', fontSize: '10px', fontWeight: 700, fontFamily: 'Sora, sans-serif', textDecoration: 'none', transition: 'all 0.15s' }}
                              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = '#2A4899'; el.style.color = '#fff'; }}
                              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = '#f1f5f9'; el.style.color = '#2A4899'; }}
                            >
                              {getPresentation(p.name)}
                            </a>
                          ))}
                          {sortedProds.length > 5 && (
                            <a
                              href={fc.href}
                              style={{ display: 'inline-block', padding: '3px 8px', background: '#e0e7ff', color: '#2A4899', borderRadius: '6px', fontSize: '10px', fontWeight: 700, fontFamily: 'Sora, sans-serif', textDecoration: 'none' }}
                            >
                              +{sortedProds.length - 5}
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </main>
      </div>

      {/* CTA footer */}
      <div style={{ background: '#181B1C', padding: '3rem 1.5rem', textAlign: 'center', marginTop: '1rem' }}>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'Inter, sans-serif', fontSize: '14px', marginBottom: '1.5rem' }}>
          ¿No encuentras lo que necesitas? Nuestros asesores técnicos pueden ayudarte.
        </p>
        <a href="https://api.whatsapp.com/send?phone=+573002171521&text=Quiero%20m%C3%A1s%20informaci%C3%B3n" target="_blank" rel="noopener noreferrer"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#85C639', color: '#181B1C', fontFamily: 'Sora, sans-serif', fontWeight: 800, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.2em', padding: '14px 32px', borderRadius: '50px', textDecoration: 'none' }}>
          Solicitar Asesoría Técnica →
        </a>
      </div>
    </div>
  );
}

export const layout = {
  areaId: 'content',
  sortOrder: 1,
};
