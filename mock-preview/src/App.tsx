import React, { useState, useEffect, useRef } from 'react';
import { PRODUCTS } from './products';

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
    heroImage: '/images/Categoria_Maderas_Muebles_Seccion_Home.png',
    icons: ['/images/Icono_Categoria_Madera_Muebles.svg', '/images/Icono_Categoria_Madera_Muebles_2.svg'],
    description: 'Soluciones adhesivas de alta ingeniería para la industria del mueble. De la ebanistería fina a la producción en serie.',
    applications: [
      { title: 'Ensamble Estructural', desc: 'Adhesivos PVA de alta resistencia para uniones madera-madera indestructibles.' },
      { title: 'Laminado Decorativo', desc: 'Sistemas de contacto para el pegue de láminas de alta presión y fórmicas.' },
      { title: 'Postformado Industrial', desc: 'Tecnología de aspersión para curvas perfectas.' }
    ]
  },
  colchones: {
    id: 'colchones',
    name: 'Colchones y Espumas',
    heroImage: '/images/Colchones_Seccion_Home.png',
    icons: ['/images/INCAP_Icono_colchones_Espumas.svg', '/images/INCAP_Icono_colchones_Espumas_2.svg'],
    description: 'Ingeniería para el descanso. Adhesivos que optimizan tu línea de producción y protegen la salud de tu equipo.',
    applications: [
      { title: 'Pegue de Espumas', desc: 'Adhesivos de alta adherencia inicial para unión de bloques.' },
      { title: 'Cierre de Colchoneta', desc: 'Sistemas que permiten el cierre inmediato.' },
      { title: 'Laminado de Capas', desc: 'Distribución uniforme para evitar bultos.' }
    ]
  },
  calzado: {
    id: 'calzado',
    name: 'Calzado y Marroquinería',
    heroImage: '/images/Calzado_Marroquinera_Seccion_Home.png',
    icons: ['/images/INCAP_Icono_Calzado y Marroquinera_2.svg', '/images/INCAP_Icono_Calzado y Marroquinera_2 (1).svg'],
    description: 'El estándar de las grandes fábricas. Un ecosistema completo para reducir garantías.',
    applications: [
      { title: 'Pegado de Suelas', desc: 'Sistemas de poliuretano y caucho.' },
      { title: 'Montado de Puntas', desc: 'Termoplásticos Tecnogi.' },
      { title: 'Aparado de Capellada', desc: 'Adhesivos de alta precisión.' }
    ]
  },
  hogar: {
    id: 'hogar',
    name: 'Hogar y Multiusos',
    heroImage: '/images/Hogar_Multiusos_Seccion_Home.png',
    icons: ['/images/INCAP_Icono_Hogar_Manualidades_y_Multisuos.svg', '/images/INCAP_Icono_Hogar_Manualidades_y_Multisuos_2.svg', '/images/INCAP_Icono_Hogar_Manualidades_y_Multisuos_3.svg'],
    description: 'Soluciones versátiles para el día a día. Reparaciones rápidas y proyectos creativos con calidad industrial.',
    applications: [
      { title: 'Reparaciones del Hogar', desc: 'Pegado de maderas, cerámicas y plásticos.' },
      { title: 'Manualidades y Hobby', desc: 'Adhesivos de precisión para proyectos creativos.' },
      { title: 'Multiusos', desc: 'Fórmulas universales de alta adherencia.' }
    ]
  }
};

// --- Components ---

