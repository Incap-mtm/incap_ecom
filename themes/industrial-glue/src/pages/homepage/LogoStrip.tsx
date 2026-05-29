import React from 'react';

const logos = [
  { name: 'Kenda Farben', src: '/images/logos/Logo_Kenda_Farben.svg' },
  { name: 'Intercom', src: '/images/logos/Logo_Intercom.svg' },
  { name: 'Tecno GI', src: '/images/logos/Logo_Tecno_GI.svg' },
  { name: 'CT Point', src: '/images/logos/Logo_CT_Point.svg' },
  { name: 'JAB', src: '/images/logos/jab-logo.png' },
];

export default function LogoStrip() {
  const loopLogos = [...logos, ...logos, ...logos, ...logos]; // Repeated multiple times for safety
  return (
    <section className="bg-white border-y border-slate-100 py-10 overflow-hidden">
      <div className="relative flex overflow-hidden">
        {/* Gradients for fading edges */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10" />
        
        <div className="flex animate-marquee whitespace-nowrap items-center py-4 grayscale hover:grayscale-0 transition-all duration-1000 opacity-40 hover:opacity-100 gap-[50px]">
          {loopLogos.map((logo, i) => (
            <img
              key={`${logo.name}-${i}`}
              src={logo.src}
              alt={logo.name}
              className="h-10 w-auto object-contain flex-shrink-0 transition-transform hover:scale-110"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export const layout = {
  areaId: 'content',
  sortOrder: 3
};
