/**
 * Endpoint admin: normaliza tamaños y agrupa productos por familia en variant_groups.
 * Idempotente y transaccional: si algo falla, hace ROLLBACK (no deja estado parcial).
 */
export default function syncVariants(request: any, response: any): Promise<any>;
