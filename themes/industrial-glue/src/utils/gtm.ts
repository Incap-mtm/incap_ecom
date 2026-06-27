// Configuración de Google Tag Manager — server-side tagging.
//
// El loader del contenedor WEB (GTM_ID) se sirve desde el servidor de tagging
// en Railway (GTM_SERVER_URL) en lugar de googletagmanager.com. Así las
// peticiones de medición pasan por nuestro propio endpoint (server-side).
//
// ⚠️ MIGRACIÓN PENDIENTE A FIRST-PARTY:
// GTM_SERVER_URL apunta hoy al dominio default de Railway (*.up.railway.app),
// que es un dominio DISTINTO al del sitio → contexto third-party. Para obtener
// el beneficio real del server-side (cookies first-party, mayor duración,
// menos bloqueo por ITP/ad-blockers) hay que mapear un subdominio propio
// (ej. https://sgtm.grupoincap.com.co) al servicio de Railway y reemplazar
// solo esta constante. El resto del código no cambia.
export const GTM_ID = 'GTM-NN76KTDJ';
export const GTM_SERVER_URL = 'https://server-side-tracking-production-154d.up.railway.app';
