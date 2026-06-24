/**
 * Override del bloque de variantes del core.
 * Agrega un botón "Desvincular" por fila que llama a
 * POST /api/unlink-variant con JSON { productId }.
 * (Endpoint propio de la extensión: el del core hace
 * SET visibility = NULL y acá esa columna es NOT NULL → 500.)
 *
 * Reemplaza:
 *   node_modules/@evershop/evershop/dist/modules/catalog/pages/admin/productEdit/VariantGroup.js
 * Por mismo basename + carpeta productEdit+productNew.
 */
import React from 'react';
interface VariantGroupAttribute {
    attributeId: string;
    attributeCode: string;
    attributeName: string;
    options: {
        optionId: string;
        optionText: string;
    }[];
}
interface VGroup {
    variantGroupId: string;
    attributes: VariantGroupAttribute[];
    addItemApi: string;
}
interface ProductProps {
    productId: number;
    uuid: string;
    variantGroup: VGroup | null;
}
interface VariantGroupProps {
    product: ProductProps;
    createVariantGroupApi: string;
    createProductApi: string;
}
declare const VariantGroup: ({ product }: VariantGroupProps) => React.JSX.Element;
export declare const layout: {
    areaId: string;
    sortOrder: number;
};
export declare const query = "\nquery Query {\n  product(id: getContextValue('productId', null)) {\n    productId\n    uuid\n    variantGroup {\n      variantGroupId\n      attributes: variantAttributes {\n        attributeId\n        attributeCode\n        attributeName\n        options {\n          optionId\n          optionText\n        }\n      }\n      addItemApi\n    }\n  }\n  createVariantGroupApi: url(routeId: \"createVariantGroup\")\n  createProductApi: url(routeId: \"createProduct\")\n}\n";
export default VariantGroup;
