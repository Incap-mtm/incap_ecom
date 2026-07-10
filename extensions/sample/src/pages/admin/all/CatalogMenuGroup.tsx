import { NavigationItemGroup } from '@components/admin/NavigationItemGroup';
import { Download, Star } from 'lucide-react';
import React from 'react';

interface Props {
  catalogAdmin: string;
  featuredProducts: string;
}

export default function CatalogMenuGroup({ catalogAdmin, featuredProducts }: Props) {
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
        {
          Icon: Star,
          url: featuredProducts,
          title: 'Productos destacados',
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
    featuredProducts: url(routeId: "featuredProducts")
  }
`;
