/**
 * Página admin /productos-destacados
 * El administrador elige (hasta 10) los productos que aparecen en el carrusel
 * "Productos Destacados" del home. La selección se guarda en el setting
 * `featured_products` (array JSON de uuids) vía /api/featured-products.
 */
import React from 'react';
export default function FeaturedProductsPage(): React.JSX.Element;
export declare const layout: {
    areaId: string;
    sortOrder: number;
};
