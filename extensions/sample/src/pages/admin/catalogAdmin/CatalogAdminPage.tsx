/**
 * Página admin /catalog-admin — gestiona el botón "Descargar Catálogo" del header.
 *
 * Permite actualizar (se actualiza cada mes):
 *   - el PDF del catálogo (subida al volumen de media → /assets/catalogo/...)
 *   - el texto del botón
 *
 * Ambos se guardan en settings (catalog_url, catalog_button_text) vía
 * POST /api/catalog-config y se leen en el Navbar por GraphQL.
 */
import React, { useState, useRef } from 'react';

const AZUL = '#2A4899';
const VERDE = '#85C639';
const BORDER = '#e2e8f0';

function extractError(data: any, fallback: string): string {
  if (typeof data?.error === 'string') return data.error;
  if (typeof data?.error?.message === 'string') return data.error.message;
  return fallback;
}

interface Props {
  setting: {
    catalogUrl: string;
    catalogButtonText: string;
    leadEmails: string;
  };
}

export default function CatalogAdminPage({ setting }: Props) {
  const [buttonText, setButtonText] = useState(setting?.catalogButtonText || 'Descargar Catálogo');
  const [currentUrl, setCurrentUrl] = useState(setting?.catalogUrl || '');
  const [leadEmails, setLeadEmails] = useState(setting?.leadEmails || '');
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleSave() {
    if (!buttonText.trim()) {
      setError('El texto del botón es requerido.');
      return;
    }
    setBusy(true);
    setError('');
    setSuccessMsg('');
    try {
      const fd = new FormData();
      fd.append('buttonText', buttonText.trim());
      fd.append('leadEmails', leadEmails.trim());
      if (file) fd.append('catalog', file);
      const res = await fetch('/api/catalog-config', {
        method: 'POST',
        credentials: 'same-origin',
        body: fd,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) {
        setError(extractError(data, 'Error al guardar la configuración.'));
      } else {
        if (data.catalogUrl) setCurrentUrl(data.catalogUrl);
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        setSuccessMsg('Catálogo actualizado correctamente.');
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

  return (
    <div style={{ fontFamily: 'Sora, sans-serif', padding: '2rem', maxWidth: '720px' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 900, color: AZUL, margin: '0 0 4px' }}>
        Catálogo descargable
      </h1>
      <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 1.5rem' }}>
        Actualizá el PDF del catálogo y el texto del botón del header (se actualiza cada mes), y
        gestioná los correos que reciben las descargas de fichas y catálogo.
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
        {/* Texto del botón */}
        <label style={labelStyle}>Texto del botón</label>
        <input
          style={{ ...inputStyle, marginBottom: '1.5rem' }}
          value={buttonText}
          onChange={(e) => setButtonText(e.target.value)}
          placeholder="Descargar Catálogo"
          maxLength={40}
        />

        {/* PDF actual */}
        <label style={labelStyle}>Catálogo actual (PDF)</label>
        {currentUrl ? (
          <a
            href={currentUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: AZUL, fontWeight: 700, textDecoration: 'none', marginBottom: '1rem' }}
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
            Ver catálogo actual →
          </a>
        ) : (
          <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '1rem' }}>Aún no hay un PDF configurado.</p>
        )}

        {/* Subir nuevo PDF */}
        <div style={{ marginTop: '0.75rem' }}>
          <label style={labelStyle}>Subir nuevo PDF <span style={{ textTransform: 'none', color: '#94a3b8', fontWeight: 400 }}>(opcional — dejalo vacío para solo cambiar el texto)</span></label>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            style={{ fontSize: '13px', fontFamily: 'Sora, sans-serif' }}
          />
          {file && (
            <p style={{ fontSize: '12px', color: '#16a34a', margin: '8px 0 0' }}>
              Nuevo archivo seleccionado: <strong>{file.name}</strong> ({(file.size / 1024 / 1024).toFixed(2)} MB)
            </p>
          )}
          <p style={{ fontSize: '11px', color: '#94a3b8', margin: '6px 0 0', lineHeight: 1.5 }}>
            Máximo 15 MB. El PDF queda en el volumen de media y se sirve en /assets/catalogo/...
          </p>
        </div>

        {/* Separador */}
        <div style={{ borderTop: `1px solid ${BORDER}`, margin: '1.75rem 0 1.5rem' }} />

        {/* Correos de notificación de leads */}
        <label style={labelStyle}>Correos de notificación de leads</label>
        <textarea
          style={{ ...inputStyle, minHeight: '70px', resize: 'vertical', fontFamily: 'Inter, sans-serif' }}
          value={leadEmails}
          onChange={(e) => setLeadEmails(e.target.value)}
          placeholder="correo1@empresa.com, correo2@empresa.com"
        />
        <p style={{ fontSize: '11px', color: '#94a3b8', margin: '6px 0 0', lineHeight: 1.5 }}>
          A estos correos llega cada descarga de <strong>ficha técnica</strong> y de <strong>catálogo</strong>.
          Podés poner varios separados por coma. Si lo dejás vacío, se usa el correo por defecto del sistema.
        </p>

        {/* Guardar */}
        <button
          type="button"
          onClick={handleSave}
          disabled={busy}
          style={{
            marginTop: '1.5rem', background: busy ? '#94a3b8' : AZUL, color: '#fff', border: 'none',
            borderRadius: '8px', padding: '11px 26px', fontSize: '12px', fontWeight: 900,
            cursor: busy ? 'not-allowed' : 'pointer', fontFamily: 'Sora, sans-serif',
            textTransform: 'uppercase', letterSpacing: '0.08em',
          }}
        >
          {busy ? 'Guardando…' : 'Guardar cambios'}
        </button>
      </div>

      <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '1rem', lineHeight: 1.6 }}>
        El botón aparece en el header (escritorio y móvil). Al hacer clic, el visitante completa un
        formulario breve y luego descarga el catálogo — igual que las fichas técnicas.
      </p>
    </div>
  );
}

export const layout = {
  areaId: 'content',
  sortOrder: 10,
};

export const query = `
  query CatalogAdminQuery {
    setting {
      catalogUrl
      catalogButtonText
      leadEmails
    }
  }
`;
