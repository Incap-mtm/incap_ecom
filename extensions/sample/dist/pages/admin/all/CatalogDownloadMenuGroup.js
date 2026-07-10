import { NavigationItemGroup } from '@components/admin/NavigationItemGroup';
import { Download } from 'lucide-react';
import React from 'react';
export default function CatalogDownloadMenuGroup({ catalogAdmin }) {
    return (React.createElement(NavigationItemGroup, { id: "catalogDownloadMenuGroup", name: "Cat\u00E1logo descargable", items: [
            {
                Icon: Download,
                url: catalogAdmin,
                title: 'Configurar PDF'
            }
        ] }));
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
//# sourceMappingURL=CatalogDownloadMenuGroup.js.map