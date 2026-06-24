import React from 'react';
interface ProductProps {
    product?: {
        productId?: number;
        sku?: string;
        attributes?: Array<{
            attributeCode: string;
            optionText: string;
        }>;
    };
}
export default function FichaTecnicaUpload({ product }: ProductProps): React.JSX.Element;
export declare const layout: {
    areaId: string;
    sortOrder: number;
};
export declare const query = "\n  query Query {\n    product(id: getContextValue(\"productId\", null)) {\n      productId\n      sku\n      attributes: attributeIndex {\n        attributeCode\n        optionText\n      }\n    }\n  }\n";
export {};
