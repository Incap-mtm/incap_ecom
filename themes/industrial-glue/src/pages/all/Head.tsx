import React from 'react';

export default function Head() {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
      <script src="https://cdn.tailwindcss.com"></script>
      <style>{`
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
          font-family: var(--font-heading);
          letter-spacing: -0.02em;
        }
        .bg-incap-blue { background-color: var(--color-incap-blue); }
        .bg-incap-green { background-color: var(--color-incap-green); }
        .text-incap-blue { color: var(--color-incap-blue); }
        .text-incap-green { color: var(--color-incap-green); }

        /* Smooth scroll for the entire site */
        html { scroll-behavior: smooth; }

        /* Hide default Evershop header middle (logo row) */
        .header__middle { display: none !important; }
        .header { padding: 0 !important; background: transparent !important; position: fixed; width: 100%; top: 0; z-index: 100; transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); }

        /* Custom navbar styles with transparency/glassmorphism */
        .incap-navbar {
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          background: linear-gradient(to bottom, rgba(24, 27, 28, 0.9) 0%, rgba(24, 27, 28, 0) 100%);
        }
        .incap-navbar.scrolled {
          background-color: rgba(24, 27, 28, 0.92);
          backdrop-filter: blur(20px);
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
          padding: 0.25rem 0;
        }
        .incap-navbar__inner {
          max-width: 1536px; /* 8xl equivalent */
          margin: 0 auto;
          padding: 0 2rem;
          height: 90px;
          display: flex;
          align-items: center;
          gap: 3rem;
          transition: height 0.4s ease;
        }
        .incap-navbar.scrolled .incap-navbar__inner {
          height: 72px;
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
        .incap-navbar__inner {
          max-width: 1440px;
          margin: 0 auto;
          padding: 0 1.5rem;
          height: 72px;
          display: flex;
          align-items: center;
          gap: 2rem;
        }
        .incap-navbar__logo {
          display: flex;
          align-items: center;
          flex-shrink: 0;
        }
        .incap-navbar__logo img {
          height: 40px;
          width: auto;
          object-fit: contain;
          filter: brightness(0) invert(1);
        }
        .incap-navbar__links {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          flex: 1;
          justify-content: center;
        }
        .incap-navbar__link {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 0.5rem 0.875rem;
          color: rgba(255,255,255,0.85);
          font-size: 0.8125rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          text-decoration: none;
          font-family: 'Sora', sans-serif;
          border-radius: 6px;
          transition: color 0.2s, background 0.2s;
        }
        .incap-navbar__link:hover {
          color: #ffffff;
          background: rgba(255,255,255,0.07);
        }
        .incap-navbar__chevron {
          opacity: 0.6;
          flex-shrink: 0;
        }
        .incap-navbar__cta {
          display: inline-flex;
          align-items: center;
          padding: 0.625rem 1.25rem;
          background-color: #85C639;
          color: #181B1C;
          font-size: 0.8125rem;
          font-weight: 700;
          letter-spacing: 0.08em;
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
          margin-left: auto;
        }
        .incap-navbar__mobile {
          display: flex;
          flex-direction: column;
          background: #1f2325;
          padding: 1rem 1.5rem;
          gap: 0.25rem;
        }
        .incap-navbar__mobile-link {
          display: block;
          padding: 0.75rem 0;
          color: rgba(255,255,255,0.85);
          font-size: 0.9375rem;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          text-decoration: none;
          font-family: 'Sora', sans-serif;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .incap-navbar__cta--mobile {
          margin-top: 0.75rem;
          justify-content: center;
        }
        @media (max-width: 768px) {
          .incap-navbar__links { display: none; }
          .incap-navbar__cta:not(.incap-navbar__cta--mobile) { display: none; }
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
      `}</style>
    </>
  );
}

export const layout = {
  areaId: 'head',
  sortOrder: 1
};
