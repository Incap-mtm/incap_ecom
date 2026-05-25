import React, { useState, useMemo } from 'react';
import { useQuery } from 'urql';
import { getFamily, getPresentation } from '../../../utils/family.js';

const PRODUCTS_QUERY = `
  query {
    setting {
      storeWhatsappNumber
    }
    categories(filters: [{ key: "limit", operation: eq, value: "100" }]) {
      items {
        urlKey
        products(filters: [{ key: "limit", operation: eq, value: "500" }]) {
          items {
            productId
            uuid
            name
            status
            price { regular { text } }
            image { url alt }
            url
          }
        }
      }
    }
  }
`;

function isGalonPresentation(name: string): boolean {
  return /[Gg]al/.test(name);
}

const CATEGORY_LABELS: Record<string, string> = {
  calzado: 'Calzado y Marroquinería',
  multiusos: 'Hogar y Multiusos',
  madera: 'Madera y Muebles',
  colchones: 'Colchones y Espumas',
};

export default function FabricantesPage() {
  const [result] = useQuery({ query: PRODUCTS_QUERY, requestPolicy: 'cache-and-network' });

  const whatsappNumber = result.data?.setting?.storeWhatsappNumber ?? '573002171521';
  const allCategories: any[] = result.data?.categories?.items ?? [];

  // Flatten all active products, dedup, filter only gallon presentations
  const allProducts = useMemo(() => {
    const raw = allCategories.flatMap((cat: any) => cat.products?.items ?? []);
    const unique = Array.from(new Map(raw.map((p: any) => [p.productId, p])).values());
    return (unique as any[]).filter((p) => p.status === 1 && isGalonPresentation(p.name));
  }, [allCategories]);

  // Families with count
  const families = useMemo(() => {
    const counts: Record<string, number> = {};
    allProducts.forEach((p) => {
      const fam = getFamily(p.name);
      counts[fam] = (counts[fam] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  }, [allProducts]);

  const [activeFamily, setActiveFamily] = useState('');
  const [activePresentation, setActivePresentation] = useState('');

  const filteredByFamily = activeFamily
    ? allProducts.filter((p) => getFamily(p.name) === activeFamily)
    : allProducts;

  const presentations = useMemo(() => {
    const seen = new Set<string>();
    filteredByFamily.forEach((p) => {
      const pres = getPresentation(p.name);
      if (pres) seen.add(pres);
    });
    const sortByVolume = (s: string) => parseFloat(s.replace(/[^\d.]/g, '')) || 0;
    return Array.from(seen).sort((a, b) => sortByVolume(a) - sortByVolume(b));
  }, [filteredByFamily]);

  const filteredProducts = activePresentation
    ? filteredByFamily.filter((p) => getPresentation(p.name) === activePresentation)
    : filteredByFamily;

  const waMessage = encodeURIComponent('Hola INCAP! Quiero información sobre compras en volumen (presentaciones en Galón) para mi planta de producción.');

  return (
    <div style={{ fontFamily: 'Sora, Inter, sans-serif', background: '#fff', minHeight: '100vh' }}>

      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #181B1C 0%, #1e2a4a 100%)', padding: '5rem 2rem 3.5rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 80% 40%, rgba(133,198,57,0.07) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative' }}>
          <div style={{ fontSize: '10px', fontWeight: 800, color: '#85C639', letterSpacing: '0.35em', textTransform: 'uppercase', marginBottom: '14px' }}>
            Presentaciones Industriales
          </div>
          <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)', fontWeight: 900, color: '#fff', margin: '0 0 1rem', textTransform: 'uppercase', letterSpacing: '-0.02em', lineHeight: 1 }}>
            PORTAFOLIO PARA<br />
            <span style={{ color: '#85C639' }}>FABRICANTES</span>
          </h1>
          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.6)', maxWidth: '560px', lineHeight: 1.7, margin: '0 0 2rem', fontFamily: 'Inter, sans-serif', fontWeight: 400 }}>
            Adhesivos INCAP en presentaciones de galón para producción continua. Optimiza tus costos y garantiza stock constante en planta.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            <a href={`https://wa.me/${whatsappNumber}?text=${waMessage}`} target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#85C639', color: '#181B1C', padding: '12px 24px', borderRadius: '50px', fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', textDecoration: 'none' }}>
              Solicitar cotización en volumen
              <span>→</span>
            </a>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#85C639' }} />
              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', fontFamily: 'Inter, sans-serif' }}>
                {result.fetching ? '...' : `${allProducts.length} referencias disponibles`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Category quick-links */}
      <div style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', padding: '0.875rem 2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
          <span style={{ fontSize: '9px', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.2em', textTransform: 'uppercase', marginRight: '4px' }}>Industrias</span>
          {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
            <a key={key} href={`/industrias/${key}`}
              style={{ fontSize: '11px', fontWeight: 700, color: '#2A4899', background: '#fff', border: '1px solid #dbeafe', borderRadius: '20px', padding: '4px 14px', textDecoration: 'none', letterSpacing: '0.04em' }}>
              {label}
            </a>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2.5rem 2rem 4rem' }}>

        {/* Filter bar */}
        {!result.fetching && allProducts.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '12px 16px', marginBottom: '2rem' }}>
            <span style={{ fontSize: '9px', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.25em', textTransform: 'uppercase', flexShrink: 0 }}>Filtrar</span>
            <div style={{ width: '1px', height: '20px', background: '#e2e8f0', flexShrink: 0 }} />

            {/* Familia */}
            {families.length > 1 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{ position: 'relative' }}>
                  <select value={activeFamily} onChange={e => { setActiveFamily(e.target.value); setActivePresentation(''); }}
                    style={{ appearance: 'none', WebkitAppearance: 'none', padding: '7px 32px 7px 12px', borderRadius: '8px', border: 'none', background: activeFamily ? '#2A4899' : '#f8fafc', color: activeFamily ? '#fff' : '#374151', fontSize: '12px', fontWeight: 700, cursor: 'pointer', fontFamily: 'Sora, sans-serif', outline: 'none' }}>
                    <option value="">Familia</option>
                    {families.map(([fam, count]) => (
                      <option key={fam} value={fam}>{fam} ({count})</option>
                    ))}
                  </select>
                  <svg style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="10" height="10" fill="none" stroke={activeFamily ? '#fff' : '#94a3b8'} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                {activeFamily && (
                  <button onClick={() => { setActiveFamily(''); setActivePresentation(''); }}
                    style={{ width: '22px', height: '22px', borderRadius: '50%', border: 'none', background: '#e2e8f0', color: '#64748b', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                    ×
                  </button>
                )}
              </div>
            )}

            {/* Presentación */}
            {presentations.length > 1 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{ position: 'relative' }}>
                  <select value={activePresentation} onChange={e => setActivePresentation(e.target.value)}
                    style={{ appearance: 'none', WebkitAppearance: 'none', padding: '7px 32px 7px 12px', borderRadius: '8px', border: 'none', background: activePresentation ? '#2A4899' : '#f8fafc', color: activePresentation ? '#fff' : '#374151', fontSize: '12px', fontWeight: 700, cursor: 'pointer', fontFamily: 'Sora, sans-serif', outline: 'none' }}>
                    <option value="">Presentación</option>
                    {presentations.map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                  <svg style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="10" height="10" fill="none" stroke={activePresentation ? '#fff' : '#94a3b8'} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                {activePresentation && (
                  <button onClick={() => setActivePresentation('')}
                    style={{ width: '22px', height: '22px', borderRadius: '50%', border: 'none', background: '#e2e8f0', color: '#64748b', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                    ×
                  </button>
                )}
              </div>
            )}

            <span style={{ marginLeft: 'auto', fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>
              {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''}
            </span>
          </div>
        )}

        {/* Grid */}
        {result.fetching ? (
          <div style={{ textAlign: 'center', padding: '5rem', color: '#94a3b8', fontFamily: 'Sora, sans-serif', fontSize: '14px' }}>
            Cargando portafolio...
          </div>
        ) : filteredProducts.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem' }}>
            {filteredProducts.map((prod: any) => (
              <a href={`/product/${prod.uuid}`} key={prod.productId}
                style={{ display: 'flex', flexDirection: 'column', background: '#fff', borderRadius: '20px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 8px rgba(42,72,153,0.06)', textDecoration: 'none', transition: 'box-shadow 0.2s, transform 0.2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 8px 30px rgba(42,72,153,0.15)'; (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 1px 8px rgba(42,72,153,0.06)'; (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)'; }}>

                {/* Image */}
                <div style={{ height: '180px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', overflow: 'hidden' }}>
                  {prod.image?.url ? (
                    <img src={prod.image.url} alt={prod.name}
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  ) : (
                    <div style={{ color: '#cbd5e1', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'center' }}>Sin imagen</div>
                  )}
                </div>

                {/* Info */}
                <div style={{ padding: '1rem 1.25rem 1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  {/* Presentation badge */}
                  {getPresentation(prod.name) && (
                    <span style={{ display: 'inline-block', fontSize: '9px', fontWeight: 800, color: '#2A4899', background: '#eff6ff', borderRadius: '6px', padding: '3px 8px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.1em', alignSelf: 'flex-start' }}>
                      {getPresentation(prod.name)}
                    </span>
                  )}
                  <h3 style={{ fontSize: '13px', fontWeight: 900, color: '#181B1C', margin: '0 0 0.5rem', lineHeight: 1.3, textTransform: 'uppercase', letterSpacing: '0.02em', fontFamily: 'Sora, sans-serif' }}>
                    {getFamily(prod.name)}
                  </h3>
                  <div style={{ marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#2A4899', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      Ver ficha
                    </span>
                    <span style={{ fontSize: '14px', color: '#85C639', fontWeight: 900 }}>→</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '5rem 2rem', background: '#f8fafc', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
            <p style={{ color: '#94a3b8', fontSize: '15px', fontFamily: 'Inter, sans-serif', margin: 0 }}>
              No se encontraron productos con estos filtros.
            </p>
          </div>
        )}

        {/* CTA volumen */}
        {!result.fetching && allProducts.length > 0 && (
          <div style={{ marginTop: '3rem', background: 'linear-gradient(135deg, #2A4899 0%, #1e3576 100%)', borderRadius: '20px', padding: '2.5rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem' }}>
            <div>
              <div style={{ fontSize: '10px', fontWeight: 800, color: '#85C639', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '8px' }}>
                Compra en volumen
              </div>
              <h3 style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)', fontWeight: 900, color: '#fff', margin: 0, textTransform: 'uppercase', letterSpacing: '-0.01em' }}>
                ¿Necesitas precios especiales para tu planta?
              </h3>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', margin: '8px 0 0', fontFamily: 'Inter, sans-serif' }}>
                Nuestros asesores técnicos te ayudan a elegir el adhesivo correcto y negociar volúmenes.
              </p>
            </div>
            <a href={`https://wa.me/${whatsappNumber}?text=${waMessage}`} target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#85C639', color: '#181B1C', padding: '14px 28px', borderRadius: '50px', fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', textDecoration: 'none', whiteSpace: 'nowrap' }}>
              Hablar con un asesor
              <span>→</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export const layout = {
  areaId: 'content',
  sortOrder: 1,
};
