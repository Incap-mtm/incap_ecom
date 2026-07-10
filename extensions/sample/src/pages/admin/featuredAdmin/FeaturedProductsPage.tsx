/**
 * Página admin /productos-destacados
 * El administrador elige (hasta 10) los productos que aparecen en el carrusel
 * "Productos Destacados" del home. La selección se guarda en el setting
 * `featured_products` (array JSON de uuids) vía /api/featured-products.
 */
import React, { useEffect, useState } from 'react';
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
const MAX = 10;

interface ProductRef {
  uuid: string;
  name: string;
  image?: string | null;
}

function Thumb({ url }: { url?: string | null }) {
  return (
    <div
      style={{
        width: 44,
        height: 44,
        flexShrink: 0,
        borderRadius: 6,
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

export default function FeaturedProductsPage() {
  const [isClient, setIsClient] = useState(false);
  const [selected, setSelected] = useState<ProductRef[]>([]);
  const [term, setTerm] = useState('');
  const [results, setResults] = useState<ProductRef[]>([]);
  const [searching, setSearching] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ kind: 'idle' | 'ok' | 'error'; msg?: string }>({
    kind: 'idle'
  });

  useEffect(() => setIsClient(true), []);

  // Cargar selección actual
  useEffect(() => {
    if (!isClient) return;
    fetch('/api/featured-products', { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d?.selected)) setSelected(d.selected);
      })
      .catch(() => {});
  }, [isClient]);

  // Búsqueda con debounce
  useEffect(() => {
    if (!isClient) return;
    const q = term.trim();
    if (q.length < 2) {
      setResults([]);
      return;
    }
    setSearching(true);
    const t = setTimeout(() => {
      fetch(`/api/featured-products?search=${encodeURIComponent(q)}`, { credentials: 'include' })
        .then((r) => r.json())
        .then((d) => setResults(Array.isArray(d?.results) ? d.results : []))
        .catch(() => setResults([]))
        .finally(() => setSearching(false));
    }, 300);
    return () => clearTimeout(t);
  }, [term, isClient]);

  const selectedUuids = new Set(selected.map((s) => s.uuid));

  const add = (p: ProductRef) => {
    if (selectedUuids.has(p.uuid)) return;
    if (selected.length >= MAX) {
      setStatus({ kind: 'error', msg: `Máximo ${MAX} productos destacados.` });
      return;
    }
    setSelected([...selected, p]);
    setStatus({ kind: 'idle' });
  };

  const removeAt = (index: number) => {
    setSelected(selected.filter((_, i) => i !== index));
    setStatus({ kind: 'idle' });
  };

  const move = (index: number, dir: -1 | 1) => {
    const next = [...selected];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setSelected(next);
    setStatus({ kind: 'idle' });
  };

  const save = async () => {
    setSaving(true);
    setStatus({ kind: 'idle' });
    try {
      const res = await fetch('/api/featured-products', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uuids: selected.map((s) => s.uuid) })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data?.error) {
        const msg =
          typeof data?.error === 'string'
            ? data.error
            : (data?.error?.message as string | undefined) || 'Error al guardar.';
        setStatus({ kind: 'error', msg });
      } else {
        setStatus({ kind: 'ok', msg: 'Productos destacados guardados.' });
      }
    } catch (e: unknown) {
      setStatus({ kind: 'error', msg: e instanceof Error ? e.message : 'Error de conexión.' });
    } finally {
      setSaving(false);
    }
  };

  const statusColor = status.kind === 'ok' ? VERDE : status.kind === 'error' ? '#dc2626' : '#64748b';
  const visibleResults = results.filter((r) => !selectedUuids.has(r.uuid));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Productos destacados</CardTitle>
        <CardDescription>
          Eleg&iacute; hasta {MAX} productos para el carrusel <strong>Productos Destacados</strong>{' '}
          del home (debajo de la secci&oacute;n de industrias). Busc&aacute; por nombre para
          agregarlos y orden&aacute;los con <strong>Subir</strong> / <strong>Bajar</strong>.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, maxWidth: 900 }}>
          {/* Columna: buscador */}
          <div>
            <p style={{ fontSize: 12, fontWeight: 700, color: '#64748b', marginBottom: 8 }}>
              Buscar producto
            </p>
            <input
              type="text"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="Escribí al menos 2 letras…"
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #cbd5e1',
                borderRadius: 8,
                fontSize: 14,
                marginBottom: 10
              }}
            />
            <div
              style={{
                border: '1px solid #e2e8f0',
                borderRadius: 8,
                maxHeight: 340,
                overflowY: 'auto'
              }}
            >
              {searching ? (
                <p style={{ padding: 12, fontSize: 13, color: '#94a3b8' }}>Buscando…</p>
              ) : visibleResults.length === 0 ? (
                <p style={{ padding: 12, fontSize: 13, color: '#94a3b8' }}>
                  {term.trim().length < 2 ? 'Escribí para buscar.' : 'Sin resultados.'}
                </p>
              ) : (
                visibleResults.map((p) => (
                  <div
                    key={p.uuid}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: 8,
                      borderBottom: '1px solid #f1f5f9'
                    }}
                  >
                    <Thumb url={p.image} />
                    <span style={{ flexGrow: 1, fontSize: 13, color: '#1e293b' }}>{p.name}</span>
                    <button
                      onClick={() => add(p)}
                      disabled={selected.length >= MAX}
                      style={{
                        padding: '4px 10px',
                        fontSize: 12,
                        fontWeight: 700,
                        background: selected.length >= MAX ? '#e2e8f0' : AZUL,
                        color: selected.length >= MAX ? '#94a3b8' : '#fff',
                        border: 'none',
                        borderRadius: 6,
                        cursor: selected.length >= MAX ? 'default' : 'pointer',
                        flexShrink: 0
                      }}
                    >
                      + Agregar
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Columna: seleccionados */}
          <div>
            <p style={{ fontSize: 12, fontWeight: 700, color: '#64748b', marginBottom: 8 }}>
              Destacados ({selected.length}/{MAX})
            </p>
            <div
              style={{
                border: '1px solid #e2e8f0',
                borderRadius: 8,
                minHeight: 100,
                maxHeight: 340,
                overflowY: 'auto'
              }}
            >
              {selected.length === 0 ? (
                <p style={{ padding: 12, fontSize: 13, color: '#94a3b8' }}>
                  Todav&iacute;a no eleg&iacute;ste productos.
                </p>
              ) : (
                selected.map((p, idx) => (
                  <div
                    key={p.uuid}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: 8,
                      borderBottom: '1px solid #f1f5f9',
                      background: idx === 0 ? 'rgba(133,198,57,0.08)' : '#fff'
                    }}
                  >
                    <span style={{ fontSize: 12, color: '#94a3b8', width: 18, textAlign: 'right' }}>
                      {idx + 1}
                    </span>
                    <Thumb url={p.image} />
                    <span style={{ flexGrow: 1, fontSize: 13, color: '#1e293b' }}>{p.name}</span>
                    <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                      <button
                        onClick={() => move(idx, -1)}
                        disabled={idx === 0}
                        title="Subir"
                        style={miniBtn(idx === 0)}
                      >
                        ↑
                      </button>
                      <button
                        onClick={() => move(idx, 1)}
                        disabled={idx === selected.length - 1}
                        title="Bajar"
                        style={miniBtn(idx === selected.length - 1)}
                      >
                        ↓
                      </button>
                      <button
                        onClick={() => removeAt(idx)}
                        title="Quitar"
                        style={{
                          ...miniBtn(false),
                          background: 'rgba(220,38,38,0.9)',
                          color: '#fff',
                          borderColor: 'transparent'
                        }}
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
          <Button onClick={save} disabled={saving}>
            {saving ? 'Guardando…' : 'Guardar destacados'}
          </Button>
          {status.msg && <p style={{ fontSize: 13, color: statusColor, margin: 0 }}>{status.msg}</p>}
        </div>
      </CardContent>
    </Card>
  );
}

function miniBtn(disabled: boolean): React.CSSProperties {
  return {
    width: 24,
    height: 24,
    fontSize: 12,
    lineHeight: 1,
    background: disabled ? '#e2e8f0' : '#fff',
    color: disabled ? '#94a3b8' : AZUL,
    border: `1px solid ${disabled ? '#e2e8f0' : AZUL}`,
    borderRadius: 6,
    cursor: disabled ? 'default' : 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0
  };
}

export const layout = {
  areaId: 'content',
  sortOrder: 10
};
