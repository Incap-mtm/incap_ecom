import React from 'react';
interface PageProps {
    setting?: {
        googleMapsKey?: string;
    };
}
export default function DistribuidoresPage({ setting }: PageProps): React.JSX.Element;
export declare const layout: {
    areaId: string;
    sortOrder: number;
};
export declare const query = "\n  query {\n    setting {\n      googleMapsKey\n    }\n  }\n";
export {};
