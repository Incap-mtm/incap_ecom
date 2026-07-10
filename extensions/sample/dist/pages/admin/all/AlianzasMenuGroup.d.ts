import React from 'react';
interface Props {
    alianzasAdmin: string;
}
export default function AlianzasMenuGroup({ alianzasAdmin }: Props): React.JSX.Element;
export declare const layout: {
    areaId: string;
    sortOrder: number;
};
export declare const query = "\n  query AlianzasMenuGroupQuery {\n    alianzasAdmin: url(routeId: \"alianzasAdmin\")\n  }\n";
export {};
