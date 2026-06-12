import React from 'react';
import { useProduct } from '@components/frontStore/catalog/ProductContext.js';

export default function ProductHeaderInfo() {
  const product = useProduct();

  const get = (code: string) =>
    product?.attributes?.find((a: { attributeCode: string; optionText: string }) => a.attributeCode === code)?.optionText;

  const usos             = get('usos');
  const codigoIndustrial = get('codigo_industrial');
  const name             = product?.name;

  return (
    <div className="mb-3">
      {usos && (
        <div className="inline-block bg-[#2A4899]/8 border border-[#2A4899]/20 px-4 py-1.5 rounded-full mb-4">
          <span className="text-[10px] font-black text-[#2A4899] uppercase tracking-[0.3em] font-sora">
            {usos}
          </span>
        </div>
      )}

      {name && (
        <h1 className="text-2xl md:text-4xl font-black text-[#181B1C] font-sora mb-3 leading-tight tracking-tight uppercase">
          {name}
        </h1>
      )}

      {codigoIndustrial && (
        <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400 font-inter">
          <span>
            Ref. industrial{' '}
            <strong className="text-[#181B1C] font-bold">{codigoIndustrial}</strong>
          </span>
        </div>
      )}
    </div>
  );
}

export const layout = {
  areaId: 'productPageMiddleRight',
  sortOrder: 1
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
