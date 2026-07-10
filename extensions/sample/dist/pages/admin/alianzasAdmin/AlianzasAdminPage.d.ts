/**
 * Página admin /alianzas-admin — gestiona la sección "Alianzas que construyen
 * país" de la página Quiénes Somos.
 *
 * Permite al admin:
 *   - editar el título y el párrafo introductorio
 *   - agregar / quitar / editar las ciudades (pastillas)
 *   - cambiar la imagen de la derecha (se convierte a WebP en el servidor)
 *
 * Todo se guarda dentro del setting JSON `quienes_somos` vía
 * POST /api/alianzas-config y lo lee el frontstore por GraphQL (fresh del DB).
 */
import React from 'react';
export default function AlianzasAdminPage(): React.JSX.Element;
export declare const layout: {
    areaId: string;
    sortOrder: number;
};
