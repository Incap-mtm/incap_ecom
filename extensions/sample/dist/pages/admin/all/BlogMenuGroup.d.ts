import React from 'react';
interface Props {
    blogAdmin: string;
}
export default function BlogMenuGroup({ blogAdmin }: Props): React.JSX.Element;
export declare const layout: {
    areaId: string;
    sortOrder: number;
};
export declare const query = "\n  query BlogMenuGroupQuery {\n    blogAdmin: url(routeId: \"blogAdmin\")\n  }\n";
export {};
