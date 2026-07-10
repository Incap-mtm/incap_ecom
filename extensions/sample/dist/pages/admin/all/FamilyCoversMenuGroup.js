import { NavigationItemGroup } from '@components/admin/NavigationItemGroup';
import { Image } from 'lucide-react';
import React from 'react';
export default function FamilyCoversMenuGroup({ familyCoversAdmin }) {
    return (React.createElement(NavigationItemGroup, { id: "familyCoversMenuGroup", name: "Portadas de familia", items: [
            {
                Icon: Image,
                url: familyCoversAdmin,
                title: 'Elegir portadas'
            }
        ] }));
}
export const layout = {
    areaId: 'adminMenu',
    sortOrder: 65
};
export const query = `
  query FamilyCoversMenuGroupQuery {
    familyCoversAdmin: url(routeId: "familyCoversAdmin")
  }
`;
//# sourceMappingURL=FamilyCoversMenuGroup.js.map