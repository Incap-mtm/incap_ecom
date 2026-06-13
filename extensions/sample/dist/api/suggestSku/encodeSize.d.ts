/**
 * encodeSizeToken(presentation)
 * Convierte la presentación de un producto (ej. "5000cc", "30kg", "5 Gal")
 * en un token de 3 chars para el segmento de tamaño del SKU INCAP.
 *
 * Reglas validadas contra los 322 SKU reales del catálogo (96.5% match exacto
 * sobre los 312 comparables; las anomalías restantes son históricas y están
 * documentadas en scripts/test_sku_encoder.cjs).
 *
 * Fuente de verdad conceptual para el split familia/presentación:
 * themes/industrial-glue/src/utils/family.ts
 *
 * @param {string} presentation  — la parte después del último " - " en el nombre del producto
 * @returns {{ token: string|null, confident: boolean }}
 */
export function encodeSizeToken(presentation: string): {
    token: string | null;
    confident: boolean;
};
export default encodeSizeToken;
