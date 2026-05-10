import React from 'react';

const industries = [
  {
    id: 'madera',
    title: 'Madera y Muebles',
    description: 'De la ebanistería fina a la producción en serie. Asegura ensambles indestructibles y acabados de exportación con nuestra línea de PVA y sistemas de aspersión.',
    cta: 'Ver soluciones para Madera',
    href: '/catalog?industry=madera',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    lines: ['PVA', 'Madefort', 'Incaspray'],
    accentColor: '#85C639',
  },
  {
    id: 'colchones',
    title: 'Colchones y Espumas',
    description: 'Ingeniería para el descanso. Adhesivos libres de tolueno y de alta adherencia inicial que optimizan tu línea de producción y protegen la salud de tu equipo.',
    cta: 'Ver soluciones para Colchones',
    href: '/catalog?industry=colchones',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
    lines: ['Incafom'],
    accentColor: '#2A4899',
  },
  {
    id: 'calzado',
    title: 'Calzado y Marroquinería',
    description: 'El estándar de las grandes fábricas. Un ecosistema completo diseñado para reducir garantías y acelerar el tiempo de salida por par.',
    cta: 'Ver soluciones para Calzado',
    href: '/catalog?industry=calzado',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    lines: ['JAB', 'Kenda Farben', 'Tecnogi'],
    accentColor: '#85C639',
  },
  {
    id: 'hogar',
    title: 'Hogar y Multiusos',
    description: 'Soluciones versátiles para manualidades, reparaciones del hogar y proyectos creativos. Fácil aplicación y resultados profesionales.',
    cta: 'Ver soluciones Multiusos',
    href: '/catalog?industry=hogar',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
      </svg>
    ),
    lines: ['Nuevos Desarrollos'],
    accentColor: '#2A4899',
  },
];

export default function IndustriesSection() {
  return (
    <section className="bg-[#f8f9fa] py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-[#2A4899] text-sm font-semibold tracking-widest uppercase">Soluciones Especializadas</span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-[#181B1C]" style={{ fontFamily: 'Sora, sans-serif' }}>
            Adhesivos para cada industria
          </h2>
          <p className="mt-4 text-slate-500 max-w-2xl mx-auto">
            Desarrollamos formulaciones específicas para los desafíos de cada sector productivo.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {industries.map((ind) => (
            <a
              key={ind.id}
              href={ind.href}
              className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl border border-transparent hover:border-[#2A4899]/20 transition-all duration-300 flex flex-col"
            >
              {/* Icon */}
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center mb-5 transition-colors duration-300"
                style={{ backgroundColor: `${ind.accentColor}15`, color: ind.accentColor }}
              >
                {ind.icon}
              </div>

              <h3 className="text-lg font-bold text-[#181B1C] mb-2" style={{ fontFamily: 'Sora, sans-serif' }}>
                {ind.title}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed flex-1">
                {ind.description}
              </p>

              {/* Product lines */}
              <div className="flex flex-wrap gap-1.5 mt-4">
                {ind.lines.map((line) => (
                  <span
                    key={line}
                    className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ backgroundColor: `${ind.accentColor}15`, color: ind.accentColor }}
                  >
                    {line}
                  </span>
                ))}
              </div>

              <div className="mt-5 flex items-center gap-2 text-[#2A4899] text-sm font-semibold group-hover:gap-3 transition-all duration-300">
                {ind.cta}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </a>
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
