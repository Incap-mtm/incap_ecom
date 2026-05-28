import React, { useState, useEffect, useMemo } from 'react';
import { useQuery } from 'urql';
import { getFamily, getPresentation, pickRepresentative } from '../../../utils/family.js';

interface FamilyCard {
  family: string;
  count: number;
  image: string | null;
  presentations: string[];
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
            name
            sku
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
        .map(([family, prods]) => ({
          family,
          count: prods.length,
          image: (pickRepresentative(prods)?.image?.url as string) ?? null,
          presentations: [...new Set(prods.map((p: any) => getPresentation(p.name)).filter((x): x is string => !!x))],
          href: `${CAT_META[urlKey]?.href ?? '/catalog'}?familia=${encodeURIComponent(family)}`,
        }));
      out.push({ urlKey, meta: CAT_META[urlKey] ?? { name: urlKey, color: '#2A4899', href: '/catalog' }, families, total: products.length });
    }
    return out;
  }, [result.data]);

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

      {/* Sticky nav pills */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '0.875rem 1.5rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center', position: 'sticky', top: '124px', zIndex: 10 }}>
        {CAT_ORDER.map(key => {
          const meta = CAT_META[key];
          return (
            <a key={key} href={`#cat-${key}`} style={{ fontSize: '11px', fontWeight: 700, color: meta.color, background: '#f8fafc', border: `1.5px solid ${meta.color}40`, borderRadius: '20px', padding: '5px 14px', textDecoration: 'none', letterSpacing: '0.05em', textTransform: 'uppercase', transition: 'background 0.15s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = `${meta.color}12`; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#f8fafc'; }}
            >
              {meta.name}
            </a>
          );
        })}
      </div>

      {result.fetching && sections.length === 0 && (
        <div style={{ textAlign: 'center', padding: '5rem 2rem', color: '#94a3b8', fontFamily: 'Inter, sans-serif', fontSize: '14px' }}>
          Cargando catálogo…
        </div>
      )}

      {sections.map((sec: CatSection) => (
        <section key={sec.urlKey} id={`cat-${sec.urlKey}`} style={{ maxWidth: '1400px', margin: '0 auto', padding: '3rem 1.5rem 1rem' }}>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{ width: '6px', height: '32px', background: sec.meta.color, borderRadius: '3px', flexShrink: 0 }} />
            <h2 style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.6rem)', fontWeight: 900, color: '#181B1C', margin: 0, textTransform: 'uppercase', letterSpacing: '-0.01em' }}>
              {sec.meta.name}
            </h2>
            <span style={{ marginLeft: 'auto', fontSize: '11px', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.1em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
              {sec.total} productos · {sec.families.length} familias
            </span>
            <a href={sec.meta.href} style={{ fontSize: '11px', fontWeight: 700, color: sec.meta.color, textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.06em', flexShrink: 0, whiteSpace: 'nowrap' }}>
              Ver industria →
            </a>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
            {sec.families.map((fc: FamilyCard) => (
              <a key={fc.family} href={fc.href} style={{ display: 'flex', flexDirection: 'column', background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden', textDecoration: 'none', transition: 'box-shadow 0.2s, transform 0.2s', boxShadow: '0 1px 4px rgba(42,72,153,0.06)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(42,72,153,0.14)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 4px rgba(42,72,153,0.06)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
              >
                <div style={{ height: '130px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderBottom: '1px solid #f1f5f9', position: 'relative' }}>
                  {fc.image ? (
                    <img src={fc.image} alt={fc.family} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                  ) : (
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#e2e8f0' }} />
                  )}
                  <div style={{ position: 'absolute', top: '8px', right: '8px', background: `${sec.meta.color}18`, border: `1px solid ${sec.meta.color}30`, borderRadius: '4px', padding: '2px 6px', fontSize: '9px', fontWeight: 700, color: sec.meta.color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {fc.count} ref{fc.count !== 1 ? 's' : '.'}
                  </div>
                </div>
                <div style={{ padding: '10px 12px', flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <p style={{ margin: 0, fontSize: '12px', fontWeight: 800, color: '#181B1C', fontFamily: 'Sora, sans-serif', lineHeight: 1.3 }}>
                    {fc.family}
                  </p>
                  {fc.presentations.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px' }}>
                      {fc.presentations.slice(0, 4).map((p: string) => (
                        <span key={p} style={{ fontSize: '9px', fontWeight: 700, color: '#64748b', background: '#f1f5f9', borderRadius: '4px', padding: '2px 5px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{p}</span>
                      ))}
                      {fc.presentations.length > 4 && (
                        <span style={{ fontSize: '9px', fontWeight: 700, color: '#94a3b8', background: '#f1f5f9', borderRadius: '4px', padding: '2px 5px' }}>+{fc.presentations.length - 4}</span>
                      )}
                    </div>
                  )}
                  <span style={{ marginTop: 'auto', fontSize: '10px', fontWeight: 700, color: sec.meta.color, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Ver →
                  </span>
                </div>
              </a>
            ))}
          </div>
        </section>
      ))}

      {/* CTA footer */}
      <div style={{ background: '#181B1C', padding: '3rem 1.5rem', textAlign: 'center', marginTop: '2rem' }}>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'Inter, sans-serif', fontSize: '14px', marginBottom: '1.5rem' }}>
          ¿No encuentras lo que necesitas? Nuestros asesores técnicos pueden ayudarte.
        </p>
        <a href="https://api.whatsapp.com/send?phone=+573002171521&text=Quiero%20m%C3%A1s%20informaci%C3%B3n" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#85C639', color: '#181B1C', fontFamily: 'Sora, sans-serif', fontWeight: 800, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.2em', padding: '14px 32px', borderRadius: '50px', textDecoration: 'none' }}>
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
