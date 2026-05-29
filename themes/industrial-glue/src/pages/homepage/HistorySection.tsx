import React, { useEffect, useRef } from 'react';
import { useReveal } from '../../hooks/useReveal';

const MODEL_URL  = '/images/sections/animacion-producto.glb';
const THREE_CDN  = 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
const GLTF_CDN   = 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/loaders/GLTFLoader.js';

// Bypass TS static analysis on CDN import() so the compiler doesn't try to resolve the URL
const dynImport = new Function('u', 'return import(u)') as (url: string) => Promise<any>;

export default function HistorySection() {
  const reveal    = useReveal();
  const mountRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let disposed    = false;
    let rafId       = 0;
    let renderer: any = null;
    let removeListeners: (() => void) | undefined;

    (async () => {
      const THREE          = await dynImport(THREE_CDN);
      const { GLTFLoader } = await dynImport(GLTF_CDN);
      if (disposed) return;

      /* ── Scene ── */
      const scene  = new THREE.Scene();
      const w      = container.clientWidth  || 500;
      const h      = container.clientHeight || 500;
      const camera = new THREE.PerspectiveCamera(42, w / h, 0.1, 100);
      camera.position.set(0, 0.1, 3.6);

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      container.appendChild(renderer.domElement);

      /* ── Lights ── */
      scene.add(new THREE.AmbientLight(0xffffff, 1.4));
      const key = new THREE.DirectionalLight(0xffffff, 2.2);
      key.position.set(4, 6, 4);
      scene.add(key);
      const fill = new THREE.DirectionalLight(0x8899ff, 0.5);
      fill.position.set(-4, -2, -3);
      scene.add(fill);

      /* ── Load GLB ── */
      const loader  = new GLTFLoader();
      let mixer: any  = null;
      let action: any = null;

      loader.load(MODEL_URL, (gltf: any) => {
        if (disposed) return;
        const model = gltf.scene;

        // Center + scale to fit view
        const box    = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size   = box.getSize(new THREE.Vector3());
        model.position.sub(center);
        model.scale.setScalar(2.6 / Math.max(size.x, size.y, size.z));
        scene.add(model);

        // Wire up the built-in "rotacion" animation to scroll
        if (gltf.animations?.length) {
          mixer  = new THREE.AnimationMixer(model);
          const clip = gltf.animations.find((a: any) => a.name === 'rotacion') ?? gltf.animations[0];
          action = mixer.clipAction(clip);
          action.play();
          action.paused = true;
          action.time   = 0;
          mixer.update(0);
          // Set initial position based on current scroll
          onScroll();
        }

        // Start render loop only after model is ready
        const tick = () => {
          if (disposed) return;
          rafId = requestAnimationFrame(tick);
          renderer.render(scene, camera);
        };
        tick();
      });

      /* ── Scroll → scrub animation time ── */
      const onScroll = () => {
        if (!mixer || !action) return;
        const section = container.closest('section');
        if (!section) return;
        const rect     = section.getBoundingClientRect();
        const vh       = window.innerHeight;
        // 0 = section just entered bottom, 1 = section top at top of viewport
        const progress = Math.min(1, Math.max(0, (vh - rect.top) / (vh + rect.height)));
        action.time = progress * action.getClip().duration;
        mixer.update(0);
      };
      window.addEventListener('scroll', onScroll, { passive: true });

      /* ── Resize ── */
      const onResize = () => {
        if (disposed || !renderer) return;
        const w = container.clientWidth;
        const h = container.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener('resize', onResize);

      removeListeners = () => {
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onResize);
      };
    })();

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      removeListeners?.();
      if (renderer) {
        renderer.dispose();
        renderer.domElement?.remove();
      }
    };
  }, []);

  return (
    <section id="nosotros" className="py-32 bg-slate-50 relative overflow-hidden" ref={reveal.ref}>
      <div className="max-w-[1536px] mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center mb-32">

          {/* Left — text */}
          <div className={`${reveal.className}`}>
            <h2 className="text-[#2A4899] font-black text-[10px] mb-6 tracking-[0.4em] uppercase font-sora">
              Nuestra Historia y Propósito
            </h2>
            <h3 className="text-6xl md:text-8xl font-black text-[#181B1C] font-sora mb-12 leading-[0.9] uppercase tracking-tighter">
              UNIENDO EL LEGADO <br/>DE LA <span className="text-[#85C639] italic">INDUSTRIA</span>
            </h3>
            <p className="text-xl md:text-2xl text-[#2A4899]/70 font-sora font-medium leading-relaxed mb-8 max-w-xl">
              Desde 1969, entendemos que detrás de cada adhesivo hay una familia y una fábrica que compite a nivel global.
            </p>
          </div>

          {/* Right — 3D model */}
          <div className={`relative ${reveal.className} reveal-stagger-2 active mt-10 lg:mt-0`}>
            {/* Canvas container — square aspect ratio, rounded */}
            <div
              ref={mountRef}
              style={{
                width: '100%',
                aspectRatio: '1 / 1',
                borderRadius: '3rem',
                overflow: 'hidden',
                background: 'transparent',
              }}
            />

            {/* Badge overlay */}
            <div className="absolute -bottom-8 -left-8 md:-bottom-12 md:-left-12 bg-[#2A4899] text-white p-8 md:p-12 rounded-[2rem] shadow-2xl z-10 w-64 md:w-80 flex flex-col justify-center">
              <span className="block text-5xl md:text-7xl font-black font-sora mb-1 md:mb-2 leading-none">+56</span>
              <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] font-sora opacity-90 leading-tight">
                AÑOS DE MAESTRÍA TÉCNICA
              </span>
            </div>
          </div>
        </div>

        {/* Value cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {[
            { t: 'INGENIERÍA CON ROSTRO HUMANO',      d: 'No creemos en catálogos fríos. Creemos en la presencia real en tu planta.' },
            { t: 'INNOVACIÓN CON RESPONSABILIDAD',    d: 'Lideramos con fórmulas Libres de Tolueno (LT) para proteger a tus operarios.' },
            { t: 'COMPROMISO GENERACIONAL',           d: 'Somos el puente entre la experiencia y la visión de futuro industrial.' },
          ].map((p, i) => (
            <div
              key={i}
              className={`bg-white p-10 md:p-12 rounded-[2rem] shadow-xl border border-slate-100 hover:border-[#85C639] hover:shadow-2xl transition-all duration-500 group ${reveal.className} reveal-stagger-${i + 1} active`}
            >
              <div className="text-[#85C639] text-3xl md:text-4xl font-black mb-6 md:mb-8 font-sora tracking-tighter">
                0{i + 1}.
              </div>
              <h4 className="text-lg md:text-xl font-black mb-4 font-sora text-[#181B1C] uppercase tracking-tight leading-snug">
                {p.t}
              </h4>
              <p className="text-slate-500 font-sora text-xs md:text-sm leading-relaxed font-medium">
                {p.d}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export const layout = {
  areaId: 'content',
  sortOrder: 10
};
