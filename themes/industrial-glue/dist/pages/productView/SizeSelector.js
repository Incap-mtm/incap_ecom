import React from 'react';
export default function SizeSelector({ product }) {
    const variants = product === null || product === void 0 ? void 0 : product.sizeVariants;
    if (!variants || variants.length === 0)
        return null;
    return (React.createElement("div", { className: "mb-4" },
        React.createElement("p", { className: "text-xs font-black text-[#6b7280] uppercase tracking-[0.2em] mb-3", style: { fontFamily: 'Sora, sans-serif' } }, "Presentaci\u00F3n"),
        React.createElement("div", { className: "flex flex-wrap gap-2" }, variants.map((v) => v.isCurrent ? (React.createElement("span", { key: v.label, style: {
                display: 'inline-block',
                padding: '6px 14px',
                background: '#2A4899',
                color: '#fff',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 700,
                fontFamily: 'Sora, sans-serif',
                border: '2px solid #2A4899',
                cursor: 'default',
            } }, v.label)) : (React.createElement("a", { key: v.label, href: v.url, style: {
                display: 'inline-block',
                padding: '6px 14px',
                background: '#fff',
                color: '#2A4899',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 600,
                fontFamily: 'Sora, sans-serif',
                border: '2px solid #2A4899',
                textDecoration: 'none',
                transition: 'background 0.18s, color 0.18s',
            }, onMouseOver: (e) => {
                e.currentTarget.style.background = '#2A4899';
                e.currentTarget.style.color = '#fff';
            }, onMouseOut: (e) => {
                e.currentTarget.style.background = '#fff';
                e.currentTarget.style.color = '#2A4899';
            } }, v.label))))));
}
export const layout = {
    areaId: 'productPageMiddleRight',
    sortOrder: 2
};
export const query = `
query SizeSelectorQuery {
  product: currentProduct {
    sizeVariants {
      label
      url
      isCurrent
    }
  }
}
`;
