/**
 * Página admin /blog-admin — editor completo del blog INCAP.
 *
 * Todo el blog (título, slug, excerpt, fecha, tags, destacado, portada, cuerpo)
 * se gestiona desde aquí. El cuerpo es Markdown almacenado en el setting
 * `blog_index` — sin dependencia de CMS Pages.
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
