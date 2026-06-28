import { NavigationItemGroup } from '@components/admin/NavigationItemGroup';
import { Rss } from 'lucide-react';
import React from 'react';

interface Props {
  blogAdmin: string;
}

export default function BlogMenuGroup({ blogAdmin }: Props) {
  return (
    <NavigationItemGroup
      id="blogMenuGroup"
      name="Blog"
      items={[
        {
          Icon: Rss,
          url: blogAdmin,
          title: 'Artículos del blog',
        },
      ]}
    />
  );
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
