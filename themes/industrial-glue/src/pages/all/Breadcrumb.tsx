import React from 'react';

export default function Breadcrumb(): null { return null; }

export const layout = {
  areaId: 'content',
  sortOrder: 0,
};

export const query = `
  query Query {
    pageInfo {
      breadcrumbs { url title }
    }
  }
`;
