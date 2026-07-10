/**
 * Página admin /alianzas-admin — gestiona la sección "Alianzas que construyen
 * país" de la página Quiénes Somos.
 *
 * Permite al admin:
 *   - editar el título y el párrafo introductorio
 *   - agregar / quitar / editar las ciudades (pastillas)
 *   - cambiar la imagen de la derecha (se convierte a WebP en el servidor)
 *
 * Todo se guarda dentro del setting JSON `quienes_somos` vía
 * POST /api/alianzas-config y lo lee el frontstore por GraphQL (fresh del DB).
 */
import React, { useState, useRef } from 'react';
import { useQuery } from 'urql';

const AZUL = '#2A4899';
const VERDE = '#85C639';
const BORDER = '#e2e8f0';

const QUERY = `
  query AlianzasAdminQuery {
    setting {
      quienesSomos
    }
  }
`;

function extractError(data: any, fallback: string): string {
  if (typeof data?.error === 'string') return data.error;
  if (typeof data?.error?.message === 'string') return data.error.message;
  return fallback;
}

interface Alianzas {
  titulo: string;
  intro: string;
  ciudades: string[];
  mapa: string;
}

function parseAlianzas(raw: string | undefined): Alianzas {
  let a: any = {};
  try { a = JSON.parse(raw || '{}')?.alianzas || {}; } catch { a = {}; }
  return {
    titulo: typeof a.titulo === 'string' ? a.titulo : 'Alianzas que construyen país',
    intro: typeof a.intro === 'string' ? a.intro : '',
    ciudades: Array.isArray(a.ciudades) ? a.ciudades.filter((c: any) => typeof c === 'string') : [],
    mapa: typeof a.mapa === 'string' ? a.mapa : '',
  };
}

