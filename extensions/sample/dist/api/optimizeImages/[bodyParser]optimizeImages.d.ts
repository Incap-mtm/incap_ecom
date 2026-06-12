/**
 * Endpoint admin: convierte a WebP las imágenes de producto (JPG/PNG) que aún no
 * tienen su versión .webp en el volumen /media. El middleware webpNegotiation las
 * sirve automáticamente. Idempotente: salta las que ya tienen .webp.
 */
export default function optimizeImages(request: any, response: any): Promise<any>;
