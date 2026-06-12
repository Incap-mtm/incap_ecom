import React from 'react';

interface ConversionFooterProps {
  setting?: { storeWhatsappNumber?: string };
}

export default function ConversionFooter({ setting }: ConversionFooterProps) {
  const whatsappNumber = setting?.storeWhatsappNumber ?? '573002171521';
  const message = encodeURIComponent('Hola INCAP! Tengo un problema técnico de pegue en mi planta y necesito asesoría.');
  
  return (
    <section className="py-32 bg-[#181B1C] relative overflow-hidden border-t border-white/5">
      <div className="max-w-[1536px] mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Left Side */}
          <div className="text-left">
             <div className="inline-block bg-[#85C639]/10 border border-[#85C639]/20 px-6 py-2 rounded-lg mb-10">
                <span className="text-[#85C639] font-black text-xs uppercase tracking-[0.4em]">Soporte Técnico Especializado</span>
             </div>
             <h2 className="text-5xl md:text-8xl font-black font-sora mb-10 uppercase tracking-tighter leading-[0.9] text-white">
               ¿Fallas de <br/>
               <span className="text-[#85C639]">Pegue?</span>
             </h2>
             <div className="mb-16 max-w-2xl space-y-5">
                <p className="text-2xl md:text-3xl text-white font-sora font-bold leading-tight">
                   Cada unidad defectuosa es una devolución, una queja y una venta perdida.
                </p>
                <p className="text-lg text-slate-400 font-inter font-light leading-relaxed">
                   Cuéntanos tu caso por WhatsApp y en menos de 24 horas un técnico INCAP te dice exactamente qué está pasando, sin costo, sin compromiso.
                </p>
                <p className="text-base text-slate-500 font-inter font-light leading-relaxed">
                   Hemos diagnosticado fallas en más de 200 plantas. El 90% se resuelve ajustando el producto, la temperatura de aplicación o el tiempo abierto. El otro 10% requiere reformulación, y para eso también estamos.
                </p>
             </div>
             <a 
              href={`https://wa.me/${whatsappNumber}?text=${message}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex bg-[#85C639] text-[#181B1C] px-16 py-8 rounded-full font-black text-2xl hover:bg-white hover:scale-110 transition-all duration-500 shadow-[0_20px_50px_-10px_rgba(133,198,57,0.4)] items-center gap-6 uppercase tracking-tighter"
             >
                HABLAR CON UN EXPERTO
             </a>
          </div>
          
          {/* Right Side */}
          <div className="relative group hidden lg:flex justify-center">
             <div className="relative max-w-md w-full">
                <div className="absolute -inset-10 bg-[#2A4899]/20 rounded-[4rem] blur-3xl group-hover:bg-[#2A4899]/30 transition-all duration-700"></div>
                <div className="relative rounded-[3rem] border border-white/10 shadow-2xl shadow-black/50 p-6">
                   <div className="rounded-2xl overflow-hidden">
                     <img
                      src="/images/sections/Fallas_De_Pegue_contacto.webp"
                      className="w-full h-auto object-cover transform scale-90 group-hover:scale-[0.945] transition-transform duration-1000"
                      alt="Técnico INCAP en planta"
                      loading="lazy"
                     />
                     <div className="absolute inset-0 bg-gradient-to-t from-[#181B1C]/60 to-transparent"></div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export const layout = {
  areaId: 'content',
  sortOrder: 25
};

export const query = `query { setting { storeWhatsappNumber } }`;
