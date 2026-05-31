import { access } from 'fs/promises';
import { join } from 'path';

const MEDIAPATH = join(process.cwd(), 'media');

export default async function webpNegotiation(
  request: any,
  _response: any,
  next: () => void
): Promise<void> {
  const url: string = request.originalUrl || '';

  // Solo imágenes JPG/PNG en la ruta /assets/
  if (!/\.(jpg|jpeg|png)(\?.*)?$/i.test(url)) {
    return next();
  }

  // Solo si el browser anuncia soporte WebP
  const accept: string = request.headers?.accept || '';
  if (!accept.includes('image/webp')) {
    return next();
  }

  // Construir ruta WebP en el volumen de media
  const pathPart  = url.split('?')[0];                     // /assets/products/img.jpg
  const mediaRel  = pathPart.replace(/^\/assets\//, '');   // products/img.jpg
  const webpRel   = mediaRel.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  const webpFile  = join(MEDIAPATH, webpRel);

  try {
    await access(webpFile);
    // Reescribir URL para que staticAssets sirva el .webp
    const webpUrl = url.replace(/\.(jpg|jpeg|png)(\?.*)?$/i, '.webp$2');
    request.originalUrl = webpUrl;
    request.url         = webpUrl;
  } catch {
    // No existe el .webp — sirve el original sin cambios
  }

  return next();
}
