/**
 * Página admin /orden-tamanos
 * Permite al administrador definir el orden global de aparición de los tamaños
 * de variante en la ficha de producto del storefront.
 */
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@components/common/ui/Card.js';
import { Button } from '@components/common/ui/Button.js';
import { compareSizes } from '../../../lib/sizeSort.js';

const AZUL = '#2A4899';
const VERDE = '#85C639';

interface SizeOption {
  id: number;
  text: string;
}

interface Props {
  variantSizeOrderJson: string;   // JSON string del setting (array de ids)
  sizeOptionsData: SizeOption[];  // opciones desde GraphQL
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function buildOrderedList(orderIds: number[], allOptions: SizeOption[]): SizeOption[] {
  const map = new Map(allOptions.map((o) => [o.id, o]));

  // Primero los que están en el orden guardado (en ese orden)
  const ordered: SizeOption[] = [];
  for (const id of orderIds) {
    const opt = map.get(id);
    if (opt) ordered.push(opt);
  }

  // Luego los restantes (no listados), de menor a mayor por tamaño
  const orderedIds = new Set(orderIds);
  const rest = allOptions
    .filter((o) => !orderedIds.has(o.id))
    .sort((a, b) => compareSizes(a.text, b.text));

  return [...ordered, ...rest];
}

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------
function VariantSizeOrderPage({ variantSizeOrderJson, sizeOptionsData }: Props) {
  const [items, setItems] = useState<SizeOption[]>([]);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ kind: 'idle' | 'ok' | 'error'; msg?: string }>({ kind: 'idle' });

  useEffect(() => {
    let orderIds: number[] = [];
    try {
      const parsed = JSON.parse(variantSizeOrderJson || '[]');
      if (Array.isArray(parsed)) orderIds = parsed.map(Number);
    } catch {
      orderIds = [];
    }
    setItems(buildOrderedList(orderIds, sizeOptionsData || []));
  }, [variantSizeOrderJson, sizeOptionsData]);

  const move = (index: number, direction: -1 | 1) => {
    const next = [...items];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setItems(next);
    setStatus({ kind: 'idle' });
  };

  const sortAscending = () => {
    setItems((prev) => [...prev].sort((a, b) => compareSizes(a.text, b.text)));
    setStatus({ kind: 'idle' });
  };

