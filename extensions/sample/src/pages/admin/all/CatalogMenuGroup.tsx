import { NavigationItemGroup } from '@components/admin/NavigationItemGroup';
import { Download } from 'lucide-react';
import React from 'react';

interface Props {
  catalogAdmin: string;
}

export default function CatalogMenuGroup({ catalogAdmin }: Props) {
  return (
    <NavigationItemGroup
      id="catalogMenuGroup"
      name="Catálogo"
      items={[
        {
          Icon: Download,
          url: catalogAdmin,
          title: 'Catálogo descargable',
        },
      ]}
    />
  );
}

export const layout = {
  areaId: 'adminMenu',
  sortOrder: 62,
};

export const query = `
  query CatalogMenuGroupQuery {
    catalogAdmin: url(routeId: "catalogAdmin")
  }
`;
