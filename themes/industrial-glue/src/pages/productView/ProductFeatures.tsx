import React from 'react';

interface Attribute { attributeCode: string; optionText: string; }
interface ProductProps {
  product?: {
    attributes?: Attribute[];
  };
}

export default function ProductFeatures({ product }: ProductProps) {
  const raw   = product?.attributes?.find(a => a.attributeCode === 'caracteristicas')?.optionText || '';
  const items = raw.split('|').map(s => s.trim()).filter(Boolean);

  if (items.length === 0) return null;

  return (
    <div className="py-8 border-t border-slate-100">
      <h3 className="text-base font-black text-[#181B1C] uppercase tracking-tight font-sora mb-1">
        Características
      </h3>
      <div className="w-10 h-1 bg-[#85C639] mb-5"></div>

      <ul className="space-y-3">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-3">
            <svg className="flex-shrink-0 mt-0.5 w-5 h-5 text-[#85C639]" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className="text-sm text-[#181B1C] font-inter leading-snug">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export const layout = {
  areaId: 'productPageMiddleRight',
  sortOrder: 5
};

export const query = `
query Query {
    product: currentProduct {
      attributes: attributeIndex {
        attributeCode
        optionText
      }
    }
}
`;
