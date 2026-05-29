import React from 'react';
const SITE_URL = 'https://www.grupoincap.com.co';
export default function ProductSchema({ product }) {
    var _a;
    if (!(product === null || product === void 0 ? void 0 : product.name))
        return null;
    const get = (code) => { var _a, _b; return ((_b = (_a = product.attributes) === null || _a === void 0 ? void 0 : _a.find(a => a.attributeCode === code)) === null || _b === void 0 ? void 0 : _b.optionText) || ''; };
    const description = product.metaDescription || get('usos') || get('caracteristicas') || '';
    const rawImg = ((_a = product.image) === null || _a === void 0 ? void 0 : _a.url) || '';
    const imageUrl = rawImg ? (rawImg.startsWith('http') ? rawImg : `${SITE_URL}${rawImg}`) : '';
    const rawUrl = product.url || '';
    const productUrl = rawUrl ? (rawUrl.startsWith('http') ? rawUrl : `${SITE_URL}${rawUrl}`) : '';
    const schema = {
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
    if (description)
        schema.description = description;
    if (imageUrl)
        schema.image = imageUrl;
    if (product.sku)
        schema.sku = product.sku;
    return (React.createElement("script", { type: "application/ld+json", dangerouslySetInnerHTML: { __html: JSON.stringify(schema) } }));
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
