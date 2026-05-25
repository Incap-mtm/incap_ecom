import React from 'react';
export default function Head() {
    return (React.createElement(React.Fragment, null,
        React.createElement("link", { rel: "icon", type: "image/png", href: "/images/icons/imagen-chatflotante.png" }),
        React.createElement("link", { rel: "shortcut icon", href: "/images/icons/imagen-chatflotante.png" }),
        React.createElement("link", { rel: "apple-touch-icon", href: "/images/icons/imagen-chatflotante.png" }),
        React.createElement("script", { dangerouslySetInnerHTML: { __html: `(function(){var t=document.title;if(t&&!t.startsWith('INCAP')){document.title='INCAP | '+t;}else if(!t){document.title='INCAP';}})();` } }),
        React.createElement("link", { rel: "preconnect", href: "https://fonts.googleapis.com" }),
        React.createElement("link", { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" }),
        React.createElement("link", { href: "https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&family=Inter:wght@300;400;500;600&display=swap", rel: "stylesheet" }),
        React.createElement("script", { src: "https://cdn.tailwindcss.com" }),
        React.createElement("style", null, `
        :root {
          --color-incap-blue: #2A4899;
          --color-incap-green: #85C639;
          --color-incap-black: #181B1C;
          --color-incap-gray: #f8f9fa;
          --font-heading: 'Sora', sans-serif;
          --font-body: 'Inter', sans-serif;
        }
        body {
          font-family: var(--font-body);
          background-color: #ffffff;
          color: var(--color-incap-black);
          overflow-x: hidden;
        }
        h1, h2, h3, h4, h5, h6 {
          font-family: var(--font-heading) !important;
          letter-spacing: -0.02em;
        }
        h1 { font-weight: 800 !important; }
        h2 { font-weight: 700 !important; }
        h3 { font-weight: 700 !important; }
        .bg-incap-blue { background-color: var(--color-incap-blue); }
        .bg-incap-green { background-color: var(--color-incap-green); }
        .text-incap-blue { color: var(--color-incap-blue); }
        .text-incap-green { color: var(--color-incap-green); }

        /* Smooth scroll for the entire site */
        html { scroll-behavior: smooth; }

        /* Hide default Evershop header middle (logo row) */
        .header__middle { display: none !important; }
        .header { padding: 0 !important; background: transparent !important; position: fixed; width: 100%; top: 0; z-index: 100; transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); }

        /* Override Evershop default footer — sin separación con la sección anterior */
        .footer, footer.footer { background: #181B1C !important; margin-top: 0 !important; margin-bottom: 0 !important; padding: 0 !important; border: none !important; }
        .footer__top { padding: 0 !important; margin: 0 !important; }
        .footer__bottom, .footer__middle { display: none !important; }
        footer.footer.mt-24, footer[class*="mt-"] { margin-top: 0 !important; }
        /* Eliminar padding/margin del wrapper de página antes del footer */
        .page-wrapper, .page-content, main { margin-bottom: 0 !important; padding-bottom: 0 !important; }
        .product__page__bottom { margin-bottom: 0 !important; padding-bottom: 0 !important; }

        /* Compensar navbar fija en páginas de producto y categoría */
        body.productView, body.categoryView { padding-top: 110px; }

        /* Ocultar breadcrumb nativo de Evershop en páginas de producto */
        body.productView .breadcrumb-list,
        body.productView .breadcrumb-separator,
        body.productView .breadcrumb-item,
        body.productView .breadcrumb-page { display: none !important; }
        body.productView nav.breadcrumb { display: none !important; }

        /* Ocultar nombre y atributos nativos reemplazados por ProductHeaderInfo (ver también línea ~336) */

        /* Custom navbar styles */
        .incap-navbar {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          background: linear-gradient(160deg, #2A4899 0%, #1e3576 100%);
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .incap-navbar.scrolled {
          background: #2A4899;
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.28);
          border-bottom: none;
        }
        .incap-navbar__inner {
          max-width: 1536px;
          margin: 0 auto;
          padding: 0 2rem;
          height: 80px;
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          transition: height 0.4s ease;
        }
        .incap-navbar.scrolled .incap-navbar__inner {
          height: 64px;
        }

        /* Advanced Animations & Effects from Mock */
        .reveal {
          opacity: 0;
          transform: translateY(50px);
          transition: all 1.2s cubic-bezier(0.22, 1, 0.36, 1);
          will-change: transform, opacity;
        }
        .reveal.active {
          opacity: 1;
          transform: translateY(0);
        }
        .reveal-stagger-1 { transition-delay: 0.15s; }
        .reveal-stagger-2 { transition-delay: 0.3s; }
        .reveal-stagger-3 { transition-delay: 0.45s; }

        /* Industry Cards - Glass Effect */
        .industry-card {
          position: relative;
          overflow: hidden;
          border-radius: 1.5rem;
          background: #ffffff;
          box-shadow: 0 10px 40px rgba(0,0,0,0.06);
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .industry-card:hover {
          transform: translateY(-12px);
          box-shadow: 0 20px 60px rgba(0,0,0,0.12);
        }

        /* Buttons & CTAs */
        .btn-incap {
          display: inline-flex;
          align-items: center;
          padding: 0.875rem 1.75rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          border-radius: 0.75rem;
          transition: all 0.3s ease;
          cursor: pointer;
        }
        .btn-primary-incap {
          background-color: var(--color-incap-green);
          color: var(--color-incap-black);
        }
        .btn-primary-incap:hover {
          background-color: #74b030;
          transform: scale(1.05);
          box-shadow: 0 0 20px rgba(133, 198, 57, 0.3);
        }

        /* Marquee Animation */
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }

        /* Hero Zoom Effect */
        .hero-zoom {
          transition: transform 12s linear;
        }
        .hero-section:hover .hero-zoom {
          transform: scale(1.1);
        }

        /* Custom styling for standard Evershop elements to match theme */
        .breadcrumb { padding: 1rem 0; font-size: 0.85rem; color: #666; }
        .breadcrumb a { color: var(--color-incap-blue); font-weight: 600; }
        .breadcrumb .active { color: var(--color-incap-black); }
        .incap-navbar__logo {
          display: flex;
          align-items: center;
          justify-self: start;
          align-self: center;
          line-height: 0;
        }
        .incap-navbar__logo svg {
          display: block;
        }
        .incap-navbar__logo img {
          display: block;
          height: 36px;
          width: auto;
          object-fit: contain;
          filter: brightness(0) invert(1);
        }
        .incap-navbar__links {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          justify-content: center;
        }
        .incap-navbar__right {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 1rem;
        }
        .incap-navbar__link {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 0.5rem 0.875rem;
          color: rgba(255,255,255,0.9);
          font-size: 0.875rem;
          font-weight: 700;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          text-decoration: none;
          font-family: 'Sora', sans-serif;
          border-radius: 6px;
          transition: color 0.2s, background 0.2s;
        }
        .incap-navbar__link:hover {
          color: #ffffff;
          background: rgba(255,255,255,0.1);
        }
        .incap-navbar__chevron { opacity: 0.6; flex-shrink: 0; }
        .incap-navbar__cta {
          display: inline-flex;
          align-items: center;
          padding: 0.625rem 1.25rem;
          background-color: #85C639;
          color: #181B1C;
          font-size: 0.8125rem;
          font-weight: 700;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          text-decoration: none;
          border-radius: 8px;
          font-family: 'Sora', sans-serif;
          white-space: nowrap;
          transition: background 0.2s, transform 0.15s;
          flex-shrink: 0;
        }
        .incap-navbar__cta:hover {
          background-color: #74b030;
          transform: translateY(-1px);
        }
        .incap-navbar__toggle {
          display: none;
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          padding: 0.25rem;
        }
        .incap-navbar__mobile {
          display: flex;
          flex-direction: column;
          background: linear-gradient(180deg, #1e3576 0%, #162c65 100%);
          border-top: 1px solid rgba(255,255,255,0.1);
          padding: 1.25rem 1.5rem 2rem;
          gap: 0;
        }
        .incap-navbar__mobile-link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 0.5rem;
          color: rgba(255,255,255,0.9);
          font-size: 1rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          text-decoration: none;
          font-family: 'Sora', sans-serif;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          transition: color 0.2s, padding-left 0.2s;
        }
        .incap-navbar__mobile-link:hover { color: #85C639; padding-left: 0.75rem; }
        .incap-navbar__cta--mobile {
          margin-top: 1.5rem;
          justify-content: center;
          width: 100%;
          padding: 1rem;
          font-size: 0.9375rem;
          border-radius: 12px;
        }
        @media (max-width: 768px) {
          .incap-navbar__inner { height: 64px; padding: 0 1.25rem; grid-template-columns: auto 1fr auto; }
          .incap-navbar.scrolled .incap-navbar__inner { height: 56px; }
          .incap-navbar__links { display: none; }
          .incap-navbar__right .btn-incap { display: none; }
          .incap-navbar__toggle { display: block; }
        }

        /* Advanced Animations & Effects */
        .reveal {
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.8s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .reveal.active {
          opacity: 1;
          transform: translateY(0);
        }
        .reveal-stagger-1 { transition-delay: 0.1s; }
        .reveal-stagger-2 { transition-delay: 0.2s; }
        .reveal-stagger-3 { transition-delay: 0.3s; }

        .glass-header {
          backdrop-filter: blur(12px);
          background-color: rgba(24, 27, 28, 0.85);
        }

        .hover-lift {
          transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .hover-lift:hover {
          transform: translateY(-8px) scale(1.02);
        }

        .glow-on-hover {
          position: relative;
          overflow: hidden;
        }
        .glow-on-hover::after {
          content: "";
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(133, 198, 57, 0.2) 0%, transparent 70%);
          opacity: 0;
          transition: opacity 0.4s;
          pointer-events: none;
        }
        .glow-on-hover:hover::after {
          opacity: 1;
        }

        .bg-zoom {
          transition: transform 10s linear;
        }
        .hero-active .bg-zoom {
          transform: scale(1.15);
        }

        /* Tailwind custom utilities for fonts */
        .font-sora { font-family: 'Sora', sans-serif; }
        .font-inter { font-family: 'Inter', sans-serif; }

        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 25s linear infinite;
        }

        /* ── Product Description — jerarquía Airbnb ── */

        /* Ocultar componentes nativos reemplazados por los del theme */
        .product__single__description { display: none !important; }
        .product__single__name { display: none !important; }
        .product__single__attributes { display: none !important; }
        /* Temporal: ocultar precio, cantidad y carrito — se usa WhatsApp como CTA */
        #productForm { display: none !important; }

        /* Estilos del componente custom ProductDescription */

        /* h3 — título de sección principal */
        .incap-desc h3 {
          font-size: 1.375rem;
          font-weight: 700;
          color: #181B1C;
          font-family: 'Sora', sans-serif;
          letter-spacing: -0.02em;
          line-height: 1.3;
          margin-top: 0;
          margin-bottom: 0.875rem;
        }

        /* h4 — subsección con acento verde */
        .incap-desc h4 {
          font-size: 0.6875rem;
          font-weight: 700;
          color: #181B1C;
          text-transform: uppercase;
          letter-spacing: 0.18em;
          margin-top: 1.75rem;
          margin-bottom: 0.625rem;
          padding-bottom: 0.375rem;
          border-bottom: 2px solid #85C639;
          display: inline-block;
        }

        /* Párrafos */
        .incap-desc p {
          font-size: 0.9375rem;
          color: #4b5563;
          line-height: 1.8;
          margin-bottom: 0.875rem;
          font-family: 'Inter', sans-serif;
        }

        /* Listas */
        .incap-desc ul,
        .incap-desc ol  { list-style: none; padding-left: 0; margin-bottom: 1rem; }

        .incap-desc li {
          position: relative;
          padding-left: 1.375rem;
          font-size: 0.9375rem;
          color: #4b5563;
          line-height: 1.7;
          margin-bottom: 0.375rem;
          font-family: 'Inter', sans-serif;
        }
        .incap-desc ul li::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0.65rem;
          width: 0.3125rem;
          height: 0.3125rem;
          border-radius: 50%;
          background-color: #85C639;
        }
        .incap-desc ol { counter-reset: incap-ol; }
        .incap-desc ol li { counter-increment: incap-ol; padding-left: 1.75rem; }
        .incap-desc ol li::before {
          content: counter(incap-ol) ".";
          position: absolute;
          left: 0;
          font-weight: 700;
          color: #2A4899;
          font-size: 0.8125rem;
        }

        /* strong/em */
        .incap-desc strong { font-weight: 700; color: #181B1C; }
        .incap-desc em     { font-style: italic; color: #374151; }

        /* ── Variant Selector (presentaciones) — INCAP style ── */
        .variant__container {
          border-top: 1px solid #f1f5f9 !important;
          padding-top: 1.5rem !important;
          margin-top: 1rem !important;
        }
        .variant__container .text-textSubdued {
          font-size: 9px !important;
          font-weight: 900 !important;
          color: #85C639 !important;
          text-transform: uppercase !important;
          letter-spacing: 0.3em !important;
          font-family: 'Sora', sans-serif !important;
          margin-bottom: 0.75rem !important;
        }
        .variant-option-list li button {
          padding: 0.5rem 1rem !important;
          border-radius: 0.75rem !important;
          font-size: 0.75rem !important;
          font-weight: 900 !important;
          font-family: 'Sora', sans-serif !important;
          text-transform: uppercase !important;
          letter-spacing: 0.1em !important;
          border: 2px solid #e2e8f0 !important;
          background: #ffffff !important;
          color: #181B1C !important;
          transition: border-color 0.15s ease !important;
          cursor: pointer !important;
        }
        .variant-option-list li button:hover {
          border-color: #181B1C !important;
        }
        .variant-option-list li.selected button {
          background: #181B1C !important;
          color: #ffffff !important;
          border-color: #181B1C !important;
        }
      `)));
}
export const layout = {
    areaId: 'head',
    sortOrder: 1
};
