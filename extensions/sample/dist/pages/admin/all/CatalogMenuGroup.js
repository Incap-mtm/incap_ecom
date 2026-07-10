import { NavigationItemGroup } from '@components/admin/NavigationItemGroup';
import { Download, Star } from 'lucide-react';
import React from 'react';
export default function CatalogMenuGroup({ catalogAdmin, featuredProducts }) {
    return (React.createElement(NavigationItemGroup, { id: "catalogMenuGroup", name: "Cat\u00E1logo", items: [
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
        ] }));
}
export const layout = {
    areaId: 'adminMenu',
    sortOrder: 62,
};
export const query = `
  query CatalogMenuGroupQuery {
    catalogAdmin: url(routeId: "catalogAdmin")
    featuredProducts: url(routeId: "featuredAdmin")
  }
`;
//# sourceMappingURL=CatalogMenuGroup.js.map