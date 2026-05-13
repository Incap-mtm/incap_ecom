import React from 'react';

interface Attribute { attributeCode: string; optionText: string; }
interface ProductProps {
  product?: {
    sku?: string;
    attributes?: Attribute[];
  };
}

export default function ProductHeaderInfo({ product }: ProductProps) {
  const get = (code: string) =>
    product?.attributes?.find(a => a.attributeCode === code)?.optionText;

  const usos             = get('usos');
  const codigoIndustrial = get('codigo_industrial');
  const sku              = product?.sku;

  return (
    <div className="mb-3">
      {usos && (
        <div className="inline-block bg-[#2A4899]/8 border border-[#2A4899]/20 px-4 py-1.5 rounded-full mb-4">
          <span className="text-[10px] font-black text-[#2A4899] uppercase tracking-[0.3em] font-sora">
            {usos}
          </span>
        </div>
      )}

      {(sku || codigoIndustrial) && (
        <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400 font-inter">
          {sku && (
            <span>
              SKU{' '}
              <strong className="text-[#181B1C] font-bold">{sku}</strong>
            </span>
          )}
          {sku && codigoIndustrial && <span className="text-slate-200">·</span>}
          {codigoIndustrial && (
            <span>
              Ref. industrial{' '}
              <strong className="text-[#181B1C] font-bold">{codigoIndustrial}</strong>
            </span>
          )}
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
      sku
      attributes: attributeIndex {
        attributeCode
        optionText
      }
    }
}
`;
