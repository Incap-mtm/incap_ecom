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
 * NOTA: este archivo vive en src/lib/ (NO en una carpeta api/) a propósito.
 * Evershop escanea como middleware Express todo .js de una carpeta de ruta cuyo
 * nombre empiece en minúscula (scanForMiddlewareFunctions). Cuando estaba en
 * api/suggestSku/ se registraba como middleware y se invocaba con (request,...)
 * → `presentation.trim is not a function` en cada POST /suggest-sku. En lib/ es
 * solo un helper importado, nunca un middleware.
 *
 * @param {string} presentation  — la parte después del último " - " en el nombre del producto
 * @returns {{ token: string|null, confident: boolean }}
 */
export function encodeSizeToken(presentation) {
    if (!presentation || !presentation.trim()) {
        return { token: null, confident: false };
    }
    // Normalizar coma → punto para decimales en español ("4,5" → "4.5")
    const s = presentation.trim().replace(',', '.');
    // Regex: número (entero o decimal) seguido opcionalmente de espacio y unidad
    const match = s.match(/^([\d.]+)\s*([A-Za-záéíóúüñÁÉÍÓÚÜÑ]+)/i);
    if (!match) {
        return { token: null, confident: false };
    }
    const num = parseFloat(match[1]);
    const unit = match[2].toLowerCase();
    if (isNaN(num)) {
        return { token: null, confident: false };
    }
    const pad3 = (n) => String(Math.round(n)).padStart(3, '0');
    // L (litros directos, ej. "3L", "3.6L", "10L")
    if (unit === 'l') {
        // igual que cc ≥ 1000: si entero → pad-3; si decimal → round(L*10) pad-3
        if (Number.isInteger(num)) {
            return { token: pad3(num), confident: true };
        }
        return { token: pad3(Math.round(num * 10)), confident: true };
    }
    // cc / ml / cm3
    if (unit === 'cc' || unit === 'ml' || unit === 'cm3') {
        if (num < 1000) {
            return { token: pad3(num), confident: true };
        }
        // ≥ 1000: convertir a litros
        const liters = num / 1000;
        if (Number.isInteger(liters)) {
            return { token: pad3(liters), confident: true };
        }
        // decimal → round(L*10)
        return { token: pad3(Math.round(liters * 10)), confident: true };
    }
    // kg
    if (unit === 'kg') {
        return { token: pad3(num), confident: true };
    }
    // gr / g
    if (unit === 'gr' || unit === 'g') {
        return { token: pad3(num), confident: true };
    }
    // Gal / galón / galon
    if (unit === 'gal' || unit === 'galón' || unit === 'galon') {
        const hasDecimal = !Number.isInteger(num);
        // round(gal*10) → pad-3
        const token = pad3(Math.round(num * 10));
        // Decimales tienen anomalías históricas → confident:false
        return { token, confident: !hasDecimal };
    }
    // Unidad no reconocida
    return { token: null, confident: false };
}
export default encodeSizeToken;
//# sourceMappingURL=encodeSize.js.map