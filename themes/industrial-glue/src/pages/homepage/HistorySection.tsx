import React, { useEffect, useRef } from 'react';
import { useReveal } from '../../hooks/useReveal';

const MODEL_URL = '/images/sections/animacion-producto.glb';

export default function HistorySection() {
  const reveal   = useReveal();
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let injected = false;

    const inject = () => {
      if (injected) return;
      injected = true;

      // Unique ID so the module script can find the DOM node
      container.id = 'incap-3d-mount';

      // Remove any leftover script from a previous render
      document.getElementById('incap-3d-script')?.remove();

      // Inject a real <script type="module"> — the only reliable way to use
      // ES-module CDN imports (import() from within a normal script context
      // doesn't resolve relative sub-imports inside Three.js correctly).
      const script = document.createElement('script');
    script.type = 'module';
    script.id   = 'incap-3d-script';

    // NOTE: MODEL_URL is interpolated here by TypeScript/JS at runtime,
    // not inside the script string.
    const modelUrl = MODEL_URL;

    script.textContent = `
import * as THREE     from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const container = document.getElementById('incap-3d-mount');
if (!container) { console.warn('[INCAP 3D] mount container not found'); }
else init(container);

function init(container) {
  // Wait one RAF so CSS layout (width/height) has settled
  requestAnimationFrame(() => {
    const w = container.offsetWidth  || 520;
    const h = container.offsetHeight || 520;

    /* Scene */
    const scene  = new THREE.Scene();
    // FOV 46° + z=4.5 → producto llena bien el canvas sin cortes
    const camera = new THREE.PerspectiveCamera(46, w / h, 0.1, 100);
    camera.position.set(0, 0.5, 4.5);
    camera.lookAt(0, -0.4, 0); // mira ligeramente hacia abajo → producto en mitad inferior

    /* Renderer — no premultipliedAlpha so transparency is clean */
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, premultipliedAlpha: false });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    // Tone mapping filmico → evita que los highlights del plastico blanco se
    // "quemen"/clipeen (colores explotados). Rolloff suave de las altas luces.
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = false;
    container.appendChild(renderer.domElement);

    /* Environment map — estudio neutro para que los materiales PBR
       (plástico del envase) se vean blancos/limpios y no grises */
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

    /* Lights — intensidades moderadas: con el tone mapping filmico + el
       environment (RoomEnvironment) el plastico se ve blanco y limpio sin
       quemarse. Antes estaban muy altas (ambient 2.8 / key 3.6) → clipping. */
    scene.add(new THREE.AmbientLight(0xffffff, 1.1));
    const key = new THREE.DirectionalLight(0xffffff, 2.0);
    key.position.set(4, 8, 6);
    scene.add(key);
    // Relleno blanco (antes azulado, que engrisaba el producto)
    const fill = new THREE.DirectionalLight(0xffffff, 0.5);
    fill.position.set(-5, -2, -3);
    scene.add(fill);
    const rim = new THREE.DirectionalLight(0xffffff, 0.55);
    rim.position.set(-3, 4, -6);
    scene.add(rim);

    let raf       = 0;
    let mixer     = null;
    let action    = null;
    let tiltGroup = null;

    /* Load model */
    new GLTFLoader().load(
      '${modelUrl}',
      (gltf) => {
        const model = gltf.scene;

        /* Center + scale to show full product */
        const box  = new THREE.Box3().setFromObject(model);
        const c    = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        model.position.sub(c);
        // Scale so the tallest dimension fits comfortably in view with breathing room (−10%)
        model.scale.setScalar(2.664 / Math.max(size.x, size.y, size.z));

        // Wrap in a group for the static tilt — keeps animation on model unaffected
        const isMobile = window.innerWidth < 1024;
        tiltGroup = new THREE.Group();
        tiltGroup.rotation.z = (15 * Math.PI / 180);
        tiltGroup.position.y = isMobile ? -1.3  : -1.25;
        tiltGroup.position.x = isMobile ?  0.0  : -1.5;
        tiltGroup.add(model);
        scene.add(tiltGroup);
        onScroll(); // estado inicial: escala pequeña + rotación en 0

        /* Wire scroll to the built-in 'rotacion' animation */
        if (gltf.animations && gltf.animations.length) {
          mixer  = new THREE.AnimationMixer(model);
          const clip = gltf.animations.find(a => a.name === 'rotacion') || gltf.animations[0];
          action = mixer.clipAction(clip);
          action.play();
          action.paused = true;
          action.time   = 0;
          mixer.update(0);
          onScroll(); // set initial position
        }

        /* Render loop */
        (function tick() { raf = requestAnimationFrame(tick); renderer.render(scene, camera); })();
      },
      undefined,
      (err) => console.error('[INCAP 3D] GLB error:', err)
    );

    /* Scroll → escala (pequeño→actual) + scrub de la rotación.
       El progreso va de 0 (el producto entra por abajo) a 1 (desaparece por
       arriba), atado a la visibilidad del PRODUCTO (no de toda la sección). */
    function onScroll() {
      if (!tiltGroup) return;
      const rect = container.getBoundingClientRect();
      const vh   = window.innerHeight;
      const prog = Math.min(1, Math.max(0, (vh - rect.top) / (vh + rect.height)));

      // Rotación scrubada por scroll (si el modelo trae animación)
      if (action && mixer) {
        action.time = prog * action.getClip().duration;
        mixer.update(0);
      }

      // Escala: inicia pequeño y crece hasta el tamaño actual (scale = 1),
      // alcanzándolo cuando el producto queda centrado/arriba (~75% del recorrido).
      const SCALE_MIN = 0.45;
      const g     = Math.min(1, prog / 0.75);
      const eased = 1 - Math.pow(1 - g, 3); // easeOutCubic
      tiltGroup.scale.setScalar(SCALE_MIN + (1 - SCALE_MIN) * eased);
    }
    window.addEventListener('scroll', onScroll, { passive: true });

    /* Resize */
    function onResize() {
      const w = container.offsetWidth;
      const h = container.offsetHeight;
      if (!w || !h) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
    window.addEventListener('resize', onResize);

    /* Cleanup hook for React unmount */
    window.__incap3dCleanup = function() {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      delete window.__incap3dCleanup;
    };
  });
}
    `;

      document.head.appendChild(script);
    };

    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { observer.disconnect(); inject(); } },
      { rootMargin: '300px', threshold: 0 }
    );
    observer.observe(container);

    return () => {
      observer.disconnect();
      const cleanup = (window as any).__incap3dCleanup;
      if (typeof cleanup === 'function') cleanup();
      document.getElementById('incap-3d-script')?.remove();
    };
  }, []);

  return (
    <section id="nosotros" className="py-32 bg-slate-50 relative" ref={reveal.ref}>
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

          {/* Right — composición: "+56 años" (fondo) + producto 3D (frente) + mascota (derecha) */}
          <div
            className={`relative ${reveal.className} reveal-stagger-2 active mt-10 lg:mt-0`}
            style={{ minHeight: '640px' }}
          >
            {/* "+56 años" — capa de fondo */}
            <img
              src="/images/sections/56_anos_maxon.webp"
              alt="+56 años de experiencia"
              loading="lazy"
              style={{ position: 'absolute', zIndex: 0, top: 0, left: '50%', transform: 'translateX(-50%)', width: '140%', maxWidth: '840px', pointerEvents: 'none', userSelect: 'none' }}
            />

            {/* Mascota INCAP — a la derecha, detrás del producto */}
            <img
              src="/images/sections/cap_para_maxon.webp"
              alt="Mascota INCAP"
              loading="lazy"
              style={{ position: 'absolute', zIndex: 1, right: 0, bottom: '-48px', width: '72%', maxWidth: '480px', pointerEvents: 'none', userSelect: 'none' }}
            />

            {/* Producto 3D — al frente */}
            <div ref={mountRef} id="incap-3d-mount" style={{ position: 'relative', zIndex: 10 }} />
          </div>

        </div>

        {/* Value cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {[
            { t: 'INGENIERÍA CON ROSTRO HUMANO',   d: 'No creemos en catálogos fríos. Creemos en la presencia real en tu planta.' },
            { t: 'INNOVACIÓN CON RESPONSABILIDAD', d: 'Lideramos con fórmulas Libres de Tolueno (LT) para proteger a tus operarios.' },
            { t: 'COMPROMISO GENERACIONAL',        d: 'Somos el puente entre la experiencia y la visión de futuro industrial.' },
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
