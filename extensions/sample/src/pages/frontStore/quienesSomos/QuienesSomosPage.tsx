import React from 'react';
import { useQuery } from 'urql';

const QUERY = `
  query {
    setting {
      quienesSomos
      storeWhatsappNumber
    }
  }
`;

// ── SVG íconos inline ───────────────────────────────────────────────────────
const IconHeart = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);
const IconCheck = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 11 12 14 22 4" />
    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
  </svg>
);
const IconGroup = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const PILAR_ICONS: Record<string, React.ReactNode> = {
  'Pasión': <IconHeart />,
  'Calidad': <IconCheck />,
  'Comunidad': <IconGroup />,
};

// ── Contenido por defecto (fuente de verdad offline) ───────────────────────
const DEFAULT_CONTENT = {
  hero: {
    kicker: 'Grupo INCAP',
    titulo: 'Fabricamos la química que mueve la industria colombiana.',
    subtitulo: 'Más de cinco décadas fabricando y distribuyendo adhesivos de alto rendimiento para las fábricas más exigentes del país. Con laboratorio propio, formulaciones exclusivas y técnicos que van a tu planta.',
    imagen: '/images/quienes-somos/cap-hero.webp',
    botones: [
      { texto: 'Hablar con un experto', tipo: 'whatsapp' },
      { texto: 'Descargar catálogo', url: '/assets/catalogo-incap.pdf', download: true },
    ],
    stats: [
      { valor: '+56', label: 'Años de maestría técnica' },
      { valor: '6',   label: 'Marcas especializadas del grupo' },
      { valor: '8',   label: 'Industrias que servimos' },
      { valor: '18',  label: 'Ciudades con cobertura nacional' },
      { valor: '100%', label: 'Industria colombiana' },
    ],
  },
  somos: {
    titulo: 'Somos Grupo INCAP',
    subtitulo: 'La casa de INCAP S.A. y JAB',
    intro: 'Nacimos en Bogotá, crecimos con Colombia y hoy somos el aliado técnico de ferreterías, fabricantes y talleres de norte a sur del territorio nacional. Bajo el paraguas de Grupo INCAP conviven dos marcas especializadas y cuatro aliados estratégicos que amplían nuestra oferta de valor. Cada marca tiene un rol específico dentro del ecosistema industrial colombiano, y juntas cubren desde el adhesivo de contacto de alta performance hasta los componentes y suministros complementarios que completan el proceso del fabricante.',
    marcas: [
      { tag: 'Marca insignia del grupo', imagen: '/images/quienes-somos/marca-incap.png', descripcion: 'Adhesivos industriales de alto rendimiento para madera, colchones, calzado, marroquinería y más. Cinco décadas de confianza técnica en el mercado colombiano.', color: '#2A4899' },
      { tag: 'Componentes y suministros', imagen: '/images/quienes-somos/marca-jab.png', descripcion: 'Línea de componentes y suministros complementarios que amplía la solución integral de Grupo INCAP para el fabricante colombiano.', color: '#85C639' },
    ],
  },
  misionVision: {
    mision: 'Fabricar adhesivos y componentes industriales de alta calidad que impulsen la productividad de las industrias colombianas, acompañando a cada cliente con asesoría técnica cercana y soluciones adaptadas a su proceso, sin importar el tamaño de su operación.',
    vision: 'Ser el grupo industrial de referencia en adhesivos y componentes para Colombia y la región, reconocido por la solidez de sus marcas, la profundidad de su portafolio y el compromiso humano que pone detrás de cada producto.',
  },
  pilares: {
    kicker: 'Lo que nos define',
    titulo: 'Nuestros tres pilares',
    items: [
      { titulo: 'Pasión',    descripcion: 'Nos comprometemos de verdad con el resultado de cada cliente. Visitamos su planta, entendemos su proceso y resolvemos cada duda en campo.' },
      { titulo: 'Calidad',   descripcion: 'Fabricamos con estándares industriales rigurosos. Cada adhesivo y componente que sale de nuestras instalaciones está respaldado por décadas de formulación y mejora continua.' },
      { titulo: 'Comunidad', descripcion: 'El verdadero motor de Grupo INCAP es su gente: operarios, distribuidores y clientes que construyen juntos el tejido industrial del país.' },
    ],
  },
  marcasGrupo: {
    kicker: 'Marcas del grupo',
    titulo: 'Seis marcas, una misma excelencia.',
    logos: [
      { nombre: 'INCAP',    src: '/images/quienes-somos/logo-incap.png' },
      { nombre: 'JAB',      src: '/images/quienes-somos/logo-jab.png' },
      { nombre: 'TECNOGI',  src: '/images/quienes-somos/logo-tecnogi.png' },
      { nombre: 'Kenda',    src: '/images/quienes-somos/logo-kenda.png' },
      { nombre: 'CT Point', src: '/images/quienes-somos/logo-ctpoint.png' },
      { nombre: 'Intercom', src: '/images/quienes-somos/logo-intercom.png' },
    ],
  },
  industrias: {
    kicker: 'Nuestro alcance',
    titulo: 'Industrias que servimos',
    items: [
      { nombre: 'Calzado y Marroquinería',         href: '/industrias/calzado',   icons: ['/images/icons/Icono_Calzado.webp', '/images/icons/Icono_Marroquineria.webp'], descripcion: 'El estándar de las grandes fábricas: adhesivos, tintas, cordones y accesorios para calzado.' },
      { nombre: 'Colchones y Espumas',             href: '/industrias/colchones', icons: ['/images/icons/Icono_Colchones.webp', '/images/icons/icono_Espuma.webp'], descripcion: 'Soluciones para pegue de espumas, telas y componentes en líneas de producción de descanso.' },
      { nombre: 'Madera y Muebles',               href: '/industrias/madera',    icons: ['/images/icons/Icono_Maderas.webp', '/images/icons/Icono_Muebles.webp'], descripcion: 'Adhesivos para la industria del mueble: enchapes, ensambles, ebanistería y producción en serie.' },
      { nombre: 'Hogar, Manualidades y Multiusos', href: '/industrias/hogar',    icons: ['/images/icons/Icono_Hogar.webp', '/images/icons/Icono_manualidades.webp', '/images/icons/Icono_Multiusos.webp'], descripcion: 'Pegamentos versátiles para reparaciones domésticas, manualidades y proyectos creativos.' },
    ],
    ctaTexto: 'Ver portafolio completo',
    ctaUrl: '/catalog',
  },
  historia: {
    kicker: 'Nuestra historia',
    titulo: 'Una compañía fundada sobre la precisión química',
    imagen: '/images/quienes-somos/historia.webp',
    parrafos: [
      'Desde 1969, Grupo INCAP nació con un propósito claro: ofrecer adhesivos de calidad superior respaldados por un servicio técnico que le garantice al fabricante haber tomado la mejor decisión. Esa promesa no ha cambiado en más de medio siglo.',
      'Hoy somos una empresa especializada en la fabricación de componentes industriales con tecnología de punta para múltiples superficies y materiales. Contamos con laboratorio propio, departamento de Investigación y Desarrollo y técnicos especializados que acompañan al cliente en su propia planta.',
      'Nuestra diferencia no es el producto: es el conocimiento acumulado en miles de horas dentro de las fábricas colombianas.',
    ],
    timeline: [
      { año: '1969',           texto: 'Fundación de INCAP S.A. en Bogotá con el objetivo de fabricar adhesivos de calidad superior para la industria colombiana.' },
      { año: 'Década de 1990', texto: 'Expansión hacia la industria del calzado y la marroquinería. Inicio del desarrollo de formulaciones propias libres de tolueno.' },
      { año: 'Años 2000',      texto: 'Consolidación de la red nacional de distribuidores y primeras participaciones en ferias internacionales del sector adhesivo y del calzado.' },
      { año: 'Hoy',            texto: 'Fabricantes de la familia MAXÓN y líderes en servicio técnico especializado para más de 8 industrias en 18 ciudades del país.' },
    ],
  },
  mascota: {
    kicker: 'Nuestra mascota',
    titulo: 'Conoce a CAP: la fuerza y la frescura tienen nuevo rostro',
    imagen: '/images/quienes-somos/cap-mascota.webp',
    parrafos: [
      'CAP es la lagartija que pone cara a la viscosidad de Grupo INCAP. Con un estilo joven y dinámico, CAP nos recuerda que la seguridad industrial es lo primero y que detrás de cada componente o adhesivo hay un equipo que se pone la misma bota de trabajo que tú.',
      'CAP nace para dar vida a lo que hace único a INCAP. Es el rostro de nuestra experiencia, el capitán de nuestra calidad y el representante de los valores que nos han acompañado durante años.',
    ],
    cards: [
      { titulo: 'La metáfora perfecta',    descripcion: 'El gecko se adhiere a cualquier superficie desafiando la gravedad. Exactamente lo que hace INCAP con sus adhesivos en cada industria.' },
      { titulo: 'Experto en terreno',      descripcion: 'Casco blanco, overol azul, botas industriales. No es un dibujo etéreo: está listo para pisar la fábrica junto al operario y al jefe de planta.' },
      { titulo: 'Moderno y conectado',     descripcion: 'Su celular en mano indica servicio y solución en tiempo real. CAP humaniza una marca industrial B2B haciéndola más cercana y accesible.' },
      { titulo: 'Nueva imagen, misma pasión.', descripcion: 'Adhiriendo desde 1969.', destacado: true },
    ],
  },
  fabricacion: {
    kicker: 'Fabricación y formulación propia',
    titulo: 'Fabricamos la mayoría de lo que vendemos. Y lo diseñamos nosotros.',
    parrafos: [
      'La mayoría de nuestros productos son desarrollados en nuestro propio laboratorio, donde diseñamos y perfeccionamos cada formulación para responder con precisión a las necesidades de los procesos productivos de nuestros clientes.',
      'Esta combinación de desarrollo propio y alianzas estratégicas nos permite ofrecer soluciones integrales respaldadas por conocimiento técnico, experiencia e innovación.',
      'Somos INCAP, una empresa especializada en soluciones adhesivas e insumos complementarios de alta calidad, con más de 56 años de trayectoria en los mercados nacional e internacional.',
    ],
    caso: {
      titulo: 'Adhesivo diseñado a la medida para',
      logo: '/images/quienes-somos/formicentro-logo.png',
      parrafos: [
        'Cuando un distribuidor de la talla de Formicentro necesitaba una solución de pegado que su proceso no encontraba en el mercado, INCAP no buscó en el catálogo; diseñó la fórmula desde cero.',
        'Trabajamos de forma conjunta con el equipo de planta, analizamos los materiales específicos, las condiciones de temperatura y humedad, y los tiempos de ciclo; hasta desarrollar un adhesivo que respondiera exactamente a sus exigencias de producción.',
      ],
      videoUrl: '',
      videoPlaceholder: true,
    },
  },
  valor3por100: {
    titulo: 'Soluciones adhesivas industriales en Colombia: el 3% de su inversión que asegura el 100% de su producto',
    intro: 'En el sector de la manufactura, el precio de los adhesivos industriales representa apenas entre el 3% y el 4% del costo de producción total. Sin embargo, este pequeño insumo es el componente más crítico de su cadena de valor.',
    cards: [
      { titulo: 'Modelo de acompañamiento técnico especializado en planta', descripcion: 'El portafolio de soluciones adhesivas de INCAP S.A. integra un modelo de soporte técnico continuo en las etapas de precompra, producción y postventa.' },
      { titulo: 'Aseguramiento de la calidad final y mitigación de devoluciones', descripcion: 'En la estructura de costos de manufactura, el pegamento representa entre el 3% y el 4% de la inversión en insumos, pero sobre él recae la responsabilidad del 100% del resultado final.' },
      { titulo: 'Control de costos ocultos y rentabilidad operativa', descripcion: 'El valor real de un sistema de pegado no se determina por el precio de compra del galón, sino por los costos operativos asociados a sus fallas en la línea.' },
    ],
  },
  alianzas: {
    titulo: 'Alianzas que construyen país',
    intro: 'Nuestra red nacional de distribuidores es el puente que lleva la química de alto rendimiento a cada taller y fábrica de Colombia. Fortaleciendo la industria local, un punto de venta a la vez.',
    mapa: '/images/quienes-somos/mapa-alianzas.webp',
    ciudades: ['Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena', 'Bucaramanga', 'Santa Marta', 'Cúcuta', 'Manizales', 'Ibagué', 'Montería', 'Pasto', 'Armenia', 'Villavicencio', 'Neiva', 'Boyacá', 'Pereira', 'Leticia'],
  },
  innovacion: {
    titulo: 'Innovación que cuida el planeta',
    parrafos: [
      'En INCAP creemos que ser líder industrial implica responsabilidad con el medio ambiente. Por eso adoptamos el sistema Bidon Box — una tecnología de empaque que transforma la forma en que distribuimos nuestros adhesivos.',
      'El Bidon Box reemplaza el bidón plástico tradicional por un sistema de caja con bolsa interior. Menos plástico, más seguridad para el operario y menos desperdicio de producto.',
    ],
    imagen: '/images/quienes-somos/cap-bidon.webp',
    features: [
      { icon: '/images/quienes-somos/icon-menos-plastico.png',     titulo: '85% menos plástico',         descripcion: 'Frente al bidón tradicional de 5 galones, el Bidon Box reduce significativamente el plástico generado por cada unidad de adhesivo consumida.' },
      { icon: '/images/quienes-somos/icon-libre-salpicaduras.png', titulo: 'Libre de salpicaduras',       descripcion: 'El sistema de vertido controlado elimina derrames accidentales, mejorando la seguridad del operario y reduciendo el desperdicio de producto.' },
      { icon: '/images/quienes-somos/icon-facil-verter.png',       titulo: 'Fácil de almacenar y verter', descripcion: 'El formato caja optimiza el espacio de bodega, es más ligero y permite vaciado completo sin residuos.' },
    ],
  },
  fallasCta: {
    titulo: '¿Fallas de pegue?',
    subtitulo: 'Cada unidad defectuosa es una devolución, una queja y una venta perdida.',
    parrafos: [
      'Cuéntanos tu caso por WhatsApp y en menos de 24 horas un técnico INCAP te dice exactamente qué está pasando, sin costo, sin compromiso.',
      'Hemos diagnosticado fallas en más de 200 plantas. El 90% se resuelve ajustando el producto, la temperatura de aplicación o el tiempo abierto.',
    ],
    boton: { texto: 'Hablar con un experto', tipo: 'whatsapp' },
  },
};

