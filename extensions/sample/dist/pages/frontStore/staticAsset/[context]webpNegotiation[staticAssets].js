import { access } from 'fs/promises';
import { join } from 'path';

const MEDIAPATH = join(process.cwd(), 'media');

export default async function webpNegotiation(request, _response, next) {
  const url = request.originalUrl || '';

  if (!/\.(jpg|jpeg|png)(\?.*)?$/i.test(url)) {
    return next();
  }

  const accept = request.headers?.accept || '';
  if (!accept.includes('image/webp')) {
    return next();
  }

  const pathPart = url.split('?')[0];
  const mediaRel = pathPart.replace(/^\/assets\//, '');
  const webpRel  = mediaRel.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  const webpFile = join(MEDIAPATH, webpRel);

  try {
    await access(webpFile);
    const webpUrl        = url.replace(/\.(jpg|jpeg|png)(\?.*)?$/i, '.webp$2');
    request.originalUrl  = webpUrl;
    request.url          = webpUrl;
  } catch {
    // no .webp — serve original
  }

  return next();
}
