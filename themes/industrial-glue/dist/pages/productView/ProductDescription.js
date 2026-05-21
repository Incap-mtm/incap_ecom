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
    return (React.createElement("div", { className: "max-w-[1536px] mx-auto px-6 sm:px-8 lg:px-12 py-16 border-t border-slate-100" },
        React.createElement("h2", { className: "text-3xl md:text-4xl font-black text-[#181B1C] uppercase tracking-tight font-sora mb-2" }, "Descripci\u00F3n"),
        React.createElement("div", { className: "w-16 h-1.5 bg-[#85C639] mb-8" }),
        React.createElement("div", { className: "incap-desc max-w-3xl", dangerouslySetInnerHTML: { __html: html } })));
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