// ── Helpers de estilo ───────────────────────────────────────────────────────
const S = {
  kicker: { fontSize: '10px', fontWeight: 800, color: '#85C639', letterSpacing: '0.35em', textTransform: 'uppercase' as const, marginBottom: '10px', display: 'block' },
  sectionPad: { padding: '5rem 2rem' },
  inner: { maxWidth: '1200px', margin: '0 auto' },
  h2: { fontSize: 'clamp(1.5rem, 3.5vw, 2.5rem)', fontWeight: 900, color: '#181B1C', margin: '0 0 1rem', letterSpacing: '-0.02em', lineHeight: 1.1, fontFamily: 'Sora, sans-serif' },
  h2White: { fontSize: 'clamp(1.5rem, 3.5vw, 2.5rem)', fontWeight: 900, color: '#fff', margin: '0 0 1rem', letterSpacing: '-0.02em', lineHeight: 1.1, fontFamily: 'Sora, sans-serif' },
  body: { fontSize: '15px', color: '#374151', lineHeight: 1.8, fontFamily: 'Sora, sans-serif', margin: '0 0 1rem' },
  bodyMuted: { fontSize: '13px', color: '#64748b', lineHeight: 1.75, fontFamily: 'Sora, sans-serif', margin: 0 },
  card: { background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.75rem', boxShadow: '0 2px 12px rgba(42,72,153,0.07)' },
  green: { color: '#85C639' },
};

export default function QuienesSomosPage() {
  const [result] = useQuery({ query: QUERY, requestPolicy: 'cache-and-network' });

  let parsed: any = null;
  try { parsed = JSON.parse(result.data?.setting?.quienesSomos || ''); } catch {}
  const c: typeof DEFAULT_CONTENT = (parsed && Object.keys(parsed).length)
    ? { ...DEFAULT_CONTENT, ...parsed }
    : DEFAULT_CONTENT;

  const wa = result.data?.setting?.storeWhatsappNumber ?? '573002171521';
  const waHref = `https://api.whatsapp.com/send?phone=${wa}&text=Quiero%20hablar%20con%20un%20experto`;

  return (
    <div style={{ fontFamily: 'Sora, sans-serif', background: '#f8fafc', color: '#181B1C' }}>

      {/* ── 1. HERO ──────────────────────────────────────────────────────── */}
      <section style={{ background: 'linear-gradient(135deg, #2A4899 0%, #1e3576 100%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 30% 60%, rgba(133,198,57,0.1) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ ...S.inner, padding: '5rem 2rem 3rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'center', position: 'relative' }}>
          {/* Left */}
          <div>
            <span style={{ ...S.kicker, fontSize: '11px', marginBottom: '16px' }}>{c.hero.kicker}</span>
            <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, color: '#fff', margin: '0 0 1.25rem', lineHeight: 1.1, letterSpacing: '-0.02em', fontFamily: 'Sora, sans-serif' }}>
              Fabricamos la química que <span style={S.green}>mueve</span> la industria colombiana.
            </h1>
            <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.75, margin: '0 0 2rem', fontFamily: 'Sora, sans-serif', maxWidth: '520px' }}>
              {c.hero.subtitulo}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              {c.hero.botones.map((btn: any, i: number) => (
                btn.tipo === 'whatsapp'
                  ? <a key={i} href={waHref} target="_blank" rel="noopener noreferrer"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#85C639', color: '#181B1C', padding: '13px 26px', borderRadius: '50px', fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', textDecoration: 'none' }}>
                      {btn.texto}
                    </a>
                  : <a key={i} href={btn.url} download={btn.download || undefined}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', border: '2px solid rgba(255,255,255,0.5)', color: '#fff', padding: '11px 24px', borderRadius: '50px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', textDecoration: 'none' }}>
                      {btn.texto}
                    </a>
              ))}
            </div>
          </div>
          {/* Right — mascota */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <img src={c.hero.imagen} alt="CAP mascota INCAP" style={{ maxHeight: '420px', maxWidth: '100%', objectFit: 'contain', filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.3))' }} />
          </div>
        </div>
        {/* Stats row */}
        <div style={{ ...S.inner, padding: '0 2rem 3rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
          {c.hero.stats.map((st: any, i: number) => (
            <div key={i} style={{ background: '#fff', borderRadius: '0 16px 16px 16px', padding: '18px 20px', textAlign: 'center', boxShadow: '14px 12px 24px rgba(0,0,0,0.28)' }}>
              <div style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 900, color: '#2A4899', fontFamily: 'Sora, sans-serif', lineHeight: 1 }}>{st.valor}</div>
              <div style={{ fontSize: '10px', color: '#2A4899', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '6px', fontFamily: 'Sora, sans-serif' }}>{st.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 2. SOMOS GRUPO INCAP ─────────────────────────────────────────── */}
      <section style={{ background: '#fff', ...S.sectionPad }}>
        <div style={{ ...S.inner, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'start' }}>
          <div>
            <span style={S.kicker}>Quiénes somos</span>
            <h2 style={{ ...S.h2, marginBottom: '1.5rem' }}>
              Somos<br />Grupo INCAP<br />La casa de<br />
              <span style={{ color: '#2A4899' }}>INCAP S.A.</span> y <span style={{ color: '#85C639' }}>JAB</span>
            </h2>
            <p style={S.body}>{c.somos.intro}</p>
          </div>
          <div style={{ display: 'grid', gap: '1.25rem' }}>
            {c.somos.marcas.map((m: any, i: number) => (
              <div key={i} style={{ background: m.color, borderRadius: '0 16px 16px 16px', padding: '1.75rem 1.75rem 1.85rem', boxShadow: '0 10px 30px rgba(24,27,28,0.12)' }}>
                <span style={{ fontSize: '9px', fontWeight: 700, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.25em', textTransform: 'uppercase' as const, display: 'block', marginBottom: '14px' }}>{m.tag}</span>
                {m.imagen && <img src={m.imagen} alt={m.tag} style={{ height: '38px', width: 'auto', objectFit: 'contain', display: 'block', marginBottom: '16px' }} />}
                <p style={{ fontSize: '13.5px', color: 'rgba(255,255,255,0.92)', lineHeight: 1.7, margin: 0, fontFamily: 'Sora, sans-serif' }}>{m.descripcion}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. MISIÓN / VISIÓN ───────────────────────────────────────────── */}
      <section style={{ background: '#fff', ...S.sectionPad, paddingTop: 0 }}>
        <div style={S.inner}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            <div style={{ background: '#fff', borderRadius: '16px', padding: '2.25rem', boxShadow: '0 12px 30px rgba(24,27,28,0.12)' }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#2A4899', margin: '0 0 0.85rem', fontFamily: 'Sora, sans-serif' }}>Misión</h3>
              <p style={{ fontSize: '15px', color: '#374151', lineHeight: 1.8, margin: 0, fontFamily: 'Sora, sans-serif' }}>{c.misionVision.mision}</p>
            </div>
            <div style={{ background: '#fff', borderRadius: '16px', padding: '2.25rem', boxShadow: '0 12px 30px rgba(24,27,28,0.12)' }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#2A4899', margin: '0 0 0.85rem', fontFamily: 'Sora, sans-serif' }}>Visión</h3>
              <p style={{ fontSize: '15px', color: '#374151', lineHeight: 1.8, margin: 0, fontFamily: 'Sora, sans-serif' }}>{c.misionVision.vision}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. PILARES ───────────────────────────────────────────────────── */}
      <section style={{ background: '#fff', ...S.sectionPad }}>
        <div style={S.inner}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span style={{ ...S.kicker, color: '#2A4899', fontSize: 'clamp(1rem, 2vw, 1.4rem)', letterSpacing: '0.18em' }}>{c.pilares.kicker}</span>
            <h2 style={{ ...S.h2, color: '#85C639', textTransform: 'uppercase' }}>{c.pilares.titulo}</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
            {c.pilares.items.map((p: any, i: number) => (
              <div key={i} style={{ ...S.card, borderRadius: '0 16px 16px 16px', textAlign: 'center' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: '#2A4899', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                  {PILAR_ICONS[p.titulo] ?? <IconCheck />}
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 900, color: '#181B1C', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 0.75rem' }}>{p.titulo}</h3>
                <p style={S.bodyMuted}>{p.descripcion}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. MARCAS DEL GRUPO (logos) ─────────────────────────────────── */}
      <section style={{ background: '#f1f5f9', ...S.sectionPad }}>
        <div style={S.inner}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span style={{ ...S.kicker, color: '#2A4899', fontSize: 'clamp(1rem, 2vw, 1.4rem)', letterSpacing: '0.18em' }}>{c.marcasGrupo.kicker}</span>
            <h2 style={{ ...S.h2, textTransform: 'uppercase' }}>{c.marcasGrupo.titulo}</h2>
          </div>
          {/* INCAP — marca principal, centrada y grande */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2.25rem' }}>
            {c.marcasGrupo.logos.filter((l: any) => l.nombre === 'INCAP').map((logo: any) => (
              <img key={logo.nombre} src={logo.src} alt={logo.nombre} style={{ height: '80px', width: 'auto', objectFit: 'contain' }} />
            ))}
          </div>
          {/* Resto de marcas — 50% del tamaño de INCAP */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: '2.5rem' }}>
            {c.marcasGrupo.logos.filter((l: any) => l.nombre !== 'INCAP').map((logo: any) => (
              <img key={logo.nombre} src={logo.src} alt={logo.nombre}
                style={{ height: '40px', width: 'auto', objectFit: 'contain', filter: 'grayscale(0.6)', opacity: 0.8, transition: 'filter 0.25s, opacity 0.25s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLImageElement).style.filter = 'grayscale(0)'; (e.currentTarget as HTMLImageElement).style.opacity = '1'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLImageElement).style.filter = 'grayscale(0.6)'; (e.currentTarget as HTMLImageElement).style.opacity = '0.8'; }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. INDUSTRIAS ────────────────────────────────────────────────── */}
      <section style={{ background: '#fff', ...S.sectionPad }}>
        <div style={S.inner}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span style={{ ...S.kicker, color: '#2A4899', fontSize: 'clamp(1rem, 2vw, 1.4rem)', letterSpacing: '0.18em' }}>{c.industrias.kicker}</span>
            <h2 style={{ ...S.h2, textTransform: 'uppercase' }}>{c.industrias.titulo}</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
            {c.industrias.items.map((ind: any, i: number) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', background: '#2A4899', borderRadius: '0 16px 16px 16px', padding: '1.75rem', boxShadow: '0 2px 12px rgba(42,72,153,0.15)' }}>
                <div style={{ display: 'flex', gap: '14px', alignItems: 'center', marginBottom: '1rem' }}>
                  {(ind.icons ?? [ind.icon]).map((ic: string, k: number) => (
                    <img key={k} src={ic} alt={ind.nombre} style={{ width: '46px', height: '46px', objectFit: 'contain' }} />
                  ))}
                </div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 900, color: '#fff', margin: '0 0 0.625rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{ind.nombre}</h3>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.72)', lineHeight: 1.65, margin: '0 0 1.25rem', fontFamily: 'Sora, sans-serif', flex: 1 }}>{ind.descripcion}</p>
                <a href={ind.href} style={{ alignSelf: 'flex-start', background: '#85C639', color: '#fff', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.12em', padding: '9px 18px', borderRadius: '50px', textDecoration: 'none' }}>Ver soluciones →</a>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center' }}>
            <a href={c.industrias.ctaUrl}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#85C639', color: '#181B1C', padding: '13px 28px', borderRadius: '50px', fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', textDecoration: 'none' }}>
              {c.industrias.ctaTexto} →
            </a>
          </div>
        </div>
      </section>

      {/* ── 7. HISTORIA + TIMELINE ───────────────────────────────────────── */}
      <section style={{ background: '#f1f5f9', ...S.sectionPad }}>
        <div style={S.inner}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'center', marginBottom: '3.5rem' }}>
            <div>
              <span style={S.kicker}>{c.historia.kicker}</span>
              <h2 style={S.h2}>
                Una compañía fundada sobre la <span style={S.green}>precisión química</span>
              </h2>
              {c.historia.parrafos.map((p: string, i: number) => (
                <p key={i} style={S.body}>{p}</p>
              ))}
            </div>
            <div>
              <img src={c.historia.imagen} alt="Historia INCAP" style={{ width: '100%', borderRadius: '20px', objectFit: 'cover', maxHeight: '400px', boxShadow: '0 8px 40px rgba(42,72,153,0.15)' }} />
            </div>
          </div>
          {/* Timeline horizontal */}
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', top: '20px', left: '0', right: '0', height: '2px', background: 'linear-gradient(90deg, #2A4899, #85C639)', borderRadius: '2px', zIndex: 0 }} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', position: 'relative', zIndex: 1 }}>
              {c.historia.timeline.map((h: any, i: number) => (
                <div key={i} style={{ paddingTop: '48px', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: '12px', left: '0', width: '16px', height: '16px', borderRadius: '50%', background: '#85C639', border: '3px solid #fff', boxShadow: '0 0 0 2px #85C639' }} />
                  <div style={{ fontSize: '13px', fontWeight: 900, color: '#85C639', marginBottom: '6px', fontFamily: 'Sora, sans-serif' }}>{h.año}</div>
                  <p style={{ ...S.bodyMuted, fontSize: '12px' }}>{h.texto}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 8. MASCOTA CAP ───────────────────────────────────────────────── */}
      <section style={{ background: '#2A4899', ...S.sectionPad }}>
        <div style={S.inner}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'center', marginBottom: '3rem' }}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <img src={c.mascota.imagen} alt="CAP mascota INCAP" style={{ maxHeight: '420px', maxWidth: '100%', objectFit: 'contain', filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.3))' }} />
            </div>
            <div>
              <span style={S.kicker}>{c.mascota.kicker}</span>
              <h2 style={S.h2White}>
                Conoce a <span style={S.green}>CAP</span>: la fuerza y la frescura tienen nuevo rostro
              </h2>
              {c.mascota.parrafos.map((p: string, i: number) => (
                <p key={i} style={{ fontSize: '15px', color: 'rgba(255,255,255,0.8)', lineHeight: 1.8, fontFamily: 'Sora, sans-serif', margin: '0 0 1rem' }}>{p}</p>
              ))}
            </div>
          </div>
          {/* Cards mascota */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            {c.mascota.cards.map((card: any, i: number) => (
              <div key={i} style={{
                borderRadius: '16px',
                padding: '1.5rem',
                background: card.destacado ? '#85C639' : '#fff',
                border: '1px solid rgba(255,255,255,0.9)',
                boxShadow: '0 0 16px rgba(255,255,255,0.45)',
              }}>
                <h3 style={{ fontSize: '0.9rem', fontWeight: 900, color: card.destacado ? '#fff' : '#2A4899', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 0.625rem' }}>{card.titulo}</h3>
                <p style={{ fontSize: '13px', color: card.destacado ? 'rgba(255,255,255,0.95)' : 'rgba(42,72,153,0.85)', lineHeight: 1.7, margin: 0, fontFamily: 'Sora, sans-serif' }}>{card.descripcion}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 9. FABRICACIÓN PROPIA ────────────────────────────────────────── */}
      <section style={{ background: '#2A4899', ...S.sectionPad, paddingTop: 0 }}>
        <div style={S.inner}>
          <span style={S.kicker}>{c.fabricacion.kicker}</span>
          <h2 style={{ ...S.h2White, maxWidth: '700px', marginBottom: '1.5rem' }}>
            Fabricamos la mayoría de lo que vendemos. Y <span style={S.green}>lo diseñamos nosotros</span>.
          </h2>
          {c.fabricacion.parrafos.map((p: string, i: number) => (
            <p key={i} style={{ ...S.body, color: 'rgba(255,255,255,0.85)', maxWidth: '780px' }}>{p}</p>
          ))}
          {/* Caso Formicentro */}
          <div style={{ ...S.card, marginTop: '2.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', alignItems: 'center' }}>
            <div>
              <p style={{ ...S.bodyMuted, fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px', color: '#94a3b8' }}>{c.fabricacion.caso.titulo}</p>
              {c.fabricacion.caso.logo && <img src={c.fabricacion.caso.logo} alt="Formicentro" style={{ height: '36px', objectFit: 'contain', marginBottom: '1rem' }} />}
              {c.fabricacion.caso.parrafos.map((p: string, i: number) => (
                <p key={i} style={S.bodyMuted}>{p}</p>
              ))}
            </div>
            {/* Video placeholder */}
            {(c.fabricacion.caso.videoPlaceholder || !c.fabricacion.caso.videoUrl) && (
              <div style={{ aspectRatio: '16/9', background: '#f1f5f9', border: '2px dashed #cbd5e1', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="#94a3b8" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10" /><polygon points="10 8 16 12 10 16 10 8" fill="#94a3b8" stroke="none" />
                </svg>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Video Reel</span>
                <span style={{ fontSize: '11px', color: '#cbd5e1', fontFamily: 'Sora, sans-serif' }}>Próximamente</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── 10. EL 3% / 100% ────────────────────────────────────────────── */}
      <section style={{ background: '#f1f5f9', ...S.sectionPad }}>
        <div style={S.inner}>
          <h2 style={{ ...S.h2, maxWidth: '800px', marginBottom: '1rem' }}>
            Soluciones adhesivas industriales en Colombia: el <span style={S.green}>3%</span> de su inversión que asegura el <span style={S.green}>100%</span> de su producto
          </h2>
          <p style={{ ...S.body, maxWidth: '720px', marginBottom: '2.5rem' }}>{c.valor3por100.intro}</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {c.valor3por100.cards.map((card: any, i: number) => (
              <div key={i} style={S.card}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 900, color: '#85C639', textTransform: 'uppercase', letterSpacing: '0.04em', margin: '0 0 0.75rem', lineHeight: 1.3 }}>{card.titulo}</h3>
                <p style={S.bodyMuted}>{card.descripcion}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 11. ALIANZAS ─────────────────────────────────────────────────── */}
      <section style={{ background: '#1e2a5e', ...S.sectionPad }}>
        <div style={{ ...S.inner, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'center' }}>
          <div>
            <h2 style={S.h2White}>
              Alianzas que <span style={S.green}>construyen país</span>
            </h2>
            <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.8, fontFamily: 'Sora, sans-serif', margin: '0 0 1.75rem' }}>{c.alianzas.intro}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {c.alianzas.ciudades.map((ciudad: string) => (
                <span key={ciudad} style={{ display: 'inline-block', background: '#85C639', color: '#181B1C', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', padding: '5px 12px', borderRadius: '20px' }}>
                  {ciudad}
                </span>
              ))}
            </div>
          </div>
          <div>
            <img src={c.alianzas.mapa} alt="Mapa de alianzas INCAP en Colombia" style={{ width: '100%', borderRadius: '16px', objectFit: 'contain', maxHeight: '420px' }} />
          </div>
        </div>
      </section>

      {/* ── 12. INNOVACIÓN (BIDON BOX) ───────────────────────────────────── */}
      <section style={{ background: '#fff', ...S.sectionPad }}>
        <div style={{ ...S.inner, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'center' }}>
          <div>
            <span style={S.kicker}>Sostenibilidad</span>
            <h2 style={S.h2}>
              Innovación que <span style={S.green}>cuida el planeta</span>
            </h2>
            {c.innovacion.parrafos.map((p: string, i: number) => (
              <p key={i} style={S.body}>{p}</p>
            ))}
            <div style={{ display: 'grid', gap: '1rem', marginTop: '1.5rem' }}>
              {c.innovacion.features.map((f: any, i: number) => (
                <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <img src={f.icon} alt={f.titulo} style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 900, color: '#85C639', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '3px' }}>{f.titulo}</div>
                    <p style={{ ...S.bodyMuted, fontSize: '12px' }}>{f.descripcion}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <img src={c.innovacion.imagen} alt="CAP con Bidon Box INCAP" style={{ maxHeight: '460px', maxWidth: '100%', objectFit: 'contain', filter: 'drop-shadow(0 20px 40px rgba(42,72,153,0.2))' }} />
          </div>
        </div>
      </section>

      {/* ── 13. FALLAS CTA ───────────────────────────────────────────────── */}
      <section style={{ background: '#181B1C', ...S.sectionPad }}>
        <div style={{ ...S.inner, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 900, color: '#fff', margin: '0 0 0.5rem', lineHeight: 1, letterSpacing: '-0.02em', fontFamily: 'Sora, sans-serif' }}>
              ¿Fallas de <span style={S.green}>PEGUE?</span>
            </h2>
            <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.6)', fontFamily: 'Sora, sans-serif', margin: '0 0 2rem', lineHeight: 1.6 }}>{c.fallasCta.subtitulo}</p>
            {c.fallasCta.parrafos.map((p: string, i: number) => (
              <p key={i} style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.8, fontFamily: 'Sora, sans-serif', margin: '0 0 1rem' }}>{p}</p>
            ))}
            <a href={waHref} target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#85C639', color: '#181B1C', padding: '16px 32px', borderRadius: '50px', fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', textDecoration: 'none', marginTop: '1rem' }}>
              {c.fallasCta.boton.texto} →
            </a>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', opacity: 0.15 }}>
            <img src={c.hero.imagen} alt="" aria-hidden="true" style={{ maxHeight: '360px', maxWidth: '100%', objectFit: 'contain' }} />
          </div>
        </div>
      </section>

    </div>
  );
}

export const layout = {
  areaId: 'content',
  sortOrder: 1,
};
