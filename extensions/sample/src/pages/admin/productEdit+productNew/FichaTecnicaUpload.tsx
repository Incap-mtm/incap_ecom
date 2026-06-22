import { Button } from '@components/common/ui/Button.js';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@components/common/ui/Card.js';
import React, { useState } from 'react';

interface ProductProps {
  product?: {
    productId?: number;
    sku?: string;
    attributes?: Array<{ attributeCode: string; optionText: string }>;
  };
}

type Status = 'idle' | 'uploading' | 'ok' | 'error';
const MAX_BYTES = 1024 * 1024; // 1 MB

export default function FichaTecnicaUpload({ product }: ProductProps) {
  const productId = product?.productId;
  const current =
    product?.attributes?.find((a) => a.attributeCode === 'ficha_tecnica_url')
      ?.optionText || '';

  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');
  const [url, setUrl] = useState(current);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ''; // permitir re-seleccionar el mismo archivo
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setStatus('error');
      setMessage('El archivo debe ser un PDF.');
      return;
    }
    if (file.size > MAX_BYTES) {
      setStatus('error');
      setMessage('El PDF supera el límite de 1 MB.');
      return;
    }
    if (!productId) {
      setStatus('error');
      setMessage('Guardá el producto antes de subir la ficha.');
      return;
    }

    setStatus('uploading');
    setMessage('');
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('productId', String(productId));
      const res = await fetch('/api/upload-ficha', {
        method: 'POST',
        credentials: 'include',
        body: fd
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.success === false) {
        // Gotcha: extraer string del error para no crashear React
        const msg =
          typeof data.error === 'string'
            ? data.error
            : data.error?.message || 'Error al subir la ficha.';
        setStatus('error');
        setMessage(msg);
        return;
      }
      setStatus('ok');
      setUrl(data.url);
      setMessage('Ficha técnica subida y guardada correctamente.');
    } catch (err: any) {
      setStatus('error');
      setMessage(err?.message || 'Error de conexión.');
    }
  };

  const color =
    status === 'ok' ? '#16a34a' : status === 'error' ? '#dc2626' : '#64748b';

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ficha T&eacute;cnica (PDF)</CardTitle>
        <CardDescription>
          Sub&iacute; la ficha t&eacute;cnica del producto en PDF. Se guarda en el
          servidor y queda disponible para descarga en la p&aacute;gina del producto.
          El archivo no debe pesar m&aacute;s de 1&nbsp;MB.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!productId ? (
          <p style={{ fontSize: '13px', color: '#b45309' }}>
            Guard&aacute; el producto primero para poder subir la ficha t&eacute;cnica.
          </p>
        ) : (
          <>
            <input
              id="ficha-pdf-input"
              type="file"
              accept="application/pdf,.pdf"
              style={{ display: 'none' }}
              onChange={handleFile}
              disabled={status === 'uploading'}
            />
            <Button
              variant="outline"
              onClick={(e: React.MouseEvent) => {
                e.preventDefault();
                document.getElementById('ficha-pdf-input')?.click();
              }}
              disabled={status === 'uploading'}
            >
              {status === 'uploading'
                ? 'Subiendo…'
                : url
                ? 'Reemplazar PDF'
                : 'Subir PDF'}
            </Button>

            {url && (
              <p style={{ fontSize: '12px', marginTop: '8px', color: '#374151' }}>
                Ficha actual:{' '}
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#2A4899', fontWeight: 600 }}
                >
                  {url}
                </a>
              </p>
            )}
            <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '6px' }}>
              Solo PDF &middot; m&aacute;ximo 1&nbsp;MB
            </p>
          </>
        )}
        {message && (
          <p style={{ fontSize: '12px', marginTop: '6px', color }}>{message}</p>
        )}
      </CardContent>
    </Card>
  );
}

export const layout = {
  areaId: 'productEditGeneral',
  sortOrder: 25
};

export const query = `
  query Query {
    product(id: getContextValue("productId", null)) {
      productId
      sku
      attributes: attributeIndex {
        attributeCode
        optionText
      }
    }
  }
`;
