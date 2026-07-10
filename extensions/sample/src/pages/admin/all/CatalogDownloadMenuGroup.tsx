import { NavigationItemGroup } from '@components/admin/NavigationItemGroup';
import { Download } from 'lucide-react';
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

export default function CatalogDownloadMenuGroup({ catalogAdmin }: Props) {
  return (
    <NavigationItemGroup
      id="catalogDownloadMenuGroup"
      name="Catálogo descargable"
      items={[
        {
          Icon: Download,
          url: catalogAdmin,
          title: 'Configurar PDF'
        }
      ]}
    />
  );
}

export const layout = {
  areaId: 'adminMenu',
  sortOrder: 62
};

export const query = `
  query CatalogDownloadMenuGroupQuery {
    catalogAdmin: url(routeId: "catalogAdmin")
  }
`;
