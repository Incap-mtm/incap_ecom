import { NavigationItemGroup } from '@components/admin/NavigationItemGroup';
import { Handshake } from 'lucide-react';
import React from 'react';

interface Props {
  alianzasAdmin: string;
}

export default function AlianzasMenuGroup({ alianzasAdmin }: Props) {
  return (
    <NavigationItemGroup
      id="alianzasMenuGroup"
      name="Quiénes Somos"
      items={[
        {
          Icon: Handshake,
          url: alianzasAdmin,
          title: 'Alianzas (ciudades e imagen)',
        },
      ]}
    />
  );
}

export const layout = {
  areaId: 'adminMenu',
  sortOrder: 63,
};

export const query = `
  query AlianzasMenuGroupQuery {
    alianzasAdmin: url(routeId: "alianzasAdmin")
  }
`;
