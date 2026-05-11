import React from 'react';
const products = [
    {
        id: 1,
        name: 'Epóxico Industrial X-treme',
        category: 'Construcción',
        price: '$45.00',
        image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=2070'
    },
    {
        id: 2,
        name: 'Adhesivo de Madera Pro',
        category: 'Carpintería',
        price: '$22.50',
        image: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=2070'
    },
    {
        id: 3,
        name: 'Cemento de Contacto Gold',
        category: 'Universal',
        price: '$18.00',
        image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=2070'
    }
];
export default function ProductGrid() {
    return /*#__PURE__*/ React.createElement("div", {
        className: "bg-white py-16 px-4 sm:px-6 lg:px-8"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "max-w-7xl mx-auto"
    }, /*#__PURE__*/ React.createElement("h2", {
        className: "text-3xl font-extrabold tracking-tight text-slate-900 mb-8"
    }, "Productos Destacados"), /*#__PURE__*/ React.createElement("div", {
        className: "grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8"
    }, products.map((product)=>/*#__PURE__*/ React.createElement("div", {
            key: product.id,
            className: "group relative"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "w-full min-h-80 bg-slate-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:h-80 lg:aspect-none transition-opacity duration-300"
        }, /*#__PURE__*/ React.createElement("img", {
            src: product.image,
            alt: product.name,
            className: "w-full h-full object-center object-cover lg:w-full lg:h-full"
        })), /*#__PURE__*/ React.createElement("div", {
            className: "mt-4 flex justify-between"
        }, /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("h3", {
            className: "text-sm text-slate-700"
        }, /*#__PURE__*/ React.createElement("a", {
            href: `/product/${product.id}`
        }, /*#__PURE__*/ React.createElement("span", {
            "aria-hidden": "true",
            className: "absolute inset-0"
        }), product.name)), /*#__PURE__*/ React.createElement("p", {
            className: "mt-1 text-sm text-slate-500"
        }, product.category)), /*#__PURE__*/ React.createElement("p", {
            className: "text-sm font-medium text-slate-900"
        }, product.price)))))));
}
export const layout = {
    areaId: 'content',
    sortOrder: 100
};