  const handleSave = async () => {
    setSaving(true);
    setStatus({ kind: 'idle' });
    try {
      const order = items.map((o) => o.id);
      const res = await fetch('/api/variant-size-order', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data?.error) {
        const msg =
          typeof data?.error === 'string'
            ? data.error
            : (data?.error?.message as string | undefined) || 'Error al guardar.';
        setStatus({ kind: 'error', msg });
      } else {
        setStatus({ kind: 'ok', msg: 'Orden guardado correctamente.' });
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Error de conexión.';
      setStatus({ kind: 'error', msg });
    } finally {
      setSaving(false);
    }
  };

  const statusColor = status.kind === 'ok' ? VERDE : status.kind === 'error' ? '#dc2626' : '#64748b';

  return (
    <Card>
      <CardHeader>
        <CardTitle>Orden de tamaños de variante</CardTitle>
        <CardDescription>
          Define el orden en que aparecen los tamaños en el selector de variantes de la ficha de
          producto. Por defecto se ordenan <strong>de menor a mayor</strong>; usá{' '}
          <strong>Ordenar de menor a mayor</strong> para reaplicarlo, o los botones{' '}
          <strong>Subir</strong> y <strong>Bajar</strong> para ajustarlo manualmente.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {items.length === 0 ? (
          <p style={{ color: '#6b7280', fontSize: 14 }}>
            No hay tamaños de variante registrados. Ejecutá primero "Sincronizar variantes" desde
            la grilla de productos.
          </p>
        ) : (
          <div style={{ maxWidth: 480 }}>
            <div style={{ marginBottom: 12 }}>
              <button
                onClick={sortAscending}
                style={{
                  padding: '6px 14px',
                  fontSize: 13,
                  background: '#fff',
                  color: AZUL,
                  border: `2px solid ${AZUL}`,
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontWeight: 600
                }}
                title="Reordena todos los tamaños de menor a mayor"
              >
                ↕ Ordenar de menor a mayor
              </button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr>
                  <th
                    style={{
                      textAlign: 'left',
                      padding: '8px 12px',
                      background: AZUL,
                      color: '#fff',
                      fontWeight: 600,
                      borderRadius: '4px 0 0 0'
                    }}
                  >
                    #
                  </th>
                  <th
                    style={{
                      textAlign: 'left',
                      padding: '8px 12px',
                      background: AZUL,
                      color: '#fff',
                      fontWeight: 600
                    }}
                  >
                    Tamaño
                  </th>
                  <th
                    style={{
                      textAlign: 'center',
                      padding: '8px 12px',
                      background: AZUL,
                      color: '#fff',
                      fontWeight: 600,
                      borderRadius: '0 4px 0 0'
                    }}
                  >
                    Mover
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((opt, idx) => (
                  <tr
                    key={opt.id}
                    style={{
                      background: idx % 2 === 0 ? '#f8f9fc' : '#fff',
                      borderBottom: '1px solid #e2e8f0'
                    }}
                  >
                    <td style={{ padding: '8px 12px', color: '#94a3b8', fontWeight: 500 }}>
                      {idx + 1}
                    </td>
                    <td style={{ padding: '8px 12px', color: '#1e293b', fontWeight: 500 }}>
                      {opt.text}
                    </td>
                    <td style={{ padding: '6px 12px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                        <button
                          onClick={() => move(idx, -1)}
                          disabled={idx === 0}
                          style={{
                            padding: '3px 10px',
                            fontSize: 13,
                            background: idx === 0 ? '#e2e8f0' : AZUL,
                            color: idx === 0 ? '#94a3b8' : '#fff',
                            border: 'none',
                            borderRadius: 4,
                            cursor: idx === 0 ? 'default' : 'pointer',
                            fontWeight: 600
                          }}
                          title="Subir"
                        >
                          ↑
                        </button>
                        <button
                          onClick={() => move(idx, 1)}
                          disabled={idx === items.length - 1}
                          style={{
                            padding: '3px 10px',
                            fontSize: 13,
                            background: idx === items.length - 1 ? '#e2e8f0' : AZUL,
                            color: idx === items.length - 1 ? '#94a3b8' : '#fff',
                            border: 'none',
                            borderRadius: 4,
                            cursor: idx === items.length - 1 ? 'default' : 'pointer',
                            fontWeight: 600
                          }}
                          title="Bajar"
                        >
                          ↓
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? 'Guardando…' : 'Guardar orden'}
              </Button>
              {status.msg && (
                <p style={{ fontSize: 13, color: statusColor, margin: 0 }}>{status.msg}</p>
              )}
            </div>

            <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 12 }}>
              ID de opción: {items.map((o) => o.id).join(', ')}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export const layout = {
  areaId: 'content',
  sortOrder: 10
};

export const query = `
  query VariantSizeOrderPageQuery {
    setting {
      variantSizeOrder
    }
    sizeOptions {
      id
      text
    }
  }
`;

// Evershop inyecta los campos del query como props flat si se usan en el componente.
// variantSizeOrder viene de setting.variantSizeOrder y sizeOptions del Query root.
// Para simplificar el mapeo, el componente recibe las props tal como las nombra Evershop.
export default function VariantSizeOrderPageWrapper({
  setting,
  sizeOptions
}: {
  setting: { variantSizeOrder: string };
  sizeOptions: SizeOption[];
}) {
  return (
    <VariantSizeOrderPage
      variantSizeOrderJson={setting?.variantSizeOrder || '[]'}
      sizeOptionsData={sizeOptions || []}
    />
  );
}
