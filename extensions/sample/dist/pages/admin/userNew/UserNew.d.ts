import React from 'react';
interface Props {
    userGridUrl: string;
}
export default function UserNew({ userGridUrl }: Props): React.JSX.Element;
export declare const layout: {
    areaId: string;
    sortOrder: number;
};
export declare const query = "\n  query UserNewQuery {\n    userGridUrl: url(routeId: \"userGrid\")\n  }\n";
export {};
