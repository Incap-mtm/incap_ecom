import React from 'react';

const WHATSAPP_NUMBER = '5491112345678'; // Cambiar por el número real

export default function Hero() {
  const waMessage = encodeURIComponent('Hola INCAP! Quiero solicitar una auditoría técnica en planta.');

  return (
    <section className="relative bg-[#181B1C] overflow-hidden min-h-[600px] flex items-center">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&q=80&w=2070"
          alt="Producción industrial INCAP"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#181B1C] via-[#181B1C]/80 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="max-w-2xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[#2A4899]/20 border border-[#2A4899]/40 rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 rounded-full bg-[#85C639] animate-pulse" />
            <span className="text-[#85C639] text-sm font-medium tracking-wide">+56 años respaldando la industria colombiana</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight" style={{ fontFamily: 'Sora, sans-serif' }}>
            La química exacta<br />
            <span className="text-[#85C639]">detrás de las marcas</span><br />
            que construyen país.
          </h1>

          <p className="mt-6 text-lg text-slate-300 leading-relaxed max-w-xl">
            Más que adhesivos, somos el respaldo técnico que garantiza la estructura de tus muebles, el confort de tus colchones y la durabilidad de tu calzado.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <a
              href="/catalog"
              className="inline-flex items-center justify-center px-8 py-4 bg-[#2A4899] hover:bg-[#1e3a7a] text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-[#2A4899]/30"
            >
              Explorar Soluciones por Industria
            </a>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${waMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white/30 hover:border-white text-white font-semibold rounded-lg transition-all duration-300 backdrop-blur-sm"
            >
              Solicitar Auditoría Técnica en Planta
            </a>
          </div>
        </div>
      </div>

      {/* Decorative accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#2A4899] via-[#85C639] to-[#2A4899]" />
    </section>
  );
}

export const layout = {
  areaId: 'content',
  sortOrder: 1
};
