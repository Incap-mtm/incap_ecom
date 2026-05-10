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
  // Reads JSON from custom attribute 'preguntas_frecuentes' in EverShop admin
  // Format: [{"question": "...", "answer": "..."}, ...]
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

  if (faqs.length === 0) return null;

  return (
    <div className="mt-10 border-t border-slate-100 pt-10">
      <h3 className="text-lg font-bold text-[#181B1C] mb-6" style={{ fontFamily: 'Sora, sans-serif' }}>
        Preguntas Frecuentes
      </h3>
      <div className="bg-slate-50 rounded-2xl px-6 divide-y divide-slate-100">
        {faqs.map((item, i) => (
          <AccordionItem key={i} item={item} index={i} />
        ))}
      </div>
    </div>
  );
}

export const layout = {
  areaId: 'productPageBottom',
  sortOrder: 20
};
