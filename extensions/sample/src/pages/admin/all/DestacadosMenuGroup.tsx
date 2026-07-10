import { NavigationItemGroup } from '@components/admin/NavigationItemGroup';
import { Star } from 'lucide-react';
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

export default function DestacadosMenuGroup({ featuredAdmin }: Props) {
  return (
    <NavigationItemGroup
      id="destacadosMenuGroup"
      name="Productos destacados"
      items={[
        {
          Icon: Star,
          url: featuredAdmin,
          title: 'Elegir destacados'
        }
      ]}
    />
  );
}

export const layout = {
  areaId: 'adminMenu',
  sortOrder: 61
};

export const query = `
  query DestacadosMenuGroupQuery {
    featuredAdmin: url(routeId: "featuredAdmin")
  }
`;
