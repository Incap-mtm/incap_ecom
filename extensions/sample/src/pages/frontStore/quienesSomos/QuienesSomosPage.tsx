import React from 'react';

const stats = [
  { value: '+56', label: 'Años de experiencia industrial' },
  { value: '6', label: 'Marcas especializadas' },
  { value: '8', label: 'Industrias atendidas' },
  { value: '100%', label: 'Fabricado en Colombia' },
];

const brands = [
  {
    name: 'INCAP SA',
    tag: 'Marca insignia del Grupo',
    description:
      'Adhesivos industriales de alto rendimiento para madera, colchones, calzado, marroquinería y más. Cinco décadas de confianza técnica en el mercado colombiano.',
    color: '#2A4899',
    logo: null,
  },
  {
    name: 'JAB',
    tag: 'Componentes y suministros',
    description:
      'Línea de componentes y suministros complementarios que amplía la solución integral de Grupo INCAP.',
    color: '#181B1C',
    logo: null,
  },
];

const pilares = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
    title: 'Pasión',
    description:
      'Nos comprometemos de verdad con el resultado de cada cliente. Visitamos su planta, entendemos su proceso y resolvemos cada duda en campo.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 11 12 14 22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
    title: 'Calidad',
    description:
      'Fabricamos con estándares industriales rigurosos. Cada adhesivo y componente que sale de nuestras instalaciones está respaldado por décadas de formulación y mejora continua.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: 'Comunidad',
    description:
      'El verdadero motor de Grupo INCAP es su gente: operarios, distribuidores y clientes que construyen juntos el tejido industrial del país.',
  },
];

const marcasLogos = [
  { name: 'INCAP',       src: '/images/icons/incap_favicon.svg' },
  { name: 'JAB',         src: '/images/logos/jab-logo.png' },
  { name: 'CT Point',    src: '/images/logos/Logo_CT_Point.svg' },
  { name: 'TECNOGI',     src: '/images/logos/Logo_Tecno_GI.svg' },
  { name: 'Kenda Farben',src: '/images/logos/Logo_Kenda_Farben.svg' },
  { name: 'Intercom',    src: '/images/logos/Logo_Intercom.svg' },
];

const industries = [
  {
    name: 'Madera y Muebles',
    href: '/industrias/madera',
    icon: '/images/icons/Icono_Maderas.png',
    description: 'Adhesivos para la industria del mueble: enchapes, ensambles, ebanistería y producción en serie.',
    color: '#8B6914',
  },
  {
    name: 'Colchones y Espumas',
    href: '/industrias/colchones',
    icon: '/images/icons/Icono_Colchones.png',
    description: 'Soluciones para pegue de espumas, telas y componentes en líneas de producción de descanso.',
    color: '#2A4899',
  },
  {
    name: 'Calzado y Marroquinería',
    href: '/industrias/calzado',
    icon: '/images/icons/Icono_Calzado.png',
    description: 'El estándar de las grandes fábricas: adhesivos, tintas, cordones y accesorios para calzado.',
    color: '#181B1C',
  },
  {
    name: 'Hogar y Multiusos',
    href: '/industrias/hogar',
    icon: '/images/icons/Icono_Hogar.png',
    description: 'Pegamentos versátiles para reparaciones domésticas, manualidades y proyectos creativos.',
    color: '#85C639',
  },
];

