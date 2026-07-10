import React from 'react';
import { getFamily, getPresentation } from '../../utils/family.js';

interface RelatedProduct {
  productId: number;
  name: string;
  url: string;
  image?: { url?: string | null; alt?: string | null } | null;
}

interface Props {
  product?: {
    relatedProducts?: (RelatedProduct | null)[] | null;
  };
}

export default function RelatedProducts({ product }: Props) {
  const items = (product?.relatedProducts ?? []).filter(
    (p): p is RelatedProduct => Boolean(p)
  );
  if (items.length === 0) return null;

  return (
    <section className="bg-slate-50 py-16 md:py-24 font-sora">
      <div className="max-w-[1536px] mx-auto px-6 sm:px-8 lg:px-12">
        <div className="mb-8 md:mb-12">
          <span className="text-[#85C639] font-black text-[10px] md:text-xs uppercase tracking-[0.4em] block mb-3">
            Sigue explorando
          </span>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-[#181B1C] font-sora uppercase tracking-tighter leading-none">
            Productos relacionados
          </h2>
          <div className="w-24 h-2 bg-[#85C639] mt-6" />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {items.map((p) => (
            <a
              key={p.productId}
              href={p.url}
              className="group bg-white rounded-[1.5rem] md:rounded-[2rem] shadow-lg border border-slate-100 hover:shadow-2xl transition-all overflow-hidden flex flex-col"
            >
              <div className="h-48 md:h-60 overflow-hidden bg-white flex items-center justify-center p-5">
                {p.image?.url ? (
                  <img
                    src={p.image.url}
                    alt={p.image.alt || p.name}
                    loading="lazy"
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300 font-sora font-black uppercase tracking-widest text-sm">
                    Sin Imagen
                  </div>
                )}
              </div>
              <div className="px-5 md:px-7 pt-5 md:pt-6 pb-6 md:pb-8 flex flex-col flex-grow border-t border-slate-100">
                <span className="text-[#2A4899] font-black text-[9px] md:text-[10px] uppercase tracking-[0.3em] mb-2 block">
                  Relacionado
                </span>
                <h3 className="text-base md:text-lg font-black font-sora text-[#181B1C] group-hover:text-[#2A4899] transition-colors uppercase tracking-tight leading-tight mb-3 flex-grow">
                  {getFamily(p.name)}
                </h3>
                {getPresentation(p.name) && (
                  <span className="self-start inline-block text-xs md:text-sm font-bold font-sora text-[#2A4899] border-2 border-[#2A4899] rounded-lg px-3 py-1">
                    {getPresentation(p.name)}
                  </span>
                )}
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export const layout = {
  areaId: 'productPageBottom',
  sortOrder: 20
};

export const query = `
query RelatedProductsQuery {
  product: currentProduct {
    relatedProducts {
      productId
      name
      url
      image {
        url
        alt
      }
    }
  }
}
`;
