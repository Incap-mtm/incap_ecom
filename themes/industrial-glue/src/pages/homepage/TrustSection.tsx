import React from 'react';

// Logos from themes/industrial-glue/public/Logo Aliados/
// Paths verified once EverShop asset serving is confirmed
const partnerLogos = [
  { name: 'Kenda Farben', src: '/themes/industrial-glue/Logo Aliados/Logo Kenda Farben.svg' },
  { name: 'CT Point', src: '/themes/industrial-glue/Logo Aliados/Logo CT Point.svg' },
  { name: 'Intercom', src: '/themes/industrial-glue/Logo Aliados/Logo Intercom.svg' },
  { name: 'Tecno GI', src: '/themes/industrial-glue/Logo Aliados/Logo Tecno GI.svg' },
];

const stats = [
  { value: '+56', label: 'Años en la industria' },
  { value: '+500', label: 'Empresas clientes' },
  { value: '4', label: 'Líneas especializadas' },
  { value: '100%', label: 'Fabricación nacional' },
];

export default function TrustSection() {
  return (
    <section className="bg-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-4xl sm:text-5xl font-extrabold text-[#2A4899]" style={{ fontFamily: 'Sora, sans-serif' }}>
                {stat.value}
              </div>
              <div className="mt-2 text-sm text-slate-500 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Logos */}
        <div className="border-t border-slate-100 pt-16">
          <p className="text-center text-slate-400 text-sm font-medium tracking-wide uppercase mb-10">
            Empresas líderes confían en nuestra química para proteger su reputación
          </p>
          <div className="flex flex-wrap items-center justify-center gap-12">
            {partnerLogos.map((logo) => (
              <img
                key={logo.name}
                src={logo.src}
                alt={logo.name}
                className="h-10 object-contain opacity-60 hover:opacity-100 transition-opacity duration-300 grayscale hover:grayscale-0"
              />
            ))}
          </div>
        </div>

        {/* Quote */}
        <blockquote className="mt-16 text-center">
          <p className="text-2xl sm:text-3xl font-bold text-[#181B1C] italic max-w-3xl mx-auto" style={{ fontFamily: 'Sora, sans-serif' }}>
            "+56 años uniendo la industria colombiana."
          </p>
        </blockquote>
      </div>
    </section>
  );
}

export const layout = {
  areaId: 'content',
  sortOrder: 22
};
