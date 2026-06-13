import { NavigationItemGroup } from '@components/admin/NavigationItemGroup';
import { BookOpen } from 'lucide-react';
import React from 'react';

interface Props {
  guia: string;
}

export default function GuiaMenuGroup({ guia }: Props) {
  return (
    <NavigationItemGroup
      id="guiaMenuGroup"
      name="Ayuda"
      items={[
        {
          Icon: BookOpen,
          url: guia,
          title: 'Guía de uso'
        }
      ]}
    />
  );
}

export const layout = {
  areaId: 'adminMenu',
  sortOrder: 5
};

export const query = `
  query GuiaMenuGroupQuery {
    guia: url(routeId: "guia")
  }
`;
