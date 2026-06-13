/**
 * POST /api/suggest-sku
 * Sugiere un SKU para un producto basándose en su nombre.
 *
 * Lógica:
 *  - Caso A (familia existente): toma el prefijo LINEA-VARIANTE de un hermano.
 *    source:'sibling', needsReview:false (salvo token no-confident).
 *  - Caso B (familia nueva): genera prefijo de 2+2 chars. source:'generated', needsReview:true.
 *  - Token de tamaño: encodeSizeToken(presentación). Si null o !confident → needsReview:true.
 *  - Unicidad: si el SKU ya existe → needsReview:true + note.
 *
 * Derivación familia/presentación: misma lógica que
 * themes/industrial-glue/src/utils/family.ts (getFamily / getPresentation).
 */
export default function suggestSku(request: any, response: any): Promise<any>;
