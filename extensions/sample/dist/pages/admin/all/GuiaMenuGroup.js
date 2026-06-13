import { NavigationItemGroup } from '@components/admin/NavigationItemGroup';
import { BookOpen } from 'lucide-react';
import React from 'react';
export default function GuiaMenuGroup({ guia }) {
    return (React.createElement(NavigationItemGroup, { id: "guiaMenuGroup", name: "Ayuda", items: [
            {
                Icon: BookOpen,
                url: guia,
                title: 'Guía de uso'
            }
        ] }));
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
//# sourceMappingURL=GuiaMenuGroup.js.map