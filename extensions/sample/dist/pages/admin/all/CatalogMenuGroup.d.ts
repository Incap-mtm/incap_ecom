import React from 'react';
interface Props {
    catalogAdmin: string;
    featuredProducts: string;
}
export default function CatalogMenuGroup({ catalogAdmin, featuredProducts }: Props): React.JSX.Element;
export declare const layout: {
    areaId: string;
    sortOrder: number;
};
export declare const query = "\n  query CatalogMenuGroupQuery {\n    catalogAdmin: url(routeId: \"catalogAdmin\")\n    featuredProducts: url(routeId: \"featuredProducts\")\n  }\n";
export {};
