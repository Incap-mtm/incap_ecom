import React from 'react';
import { useReveal } from '../../hooks/useReveal';

export default function WhyIncap() {
  const reveal = useReveal();
  return (
    <section className="py-32 bg-[#2A4899] text-white relative overflow-hidden" ref={reveal.ref}>
      <div className="max-w-[1536px] mx-auto px-6 sm:px-8 lg:px-12 text-center relative z-10">
         <h2 className={`text-6xl md:text-[10rem] font-black font-sora mb-24 uppercase tracking-tighter leading-none ${reveal.className}`}>
           ¿Por qué <br />
           <span className="text-[#85C639] italic underline decoration-8 underline-offset-[20px]">INCAP</span>?
         </h2>
         
         <div className="grid grid-cols-1 md:grid-cols-3 gap-24 mt-20">
            {[ 
              {
                t:'Asesoría en Campo', 
                d:'Nuestros técnicos no solo entregan producto, optimizan tus procesos in-situ para reducir desperdicios.',
                icon: 'M13 10V3L4 14h7v7l9-11h-7z'
              }, 
              {
                t:'Innovación Segura', 
                d:'Desarrollamos adhesivos de alto rendimiento que protegen la salud de tus colaboradores.',
                icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'
              }, 
              {
                t:'Red Nacional', 
                d:'Distribución estratégica en todo el país para que tu línea de producción nunca se detenga.',
                icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
              } 
            ].map((w,i)=>(
               <div key={i} className={`flex flex-col items-center text-center group ${reveal.className} reveal-stagger-${i+1} active`}>
                  <div className="w-24 h-24 bg-white/5 border border-white/10 rounded-[2rem] flex items-center justify-center mb-10 group-hover:bg-[#85C639] group-hover:rotate-12 transition-all duration-700">
                     <svg className="w-12 h-12 text-[#85C639] group-hover:text-[#181B1C] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={w.icon} />
                     </svg>
                  </div>
                  <h3 className="text-3xl font-black mb-6 font-sora uppercase tracking-tight">{w.t}</h3>
                  <p className="text-slate-400 font-inter text-lg leading-relaxed font-light max-w-sm">{w.d}</p>
               </div>
            ))}
         </div>
      </div>
      
      {/* Subtle background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#2A4899]/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
    </section>
  );
}

export const layout = {
  areaId: 'content',
  sortOrder: 20
};
