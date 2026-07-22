import React from 'react';
import { getFamily } from '../../utils/family.js';
import FamilyCard, { FamilyCardData, FamilyMember } from '../../components/FamilyCard.js';

interface RelatedProduct {
  productId: number;
  uuid?: string | null;
  name: string;
  url: string;
  image?: { url?: string | null; alt?: string | null } | null;
  familyMembers?: (FamilyMember | null)[] | null;
}

interface Props {
  product?: {
    relatedProducts?: (RelatedProduct | null)[] | null;
  };
}

export default function RelatedProducts({ product }: Props) {
  const raw = (product?.relatedProducts ?? []).filter(
    (p): p is RelatedProduct => Boolean(p)
  );

  // Un representante por familia (el resolver ya devuelve familias distintas,
  // pero deduplicamos por las dudas para no repetir cards).
  const seen = new Set<string>();
  const cards: FamilyCardData[] = [];
  for (const p of raw) {
    const family = getFamily(p.name) || p.name;
    if (seen.has(family)) continue;
    seen.add(family);
    const members = (p.familyMembers ?? []).filter(
      (m): m is FamilyMember => Boolean(m)
    );
    cards.push({
      family,
      label: 'Relacionado',
      accent: '#2A4899',
      repImage: p.image?.url ?? null,
      repUrl: p.url,
      members: members.length ? members : [{ name: p.name, url: p.url, uuid: p.uuid }],
    });
  }

  if (cards.length === 0) return null;

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

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {cards.map((c) => (
            <FamilyCard key={c.family} data={c} />
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
      uuid
      name
      url
      image {
        url
        alt
      }
      familyMembers {
        productId
        uuid
        name
        url
      }
    }
  }
}
`;
