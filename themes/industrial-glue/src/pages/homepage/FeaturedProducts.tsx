import React, { useRef, useEffect } from 'react';
import { getFamily } from '../../utils/family.js';
import FamilyCard, { FamilyCardData, FamilyMember } from '../../components/FamilyCard.js';

interface FeaturedProduct {
  uuid: string;
  name: string;
  url: string;
  image?: { url?: string | null; alt?: string | null } | null;
  familyMembers?: (FamilyMember | null)[] | null;
}

interface Props {
  products?: (FeaturedProduct | null)[] | null;
}

export default function FeaturedProducts({ products }: Props) {
  const raw = (products ?? []).filter((p): p is FeaturedProduct => Boolean(p));

  // Agrupar por familia preservando el orden elegido por el admin: si eligió
  // "Super PVA - 20kg" y "Super PVA - 5kg" se muestra UNA card de la familia
  // con todas sus presentaciones como chips.
  const seen = new Set<string>();
  const items: FamilyCardData[] = [];
  for (const p of raw) {
    const family = getFamily(p.name) || p.name;
    if (seen.has(family)) continue;
    seen.add(family);
    const members = (p.familyMembers ?? []).filter(
      (m): m is FamilyMember => Boolean(m)
    );
    items.push({
      family,
      label: 'Destacado',
      accent: '#2A4899',
      repImage: p.image?.url ?? null,
      repUrl: p.url,
      members: members.length ? members : [{ name: p.name, url: p.url, uuid: p.uuid }],
    });
  }

  const trackRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);

  // Rotación automática muy suave + loop sin cortes (contenido duplicado).
  // scrollLeft se redondea a entero → acumulamos la posición en un float (pos)
  // para que el avance sub-píxel no se pierda cada frame.
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    let raf = 0;
    let pos = el.scrollLeft;
    const speed = 0.4; // px por frame → desplazamiento lento y fluido
    const step = () => {
      if (pausedRef.current) {
        pos = el.scrollLeft; // sincronizar durante hover / scroll manual
      } else if (el.scrollWidth > el.clientWidth + 4) {
        pos += speed;
        const half = el.scrollWidth / 2; // el track está duplicado
        if (pos >= half) pos -= half;
        el.scrollLeft = pos;
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [items.length]);

  if (items.length === 0) return null;

  const pause = () => { pausedRef.current = true; };
  const resume = () => { pausedRef.current = false; };

  const nudge = (dir: -1 | 1) => {
    const el = trackRef.current;
    if (!el) return;
    pausedRef.current = true;
    el.scrollBy({ left: dir * 300, behavior: 'smooth' });
    window.setTimeout(() => { pausedRef.current = false; }, 1800);
  };

  // Duplicamos los items para que el loop automático sea continuo/sin salto
  const loop = items.concat(items);

  return (
    <section className="bg-white py-20 md:py-28 px-4 sm:px-6 lg:px-8 font-sora">
      <style>{`
        .featured-track { scrollbar-width: none; -ms-overflow-style: none; }
        .featured-track::-webkit-scrollbar { display: none; width: 0; height: 0; }
      `}</style>
      <div className="w-full max-w-[1920px] mx-auto">
        {/* Header */}
        <div className="flex items-end justify-between mb-10 md:mb-14">
          <div>
            <span className="text-[#85C639] font-black text-[10px] md:text-xs uppercase tracking-[0.4em] block mb-3">
              Lo que recomendamos
            </span>
            <h2 className="text-4xl md:text-7xl font-black text-[#181B1C] leading-[0.9] uppercase font-sora">
              Productos <span className="text-[#2A4899]">Destacados</span>
            </h2>
            <div className="w-24 h-2 bg-[#85C639] mt-6" />
          </div>

          {/* Flechas (desktop) */}
          <div className="hidden md:flex gap-3">
            <button
              type="button"
              aria-label="Anterior"
              onClick={() => nudge(-1)}
              className="w-12 h-12 rounded-full border-2 border-[#2A4899] text-[#2A4899] hover:bg-[#2A4899] hover:text-white transition-all flex items-center justify-center text-xl font-black"
            >
              ←
            </button>
            <button
              type="button"
              aria-label="Siguiente"
              onClick={() => nudge(1)}
              className="w-12 h-12 rounded-full border-2 border-[#2A4899] text-[#2A4899] hover:bg-[#2A4899] hover:text-white transition-all flex items-center justify-center text-xl font-black"
            >
              →
            </button>
          </div>
        </div>

        {/* Carrusel — scrollbar oculto, rotación automática */}
        <div
          ref={trackRef}
          className="featured-track flex gap-5 md:gap-6 overflow-x-auto pb-2"
          onMouseEnter={pause}
          onMouseLeave={resume}
          onTouchStart={pause}
        >
          {loop.map((c, i) => (
            <div
              key={`${c.family}-${i}`}
              aria-hidden={i >= items.length ? true : undefined}
              className="shrink-0 w-[240px] md:w-[280px]"
            >
              <FamilyCard data={c} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export const layout = {
  areaId: 'content',
  sortOrder: 7
};

export const query = `
query FeaturedProductsQuery {
  products: featuredProductsSelected {
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
`;
