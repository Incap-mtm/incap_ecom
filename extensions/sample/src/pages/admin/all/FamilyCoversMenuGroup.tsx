import { NavigationItemGroup } from '@components/admin/NavigationItemGroup';
import { Image } from 'lucide-react';
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

export default function FamilyCoversMenuGroup({ familyCoversAdmin }: Props) {
  return (
    <NavigationItemGroup
      id="familyCoversMenuGroup"
      name="Portadas de familia"
      items={[
        {
          Icon: Image,
          url: familyCoversAdmin,
          title: 'Elegir portadas'
        }
      ]}
    />
  );
}

export const layout = {
  areaId: 'adminMenu',
  sortOrder: 65
};

export const query = `
  query FamilyCoversMenuGroupQuery {
    familyCoversAdmin: url(routeId: "familyCoversAdmin")
  }
`;
