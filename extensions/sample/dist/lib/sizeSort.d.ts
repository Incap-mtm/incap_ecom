/**
 * Magnitud numérica normalizada de una etiqueta de tamaño.
 * Devuelve +Infinity cuando no se puede parsear un número (va al final).
 */
export function sizeMagnitude(text: any): number;
/**
 * Comparador de menor a mayor para etiquetas de tamaño.
 * Empata por orden natural del texto (numeric locale) para estabilidad.
 */
export function compareSizes(a: any, b: any): number;
