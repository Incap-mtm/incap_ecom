import React from 'react';
interface Props {
    guia: string;
}
export default function GuiaMenuGroup({ guia }: Props): React.JSX.Element;
export declare const layout: {
    areaId: string;
    sortOrder: number;
};
export declare const query = "\n  query GuiaMenuGroupQuery {\n    guia: url(routeId: \"guia\")\n  }\n";
export {};
