import React from 'react';

// Suprime el breadcrumb global de EverShop en la página de producto.
// El breadcrumb correcto (con navegación de industria) está en ProductBreadcrumb.tsx → productPageTop.
export default function Breadcrumb(): null { return null; }

export const layout = {
  areaId: 'content',
  sortOrder: 0
};

export const query = `
  query Query {
    pageInfo {
      breadcrumbs { url title }
    }
  }
`;
