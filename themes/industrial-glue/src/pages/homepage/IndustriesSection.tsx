import React from 'react';
import { useReveal } from '../../hooks/useReveal';

const industries = [
  {
    id: 'madera',
    title: 'Madera y Muebles',
    description: 'Ensamble estructural y laminado fino con tecnología PVA de alta ingeniería.',
    href: '/industrias/madera',
    image: '/images/sections/Categoria_Maderas_Muebles_Seccion_Home.webp',
    icons: [
      { src: '/images/icons/Icono_Categoria_Madera_Muebles.svg', label: 'Maderas' },
      { src: '/images/icons/Icono_Categoria_Madera_Muebles_2.svg', label: 'Muebles' }
    ],
  },
  {
    id: 'colchones',
    title: 'Colchones y Espumas',
    description: 'Adhesivos libres de tolueno diseñados para el confort y la salud de tu equipo.',
    href: '/industrias/colchones',
    image: '/images/sections/Colchones_Seccion_Home.webp',
    icons: [
      { src: '/images/icons/INCAP_Icono_colchones_Espumas.svg', label: 'Colchones' },
      { src: '/images/icons/INCAP_Icono_colchones_Espumas_2.svg', label: 'Espumas' }
    ],
  },
  {
    id: 'calzado',
    title: 'Calzado y Marroquinería',
    description: 'Sistemas completos de pegado para las fábricas más exigentes del país.',
    href: '/industrias/calzado',
    image: '/images/sections/Calzado_Marroquinera_Seccion_Home.webp',
    icons: [
      { src: '/images/icons/INCAP_Icono_Calzado_y_Marroquinera_2.svg', label: 'Calzado y Marroquinería' },
      { src: '/images/icons/Icono_Calzado.png', label: 'Calzado' },
    ],
  },
  {
    id: 'hogar',
    title: 'Hogar y Multiusos',
    description: 'Soluciones versátiles para reparaciones del hogar y proyectos creativos.',
    href: '/industrias/hogar',
    image: '/images/sections/Hogar_Multiusos_Seccion_Home.webp',
    icons: [
      { src: '/images/icons/INCAP_Icono_Hogar_Manualidades_y_Multisuos.svg', label: 'Hogar' },
      { src: '/images/icons/INCAP_Icono_Hogar_Manualidades_y_Multisuos_2.svg', label: 'Manualidades' },
      { src: '/images/icons/INCAP_Icono_Hogar_Manualidades_y_Multisuos_3.svg', label: 'Multiusos' }
    ],
  },
];

export default function IndustriesSection() {
  const reveal = useReveal();
  return (
    <section className={`bg-[#f8f9fa] py-24 px-4 sm:px-6 lg:px-8 ${reveal.className}`} ref={reveal.ref}>
      <div className="w-full max-w-[1920px] mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <div>
            <h2 className="text-5xl md:text-7xl font-black text-[#181B1C] leading-[0.9] uppercase font-sora">
              INDUSTRIAS QUE<br />
              <span className="text-[#2A4899]">IMPULSAMOS</span>
            </h2>
            <div className="w-24 h-2 bg-[#85C639] mt-6"></div>
          </div>
          
          <a
            href="/catalog"
            className="mt-8 md:mt-0 text-[10px] font-black text-[#2A4899] hover:text-[#85C639] tracking-[0.2em] uppercase flex items-center gap-2 transition-all group"
          >
            VER TODO EL PORTAFOLIO
            <span className="group-hover:translate-x-2 transition-transform">→</span>
          </a>
        </div>

        {/* CTA rápidos por industria */}
        <div className="flex flex-wrap gap-3 mb-10">
          {industries.map((ind) => (
            <a
              key={ind.id}
              href={ind.href}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#2A4899]/30 text-[#2A4899] text-xs font-black uppercase tracking-wider hover:bg-[#2A4899] hover:text-white hover:border-[#2A4899] transition-all duration-200 font-sora"
            >
              {ind.title}
              <span className="text-[#85C639]">→</span>
            </a>
          ))}
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {industries.map((ind, idx) => (
            <div
              key={ind.id}
              className={`flex flex-col bg-white rounded-3xl overflow-hidden shadow-xl shadow-slate-200/40 border border-slate-100 reveal reveal-stagger-${idx + 1} active group`}
            >
              {/* Image Area with Overlay */}
              <div className="relative h-[280px] overflow-hidden bg-slate-100">
                <img
                  src={ind.image}
                  alt={ind.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#181B1C]/90 via-[#181B1C]/20 to-transparent" />
                
                {/* Vertical Blue Icon Ribbon */}
                <div className="absolute top-0 left-6 bg-[#2A4899] w-[72px] rounded-b-2xl flex flex-col items-center py-5 gap-5 shadow-lg z-10">
                  {ind.icons.map((icon, i) => (
                    <img key={i} src={icon.src} className="w-8 h-8 object-contain" alt={icon.label} />
                  ))}
                </div>

                {/* Title inside image */}
                <div className="absolute bottom-5 left-6 right-6 z-10">
                  <h3 className="text-xl md:text-2xl font-black text-white uppercase leading-tight tracking-tight font-sora shadow-sm">
                    {ind.title}
                  </h3>
                </div>
              </div>

              {/* Content below image */}
              <div className="p-6 flex flex-col flex-1">
                <p className="text-slate-500 text-xs md:text-sm font-medium leading-relaxed mb-6 flex-1">
                  {ind.description}
                </p>
                
                <a 
                  href={ind.href}
                  className="w-full py-3 border border-[#2A4899] text-[#2A4899] rounded-xl text-[10px] md:text-xs font-bold uppercase tracking-widest text-center hover:bg-[#2A4899] hover:text-white transition-all duration-300"
                >
                  VER SOLUCIONES ESPECIALIZADAS
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export const layout = {
  areaId: 'content',
  sortOrder: 5
};
