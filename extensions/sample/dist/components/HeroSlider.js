import React, { useState, useEffect } from 'react';
export default function HeroSlider({ heroSliderWidget }) {
    var _a;
    const slides = (_a = heroSliderWidget === null || heroSliderWidget === void 0 ? void 0 : heroSliderWidget.slides) !== null && _a !== void 0 ? _a : [];
    const intervalMs = Number(heroSliderWidget === null || heroSliderWidget === void 0 ? void 0 : heroSliderWidget.autoplaySpeed) || 5000;
    const [current, setCurrent] = useState(0);
    useEffect(() => {
        if (slides.length <= 1)
            return undefined;
        const timer = setInterval(() => {
            setCurrent(prev => (prev + 1) % slides.length);
        }, intervalMs);
        return () => clearInterval(timer);
    }, [slides.length, intervalMs]);
    if (slides.length === 0)
        return null;
    const prev = () => setCurrent(c => (c - 1 + slides.length) % slides.length);
    const next = () => setCurrent(c => (c + 1) % slides.length);
    return (React.createElement("section", { className: "relative w-full overflow-hidden bg-[#181B1C]", style: { height: '90vh', minHeight: '560px' } },
        slides.map((slide, i) => (React.createElement("div", { key: slide.id || i, "aria-hidden": i !== current, className: "absolute inset-0 transition-opacity duration-700", style: { opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0 } },
            React.createElement("picture", null,
                slide.mobileImage && (React.createElement("source", { media: "(max-width: 768px)", srcSet: slide.mobileImage, type: "image/webp" })),
                React.createElement("source", { srcSet: slide.deskImage, type: "image/webp" }),
                React.createElement("img", { src: slide.deskImage, alt: slide.alt || 'Grupo INCAP — Adhesivos industriales', className: "w-full h-full object-cover", loading: i === 0 ? 'eager' : 'lazy', fetchPriority: i === 0 ? 'high' : 'auto' }))))),
        slides.length > 1 && (React.createElement(React.Fragment, null,
            React.createElement("button", { onClick: prev, className: "absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-black/30 hover:bg-black/60 text-white text-3xl flex items-center justify-center transition-colors", "aria-label": "Banner anterior" }, "\u2039"),
            React.createElement("button", { onClick: next, className: "absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-black/30 hover:bg-black/60 text-white text-3xl flex items-center justify-center transition-colors", "aria-label": "Siguiente banner" }, "\u203A"),
            React.createElement("div", { className: "absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2" }, slides.map((_, i) => (React.createElement("button", { key: i, onClick: () => setCurrent(i), className: `rounded-full transition-all duration-300 ${i === current
                    ? 'w-8 h-3 bg-[#85C639]'
                    : 'w-3 h-3 bg-white/50 hover:bg-white/80'}`, "aria-label": `Ir a slide ${i + 1}` }))))))));
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
//# sourceMappingURL=HeroSlider.js.map