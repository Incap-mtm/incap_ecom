import React, { useState } from 'react';

interface FaqItem { question: string; answer: string; }
interface ProductProps {
  product?: {
    attributes?: Array<{ attributeCode: string; optionText: string }>;
  };
}

function AccordionItem({ item, isOpen, onToggle }: {
  item: FaqItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-white/10 last:border-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-6 text-left gap-4 group"
        aria-expanded={isOpen}
      >
        <span className="text-sm font-bold text-white group-hover:text-[#85C639] transition-colors duration-200 font-sora uppercase tracking-wide">
          {item.question}
        </span>
        <span className={`flex-shrink-0 w-7 h-7 rounded-full border border-white/20 flex items-center justify-center transition-all duration-300 ${isOpen ? 'bg-[#85C639] border-[#85C639]' : 'group-hover:border-[#85C639]'}`}>
          <svg className={`w-3.5 h-3.5 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#181B1C]' : 'text-white/60'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>
      {isOpen && (
        <div className="pb-6 pr-10 text-white/50 text-sm leading-relaxed font-inter">
          {item.answer}
        </div>
      )}
    </div>
  );
}

export default function ProductFAQ({ product }: ProductProps) {
  const faqAttr = product?.attributes?.find(a => a.attributeCode === 'preguntas_frecuentes');
  let faqs: FaqItem[] = [];
  if (faqAttr?.optionText) {
    try { faqs = JSON.parse(faqAttr.optionText); } catch {}
  }

  if (faqs.length === 0) return null;

  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };

  return (
    <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
    />
    <section className="bg-[#181B1C] py-20 relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#85C639]/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

      <div className="max-w-[1536px] mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">

          {/* Left — título */}
          <div className="lg:col-span-2">
            <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight font-sora mb-2">
              Preguntas<br />
              <span className="text-[#85C639] italic">Frecuentes</span>
            </h2>
            <div className="w-24 h-2 bg-[#85C639] mb-6"></div>
            <p className="text-sm text-white/40 leading-relaxed font-inter">
              Información técnica esencial para optimizar el uso de este producto en sus procesos industriales.
            </p>
          </div>

          {/* Right — accordion */}
          <div className="lg:col-span-3">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                item={faq}
                isOpen={openIndex === i}
                onToggle={() => toggle(i)}
              />
            ))}
          </div>

        </div>
      </div>
    </section>
    </>
  );
}

export const layout = {
  areaId: 'productPageBottom',
  sortOrder: 20
};

export const query = `
query Query {
    product: currentProduct {
      attributes: attributeIndex {
        attributeCode
        optionText
      }
    }
}
`;