export default function QuienesSomosPage() {
  return (
    <div style={{ fontFamily: 'Sora, Inter, sans-serif', background: '#f8fafc' }}>

      {/* Hero header */}
      <div style={{ background: 'linear-gradient(135deg, #2A4899 0%, #1e3576 100%)', padding: '4rem 2rem 3rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 70% 50%, rgba(133,198,57,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ fontSize: '10px', fontWeight: 700, color: '#85C639', letterSpacing: '0.35em', textTransform: 'uppercase', marginBottom: '12px' }}>
          Grupo INCAP
        </div>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, color: '#fff', margin: '0 0 1rem', letterSpacing: '-0.02em', textTransform: 'uppercase', lineHeight: 1 }}>
          QUIÉNES SOMOS
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 'clamp(14px, 2vw, 17px)', maxWidth: '680px', margin: '0 auto', lineHeight: 1.7, fontWeight: 400 }}>
          Más de 56 años construyendo la industria colombiana, un adhesivo a la vez.
        </p>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1.5rem' }}>

        {/* Intro text */}
        <div style={{ padding: '3rem 0 2rem', maxWidth: '760px' }}>
          <p style={{ fontSize: '16px', color: '#374151', lineHeight: 1.9, fontFamily: 'Inter, sans-serif', fontWeight: 400 }}>
            Grupo INCAP es la casa de <strong style={{ color: '#2A4899' }}>INCAP SA</strong> y <strong style={{ color: '#181B1C' }}>JAB</strong>, dos marcas especializadas en adhesivos y componentes industriales para las principales industrias del país. Nacimos en Bogotá, crecimos con Colombia y hoy somos el aliado técnico de ferreterías, fabricantes y talleres de norte a sur del territorio nacional.
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
          {stats.map((s, i) => (
            <div key={i} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.75rem 1.5rem', textAlign: 'center', boxShadow: '0 1px 8px rgba(42,72,153,0.06)' }}>
              <div style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 900, color: '#2A4899', lineHeight: 1, marginBottom: '0.5rem', fontFamily: 'Sora, sans-serif' }}>
                {s.value}
              </div>
              <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', lineHeight: 1.4, fontFamily: 'Inter, sans-serif' }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Marcas */}
        <div style={{ marginBottom: '4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
            <div style={{ width: '6px', height: '32px', background: '#85C639', borderRadius: '3px', flexShrink: 0 }} />
            <h2 style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 900, color: '#181B1C', margin: 0, textTransform: 'uppercase', letterSpacing: '-0.01em' }}>
              Nuestras Marcas
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {brands.map((b, i) => (
              <div key={i} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 1px 8px rgba(42,72,153,0.06)' }}>
                <div style={{ height: '6px', background: b.color }} />
                <div style={{ padding: '1.75rem' }}>
                  <div style={{ fontSize: '9px', fontWeight: 700, color: b.color, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '8px' }}>
                    {b.tag}
                  </div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#181B1C', margin: '0 0 0.75rem', letterSpacing: '-0.01em' }}>
                    {b.name}
                  </h3>
                  <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.7, margin: 0, fontFamily: 'Inter, sans-serif' }}>
                    {b.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Misión y Visión */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
          <div style={{ background: '#2A4899', borderRadius: '16px', padding: '2rem' }}>
            <div style={{ fontSize: '10px', fontWeight: 700, color: '#85C639', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '10px' }}>
              Misión
            </div>
            <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.88)', lineHeight: 1.75, margin: 0, fontFamily: 'Inter, sans-serif' }}>
              Fabricar adhesivos y componentes industriales de alta calidad que impulsen la productividad de las industrias colombianas, acompañando a cada cliente con asesoría técnica cercana y soluciones adaptadas a su proceso, sin importar el tamaño de su operación.
            </p>
          </div>
          <div style={{ background: '#181B1C', borderRadius: '16px', padding: '2rem' }}>
            <div style={{ fontSize: '10px', fontWeight: 700, color: '#85C639', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '10px' }}>
              Visión
            </div>
            <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.75, margin: 0, fontFamily: 'Inter, sans-serif' }}>
              Ser el grupo industrial de referencia en adhesivos y componentes para Colombia y la región, reconocido por la solidez de sus marcas, la profundidad de su portafolio y el compromiso humano que pone detrás de cada producto.
            </p>
          </div>
        </div>

        {/* Pilares */}
        <div style={{ marginBottom: '4rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div style={{ fontSize: '10px', fontWeight: 700, color: '#85C639', letterSpacing: '0.35em', textTransform: 'uppercase', marginBottom: '10px' }}>
              Lo que nos define
            </div>
            <h2 style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 900, color: '#181B1C', margin: 0, textTransform: 'uppercase', letterSpacing: '-0.01em' }}>
              Nuestros Tres Pilares
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
            {pilares.map((p, i) => (
              <div key={i} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '2rem', boxShadow: '0 1px 8px rgba(42,72,153,0.06)', textAlign: 'center' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: '#2A4899', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                  {p.icon}
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 900, color: '#181B1C', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 0.75rem' }}>
                  {p.title}
                </h3>
                <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.75, margin: 0, fontFamily: 'Inter, sans-serif' }}>
                  {p.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Marcas del grupo — logos */}
        <div style={{ background: '#f1f5f9', borderRadius: '16px', padding: '1.75rem 2rem', marginBottom: '4rem' }}>
          <span style={{ display: 'block', fontSize: '10px', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
            Marcas del grupo
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '2rem' }}>
            {marcasLogos.map((m) => (
              <img
                key={m.name}
                src={m.src}
                alt={m.name}
                style={{ height: '36px', width: 'auto', objectFit: 'contain', mixBlendMode: 'multiply', opacity: 0.85, transition: 'opacity 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '0.85')}
              />
            ))}
          </div>
        </div>

        {/* Industrias que servimos */}
        <div style={{ marginBottom: '4rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div style={{ fontSize: '10px', fontWeight: 700, color: '#85C639', letterSpacing: '0.35em', textTransform: 'uppercase', marginBottom: '10px' }}>
              Nuestro alcance
            </div>
            <h2 style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 900, color: '#181B1C', margin: 0, textTransform: 'uppercase', letterSpacing: '-0.01em' }}>
              Industrias que Servimos
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '1.25rem' }}>
            {industries.map((ind, i) => (
              <a key={i} href={ind.href} style={{ display: 'flex', flexDirection: 'column', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden', textDecoration: 'none', boxShadow: '0 1px 8px rgba(42,72,153,0.06)', transition: 'transform 0.2s, box-shadow 0.2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 32px rgba(42,72,153,0.14)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 8px rgba(42,72,153,0.06)'; }}
              >
                <div style={{ height: '4px', background: ind.color }} />
                <div style={{ padding: '1.5rem' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                    <img src={ind.icon} alt={ind.name} style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
                  </div>
                  <h3 style={{ fontSize: '0.9rem', fontWeight: 900, color: '#181B1C', textTransform: 'uppercase', letterSpacing: '0.04em', margin: '0 0 0.625rem' }}>
                    {ind.name}
                  </h3>
                  <p style={{ fontSize: '12px', color: '#64748b', lineHeight: 1.65, margin: '0 0 1rem', fontFamily: 'Inter, sans-serif' }}>
                    {ind.description}
                  </p>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: ind.color, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    Ver soluciones →
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', padding: '1rem 0 4rem' }}>
          <a href="/catalog" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#2A4899', color: '#fff', fontFamily: 'Sora, sans-serif', fontWeight: 800, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.2em', padding: '14px 32px', borderRadius: '50px', textDecoration: 'none', transition: 'background 0.2s' }}>
            Ver portafolio completo
            <span style={{ color: '#85C639' }}>→</span>
          </a>
        </div>
      </div>
    </div>
  );
}

export const layout = {
  areaId: 'content',
  sortOrder: 1,
};
