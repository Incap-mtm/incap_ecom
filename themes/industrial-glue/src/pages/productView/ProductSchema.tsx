import React from 'react';

const SITE_URL = 'https://www.grupoincap.com.co';

interface ProductSchemaProps {
  product?: {
    name?: string;
    sku?: string;
    url?: string;
    metaDescription?: string;
    image?: { url?: string };
    attributes?: Array<{ attributeCode: string; optionText: string }>;
  };
}

export default function ProductSchema({ product }: ProductSchemaProps) {
  if (!product?.name) return null;

  const get = (code: string) =>
    product.attributes?.find(a => a.attributeCode === code)?.optionText || '';

  const description = product.metaDescription || get('usos') || get('caracteristicas') || '';
  const rawImg = product.image?.url || '';
  const imageUrl = rawImg ? (rawImg.startsWith('http') ? rawImg : `${SITE_URL}${rawImg}`) : '';
  const rawUrl  = product.url || '';
  const productUrl = rawUrl ? (rawUrl.startsWith('http') ? rawUrl : `${SITE_URL}${rawUrl}`) : '';

  const schema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    brand: { '@type': 'Brand', name: 'INCAP' },
    manufacturer: { '@type': 'Organization', name: 'Grupo INCAP', url: SITE_URL },
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      priceCurrency: 'COP',
      seller: { '@type': 'Organization', name: 'Grupo INCAP' },
      ...(productUrl && { url: productUrl }),
    },
  };

  if (description) schema.description = description;
  if (imageUrl)    schema.image = imageUrl;
  if (product.sku) schema.sku = product.sku;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export const layout = {
  areaId: 'head',
  sortOrder: 5,
};

export const query = `
query Query {
  product: currentProduct {
    name
    sku
    url
    metaDescription
    image { url }
    attributes: attributeIndex {
      attributeCode
      optionText
    }
  }
}
`;
