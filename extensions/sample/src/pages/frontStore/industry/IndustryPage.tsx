import React, { useState, useEffect, useMemo } from 'react';
import { useQuery } from 'urql';
import { getFamily, getPresentation, pickRepresentative } from '../../../utils/family.js';

const INDUSTRIES_DATA: Record<string, any> = {
  madera: {
    id: 'madera',
    slugs: ['madera', 'maderas', 'muebles'],
    name: 'Madera y Muebles',
    heroImage: '/images/banners/Banner_Maderas_Muebles.webp',
    icons: ['/images/icons/Icono_Maderas.webp', '/images/icons/Icono_Muebles.webp'],
    description: 'Soluciones adhesivas de alta ingeniería para la industria del mueble. De la ebanistería fina a la producción en serie.',
  },
  colchones: {
    id: 'colchones',
    slugs: ['colchones', 'espumas'],
    name: 'Colchones y Espumas',
    heroImage: '/images/banners/Banner_Colchones.webp',
    icons: ['/images/icons/Icono_Colchones.webp', '/images/icons/icono_Espuma.webp'],
    description: 'Ingeniería para el descanso. Adhesivos que optimizan tu línea de producción y protegen la salud de tu equipo.',
  },
  calzado: {
    id: 'calzado',
    slugs: ['calzado', 'marroquineria'],
    name: 'Calzado y Marroquinería',
    heroImage: '/images/banners/Banner_Calzado_Marroquineria.webp',
    icons: ['/images/icons/Icono_Calzado.webp', '/images/icons/Icono_Marroquineria.webp'],
    description: 'El estándar de las grandes fábricas. Un ecosistema completo para reducir garantías.',
  },
  hogar: {
    id: 'hogar',
    slugs: ['hogar', 'multiusos', 'manualidades'],
    name: 'Hogar y Multiusos',
    heroImage: '/images/banners/Banner_Hogar_Multiusos.webp',
    icons: ['/images/icons/Icono_Hogar.webp', '/images/icons/Icono_manualidades.webp', '/images/icons/Icono_Multiusos.webp'],
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

  // Agrupar productos por familia — una card por familia
  const familyGroups = useMemo(() => {
    const map = new Map<string, any[]>();
    realProducts.forEach((p: any) => {
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
      .sort((a, b) => b.products.length - a.products.length || a.family.localeCompare(b.family));
  }, [realProducts]);

  const families = familyGroups.map(g => [g.family, g.products.length] as [string, number]);

  const [activeFamily, setActiveFamily] = useState<string>('');

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      setActiveFamily(params.get('familia') || '');
    } catch {
      setActiveFamily('');
    }
  }, [data.id]);

  // Soporta filtro exacto ("Maxón Blanco") o por prefijo de línea ("Maxón" → Maxón Blanco, Maxón Rápid…)
  const filteredGroups = activeFamily
    ? familyGroups.filter(g =>
        g.family === activeFamily ||
        g.family.toLowerCase().startsWith(activeFamily.toLowerCase() + ' ')
      )
    : familyGroups;

  return (
    <div className="min-h-screen animate-fadeIn bg-white font-sora -mt-[124px]">
      <div className="relative overflow-hidden bg-[#181B1C] pt-[124px]">
        <img src={data.heroImage} className="w-full h-auto block opacity-60" alt={data.name} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#181B1C] via-[#181B1C]/20 to-transparent pointer-events-none"></div>
        <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-[#181B1C]/80 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 pb-10 md:pb-16 z-20">
          <div className="max-w-[1536px] mx-auto w-full px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-6 mb-4">
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
      </div>
      <section className="py-16 md:py-32 bg-slate-50">
        <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
           <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-[#181B1C] font-sora mb-8 md:mb-12 uppercase text-center tracking-tighter">Portafolio Técnico</h2>

           {/* Barra de filtros */}
           {!result.fetching && familyGroups.length > 0 && (
             <div style={{ marginBottom: '40px' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '12px 16px' }}>
                 <span style={{ fontSize: '9px', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.25em', textTransform: 'uppercase', flexShrink: 0 }}>Filtrar</span>
                 <div style={{ width: '1px', height: '20px', background: '#e2e8f0', flexShrink: 0 }} />

                 {families.length > 1 && (
                   <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                     <div style={{ position: 'relative' }}>
                       <select
                         value={activeFamily}
                         onChange={e => setActiveFamily(e.target.value)}
                         style={{
                           appearance: 'none', WebkitAppearance: 'none',
                           padding: '7px 32px 7px 12px', borderRadius: '8px', border: 'none',
                           background: activeFamily ? '#2A4899' : '#f8fafc',
                           color: activeFamily ? '#fff' : '#374151',
                           fontSize: '12px', fontWeight: 700, cursor: 'pointer',
                           fontFamily: 'Sora, sans-serif', outline: 'none',
                         }}
                       >
                         <option value="">Todos los productos</option>
                         {families.map(([fam, count]) => (
                           <option key={fam} value={fam}>{fam} ({count} presentaciones)</option>
                         ))}
                       </select>
                       <svg style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="10" height="10" fill="none" stroke={activeFamily ? '#fff' : '#94a3b8'} viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                       </svg>
                     </div>
                     {activeFamily && (
                       <button onClick={() => setActiveFamily('')}
                         style={{ width: '22px', height: '22px', borderRadius: '50%', border: 'none', background: '#e2e8f0', color: '#64748b', cursor: 'pointer', fontSize: '13px', lineHeight: 1, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                         ×
                       </button>
                     )}
                   </div>
                 )}

                 <span style={{ marginLeft: 'auto', fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>
                   {filteredGroups.length} familia{filteredGroups.length !== 1 ? 's' : ''}
                 </span>
               </div>
             </div>
           )}

           {result.fetching ? (
             <div className="text-center py-20 text-slate-400">Cargando portafolio...</div>
           ) : filteredGroups.length > 0 ? (
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12">
               {filteredGroups.map((group) => {
                 const rep = group.representative;
                 const firstUrl = rep.url ?? `/product/${rep.uuid}`;
                 const sortedProducts = [...group.products].sort((a: any, b: any) => {
                   const num = (s: string) => parseFloat(s.replace(/[^\d.]/g, '')) || 0;
                   return num(getPresentation(a.name)) - num(getPresentation(b.name));
                 });
                 return (
                   <div key={group.family} className="bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-xl border border-slate-100 hover:shadow-2xl transition-all overflow-hidden">
                     <a href={firstUrl} className="block">
                       <div className="h-52 md:h-64 overflow-hidden bg-white flex items-center justify-center p-4">
                         {rep.image?.url ? (
                           <img src={rep.image.url} className="w-full h-full object-contain hover:scale-105 transition-transform duration-700" alt={group.family} />
                         ) : (
                           <div className="w-full h-full flex items-center justify-center text-slate-300 font-sora font-black uppercase tracking-widest text-base md:text-xl">Sin Imagen</div>
                         )}
                       </div>
                       <div className="px-6 md:px-10 pt-6 md:pt-8">
                         <span className="text-[#2A4899] font-black text-[10px] uppercase tracking-[0.4em] mb-2 block">Especializado</span>
                         <h3 className="text-xl md:text-2xl font-black mb-3 font-sora text-[#181B1C] hover:text-[#2A4899] transition-colors uppercase tracking-tight leading-none">{group.family}</h3>
                       </div>
                     </a>
                     {/* Chips de presentación */}
                     <div className="px-6 md:px-10 pb-6 md:pb-10">
                       <p style={{ fontSize: '9px', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '10px' }}>
                         Presentaciones
                       </p>
                       <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                         {sortedProducts.map((p: any) => (
                           <a
                             key={p.productId}
                             href={p.url ?? `/product/${p.uuid}`}
                             style={{
                               display: 'inline-block',
                               padding: '4px 10px',
                               background: '#f1f5f9',
                               color: '#2A4899',
                               borderRadius: '6px',
                               fontSize: '11px',
                               fontWeight: 700,
                               fontFamily: 'Sora, sans-serif',
                               textDecoration: 'none',
                               border: '1.5px solid transparent',
                               transition: 'all 0.15s',
                             }}
                             onMouseOver={(e) => {
                               (e.currentTarget as HTMLElement).style.background = '#2A4899';
                               (e.currentTarget as HTMLElement).style.color = '#fff';
                             }}
                             onMouseOut={(e) => {
                               (e.currentTarget as HTMLElement).style.background = '#f1f5f9';
                               (e.currentTarget as HTMLElement).style.color = '#2A4899';
                             }}
                           >
                             {getPresentation(p.name)}
                           </a>
                         ))}
                       </div>
                     </div>
                   </div>
                 );
               })}
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
