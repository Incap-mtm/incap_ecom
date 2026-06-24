import React from 'react';
interface CatalogToolsProps {
    variantSizeOrderUrl?: string;
}
export default function CatalogTools({ variantSizeOrderUrl }: CatalogToolsProps): React.JSX.Element;
export declare const layout: {
    areaId: string;
    sortOrder: number;
};
export declare const query = "\n  query CatalogToolsQuery {\n    variantSizeOrderUrl: url(routeId: \"variantSizeOrder\")\n  }\n";
export {};
