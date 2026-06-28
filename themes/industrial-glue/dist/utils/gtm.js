// Configuración de Google Tag Manager — instalación estándar (client-side).
//
// El contenedor web (GTM_ID) se carga desde el CDN de Google
// (GTM_LOADER_URL). Config centralizada acá para no duplicar el ID/URL
// entre el loader (Head.tsx) y el fallback noscript (Navbar.tsx).
//
// Nota: si en el futuro se quiere migrar a server-side tagging, basta con
// reemplazar GTM_LOADER_URL por la URL del servidor de tagging (idealmente
// un subdominio first-party, ej. https://sgtm.grupoincap.com.co). El resto
// del código no cambia.
export const GTM_ID = 'GTM-K5C72GVM';
export const GTM_LOADER_URL = 'https://www.googletagmanager.com';
