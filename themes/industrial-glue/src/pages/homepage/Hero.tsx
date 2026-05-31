import React, { useState, useEffect } from 'react';

const slides = [
  {
    desk: '/images/banners/Hero/banner-01-desk.webp',
    mobile: '/images/banners/Hero/banner-01-mobile.webp',
    deskFallback: '/images/banners/Hero/banner-01-desk.png',
    mobileFallback: '/images/banners/Hero/banner-01-mobile.png',
    alt: 'Adhesivos industriales INCAP — Calidad y respaldo técnico',
  },
  {
    desk: '/images/banners/Hero/banner-02-desk.webp',
    mobile: '/images/banners/Hero/banner-02-mobile.webp',
    deskFallback: '/images/banners/Hero/banner-02-desk.png',
    mobileFallback: '/images/banners/Hero/banner-02-mobile.png',
    alt: 'Soluciones de pegado para la industria colombiana',
  },
  {
    desk: '/images/banners/Hero/banner-03-desk.webp',
    mobile: '/images/banners/Hero/banner-03-mobile.webp',
    deskFallback: '/images/banners/Hero/banner-03-desk.png',
    mobileFallback: '/images/banners/Hero/banner-03-mobile.png',
    alt: 'INCAP — La química que construye país',
  },
  {
    desk: '/images/banners/Hero/banner-04-desk.webp',
    mobile: '/images/banners/Hero/banner-04-mobile.webp',
    deskFallback: '/images/banners/Hero/banner-04-desk.png',
    mobileFallback: '/images/banners/Hero/banner-04-mobile.png',
    alt: 'Grupo INCAP — Fabricantes de adhesivos industriales',
  },
];

const INTERVAL_MS = 5000;

export default function Hero() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % slides.length);
    }, INTERVAL_MS);
    return () => clearInterval(timer);
  }, []);

  const prev = () => setCurrent(c => (c - 1 + slides.length) % slides.length);
  const next = () => setCurrent(c => (c + 1) % slides.length);

  return (
    <section
      className="relative w-full overflow-hidden bg-[#181B1C]"
      style={{ height: '90vh', minHeight: '560px' }}
    >
      {slides.map((slide, i) => (
        <div
          key={i}
          aria-hidden={i !== current}
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0 }}
        >
          <picture>
            <source media="(max-width: 768px)" srcSet={slide.mobile} type="image/webp" />
            <source media="(max-width: 768px)" srcSet={slide.mobileFallback} />
            <source srcSet={slide.desk} type="image/webp" />
            <img
              src={slide.deskFallback}
              alt={slide.alt}
              className="w-full h-full object-cover"
              loading={i === 0 ? 'eager' : 'lazy'}
              fetchPriority={i === 0 ? 'high' : 'auto'}
            />
          </picture>
        </div>
      ))}

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
    </section>
  );
}

export const layout = {
  areaId: 'content',
  sortOrder: 1,
};
