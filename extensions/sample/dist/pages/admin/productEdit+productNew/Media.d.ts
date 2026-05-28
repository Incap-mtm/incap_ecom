import React from 'react';
interface ProductImage {
    uuid: string;
    path: string;
    url: string;
}
interface MediaProps {
    product?: {
        image?: ProductImage;
        gallery?: ProductImage[];
    };
}
export default function Media({ product }: MediaProps): React.JSX.Element;
export declare const layout: {
    areaId: string;
    sortOrder: number;
};
export declare const query = "\n  query Query {\n    product(id: getContextValue(\"productId\", null)) {\n      image {\n        uuid\n        path\n        url\n      }\n      gallery {\n        uuid\n        path\n        url\n      }\n    }\n  }\n";
export {};
