import React from 'react';
function renderBlock(block) {
    var _a, _b, _c, _d, _e, _f, _g;
    if (!(block === null || block === void 0 ? void 0 : block.type))
        return '';
    if (block.type === 'paragraph')
        return `<p>${((_a = block.data) === null || _a === void 0 ? void 0 : _a.text) || ''}</p>`;
    if (block.type === 'header')
        return `<h${((_b = block.data) === null || _b === void 0 ? void 0 : _b.level) || 3}>${((_c = block.data) === null || _c === void 0 ? void 0 : _c.text) || ''}</h${((_d = block.data) === null || _d === void 0 ? void 0 : _d.level) || 3}>`;
    if (block.type === 'list') {
        const tag = ((_e = block.data) === null || _e === void 0 ? void 0 : _e.style) === 'ordered' ? 'ol' : 'ul';
        const items = (((_f = block.data) === null || _f === void 0 ? void 0 : _f.items) || []).map((i) => `<li>${i}</li>`).join('');
        return `<${tag}>${items}</${tag}>`;
    }
    if (block.type === 'raw')
        return ((_g = block.data) === null || _g === void 0 ? void 0 : _g.html) || '';
    return '';
}
function toHtml(raw) {
    var _a;
    if (!raw)
        return '';
    if (typeof raw === 'string') {
        try {
            const parsed = JSON.parse(raw);
            return toHtml(parsed);
        }
        catch (_b) {
            return raw;
        }
    }
    if (!Array.isArray(raw))
        return '';
    // EverShop native format: rows → columns → blocks
    if (((_a = raw[0]) === null || _a === void 0 ? void 0 : _a.columns) !== undefined) {
        return raw.flatMap((row) => (row.columns || []).flatMap((col) => { var _a; return (((_a = col.data) === null || _a === void 0 ? void 0 : _a.blocks) || []).map(renderBlock); })).join('');
    }
    // Simple EditorJS format: [{type, data}]
    return raw.map(renderBlock).join('');
}
export default function ProductDescription({ product }) {
    const html = toHtml(product === null || product === void 0 ? void 0 : product.description).trim();
    if (!html)
        return null;
    return (React.createElement("div", { className: "pb-4 border-b border-slate-100 mb-2" },
        React.createElement("div", { className: "incap-desc text-slate-600 text-sm leading-relaxed", dangerouslySetInnerHTML: { __html: html } })));
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
