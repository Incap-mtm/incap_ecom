import { NavigationItemGroup } from '@components/admin/NavigationItemGroup';
import { Handshake } from 'lucide-react';
import React from 'react';
export default function AlianzasMenuGroup({ alianzasAdmin }) {
    return (React.createElement(NavigationItemGroup, { id: "alianzasMenuGroup", name: "Qui\u00E9nes Somos", items: [
            {
                Icon: Handshake,
                url: alianzasAdmin,
                title: 'Alianzas (ciudades e imagen)',
            },
        ] }));
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
//# sourceMappingURL=AlianzasMenuGroup.js.map