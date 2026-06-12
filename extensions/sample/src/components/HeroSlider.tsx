import React, { useState, useEffect } from 'react';

interface HeroSlide {
  id: string;
  deskImage: string;
  mobileImage?: string | null;
  alt?: string | null;
}

interface HeroSliderProps {
  heroSliderWidget?: {
    slides?: HeroSlide[];
    autoplaySpeed?: number;
  };
}

export default function HeroSlider({ heroSliderWidget }: HeroSliderProps) {
  const slides = heroSliderWidget?.slides ?? [];
  const intervalMs = Number(heroSliderWidget?.autoplaySpeed) || 5000;

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return undefined;
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % slides.length);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [slides.length, intervalMs]);

  if (slides.length === 0) return null;

  const prev = () => setCurrent(c => (c - 1 + slides.length) % slides.length);
  const next = () => setCurrent(c => (c + 1) % slides.length);

  return (
    <section
      className="relative w-full overflow-hidden bg-[#181B1C]"
      style={{ height: '90vh', minHeight: '560px' }}
    >
      {slides.map((slide, i) => (
        <div
          key={slide.id || i}
          aria-hidden={i !== current}
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0 }}
        >
          <picture>
            {slide.mobileImage && (
              <source media="(max-width: 768px)" srcSet={slide.mobileImage} type="image/webp" />
            )}
            <source srcSet={slide.deskImage} type="image/webp" />
            <img
              src={slide.deskImage}
              alt={slide.alt || 'Grupo INCAP — Adhesivos industriales'}
              className="w-full h-full object-cover"
              loading={i === 0 ? 'eager' : 'lazy'}
              fetchPriority={i === 0 ? 'high' : 'auto'}
            />
          </picture>
        </div>
      ))}

      {slides.length > 1 && (
        <>
          {/* Flechas */}
          <button
            onClick={prev}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-black/30 hover:bg-black/60 text-white text-3xl flex items-center justify-center transition-colors"
            aria-label="Banner anterior"
          >
            ‹
          </button>
          <button
            onClick={next}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-black/30 hover:bg-black/60 text-white text-3xl flex items-center justify-center transition-colors"
            aria-label="Siguiente banner"
          >
            ›
          </button>

          {/* Dots */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === current
                    ? 'w-8 h-3 bg-[#85C639]'
                    : 'w-3 h-3 bg-white/50 hover:bg-white/80'
                }`}
                aria-label={`Ir a slide ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}

export const query = `
  query Query($slides: [HeroSlideInput], $autoplaySpeed: Int) {
    heroSliderWidget(slides: $slides, autoplaySpeed: $autoplaySpeed) {
      slides {
        id
        deskImage
        mobileImage
        alt
      }
      autoplaySpeed
    }
  }
`;

export const fragments = `
  fragment HeroSlideData on HeroSlide {
    id
    deskImage
    mobileImage
    alt
  }
`;

export const variables = `{
  slides: getWidgetSetting("slides"),
  autoplaySpeed: getWidgetSetting("autoplaySpeed")
}`;
