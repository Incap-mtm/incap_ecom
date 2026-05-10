import React from 'react';

interface ProductProps {
  product?: {
    name?: string;
    attributes?: Array<{ attribute_code: string; attribute_value: string }>;
  };
}

export default function TechnicalSheet({ product }: ProductProps) {
  // Reads from custom attribute 'ficha_tecnica' set in EverShop admin
  const fichaAttr = product?.attributes?.find(
    (a) => a.attribute_code === 'ficha_tecnica'
  );
  const fichaUrl = fichaAttr?.attribute_value;

  // Don't render if no technical sheet is configured
  if (!fichaUrl) return null;

  return (
    <div className="mt-10 border-t border-slate-100 pt-10">
      <h3 className="text-lg font-bold text-[#181B1C] mb-4" style={{ fontFamily: 'Sora, sans-serif' }}>
        Ficha Técnica
      </h3>
      <a
        href={fichaUrl}
        target="_blank"
        rel="noopener noreferrer"
        download
        className="inline-flex items-center gap-3 px-6 py-3 bg-[#2A4899] hover:bg-[#1e3a7a] text-white font-semibold rounded-lg transition-all duration-300 group"
      >
        {/* PDF icon */}
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Descargar Ficha Técnica
        <span className="text-xs opacity-70">(PDF)</span>
      </a>
      <p className="mt-2 text-xs text-slate-400">
        Incluye especificaciones, modo de aplicación y seguridad.
      </p>
    </div>
  );
}

export const layout = {
  areaId: 'productPageBottom',
  sortOrder: 10
};
