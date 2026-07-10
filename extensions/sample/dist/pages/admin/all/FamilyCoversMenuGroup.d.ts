import React from 'react';
/**
 * Grupo de menú admin para "Portadas de familia" (elegir la imagen de portada
 * de cada card de familia en buscador/catálogo/industrias).
 *
 * ⚠️ Basename e id ÚNICOS a propósito. Evershop overridea componentes admin por
 * BASENAME; además el routeId de una ruta = nombre de su carpeta. La página vive
 * en `pages/admin/familyCoversAdmin` (NO `familyCovers`, que colisionaría con el
 * endpoint `api/familyCovers` y dejaría la página en 404). Ver DestacadosMenuGroup.
 */
interface Props {
    familyCoversAdmin: string;
}
export default function FamilyCoversMenuGroup({ familyCoversAdmin }: Props): React.JSX.Element;
export declare const layout: {
    areaId: string;
    sortOrder: number;
};
export declare const query = "\n  query FamilyCoversMenuGroupQuery {\n    familyCoversAdmin: url(routeId: \"familyCoversAdmin\")\n  }\n";
export {};
