import React, { useState, useEffect } from 'react';
import { useQuery } from 'urql';
import { parseBlogIndex, formatDate } from '../../../components/blogData.js';
const SETTING_QUERY = `
  query BlogPostSettingQuery {
    setting {
      blogIndex
      storeWhatsappNumber
    }
  }
`;
const AZUL = '#2A4899';
const VERDE = '#85C639';
function renderBlock(block, idx) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    const bodyStyle = {
        fontSize: '16px',
        color: '#374151',
        lineHeight: 1.85,
        fontFamily: 'Sora, sans-serif',
        margin: '0 0 1.25rem',
    };
    switch (block.type) {
        case 'paragraph':
            return (React.createElement("p", { key: idx, style: bodyStyle, dangerouslySetInnerHTML: { __html: (_b = (_a = block.data) === null || _a === void 0 ? void 0 : _a.text) !== null && _b !== void 0 ? _b : '' } }));
        case 'header': {
            const level = (_d = (_c = block.data) === null || _c === void 0 ? void 0 : _c.level) !== null && _d !== void 0 ? _d : 2;
            const headStyle = {
                fontSize: level <= 2 ? '1.5rem' : '1.2rem',
                fontWeight: 900,
                color: '#181B1C',
                margin: '2rem 0 0.875rem',
                fontFamily: 'Sora, sans-serif',
                lineHeight: 1.25,
            };
            return React.createElement(`h${level}`, { key: idx, style: headStyle }, (_f = (_e = block.data) === null || _e === void 0 ? void 0 : _e.text) !== null && _f !== void 0 ? _f : '');
        }
        case 'list': {
            const ListTag = ((_g = block.data) === null || _g === void 0 ? void 0 : _g.style) === 'ordered' ? 'ol' : 'ul';
            return (React.createElement(ListTag, { key: idx, style: { paddingLeft: '1.5rem', margin: '0 0 1.25rem' } }, ((_j = (_h = block.data) === null || _h === void 0 ? void 0 : _h.items) !== null && _j !== void 0 ? _j : []).map((item, i) => (React.createElement("li", { key: i, style: { ...bodyStyle, margin: '0 0 0.4rem' } }, item)))));
        }
        case 'quote':
            return (React.createElement("blockquote", { key: idx, style: {
                    borderLeft: `4px solid ${AZUL}`,
                    paddingLeft: '1.5rem',
                    margin: '1.75rem 0',
                    fontStyle: 'italic',
                } },
                React.createElement("p", { style: { ...bodyStyle, color: '#2A4899' } },
                    "\"", (_l = (_k = block.data) === null || _k === void 0 ? void 0 : _k.text) !== null && _l !== void 0 ? _l : '',
                    "\""),
                ((_m = block.data) === null || _m === void 0 ? void 0 : _m.caption) && (React.createElement("cite", { style: { fontSize: '13px', color: '#64748b', fontFamily: 'Sora, sans-serif' } },
                    "\u2014 ",
                    block.data.caption))));
        default:
            return null;
    }
}
/** Extrae bloques EditorJS aplanados desde la estructura Row[] del CMS. */
function extractBlocks(content) {
    var _a;
    if (!content || !Array.isArray(content))
        return [];
    const blocks = [];
    for (const row of content) {
        if (!Array.isArray(row === null || row === void 0 ? void 0 : row.columns))
            continue;
        for (const col of row.columns) {
            if (!Array.isArray((_a = col === null || col === void 0 ? void 0 : col.data) === null || _a === void 0 ? void 0 : _a.blocks))
                continue;
            blocks.push(...col.data.blocks);
        }
    }
    return blocks;
}
export default function BlogPostPage() {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    const [isClient, setIsClient] = useState(false);
    const [slug, setSlug] = useState('');
    useEffect(() => {
        setIsClient(true);
        // Extraer slug de /blog/:slug
        const parts = window.location.pathname.split('/').filter(Boolean);
        setSlug(parts[parts.length - 1] || '');
    }, []);
    // Setting query (siempre activa; no depende del cliente)
    const [settingResult] = useQuery({
        query: SETTING_QUERY,
        requestPolicy: 'cache-and-network',
    });
    const blogData = parseBlogIndex((_b = (_a = settingResult.data) === null || _a === void 0 ? void 0 : _a.setting) === null || _b === void 0 ? void 0 : _b.blogIndex);
    const wa = (_e = (_d = (_c = settingResult.data) === null || _c === void 0 ? void 0 : _c.setting) === null || _d === void 0 ? void 0 : _d.storeWhatsappNumber) !== null && _e !== void 0 ? _e : '573002171521';
    // Encontrar el post por slug
    const post = slug
        ? blogData.posts.find((p) => p.slug === slug)
        : undefined;
    // CMS query — sólo cuando tenemos el slug
    const cmsUrlKey = (_f = post === null || post === void 0 ? void 0 : post.cmsUrlKey) !== null && _f !== void 0 ? _f : '';
    const cmsQueryStr = cmsUrlKey
        ? `query { cmsPages(filters: [{ key: "url_key", operation: eq, value: "${cmsUrlKey}" }, { key: "limit", operation: eq, value: "500" }]) { items { urlKey name content metaTitle metaDescription } } }`
        : '{ __typename }';
    const [cmsResult] = useQuery({
        query: cmsQueryStr,
        pause: !isClient || !cmsUrlKey,
        requestPolicy: 'cache-and-network',
    });
    // Extraer contenido del CMS o usar fallback.
    // El filtro url_key del resolver no es confiable → buscamos por urlKey exacto
    // en los items devueltos (nunca items[0], que sería otro artículo).
    const cmsItems = (_j = (_h = (_g = cmsResult.data) === null || _g === void 0 ? void 0 : _g.cmsPages) === null || _h === void 0 ? void 0 : _h.items) !== null && _j !== void 0 ? _j : [];
    const cmsPage = cmsItems.find((p) => (p === null || p === void 0 ? void 0 : p.urlKey) === cmsUrlKey);
    const blocks = (cmsPage === null || cmsPage === void 0 ? void 0 : cmsPage.content) ? extractBlocks(cmsPage.content) : [];
    const usesFallback = blocks.length === 0;
    // Posts relacionados
    const relatedPosts = blogData.posts.filter((p) => p.slug !== slug).slice(0, 3);
    // JSON-LD Article
    const coverAbsolute = (post === null || post === void 0 ? void 0 : post.cover)
        ? `https://www.grupoincap.com.co${post.cover}`
        : 'https://www.grupoincap.com.co/images/blog/incap-sa-en-interzum-2026.webp';
    const jsonLd = post
        ? JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: post.title,
            image: coverAbsolute,
            datePublished: `${post.date}T00:00:00-05:00`,
            author: { '@type': 'Organization', name: 'Grupo INCAP' },
            publisher: {
                '@type': 'Organization',
                name: 'Grupo INCAP',
                logo: { '@type': 'ImageObject', url: 'https://www.grupoincap.com.co/images/quienes-somos/logo-incap.webp' },
            },
            description: post.excerpt,
            keywords: post.tags.join(', '),
        })
        : null;
    // Estado de carga
    if (!isClient || !slug) {
        return (React.createElement("div", { style: { minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' } },
            React.createElement("p", { style: { color: '#94a3b8', fontFamily: 'Sora, sans-serif', fontSize: '15px' } }, "Cargando art\u00EDculo...")));
    }
    if (isClient && slug && !settingResult.fetching && !post) {
        return (React.createElement("div", { style: { minHeight: '60vh', maxWidth: '800px', margin: '4rem auto', padding: '0 2rem', textAlign: 'center' } },
            React.createElement("h1", { style: { fontSize: '2rem', fontWeight: 900, color: '#181B1C', fontFamily: 'Sora, sans-serif', marginBottom: '1rem' } }, "Art\u00EDculo no encontrado"),
            React.createElement("p", { style: { color: '#64748b', fontSize: '15px', fontFamily: 'Sora, sans-serif', marginBottom: '1.5rem' } }, "El art\u00EDculo que buscas no existe o fue movido."),
            React.createElement("a", { href: "/blog", style: {
                    display: 'inline-block',
                    background: AZUL,
                    color: '#fff',
                    padding: '12px 28px',
                    borderRadius: '50px',
                    fontSize: '11px',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    letterSpacing: '0.12em',
                    textDecoration: 'none',
                } }, "Ver todos los art\u00EDculos")));
    }
    if (!post)
        return null;
    const metaTitle = (_k = cmsPage === null || cmsPage === void 0 ? void 0 : cmsPage.metaTitle) !== null && _k !== void 0 ? _k : post.title;
    const metaDesc = (_l = cmsPage === null || cmsPage === void 0 ? void 0 : cmsPage.metaDescription) !== null && _l !== void 0 ? _l : post.excerpt;
    return (React.createElement("div", { style: { fontFamily: 'Sora, sans-serif', background: '#f8fafc', minHeight: '100vh' } },
        jsonLd && (React.createElement("script", { type: "application/ld+json", dangerouslySetInnerHTML: { __html: jsonLd } })),
        isClient && (() => {
            document.title = metaTitle;
            let desc = document.querySelector('meta[name="description"]');
            if (!desc) {
                desc = document.createElement('meta');
                desc.name = 'description';
                document.head.appendChild(desc);
            }
            desc.content = metaDesc;
            return null;
        })(),
        React.createElement("section", { style: {
                position: 'relative',
                height: 'clamp(320px, 45vw, 520px)',
                overflow: 'hidden',
                background: '#181B1C',
            } },
            React.createElement("img", { src: post.cover, alt: post.title, style: {
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    opacity: 0.55,
                } }),
            React.createElement("div", { style: {
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to bottom, rgba(24,27,28,0.2) 0%, rgba(24,27,28,0.85) 100%)',
                } }),
            React.createElement("div", { style: {
                    position: 'relative',
                    maxWidth: '900px',
                    margin: '0 auto',
                    padding: '0 2rem',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    paddingBottom: '3rem',
                } },
                React.createElement("div", { style: { display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '16px' } },
                    React.createElement("a", { href: "/blog", style: { fontSize: '11px', color: 'rgba(255,255,255,0.65)', textDecoration: 'none', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' } }, "Blog"),
                    React.createElement("span", { style: { color: 'rgba(255,255,255,0.4)', fontSize: '11px' } }, "\u203A"),
                    React.createElement("span", { style: { fontSize: '11px', color: 'rgba(255,255,255,0.65)', textTransform: 'uppercase', letterSpacing: '0.1em' } }, (_m = post.tags[0]) !== null && _m !== void 0 ? _m : 'Artículo')),
                React.createElement("div", { style: { display: 'flex', gap: '6px', marginBottom: '14px', flexWrap: 'wrap' } }, post.tags.map((tag) => (React.createElement("span", { key: tag, style: {
                        background: VERDE,
                        color: '#181B1C',
                        fontSize: '9px',
                        fontWeight: 900,
                        textTransform: 'uppercase',
                        letterSpacing: '0.12em',
                        padding: '4px 10px',
                        borderRadius: '20px',
                    } }, tag)))),
                React.createElement("h1", { style: {
                        fontSize: 'clamp(1.5rem, 4vw, 2.75rem)',
                        fontWeight: 900,
                        color: '#fff',
                        margin: '0 0 1rem',
                        lineHeight: 1.15,
                        fontFamily: 'Sora, sans-serif',
                    } }, post.title),
                React.createElement("span", { style: { fontSize: '12px', color: 'rgba(255,255,255,0.55)', fontFamily: 'Sora, sans-serif' } }, formatDate(post.date)))),
        React.createElement("article", { style: { maxWidth: '780px', margin: '0 auto', padding: '3.5rem 2rem 3rem' } },
            React.createElement("p", { style: {
                    fontSize: '18px',
                    color: '#374151',
                    lineHeight: 1.75,
                    fontFamily: 'Sora, sans-serif',
                    margin: '0 0 2.5rem',
                    fontWeight: 500,
                    borderLeft: `4px solid ${VERDE}`,
                    paddingLeft: '1.25rem',
                } }, post.excerpt),
            usesFallback
                ? post.bodyFallback.map((text, i) => (React.createElement("p", { key: i, style: {
                        fontSize: '16px',
                        color: '#374151',
                        lineHeight: 1.85,
                        fontFamily: 'Sora, sans-serif',
                        margin: '0 0 1.25rem',
                    } }, text)))
                : blocks.map((block, i) => renderBlock(block, i))),
        relatedPosts.length > 0 && (React.createElement("section", { style: {
                background: '#fff',
                borderTop: '1px solid #e2e8f0',
                padding: '3.5rem 2rem 4rem',
            } },
            React.createElement("div", { style: { maxWidth: '1200px', margin: '0 auto' } },
                React.createElement("span", { style: {
                        fontSize: '10px',
                        fontWeight: 800,
                        color: VERDE,
                        letterSpacing: '0.35em',
                        textTransform: 'uppercase',
                        display: 'block',
                        marginBottom: '8px',
                    } }, "M\u00E1s art\u00EDculos"),
                React.createElement("h2", { style: {
                        fontSize: 'clamp(1.2rem, 2.5vw, 1.75rem)',
                        fontWeight: 900,
                        color: '#181B1C',
                        margin: '0 0 2rem',
                        fontFamily: 'Sora, sans-serif',
                    } }, "Tambi\u00E9n puede interesarte"),
                React.createElement("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' } }, relatedPosts.map((rp) => (React.createElement("a", { key: rp.slug, href: `/blog/${rp.slug}`, style: {
                        display: 'flex',
                        gap: '1rem',
                        alignItems: 'flex-start',
                        background: '#f8fafc',
                        borderRadius: '0 12px 12px 12px',
                        border: '1px solid #e2e8f0',
                        padding: '1rem',
                        textDecoration: 'none',
                    } },
                    React.createElement("img", { src: rp.cover, alt: rp.title, style: { width: '80px', height: '60px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 } }),
                    React.createElement("div", null,
                        React.createElement("span", { style: { fontSize: '9px', color: '#94a3b8', fontFamily: 'Sora, sans-serif', display: 'block', marginBottom: '4px' } }, formatDate(rp.date)),
                        React.createElement("p", { style: {
                                fontSize: '12px',
                                fontWeight: 900,
                                color: '#181B1C',
                                margin: 0,
                                lineHeight: 1.35,
                                fontFamily: 'Sora, sans-serif',
                            } }, rp.title.length > 80 ? rp.title.slice(0, 80) + '…' : rp.title))))))))),
        React.createElement("section", { style: {
                background: `linear-gradient(135deg, ${AZUL} 0%, #1e3576 100%)`,
                padding: '4rem 2rem',
                textAlign: 'center',
            } },
            React.createElement("span", { style: {
                    fontSize: '10px',
                    fontWeight: 800,
                    color: VERDE,
                    letterSpacing: '0.35em',
                    textTransform: 'uppercase',
                    display: 'block',
                    marginBottom: '12px',
                } }, "\u00BFTienes dudas t\u00E9cnicas?"),
            React.createElement("h2", { style: {
                    fontSize: 'clamp(1.4rem, 3vw, 2.25rem)',
                    fontWeight: 900,
                    color: '#fff',
                    margin: '0 0 1rem',
                    fontFamily: 'Sora, sans-serif',
                } }, "Nuestros t\u00E9cnicos resuelven tus dudas gratis"),
            React.createElement("p", { style: {
                    fontSize: '14px',
                    color: 'rgba(255,255,255,0.65)',
                    maxWidth: '520px',
                    margin: '0 auto 1.75rem',
                    lineHeight: 1.7,
                    fontFamily: 'Sora, sans-serif',
                } }, "Escr\u00EDbenos por WhatsApp y recibe asesor\u00EDa t\u00E9cnica personalizada para tu industria."),
            React.createElement("a", { href: `https://wa.me/${wa}?text=${encodeURIComponent('Hola INCAP, leí su artículo y tengo una consulta técnica.')}`, target: "_blank", rel: "noopener noreferrer", style: {
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    background: VERDE,
                    color: '#181B1C',
                    padding: '14px 32px',
                    borderRadius: '50px',
                    fontSize: '12px',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    letterSpacing: '0.12em',
                    textDecoration: 'none',
                } }, "Hablar con un t\u00E9cnico INCAP \u2192"))));
}
export const layout = {
    areaId: 'content',
    sortOrder: 1,
};
//# sourceMappingURL=BlogPostPage.js.map