/**
 * Endpoint admin (2 fases):
 *  1) Convierte a WebP las imágenes JPG/PNG que aún no tienen su .webp (sharp).
 *  2) Sincroniza la DB: product_image.origin_image .jpg/.png → .webp cuando el
 *     .webp existe en disco (así el image processor de la ficha sirve el WebP en
 *     vez de 404 sobre el original). Idempotente.
 */
export default function optimizeImages(request: any, response: any): Promise<any>;
