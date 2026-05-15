import React from 'react';

export default function Hello() {
  return null;
}

function _unused() {
  return (
    <div style={{ background: 'linear-gradient(135deg, #2A4899 0%, #1e3576 100%)', color: 'white', boxShadow: '0 4px 24px rgba(42,72,153,0.3)', borderRadius: '0 0 1rem 1rem', overflow: 'hidden', position: 'relative' }}>
      <div style={{ maxWidth: '100%', padding: '1.25rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem' }}>
        {/* Left: brand + message */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ background: 'rgba(255,255,255,0.12)', borderRadius: '0.75rem', padding: '0.625rem 1rem', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)' }}>
            <span style={{ fontSize: '11px', fontWeight: 900, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#85C639' }}>INCAP</span>
            <span style={{ fontSize: '11px', fontWeight: 900, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', marginLeft: '6px' }}>Admin</span>
          </div>
          <div>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', margin: 0 }}>Panel de administración — Bienvenido</p>
          </div>
        </div>

        {/* Right: image */}
        <img
          src="/images/sections/Fallas_De_Pegue_contacto.png"
          alt="INCAP"
          style={{ height: '72px', width: 'auto', objectFit: 'contain', opacity: 0.9, borderRadius: '0.5rem' }}
        />
      </div>
      <div style={{ height: '2px', background: 'linear-gradient(to right, transparent, #85C639, transparent)', opacity: 0.6 }}></div>
    </div>
  );
}

export const layout = {
  areaId: 'content',
  sortOrder: 0
};
