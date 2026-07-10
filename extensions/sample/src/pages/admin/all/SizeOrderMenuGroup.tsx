import { NavigationItemGroup } from '@components/admin/NavigationItemGroup';
import { ArrowUpDown } from 'lucide-react';
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

export default function SizeOrderMenuGroup({ sizeOrderAdmin }: Props) {
  return (
    <NavigationItemGroup
      id="sizeOrderMenuGroup"
      name="Tamaños de variante"
      items={[
        {
          Icon: ArrowUpDown,
          url: sizeOrderAdmin,
          title: 'Ordenar tamaños'
        }
      ]}
    />
  );
}

export const layout = {
  areaId: 'adminMenu',
  sortOrder: 64
};

export const query = `
  query SizeOrderMenuGroupQuery {
    sizeOrderAdmin: url(routeId: "sizeOrderAdmin")
  }
`;
