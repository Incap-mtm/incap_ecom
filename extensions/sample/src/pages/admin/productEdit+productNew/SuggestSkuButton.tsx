import { Button } from '@components/common/ui/Button.js';
import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';

type Status = 'idle' | 'loading' | 'ok' | 'error';

interface SuggestResult {
  sku: string;
  needsReview: boolean;
  source: 'sibling' | 'generated';
  family: string;
  size: string;
  note?: string;
}

export default function SuggestSkuButton() {
  const { getValues, setValue } = useFormContext();
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState<string>('');
  const [result, setResult] = useState<SuggestResult | null>(null);

  const handleSuggest = async () => {
    const name = getValues('name');

    if (!name || !String(name).trim()) {
      setStatus('error');
      setMessage('Escribí primero el nombre del producto.');
      setResult(null);
      return;
    }

    setStatus('loading');
    setMessage('');
    setResult(null);

    try {
      const res = await fetch('/api/suggest-sku', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: String(name).trim() })
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || data.success === false) {
        // Gotcha #4: extraer string del error para no crashear React
        const errMsg =
          typeof data.error === 'string'
            ? data.error
            : data.error?.message || 'Error al sugerir SKU.';
        setStatus('error');
        setMessage(errMsg);
        return;
      }

      const suggestion: SuggestResult = data.data;
      // Rellenar el campo sku (shouldDirty:true para que el form lo marque como modificado)
      setValue('sku', suggestion.sku, { shouldDirty: true });

      setStatus('ok');
      setResult(suggestion);

      const parts: string[] = [];
      if (suggestion.source === 'sibling') {
        parts.push('Prefijo copiado de un producto hermano.');
      } else {
        parts.push('Prefijo generado (familia nueva).');
      }
      if (suggestion.needsReview) {
        parts.push('Revisá el SKU sugerido antes de guardar.');
      }
      if (suggestion.note) {
        parts.push(suggestion.note);
      }
      setMessage(parts.join(' '));

    } catch (e: any) {
      setStatus('error');
      setMessage(e?.message || 'Error de conexión.');
    }
  };

  const msgColor =
    status === 'ok'
      ? result?.needsReview
        ? '#b45309'   // amber: ok pero revisar
        : '#16a34a'   // verde: confiable
      : status === 'error'
      ? '#dc2626'     // rojo
      : '#64748b';    // gris: idle/loading

  return (
    <div style={{ marginTop: '4px', marginBottom: '4px' }}>
      <Button
        variant="outline"
        onClick={(e: React.MouseEvent) => {
          e.preventDefault();
          handleSuggest();
        }}
        disabled={status === 'loading'}
      >
        {status === 'loading' ? 'Sugiriendo…' : 'Sugerir SKU'}
      </Button>
      {message && (
        <p style={{ fontSize: '12px', marginTop: '6px', color: msgColor }}>
          {message}
        </p>
      )}
    </div>
  );
}

export const layout = {
  areaId: 'productEditGeneral',
  sortOrder: 21
};
