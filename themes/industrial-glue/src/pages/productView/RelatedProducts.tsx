import React from 'react';

interface RelatedProduct {
  productId: number;
  name: string;
  url: string;
  image?: { url?: string | null; alt?: string | null } | null;
  price?: { regular?: { text?: string | null } | null } | null;
}

interface Props {
  product?: {
    relatedProducts?: (RelatedProduct | null)[] | null;
  };
}

const AZUL = '#2A4899';

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
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {items.map((p) => (
            <a
              key={p.productId}
              href={p.url}
              className="group bg-white rounded-[1.25rem] md:rounded-[2rem] shadow-lg border border-slate-100 hover:shadow-2xl transition-all overflow-hidden flex flex-col"
            >
              <div className="h-40 md:h-56 overflow-hidden bg-white flex items-center justify-center p-4">
                {p.image?.url ? (
                  <img
                    src={p.image.url}
                    alt={p.image.alt || p.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300 font-sora font-black uppercase tracking-widest text-xs md:text-base">
                    Sin Imagen
                  </div>
                )}
              </div>
              <div className="px-4 md:px-6 pt-4 md:pt-6 pb-5 md:pb-8 flex flex-col flex-grow">
                <span className="text-[#2A4899] font-black text-[9px] md:text-[10px] uppercase tracking-[0.3em] mb-2 block">
                  Adhesivo
                </span>
                <h3 className="text-sm md:text-lg font-black font-sora text-[#181B1C] group-hover:text-[#2A4899] transition-colors uppercase tracking-tight leading-tight mb-3 md:mb-4 flex-grow">
                  {p.name}
                </h3>
                {p.price?.regular?.text && (
                  <span
                    className="inline-block text-sm md:text-base font-bold font-sora"
                    style={{ color: AZUL }}
                  >
                    {p.price.regular.text}
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
      price {
        regular {
          text
        }
      }
    }
  }
}
`;
