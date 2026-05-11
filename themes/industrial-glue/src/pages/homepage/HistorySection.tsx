import React from 'react';
import { useReveal } from '../../hooks/useReveal';

export default function HistorySection() {
  const reveal = useReveal();
  return (
    <section id="nosotros" className="py-32 bg-slate-50 relative overflow-hidden" ref={reveal.ref}>
       <div className="max-w-[1536px] mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center mb-32">
             {/* Left Text */}
             <div className={`${reveal.className}`}>
                <h2 className="text-[#2A4899] font-black text-[10px] mb-6 tracking-[0.4em] uppercase font-sora">Nuestra Historia y Propósito</h2>
                <h3 className="text-6xl md:text-8xl font-black text-[#181B1C] font-sora mb-12 leading-[0.9] uppercase tracking-tighter">
                  UNIENDO EL LEGADO <br/>DE LA <span className="text-[#85C639] italic">INDUSTRIA</span>
                </h3>
                <p className="text-xl md:text-2xl text-[#2A4899]/70 font-inter font-medium leading-relaxed mb-8 max-w-xl">
                   Desde 1969, entendemos que detrás de cada adhesivo hay una familia y una fábrica que compite a nivel global.
                </p>
             </div>
             
             {/* Right Image */}
             <div className={`relative ${reveal.className} reveal-stagger-2 active mt-10 lg:mt-0`}>
                {/* Main rotated image container */}
                <div className="rounded-[3rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.15)] transform rotate-3 hover:rotate-0 transition-transform duration-700 w-full relative z-0">
                   <img src="/images/Uniendo_Legado_Home.png" className="w-full h-auto object-cover" alt="INCAP Mascota Legacy" />
                </div>
                
                {/* Overlapping Badge */}
                <div className="absolute -bottom-8 -left-8 md:-bottom-12 md:-left-12 bg-[#2A4899] text-white p-8 md:p-12 rounded-[2rem] shadow-2xl z-10 w-64 md:w-80 flex flex-col justify-center">
                   <span className="block text-5xl md:text-7xl font-black font-sora mb-1 md:mb-2 leading-none">+56</span>
                   <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] font-sora opacity-90 leading-tight">AÑOS DE MAESTRÍA TÉCNICA</span>
                </div>
          </div>
        </div>

        {/* 3 Value Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
           {[ 
             {t:'INGENIERÍA CON ROSTRO HUMANO', d:'No creemos en catálogos fríos. Creemos en la presencia real en tu planta.'}, 
             {t:'INNOVACIÓN CON RESPONSABILIDAD', d:'Lideramos con fórmulas Libres de Tolueno (LT) para proteger a tus operarios.'}, 
             {t:'COMPROMISO GENERACIONAL', d:'Somos el puente entre la experiencia y la visión de futuro industrial.'} 
           ].map((p,i)=>(
              <div key={i} className={`bg-white p-10 md:p-12 rounded-[2rem] shadow-xl border border-slate-100 hover:border-[#85C639] hover:shadow-2xl transition-all duration-500 group ${reveal.className} reveal-stagger-${i+1} active`}>
                 <div className="text-[#85C639] text-3xl md:text-4xl font-black mb-6 md:mb-8 font-sora tracking-tighter">0{i+1}.</div>
                 <h4 className="text-lg md:text-xl font-black mb-4 font-sora text-[#181B1C] uppercase tracking-tight leading-snug">{p.t}</h4>
                 <p className="text-slate-500 font-inter text-xs md:text-sm leading-relaxed font-medium">{p.d}</p>
              </div>
           ))}
        </div>
      </div>
    </section>
  );
}

export const layout = {
  areaId: 'content',
  sortOrder: 10
};
