import React from 'react';

export default function Hero() {
  return (
    <div className="relative bg-slate-900 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 bg-slate-900 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="sm:text-center lg:text-left">
              <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
                <span className="block xl:inline">Soluciones de pegado</span>{' '}
                <span className="block text-amber-400 xl:inline">Ultra Resistentes</span>
              </h1>
              <p className="mt-3 text-base text-slate-300 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                Fabricamos el futuro de la industria con adhesivos diseñados para los retos más exigentes. Desde construcción pesada hasta manualidades de precisión.
              </p>
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                <div className="rounded-md shadow">
                  <a href="/shop" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-slate-900 bg-amber-400 hover:bg-amber-500 md:py-4 md:text-lg md:px-10 transition-all duration-300 transform hover:scale-105">
                    Ver Catálogo
                  </a>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <a href="/contact" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-slate-800 hover:bg-slate-700 md:py-4 md:text-lg md:px-10 transition-all duration-300">
                    Asesoría Técnica
                  </a>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <img
          className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
          src="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&q=80&w=2070"
          alt="Industrial production"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent to-slate-900 opacity-60"></div>
      </div>
    </div>
  );
}

export const layout = {
  areaId: 'content',
  sortOrder: 1
};
