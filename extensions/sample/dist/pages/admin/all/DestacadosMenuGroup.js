import { NavigationItemGroup } from '@components/admin/NavigationItemGroup';
import { Star } from 'lucide-react';
import React from 'react';
export default function DestacadosMenuGroup({ featuredAdmin }) {
    return (React.createElement(NavigationItemGroup, { id: "destacadosMenuGroup", name: "Productos destacados", items: [
            {
                Icon: Star,
                url: featuredAdmin,
                title: 'Elegir destacados'
            }
        ] }));
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
//# sourceMappingURL=DestacadosMenuGroup.js.map