// Helper de medición — empuja eventos al dataLayer de GTM (contenedor
// GTM-K5C72GVM, ver utils/gtm.ts). Centralizado para no duplicar la lógica
// de push entre los distintos trackers del tema.
//
// Todos los pushes son SSR-safe: durante el render en servidor `window` no
// existe, así que se ignoran sin romper.
function getDataLayer() {
    if (typeof window === 'undefined')
        return null;
    const w = window;
    w.dataLayer = w.dataLayer || [];
    return w.dataLayer;
}
/** Evento genérico (whatsapp_click, file_download, etc.). */
export function trackEvent(event, params = {}) {
    const dl = getDataLayer();
    if (!dl)
        return;
    dl.push({ event, ...params });
}
/**
 * Evento de ecommerce GA4 (view_item, view_item_list, select_item, …).
 * Limpia el objeto `ecommerce` previo antes de empujar el nuevo, como
 * recomienda Google, para que no se arrastren items entre eventos.
 */
export function trackEcommerce(event, ecommerce) {
    const dl = getDataLayer();
    if (!dl)
        return;
    dl.push({ ecommerce: null });
    dl.push({ event, ecommerce });
}
