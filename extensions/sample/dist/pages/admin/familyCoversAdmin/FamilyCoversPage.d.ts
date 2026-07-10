/**
 * Página admin /portadas-familia
 * El administrador elige, para cada familia de productos (agrupación por
 * nombre antes de " - ", ej. "Incafort"), qué variación (presentación) es
 * la imagen de portada de la card de esa familia en buscador/catálogo/industrias.
 * La selección se guarda en el setting `family_covers` (objeto JSON
 * { [familia]: uuid }) vía /api/family-covers. Familias sin portada elegida
 * siguen usando la heurística automática (pickRepresentative).
 */
import React from 'react';
export default function FamilyCoversPage(): React.JSX.Element;
export declare const layout: {
    areaId: string;
    sortOrder: number;
};