const Header = ({ setPage, currentPage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isDarkText = !scrolled && (currentPage === 'product-detail' || (currentPage !== 'home' && !INDUSTRIES_DATA[currentPage]?.heroImage));

  return (
    <nav className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-lg py-3' : 'bg-transparent py-6'}`}>
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center cursor-pointer" onClick={() => setPage('home')}>
            <Logo color={scrolled || isDarkText ? "#003057" : "#FFFFFF"} />
          </div>
          
          <div className="hidden md:flex items-center space-x-10">
            {['madera', 'colchones', 'calzado', 'hogar'].map((id) => (
              <button
                key={id}
                onClick={() => setPage(id)}
                className={`text-[11px] font-black uppercase tracking-[0.3em] transition-all hover:text-incap-green ${scrolled || isDarkText ? 'text-incap-blue' : 'text-white'}`}
              >
                {INDUSTRIES_DATA[id].name.split(' ')[0]}
              </button>
            ))}
            <button className={`px-6 py-2 rounded-full border-2 text-[10px] font-black uppercase tracking-widest transition-all hover:bg-incap-green hover:border-incap-green hover:text-incap-black ${scrolled || isDarkText ? 'border-incap-blue text-incap-blue' : 'border-white text-white'}`}>
              Contacto
            </button>
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className={scrolled || isDarkText ? 'text-incap-blue' : 'text-white'}>
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <div className={`md:hidden absolute w-full bg-white shadow-2xl transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
        <div className="px-4 pt-4 pb-8 space-y-4">
          {Object.keys(INDUSTRIES_DATA).map((id) => (
            <button
              key={id}
              onClick={() => { setPage(id); setIsOpen(false); }}
              className="block w-full text-left px-4 py-3 text-incap-blue font-black uppercase tracking-widest border-b border-slate-100"
            >
              {INDUSTRIES_DATA[id].name}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

const TechnicalAdvisor = ({ onProductClick }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (query.length > 2) {
      const filtered = PRODUCTS.filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase()) || 
        p.category.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
      setShowResults(true);
    } else {
      setResults([]);
      setShowResults(false);
    }
  }, [query]);

  return (
    <div className="fixed bottom-10 right-10 z-[60]">
      <div className={`absolute bottom-full right-0 mb-6 w-96 bg-white rounded-3xl shadow-2xl transition-all duration-500 transform ${showResults ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}`}>
        <div className="p-6 border-b border-slate-100 bg-incap-blue rounded-t-3xl shadow-lg">
          <h4 className="text-white font-black uppercase tracking-widest text-sm">Asistente Técnico</h4>
          <p className="text-white/60 text-[10px] mt-1 font-bold uppercase tracking-widest">Encuentra tu solución adhesiva</p>
        </div>
        <div className="max-h-[400px] overflow-y-auto p-4 space-y-3">
          {results.length > 0 ? results.map(p => (
            <div 
              key={p.slug} 
              onClick={() => { onProductClick(p); setShowResults(false); setQuery(''); }}
              className="flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50 cursor-pointer transition-colors border border-transparent hover:border-slate-100"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-100 flex-shrink-0 overflow-hidden">
                <img src={p.image} className="w-full h-full object-cover" />
              </div>
              <div>
                <h5 className="font-black text-incap-blue text-sm uppercase">{p.name}</h5>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{p.category}</p>
              </div>
            </div>
          )) : (
            <p className="text-center py-10 text-slate-400 text-xs font-bold uppercase tracking-widest">No se encontraron resultados</p>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-4 bg-white/90 backdrop-blur-md rounded-full shadow-2xl p-2 border border-slate-100 group">
        <input 
          type="text" 
          placeholder="¿QUÉ NECESITAS PEGAR?" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="bg-transparent border-none focus:ring-0 text-[10px] font-black uppercase tracking-widest w-48 pl-6 placeholder:text-slate-300"
        />
        <button className="w-12 h-12 rounded-full bg-incap-blue text-white flex items-center justify-center hover:bg-incap-green hover:text-incap-black transition-all transform group-hover:rotate-90">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

const HeroHome = ({ setPage }) => {
  const [active, setActive] = useState(false);
  useEffect(() => { setTimeout(() => setActive(true), 100); }, []);

  return (
    <section className={`relative h-screen flex items-center overflow-hidden bg-incap-black ${active ? 'hero-active' : ''}`}>
      <div className="absolute inset-0">
        <img 
          src="/images/Banner_Home_Principal.png" 
          className="w-full h-full object-cover bg-zoom"
          alt="Hero background"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-incap-black via-incap-black/60 to-transparent"></div>
      </div>
      
      <div className="relative max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className={`max-w-3xl transition-all duration-1000 transform ${active ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'}`}>
          <div className="inline-flex items-center space-x-4 mb-8 bg-white/10 backdrop-blur-md px-6 py-2 rounded-full border border-white/20">
            <div className="w-2 h-2 rounded-full bg-incap-green animate-pulse"></div>
            <span className="text-white text-[10px] font-black uppercase tracking-[0.4em]">Soluciones Industriales 2026</span>
          </div>
          <h1 className="text-[clamp(3rem,8vw,6rem)] font-black text-white leading-[0.9] mb-10 font-sora">
            CALIDAD QUE <br />
            <span className="text-incap-green">SE REPITE.</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-14 leading-relaxed font-medium max-w-2xl">
            Líderes en ingeniería de adhesivos. Innovamos para que tu producción nunca se detenga.
          </p>
          <div className="flex flex-col sm:flex-row gap-6">
            <button 
              onClick={() => setPage('madera')}
              className="px-12 py-6 bg-incap-green text-incap-black rounded-2xl font-black uppercase tracking-[0.2em] hover:bg-white transition-all transform hover:-translate-y-1 shadow-2xl text-xs"
            >
              Explorar Catálogo
            </button>
            <button className="px-12 py-6 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-2xl font-black uppercase tracking-[0.2em] hover:bg-white/20 transition-all text-xs">
              Asesoría Técnica
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

const IndustrySectionHome = ({ setPage }) => {
  const { ref, className } = useReveal();
  
  return (
    <section ref={ref} className={`py-32 bg-white ${className}`}>
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-10">
          <div className="max-w-2xl">
            <span className="text-incap-blue/30 text-xs font-black uppercase tracking-[0.5em] block mb-4">INDUSTRIAS</span>
            <h2 className="text-6xl font-black text-incap-blue leading-tight uppercase">Soluciones Especializadas</h2>
          </div>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-sm max-w-sm text-right leading-loose border-r-4 border-incap-green pr-8">
            Diseñamos fórmulas específicas para los retos más exigentes de cada sector.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(INDUSTRIES_DATA).map(([id, data]) => (
            <div 
              key={id}
              onClick={() => setPage(id)}
              className="group relative h-[600px] rounded-[2.5rem] overflow-hidden cursor-pointer transition-all duration-700 hover:scale-[0.98]"
            >
              <img src={data.heroImage} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={data.name} />
              <div className="absolute inset-0 bg-gradient-to-t from-incap-blue via-incap-blue/20 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-100"></div>
              
              <div className="absolute inset-0 p-10 flex flex-col justify-end transform transition-transform duration-500 group-hover:translate-y-[-20px]">
                <div className="flex space-x-2 mb-6">
                  {data.icons.slice(0, 2).map((icon, idx) => (
                    <div key={idx} className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md p-2 flex items-center justify-center">
                      <img src={icon} className="w-full h-full invert brightness-0" alt="icon" />
                    </div>
                  ))}
                </div>
                <h3 className="text-3xl font-black text-white mb-4 leading-none uppercase tracking-tighter">{data.name}</h3>
                <p className="text-white/60 text-sm font-medium line-clamp-2 mb-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                  {data.description}
                </p>
                <div className="w-12 h-12 rounded-full border-2 border-white/30 flex items-center justify-center transition-all duration-500 group-hover:w-full group-hover:bg-incap-green group-hover:border-incap-green">
                  <svg className="w-6 h-6 text-white group-hover:text-incap-black transform group-hover:rotate-[-45deg] transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const HistorySection = () => {
  const { ref, className } = useReveal();
  return (
    <section ref={ref} className={`py-32 bg-slate-50 relative overflow-hidden ${className}`}>
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-20">
          <div className="lg:w-1/2">
            <div className="relative">
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-incap-green/20 rounded-full blur-3xl"></div>
              <img 
                src="/images/Uniendo_Legado_Home.png" 
                className="rounded-[3rem] shadow-2xl relative z-10 w-full"
                alt="Historia Incap"
              />
              <div className="absolute -bottom-8 -right-8 bg-incap-blue p-10 rounded-[2rem] shadow-2xl z-20">
                <div className="text-incap-green text-5xl font-black mb-2">1980</div>
                <div className="text-white text-xs font-black uppercase tracking-widest">FUNDACIÓN</div>
              </div>
            </div>
          </div>
          <div className="lg:w-1/2">
            <span className="text-incap-blue/30 text-xs font-black uppercase tracking-[0.5em] block mb-4">NUESTRO LEGADO</span>
            <h2 className="text-6xl font-black text-incap-blue mb-10 leading-tight uppercase">Uniendo el país desde hace más de <span className="text-incap-green underline decoration-8 underline-offset-8">40 años.</span></h2>
            <p className="text-slate-600 text-xl leading-relaxed mb-10 font-medium">
              Lo que comenzó como un sueño familiar en Medellín, hoy es el estándar de calidad en la industria colombiana. Entendemos que cada pegue es un compromiso de confianza.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

const AuthoritySection = () => (
  <section className="py-20 bg-incap-black border-y border-white/5">
    <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="flex space-x-16 md:space-x-32 animate-marquee whitespace-nowrap">
        {['ISO 9001', 'CALIDAD CERTIFICADA', 'TECNOLOGÍA ITALIANA', 'SENA ALIADO', 'FENALCO', 'ISO 9001', 'CALIDAD CERTIFICADA', 'TECNOLOGÍA ITALIANA', 'SENA ALIADO', 'FENALCO'].map((brand, i) => (
          <div key={i} className="text-white/30 font-black text-xl tracking-[0.3em] uppercase hover:text-incap-green transition-colors cursor-default">{brand}</div>
        ))}
      </div>
    </div>
  </section>
);

const WhyIncap = () => {
  const { ref, className } = useReveal();
  return (
    <section ref={ref} className={`py-32 bg-white ${className}`}>
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-24">
          <h2 className="text-5xl font-black text-incap-blue uppercase tracking-tighter">¿POR QUÉ ELEGIR <span className="text-incap-green">INCAP?</span></h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          {[
            { title: 'Innovación Constante', desc: 'Laboratorio propio de I+D para desarrollar soluciones a medida.' },
            { title: 'Soporte en Planta', desc: 'Asesoría técnica presencial para optimizar tus procesos de pegue.' },
            { title: 'Stock Garantizado', desc: 'Cadena de suministro robusta para que nunca te falte producto.' }
          ].map((item, i) => (
            <div key={i} className="text-center group">
              <div className="w-24 h-24 bg-slate-50 rounded-3xl mx-auto mb-8 flex items-center justify-center transform transition-transform group-hover:rotate-12 group-hover:bg-incap-green">
                <div className="w-10 h-10 border-4 border-incap-blue group-hover:border-incap-black"></div>
              </div>
              <h3 className="text-2xl font-black text-incap-blue mb-4 uppercase">{item.title}</h3>
              <p className="text-slate-500 font-medium leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ConversionFooter = () => (
  <section className="relative py-32 bg-incap-blue overflow-hidden">
    <div className="absolute inset-0 opacity-10">
      <div className="absolute top-0 left-0 w-full h-full border-[100px] border-white rounded-full translate-x-1/2 translate-y-1/2 scale-150"></div>
    </div>
    <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
      <h2 className="text-6xl font-black text-white mb-10 leading-tight uppercase">¿Listo para optimizar tu producción?</h2>
      <p className="text-white/70 text-xl mb-14 font-medium">Solicita una visita técnica o una muestra de nuestros productos líderes.</p>
      <div className="flex flex-col sm:flex-row justify-center gap-6">
        <button className="px-12 py-6 bg-incap-green text-incap-black rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-transform shadow-2xl text-xs">Hablar con un Experto</button>
        <button className="px-12 py-6 border-2 border-white/30 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-white hover:text-incap-blue transition-all text-xs">Ver Distribuidores</button>
      </div>
    </div>
  </section>
);

const IndustryPage = ({ data, onProductClick }) => (
  <div className="min-h-screen animate-fadeIn bg-white">
    <section className="relative h-[80vh] flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <img src={data.heroImage} className="w-full h-full object-cover" alt={data.name} />
        <div className="absolute inset-0 bg-incap-blue/40 backdrop-blur-[2px]"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
      </div>
      <div className="relative max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-3xl">
          <div className="flex space-x-4 mb-8">
            {data.icons.map((icon, i) => (
              <div key={i} className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl p-3 flex items-center justify-center border border-white/30">
                <img src={icon} className="w-full h-full invert brightness-0" alt="icon" />
              </div>
            ))}
          </div>
          <h1 className="text-8xl font-black text-white mb-6 uppercase tracking-tighter leading-[0.8]">{data.name}</h1>
          <p className="text-2xl text-white/90 font-medium leading-relaxed">{data.description}</p>
        </div>
      </div>
    </section>

    <section className="py-32">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {data.applications.map((app, i) => (
            <div key={i} className="p-10 rounded-[3rem] bg-slate-50 hover:bg-white hover:shadow-2xl transition-all duration-500 group border border-transparent hover:border-slate-100">
              <div className="text-incap-green font-black text-6xl mb-6 opacity-20 group-hover:opacity-100 transition-opacity">0{i+1}</div>
              <h3 className="text-2xl font-black text-incap-blue mb-4 uppercase">{app.title}</h3>
              <p className="text-slate-500 font-medium leading-relaxed">{app.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="py-32 bg-incap-blue rounded-t-[5rem]">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-20">
          <h2 className="text-6xl font-black text-white uppercase tracking-tighter">Portafolio <br /><span className="text-incap-green">Especializado</span></h2>
          <div className="text-white/40 font-black uppercase tracking-[0.5em] text-xs">Desliza para ver más</div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PRODUCTS.filter(p => p.category === data.id).map((prod) => (
            <div 
              key={prod.slug}
              onClick={() => onProductClick(prod)}
              className="group bg-white/5 backdrop-blur-md rounded-[3rem] p-8 border border-white/10 hover:bg-white transition-all duration-700 cursor-pointer"
            >
              <div className="h-64 rounded-[2rem] overflow-hidden mb-8 relative">
                <img src={prod.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt={prod.name} />
                <div className="absolute top-4 right-4 bg-white/90 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-incap-blue">
                  {prod.feature}
                </div>
              </div>
              <span className="text-incap-green text-[10px] font-black uppercase tracking-[0.4em] mb-3 block">{prod.cat}</span>
              <h3 className="text-2xl font-black text-white group-hover:text-incap-blue mb-4 uppercase transition-colors">{prod.name}</h3>
              <p className="text-white/50 group-hover:text-slate-500 text-sm mb-8 line-clamp-3 font-medium transition-colors">{prod.description}</p>
              <div className="flex items-center text-white group-hover:text-incap-blue font-black uppercase tracking-widest text-[10px] space-x-3 transition-colors">
                <span>Ver Detalles</span>
                <svg className="w-4 h-4 transform group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    <ConversionFooter />
  </div>
);

const GHSPictogram = ({ code }) => {
  const pictograms = {
    'GHS02': { icon: '🔥', label: 'Inflamable' },
    'GHS05': { icon: '🧪', label: 'Corrosivo' },
    'GHS07': { icon: '⚠️', label: 'Irritante' },
    'GHS08': { icon: '🫁', label: 'Peligro Salud' },
    'GHS09': { icon: '🐟', label: 'Ecotóxico' }
  };
  const item = pictograms[code] || { icon: '❓', label: code };
  return (
    <div className="flex flex-col items-center gap-2 p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-incap-green transition-colors group">
      <span className="text-3xl grayscale group-hover:grayscale-0 transition-all cursor-default transform group-hover:scale-110 duration-300">{item.icon}</span>
      <span className="text-[9px] font-black uppercase tracking-tighter text-slate-400 group-hover:text-incap-blue transition-colors">{item.label}</span>
    </div>
  );
};

const ProductDetailPage = ({ product, setPage }) => {
  const [selectedVariant, setSelectedVariant] = useState(product.variants ? product.variants[0] : null);
  const [activeTab, setActiveTab] = useState('tech');

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-24 animate-fadeIn">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="mb-12 flex items-center space-x-4 text-[10px] font-black uppercase tracking-[0.3em]">
          <button onClick={() => setPage('home')} className="text-slate-400 hover:text-incap-blue transition-colors">Inicio</button>
          <span className="text-slate-300">/</span>
          <button onClick={() => setPage(product.category)} className="text-slate-400 hover:text-incap-blue transition-colors uppercase">{product.category}</button>
          <span className="text-slate-300">/</span>
          <span className="text-incap-blue">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Gallery Column */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-[3rem] overflow-hidden shadow-2xl group relative h-[700px] border border-slate-100">
              <img src={selectedVariant?.image || product.image} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt={product.name} />
              <div className="absolute inset-0 bg-gradient-to-t from-incap-black/60 via-transparent to-transparent"></div>
              <div className="absolute bottom-10 left-10 right-10 flex justify-between items-end">
                <div>
                  <h1 className="text-6xl font-black text-white uppercase tracking-tighter leading-none mb-4">{product.name}</h1>
                  <p className="text-incap-green font-black uppercase tracking-[0.4em] text-xs">{product.feature}</p>
                </div>
                <div className="bg-white/95 backdrop-blur-md px-8 py-6 rounded-[2rem] shadow-2xl border border-white/20 transform hover:scale-105 transition-transform">
                  <div className="text-slate-400 text-[8px] font-black uppercase tracking-[0.5em] mb-2">CÓDIGO SAP</div>
                  <div className="text-incap-blue font-black text-2xl font-sora">{selectedVariant?.sap || 'N/A'}</div>
                </div>
              </div>
            </div>
            
            {/* Gallery Thumbs */}
            <div className="grid grid-cols-4 gap-4 mt-6">
              {product.variants?.map((v, i) => (
                <button 
                  key={i}
                  onClick={() => setSelectedVariant(v)}
                  className={`h-24 rounded-[1.5rem] overflow-hidden border-4 transition-all duration-300 ${selectedVariant?.sku === v.sku ? 'border-incap-green scale-95 shadow-inner' : 'border-transparent opacity-60 hover:opacity-100 hover:scale-105'}`}
                >
                  <img src={v.image || product.image} className="w-full h-full object-cover" alt={v.name} />
                </button>
              ))}
            </div>
          </div>

          {/* Info Column */}
          <div className="lg:col-span-5 space-y-10">
            <div className="bg-white rounded-[3rem] p-10 shadow-2xl border border-slate-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-incap-green/10 rounded-full translate-x-10 -translate-y-10"></div>
              
              <div className="flex items-center justify-between mb-10 relative z-10">
                <span className="bg-incap-blue text-white text-[10px] font-black px-6 py-2.5 rounded-full uppercase tracking-[0.3em]">{product.cat}</span>
                <span className="text-slate-400 font-black text-[10px] uppercase tracking-widest">SKU: {selectedVariant?.sku || product.sku}</span>
              </div>

              <p className="text-slate-600 text-xl leading-relaxed mb-12 font-medium relative z-10">{product.description}</p>

              {product.variants && (
                <div className="mb-12 relative z-10">
                  <h4 className="text-incap-blue font-black uppercase tracking-[0.3em] text-[10px] mb-8 flex items-center">
                    <span className="w-2 h-2 rounded-full bg-incap-green mr-4 animate-pulse"></span>Seleccionar Presentación
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    {product.variants.map((v) => (
                      <button key={v.sku} onClick={() => setSelectedVariant(v)} className={`py-5 px-8 rounded-2xl border-2 font-black uppercase tracking-widest text-[10px] transition-all duration-300 flex items-center justify-between group ${selectedVariant?.sku === v.sku ? 'border-incap-blue bg-incap-blue text-white shadow-xl scale-[1.02]' : 'border-slate-100 text-slate-400 hover:border-slate-200 hover:bg-slate-50'}`}>
                        {v.name}
                        {selectedVariant?.sku === v.sku && <svg className="w-4 h-4 text-incap-green" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-4 relative z-10">
                <button className="w-full py-7 bg-incap-blue text-white rounded-[2rem] font-black uppercase tracking-[0.2em] hover:bg-incap-green hover:text-incap-black transition-all transform hover:-translate-y-2 shadow-2xl text-[11px] flex items-center justify-center gap-4 group">
                  <svg className="w-6 h-6 transition-transform group-hover:rotate-12" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.232 3.484 8.412-.003 6.557-5.338 11.892-11.893 11.892-1.997-.001-3.951-.5-5.688-1.448l-6.309 1.656zm6.224-3.82l.303.174c1.46.843 3.147 1.288 4.871 1.289 5.432 0 9.851-4.419 9.854-9.853.002-2.633-1.023-5.11-2.887-6.974-1.864-1.864-4.341-2.887-6.973-2.888-5.433 0-9.852 4.419-9.855 9.853-.001 2.052.54 4.05 1.564 5.776l.192.323-1.01 3.687 3.782-.992z"/></svg>
                  Cotizar por WhatsApp
                </button>
                <button className="w-full py-6 border-2 border-slate-100 text-incap-blue rounded-[2rem] font-black uppercase tracking-[0.2em] hover:bg-slate-50 transition-all text-[11px]">Descargar Ficha Técnica</button>
              </div>
            </div>

            <div className="bg-white rounded-[3rem] p-10 shadow-2xl border border-slate-100">
              <h4 className="text-incap-blue font-black uppercase tracking-[0.3em] text-[10px] mb-10 flex items-center">
                <span className="w-2 h-2 rounded-full bg-incap-green mr-4 animate-pulse"></span>Información de Seguridad (GHS)
              </h4>
              <div className="grid grid-cols-4 gap-6">
                {product.safety?.map((code) => <GHSPictogram key={code} code={code} />)}
              </div>
            </div>
          </div>
        </div>

        {/* Technical Tabs Section */}
        <div className="mt-24">
          <div className="flex space-x-12 border-b border-slate-200 mb-12">
            {[
              { id: 'tech', label: 'Información Técnica' },
              { id: 'safety', label: 'Seguridad y Manejo' }
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-8 text-[11px] font-black uppercase tracking-[0.4em] transition-all relative ${activeTab === tab.id ? 'text-incap-blue' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {tab.label}
                {activeTab === tab.id && <div className="absolute bottom-0 left-0 w-full h-1 bg-incap-green rounded-full animate-fadeIn"></div>}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-8 bg-white rounded-[3rem] p-12 shadow-2xl border border-slate-100">
              {activeTab === 'tech' ? (
                <div className="animate-fadeIn">
                  <h3 className="text-4xl font-black text-incap-blue mb-12 uppercase tracking-tighter">Instrucciones de Uso</h3>
                  <div className="space-y-12">
                    {product.instructions.split('.').filter(s => s.trim()).map((step, i) => (
                      <div key={i} className="flex gap-10 group">
                        <div className="flex-shrink-0 w-14 h-14 rounded-full bg-slate-50 text-incap-blue font-black text-xl flex items-center justify-center border-2 border-transparent group-hover:border-incap-green group-hover:bg-incap-green group-hover:text-incap-black transition-all duration-500 transform group-hover:rotate-6 shadow-sm">
                          {i + 1}
                        </div>
                        <div>
                          <p className="text-slate-600 font-medium leading-relaxed text-xl group-hover:text-incap-blue transition-colors">{step.trim()}.</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="animate-fadeIn">
                  <h3 className="text-4xl font-black text-incap-blue mb-12 uppercase tracking-tighter">Manejo de Seguridad</h3>
                  <div className="space-y-8">
                    <p className="text-slate-600 text-lg leading-relaxed font-medium">Este producto cumple con los estándares internacionales de seguridad industrial. Se recomienda el uso de EPP (Equipo de Protección Personal) adecuado.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
                      <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 hover:border-incap-green transition-colors">
                        <h4 className="text-incap-blue font-black text-sm uppercase mb-4 tracking-widest">Almacenamiento</h4>
                        <p className="text-slate-500 text-sm leading-relaxed font-medium">Mantener en lugar fresco y seco, entre 15°C y 25°C. Evitar la exposición directa al sol.</p>
                      </div>
                      <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 hover:border-incap-green transition-colors">
                        <h4 className="text-incap-blue font-black text-sm uppercase mb-4 tracking-widest">Precauciones</h4>
                        <p className="text-slate-500 text-sm leading-relaxed font-medium">No inhalar vapores. En caso de contacto con los ojos, lavar con abundante agua y consultar al médico.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-4 space-y-10">
              <div className="bg-incap-blue rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden group">
                <div className="relative z-10">
                  <h3 className="text-3xl font-black mb-8 uppercase tracking-tighter">Soporte Técnico</h3>
                  <p className="text-white/70 font-medium mb-12 leading-relaxed text-lg">¿Dudas sobre el rendimiento o la aplicación en tu línea de producción?</p>
                  <button className="w-full py-6 bg-incap-green text-incap-black rounded-2xl font-black uppercase tracking-widest hover:bg-white transition-all transform hover:-translate-y-2 shadow-xl text-xs">Contactar Técnico</button>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full translate-x-20 -translate-y-20 group-hover:scale-110 transition-transform duration-1000"></div>
              </div>

              <div className="bg-white rounded-[3rem] p-12 shadow-2xl border border-slate-100">
                <h3 className="text-2xl font-black text-incap-blue mb-10 uppercase tracking-tighter">Preguntas Frecuentes</h3>
                <div className="space-y-8">
                  {product.faqs?.map((faq, i) => (
                    <details key={i} className="group cursor-pointer">
                      <summary className="list-none flex justify-between items-center font-black uppercase tracking-[0.2em] text-[10px] text-slate-400 group-hover:text-incap-blue transition-colors">
                        {faq.q}
                        <span className="transform group-open:rotate-180 transition-transform duration-300">▼</span>
                      </summary>
                      <p className="mt-6 text-slate-500 font-medium text-base leading-relaxed border-l-4 border-incap-green pl-6 animate-fadeIn">
                        {faq.a}
                      </p>
                    </details>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Utilities (SEO & Schema) ---

const updateMetaDescription = (desc) => {
  if (typeof document === 'undefined') return;
  let meta = document.querySelector('meta[name="description"]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('name', 'description');
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', desc);
};

const injectJSONLD = (data) => {
  if (typeof document === 'undefined') return;
  let script = document.getElementById('json-ld');
  if (!script) {
    script = document.createElement('script');
    script.id = 'json-ld';
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data);
};

const getOrgSchema = () => ({ "@context": "https://schema.org", "@type": "Organization", "name": "INCAP S.A.", "url": "http://localhost:5173", "logo": "http://localhost:5173/logo.png" });
const getIndustrySchema = (data) => ({ "@context": "https://schema.org", "@type": "Service", "name": data.name, "description": data.description });
const getProductSchema = (product) => ({ "@context": "https://schema.org", "@type": "Product", "name": product.name, "description": product.description, "sku": product.sku });
const getFAQSchema = (product) => ({ "@context": "https://schema.org", "@type": "FAQPage", "mainEntity": product.faqs?.map(f => ({ "@type": "Question", "name": f.q, "acceptedAnswer": { "@type": "Answer", "text": f.a } })) });

// --- Main App Controller ---

export default function App() {
  const [page, setPageState] = useState(() => {
    const path = window.location.pathname;
    const parts = path.split('/').filter(Boolean);
    if (parts[0]?.startsWith('industria')) {
      if (parts.length === 2) return parts[1].replace(/s$/, '');
      if (parts.length === 3) return 'product-detail';
    }
    if (path.startsWith('/producto/')) return 'product-detail';
    return 'home';
  }); 

  const [selectedProduct, setSelectedProduct] = useState(() => {
    const path = window.location.pathname;
    const parts = path.split('/').filter(Boolean);
    if (parts[0]?.startsWith('industria') && parts.length === 3) {
      return PRODUCTS.find(p => p.slug === parts[2]) || null;
    }
    if (path.startsWith('/producto/')) {
      const slug = path.replace('/producto/', '');
      return PRODUCTS.find(p => p.slug === slug) || null;
    }
    return null;
  });

  const setPage = (newPage, product = null) => {
    let url = '/';
    if (newPage === 'product-detail' && product) {
      const cat = product.category === 'madera' ? 'maderas' : product.category + 's';
      url = `/industrias/${cat}/${product.slug}`;
      setSelectedProduct(product);
    } else if (newPage !== 'home') {
      const cat = newPage === 'madera' ? 'maderas' : newPage + 's';
      url = `/industrias/${cat}`;
      setSelectedProduct(null);
    } else {
      setSelectedProduct(null);
    }
    window.history.pushState({ page: newPage, productSlug: product?.slug }, '', url);
    setPageState(newPage);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      const parts = path.split('/').filter(Boolean);
      if (parts[0]?.startsWith('industria')) {
        if (parts.length === 2) { setPageState(parts[1].replace(/s$/, '')); setSelectedProduct(null); }
        else if (parts.length === 3) { setSelectedProduct(PRODUCTS.find(p => p.slug === parts[2]) || null); setPageState('product-detail'); }
      } else if (path.startsWith('/producto/')) {
        setSelectedProduct(PRODUCTS.find(p => p.slug === path.replace('/producto/', '')) || null); setPageState('product-detail');
      } else { setPageState('home'); setSelectedProduct(null); }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    if (page === 'home') {
      document.title = 'INCAP | Calidad que se repite | Adhesivos Industriales';
      updateMetaDescription('Líder en soluciones de adhesivos industriales para madera, colchones, calzado y hogar.');
      injectJSONLD(getOrgSchema());
    } else if (page === 'product-detail' && selectedProduct) {
      document.title = `${selectedProduct.name} | Ficha Técnica | INCAP`;
      updateMetaDescription(selectedProduct.description);
      injectJSONLD([getProductSchema(selectedProduct), getFAQSchema(selectedProduct)]);
    } else if (INDUSTRIES_DATA[page]) {
      document.title = `${INDUSTRIES_DATA[page].name} | Soluciones Técnicas INCAP`;
      updateMetaDescription(INDUSTRIES_DATA[page].description);
      injectJSONLD(getIndustrySchema(INDUSTRIES_DATA[page]));
    }
  }, [page, selectedProduct?.slug]);

  return (
    <div className="min-h-screen bg-white selection:bg-incap-green selection:text-incap-black">
      <Header setPage={setPage} currentPage={page} />
      {page === 'home' ? (
        <main><HeroHome setPage={setPage} /><AuthoritySection /><IndustrySectionHome setPage={setPage} /><HistorySection /><WhyIncap /><ConversionFooter /></main>
      ) : page === 'product-detail' && selectedProduct ? (
        <main><ProductDetailPage product={selectedProduct} setPage={setPage} /></main>
      ) : INDUSTRIES_DATA[page] ? (
        <main><IndustryPage data={INDUSTRIES_DATA[page]} onProductClick={(p) => setPage('product-detail', p)} /></main>
      ) : (
        <div className="min-h-screen flex items-center justify-center flex-col gap-10 bg-slate-50">
          <div className="relative">
            <h1 className="text-[12rem] font-black text-incap-blue/5 leading-none font-sora">404</h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <h2 className="text-4xl font-black text-incap-blue uppercase tracking-tighter">No encontrado</h2>
            </div>
          </div>
          <button onClick={() => setPage('home')} className="px-14 py-6 bg-incap-blue text-white rounded-[2rem] font-black uppercase tracking-[0.2em] hover:scale-105 transition-transform shadow-2xl text-xs">Volver al Inicio</button>
        </div>
      )}
      <TechnicalAdvisor onProductClick={(p) => setPage('product-detail', p)} />
      <footer className="bg-incap-black py-32 text-slate-600 border-t border-white/5">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-16">
          <Logo color="#444" />
          <div className="flex gap-12 text-[10px] font-black uppercase tracking-[0.4em]">
            <a href="#" className="hover:text-white transition-colors">Términos</a>
            <a href="#" className="hover:text-white transition-colors">Privacidad</a>
            <a href="#" className="hover:text-white transition-colors">Soporte</a>
          </div>
          <p className="text-[10px] uppercase tracking-[0.5em] font-black">© 2026 INCAP S.A. | CALIDAD QUE SE REPITE</p>
        </div>
      </footer>
    </div>
  );
}
