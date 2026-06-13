import React from 'react';
interface Props {
    userGrid: string;
}
export default function UsersMenuGroup({ userGrid }: Props): React.JSX.Element;
export declare const layout: {
    areaId: string;
    sortOrder: number;
};
export declare const query = "\n  query UsersMenuGroupQuery {\n    userGrid: url(routeId: \"userGrid\")\n  }\n";
export {};
