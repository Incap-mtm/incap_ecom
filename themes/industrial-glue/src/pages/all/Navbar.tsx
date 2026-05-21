import React, { useState, useEffect, useMemo } from 'react';
import { useQuery } from 'urql';

interface Industry {
  id: 'madera' | 'colchones' | 'calzado' | 'hogar';
  name: string;
  href: string;
  icon: string;
  catUrlKey: string; // url_key de la categoría DB
}

const industries: Industry[] = [
  { id: 'madera',    name: 'Madera y Muebles',        href: '/industrias/madera',    icon: '/images/icons/Icono_Categoria_Madera_Muebles.svg',           catUrlKey: 'madera' },
  { id: 'colchones', name: 'Colchones y Espumas',     href: '/industrias/colchones', icon: '/images/icons/INCAP_Icono_colchones_Espumas.svg',            catUrlKey: 'colchones' },
  { id: 'calzado',   name: 'Calzado y Marroquinería', href: '/industrias/calzado',   icon: '/images/icons/INCAP_Icono_Calzado_y_Marroquinera_2.svg',     catUrlKey: 'calzado' },
  { id: 'hogar',     name: 'Hogar y Multiusos',       href: '/industrias/hogar',     icon: '/images/icons/INCAP_Icono_Hogar_Manualidades_y_Multisuos.svg', catUrlKey: 'multiusos' },
];

// Deriva la "familia" de un producto a partir de su nombre.
function getFamily(name: string): string {
  if (!name) return '';
  const idx = name.lastIndexOf(' - ');
  return (idx === -1 ? name : name.substring(0, idx)).trim();
}

