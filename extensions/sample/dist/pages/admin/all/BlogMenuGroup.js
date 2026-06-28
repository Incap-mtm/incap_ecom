import { NavigationItemGroup } from '@components/admin/NavigationItemGroup';
import { Rss } from 'lucide-react';
import React from 'react';
export default function BlogMenuGroup({ blogAdmin }) {
    return (React.createElement(NavigationItemGroup, { id: "blogMenuGroup", name: "Blog", items: [
            {
                Icon: Rss,
                url: blogAdmin,
                title: 'Artículos del blog',
            },
        ] }));
}
export const layout = {
    areaId: 'adminMenu',
    sortOrder: 60,
};
export const query = `
  query BlogMenuGroupQuery {
    blogAdmin: url(routeId: "blogAdmin")
  }
`;
//# sourceMappingURL=BlogMenuGroup.js.map