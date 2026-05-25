import React from 'react';

interface FooterProps {
  setting?: {
    storePhoneNumber?: string;
    storeAddress?: string;
    storeCity?: string;
    storeWhatsappNumber?: string;
    storeEmail?: string;
  };
}

const navLinks = [
  { label: 'Quiénes Somos', href: '/quienes-somos' },
  { label: 'Catálogo', href: '/catalog' },
  { label: 'Fabricantes', href: '/fabricantes' },
  { label: 'Distribuidores', href: '/distribuidores' },
  { label: 'Blog', href: '/blog' },
];

const industryLinks = [
  { label: 'Madera y Muebles', href: '/industrias/madera' },
  { label: 'Colchones y Espumas', href: '/industrias/colchones' },
  { label: 'Calzado y Marroquinería', href: '/industrias/calzado' },
  { label: 'Hogar y Multiusos', href: '/industrias/hogar' },
];

const legalLinks = [
  { label: 'Política de datos', href: '/politica-de-datos' },
];

export default function Footer({ setting }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const phone = setting?.storePhoneNumber ?? '+57 300 217 1521';
  const address = setting?.storeAddress ?? 'Bogotá, Colombia';
  const city = setting?.storeCity ?? '';
  const whatsapp = setting?.storeWhatsappNumber ?? '573002171521';
  const email = setting?.storeEmail ?? '';

  const waHref = `https://wa.me/${whatsapp}`;

  const linkStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '13px',
    color: 'rgba(255,255,255,0.55)',
    textDecoration: 'none',
    fontFamily: 'Inter, sans-serif',
    fontWeight: 400,
    lineHeight: '2',
    transition: 'color 0.2s',
  };

  const headingStyle: React.CSSProperties = {
    fontSize: '10px',
    fontWeight: 800,
    color: '#85C639',
    letterSpacing: '0.25em',
    textTransform: 'uppercase' as const,
    marginBottom: '20px',
    fontFamily: 'Sora, sans-serif',
  };

  return (
    <footer style={{ backgroundColor: '#181B1C', borderTop: '1px solid rgba(255,255,255,0.06)', position: 'relative', zIndex: 40 }}>
      <div style={{ maxWidth: '1536px', margin: '0 auto', padding: '4rem 1.5rem 2rem' }}>

        {/* 4-column grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>

          {/* Col 1 — Logo + tagline + social */}
          <div>
            <a href="/" style={{ display: 'inline-block', marginBottom: '1.25rem', opacity: 0.85, lineHeight: 0 }}>
              <svg viewBox="0 0 231.9 68.2" style={{ height: '26px', width: 'auto' }}>
                <path fill="#ffffff" d="M69.8,40.6v-40H51.2V21h-0.5L41.9,0.6H23.6c-1.8,0-3.3,1.5-3.3,3.3v40h18.5V23.5h0.5l8.8,20.4h18.4 C68.3,43.9,69.8,42.4,69.8,40.6z"/>
                <path fill="#ffffff" d="M0,11.4c0,1.6,1.3,2.9,2.9,2.9H13L0,23.7v17.9c0,1.2,1,2.2,2.2,2.2h16.3V0.6H0V11.4z"/>
                <path fill="#ffffff" d="M112,24.9c-1.9-0.1-3.7,0.9-4.6,2.6c-0.5,0.8-1.1,1.5-1.8,2c-1.5,1-3.6,1.5-6.3,1.5c-3,0-5.3-0.7-6.7-2.1 c-1.4-1.4-2.1-3.6-2.1-6.5s0.7-5.1,2.1-6.5s3.7-2.1,6.7-2.1c2.6,0,4.5,0.5,5.9,1.5c0.7,0.5,1.2,1.2,1.7,2c1,1.7,2.9,2.7,4.8,2.5 l14-1c-0.2-6.3-2.4-11-6.8-14.1C114.6,1.5,108,0,99.1,0c-9.4,0-16.3,1.8-20.6,5.4v0c-4.4,3.6-6.5,9.2-6.5,16.9s2.2,13.3,6.6,16.9 c4.4,3.6,11.3,5.4,20.8,5.4c8.9,0,15.6-1.5,20.1-4.6c4.5-3.1,6.8-7.8,6.9-14.1L112,24.9z"/>
                <path fill="#ffffff" d="M159.3,43.9h20.4L166.5,3.8c-0.6-1.9-2.4-3.1-4.3-3.1h-24.5l-14.2,43.3h20.4l1.5-6.2h12.5L159.3,43.9z M148.1,26.6l3.3-13.6h0.5l3.3,13.6H148.1z"/>
                <path fill="#ffffff" d="M228.4,6.2c-2.4-2.5-5.2-4.1-8.6-4.7c-3.4-0.6-7.8-0.9-13.4-0.9h-24.6h0v43.3h14.7c2.1,0,3.8-1.7,3.8-3.8v-4.8 h6.1c5.6,0,10.1-0.3,13.5-0.8c3.4-0.5,6.2-2.1,8.5-4.6c2.3-2.5,3.5-6.4,3.5-11.8C231.9,12.7,230.8,8.7,228.4,6.2z M211.9,21.9 c-1,0.6-2.8,0.9-5.5,0.9v0h-6.1v-8.7h6.1c2.7,0,4.5,0.3,5.5,0.9c1,0.6,1.5,1.8,1.5,3.4C213.4,20.2,212.9,21.3,211.9,21.9z"/>
              </svg>
            </a>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', fontFamily: 'Inter, sans-serif', lineHeight: 1.7, marginBottom: '1.5rem', maxWidth: '220px' }}>
              Adhesivos industriales de alto rendimiento para la industria colombiana.
            </p>
            {/* Social — placeholders until URLs are configured */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <a href={waHref} target="_blank" rel="noopener noreferrer" title="WhatsApp" style={{ width: '34px', height: '34px', borderRadius: '8px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#85C639">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
              <a href="#" title="Instagram" style={{ width: '34px', height: '34px', borderRadius: '8px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="rgba(255,255,255,0.5)">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="#" title="Facebook" style={{ width: '34px', height: '34px', borderRadius: '8px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="rgba(255,255,255,0.5)">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Col 2 — Empresa */}
          <div>
            <div style={headingStyle}>Empresa</div>
            <nav>
              {navLinks.map(link => (
                <a key={link.href} href={link.href} style={linkStyle}
                  onMouseEnter={e => (e.currentTarget.style.color = '#ffffff')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')}>
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Col 3 — Industrias */}
          <div>
            <div style={headingStyle}>Industrias</div>
            <nav>
              {industryLinks.map(link => (
                <a key={link.href} href={link.href} style={linkStyle}
                  onMouseEnter={e => (e.currentTarget.style.color = '#ffffff')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')}>
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Col 4 — Contacto */}
          <div>
            <div style={headingStyle}>Contacto</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Phone */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#85C639" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '3px' }}>
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5 19.79 19.79 0 0 1 1.57 5a2 2 0 0 1 1.95-2.18h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 10.1a16 16 0 0 0 6 6l.82-.82a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21.26 17.5z"/>
                </svg>
                <a href={`tel:${phone.replace(/\s/g, '')}`} style={{ ...linkStyle, lineHeight: 1.4 }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#ffffff')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')}>
                  {phone}
                </a>
              </div>

              {/* WhatsApp */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#85C639" style={{ flexShrink: 0, marginTop: '3px' }}>
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                <a href={waHref} target="_blank" rel="noopener noreferrer" style={{ ...linkStyle, lineHeight: 1.4 }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#ffffff')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')}>
                  WhatsApp Asesoría
                </a>
              </div>

              {/* Email */}
              {email && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#85C639" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '3px' }}>
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  <a href={`mailto:${email}`} style={{ ...linkStyle, lineHeight: 1.4 }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#ffffff')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')}>
                    {email}
                  </a>
                </div>
              )}

              {/* Address */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#85C639" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '3px' }}>
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.55)', fontFamily: 'Inter, sans-serif', lineHeight: 1.6 }}>
                  {address}{city ? `, ${city}` : ''}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: '1.5rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>

          {/* Left: copyright */}
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', fontFamily: 'Sora, sans-serif', fontWeight: 600, letterSpacing: '0.08em' }}>
            © {currentYear} Grupo INCAP · Calidad que se repite
          </div>

          {/* Center: legal links */}
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            {legalLinks.map(link => (
              <a key={link.href} href={link.href} style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', fontFamily: 'Sora, sans-serif', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}>
                {link.label}
              </a>
            ))}
          </div>

          {/* Right: MTM credit + Colombia badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.2)', fontFamily: 'Inter, sans-serif' }}>
              Desarrollado por{' '}
              <a href="https://mtm.com.co" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,0.35)', textDecoration: 'none', fontWeight: 700 }}
                onMouseEnter={e => (e.currentTarget.style.color = '#85C639')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.35)')}>
                MTM
              </a>
            </span>
            <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.2)', fontFamily: 'Inter, sans-serif' }}>
              🇨🇴 Hecho en Colombia
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}

export const layout = {
  areaId: 'footerTop',
  sortOrder: 10,
};

export const query = `
query {
  setting {
    storePhoneNumber
    storeAddress
    storeCity
    storeEmail
    storeWhatsappNumber
  }
}
`;
