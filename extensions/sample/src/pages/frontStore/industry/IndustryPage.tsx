import React, { useState, useEffect, useMemo } from 'react';
import { useQuery } from 'urql';
import { getFamily, getPresentation } from '../../../utils/family.js';

const INDUSTRIES_DATA: Record<string, any> = {
  madera: {
    id: 'madera',
    slugs: ['madera', 'maderas', 'muebles'],
    name: 'Madera y Muebles',
    heroImage: '/images/banners/Banner_Maderas_Muebles.webp',
    icons: ['/images/icons/Icono_Categoria_Madera_Muebles.svg', '/images/icons/Icono_Categoria_Madera_Muebles_2.svg'],
    description: 'Soluciones adhesivas de alta ingeniería para la industria del mueble. De la ebanistería fina a la producción en serie.',
  },
  colchones: {
    id: 'colchones',
    slugs: ['colchones', 'espumas'],
    name: 'Colchones y Espumas',
    heroImage: '/images/banners/Banner_Colchones.webp',
    icons: ['/images/icons/INCAP_Icono_colchones_Espumas.svg', '/images/icons/INCAP_Icono_colchones_Espumas_2.svg'],
    description: 'Ingeniería para el descanso. Adhesivos que optimizan tu línea de producción y protegen la salud de tu equipo.',
  },
  calzado: {
    id: 'calzado',
    slugs: ['calzado', 'marroquineria'],
    name: 'Calzado y Marroquinería',
    heroImage: '/images/banners/Banner_Calzado_Marroquineria.webp',
    icons: ['/images/icons/Icono_Calzado.png', '/images/icons/INCAP_Icono_Calzado_y_Marroquinera_2_alt.svg'],
    description: 'El estándar de las grandes fábricas. Un ecosistema completo para reducir garantías.',
  },
  hogar: {
    id: 'hogar',
    slugs: ['hogar', 'multiusos', 'manualidades'],
    name: 'Hogar y Multiusos',
    heroImage: '/images/banners/Banner_Hogar_Multiusos.webp',
    icons: ['/images/icons/INCAP_Icono_Hogar_Manualidades_y_Multisuos.svg', '/images/icons/INCAP_Icono_Hogar_Manualidades_y_Multisuos_2.svg', '/images/icons/INCAP_Icono_Hogar_Manualidades_y_Multisuos_3.svg'],
    description: 'Soluciones versátiles para el día a día. Reparaciones rápidas y proyectos creativos con calidad industrial.',
  }
};

const ConversionFooter = ({ whatsappNumber }: { whatsappNumber: string }) => (
  <section className="py-16 md:py-32 bg-[#181B1C] relative overflow-hidden font-sora">
    <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 items-center">
        {/* Left Side */}
        <div className="text-left">
           <div className="inline-block bg-[#85C639]/10 border border-[#85C639]/20 px-4 py-1.5 md:px-6 md:py-2 rounded-lg mb-6 md:mb-10">
              <span className="text-[#85C639] font-black text-xs uppercase tracking-[0.4em]">Soporte Técnico</span>
           </div>
           <h2 className="text-3xl sm:text-5xl md:text-8xl font-black font-sora mb-6 md:mb-10 uppercase tracking-tighter leading-none text-white">¿Fallas de <br/><span className="text-[#85C639]">Pegue?</span></h2>
           <p className="text-base md:text-2xl text-slate-400 mb-8 md:mb-16 font-inter font-light max-w-2xl leading-relaxed">
              Recibe un diagnóstico técnico gratuito en menos de 24 horas. Protege la calidad de tu producto final con expertos de planta.
           </p>
           <a href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Quiero más información')}`} className="inline-flex bg-[#85C639] text-[#181B1C] px-8 md:px-16 py-5 md:py-8 rounded-full font-black text-base md:text-2xl hover:bg-white hover:scale-105 transition-all duration-500 shadow-[0_20px_50px_-10px_rgba(133,198,57,0.5)] items-center gap-3 md:gap-6 uppercase tracking-tighter">
              HABLAR CON UN EXPERTO
           </a>
        </div>
        {/* Right Side */}
        <div className="relative group flex justify-center lg:justify-start">
           <div className="relative max-w-md w-full">
              <div className="absolute -inset-10 bg-[#2A4899]/20 rounded-[4rem] blur-3xl group-hover:bg-[#2A4899]/30 transition-all duration-700"></div>
              <div className="relative rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl">
                 <img src="/images/sections/Fallas_De_Pegue_contacto.png" className="w-full h-auto object-cover transform scale-90 group-hover:scale-[0.945] transition-transform duration-1000" alt="Soporte" />
                 <div className="absolute inset-0 bg-gradient-to-t from-[#181B1C]/60 to-transparent"></div>
              </div>
           </div>
        </div>
      </div>
    </div>
  </section>
);

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
            price {
              regular { text }
            }
            image { url alt }
            url
          }
        }
      }
    }
  }
