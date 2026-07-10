import React, { useState, useEffect, useMemo } from 'react';
import { useQuery } from 'urql';
import { getFamily, pickRepresentative } from '../../../utils/family.js';

function buildQuery(term: string) {
  const safe = term.replace(/"/g, '').replace(/%/g, '');
  return `
    query {
      setting { storeWhatsappNumber }
      products(filters: [
        { key: "fulltext", operation: eq, value: "${safe}" }
        { key: "limit",  operation: eq,    value: "500" }
        { key: "status", operation: eq,    value: "1" }
      ]) {
        items {
          productId
          name
          sku
          url
          image { url alt }
        }
        total
      }
    }
  `;
}

const AZUL = '#2A4899';
const VERDE = '#85C639';

export default function BuscarPage() {
  const [keyword, setKeyword] = useState('');
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    try {
      const q = new URLSearchParams(window.location.search).get('q') || '';
      setKeyword(q);
      setInputValue(q);
    } catch { /* SSR guard */ }
  }, []);

  const [result] = useQuery({
    query: buildQuery(keyword),
    pause: keyword.length < 2,
    requestPolicy: 'cache-and-network',
  });

  const whatsapp = result.data?.setting?.storeWhatsappNumber ?? '573002171521';
  const items: any[] = result.data?.products?.items || [];
  const total: number = result.data?.products?.total ?? 0;
  const hasKeyword = keyword.length >= 2;

  // Ordenar por relevancia: empieza con → contiene → resto
  const sortedItems = useMemo(() => {
    if (!keyword || items.length === 0) return items;
    const lower = keyword.toLowerCase().trim();
    return [...items].sort((a: any, b: any) => {
      const an = (a.name || '').toLowerCase();
      const bn = (b.name || '').toLowerCase();
      const aStarts = an.startsWith(lower) ? 0 : 1;
      const bStarts = bn.startsWith(lower) ? 0 : 1;
      const aContains = an.includes(lower) ? 0 : 1;
      const bContains = bn.includes(lower) ? 0 : 1;
      return (aStarts - bStarts) || (aContains - bContains) || an.localeCompare(bn);
    });
  }, [items, keyword]);

  const familyGroups = useMemo(() => {
    const map = new Map<string, any[]>();
    sortedItems.forEach((p: any) => {
      const fam = getFamily(p.name);
      if (!map.has(fam)) map.set(fam, []);
      map.get(fam)!.push(p);
    });
    return Array.from(map.entries())
      .map(([family, products]) => ({
        family,
        products,
        representative: pickRepresentative(products),
      }))
      .sort((a, b) => a.family.localeCompare(b.family));
  }, [sortedItems]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = inputValue.trim();
    if (q.length < 2) return;
    setKeyword(q);
    try { window.history.pushState({}, '', `/buscar?q=${encodeURIComponent(q)}`); } catch { /* */ }
  };

  return (
    <div className="min-h-screen bg-white font-sora">
      {/* Encabezado compacto */}
      <section style={{ background: `linear-gradient(160deg, ${AZUL} 0%, #1e3576 100%)`, padding: '32px 0 34px' }}>
        <div style={{ maxWidth: '1536px', margin: '0 auto', padding: '0 2rem' }}>
          <p style={{ fontSize: '0.65rem', fontWeight: 800, color: VERDE, letterSpacing: '0.4em', textTransform: 'uppercase', marginBottom: '10px' }}>
            Resultados de búsqueda
          </p>

          {hasKeyword ? (
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '18px', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: 'clamp(1.9rem, 4.5vw, 3.2rem)', fontWeight: 900, color: '#fff', lineHeight: 1.05, textTransform: 'uppercase', letterSpacing: '-0.03em', margin: 0 }}>
                <span style={{ color: VERDE }}>&ldquo;{keyword}&rdquo;</span>
              </h1>
              {!result.fetching && (
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#c7d2fe', fontFamily: "'Inter', sans-serif" }}>
                  {total} {total === 1 ? 'producto' : 'productos'}
                </span>
              )}
            </div>
          ) : (
            <>
              <h1 style={{ fontSize: 'clamp(1.9rem, 4.5vw, 3.2rem)', fontWeight: 900, color: '#fff', lineHeight: 1.05, textTransform: 'uppercase', letterSpacing: '-0.03em', margin: '0 0 22px' }}>
                Buscador de productos
              </h1>
              <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', maxWidth: '600px' }}>
                <input
                  type="text"
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  placeholder="Nombre, uso, aplicación…"
                  style={{ flex: 1, padding: '13px 16px', borderRadius: '10px', border: 'none', outline: 'none', fontSize: '0.9rem', fontFamily: "'Inter', sans-serif", fontWeight: 500, color: '#1e293b', boxShadow: '0 4px 14px rgba(0,0,0,0.12)' }}
                />
                <button
                  type="submit"
                  style={{ background: VERDE, color: '#181B1C', border: 'none', borderRadius: '10px', padding: '13px 26px', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer', whiteSpace: 'nowrap' }}
                >
                  Buscar
                </button>
              </form>
            </>
          )}
        </div>
      </section>

      {/* Resultados */}
      <section style={{ maxWidth: '1536px', margin: '0 auto', padding: '40px 2rem 72px' }}>
        {hasKeyword && result.fetching && (
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', fontFamily: "'Inter', sans-serif" }}>Buscando…</p>
        )}

        {hasKeyword && !result.fetching && items.length === 0 && (
          <div style={{ textAlign: 'center', padding: '72px 0' }}>
            <svg width="52" height="52" fill="none" stroke="#cbd5e1" viewBox="0 0 24 24" style={{ margin: '0 auto 18px', display: 'block' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
            </svg>
            <p style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>
              Sin resultados para &ldquo;{keyword}&rdquo;
            </p>
            <p style={{ color: '#64748b', fontFamily: "'Inter', sans-serif", fontSize: '0.9rem' }}>
              Probá con otro término o{' '}
              <a href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(`Busco información sobre: ${keyword}`)}`} style={{ color: AZUL, fontWeight: 600 }}>
                consultá con un asesor
              </a>
            </p>
          </div>
        )}

        {hasKeyword && !result.fetching && items.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: '24px' }}>
            {familyGroups.map(({ family, products, representative }) => (
              <a
                key={family}
                href={representative.url}
                style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', borderRadius: '18px', overflow: 'hidden', border: '1px solid #e8edf5', background: '#fff', boxShadow: '0 2px 10px rgba(42,72,153,0.05)', transition: 'box-shadow 0.2s, transform 0.2s' }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = '0 14px 34px rgba(42,72,153,0.15)'; el.style.transform = 'translateY(-3px)'; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = '0 2px 10px rgba(42,72,153,0.05)'; el.style.transform = 'none'; }}
              >
                <div style={{ aspectRatio: '1', background: '#fff', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '18px', borderBottom: '1px solid #f1f5f9' }}>
                  {representative.image?.url
                    ? <img src={representative.image.url} alt={representative.image.alt || family} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    : <svg width="44" height="44" fill="none" stroke="#cbd5e1" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 20M6 8h.01M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2z" /></svg>
                  }
                </div>
                <div style={{ padding: '16px 18px 18px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <p style={{ margin: '0 0 3px', fontSize: '0.95rem', fontWeight: 800, color: '#181B1C', lineHeight: 1.2, textTransform: 'uppercase', letterSpacing: '-0.01em' }}>
                    {family}
                  </p>
                  <p style={{ margin: '0 0 12px', fontSize: '0.72rem', color: '#94a3b8', fontFamily: "'Inter', sans-serif" }}>
                    {products.length} {products.length === 1 ? 'presentación' : 'presentaciones'}
                  </p>
                  <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginTop: 'auto' }}>
                    {products.slice(0, 4).map((p: any) => {
                      const size = p.name.includes(' - ') ? p.name.split(' - ').pop() : '';
                      return size ? (
                        <span key={p.productId} style={{ fontSize: '0.65rem', fontWeight: 700, background: '#eef2fb', color: AZUL, borderRadius: '6px', padding: '3px 8px', fontFamily: "'Sora', sans-serif" }}>
                          {size}
                        </span>
                      ) : null;
                    })}
                    {products.length > 4 && (
                      <span style={{ fontSize: '0.65rem', fontWeight: 700, background: AZUL, color: '#fff', borderRadius: '6px', padding: '3px 8px' }}>
                        +{products.length - 4}
                      </span>
                    )}
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export const layout = {
  areaId: 'content',
  sortOrder: 1,
};
