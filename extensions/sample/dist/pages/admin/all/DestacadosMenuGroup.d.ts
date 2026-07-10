import React from 'react';
/**
 * Grupo de menú admin para "Productos destacados" (curación del carrusel del home).
 *
 * ⚠️ Basename e id ÚNICOS a propósito. Evershop overridea componentes admin por
 * BASENAME: si este archivo se llamara `CatalogMenuGroup` reemplazaría el grupo
 * "Catalog" del core (Products/Categories/…). Con nombre propio, convive con el
 * core. NO renombrar a CatalogMenuGroup. Ver también CatalogDownloadMenuGroup.
 */
interface Props {
    featuredAdmin: string;
}
export default function DestacadosMenuGroup({ featuredAdmin }: Props): React.JSX.Element;
export declare const layout: {
    areaId: string;
    sortOrder: number;
};
export declare const query = "\n  query DestacadosMenuGroupQuery {\n    featuredAdmin: url(routeId: \"featuredAdmin\")\n  }\n";
export {};
