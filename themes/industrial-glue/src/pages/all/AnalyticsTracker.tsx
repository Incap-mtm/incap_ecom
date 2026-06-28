import { useEffect } from 'react';
import { trackEvent } from '../../utils/analytics.js';

// Tracker global de interacciones — escucha clicks en todo el documento
// (delegación) y empuja al dataLayer los eventos de WhatsApp y descargas.
// Así no hay que editar cada componente con un link, y cualquier link nuevo
// (WhatsApp o .pdf) queda trackeado automáticamente.
//
// No renderiza nada: su única función es el listener (efecto secundario).

const WHATSAPP_RE = /wa\.me\/|api\.whatsapp\.com|web\.whatsapp\.com/i;
const PDF_RE = /\.pdf(\?|#|$)/i;

export default function AnalyticsTracker(): null {
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const a = target?.closest?.('a') as HTMLAnchorElement | null;
      if (!a) return;
      const href = a.getAttribute('href') || a.href || '';
      if (!href) return;

      if (WHATSAPP_RE.test(href)) {
        trackEvent('whatsapp_click', {
          link_url: href,
          link_text: (a.textContent || '').trim().slice(0, 100),
          page_path: window.location.pathname
        });
        return;
      }

      if (PDF_RE.test(href) || a.hasAttribute('download')) {
        const clean = href.split('#')[0].split('?')[0];
        const fileName = clean.substring(clean.lastIndexOf('/') + 1) || clean;
        const dot = fileName.lastIndexOf('.');
        trackEvent('file_download', {
          file_name: fileName,
          file_extension: dot >= 0 ? fileName.slice(dot + 1).toLowerCase() : '',
          link_url: href,
          page_path: window.location.pathname
        });
      }
    };

    // Captura: corre aunque algún handler intermedio frene la propagación.
    document.addEventListener('click', handler, true);
    return () => document.removeEventListener('click', handler, true);
  }, []);

  return null;
}

export const layout = {
  areaId: 'content',
  sortOrder: 998
};
