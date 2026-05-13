import React from 'react';

interface ProductProps {
  product?: {
    description?: any;
  };
}

function renderBlock(block: any): string {
  if (!block?.type) return '';
  if (block.type === 'paragraph') return `<p>${block.data?.text || ''}</p>`;
  if (block.type === 'header')    return `<h${block.data?.level || 3}>${block.data?.text || ''}</h${block.data?.level || 3}>`;
  if (block.type === 'list') {
    const tag   = block.data?.style === 'ordered' ? 'ol' : 'ul';
    const items = (block.data?.items || []).map((i: string) => `<li>${i}</li>`).join('');
    return `<${tag}>${items}</${tag}>`;
  }
  if (block.type === 'raw') return block.data?.html || '';
  return '';
}

function toHtml(raw: any): string {
  if (!raw) return '';

  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw);
      return toHtml(parsed);
    } catch {
      return raw;
    }
  }

  if (!Array.isArray(raw)) return '';

  // EverShop native format: rows → columns → blocks
  if (raw[0]?.columns !== undefined) {
    return raw.flatMap((row: any) =>
      (row.columns || []).flatMap((col: any) =>
        (col.data?.blocks || []).map(renderBlock)
      )
    ).join('');
  }

  // Simple EditorJS format: [{type, data}]
  return raw.map(renderBlock).join('');
}

export default function ProductDescription({ product }: ProductProps) {
  const html = toHtml(product?.description).trim();
  if (!html) return null;

  return (
    <div className="max-w-[1536px] mx-auto px-6 sm:px-8 lg:px-12 py-16 border-t border-slate-100">
      <h2 className="text-3xl md:text-4xl font-black text-[#181B1C] uppercase tracking-tight font-sora mb-2">
        Descripción
      </h2>
      <div className="w-16 h-1.5 bg-[#85C639] mb-8"></div>
      <div className="incap-desc max-w-3xl" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}

export const layout = {
  areaId: 'productPageBottom',
  sortOrder: 1
};

export const query = `
query Query {
    product: currentProduct {
      description
    }
}
`;
