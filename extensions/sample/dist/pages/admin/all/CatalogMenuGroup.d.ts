import React from 'react';
interface Props {
    catalogAdmin: string;
}
export default function CatalogMenuGroup({ catalogAdmin }: Props): React.JSX.Element;
export declare const layout: {
    areaId: string;
    sortOrder: number;
};
export declare const query = "\n  query CatalogMenuGroupQuery {\n    catalogAdmin: url(routeId: \"catalogAdmin\")\n  }\n";
export {};
