/**
 * Recibe la imagen de portada del blog, la convierte a WebP (máx 1200px,
 * calidad 75) con sharp y la guarda en el volumen de media de Railway.
 *
 * Disco:  <MEDIAPATH>/blog/<nombre>-<ts>.webp
 * URL:    /assets/blog/<nombre>-<ts>.webp
 *         (static.js mapea /assets → MEDIAPATH)
 */
export default function blogCover(request: any, response: any): Promise<any>;
