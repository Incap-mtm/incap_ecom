import React, { useState, useEffect, useMemo } from 'react';
import { useQuery } from 'urql';
import { getFamily } from '../../../utils/family.js';

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

  const familyGroups = useMemo(() => {
    const map = new Map<string, any[]>();
    items.forEach((p: any) => {
      const fam = getFamily(p.name);
      if (!map.has(fam)) map.set(fam, []);
      map.get(fam)!.push(p);
    });
    return Array.from(map.entries())
      .map(([family, products]) => ({
        family,
        products,
        representative: products.find((p: any) => p.image?.url) || products[0],
      }))
      .sort((a, b) => a.family.localeCompare(b.family));
  }, [items]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = inputValue.trim();
    if (q.length < 2) return;
    setKeyword(q);
    try { window.history.pushState({}, '', `/buscar?q=${encodeURIComponent(q)}`); } catch { /* */ }
  };

  return (
    <div className="min-h-screen bg-white font-sora" style={{ paddingTop: '124px' }}>
      {/* Hero / barra de búsqueda */}
      <section style={{ background: 'linear-gradient(160deg, #2A4899 0%, #1e3576 100%)', padding: '40px 0 48px' }}>
        <div style={{ maxWidth: '1536px', margin: '0 auto', padding: '0 2rem' }}>
          <p style={{ fontSize: '0.65rem', fontWeight: 800, color: '#85C639', letterSpacing: '0.4em', textTransform: 'uppercase', marginBottom: '10px', fontFamily: "'Sora', sans-serif" }}>
            Catálogo INCAP
          </p>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, color: '#fff', fontFamily: "'Sora', sans-serif", lineHeight: 1.1, textTransform: 'uppercase', letterSpacing: '-0.03em', marginBottom: '24px' }}>
            {keyword
              ? <><span style={{ color: '#85C639' }}>"{keyword}"</span></>
              : 'Buscador de productos'}
          </h1>
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', maxWidth: '600px' }}>
            <input
              type="text"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              placeholder="Nombre, uso, aplicación..."
              style={{ flex: 1, padding: '12px 16px', borderRadius: '8px', border: 'none', outline: 'none', fontSize: '0.9rem', fontFamily: "'Inter', sans-serif", fontWeight: 500, color: '#1e293b' }}
            />
            <button
              type="submit"
              style={{ background: '#85C639', color: '#181B1C', border: 'none', borderRadius: '8px', padding: '12px 24px', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: "'Sora', sans-serif", whiteSpace: 'nowrap' }}
            >
              Buscar
            </button>
          </form>
        </div>
      </section>

      {/* Resultados */}
      <section style={{ maxWidth: '1536px', margin: '0 auto', padding: '48px 2rem' }}>
        {keyword.length < 2 && (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <svg width="48" height="48" fill="none" stroke="#cbd5e1" viewBox="0 0 24 24" style={{ margin: '0 auto 16px', display: 'block' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
            </svg>
            <p style={{ color: '#94a3b8', fontSize: '1rem', fontFamily: "'Inter', sans-serif" }}>Escribe al menos 2 caracteres para buscar</p>
          </div>
        )}

        {keyword.length >= 2 && result.fetching && (
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', fontFamily: "'Inter', sans-serif" }}>Buscando…</p>
        )}

        {keyword.length >= 2 && !result.fetching && items.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <p style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b', fontFamily: "'Sora', sans-serif", marginBottom: '8px' }}>
              Sin resultados para "{keyword}"
            </p>
            <p style={{ color: '#64748b', fontFamily: "'Inter', sans-serif", fontSize: '0.9rem' }}>
              Intenta con otro término o{' '}
              <a href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(`Busco información sobre: ${keyword}`)}`} style={{ color: '#2A4899', fontWeight: 600 }}>
                consulta con un asesor
              </a>
            </p>
          </div>
        )}

        {!result.fetching && items.length > 0 && (
          <>
            <p style={{ fontSize: '0.8rem', color: '#64748b', fontFamily: "'Inter', sans-serif", marginBottom: '32px', fontWeight: 500 }}>
              <strong style={{ color: '#2A4899' }}>{total}</strong> {total === 1 ? 'producto' : 'productos'} para <strong>"{keyword}"</strong>
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
              {familyGroups.map(({ family, products, representative }) => (
                <a
                  key={family}
                  href={representative.url}
                  style={{ textDecoration: 'none', display: 'block', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0', background: '#fff', transition: 'all 0.2s' }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = '0 8px 24px rgba(42,72,153,0.12)'; el.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = 'none'; el.style.transform = 'none'; }}
                >
                  <div style={{ aspectRatio: '1', background: '#f8faff', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {representative.image?.url
                      ? <img src={representative.image.url} alt={representative.image.alt || family} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <svg width="40" height="40" fill="none" stroke="#cbd5e1" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 20M6 8h.01M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2z" /></svg>
                    }
                  </div>
                  <div style={{ padding: '14px' }}>
                    <p style={{ margin: '0 0 4px', fontSize: '0.85rem', fontWeight: 800, color: '#1e293b', fontFamily: "'Sora', sans-serif", lineHeight: 1.2 }}>
                      {family}
                    </p>
                    <p style={{ margin: 0, fontSize: '0.72rem', color: '#64748b', fontFamily: "'Inter', sans-serif" }}>
                      {products.length} {products.length === 1 ? 'presentación' : 'presentaciones'}
                    </p>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '8px' }}>
                      {products.slice(0, 4).map((p: any) => {
                        const size = p.name.includes(' - ') ? p.name.split(' - ').pop() : '';
                        return size ? (
                          <span key={p.productId} style={{ fontSize: '0.62rem', fontWeight: 700, background: '#f1f5f9', color: '#475569', borderRadius: '4px', padding: '2px 6px' }}>
                            {size}
                          </span>
                        ) : null;
                      })}
                      {products.length > 4 && (
                        <span style={{ fontSize: '0.62rem', fontWeight: 700, background: '#e0e7ff', color: '#2A4899', borderRadius: '4px', padding: '2px 6px' }}>
                          +{products.length - 4}
                        </span>
                      )}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}

export const layout = {
  areaId: 'content',
  sortOrder: 1,
};
