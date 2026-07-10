import React from 'react';
/**
 * Grupo de menú admin para "Orden de tamaños de variante".
 *
 * ⚠️ Basename e id ÚNICOS a propósito. Evershop overridea componentes admin por
 * BASENAME; además el routeId de una ruta = nombre de su carpeta. La página vive
 * en `pages/admin/sizeOrderAdmin` (NO `variantSizeOrder`, que colisionaría con el
 * endpoint `api/variantSizeOrder` y dejaría la página en 404). Ver DestacadosMenuGroup.
 */
interface Props {
    sizeOrderAdmin: string;
}
export default function SizeOrderMenuGroup({ sizeOrderAdmin }: Props): React.JSX.Element;
export declare const layout: {
    areaId: string;
    sortOrder: number;
};
export declare const query = "\n  query SizeOrderMenuGroupQuery {\n    sizeOrderAdmin: url(routeId: \"sizeOrderAdmin\")\n  }\n";
export {};
