import React, { useState, useEffect, useRef } from 'react';

// --- Custom Hooks ---
const useReveal = () => {
  const [active, setActive] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return { ref, className: `reveal ${active ? 'active' : ''}` };
};

// --- Assets & Icons ---
const Logo = ({ color = "#FFFFFF" }) => (
  <svg viewBox="0 0 231.9 68.2" className="h-8 w-auto transition-transform hover:scale-105 duration-300">
    <path fill={color} d="M69.8,40.6v-40H51.2V21h-0.5L41.9,0.6H23.6c-1.8,0-3.3,1.5-3.3,3.3v40h18.5V23.5h0.5l8.8,20.4h18.4 C68.3,43.9,69.8,42.4,69.8,40.6z"/>
    <path fill={color} d="M0,11.4c0,1.6,1.3,2.9,2.9,2.9H13L0,23.7v17.9c0,1.2,1,2.2,2.2,2.2h16.3V0.6H0V11.4z"/>
    <path fill={color} d="M112,24.9c-1.9-0.1-3.7,0.9-4.6,2.6c-0.5,0.8-1.1,1.5-1.8,2c-1.5,1-3.6,1.5-6.3,1.5c-3,0-5.3-0.7-6.7-2.1 c-1.4-1.4-2.1-3.6-2.1-6.5s0.7-5.1,2.1-6.5s3.7-2.1,6.7-2.1c2.6,0,4.5,0.5,5.9,1.5c0.7,0.5,1.2,1.2,1.7,2c1,1.7,2.9,2.7,4.8,2.5 l14-1c-0.2-6.3-2.4-11-6.8-14.1C114.6,1.5,108,0,99.1,0c-9.4,0-16.3,1.8-20.6,5.4v0c-4.4,3.6-6.5,9.2-6.5,16.9s2.2,13.3,6.6,16.9 c4.4,3.6,11.3,5.4,20.8,5.4c8.9,0,15.6-1.5,20.1-4.6c4.5-3.1,6.8-7.8,6.9-14.1L112,24.9z"/>
    <path fill={color} d="M159.3,43.9h20.4L166.5,3.8c-0.6-1.9-2.4-3.1-4.3-3.1h-24.5l-14.2,43.3h20.4l1.5-6.2h12.5L159.3,43.9z M148.1,26.6l3.3-13.6h0.5l3.3,13.6H148.1z"/>
    <path fill={color} d="M228.4,6.2c-2.4-2.5-5.2-4.1-8.6-4.7c-3.4-0.6-7.8-0.9-13.4-0.9h-24.6h0v43.3h14.7c2.1,0,3.8-1.7,3.8-3.8v-4.8 h6.1c5.6,0,10.1-0.3,13.5-0.8c3.4-0.5,6.2-2.1,8.5-4.6c2.3-2.5,3.5-6.4,3.5-11.8C231.9,12.7,230.8,8.7,228.4,6.2z M211.9,21.9 c-1,0.6-2.8,0.9-5.5,0.9v0h-6.1v-8.7h6.1c2.7,0,4.5,0.3,5.5,0.9c1,0.6,1.5,1.8,1.5,3.4C213.4,20.2,212.9,21.3,211.9,21.9z"/>
  </svg>
);

