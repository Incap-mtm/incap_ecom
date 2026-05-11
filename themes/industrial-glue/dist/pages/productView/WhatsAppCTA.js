import React, { useEffect, useState } from 'react';
const WHATSAPP_NUMBER = '5491112345678'; // Cambiar por el número real
export default function WhatsAppCTA({ product }) {
    const [productName, setProductName] = useState('');
    const [productSku, setProductSku] = useState('');
    useEffect(()=>{
        // Try props first, then fall back to document title
        if (product?.name) {
            setProductName(product.name);
            setProductSku(product.sku || '');
        } else {
            const titleParts = document.title.split(' - ');
            setProductName(titleParts[0] || document.title);
        }
    }, [
        product
    ]);
    const message = encodeURIComponent(`Hola INCAP! Me interesa el producto: *${productName || 'este producto'}*` + `${productSku ? ` (SKU: ${productSku})` : ''}` + `\n¿Pueden asesorarme sobre disponibilidad y precios?`);
    return /*#__PURE__*/ React.createElement("div", {
        className: "mt-10 pt-10 border-t border-slate-100"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex flex-col gap-4"
    }, /*#__PURE__*/ React.createElement("a", {
        href: `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`,
        target: "_blank",
        rel: "noopener noreferrer",
        className: "w-full py-7 bg-[#2A4899] text-white rounded-[2rem] font-black uppercase tracking-[0.2em] hover:bg-[#85C639] hover:text-[#181B1C] transition-all duration-500 transform hover:-translate-y-2 shadow-2xl text-[11px] flex items-center justify-center gap-4 group"
    }, /*#__PURE__*/ React.createElement("svg", {
        className: "w-6 h-6 transition-transform group-hover:rotate-12",
        fill: "currentColor",
        viewBox: "0 0 24 24"
    }, /*#__PURE__*/ React.createElement("path", {
        d: "M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.232 3.484 8.412-.003 6.557-5.338 11.892-11.893 11.892-1.997-.001-3.951-.5-5.688-1.448l-6.309 1.656zm6.224-3.82l.303.174c1.46.843 3.147 1.288 4.871 1.289 5.432 0 9.851-4.419 9.854-9.853.002-2.633-1.023-5.11-2.887-6.974-1.864-1.864-4.341-2.887-6.973-2.888-5.433 0-9.852 4.419-9.855 9.853-.001 2.052.54 4.05 1.564 5.776l.192.323-1.01 3.687 3.782-.992z"
    })), "Cotizar por WhatsApp"), /*#__PURE__*/ React.createElement("p", {
        className: "text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2"
    }, "Asesoría técnica inmediata especializada")));
}
export const layout = {
    areaId: 'productPageMiddleRight',
    sortOrder: 50
};
