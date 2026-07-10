/**
 * Ordenamiento de "tamaños / presentaciones" de menor a mayor.
 *
 * Los tamaños de variante son texto libre ("750", "3000", "1 Gal", "20kg", "55GL"…)
 * y mezclan unidades. Para poder ordenarlos numéricamente de menor a mayor
 * normalizamos cada etiqueta a una magnitud comparable:
 *   - volumen → mililitros
 *   - peso    → gramos
 *   - sin unidad → se asume el número crudo (histórico: cc)
 *
 * No es una conversión física exacta entre peso y volumen; el objetivo es un
 * orden monotónico "de menor a mayor" que coincide con la intuición del cliente
 * (dentro de una familia las presentaciones suelen compartir unidad).
 */

const UNIT_TO_BASE = {
  // volumen → ml
  ml: 1,
  cc: 1,
  cm3: 1,
  l: 1000,
  lt: 1000,
  lts: 1000,
  litro: 1000,
  litros: 1000,
  gal: 3785,
  gl: 3785,
  gls: 3785,
  galon: 3785,
  galones: 3785,
  // peso → g
  g: 1,
  gr: 1,
  grs: 1,
  gramo: 1,
  gramos: 1,
  kg: 1000,
  kgs: 1000,
  kilo: 1000,
  kilos: 1000
};

/**
 * Magnitud numérica normalizada de una etiqueta de tamaño.
 * Devuelve +Infinity cuando no se puede parsear un número (va al final).
 */
export function sizeMagnitude(text) {
  if (text == null) return Number.POSITIVE_INFINITY;
  const s = String(text).toLowerCase().replace(',', '.');
  const m = s.match(/(\d+(?:\.\d+)?)\s*([a-zµ³]*)/);
  if (!m) return Number.POSITIVE_INFINITY;
  const value = parseFloat(m[1]);
  if (!Number.isFinite(value)) return Number.POSITIVE_INFINITY;
  const unit = (m[2] || '').replace('³', '3').trim();
  const factor = Object.prototype.hasOwnProperty.call(UNIT_TO_BASE, unit)
    ? UNIT_TO_BASE[unit]
    : 1; // sin unidad reconocida → número crudo
  return value * factor;
}

/**
 * Comparador de menor a mayor para etiquetas de tamaño.
 * Empata por orden natural del texto (numeric locale) para estabilidad.
 */
export function compareSizes(a, b) {
  const ma = sizeMagnitude(a);
  const mb = sizeMagnitude(b);
  if (ma !== mb) return ma - mb;
  return String(a ?? '').localeCompare(String(b ?? ''), 'es', { numeric: true });
}
