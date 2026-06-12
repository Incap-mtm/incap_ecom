import React from 'react';

export default function AuthoritySection() {
  const logos = [
    '/images/logos/Logo_Kenda_Farben.svg',
    '/images/logos/Logo_CT_Point.svg',
    '/images/logos/Logo_Intercom.svg',
    '/images/logos/Logo_Tecno_GI.svg',
    '/images/logos/jab-logo.png',
  ];
  
  return (
    <section className="py-24 bg-white border-y border-slate-100 overflow-hidden">
       <div className="max-w-[1536px] mx-auto px-6 text-center mb-16">
          <h3 className="font-black text-slate-300 uppercase tracking-[0.5em]" style={{ fontSize: '15px' }}>Líderes globales que confían en nuestra química</h3>
       </div>
       <div className="relative group">
          {/* Gradient Scrims for smooth edges */}
          <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-white to-transparent z-10"></div>
          <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-white to-transparent z-10"></div>
          
          <div className="flex animate-marquee whitespace-nowrap items-center py-4 grayscale hover:grayscale-0 transition-all duration-1000 opacity-40 hover:opacity-100">
             {[...logos, ...logos, ...logos, ...logos].map((logo, i) => (
               <img
                key={i}
                src={logo}
                loading="lazy"
                className="h-10 w-auto object-contain flex-shrink-0 transition-transform hover:scale-110"
                style={{ marginRight: '80px' }}
                alt="Partner Logo"
               />
             ))}
          </div>
       </div>
    </section>
  );
}

export const layout = {
  areaId: 'content',
  sortOrder: 15
};
