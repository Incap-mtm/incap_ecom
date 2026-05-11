import React from 'react';

interface ProductProps {
  product?: {
    attributes?: Array<{ attribute_code: string; attribute_value: string }>;
  };
}

const GHSPictogram = ({ code }: { code: string }) => {
  const pictograms: Record<string, { name: string, color: string, icon: string }> = {
    GHS02: { name: 'Inflamable', color: 'bg-red-50 text-red-600', icon: '🔥' },
    GHS07: { name: 'Irritante', color: 'bg-orange-50 text-orange-600', icon: '⚠️' },
    GHS08: { name: 'Riesgo Salud', color: 'bg-blue-50 text-blue-600', icon: '👤' },
  };
  const p = pictograms[code] || { name: code, color: 'bg-slate-100', icon: '?' };
  return (
    <div className={`flex flex-col items-center gap-2 p-4 rounded-2xl ${p.color} border border-current/10 w-24`}>
      <span className="text-3xl">{p.icon}</span>
      <span className="text-[8px] font-black uppercase tracking-tighter text-center">{p.name}</span>
    </div>
  );
};

export default function TechnicalInfo({ product }: ProductProps) {
  const [activeTab, setActiveTab] = React.useState('tech');
  const getAttr = (code: string) => product?.attributes?.find(a => a.attribute_code === code)?.attribute_value;

  const instructionsRaw = getAttr('modo_empleo') || '';
  const instructionsList = instructionsRaw.replace(/<[^>]*>?/gm, '').split('.').filter((s: string) => s.trim().length > 0);

  const safetyH = getAttr('safety_h') || 'Puede causar irritación cutánea o ocular leve en caso de exposición prolongada.';
  const safetyP = getAttr('safety_p') || 'Usar equipo de protección. Evitar inhalación de vapores.';
  const safetyPictograms = ['GHS02', 'GHS07', 'GHS08']; 

  return (
    <div className="mt-24 border-t border-slate-100 pt-16">
      {/* Tabs Selector */}
      <div className="flex space-x-12 border-b border-slate-200 mb-12">
        {[
          { id: 'tech', label: 'Información Técnica' },
          { id: 'safety', label: 'Seguridad y Manejo' }
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-8 text-[11px] font-black uppercase tracking-[0.4em] transition-all relative ${activeTab === tab.id ? 'text-[#2A4899]' : 'text-slate-400 hover:text-slate-600'}`}
          >
            {tab.label}
            {activeTab === tab.id && <div className="absolute bottom-0 left-0 w-full h-1 bg-[#85C639] rounded-full"></div>}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-8 bg-white rounded-[3rem] p-12 shadow-2xl border border-slate-100">
          {activeTab === 'tech' ? (
            <div className="animate-fadeIn">
              <h3 className="text-4xl font-black text-[#2A4899] mb-12 uppercase tracking-tighter font-sora">Instrucciones de Uso</h3>
              <div className="space-y-12">
                {instructionsList.length > 0 ? (
                  instructionsList.map((step: string, i: number) => (
                    <div key={i} className="flex gap-10 group">
                      <div className="flex-shrink-0 w-14 h-14 rounded-full bg-slate-50 text-[#2A4899] font-black text-xl flex items-center justify-center border-2 border-transparent group-hover:border-[#85C639] group-hover:bg-[#85C639] group-hover:text-[#181B1C] transition-all duration-500 transform group-hover:rotate-6 shadow-sm">
                        {i + 1}
                      </div>
                      <div>
                        <p className="text-slate-600 font-medium leading-relaxed text-xl group-hover:text-[#2A4899] transition-colors">{step.trim()}.</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500 italic">Consultar el manual técnico para este producto.</p>
                )}
              </div>
            </div>
          ) : (
            <div className="animate-fadeIn">
              <h3 className="text-4xl font-black text-[#2A4899] mb-12 uppercase tracking-tighter font-sora">Manejo de Seguridad</h3>
              <div className="space-y-8">
                <p className="text-slate-600 text-lg leading-relaxed font-medium">Este producto cumple con los estándares internacionales de seguridad industrial. Se recomienda el uso de EPP adecuado.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
                  <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 hover:border-[#85C639] transition-colors">
                    <h4 className="text-[#2A4899] font-black text-sm uppercase mb-4 tracking-widest">Advertencias (H)</h4>
                    <p className="text-slate-500 text-sm leading-relaxed font-medium">{safetyH}</p>
                  </div>
                  <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 hover:border-[#85C639] transition-colors">
                    <h4 className="text-[#2A4899] font-black text-sm uppercase mb-4 tracking-widest">Precauciones (P)</h4>
                    <p className="text-slate-500 text-sm leading-relaxed font-medium">{safetyP}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-4 space-y-10">
          <div className="bg-[#181B1C] rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group">
            <h4 className="text-[#2A4899] font-black uppercase tracking-[0.3em] text-[10px] mb-10 flex items-center">
              <span className="w-2 h-2 rounded-full bg-[#85C639] mr-4 animate-pulse"></span>Información de Seguridad (GHS)
            </h4>
            <div className="grid grid-cols-3 gap-4 mb-10 relative z-10">
              {safetyPictograms.map(p => <GHSPictogram key={p} code={p} />)}
            </div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">Consulte la hoja de seguridad completa antes de manipular este adhesivo.</p>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full translate-x-20 -translate-y-20 group-hover:scale-110 transition-transform duration-1000"></div>
          </div>
          
          <div className="bg-[#2A4899] rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden group">
             <div className="relative z-10">
                <h3 className="text-3xl font-black mb-8 uppercase tracking-tighter">Soporte Técnico</h3>
                <p className="text-white/70 font-medium mb-12 leading-relaxed text-lg">¿Dudas sobre el rendimiento o la aplicación en tu línea de producción?</p>
                <button className="w-full py-6 bg-[#85C639] text-[#181B1C] rounded-2xl font-black uppercase tracking-widest hover:bg-white transition-all transform hover:-translate-y-2 shadow-xl text-xs">Contactar Técnico</button>
             </div>
             <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full translate-x-20 -translate-y-20 group-hover:scale-110 transition-transform duration-1000"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const layout = {
  areaId: 'productPageBottom',
  sortOrder: 15
};

