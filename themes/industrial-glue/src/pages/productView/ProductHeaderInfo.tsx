import React from 'react';

interface ProductProps {
  product?: {
    attributes?: Array<{ attribute_code: string; attribute_value: string }>;
  };
}

export default function ProductHeaderInfo({ product }: ProductProps) {
  const getAttr = (code: string) => product?.attributes?.find(a => a.attribute_code === code)?.attribute_value;

  const feature = getAttr('feature_principal') || 'Calidad Industrial';
  const sapCode = getAttr('codigo_sap') || 'N/A';

  return (
    <div className="mb-8 flex justify-between items-start animate-fadeIn">
      <div className="flex flex-col gap-2">
        <div className="inline-flex items-center space-x-3 bg-[#85C639]/10 px-4 py-1.5 rounded-full border border-[#85C639]/20">
          <div className="w-1.5 h-1.5 rounded-full bg-[#85C639] animate-pulse"></div>
          <span className="text-[#181B1C] text-[9px] font-black uppercase tracking-[0.3em] font-inter">{feature}</span>
        </div>
      </div>
      <div className="bg-white/80 backdrop-blur-md px-6 py-4 rounded-2xl shadow-xl border border-slate-100 flex flex-col items-end transform hover:scale-105 transition-transform duration-300">
        <span className="text-slate-400 text-[8px] font-black uppercase tracking-[0.5em] mb-1">CÓDIGO SAP</span>
        <span className="text-[#2A4899] font-black text-xl font-sora tracking-tighter">{sapCode}</span>
      </div>
    </div>
  );
}

export const layout = {
  areaId: 'productPageMiddleRight',
  sortOrder: 1
};
