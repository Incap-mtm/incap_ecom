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
    <div className="pb-4 border-b border-slate-100 mb-2">
      <div className="incap-desc text-slate-600 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}

export const layout = {
  areaId: 'productPageMiddleRight',
  sortOrder: 3,
};

export const query = `
query Query {
    product: currentProduct {
      description
    }
}
`;
