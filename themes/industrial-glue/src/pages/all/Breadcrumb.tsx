import React from 'react';

const SITE_URL = 'https://www.grupoincap.com.co';

interface BreadcrumbProps {
  pageInfo?: {
    breadcrumbs?: Array<{ url: string; title: string }>;
  };
}

export default function Breadcrumb({ pageInfo }: BreadcrumbProps): React.ReactElement | null {
  const crumbs = pageInfo?.breadcrumbs;
  if (!crumbs || crumbs.length < 2) return null;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: crumb.title,
      item: crumb.url.startsWith('http') ? crumb.url : `${SITE_URL}${crumb.url}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

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
