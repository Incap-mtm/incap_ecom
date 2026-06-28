/**
 * Página admin /blog-admin
 * Gestiona los metadatos del blog: lista de posts en el setting `blog_index`.
 * El cuerpo de cada artículo se redacta en Admin → CMS → Pages.
 */
import React from 'react';
interface Props {
    setting: {
        blogIndex: string;
    };
}
export default function BlogAdminPage({ setting }: Props): React.JSX.Element;
export declare const layout: {
    areaId: string;
    sortOrder: number;
};
export declare const query = "\n  query BlogAdminQuery {\n    setting {\n      blogIndex\n    }\n  }\n";
export {};
