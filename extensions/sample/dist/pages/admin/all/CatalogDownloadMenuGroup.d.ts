import React from 'react';
/**
 * Grupo de menú admin para la config del "Catálogo descargable" (PDF del header).
 *
 * ⚠️ Este archivo se llama `CatalogDownloadMenuGroup` (NO `CatalogMenuGroup`) y usa
 * id `catalogDownloadMenuGroup` A PROPÓSITO. Evershop overridea componentes admin
 * por BASENAME: si se llamara `CatalogMenuGroup` (igual que el del core en
 * catalog/pages/admin/all/CatalogMenuGroup.js) REEMPLAZA el grupo "Catalog" del
 * core → desaparecen Products / Categories / Collections / Attributes del menú.
 * Con nombre e id únicos, ambos grupos conviven. NO renombrar a CatalogMenuGroup.
 */
interface Props {
    catalogAdmin: string;
}
export default function CatalogDownloadMenuGroup({ catalogAdmin }: Props): React.JSX.Element;
export declare const layout: {
    areaId: string;
    sortOrder: number;
};
export declare const query = "\n  query CatalogDownloadMenuGroupQuery {\n    catalogAdmin: url(routeId: \"catalogAdmin\")\n  }\n";
export {};
