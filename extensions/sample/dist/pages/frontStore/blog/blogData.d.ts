/**
 * Datos por defecto del blog INCAP.
 * Estos datos se usan como fallback cuando el setting `blog_index`
 * no está en la base de datos (ej. localhost sin seed).
 * Son la fuente de verdad para el contenido inicial.
 */
export interface BlogPost {
    slug: string;
    cmsUrlKey: string;
    title: string;
    excerpt: string;
    cover: string;
    date: string;
    tags: string[];
    featured: boolean;
    bodyFallback: string[];
}
export interface BlogData {
    posts: BlogPost[];
    tags: string[];
}
export declare const DEFAULT_BLOG: BlogData;
/** Parsea el JSON de blog_index de forma segura y devuelve BlogData. */
export declare function parseBlogIndex(raw: string | null | undefined): BlogData;
/** Formatea una fecha ISO 'YYYY-MM-DD' a texto legible en español. */
export declare function formatDate(iso: string): string;
