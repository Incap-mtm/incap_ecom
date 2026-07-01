import { NavigationItemGroup } from '@components/admin/NavigationItemGroup';
import { Download } from 'lucide-react';
import React from 'react';
export default function CatalogMenuGroup({ catalogAdmin }) {
    return (React.createElement(NavigationItemGroup, { id: "catalogMenuGroup", name: "Cat\u00E1logo", items: [
            {
                Icon: Download,
                url: catalogAdmin,
                title: 'Catálogo descargable',
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
  }
`;
//# sourceMappingURL=CatalogMenuGroup.js.map