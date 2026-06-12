/**
 * Endpoint admin: normaliza tamaños y agrupa productos por familia en variant_groups.
 * Es idempotente: solo crea grupos/variantes faltantes, no toca los ya migrados.
 */
export default function syncVariants(request: any, response: any): Promise<any>;