`;

export default function IndustryPage() {
  const [data, setData] = useState(INDUSTRIES_DATA.madera);

  useEffect(() => {
    // Extract ID from the path: /industrias/madera -> madera
    const pathParts = window.location.pathname.split('/');
    const id = pathParts[pathParts.length - 1] || 'madera';
    
    if (INDUSTRIES_DATA[id]) {
      setData(INDUSTRIES_DATA[id]);
    }
  }, []);

  const [result] = useQuery({
    query: PRODUCTS_QUERY,
    requestPolicy: 'network-only' // Fuerza a ignorar el caché y siempre pedir los datos más recientes a la base de datos
  });

  const whatsappNumber = result.data?.setting?.storeWhatsappNumber ?? '573002171521';
  const allCategories = result.data?.categories?.items || [];
  
  // Extraemos todos los productos que pertenezcan a las categorías (urlKey) mapeadas en nuestros slugs
  const matchedCategories = allCategories.filter((cat: any) => data.slugs.includes(cat.urlKey));
  const realProductsRaw = matchedCategories.flatMap((cat: any) => cat.products?.items || []);
  
  // 1. Removemos duplicados (en caso de que un producto esté en múltiples categorías de esta industria)
  // 2. Filtramos los productos para mostrar SÓLO los que estén activos (status === 1)
  const uniqueProducts = Array.from(new Map(realProductsRaw.map((p: any) => [p.productId, p])).values());
  const realProducts = uniqueProducts.filter((p: any) => p.status === 1);

  const families = useMemo(() => {
    const counts: Record<string, number> = {};
    realProducts.forEach((p: any) => {
      const fam = getFamily(p.name);
      counts[fam] = (counts[fam] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  }, [realProducts]);

  const [activeFamily, setActiveFamily] = useState<string>('');
  const [activePresentation, setActivePresentation] = useState<string>('');

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      setActiveFamily(params.get('familia') || '');
      setActivePresentation('');
    } catch {
      setActiveFamily('');
      setActivePresentation('');
    }
  }, [data.id]);

  const filteredByFamily = activeFamily
    ? realProducts.filter((p: any) => getFamily(p.name) === activeFamily)
    : realProducts;

  const presentations = useMemo(() => {
    const seen = new Set<string>();
    filteredByFamily.forEach((p: any) => {
      const pres = getPresentation(p.name);
      if (pres) seen.add(pres);
    });
    return Array.from(seen).sort((a, b) => {
      const num = (s: string) => parseFloat(s.replace(/[^\d.]/g, '')) || 0;
      return num(a) - num(b);
    });
  }, [filteredByFamily]);

  const filteredProducts = activePresentation
    ? filteredByFamily.filter((p: any) => getPresentation(p.name) === activePresentation)
    : filteredByFamily;

  return (
    <div className="min-h-screen animate-fadeIn bg-white font-sora -mt-[90px]">
      <div className="relative min-h-[60vh] md:min-h-[70vh] lg:min-h-[80vh] flex items-center overflow-hidden bg-[#181B1C] pt-[90px]">
        <img src={data.heroImage} className="absolute inset-0 w-full h-full object-cover object-center opacity-50" alt={data.name} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#181B1C] via-[#181B1C]/30 to-transparent"></div>
        <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-[#181B1C]/80 to-transparent z-10" />
        <div className="max-w-[1536px] mx-auto w-full px-4 sm:px-6 lg:px-8 relative z-20">
          <div className="flex items-center gap-6 mb-6">
            <span className="text-[#85C639] font-black uppercase tracking-[0.5em] text-xs font-sora">Sistemas de Adherencia</span>
            <div className="flex gap-3">
              {data.icons && data.icons.map((icon, i) => (
                <div key={i} className="bg-[#2A4899] rounded-xl p-2.5 w-14 h-14 flex items-center justify-center shadow-lg">
                  <img src={icon} className="w-full h-full object-contain" alt="" />
                </div>
              ))}
            </div>
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-9xl font-black text-white font-sora mb-4 md:mb-8 leading-none uppercase tracking-tighter">{data.name}</h1>
          <p className="text-base sm:text-xl md:text-3xl text-slate-300 max-w-4xl font-inter font-light leading-relaxed">{data.description}</p>
        </div>
      </div>
      <section className="py-16 md:py-32 bg-slate-50">
        <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
           <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-[#181B1C] font-sora mb-8 md:mb-12 uppercase text-center tracking-tighter">Portafolio Técnico</h2>

           {/* Barra de filtros */}
           {!result.fetching && realProducts.length > 0 && (
             <div style={{ marginBottom: '40px' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '12px 16px' }}>
                 {/* Label */}
                 <span style={{ fontSize: '9px', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.25em', textTransform: 'uppercase', flexShrink: 0 }}>Filtrar</span>

                 <div style={{ width: '1px', height: '20px', background: '#e2e8f0', flexShrink: 0 }} />

                 {/* Familia */}
                 {families.length > 1 && (
                   <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                     <div style={{ position: 'relative' }}>
                       <select
                         value={activeFamily}
                         onChange={e => { setActiveFamily(e.target.value); setActivePresentation(''); }}
                         style={{
                           appearance: 'none', WebkitAppearance: 'none',
                           padding: '7px 32px 7px 12px', borderRadius: '8px', border: 'none',
                           background: activeFamily ? '#2A4899' : '#f8fafc',
                           color: activeFamily ? '#fff' : '#374151',
                           fontSize: '12px', fontWeight: 700, cursor: 'pointer',
                           fontFamily: 'Sora, sans-serif', outline: 'none',
                         }}
                       >
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
                         style={{ width: '22px', height: '22px', borderRadius: '50%', border: 'none', background: '#e2e8f0', color: '#64748b', cursor: 'pointer', fontSize: '13px', lineHeight: 1, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                         ×
                       </button>
                     )}
                   </div>
                 )}

                 {/* Presentación */}
                 {presentations.length > 1 && (
                   <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                     <div style={{ position: 'relative' }}>
                       <select
                         value={activePresentation}
                         onChange={e => setActivePresentation(e.target.value)}
                         style={{
                           appearance: 'none', WebkitAppearance: 'none',
                           padding: '7px 32px 7px 12px', borderRadius: '8px', border: 'none',
                           background: activePresentation ? '#2A4899' : '#f8fafc',
                           color: activePresentation ? '#fff' : '#374151',
                           fontSize: '12px', fontWeight: 700, cursor: 'pointer',
                           fontFamily: 'Sora, sans-serif', outline: 'none',
                         }}
                       >
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
                         style={{ width: '22px', height: '22px', borderRadius: '50%', border: 'none', background: '#e2e8f0', color: '#64748b', cursor: 'pointer', fontSize: '13px', lineHeight: 1, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                         ×
                       </button>
                     )}
                   </div>
                 )}

                 {/* Contador */}
                 <span style={{ marginLeft: 'auto', fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>
                   {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''}
                 </span>
               </div>
             </div>
           )}

           {result.fetching ? (
             <div className="text-center py-20 text-slate-400">Cargando portafolio...</div>
           ) : filteredProducts.length > 0 ? (
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12">
                {filteredProducts.map((prod: any) => (
                  <a href={`/product/${prod.uuid}`} key={prod.productId} className="bg-white p-0 rounded-[2rem] md:rounded-[2.5rem] shadow-xl border border-slate-100 hover:shadow-2xl transition-all cursor-pointer group overflow-hidden block">
                    <div className="h-52 md:h-72 overflow-hidden bg-white flex items-center justify-center p-4">
                      {prod.image?.url ? (
                        <img src={prod.image.url} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700" alt={prod.name} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300 font-sora font-black uppercase tracking-widest text-base md:text-xl">Sin Imagen</div>
                      )}
                    </div>
                    <div className="p-6 md:p-12">
                      <span className="text-[#2A4899] font-black text-[10px] uppercase tracking-[0.4em] mb-3 block">Especializado</span>
                      <h3 className="text-xl md:text-3xl font-black mb-4 md:mb-6 font-sora text-[#181B1C] group-hover:text-[#2A4899] transition-colors uppercase tracking-tight leading-none">{prod.name}</h3>
                      <div className="inline-block px-3 py-1.5 md:px-4 md:py-2 bg-slate-50 rounded-lg text-[10px] font-black text-slate-400 mb-6 md:mb-10 uppercase tracking-[0.3em]">{prod.price?.regular?.text || 'Consultar'}</div>
                      <div className="flex items-center justify-between">
                         <span className="text-[#2A4899] font-black font-sora text-xs md:text-sm uppercase tracking-widest">Ver Ficha Técnica</span>
                         <div className="w-10 h-10 md:w-14 md:h-14 rounded-full border-2 border-slate-100 flex items-center justify-center group-hover:bg-[#2A4899] group-hover:text-white transition-all duration-500">→</div>
                      </div>
                    </div>
                  </a>
                ))}
             </div>
           ) : (
             <div className="text-center py-20 bg-white rounded-[3rem] border border-slate-100 shadow-sm">
                <p className="text-2xl text-slate-400 font-light mb-6">Aún no hay productos asignados a la industria de <strong>{data.name}</strong> en el catálogo.</p>
                <a href="/admin/products" className="inline-block px-8 py-4 bg-[#2A4899] text-white rounded-full font-black text-xs uppercase tracking-widest hover:bg-[#181B1C] transition-colors">Añadir Productos</a>
             </div>
           )}
        </div>
      </section>
      <ConversionFooter whatsappNumber={whatsappNumber} />
    </div>
  );
}

export const layout = {
  areaId: 'content',
  sortOrder: 1
};