export default function AlianzasAdminPage() {
  const [result] = useQuery({ query: QUERY, requestPolicy: 'cache-and-network' });
  const initial = parseAlianzas(result.data?.setting?.quienesSomos);

  const [intro, setIntro] = useState(initial.intro);
  const [ciudades, setCiudades] = useState<string[]>(initial.ciudades);
  const [mapa, setMapa] = useState(initial.mapa);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [hydrated, setHydrated] = useState(false);
  const [busy, setBusy] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cuando la query resuelve (cache-and-network puede llegar tras el primer
  // render), rehidratamos el formulario una sola vez con los datos del setting.
  React.useEffect(() => {
    if (!hydrated && result.data?.setting?.quienesSomos) {
      const a = parseAlianzas(result.data.setting.quienesSomos);
      setIntro(a.intro);
      setCiudades(a.ciudades);
      setMapa(a.mapa);
      setHydrated(true);
    }
  }, [result.data, hydrated]);

  function updateCiudad(i: number, value: string) {
    setCiudades((prev) => prev.map((c, idx) => (idx === i ? value : c)));
  }
  function removeCiudad(i: number) {
    setCiudades((prev) => prev.filter((_, idx) => idx !== i));
  }
  function addCiudad() {
    setCiudades((prev) => [...prev, '']);
  }

  function onPickFile(f: File | null) {
    setFile(f);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(f ? URL.createObjectURL(f) : '');
  }

  async function handleSave() {
    const cleaned = ciudades.map((c) => c.trim()).filter(Boolean);
    if (!cleaned.length) {
      setError('Agregá al menos una ciudad.');
      return;
    }
    setBusy(true);
    setError('');
    setSuccessMsg('');
    try {
      const fd = new FormData();
      fd.append('intro', intro.trim());
      fd.append('ciudades', JSON.stringify(cleaned));
      if (file) fd.append('mapa', file);
      const res = await fetch('/api/alianzas-config', {
        method: 'POST',
        credentials: 'same-origin',
        body: fd,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) {
        setError(extractError(data, 'Error al guardar los cambios.'));
      } else {
        if (data.alianzas?.mapa) setMapa(data.alianzas.mapa);
        if (Array.isArray(data.alianzas?.ciudades)) setCiudades(data.alianzas.ciudades);
        setFile(null);
        if (preview) { URL.revokeObjectURL(preview); setPreview(''); }
        if (fileInputRef.current) fileInputRef.current.value = '';
        setSuccessMsg('Sección de alianzas actualizada correctamente.');
        setTimeout(() => setSuccessMsg(''), 4000);
      }
    } catch (e: any) {
      setError(e?.message || 'Error de conexión.');
    } finally {
      setBusy(false);
    }
  }

  const labelStyle: React.CSSProperties = {
    fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase',
    letterSpacing: '0.1em', display: 'block', marginBottom: '6px', fontFamily: 'Sora, sans-serif',
  };
  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 14px', border: `1px solid ${BORDER}`, borderRadius: '8px',
    fontSize: '13px', fontFamily: 'Sora, sans-serif', color: '#181B1C', outline: 'none',
    boxSizing: 'border-box', background: '#f8fafc',
  };

  const currentImg = preview || mapa;

  return (
    <div style={{ fontFamily: 'Sora, sans-serif', padding: '2rem', maxWidth: '760px' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 900, color: AZUL, margin: '0 0 4px' }}>
        Alianzas que construyen país
      </h1>
      <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 1.5rem' }}>
        Editá el título, el texto, las ciudades (pastillas) y la imagen de la sección
        "Alianzas que construyen país" de la página <strong>Quiénes Somos</strong>.
      </p>

      {error && (
        <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '8px', padding: '10px 16px', marginBottom: '1rem', color: '#dc2626', fontSize: '13px' }}>
          {error}
        </div>
      )}
      {successMsg && (
        <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '8px', padding: '10px 16px', marginBottom: '1rem', color: '#16a34a', fontSize: '13px' }}>
          {successMsg}
        </div>
      )}

      <div style={{ background: '#fff', border: `1px solid ${BORDER}`, borderRadius: '16px', padding: '1.75rem' }}>
        {/* Intro */}
        <label style={labelStyle}>Párrafo introductorio</label>
        <textarea
          style={{ ...inputStyle, minHeight: '80px', resize: 'vertical', marginBottom: '1.5rem' }}
          value={intro}
          onChange={(e) => setIntro(e.target.value)}
          placeholder="Nuestra red nacional de distribuidores…"
          maxLength={800}
        />

        {/* Ciudades */}
        <label style={labelStyle}>Ciudades (pastillas)</label>
        <p style={{ fontSize: '11px', color: '#94a3b8', margin: '0 0 10px', lineHeight: 1.5 }}>
          Cada ciudad se muestra como una pastilla verde. Agregá o quitá las que quieras.
        </p>
        <div style={{ display: 'grid', gap: '8px', marginBottom: '10px' }}>
          {ciudades.map((ciudad, i) => (
            <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input
                style={{ ...inputStyle, flex: 1 }}
                value={ciudad}
                onChange={(e) => updateCiudad(i, e.target.value)}
                placeholder="Nombre de la ciudad"
                maxLength={40}
              />
              <button
                type="button"
                onClick={() => removeCiudad(i)}
                title="Quitar ciudad"
                style={{ flexShrink: 0, width: '38px', height: '38px', borderRadius: '8px', border: '1px solid #fca5a5', background: '#fef2f2', color: '#dc2626', fontSize: '18px', fontWeight: 700, cursor: 'pointer', lineHeight: 1 }}
              >
                ×
              </button>
            </div>
          ))}
          {ciudades.length === 0 && (
            <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>Aún no hay ciudades. Agregá la primera.</p>
          )}
        </div>
        <button
          type="button"
          onClick={addCiudad}
          style={{ background: '#fff', color: AZUL, border: `1px dashed ${AZUL}`, borderRadius: '8px', padding: '9px 18px', fontSize: '12px', fontWeight: 800, cursor: 'pointer', fontFamily: 'Sora, sans-serif' }}
        >
          + Agregar ciudad
        </button>

        {/* Previsualización de pastillas */}
        {ciudades.some((c) => c.trim()) && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '14px' }}>
            {ciudades.filter((c) => c.trim()).map((c, i) => (
              <span key={i} style={{ display: 'inline-block', background: VERDE, color: '#181B1C', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', padding: '5px 12px', borderRadius: '20px' }}>
                {c.trim()}
              </span>
            ))}
          </div>
        )}

        {/* Separador */}
        <div style={{ borderTop: `1px solid ${BORDER}`, margin: '1.75rem 0 1.5rem' }} />

        {/* Imagen */}
        <label style={labelStyle}>Imagen de la derecha</label>
        {currentImg ? (
          <img
            src={currentImg}
            alt="Mapa de alianzas"
            style={{ maxWidth: '100%', maxHeight: '280px', objectFit: 'contain', borderRadius: '12px', border: `1px solid ${BORDER}`, display: 'block', marginBottom: '12px', background: '#f8fafc' }}
          />
        ) : (
          <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '12px' }}>Aún no hay imagen configurada.</p>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => onPickFile(e.target.files?.[0] || null)}
          style={{ fontSize: '13px', fontFamily: 'Sora, sans-serif' }}
        />
        {file && (
          <p style={{ fontSize: '12px', color: '#16a34a', margin: '8px 0 0' }}>
            Nueva imagen: <strong>{file.name}</strong> ({(file.size / 1024 / 1024).toFixed(2)} MB)
          </p>
        )}
        <p style={{ fontSize: '11px', color: '#94a3b8', margin: '6px 0 0', lineHeight: 1.5 }}>
          Máximo 8 MB. Se convierte a WebP (máx 1400px de ancho) y se guarda en el volumen de media.
          Dejá el campo vacío para conservar la imagen actual.
        </p>

        {/* Guardar */}
        <button
          type="button"
          onClick={handleSave}
          disabled={busy}
          style={{
            marginTop: '1.75rem', background: busy ? '#94a3b8' : AZUL, color: '#fff', border: 'none',
            borderRadius: '8px', padding: '11px 26px', fontSize: '12px', fontWeight: 900,
            cursor: busy ? 'not-allowed' : 'pointer', fontFamily: 'Sora, sans-serif',
            textTransform: 'uppercase', letterSpacing: '0.08em',
          }}
        >
          {busy ? 'Guardando…' : 'Guardar cambios'}
        </button>
      </div>
    </div>
  );
}

export const layout = {
  areaId: 'content',
  sortOrder: 10,
};
