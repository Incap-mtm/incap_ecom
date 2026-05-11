import React, { useState } from 'react';

interface FaqItem {
  question: string;
  answer: string;
}

interface ProductProps {
  product?: {
    attributes?: Array<{ attribute_code: string; attribute_value: string }>;
  };
}

function AccordionItem({ item, index }: { item: FaqItem; index: number }) {
  const [open, setOpen] = useState(index === 0);

  return (
    <div className="border-b border-slate-100 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left gap-4 group"
        aria-expanded={open}
      >
        <span className="font-semibold text-[#181B1C] group-hover:text-[#2A4899] transition-colors duration-200" style={{ fontFamily: 'Sora, sans-serif' }}>
          {item.question}
        </span>
        <svg
          className={`w-5 h-5 text-[#2A4899] flex-shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="pb-5 text-slate-600 leading-relaxed text-sm">
          {item.answer}
        </div>
      )}
    </div>
  );
}

export default function ProductFAQ({ product }: ProductProps) {
  const faqAttr = product?.attributes?.find(
    (a) => a.attribute_code === 'preguntas_frecuentes'
  );

  let faqs: FaqItem[] = [];
  if (faqAttr?.attribute_value) {
    try {
      faqs = JSON.parse(faqAttr.attribute_value);
    } catch {
      // Malformed JSON — skip silently
    }
  }

  // Fallback defaults for the demo to ensure the section renders like the mock
  if (faqs.length === 0) {
    faqs = [
      { question: '¿Tiempo de secado?', answer: 'El tiempo de secado inicial es de 15 minutos, con curado total en 24 horas.' },
      { question: '¿Rendimiento por galón?', answer: 'Aproximadamente 4 a 5 metros cuadrados dependiendo de la porosidad del material.' }
    ];
  }

  return (
    <div className="mt-24 py-24 bg-slate-50 border-y border-slate-100">
       <div className="max-w-[1536px] mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
             <div className="lg:col-span-1">
                <h2 className="text-3xl font-black text-[#181B1C] font-sora mb-6 uppercase tracking-tighter leading-tight">Preguntas Frecuentes</h2>
                <p className="text-sm text-slate-400 font-medium leading-relaxed">Información técnica esencial para optimizar el uso de este producto en sus procesos industriales.</p>
             </div>
             <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                {faqs.map((faq, i) => (
                  <div key={i} className="p-6 bg-white rounded-2xl border border-slate-100 hover:shadow-lg transition-all group">
                     <h4 className="text-sm font-black text-[#181B1C] mb-3 flex gap-3">
                       <span className="text-[#2A4899]">Q.</span> {faq.question}
                     </h4>
                     <p className="text-xs text-slate-500 leading-relaxed font-medium">{faq.answer}</p>
                  </div>
                ))}
                {/* Fixed Storage FAQ */}
                <div className="p-6 bg-white rounded-2xl border border-slate-100 hover:shadow-lg transition-all group">
                     <h4 className="text-sm font-black text-[#181B1C] mb-3 flex gap-3">
                       <span className="text-[#2A4899]">Q.</span> Almacenamiento
                     </h4>
                     <p className="text-xs text-slate-500 leading-relaxed font-medium">Lugar fresco y seco, lejos de la luz solar directa y fuentes de calor extremas.</p>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
}

export const layout = {
  areaId: 'productPageBottom',
  sortOrder: 20
};
