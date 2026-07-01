/**
 * Página admin /catalog-admin — gestiona el botón "Descargar Catálogo" del header.
 *
 * Permite actualizar (se actualiza cada mes):
 *   - el PDF del catálogo (subida al volumen de media → /assets/catalogo/...)
 *   - el texto del botón
 *
 * Ambos se guardan en settings (catalog_url, catalog_button_text) vía
 * POST /api/catalog-config y se leen en el Navbar por GraphQL.
 */
import React from 'react';
interface Props {
    setting: {
        catalogUrl: string;
        catalogButtonText: string;
        leadEmails: string;
    };
}
export default function CatalogAdminPage({ setting }: Props): React.JSX.Element;
export declare const layout: {
    areaId: string;
    sortOrder: number;
};
export declare const query = "\n  query CatalogAdminQuery {\n    setting {\n      catalogUrl\n      catalogButtonText\n      leadEmails\n    }\n  }\n";
export {};
