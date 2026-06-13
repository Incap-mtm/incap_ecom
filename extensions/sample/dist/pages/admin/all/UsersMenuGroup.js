import { NavigationItemGroup } from '@components/admin/NavigationItemGroup';
import { Users } from 'lucide-react';
import React from 'react';
export default function UsersMenuGroup({ userGrid }) {
    return (React.createElement(NavigationItemGroup, { id: "usersMenuGroup", name: "Users", items: [
            {
                Icon: Users,
                url: userGrid,
                title: 'Admin users'
            }
        ] }));
}
export const layout = {
    areaId: 'adminMenu',
    sortOrder: 55
};
export const query = `
  query UsersMenuGroupQuery {
    userGrid: url(routeId: "userGrid")
  }
`;
//# sourceMappingURL=UsersMenuGroup.js.map