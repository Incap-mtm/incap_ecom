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
const IconHeart = () => (React.createElement("svg", { width: "28", height: "28", viewBox: "0 0 24 24", fill: "none", stroke: "#fff", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" },
    React.createElement("path", { d: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" })));
const IconCheck = () => (React.createElement("svg", { width: "28", height: "28", viewBox: "0 0 24 24", fill: "none", stroke: "#fff", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" },
    React.createElement("polyline", { points: "9 11 12 14 22 4" }),
    React.createElement("path", { d: "M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" })));
const IconGroup = () => (React.createElement("svg", { width: "28", height: "28", viewBox: "0 0 24 24", fill: "none", stroke: "#fff", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" },
    React.createElement("path", { d: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" }),
    React.createElement("circle", { cx: "9", cy: "7", r: "4" }),
    React.createElement("path", { d: "M23 21v-2a4 4 0 0 0-3-3.87" }),
    React.createElement("path", { d: "M16 3.13a4 4 0 0 1 0 7.75" })));
const PILAR_ICONS = {
    'Pasión': React.createElement(IconHeart, null),
    'Calidad': React.createElement(IconCheck, null),
    'Comunidad': React.createElement(IconGroup, null),
};
// Extrae el ID de un video de YouTube en formatos shorts / watch / youtu.be / embed.
const youtubeId = (url) => {
    if (!url)
        return null;
    const m = url.match(/(?:shorts\/|watch\?v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{11})/);
    return m ? m[1] : null;
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
            { valor: '6', label: 'Marcas especializadas del grupo' },
            { valor: '8', label: 'Industrias que servimos' },
            { valor: '18', label: 'Ciudades con cobertura nacional' },
            { valor: '100%', label: 'Industria colombiana' },
        ],
    },
    somos: {
        titulo: 'Somos Grupo INCAP',
        subtitulo: 'La casa de INCAP S.A. y JAB',
        intro: 'Nacimos en Bogotá, crecimos con Colombia y hoy somos el aliado técnico de ferreterías, fabricantes y talleres de norte a sur del territorio nacional. Bajo el paraguas de Grupo INCAP conviven dos marcas especializadas y cuatro aliados estratégicos que amplían nuestra oferta de valor. Cada marca tiene un rol específico dentro del ecosistema industrial colombiano, y juntas cubren desde el adhesivo de contacto de alta performance hasta los componentes y suministros complementarios que completan el proceso del fabricante.',
        marcas: [
            { tag: 'Marca insignia del grupo', imagen: '/images/quienes-somos/marca-incap.webp', descripcion: 'Adhesivos industriales de alto rendimiento para madera, colchones, calzado, marroquinería y más. Cinco décadas de confianza técnica en el mercado colombiano.', color: '#2A4899' },
            { tag: 'Componentes y suministros', imagen: '/images/quienes-somos/marca-jab.webp', descripcion: 'Línea de componentes y suministros complementarios que amplía la solución integral de Grupo INCAP para el fabricante colombiano.', color: '#85C639' },
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
            { titulo: 'Pasión', descripcion: 'Nos comprometemos de verdad con el resultado de cada cliente. Visitamos su planta, entendemos su proceso y resolvemos cada duda en campo.' },
            { titulo: 'Calidad', descripcion: 'Fabricamos con estándares industriales rigurosos. Cada adhesivo y componente que sale de nuestras instalaciones está respaldado por décadas de formulación y mejora continua.' },
            { titulo: 'Comunidad', descripcion: 'El verdadero motor de Grupo INCAP es su gente: operarios, distribuidores y clientes que construyen juntos el tejido industrial del país.' },
        ],
    },
    marcasGrupo: {
        kicker: 'Marcas del grupo',
        titulo: 'Seis marcas, una misma excelencia.',
        logos: [
            { nombre: 'INCAP', src: '/images/quienes-somos/logo-incap.webp' },
            { nombre: 'JAB', src: '/images/quienes-somos/logo-jab.webp' },
            { nombre: 'TECNOGI', src: '/images/quienes-somos/logo-tecnogi.webp' },
            { nombre: 'Kenda', src: '/images/quienes-somos/logo-kenda.webp' },
            { nombre: 'CT Point', src: '/images/quienes-somos/logo-ctpoint.webp' },
            { nombre: 'Intercom', src: '/images/quienes-somos/logo-intercom.webp' },
        ],
    },
    industrias: {
        kicker: 'Nuestro alcance',
        titulo: 'Industrias que servimos',
        items: [
            { nombre: 'Calzado y Marroquinería', href: '/industrias/calzado', icons: ['/images/icons/Icono_Calzado.webp', '/images/icons/Icono_Marroquineria.webp'], descripcion: 'El estándar de las grandes fábricas: adhesivos, tintas, cordones y accesorios para calzado.' },
            { nombre: 'Colchones y Espumas', href: '/industrias/colchones', icons: ['/images/icons/Icono_Colchones.webp', '/images/icons/icono_Espuma.webp'], descripcion: 'Soluciones para pegue de espumas, telas y componentes en líneas de producción de descanso.' },
            { nombre: 'Madera y Muebles', href: '/industrias/madera', icons: ['/images/icons/Icono_Maderas.webp', '/images/icons/Icono_Muebles.webp'], descripcion: 'Adhesivos para la industria del mueble: enchapes, ensambles, ebanistería y producción en serie.' },
            { nombre: 'Hogar, Manualidades y Multiusos', href: '/industrias/hogar', icons: ['/images/icons/Icono_Hogar.webp', '/images/icons/Icono_manualidades.webp', '/images/icons/Icono_Multiusos.webp'], descripcion: 'Pegamentos versátiles para reparaciones domésticas, manualidades y proyectos creativos.' },
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
            { año: '1969', texto: 'Fundación de INCAP S.A. en Bogotá con el objetivo de fabricar adhesivos de calidad superior para la industria colombiana.' },
            { año: 'Década de 1990', texto: 'Expansión hacia la industria del calzado y la marroquinería. Inicio del desarrollo de formulaciones propias libres de tolueno.' },
            { año: 'Años 2000', texto: 'Consolidación de la red nacional de distribuidores y primeras participaciones en ferias internacionales del sector adhesivo y del calzado.' },
            { año: 'Hoy', texto: 'Fabricantes de la familia MAXÓN y líderes en servicio técnico especializado para más de 8 industrias en 18 ciudades del país.' },
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
            { titulo: 'La metáfora perfecta', descripcion: 'El gecko se adhiere a cualquier superficie desafiando la gravedad. Exactamente lo que hace INCAP con sus adhesivos en cada industria.' },
            { titulo: 'Experto en terreno', descripcion: 'Casco blanco, overol azul, botas industriales. No es un dibujo etéreo: está listo para pisar la fábrica junto al operario y al jefe de planta.' },
            { titulo: 'Moderno y conectado', descripcion: 'Su celular en mano indica servicio y solución en tiempo real. CAP humaniza una marca industrial B2B haciéndola más cercana y accesible.' },
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
            logo: '/images/quienes-somos/formicentro-logo.webp',
            parrafos: [
                'Cuando un distribuidor de la talla de Formicentro necesitaba una solución de pegado que su proceso no encontraba en el mercado, INCAP no buscó en el catálogo; diseñó la fórmula desde cero.',
                'Trabajamos de forma conjunta con el equipo de planta, analizamos los materiales específicos, las condiciones de temperatura y humedad, y los tiempos de ciclo; hasta desarrollar un adhesivo que respondiera exactamente a sus exigencias de producción.',
            ],
            videoUrl: 'https://www.youtube.com/shorts/cWEAQv2p3w8',
            videoPlaceholder: false,
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
            { icon: '/images/quienes-somos/icon-menos-plastico.webp', titulo: '85% menos plástico', descripcion: 'Frente al bidón tradicional de 5 galones, el Bidon Box reduce significativamente el plástico generado por cada unidad de adhesivo consumida.' },
            { icon: '/images/quienes-somos/icon-libre-salpicaduras.webp', titulo: 'Libre de salpicaduras', descripcion: 'El sistema de vertido controlado elimina derrames accidentales, mejorando la seguridad del operario y reduciendo el desperdicio de producto.' },
            { icon: '/images/quienes-somos/icon-facil-verter.webp', titulo: 'Fácil de almacenar y verter', descripcion: 'El formato caja optimiza el espacio de bodega, es más ligero y permite vaciado completo sin residuos.' },
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
    kicker: { fontSize: '10px', fontWeight: 800, color: '#85C639', letterSpacing: '0.35em', textTransform: 'uppercase', marginBottom: '10px', display: 'block' },
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
    var _a, _b, _c, _d, _e;
    const [result] = useQuery({ query: QUERY, requestPolicy: 'cache-and-network' });
    let parsed = null;
    try {
        parsed = JSON.parse(((_b = (_a = result.data) === null || _a === void 0 ? void 0 : _a.setting) === null || _b === void 0 ? void 0 : _b.quienesSomos) || '');
    }
    catch (_f) { }
    const c = (parsed && Object.keys(parsed).length)
        ? { ...DEFAULT_CONTENT, ...parsed }
        : DEFAULT_CONTENT;
    const wa = (_e = (_d = (_c = result.data) === null || _c === void 0 ? void 0 : _c.setting) === null || _d === void 0 ? void 0 : _d.storeWhatsappNumber) !== null && _e !== void 0 ? _e : '573002171521';
    const waHref = `https://api.whatsapp.com/send?phone=${wa}&text=Quiero%20hablar%20con%20un%20experto`;
    return (React.createElement("div", { style: { fontFamily: 'Sora, sans-serif', background: '#f8fafc', color: '#181B1C' } },
        React.createElement("section", { style: { background: 'linear-gradient(135deg, #2A4899 0%, #1e3576 100%)', position: 'relative', overflow: 'hidden' } },
            React.createElement("div", { style: { position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 30% 60%, rgba(133,198,57,0.1) 0%, transparent 65%)', pointerEvents: 'none' } }),
            React.createElement("div", { style: { ...S.inner, padding: '5rem 2rem 3rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'center', position: 'relative' } },
                React.createElement("div", null,
                    React.createElement("span", { style: { ...S.kicker, fontSize: '11px', marginBottom: '16px' } }, c.hero.kicker),
                    React.createElement("h1", { style: { fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, color: '#fff', margin: '0 0 1.25rem', lineHeight: 1.1, letterSpacing: '-0.02em', fontFamily: 'Sora, sans-serif' } },
                        "Fabricamos la qu\u00EDmica que ",
                        React.createElement("span", { style: S.green }, "mueve"),
                        " la industria colombiana."),
                    React.createElement("p", { style: { fontSize: '16px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.75, margin: '0 0 2rem', fontFamily: 'Sora, sans-serif', maxWidth: '520px' } }, c.hero.subtitulo),
                    React.createElement("div", { style: { display: 'flex', flexWrap: 'wrap', gap: '12px' } }, c.hero.botones.map((btn, i) => (btn.tipo === 'whatsapp'
                        ? React.createElement("a", { key: i, href: waHref, target: "_blank", rel: "noopener noreferrer", style: { display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#85C639', color: '#181B1C', padding: '13px 26px', borderRadius: '50px', fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', textDecoration: 'none' } }, btn.texto)
                        : React.createElement("a", { key: i, href: btn.url, download: btn.download || undefined, style: { display: 'inline-flex', alignItems: 'center', gap: '8px', border: '2px solid rgba(255,255,255,0.5)', color: '#fff', padding: '11px 24px', borderRadius: '50px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', textDecoration: 'none' } }, btn.texto))))),
                React.createElement("div", { style: { display: 'flex', justifyContent: 'center' } },
                    React.createElement("img", { src: c.hero.imagen, alt: "CAP mascota INCAP", style: { maxHeight: '420px', maxWidth: '100%', objectFit: 'contain', filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.3))' } }))),
            React.createElement("div", { style: { ...S.inner, padding: '0 2rem 3rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' } }, c.hero.stats.map((st, i) => (React.createElement("div", { key: i, style: { background: '#fff', borderRadius: '0 16px 16px 16px', padding: '18px 20px', textAlign: 'center', boxShadow: '14px 12px 24px rgba(0,0,0,0.28)' } },
                React.createElement("div", { style: { fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 900, color: '#2A4899', fontFamily: 'Sora, sans-serif', lineHeight: 1 } }, st.valor),
                React.createElement("div", { style: { fontSize: '10px', color: '#2A4899', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '6px', fontFamily: 'Sora, sans-serif' } }, st.label)))))),
        React.createElement("section", { style: { background: '#fff', ...S.sectionPad } },
            React.createElement("div", { style: { ...S.inner, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'start' } },
                React.createElement("div", null,
                    React.createElement("span", { style: S.kicker }, "Qui\u00E9nes somos"),
                    React.createElement("h2", { style: { ...S.h2, marginBottom: '1.5rem' } },
                        "Somos",
                        React.createElement("br", null),
                        "Grupo INCAP",
                        React.createElement("br", null),
                        "La casa de",
                        React.createElement("br", null),
                        React.createElement("span", { style: { color: '#2A4899' } }, "INCAP S.A."),
                        " y ",
                        React.createElement("span", { style: { color: '#85C639' } }, "JAB")),
                    React.createElement("p", { style: S.body }, c.somos.intro)),
                React.createElement("div", { style: { display: 'grid', gap: '1.25rem' } }, c.somos.marcas.map((m, i) => (React.createElement("div", { key: i, style: { background: m.color, borderRadius: '0 16px 16px 16px', padding: '1.75rem 1.75rem 1.85rem', boxShadow: '0 10px 30px rgba(24,27,28,0.12)' } },
                    React.createElement("span", { style: { fontSize: '9px', fontWeight: 700, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.25em', textTransform: 'uppercase', display: 'block', marginBottom: '14px' } }, m.tag),
                    m.imagen && React.createElement("img", { src: m.imagen, alt: m.tag, style: { height: '38px', width: 'auto', objectFit: 'contain', display: 'block', marginBottom: '16px' } }),
                    React.createElement("p", { style: { fontSize: '13.5px', color: 'rgba(255,255,255,0.92)', lineHeight: 1.7, margin: 0, fontFamily: 'Sora, sans-serif' } }, m.descripcion))))))),
        React.createElement("section", { style: { background: '#fff', ...S.sectionPad, paddingTop: 0 } },
            React.createElement("div", { style: S.inner },
                React.createElement("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' } },
                    React.createElement("div", { style: { background: '#fff', borderRadius: '16px', padding: '2.25rem', boxShadow: '0 12px 30px rgba(24,27,28,0.12)' } },
                        React.createElement("h3", { style: { fontSize: '1.4rem', fontWeight: 900, color: '#2A4899', margin: '0 0 0.85rem', fontFamily: 'Sora, sans-serif' } }, "Misi\u00F3n"),
                        React.createElement("p", { style: { fontSize: '15px', color: '#374151', lineHeight: 1.8, margin: 0, fontFamily: 'Sora, sans-serif' } }, c.misionVision.mision)),
                    React.createElement("div", { style: { background: '#fff', borderRadius: '16px', padding: '2.25rem', boxShadow: '0 12px 30px rgba(24,27,28,0.12)' } },
                        React.createElement("h3", { style: { fontSize: '1.4rem', fontWeight: 900, color: '#2A4899', margin: '0 0 0.85rem', fontFamily: 'Sora, sans-serif' } }, "Visi\u00F3n"),
                        React.createElement("p", { style: { fontSize: '15px', color: '#374151', lineHeight: 1.8, margin: 0, fontFamily: 'Sora, sans-serif' } }, c.misionVision.vision))))),
        React.createElement("section", { style: { background: '#fff', ...S.sectionPad } },
            React.createElement("div", { style: S.inner },
                React.createElement("div", { style: { textAlign: 'center', marginBottom: '2.5rem' } },
                    React.createElement("span", { style: { ...S.kicker, color: '#2A4899', fontSize: 'clamp(1rem, 2vw, 1.4rem)', letterSpacing: '0.18em' } }, c.pilares.kicker),
                    React.createElement("h2", { style: { ...S.h2, color: '#85C639', textTransform: 'uppercase' } }, c.pilares.titulo)),
                React.createElement("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' } }, c.pilares.items.map((p, i) => {
                    var _a;
                    return (React.createElement("div", { key: i, style: { ...S.card, borderRadius: '0 16px 16px 16px', textAlign: 'center' } },
                        React.createElement("div", { style: { width: '56px', height: '56px', borderRadius: '14px', background: '#2A4899', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' } }, (_a = PILAR_ICONS[p.titulo]) !== null && _a !== void 0 ? _a : React.createElement(IconCheck, null)),
                        React.createElement("h3", { style: { fontSize: '1rem', fontWeight: 900, color: '#181B1C', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 0.75rem' } }, p.titulo),
                        React.createElement("p", { style: S.bodyMuted }, p.descripcion)));
                })))),
        React.createElement("section", { style: { background: '#f1f5f9', ...S.sectionPad } },
            React.createElement("div", { style: S.inner },
                React.createElement("div", { style: { textAlign: 'center', marginBottom: '2.5rem' } },
                    React.createElement("span", { style: { ...S.kicker, color: '#2A4899', fontSize: 'clamp(1rem, 2vw, 1.4rem)', letterSpacing: '0.18em' } }, c.marcasGrupo.kicker),
                    React.createElement("h2", { style: { ...S.h2, textTransform: 'uppercase' } }, c.marcasGrupo.titulo)),
                React.createElement("div", { style: { display: 'flex', justifyContent: 'center', marginBottom: '2.25rem' } }, c.marcasGrupo.logos.filter((l) => l.nombre === 'INCAP').map((logo) => (React.createElement("img", { key: logo.nombre, src: logo.src, alt: logo.nombre, style: { height: '80px', width: 'auto', objectFit: 'contain' } })))),
                React.createElement("div", { style: { display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: '2.5rem' } }, c.marcasGrupo.logos.filter((l) => l.nombre !== 'INCAP').map((logo) => (React.createElement("img", { key: logo.nombre, src: logo.src, alt: logo.nombre, style: { height: '40px', width: 'auto', objectFit: 'contain', filter: 'grayscale(0.6)', opacity: 0.8, transition: 'filter 0.25s, opacity 0.25s' }, onMouseEnter: e => { e.currentTarget.style.filter = 'grayscale(0)'; e.currentTarget.style.opacity = '1'; }, onMouseLeave: e => { e.currentTarget.style.filter = 'grayscale(0.6)'; e.currentTarget.style.opacity = '0.8'; } })))))),
        React.createElement("section", { style: { background: '#fff', ...S.sectionPad } },
            React.createElement("div", { style: S.inner },
                React.createElement("div", { style: { textAlign: 'center', marginBottom: '2.5rem' } },
                    React.createElement("span", { style: { ...S.kicker, color: '#2A4899', fontSize: 'clamp(1rem, 2vw, 1.4rem)', letterSpacing: '0.18em' } }, c.industrias.kicker),
                    React.createElement("h2", { style: { ...S.h2, textTransform: 'uppercase' } }, c.industrias.titulo)),
                React.createElement("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '2rem' } }, c.industrias.items.map((ind, i) => {
                    var _a;
                    return (React.createElement("div", { key: i, style: { display: 'flex', flexDirection: 'column', background: '#2A4899', borderRadius: '0 16px 16px 16px', padding: '1.75rem', boxShadow: '0 2px 12px rgba(42,72,153,0.15)' } },
                        React.createElement("div", { style: { display: 'flex', gap: '14px', alignItems: 'center', marginBottom: '1rem' } }, ((_a = ind.icons) !== null && _a !== void 0 ? _a : [ind.icon]).map((ic, k) => (React.createElement("img", { key: k, src: ic, alt: ind.nombre, style: { width: '46px', height: '46px', objectFit: 'contain' } })))),
                        React.createElement("h3", { style: { fontSize: '0.95rem', fontWeight: 900, color: '#fff', margin: '0 0 0.625rem', textTransform: 'uppercase', letterSpacing: '0.04em' } }, ind.nombre),
                        React.createElement("p", { style: { fontSize: '12px', color: 'rgba(255,255,255,0.72)', lineHeight: 1.65, margin: '0 0 1.25rem', fontFamily: 'Sora, sans-serif', flex: 1 } }, ind.descripcion),
                        React.createElement("a", { href: ind.href, style: { alignSelf: 'flex-start', background: '#85C639', color: '#fff', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.12em', padding: '9px 18px', borderRadius: '50px', textDecoration: 'none' } }, "Ver soluciones \u2192")));
                })),
                React.createElement("div", { style: { textAlign: 'center' } },
                    React.createElement("a", { href: c.industrias.ctaUrl, style: { display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#85C639', color: '#181B1C', padding: '13px 28px', borderRadius: '50px', fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', textDecoration: 'none' } },
                        c.industrias.ctaTexto,
                        " \u2192")))),
        React.createElement("section", { style: { background: '#f1f5f9', ...S.sectionPad } },
            React.createElement("div", { style: S.inner },
                React.createElement("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'center', marginBottom: '3.5rem' } },
                    React.createElement("div", null,
                        React.createElement("span", { style: S.kicker }, c.historia.kicker),
                        React.createElement("h2", { style: S.h2 },
                            "Una compa\u00F1\u00EDa fundada sobre la ",
                            React.createElement("span", { style: S.green }, "precisi\u00F3n qu\u00EDmica")),
                        c.historia.parrafos.map((p, i) => (React.createElement("p", { key: i, style: S.body }, p)))),
                    React.createElement("div", null,
                        React.createElement("img", { src: c.historia.imagen, alt: "Historia INCAP", style: { width: '100%', borderRadius: '20px', objectFit: 'cover', maxHeight: '400px', boxShadow: '0 8px 40px rgba(42,72,153,0.15)' } }))),
                React.createElement("div", { style: { position: 'relative' } },
                    React.createElement("div", { style: { position: 'absolute', top: '20px', left: '0', right: '0', height: '2px', background: 'linear-gradient(90deg, #2A4899, #85C639)', borderRadius: '2px', zIndex: 0 } }),
                    React.createElement("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', position: 'relative', zIndex: 1 } }, c.historia.timeline.map((h, i) => (React.createElement("div", { key: i, style: { paddingTop: '48px', position: 'relative' } },
                        React.createElement("div", { style: { position: 'absolute', top: '12px', left: '0', width: '16px', height: '16px', borderRadius: '50%', background: '#85C639', border: '3px solid #fff', boxShadow: '0 0 0 2px #85C639' } }),
                        React.createElement("div", { style: { fontSize: '13px', fontWeight: 900, color: '#85C639', marginBottom: '6px', fontFamily: 'Sora, sans-serif' } }, h.año),
                        React.createElement("p", { style: { ...S.bodyMuted, fontSize: '12px' } }, h.texto)))))))),
        React.createElement("section", { style: { background: '#2A4899', ...S.sectionPad } },
            React.createElement("div", { style: S.inner },
                React.createElement("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'center', marginBottom: '3rem' } },
                    React.createElement("div", { style: { display: 'flex', justifyContent: 'center' } },
                        React.createElement("img", { src: c.mascota.imagen, alt: "CAP mascota INCAP", style: { maxHeight: '420px', maxWidth: '100%', objectFit: 'contain', filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.3))' } })),
                    React.createElement("div", null,
                        React.createElement("span", { style: S.kicker }, c.mascota.kicker),
                        React.createElement("h2", { style: S.h2White },
                            "Conoce a ",
                            React.createElement("span", { style: S.green }, "CAP"),
                            ": la fuerza y la frescura tienen nuevo rostro"),
                        c.mascota.parrafos.map((p, i) => (React.createElement("p", { key: i, style: { fontSize: '15px', color: 'rgba(255,255,255,0.8)', lineHeight: 1.8, fontFamily: 'Sora, sans-serif', margin: '0 0 1rem' } }, p))))),
                React.createElement("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' } }, c.mascota.cards.map((card, i) => (React.createElement("div", { key: i, style: {
                        borderRadius: '16px',
                        padding: '1.5rem',
                        background: card.destacado ? '#85C639' : '#fff',
                        border: '1px solid rgba(255,255,255,0.9)',
                        boxShadow: '0 0 16px rgba(255,255,255,0.45)',
                    } },
                    React.createElement("h3", { style: { fontSize: '0.9rem', fontWeight: 900, color: card.destacado ? '#fff' : '#2A4899', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 0.625rem' } }, card.titulo),
                    React.createElement("p", { style: { fontSize: '13px', color: card.destacado ? 'rgba(255,255,255,0.95)' : 'rgba(42,72,153,0.85)', lineHeight: 1.7, margin: 0, fontFamily: 'Sora, sans-serif' } }, card.descripcion))))))),
        React.createElement("section", { style: { background: '#2A4899', ...S.sectionPad, paddingTop: 0 } },
            React.createElement("div", { style: S.inner },
                React.createElement("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'start' } },
                    React.createElement("div", null,
                        React.createElement("span", { style: S.kicker }, c.fabricacion.kicker),
                        React.createElement("h2", { style: { ...S.h2White, margin: 0 } },
                            "Fabricamos la mayor\u00EDa de lo que vendemos. Y ",
                            React.createElement("span", { style: S.green }, "lo dise\u00F1amos nosotros"),
                            ".")),
                    React.createElement("div", null, c.fabricacion.parrafos.map((p, i) => (React.createElement("p", { key: i, style: { ...S.body, color: 'rgba(255,255,255,0.85)', margin: i === 0 ? '0 0 1rem' : '0 0 1rem' } }, p))))),
                React.createElement("div", { style: { ...S.card, marginTop: '2.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', alignItems: 'center' } },
                    React.createElement("div", null,
                        React.createElement("p", { style: { fontSize: 'clamp(1.5rem, 3vw, 2.1rem)', fontWeight: 900, lineHeight: 1.15, letterSpacing: '-0.01em', margin: '0 0 1rem', color: '#181B1C', fontFamily: 'Sora, sans-serif' } }, c.fabricacion.caso.titulo),
                        c.fabricacion.caso.logo && React.createElement("img", { src: c.fabricacion.caso.logo, alt: "Formicentro", style: { height: '36px', objectFit: 'contain', marginBottom: '1rem' } }),
                        c.fabricacion.caso.parrafos.map((p, i) => (React.createElement("p", { key: i, style: S.bodyMuted }, p)))),
                    (() => {
                        const caso = c.fabricacion.caso;
                        const vid = youtubeId(caso.videoUrl || caso.videoUrlReal || '');
                        if (vid) {
                            return (React.createElement("div", { style: { aspectRatio: '9/16', maxWidth: '280px', width: '100%', margin: '0 auto', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 12px 30px rgba(24,27,28,0.18)' } },
                                React.createElement("iframe", { src: `https://www.youtube.com/embed/${vid}`, title: caso.titulo, style: { width: '100%', height: '100%', border: 0, display: 'block' }, allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share", allowFullScreen: true })));
                        }
                        return (React.createElement("div", { style: { aspectRatio: '9/16', maxWidth: '280px', width: '100%', margin: '0 auto', background: '#f1f5f9', border: '2px dashed #cbd5e1', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px' } },
                            React.createElement("svg", { width: "48", height: "48", fill: "none", viewBox: "0 0 24 24", stroke: "#94a3b8", strokeWidth: "1.5" },
                                React.createElement("circle", { cx: "12", cy: "12", r: "10" }),
                                React.createElement("polygon", { points: "10 8 16 12 10 16 10 8", fill: "#94a3b8", stroke: "none" })),
                            React.createElement("span", { style: { fontSize: '12px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.12em' } }, "Video Reel"),
                            React.createElement("span", { style: { fontSize: '11px', color: '#cbd5e1', fontFamily: 'Sora, sans-serif' } }, "Pr\u00F3ximamente")));
                    })()))),
        React.createElement("section", { style: { background: '#f1f5f9', ...S.sectionPad } },
            React.createElement("div", { style: S.inner },
                React.createElement("h2", { style: { ...S.h2, maxWidth: '800px', marginBottom: '1rem' } },
                    "Soluciones adhesivas industriales en Colombia: el ",
                    React.createElement("span", { style: S.green }, "3%"),
                    " de su inversi\u00F3n que asegura el ",
                    React.createElement("span", { style: S.green }, "100%"),
                    " de su producto"),
                React.createElement("p", { style: { ...S.body, maxWidth: '720px', marginBottom: '2.5rem' } }, c.valor3por100.intro),
                React.createElement("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' } }, c.valor3por100.cards.map((card, i) => (React.createElement("div", { key: i, style: S.card },
                    React.createElement("h3", { style: { fontSize: '0.95rem', fontWeight: 900, color: '#85C639', textTransform: 'uppercase', letterSpacing: '0.04em', margin: '0 0 0.75rem', lineHeight: 1.3 } }, card.titulo),
                    React.createElement("p", { style: S.bodyMuted }, card.descripcion))))))),
        React.createElement("section", { style: { background: 'linear-gradient(160deg, #0E032B 0%, #161449 100%)', ...S.sectionPad } },
            React.createElement("div", { style: { ...S.inner, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'center' } },
                React.createElement("div", null,
                    React.createElement("h2", { style: S.h2White },
                        "Alianzas que ",
                        React.createElement("span", { style: S.green }, "construyen pa\u00EDs")),
                    React.createElement("p", { style: { fontSize: '15px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.8, fontFamily: 'Sora, sans-serif', margin: '0 0 1.75rem' } }, c.alianzas.intro),
                    React.createElement("div", { style: { display: 'flex', flexWrap: 'wrap', gap: '8px' } }, c.alianzas.ciudades.map((ciudad) => (React.createElement("span", { key: ciudad, style: { display: 'inline-block', background: '#85C639', color: '#181B1C', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', padding: '5px 12px', borderRadius: '20px' } }, ciudad))))),
                React.createElement("div", null,
                    React.createElement("img", { src: c.alianzas.mapa, alt: "Mapa de alianzas INCAP en Colombia", style: { width: '100%', borderRadius: '16px', objectFit: 'contain', maxHeight: '420px' } })))),
        React.createElement("section", { style: { background: '#fff', ...S.sectionPad } },
            React.createElement("div", { style: { ...S.inner, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'center' } },
                React.createElement("div", null,
                    React.createElement("span", { style: S.kicker }, "Sostenibilidad"),
                    React.createElement("h2", { style: S.h2 },
                        "Innovaci\u00F3n que ",
                        React.createElement("span", { style: S.green }, "cuida el planeta")),
                    c.innovacion.parrafos.map((p, i) => (React.createElement("p", { key: i, style: S.body }, p))),
                    React.createElement("div", { style: { marginTop: '1.75rem', display: 'grid', gap: '1rem' } }, c.innovacion.features.map((f, i) => (React.createElement("div", { key: i, style: { display: 'flex', gap: '1.25rem', alignItems: 'center', background: '#2A4899', borderRadius: '0 16px 16px 16px', padding: '1.1rem 1.4rem', boxShadow: '0 10px 24px rgba(42,72,153,0.22)' } },
                        React.createElement("img", { src: f.icon, alt: f.titulo, style: { width: '84px', height: '84px', objectFit: 'contain', flexShrink: 0 } }),
                        React.createElement("div", null,
                            React.createElement("div", { style: { fontSize: '14px', fontWeight: 900, color: '#85C639', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' } }, f.titulo),
                            React.createElement("p", { style: { fontSize: '12.5px', color: 'rgba(255,255,255,0.82)', lineHeight: 1.6, margin: 0, fontFamily: 'Sora, sans-serif' } }, f.descripcion))))))),
                React.createElement("div", { style: { display: 'flex', justifyContent: 'center' } },
                    React.createElement("img", { src: c.innovacion.imagen, alt: "CAP con Bidon Box INCAP", style: { maxHeight: '690px', maxWidth: '100%', objectFit: 'contain', filter: 'drop-shadow(0 20px 40px rgba(42,72,153,0.2))' } })))),
        React.createElement("section", { style: { background: '#181B1C', ...S.sectionPad } },
            React.createElement("div", { style: { ...S.inner, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' } },
                React.createElement("div", null,
                    React.createElement("div", { style: { display: 'inline-block', background: 'rgba(133,198,57,0.1)', border: '1px solid rgba(133,198,57,0.2)', padding: '8px 22px', borderRadius: '10px', marginBottom: '1.75rem' } },
                        React.createElement("span", { style: { color: '#85C639', fontWeight: 900, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.35em' } }, "Soporte T\u00E9cnico Especializado")),
                    React.createElement("h2", { style: { fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 900, color: '#fff', margin: '0 0 1.5rem', lineHeight: 0.95, letterSpacing: '-0.03em', textTransform: 'uppercase', fontFamily: 'Sora, sans-serif' } },
                        "\u00BFFallas de ",
                        React.createElement("span", { style: S.green }, "Pegue?")),
                    React.createElement("p", { style: { fontSize: 'clamp(1.25rem, 2.5vw, 1.6rem)', color: '#fff', fontWeight: 700, lineHeight: 1.25, fontFamily: 'Sora, sans-serif', margin: '0 0 1.25rem' } }, c.fallasCta.subtitulo),
                    c.fallasCta.parrafos.map((p, i) => (React.createElement("p", { key: i, style: { fontSize: i === 0 ? '15px' : '13px', color: i === 0 ? '#94a3b8' : '#64748b', lineHeight: 1.7, fontFamily: 'Sora, sans-serif', margin: '0 0 1rem', maxWidth: '560px' } }, p))),
                    React.createElement("a", { href: waHref, target: "_blank", rel: "noopener noreferrer", style: { display: 'inline-flex', alignItems: 'center', gap: '10px', background: '#85C639', color: '#181B1C', padding: '18px 40px', borderRadius: '50px', fontSize: '14px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em', textDecoration: 'none', marginTop: '1.5rem' } }, c.fallasCta.boton.texto)),
                React.createElement("div", { style: { display: 'flex', justifyContent: 'center' } },
                    React.createElement("div", { style: { position: 'relative', maxWidth: '420px', width: '100%' } },
                        React.createElement("div", { style: { position: 'absolute', inset: '-2.5rem', background: 'rgba(42,72,153,0.2)', borderRadius: '4rem', filter: 'blur(48px)' } }),
                        React.createElement("div", { style: { position: 'relative', borderRadius: '2.5rem', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 24px 64px rgba(0,0,0,0.5)', padding: '1.5rem' } },
                            React.createElement("img", { src: "/images/sections/Fallas_De_Pegue_contacto.webp", alt: "T\u00E9cnico INCAP en planta", style: { width: '100%', height: 'auto', objectFit: 'cover', borderRadius: '1.25rem', display: 'block' } }))))))));
}
export const layout = {
    areaId: 'content',
    sortOrder: 1,
};
//# sourceMappingURL=QuienesSomosPage.js.map