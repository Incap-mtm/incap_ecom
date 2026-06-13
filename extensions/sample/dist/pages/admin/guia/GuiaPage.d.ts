import React from 'react';
interface Props {
    urlProductNew: string;
    urlProductGrid: string;
    urlStoreSetting: string;
    urlCmsPageGrid: string;
    urlWidgetGrid: string;
    urlUserGrid: string;
}
export default function GuiaPage({ urlProductNew, urlProductGrid, urlStoreSetting, urlCmsPageGrid, urlWidgetGrid, urlUserGrid }: Props): React.JSX.Element;
export declare const layout: {
    areaId: string;
    sortOrder: number;
};
export declare const query = "\n  query GuiaPageQuery {\n    urlProductNew: url(routeId: \"productNew\")\n    urlProductGrid: url(routeId: \"productGrid\")\n    urlStoreSetting: url(routeId: \"storeSetting\")\n    urlCmsPageGrid: url(routeId: \"cmsPageGrid\")\n    urlWidgetGrid: url(routeId: \"widgetGrid\")\n    urlUserGrid: url(routeId: \"userGrid\")\n  }\n";
export {};