const FAMILIES_QUERY = `
  query {
    categories(filters: [{ key: "limit", operation: eq, value: "100" }]) {
      items {
        urlKey
        products(filters: [{ key: "limit", operation: eq, value: "500" }]) {
          items { name status }
        }
      }
    }
  }
`;

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpandedInd, setMobileExpandedInd] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const [result] = useQuery({ query: FAMILIES_QUERY });

  // Construir map: industria.id → [{family, count}]
  const familiesByIndustry = useMemo(() => {
    const out: Record<string, { family: string; count: number }[]> = {};
    const cats = result.data?.categories?.items || [];
    for (const ind of industries) {
      const cat = cats.find((c: any) => c.urlKey === ind.catUrlKey);
      const products = (cat?.products?.items || []).filter((p: any) => p.status === 1);
      const counts: Record<string, number> = {};
      products.forEach((p: any) => {
        const f = getFamily(p.name);
        if (f) counts[f] = (counts[f] || 0) + 1;
      });
      out[ind.id] = Object.entries(counts)
        .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
        .map(([family, count]) => ({ family, count }));
    }
    return out;
  }, [result.data]);

  return (
    <nav className={`incap-navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="incap-navbar__inner">
        {/* Logo */}
        <a href="/" className="incap-navbar__logo group">
          <svg viewBox="0 0 231.9 68.2" className="h-7 md:h-9 w-auto transition-transform duration-500 group-hover:scale-110">
            <path fill="#FFFFFF" d="M69.8,40.6v-40H51.2V21h-0.5L41.9,0.6H23.6c-1.8,0-3.3,1.5-3.3,3.3v40h18.5V23.5h0.5l8.8,20.4h18.4 C68.3,43.9,69.8,42.4,69.8,40.6z"/>
            <path fill="#FFFFFF" d="M0,11.4c0,1.6,1.3,2.9,2.9,2.9H13L0,23.7v17.9c0,1.2,1,2.2,2.2,2.2h16.3V0.6H0V11.4z"/>
            <path fill="#FFFFFF" d="M112,24.9c-1.9-0.1-3.7,0.9-4.6,2.6c-0.5,0.8-1.1,1.5-1.8,2c-1.5,1-3.6,1.5-6.3,1.5c-3,0-5.3-0.7-6.7-2.1 c-1.4-1.4-2.1-3.6-2.1-6.5s0.7-5.1,2.1-6.5s3.7-2.1,6.7-2.1c2.6,0,4.5,0.5,5.9,1.5c0.7,0.5,1.2,1.2,1.7,2c1,1.7,2.9,2.7,4.8,2.5 l14-1c-0.2-6.3-2.4-11-6.8-14.1C114.6,1.5,108,0,99.1,0c-9.4,0-16.3,1.8-20.6,5.4v0c-4.4,3.6-6.5,9.2-6.5,16.9s2.2,13.3,6.6,16.9 c4.4,3.6,11.3,5.4,20.8,5.4c8.9,0,15.6-1.5,20.1-4.6c4.5-3.1,6.8-7.8,6.9-14.1L112,24.9z"/>
            <path fill="#FFFFFF" d="M159.3,43.9h20.4L166.5,3.8c-0.6-1.9-2.4-3.1-4.3-3.1h-24.5l-14.2,43.3h20.4l1.5-6.2h12.5L159.3,43.9z M148.1,26.6l3.3-13.6h0.5l3.3,13.6H148.1z"/>
            <path fill="#FFFFFF" d="M228.4,6.2c-2.4-2.5-5.2-4.1-8.6-4.7c-3.4-0.6-7.8-0.9-13.4-0.9h-24.6h0v43.3h14.7c2.1,0,3.8-1.7,3.8-3.8v-4.8 h6.1c5.6,0,10.1-0.3,13.5-0.8c3.4-0.5,6.2-2.1,8.5-4.6c2.3-2.5,3.5-6.4,3.5-11.8C231.9,12.7,230.8,8.7,228.4,6.2z M211.9,21.9 c-1,0.6-2.8,0.9-5.5,0.9v0h-6.1v-8.7h6.1c2.7,0,4.5,0.3,5.5,0.9c1,0.6,1.5,1.8,1.5,3.4C213.4,20.2,212.9,21.3,211.9,21.9z"/>
          </svg>
        </a>

        {/* Desktop links */}
        <div className="incap-navbar__links">
          <div
            className="relative"
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <a href="#" className="incap-navbar__link flex items-center gap-2">
              Industrias
              <svg
                className={`transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24" width="14" height="14"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </a>

            {/* Mega-menú */}
            <div
              className={`fixed left-1/2 -translate-x-1/2 top-[80px] bg-white shadow-2xl border-t-4 border-[#2A4899] transition-all duration-300 ${dropdownOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
              style={{ width: 'min(1200px, 95vw)', maxHeight: 'calc(100vh - 100px)', overflowY: 'auto' }}
            >
              <div className="grid grid-cols-4 gap-0 p-6">
                {industries.map((ind) => {
                  const fams = familiesByIndustry[ind.id] || [];
                  return (
                    <div key={ind.id} className="px-4 border-r border-slate-100 last:border-r-0">
                      <a
                        href={ind.href}
                        className="flex items-center gap-3 mb-4 group/header"
                      >
                        <div className="bg-[#2A4899] rounded-lg p-2 w-10 h-10 flex items-center justify-center flex-shrink-0">
                          <img src={ind.icon} className="w-full h-full object-contain" alt="" />
                        </div>
                        <span className="text-[11px] font-black uppercase tracking-[0.15em] text-[#181B1C] leading-tight group-hover/header:text-[#2A4899] transition-colors">
                          {ind.name}
                        </span>
                      </a>
                      <ul className="space-y-1">
                        {fams.length === 0 && !result.fetching && (
                          <li className="text-[10px] text-slate-400 px-2 py-1">Sin productos</li>
                        )}
                        {result.fetching && fams.length === 0 && (
                          <li className="text-[10px] text-slate-400 px-2 py-1">Cargando…</li>
                        )}
                        {fams.map(({ family, count }) => (
                          <li key={family}>
                            <a
                              href={`${ind.href}?familia=${encodeURIComponent(family)}`}
                              className="flex items-center justify-between px-2 py-1.5 text-[11px] font-semibold text-slate-700 hover:text-[#2A4899] hover:bg-slate-50 rounded transition-all font-sora"
                            >
                              <span className="truncate">{family}</span>
                              <span className="text-[9px] text-slate-400 ml-2 font-bold">({count})</span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <a href="/distribuidores" className="incap-navbar__link">
            Distribuidores
          </a>
        </div>

        {/* CTA */}
        <a href="/catalog" className="btn-incap btn-primary-incap text-xs py-3 px-6">
          Solicitar Asesoría
        </a>

        {/* Mobile toggle */}
        <button
          className="incap-navbar__toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menú"
        >
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="28" height="28">
            {mobileOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="incap-navbar__mobile glass-header">
          <div className="pb-6">
            <p className="text-[11px] font-black uppercase tracking-[0.3em] text-white/40 mb-4 px-2">Industrias</p>
            <div className="grid grid-cols-1 gap-1">
              {industries.map((ind) => {
                const fams = familiesByIndustry[ind.id] || [];
                const expanded = mobileExpandedInd === ind.id;
                return (
                  <div key={ind.id}>
                    <div className="incap-navbar__mobile-link justify-between" style={{ cursor: 'pointer' }} onClick={() => setMobileExpandedInd(expanded ? null : ind.id)}>
                      <a href={ind.href} className="flex-1 text-white" onClick={(e) => e.stopPropagation()}>{ind.name}</a>
                      <svg className={`h-4 w-4 text-[#85C639] flex-shrink-0 transition-transform ${expanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                    {expanded && (
                      <div className="pl-4 pb-2">
                        {fams.length === 0 && <p className="text-[11px] text-white/40 py-2">Sin familias</p>}
                        {fams.map(({ family, count }) => (
                          <a
                            key={family}
                            href={`${ind.href}?familia=${encodeURIComponent(family)}`}
                            className="block text-[12px] text-white/80 hover:text-[#85C639] py-2 font-sora"
                          >
                            {family} <span className="text-white/40 text-[10px]">({count})</span>
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <a href="/distribuidores" className="incap-navbar__mobile-link">
            Distribuidores
            <svg className="h-4 w-4 text-[#85C639] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </a>
          <a href="/catalog" className="btn-incap btn-primary-incap mt-6 justify-center">
            Solicitar Asesoría
          </a>
        </div>
      )}
    </nav>
  );
}

export const layout = {
  areaId: 'headerTop',
  sortOrder: 1
};
