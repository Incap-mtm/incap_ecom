import {
  getContextValue,
  setContextValue
} from '@evershop/evershop/graphql/services';

/**
 * Normaliza la URL canónica del sitio.
 *
 * El core de Evershop (modules/base/.../HeadTags) ya renderiza
 * `<link rel="canonical" href={pageInfo.canonicalUrl}>`, y `pageInfo.canonicalUrl`
 * por defecto es `currentUrl` = `homeUrl + request.originalUrl`, es decir CON el
 * query string. Eso fragmenta la canónica por parámetros de tracking/filtros
 * (`?utm_source=…`, `?page=…`) y genera contenido duplicado a ojos de Google.
 *
 * Este middleware corre justo después del middleware `context` del core (que setea
 * `currentUrl`) y reescribe `pageInfo.canonicalUrl` quitando query y hash, dejando
 * una canónica self-referencing limpia: `homeUrl + path`. No agrega ningún tag
 * (evita duplicar el que ya emite el core); solo corrige el valor de origen.
 *
 * Va en `pages/global/` para aplicar a todas las páginas. Como ningún middleware
 * del core setea `canonicalUrl` explícitamente, este valor siempre prevalece.
 */
export default (request, response, next) => {
  const currentUrl = getContextValue(request, 'currentUrl', '');
  if (currentUrl) {
    const clean = currentUrl.split('#')[0].split('?')[0];
    const pageInfo = getContextValue(request, 'pageInfo', {});
    if (pageInfo.canonicalUrl !== clean) {
      setContextValue(request, 'pageInfo', { ...pageInfo, canonicalUrl: clean });
    }
  }
  next();
};
