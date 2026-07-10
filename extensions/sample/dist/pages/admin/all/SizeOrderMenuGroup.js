import { NavigationItemGroup } from '@components/admin/NavigationItemGroup';
import { ArrowUpDown } from 'lucide-react';
import React from 'react';
export default function SizeOrderMenuGroup({ sizeOrderAdmin }) {
    return (React.createElement(NavigationItemGroup, { id: "sizeOrderMenuGroup", name: "Tama\u00F1os de variante", items: [
            {
                Icon: ArrowUpDown,
                url: sizeOrderAdmin,
                title: 'Ordenar tamaños'
            }
        ] }));
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
//# sourceMappingURL=SizeOrderMenuGroup.js.map