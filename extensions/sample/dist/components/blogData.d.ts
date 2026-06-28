/**
 * Datos por defecto del blog INCAP.
 * Estos datos se usan como fallback cuando el setting `blog_index`
 * no está en la base de datos (ej. localhost sin seed).
 * Son la fuente de verdad para el contenido inicial.
 */
export interface BlogPost {
    slug: string;
    /** @deprecated Ya no se usa — el cuerpo vive en `body` (Markdown). Mantenido para compat. */
    cmsUrlKey?: string;
    title: string;
    excerpt: string;
    cover: string;
    date: string;
    tags: string[];
    featured: boolean;
    /** Cuerpo del artículo en Markdown. Fuente principal desde el refactor 2026-06-28. */
    body: string;
    /** @deprecated Párrafos de texto plano. Fallback si `body` está vacío. */
    bodyFallback?: string[];
}
export interface BlogData {
    posts: BlogPost[];
    tags: string[];
}
export declare const DEFAULT_BLOG: BlogData;
/**
 * Convierte Markdown a HTML seguro.
 *
 * Seguridad: el HTML se escapa ANTES de aplicar los transforms de Markdown.
 * Los URLs en links se validan (solo http/https/relativo/#/mailto).
 * Soporta: ## headings, párrafos, **negrita**, *itálica*, `code`,
 * [link](url), > blockquote, listas - y 1.
 *
 * Sin dependencias externas — renderer self-contained.
 */
export declare function renderMarkdown(md: string): string;
/** Parsea el JSON de blog_index de forma segura y devuelve BlogData. */
export declare function parseBlogIndex(raw: string | null | undefined): BlogData;
/** Formatea una fecha ISO 'YYYY-MM-DD' a texto legible en español. */
export declare function formatDate(iso: string): string;
