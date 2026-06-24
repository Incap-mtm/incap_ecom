/**
 * Página admin /orden-tamanos
 * Permite al administrador definir el orden global de aparición de los tamaños
 * de variante en la ficha de producto del storefront.
 */
import React from 'react';
interface SizeOption {
    id: number;
    text: string;
}
export declare const layout: {
    areaId: string;
    sortOrder: number;
};
export declare const query = "\n  query VariantSizeOrderPageQuery {\n    setting {\n      variantSizeOrder\n    }\n    sizeOptions {\n      id\n      text\n    }\n  }\n";
export default function VariantSizeOrderPageWrapper({ setting, sizeOptions }: {
    setting: {
        variantSizeOrder: string;
    };
    sizeOptions: SizeOption[];
}): React.JSX.Element;
export {};
