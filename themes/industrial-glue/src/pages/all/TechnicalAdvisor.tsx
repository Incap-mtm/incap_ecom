import React, { useState, useEffect, useRef } from 'react';

// Knowledge base for the Simulated AI
const KNOWLEDGE_BASE = [
  {
    id: 'pva-8000',
    name: 'PVA Industrial 8000',
    cat: 'Base Agua',
    feature: 'Secado Rápido',
    description: 'El adhesivo PVA más confiable para el sector maderero. Ideal para ensambles que requieren alta resistencia mecánica.',
    specs: ['Viscosidad: 4000-6000 cPs', 'Sólidos: 48%', 'Tiempo abierto: 15 min'],
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600',
    keywords: ['rápido', 'producción', 'serie', 'madera', 'pva', 'muebles']
  },
  {
    id: 'jab-3000',
    name: 'JAB 3000',
    cat: 'Poliuretano',
    feature: 'Súper Fuerte',
    description: 'El líder indiscutible en el pegado de suelas. Activación térmica y resistencia extrema.',
    specs: ['Activación Térmica: 70°C', 'Fuerza: >5kg/cm', 'Color: Cristal'],
    image: 'https://images.unsplash.com/photo-1544006659-f0b21f04cb1d?auto=format&fit=crop&q=80&w=600',
    keywords: ['calor', 'temperatura', 'sol', 'fuego', 'suela', 'calzado', 'fuerte', 'extremo', 'irrompible']
  },
  {
    id: 'incafom-lt',
    name: 'Incafom LT',
    cat: 'Libre Tolueno',
    feature: 'No Tóxico',
    description: 'Adhesivo amigable con el operario. Elimina riesgos por inhalación de solventes.',
    specs: ['Libre de Tolueno: Sí', 'Color: Rojo', 'Tack inicial: Inmediato'],
    image: 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&q=80&w=600',
    keywords: ['tóxico', 'olor', 'seguridad', 'operario', 'salud', 'colchones', 'espuma', 'respirar']
  },
  {
    id: 'incafom-wb',
    name: 'Incafom WaterBase',
    cat: 'Base Agua',
    feature: 'Eco-Friendly',
    description: 'La evolución del pegue de espumas. 100% libre de VOCs.',
    specs: ['Ecológico: Sí', 'Base: Acrílica', 'Resistencia: Alta'],
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600',
    keywords: ['ecológico', 'agua', 'medio ambiente', 'sustentable', 'verde']
  },
  {
    id: 'kenda',
    name: 'Kenda Farben Especial',
    cat: 'Químico Italiano',
    feature: 'Premium',
    description: 'Soluciones italianas para el acabado de cueros y marroquinería de lujo.',
    specs: ['Importado: Italia', 'Uso: Cueros Grasos', 'Brillo: Natural'],
    image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=600',
    keywords: ['italiano', 'premium', 'lujo', 'cuero', 'marroquinería', 'acabado']
  },
  {
    id: 'hogar-multiusos',
    name: 'Incap Multiusos',
    cat: 'Hogar',
    feature: 'Universal',
    description: 'Adhesivo versátil para reparaciones rápidas y proyectos creativos en casa. Calidad industrial para el hogar.',
    specs: ['Uso: Universal', 'Secado: 10 min', 'Color: Transparente'],
    image: '/images/Banner_Hogar_Multiusos.png',
    keywords: ['hogar', 'casa', 'manualidades', 'reparación', 'hobby', 'multiusos', 'escuela']
  }
];

export default function TechnicalAdvisor() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const searchProducts = (q) => {
    setIsSearching(true);
    const searchTerms = q.toLowerCase();

    setTimeout(() => {
      const filtered = KNOWLEDGE_BASE.filter(p => {
        const textToSearch = `${p.name} ${p.description} ${p.cat} ${p.feature} ${p.keywords.join(' ')}`.toLowerCase();
        return p.keywords.some(k => searchTerms.includes(k)) || textToSearch.includes(searchTerms);
      });

      setResults(filtered.slice(0, 3));
      setIsSearching(false);
    }, 800);
  };

  useEffect(() => {
    if (query.length > 3) {
      searchProducts(query);
    } else {
      setResults([]);
    }
  }, [query]);

  return (
    <div className="fixed bottom-10 right-10 z-[100] font-sora">
      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl group ${isOpen ? 'bg-[#181B1C] rotate-90' : 'bg-[#2A4899] hover:scale-110'}`}
      >
        {isOpen ? (
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <div className="relative">
            <div className="absolute inset-0 bg-[#85C639] rounded-full animate-ping opacity-20"></div>
            <svg className="w-10 h-10 text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
        )}
      </button>

      {/* Advisor Window */}
      <div className={`absolute bottom-24 right-0 w-[90vw] max-w-[450px] bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] border border-slate-100 transition-all duration-500 transform origin-bottom-right ${isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-0 opacity-0 translate-y-10'}`}>
        <div className="p-6 md:p-8 bg-[#181B1C] rounded-t-[2rem] md:rounded-t-[2.5rem] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#2A4899]/20 blur-3xl rounded-full"></div>
          <h3 className="text-white text-xl md:text-2xl font-black uppercase tracking-tighter mb-1 relative z-10">Asesor Técnico IA</h3>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest relative z-10">Incap Intelligent Solutions</p>
        </div>
        
        <div className="p-6 md:p-10">
          <p className="text-[#181B1C] font-bold text-lg mb-6 leading-tight">¿Qué reto técnico tienes hoy?</p>
          <div className="relative mb-8">
            <textarea 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ej: Necesito pegar caucho con madera en un ambiente de mucho calor..."
              className="w-full h-32 bg-slate-50 border-2 border-slate-100 rounded-2xl p-6 text-[#181B1C] font-medium focus:border-[#2A4899] focus:outline-none transition-all resize-none placeholder:text-slate-300 font-inter"
            />
            {isSearching && (
              <div className="absolute bottom-4 right-4 flex gap-1">
                <div className="w-2 h-2 bg-[#2A4899] rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-[#2A4899] rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-[#2A4899] rounded-full animate-bounce delay-200"></div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {results.length > 0 ? (
              <>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Soluciones Recomendadas</p>
                {results.map(prod => (
                  <a 
                    key={prod.id}
                    href="/catalog"
                    className="w-full flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50 transition-all group text-left border border-transparent hover:border-slate-100"
                  >
                    <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
                      <img src={prod.image} className="w-full h-full object-cover" alt="" />
                    </div>
                    <div>
                      <h4 className="font-black text-[#181B1C] uppercase text-xs group-hover:text-[#2A4899] transition-colors">{prod.name}</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{prod.cat}</p>
                    </div>
                    <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg className="w-4 h-4 text-[#2A4899]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </a>
                ))}
              </>
            ) : query.length > 3 && !isSearching ? (
              <div className="text-center py-6">
                <p className="text-slate-400 font-medium italic text-sm">No encontré una coincidencia exacta, intenta describiendo los materiales...</p>
              </div>
            ) : null}
          </div>
        </div>
        
        <div className="p-6 md:p-8 border-t border-slate-50 text-center">
          <a href="/catalog" className="text-[#2A4899] font-black text-xs uppercase tracking-widest hover:text-[#181B1C] transition-colors">
            Ver todos los productos →
          </a>
        </div>
      </div>
    </div>
  );
}

export const layout = {
  areaId: 'content',
  sortOrder: 1000
};