// --- Data ---
const INDUSTRIES_DATA = {
  madera: {
    id: 'madera',
    name: 'Madera y Muebles',
    heroImage: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=2070',
    description: 'Soluciones adhesivas de alta ingeniería para la industria del mueble. De la ebanistería fina a la producción en serie.',
    applications: [
      { title: 'Ensamble Estructural', desc: 'Adhesivos PVA de alta resistencia para uniones madera-madera indestructibles.' },
      { title: 'Laminado Decorativo', desc: 'Sistemas de contacto para el pegue de láminas de alta presión y fórmicas.' },
      { title: 'Postformado Industrial', desc: 'Tecnología de aspersión para curvas perfectas.' }
    ],
    products: [
      { id: 'pva-8000', name: 'PVA Industrial 8000', cat: 'Base Agua', feature: 'Secado Rápido', description: 'El adhesivo PVA más confiable para el sector maderero. Ideal para ensambles que requieren alta resistencia mecánica.', specs: ['Viscosidad: 4000-6000 cPs', 'Sólidos: 48%', 'Tiempo abierto: 15 min'], image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600' },
      { id: 'madefort', name: 'Madefort Contacto', cat: 'Solvente', feature: 'Alto Tack', description: 'Pegamento de contacto diseñado para carpintería de alta calidad y láminas decorativas.', specs: ['Resistencia al calor: 70°C', 'Aplicación: Brocha/Espátula', 'Color: Ámbar'], image: 'https://images.unsplash.com/photo-1544006659-f0b21f04cb1d?auto=format&fit=crop&q=80&w=600' },
      { id: 'incaspray-m', name: 'Incaspray Madera', cat: 'Aspersión', feature: 'Gran Cobertura', description: 'Sistema de aspersión de alto rendimiento que reduce el consumo de adhesivo en un 30%.', specs: ['Consumo: 150g/m2', 'Secado: 2-3 min', 'No inflamable'], image: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=600' }
    ]
  },
  colchones: {
    id: 'colchones',
    name: 'Colchones y Espumas',
    heroImage: 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&q=80&w=2070',
    description: 'Ingeniería para el descanso. Adhesivos que optimizan tu línea de producción y protegen la salud de tu equipo.',
    applications: [
      { title: 'Pegue de Espumas', desc: 'Adhesivos de alta adherencia inicial para unión de bloques.' },
      { title: 'Cierre de Colchoneta', desc: 'Sistemas que permiten el cierre inmediato.' },
      { title: 'Laminado de Capas', desc: 'Distribución uniforme para evitar bultos.' }
    ],
    products: [
      { id: 'incafom-lt', name: 'Incafom LT', cat: 'Libre Tolueno', feature: 'No Tóxico', description: 'Adhesivo amigable con el operario. Elimina riesgos por inhalación de solventes.', specs: ['Libre de Tolueno: Sí', 'Color: Rojo', 'Tack inicial: Inmediato'], image: 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&q=80&w=600' },
      { id: 'incafom-wb', name: 'Incafom WaterBase', cat: 'Base Agua', feature: 'Eco-Friendly', description: 'La evolución del pegue de espumas. 100% libre de VOCs.', specs: ['Ecológico: Sí', 'Base: Acrílica', 'Resistencia: Alta'], image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600' },
      { id: 'incaspray-e', name: 'Incaspray Espumas', cat: 'Aspersión', feature: 'Secado Instantáneo', description: 'Diseñado para líneas de producción continuas.', specs: ['Aplicación: Pistola', 'Presión: 30 PSI', 'Cobertura: Máxima'], image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=600' }
    ]
  },
  calzado: {
    id: 'calzado',
    name: 'Calzado y Marroquinería',
    heroImage: 'https://images.unsplash.com/photo-1544006659-f0b21f04cb1d?auto=format&fit=crop&q=80&w=2070',
    description: 'El estándar de las grandes fábricas. Un ecosistema completo para reducir garantías.',
    applications: [
      { title: 'Pegado de Suelas', desc: 'Sistemas de poliuretano y caucho.' },
      { title: 'Montado de Puntas', desc: 'Termoplásticos Tecnogi.' },
      { title: 'Aparado de Capellada', desc: 'Adhesivos de alta precisión.' }
    ],
    products: [
      { id: 'jab-3000', name: 'JAB 3000', cat: 'Poliuretano', feature: 'Súper Fuerte', description: 'El líder indiscutible en el pegado de suelas.', specs: ['Activación Térmica: 70°C', 'Fuerza: >5kg/cm', 'Color: Cristal'], image: 'https://images.unsplash.com/photo-1544006659-f0b21f04cb1d?auto=format&fit=crop&q=80&w=600' },
      { id: 'kenda', name: 'Kenda Farben Especial', cat: 'Químico Italiano', feature: 'Premium', description: 'Soluciones italianas para el acabado de cueros.', specs: ['Importado: Italia', 'Uso: Cueros Grasos', 'Brillo: Natural'], image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=600' },
      { id: 'tecnogi', name: 'Tecnogi Reinforcements', cat: 'Termoplástico', feature: 'Memoria de Forma', description: 'Topes y contrafuertes con la mejor memoria.', specs: ['Espesor: 1.0 mm', 'Adherencia: Térmica', 'Origen: Italia'], image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600' }
    ]
  }
};

// --- Components ---

const Header = ({ setPage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'glass-header py-3 shadow-xl' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-12">
            <button onClick={() => { setPage('home'); window.scrollTo(0,0); }} className="hover:opacity-80 transition-opacity">
              <Logo />
            </button>
            <nav className="hidden lg:flex space-x-10 items-center">
              <div className="relative group" onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
                <button className="text-white hover:text-incap-green transition-colors text-sm font-bold uppercase tracking-widest font-sora flex items-center gap-2">
                  Industrias
                  <svg className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
                <div className={`absolute top-full left-0 mt-0 w-64 bg-white rounded-b-2xl shadow-2xl overflow-hidden transition-all duration-300 border border-slate-100 ${isOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-4'}`}>
                  {Object.values(INDUSTRIES_DATA).map(ind => (
                    <button key={ind.id} onClick={() => { setPage(ind.id); setIsOpen(false); window.scrollTo(0,0); }} className="w-full text-left px-8 py-5 hover:bg-slate-50 text-incap-black font-bold text-xs border-b border-slate-50 last:border-0 hover:text-incap-blue transition-all flex items-center justify-between group">
                      {ind.name.toUpperCase()} <span className="text-slate-300 group-hover:translate-x-1 transition-transform">→</span>
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={() => { setPage('home'); setTimeout(() => document.getElementById('historia')?.scrollIntoView({behavior:'smooth'}), 100); }} className="text-white hover:text-incap-green transition-colors text-sm font-bold uppercase tracking-widest font-sora">Nosotros</button>
              <a href="#" className="text-white hover:text-incap-green transition-colors text-sm font-bold uppercase tracking-widest font-sora">Catálogo</a>
              <a href="#" className="text-white hover:text-incap-green transition-colors text-sm font-bold uppercase tracking-widest font-sora">Capacitación</a>
            </nav>
          </div>
          <button className="bg-incap-green text-incap-black px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest hover:bg-white hover:scale-105 transition-all duration-300 shadow-lg glow-on-hover">
            Cotizar Proyecto
          </button>
        </div>
      </div>
    </header>
  );
};

const ProductModal = ({ product, onClose }) => {
  if (!product) return null;
  const whatsappLink = `https://wa.me/573123786868?text=Hola,%20estoy%20interesado%20en%20el%20producto%20${encodeURIComponent(product.name)}`;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-incap-black/90 backdrop-blur-md animate-fadeIn" onClick={onClose}></div>
      <div className="bg-white w-full max-w-5xl rounded-[2.5rem] overflow-hidden shadow-2xl relative z-10 flex flex-col md:flex-row animate-scaleIn">
        <button onClick={onClose} className="absolute top-8 right-8 z-20 bg-white/50 backdrop-blur-xl p-3 rounded-full hover:bg-incap-blue hover:text-white transition-all duration-300">
           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
        <div className="md:w-1/2 relative h-96 md:h-auto bg-slate-100 overflow-hidden">
           <img src={product.image} className="w-full h-full object-cover" alt={product.name} />
           <div className="absolute top-10 left-10"><span className="bg-incap-green text-incap-black px-5 py-2 rounded-full font-black text-[10px] uppercase tracking-[0.2em]">{product.cat}</span></div>
        </div>
        <div className="md:w-1/2 p-10 md:p-16 flex flex-col justify-between overflow-y-auto max-h-[90vh]">
           <div className="reveal active">
              <h2 className="text-4xl md:text-5xl font-black font-sora text-incap-black mb-6 uppercase tracking-tighter leading-[0.9]">{product.name}</h2>
              <div className="text-incap-blue font-black text-xs mb-10 uppercase tracking-[0.3em] flex items-center gap-4"><span className="w-12 h-1 bg-incap-blue"></span> {product.feature}</div>
              <p className="text-slate-500 text-lg font-inter leading-relaxed mb-12">{product.description}</p>
              <div className="space-y-8 mb-12">
                 <h4 className="font-black text-incap-black uppercase tracking-[0.2em] text-[10px]">Especificaciones Técnicas</h4>
                 <ul className="grid grid-cols-1 gap-4">
                    {product.specs.map((spec, i) => (
                      <li key={i} className="flex items-center gap-4 text-slate-600 font-bold text-sm uppercase tracking-wide">
                         <div className="w-6 h-6 rounded-full bg-incap-green/10 flex items-center justify-center"><svg className="w-3 h-3 text-incap-green" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"></path></svg></div>
                         {spec}
                      </li>
                    ))}
                 </ul>
              </div>
           </div>
           <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="w-full py-7 bg-incap-blue text-white rounded-2xl font-black text-xl hover:bg-incap-black transition-all flex items-center justify-center gap-4 group shadow-xl shadow-incap-blue/20">
              <svg className="w-8 h-8 group-hover:rotate-12 transition-transform" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.232 3.483 8.413-.003 6.557-5.338 11.892-11.893 11.892-1.997-.001-3.951-.5-5.688-1.448l-6.308 1.654zm6.249-1.916c1.472.873 2.915 1.332 4.416 1.333 5.335 0 9.68-4.343 9.682-9.678.001-2.586-1.007-5.016-2.841-6.852-1.834-1.835-4.261-2.844-6.848-2.845-5.336 0-9.681 4.345-9.684 9.681-.001 1.705.443 3.371 1.285 4.83l-1.077 3.928 4.067-1.067zm12.332-11.968c-.274-.137-1.62-.8-1.87-.891-.251-.09-.433-.137-.617.137-.183.274-.71.891-.869 1.073-.159.183-.319.206-.593.069-.274-.137-1.155-.426-2.201-1.359-.813-.726-1.363-1.622-1.523-1.896-.159-.274-.017-.422.12-.559.123-.123.274-.32.411-.479.137-.16.183-.274.274-.457.092-.183.046-.343-.023-.479-.069-.137-.617-1.486-.845-2.035-.221-.532-.444-.459-.617-.468-.159-.009-.342-.01-.525-.01s-.479.069-.731.343c-.251.274-.959.937-.959 2.285 0 1.348.982 2.651 1.12 2.834.137.183 1.932 2.951 4.679 4.141.654.283 1.164.453 1.562.58.657.208 1.255.179 1.728.108.528-.079 1.62-.663 1.848-1.303.228-.64.228-1.188.159-1.303-.069-.115-.251-.183-.525-.32z"/></svg>
              COTIZAR POR WHATSAPP
           </a>
        </div>
      </div>
    </div>
  );
};

// --- Technical Advisor (Smart Search) Component ---

const TechnicalAdvisor = ({ onProductClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Simulated AI Logic for matching uses to products
  const searchProducts = (q) => {
    setIsSearching(true);
    const searchTerms = q.toLowerCase();
    
    // Flat list of all products from INDUSTRIES_DATA for searching
    const allProducts = Object.values(INDUSTRIES_DATA).flatMap(ind => 
      ind.products.map(p => ({ ...p, industry: ind.name }))
    );

    setTimeout(() => {
      const filtered = allProducts.filter(p => {
        const textToSearch = `${p.name} ${p.description} ${p.cat} ${p.feature} ${p.industry} ${p.specs.join(' ')}`.toLowerCase();
        
        // Intelligent mapping (Keywords that trigger certain products)
        const logic = [
          { keywords: ['calor', 'temperatura', 'sol', 'fuego'], match: 'jab-3000' },
          { keywords: ['tóxico', 'olor', 'seguridad', 'operario', 'salud'], match: 'incafom-lt' },
          { keywords: ['ecológico', 'agua', 'medio ambiente'], match: 'incafom-wb' },
          { keywords: ['rápido', 'producción', 'serie'], match: 'pva-8000' },
          { keywords: ['fuerte', 'extremo', 'irrompible'], match: 'jab-3000' },
          { keywords: ['italiano', 'premium', 'lujo'], match: 'kenda' }
        ];

        let isMatch = textToSearch.includes(searchTerms);
        
        logic.forEach(l => {
          if (l.keywords.some(k => searchTerms.includes(k)) && p.id === l.match) {
            isMatch = true;
          }
        });

        return isMatch;
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
    <div className="fixed bottom-10 right-10 z-[80] font-sora">
      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl group ${isOpen ? 'bg-incap-black rotate-90' : 'bg-incap-blue hover:scale-110'}`}
      >
        {isOpen ? (
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        ) : (
          <div className="relative">
            <div className="absolute inset-0 bg-incap-green rounded-full animate-ping opacity-20"></div>
            <svg className="w-10 h-10 text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
          </div>
        )}
      </button>

      {/* Advisor Window */}
      <div className={`absolute bottom-24 right-0 w-[450px] bg-white rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] border border-slate-100 transition-all duration-500 transform origin-bottom-right ${isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-0 opacity-0 translate-y-10'}`}>
        <div className="p-8 bg-incap-black rounded-t-[2.5rem] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-incap-blue/20 blur-3xl rounded-full"></div>
          <h3 className="text-white text-2xl font-black uppercase tracking-tighter mb-2 relative z-10">Asesor Técnico IA</h3>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest relative z-10">Incap Intelligent Solutions</p>
        </div>
        
        <div className="p-10">
          <p className="text-incap-black font-bold text-lg mb-6 leading-tight">¿Qué reto técnico tienes hoy?</p>
          <div className="relative mb-10">
            <textarea 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ej: Necesito pegar caucho con madera en un ambiente de mucho calor..."
              className="w-full h-32 bg-slate-50 border-2 border-slate-100 rounded-2xl p-6 text-incap-black font-medium focus:border-incap-blue focus:outline-none transition-all resize-none placeholder:text-slate-300"
            />
            {isSearching && (
              <div className="absolute bottom-4 right-4 flex gap-1">
                <div className="w-2 h-2 bg-incap-blue rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-incap-blue rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-incap-blue rounded-full animate-bounce delay-200"></div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {results.length > 0 ? (
              <>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Soluciones Recomendadas</p>
                {results.map(prod => (
                  <button 
                    key={prod.id}
                    onClick={() => { onProductClick(prod); setIsOpen(false); }}
                    className="w-full flex items-center gap-6 p-4 rounded-2xl hover:bg-slate-50 transition-all group text-left border border-transparent hover:border-slate-100"
                  >
                    <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                      <img src={prod.image} className="w-full h-full object-cover" alt="" />
                    </div>
                    <div>
                      <h4 className="font-black text-incap-black uppercase text-sm group-hover:text-incap-blue transition-colors">{prod.name}</h4>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{prod.cat}</p>
                    </div>
                    <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg className="w-5 h-5 text-incap-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
                    </div>
                  </button>
                ))}
              </>
            ) : query.length > 3 && !isSearching ? (
              <div className="text-center py-10">
                <p className="text-slate-400 font-medium italic">No encontré una coincidencia exacta, intenta describiendo los materiales...</p>
              </div>
            ) : null}
          </div>
        </div>
        
        <div className="p-8 border-t border-slate-50 text-center">
          <button className="text-incap-blue font-black text-xs uppercase tracking-widest hover:text-incap-black transition-colors">Ver todos los productos →</button>
        </div>
      </div>
    </div>
  );
};

// --- Home Components ---

const HeroHome = ({ setPage }) => {
  const [active, setActive] = useState(false);
  useEffect(() => { setTimeout(() => setActive(true), 100); }, []);

  return (
    <div className={`relative bg-incap-black min-h-screen flex items-center overflow-hidden ${active ? 'hero-active' : ''}`}>
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=2070" className="w-full h-full object-cover opacity-30 bg-zoom" alt="Hero" />
        <div className="absolute inset-0 bg-gradient-to-r from-incap-black via-incap-black/60 to-transparent"></div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full pt-20">
        <div className={`max-w-4xl transition-all duration-1000 transform ${active ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'}`}>
          <div className="inline-block bg-white/5 backdrop-blur-xl border border-white/10 px-6 py-2 rounded-full mb-8">
             <span className="text-incap-green font-black text-[10px] uppercase tracking-[0.4em]">ARQUETIPO: HÉROE Y CREADOR</span>
          </div>
          <h1 className="text-6xl md:text-9xl font-black text-white leading-[0.9] mb-10 font-sora tracking-tighter uppercase">
            LA QUÍMICA QUE <br/> <span className="text-incap-green italic">CONSTRUYE PAÍS</span>
          </h1>
          <p className="text-xl md:text-3xl text-slate-400 mb-12 max-w-2xl font-inter font-light leading-relaxed">
            Más que adhesivos, somos el respaldo técnico que garantiza la estructura de la industria nacional.
          </p>
          <div className="flex flex-wrap gap-8">
            <button onClick={() => { setPage('madera'); window.scrollTo(0,0); }} className="bg-incap-blue text-white px-12 py-6 rounded-sm font-black text-xl hover:bg-white hover:text-incap-blue transition-all duration-500 shadow-2xl shadow-incap-blue/30 group uppercase tracking-tighter font-sora">
              Explorar Soluciones <span className="inline-block ml-3 group-hover:translate-x-2 transition-transform">→</span>
            </button>
            <button className="border-2 border-white/20 text-white px-12 py-6 rounded-sm font-black text-xl hover:bg-white hover:text-incap-black transition-all duration-500 backdrop-blur-sm uppercase tracking-tighter font-sora">
              Auditoría en Planta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const IndustrySectionHome = ({ setPage }) => {
  const reveal = useReveal();
  const industries = [
    { id: 'madera', name: 'Madera y Muebles', text: 'Ensamble estructural y laminado fino con tecnología PVA de alta ingeniería.', image: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=2070' },
    { id: 'colchones', name: 'Colchones y Espumas', text: 'Adhesivos libres de tolueno diseñados para el confort y la salud de tu equipo.', image: 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&q=80&w=2070' },
    { id: 'calzado', name: 'Calzado y Marroquinería', text: 'Sistemas completos de pegado para las fábricas más exigentes del país.', image: 'https://images.unsplash.com/photo-1544006659-f0b21f04cb1d?auto=format&fit=crop&q=80&w=2070' },
  ];

  return (
    <section id="industrias" className="py-40 bg-white relative overflow-hidden" ref={reveal.ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className={`flex flex-col md:flex-row justify-between items-end mb-24 gap-10 ${reveal.className}`}>
          <div className="max-w-2xl">
            <h2 className="text-6xl md:text-8xl font-black text-incap-black font-sora mb-8 leading-none uppercase tracking-tighter">Industrias que <br/><span className="text-incap-blue">Impulsamos</span></h2>
            <div className="w-40 h-3 bg-incap-green"></div>
          </div>
          <a href="#" className="text-incap-blue font-black text-xl hover:text-incap-green transition-colors font-sora flex items-center gap-4 group">
            VER TODO EL PORTAFOLIO <span className="group-hover:translate-x-2 transition-transform">→</span>
          </a>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {industries.map((ind, idx) => (
            <div key={idx} className={`group relative bg-white rounded-[2rem] overflow-hidden shadow-2xl hover:shadow-[0_40px_80px_-15px_rgba(42,72,153,0.15)] transition-all duration-700 border border-slate-100 flex flex-col hover-lift ${reveal.className} reveal-stagger-${idx+1}`}>
              <div className="relative h-96 overflow-hidden">
                <img src={ind.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={ind.name} />
                <div className="absolute inset-0 bg-gradient-to-t from-incap-black/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-8 left-8">
                   <h3 className="text-4xl font-black text-white font-sora uppercase leading-none tracking-tighter">{ind.name}</h3>
                </div>
              </div>
              <div className="p-10 flex-grow flex flex-col justify-between">
                <p className="text-slate-500 font-inter leading-relaxed mb-10 text-xl font-medium">{ind.text}</p>
                <button onClick={() => { setPage(ind.id); window.scrollTo(0,0); }} className="w-full py-6 rounded-2xl border-2 border-incap-blue text-incap-blue font-black text-sm uppercase tracking-[0.2em] hover:bg-incap-blue hover:text-white transition-all duration-500 font-sora">Ver Soluciones Especializadas</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const HistorySection = () => {
  const reveal = useReveal();
  return (
    <section id="historia" className="py-40 bg-slate-50 relative overflow-hidden" ref={reveal.ref}>
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center mb-40">
             <div className={`${reveal.className}`}>
                <h2 className="text-incap-blue font-black text-sm mb-6 tracking-[0.4em] uppercase font-sora">Nuestra Historia y Propósito</h2>
                <h3 className="text-6xl md:text-8xl font-black text-incap-black font-sora mb-12 leading-[0.9] uppercase tracking-tighter">Uniendo el legado <br/>de la <span className="text-incap-green italic">industria</span></h3>
                <p className="text-2xl text-slate-500 font-inter font-light leading-relaxed mb-8">
                   Desde 1969, entendemos que detrás de cada adhesivo hay una familia y una fábrica que compite a nivel global.
                </p>
             </div>
             <div className={`relative ${reveal.className} reveal-stagger-2`}>
                <div className="aspect-w-4 aspect-h-5 rounded-[3rem] overflow-hidden shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-700">
                   <img src="https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=2070" className="w-full h-full object-cover" alt="Legacy" />
                </div>
                <div className="absolute -bottom-16 -left-16 bg-incap-blue text-white p-14 rounded-3xl shadow-2xl hidden md:block animate-pulse">
                   <span className="block text-7xl font-black font-sora mb-2">+56</span>
                   <span className="text-xs font-black uppercase tracking-[0.3em] font-sora opacity-80">Años de Maestría Técnica</span>
                </div>
             </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
             {[ {t:'Ingeniería con Rostro Humano', d:'No creemos en catálogos fríos. Creemos en la presencia real en tu planta.'}, {t:'Innovación con Responsabilidad', d:'Lideramos con fórmulas Libres de Tolueno (LT) para proteger a tus operarios.'}, {t:'Compromiso Generacional', d:'Somos el puente entre la experiencia y la visión de futuro industrial.'} ].map((p,i)=>(
                <div key={i} className={`bg-white p-14 rounded-[2.5rem] shadow-xl border border-slate-50 hover:border-incap-green hover:shadow-2xl transition-all duration-500 group ${reveal.className} reveal-stagger-${i+1}`}>
                   <div className="text-incap-green text-4xl font-black mb-10 group-hover:scale-110 transition-transform">0{i+1}.</div>
                   <h4 className="text-2xl font-black mb-6 font-sora text-incap-black uppercase tracking-tight">{p.t}</h4>
                   <p className="text-slate-400 font-inter text-lg leading-relaxed font-medium">{p.d}</p>
                </div>
             ))}
          </div>
       </div>
    </section>
  );
};

const AuthoritySection = () => {
  const logos = ['/logos/Logo Kenda Farben.svg', '/logos/Logo CT Point.svg', '/logos/Logo Intercom.svg', '/logos/Logo Tecno GI.svg', '/logos/TECNOGI.png', '/logos/Kenda Farben.png'];
  return (
    <section className="py-32 bg-white border-y border-slate-100 overflow-hidden">
       <div className="max-w-7xl mx-auto px-4 text-center mb-16">
          <h3 className="text-xs font-black text-slate-300 uppercase tracking-[0.5em]">Líderes que confían en nuestra química</h3>
       </div>
       <div className="relative group">
          <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-white to-transparent z-10"></div>
          <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-white to-transparent z-10"></div>
          <div className="flex gap-24 animate-infiniteScroll whitespace-nowrap items-center py-10 grayscale hover:grayscale-0 transition-all duration-1000 opacity-30 hover:opacity-100">
             {[...logos, ...logos, ...logos].map((logo, i) => (
               <img key={i} src={logo} className="h-20 w-auto object-contain flex-shrink-0 mx-10 transition-transform hover:scale-110" alt="Aliado" />
             ))}
          </div>
       </div>
    </section>
  );
};

const WhyIncap = () => {
  const reveal = useReveal();
  return (
    <section className="py-40 bg-incap-black text-white relative overflow-hidden" ref={reveal.ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
         <h2 className={`text-6xl md:text-9xl font-black font-sora mb-24 uppercase tracking-tighter ${reveal.className}`}>Por qué <span className="text-incap-green italic underline decoration-8 underline-offset-[20px]">INCAP</span>?</h2>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-24">
            {[ {t:'Asesoría en Campo', d:'Nuestros técnicos no solo entregan canecas, optimizan tus procesos in-situ.'}, {t:'Innovación Segura', d:'Desarrollamos adhesivos de alto rendimiento para reducir el riesgo laboral.'}, {t:'Red Nacional', d:'Distribución estratégica para que tu línea de producción nunca se detenga.'} ].map((w,i)=>(
               <div key={i} className={`flex flex-col items-center text-center group ${reveal.className} reveal-stagger-${i+1}`}>
                  <div className="w-24 h-24 bg-white/5 border border-white/10 rounded-[2rem] flex items-center justify-center mb-10 group-hover:bg-incap-green group-hover:rotate-12 transition-all duration-700">
                     <svg className="w-12 h-12 text-incap-green group-hover:text-incap-black transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  </div>
                  <h3 className="text-3xl font-black mb-6 font-sora uppercase tracking-tight">{w.t}</h3>
                  <p className="text-slate-400 font-inter text-xl leading-relaxed font-light">{w.d}</p>
               </div>
            ))}
         </div>
      </div>
    </section>
  );
};

const ConversionFooter = () => (
  <section className="bg-incap-blue py-40 text-white relative overflow-hidden">
     <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
     <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
        <h2 className="text-5xl md:text-8xl font-black font-sora mb-12 uppercase tracking-tighter leading-none">Fallas de Pegue?</h2>
        <p className="text-2xl text-blue-100/70 mb-16 font-inter font-light max-w-3xl mx-auto leading-relaxed">
           Recibe un diagnóstico técnico gratuito en menos de 24 horas. Protege la calidad de tu producto final.
        </p>
        <a href="https://wa.me/573123786868" className="inline-flex bg-incap-green text-incap-black px-16 py-8 rounded-full font-black text-2xl hover:bg-white hover:scale-110 transition-all duration-500 shadow-[0_20px_50px_-10px_rgba(133,198,57,0.5)] items-center gap-6 uppercase tracking-tighter glow-on-hover">
           HABLAR CON UN EXPERTO
        </a>
     </div>
  </section>
);

// --- Industry Detail Page ---

const IndustryPage = ({ data, onProductClick }) => (
  <div className="min-h-screen animate-fadeIn bg-white">
    <div className="relative h-[70vh] flex items-center overflow-hidden bg-incap-black">
      <img src={data.heroImage} className="absolute inset-0 w-full h-full object-cover opacity-40 scale-105" alt={data.name} />
      <div className="absolute inset-0 bg-gradient-to-t from-incap-black via-incap-black/40 to-transparent"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <span className="text-incap-green font-black uppercase tracking-[0.5em] text-xs mb-6 block font-sora">Sistemas de Adherencia</span>
        <h1 className="text-7xl md:text-9xl font-black text-white font-sora mb-8 leading-none uppercase tracking-tighter">{data.name}</h1>
        <p className="text-3xl text-slate-300 max-w-4xl font-inter font-light leading-relaxed">{data.description}</p>
      </div>
    </div>
    <section className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-24">
        <div className="lg:col-span-1">
           <h2 className="text-5xl font-black text-incap-black font-sora mb-8 uppercase tracking-tighter leading-none">Aplicaciones <br/>de Planta</h2>
           <div className="w-24 h-2 bg-incap-blue mb-10"></div>
        </div>
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-10">
          {data.applications.map((app, i) => (
            <div key={i} className="p-12 bg-slate-50 rounded-[2.5rem] hover:bg-incap-blue hover:text-white transition-all duration-500 group hover-lift">
              <h3 className="text-3xl font-black mb-6 font-sora uppercase tracking-tight">{app.title}</h3>
              <p className="font-inter text-xl group-hover:text-white/80 transition-colors font-medium">{app.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
    <section className="py-32 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         <h2 className="text-6xl font-black text-incap-black font-sora mb-24 uppercase text-center tracking-tighter">Portafolio Técnico</h2>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {data.products.map((prod) => (
              <div key={prod.id} onClick={() => onProductClick(prod)} className="bg-white p-0 rounded-[2.5rem] shadow-xl border border-slate-100 hover:shadow-2xl transition-all cursor-pointer group overflow-hidden hover-lift">
                <div className="h-80 overflow-hidden"><img src={prod.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={prod.name} /></div>
                <div className="p-12">
                  <span className="text-incap-blue font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">{prod.cat}</span>
                  <h3 className="text-3xl font-black mb-6 font-sora text-incap-black group-hover:text-incap-blue transition-colors uppercase tracking-tight leading-none">{prod.name}</h3>
                  <div className="inline-block px-4 py-2 bg-slate-50 rounded-lg text-[10px] font-black text-slate-400 mb-10 uppercase tracking-[0.3em]">{prod.feature}</div>
                  <div className="flex items-center justify-between">
                     <span className="text-incap-blue font-black font-sora text-sm uppercase tracking-widest">Detalles</span>
                     <div className="w-14 h-14 rounded-full border-2 border-slate-100 flex items-center justify-center group-hover:bg-incap-blue group-hover:text-white transition-all duration-500">→</div>
                  </div>
                </div>
              </div>
            ))}
         </div>
      </div>
    </section>
    <ConversionFooter />
  </div>
);

// --- Main App Controller ---

export default function App() {
  const [page, setPage] = useState('home'); 
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash && page === 'home') {
      const el = document.querySelector(hash);
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [page]);

  return (
    <div className="min-h-screen bg-white selection:bg-incap-green selection:text-incap-black">
      <Header setPage={setPage} />
      {page === 'home' ? (
        <main>
          <HeroHome setPage={setPage} />
          <AuthoritySection />
          <IndustrySectionHome setPage={setPage} />
          <HistorySection />
          <WhyIncap />
          <ConversionFooter />
        </main>
      ) : (
        <main>
          <IndustryPage data={INDUSTRIES_DATA[page]} onProductClick={setSelectedProduct} />
        </main>
      )}
      {selectedProduct && <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
      <TechnicalAdvisor onProductClick={setSelectedProduct} />
      <footer className="bg-incap-black py-24 text-slate-600 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-10">
          <Logo color="#444" />
          <p className="text-[10px] uppercase tracking-[0.5em] font-black">© 2026 INCAP S.A. | CALIDAD QUE SE REPITE</p>
        </div>
      </footer>
    </div>
  );
}
