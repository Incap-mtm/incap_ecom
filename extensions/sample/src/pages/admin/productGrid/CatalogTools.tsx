import { Button } from '@components/common/ui/Button.js';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@components/common/ui/Card.js';
import React, { useState } from 'react';

type Status = { kind: 'idle' | 'loading' | 'ok' | 'error'; msg?: string };

async function callEndpoint(url: string): Promise<{ ok: boolean; data: any }> {
  const res = await fetch(url, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: '{}'
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok && data.success !== false, data };
}

export default function CatalogTools() {
  const [variants, setVariants] = useState<Status>({ kind: 'idle' });
  const [images, setImages] = useState<Status>({ kind: 'idle' });

  const runVariants = async () => {
    setVariants({ kind: 'loading' });
    try {
      const { ok, data } = await callEndpoint('/sync-variants');
      if (!ok) return setVariants({ kind: 'error', msg: data.error || 'Error al sincronizar.' });
      const s = data.summary || {};
      setVariants({
        kind: 'ok',
        msg: `Listo. Grupos creados: ${s.gruposCreados ?? 0}, productos vinculados: ${s.productosVinculados ?? 0}, nombres normalizados: ${s.nombresNormalizados ?? 0}.`
      });
    } catch (e: any) {
      setVariants({ kind: 'error', msg: e?.message || 'Error de conexión.' });
    }
  };

  const runImages = async () => {
    setImages({ kind: 'loading' });
    try {
      const { ok, data } = await callEndpoint('/optimize-images');
      if (!ok) return setImages({ kind: 'error', msg: data.error || 'Error al optimizar.' });
      setImages({
        kind: 'ok',
        msg: `Convertidas: ${data.convertidas ?? 0}, ya optimizadas: ${data.yaOptimizadas ?? 0}${data.pendientes ? `, pendientes: ${data.pendientes}` : ''}.`
      });
    } catch (e: any) {
      setImages({ kind: 'error', msg: e?.message || 'Error de conexión.' });
    }
  };

  const statusColor = (k: Status['kind']) =>
    k === 'ok' ? '#16a34a' : k === 'error' ? '#dc2626' : '#64748b';

  return (
    <Card>
      <CardHeader>
        <CardTitle>Herramientas de carga de catálogo</CardTitle>
        <CardDescription>
          Tras crear o editar productos, ejecutá estas acciones para reflejar los cambios en la tienda.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="flex-1">
            <Button variant="outline" onClick={runVariants} disabled={variants.kind === 'loading'}>
              {variants.kind === 'loading' ? 'Sincronizando…' : 'Sincronizar variantes'}
            </Button>
            <p className="text-xs mt-2" style={{ color: statusColor(variants.kind) }}>
              {variants.msg || 'Agrupa productos por familia (Tamaño) para el selector en la ficha.'}
            </p>
          </div>
          <div className="flex-1">
            <Button variant="outline" onClick={runImages} disabled={images.kind === 'loading'}>
              {images.kind === 'loading' ? 'Optimizando…' : 'Optimizar imágenes a WebP'}
            </Button>
            <p className="text-xs mt-2" style={{ color: statusColor(images.kind) }}>
              {images.msg || 'Convierte a WebP las imágenes nuevas subidas al servidor.'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export const layout = {
  areaId: 'content',
  sortOrder: 5
};
