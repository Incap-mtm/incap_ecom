/**
 * Página admin /portadas-familia
 * El administrador elige, para cada familia de productos (agrupación por
 * nombre antes de " - ", ej. "Incafort"), qué variación (presentación) es
 * la imagen de portada de la card de esa familia en buscador/catálogo/industrias.
 * La selección se guarda en el setting `family_covers` (objeto JSON
 * { [familia]: uuid }) vía /api/family-covers. Familias sin portada elegida
 * siguen usando la heurística automática (pickRepresentative).
 */
import React, { useEffect, useMemo, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@components/common/ui/Card.js';
import { Button } from '@components/common/ui/Button.js';

const AZUL = '#2A4899';
const VERDE = '#85C639';

interface Variant {
  uuid: string;
  name: string;
  presentation: string;
  image: string | null;
}

interface FamilyGroup {
  family: string;
  variants: Variant[];
}

function Thumb({ url }: { url?: string | null }) {
  return (
    <div
      style={{
        width: 52,
        height: 52,
        flexShrink: 0,
        borderRadius: 8,
        border: '1px solid #e2e8f0',
        background: '#f8fafc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
      }}
    >
      {url ? (
        <img src={url} alt="" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
      ) : (
        <span style={{ fontSize: 8, color: '#cbd5e1', textAlign: 'center' }}>s/img</span>
      )}
    </div>
  );
}

export default function FamilyCoversPage() {
  const [isClient, setIsClient] = useState(false);
  const [families, setFamilies] = useState<FamilyGroup[]>([]);
  const [covers, setCovers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [term, setTerm] = useState('');
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ kind: 'idle' | 'ok' | 'error'; msg?: string }>({
    kind: 'idle'
  });

  useEffect(() => setIsClient(true), []);

  useEffect(() => {
    if (!isClient) return;
    setLoading(true);
    fetch('/api/family-covers', { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d?.families)) setFamilies(d.families);
        if (d?.covers && typeof d.covers === 'object') setCovers(d.covers);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isClient]);

  const filteredFamilies = useMemo(() => {
    const q = term.trim().toLowerCase();
    if (!q) return families;
    return families.filter((f) => f.family.toLowerCase().includes(q));
  }, [families, term]);

  const setFamilyCover = (family: string, uuid: string) => {
    setCovers((prev) => ({ ...prev, [family]: uuid }));
    setStatus({ kind: 'idle' });
  };

  const save = async () => {
    setSaving(true);
    setStatus({ kind: 'idle' });
    try {
      const res = await fetch('/api/family-covers', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ covers })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data?.error) {
        const msg =
          typeof data?.error === 'string'
            ? data.error
            : (data?.error?.message as string | undefined) || 'Error al guardar.';
        setStatus({ kind: 'error', msg });
      } else {
        setStatus({ kind: 'ok', msg: 'Portadas guardadas.' });
      }
    } catch (e: unknown) {
      setStatus({ kind: 'error', msg: e instanceof Error ? e.message : 'Error de conexión.' });
    } finally {
      setSaving(false);
    }
  };

  const statusColor = status.kind === 'ok' ? VERDE : status.kind === 'error' ? '#dc2626' : '#64748b';

  return (
    <Card>
      <CardHeader>
        <CardTitle>Portadas de familia</CardTitle>
        <CardDescription>
          Eleg&iacute; qu&eacute; presentaci&oacute;n de cada familia de productos aparece como
          imagen de portada en las cards del <strong>buscador</strong>, el{' '}
          <strong>cat&aacute;logo</strong> y las p&aacute;ginas de <strong>industrias</strong>.
          Las familias sin portada elegida usan autom&aacute;ticamente la presentaci&oacute;n de
          tama&ntilde;o intermedio.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div style={{ maxWidth: 900 }}>
          <input
            type="text"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Filtrar familias por nombre…"
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #cbd5e1',
              borderRadius: 8,
              fontSize: 14,
              marginBottom: 16
            }}
          />

          {loading ? (
            <p style={{ padding: 12, fontSize: 13, color: '#94a3b8' }}>Cargando familias…</p>
          ) : filteredFamilies.length === 0 ? (
            <p style={{ padding: 12, fontSize: 13, color: '#94a3b8' }}>
              {term.trim() ? 'Sin resultados.' : 'No hay familias con 2 o más presentaciones.'}
            </p>
          ) : (
            <div
              style={{
                border: '1px solid #e2e8f0',
                borderRadius: 8,
                maxHeight: 560,
                overflowY: 'auto'
              }}
            >
              {filteredFamilies.map((fg) => {
                const selectedUuid = covers[fg.family] || fg.variants[0]?.uuid || '';
                const selectedVariant =
                  fg.variants.find((v) => v.uuid === selectedUuid) || fg.variants[0];
                return (
                  <div
                    key={fg.family}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: 10,
                      borderBottom: '1px solid #f1f5f9'
                    }}
                  >
                    <Thumb url={selectedVariant?.image} />
                    <span
                      style={{
                        flexGrow: 1,
                        fontSize: 13,
                        fontWeight: 700,
                        color: '#1e293b',
                        minWidth: 0
                      }}
                    >
                      {fg.family}
                    </span>
                    <div style={{ position: 'relative', flexShrink: 0 }}>
                      <select
                        value={selectedUuid}
                        onChange={(e) => setFamilyCover(fg.family, e.target.value)}
                        style={{
                          padding: '6px 30px 6px 10px',
                          borderRadius: 8,
                          border: `1px solid ${covers[fg.family] ? AZUL : '#cbd5e1'}`,
                          background: covers[fg.family] ? 'rgba(42,72,153,0.06)' : '#fff',
                          color: '#1e293b',
                          fontSize: 12,
                          fontWeight: 600,
                          cursor: 'pointer',
                          minWidth: 200
                        }}
                      >
                        {fg.variants.map((v) => (
                          <option key={v.uuid} value={v.uuid}>
                            {v.presentation || v.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
            <Button onClick={save} disabled={saving || loading}>
              {saving ? 'Guardando…' : 'Guardar portadas'}
            </Button>
            {status.msg && <p style={{ fontSize: 13, color: statusColor, margin: 0 }}>{status.msg}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export const layout = {
  areaId: 'content',
  sortOrder: 10
};
