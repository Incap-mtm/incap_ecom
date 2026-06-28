import React, { useState, useMemo } from 'react';
import { useQuery } from 'urql';
import { parseBlogIndex, formatDate } from '../../../components/blogData.js';
const QUERY = `
  query BlogPageQuery {
    setting {
      blogIndex
      storeWhatsappNumber
    }
  }
`;
const AZUL = '#2A4899';
const VERDE = '#85C639';
const PAGE_SIZE = 9;
const S = {
    kicker: {
        fontSize: '10px',
        fontWeight: 800,
        color: VERDE,
        letterSpacing: '0.35em',
        textTransform: 'uppercase',
        marginBottom: '10px',
        display: 'block',
    },
    h1: {
        fontSize: 'clamp(2rem, 5vw, 3.5rem)',
        fontWeight: 900,
        color: '#fff',
        margin: '0 0 1rem',
        lineHeight: 1.1,
        letterSpacing: '-0.02em',
        fontFamily: 'Sora, sans-serif',
    },
    body: {
        fontSize: '15px',
        color: '#374151',
        lineHeight: 1.8,
        fontFamily: 'Sora, sans-serif',
        margin: '0 0 1rem',
    },
};
function TagChip({ label, active, onClick }) {
    return (React.createElement("button", { onClick: onClick, style: {
            padding: '5px 14px',
            borderRadius: '20px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '11px',
            fontWeight: 800,
            fontFamily: 'Sora, sans-serif',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            background: active ? AZUL : '#f1f5f9',
            color: active ? '#fff' : '#64748b',
            transition: 'all 0.15s',
        } }, label));
}
function PostCard({ post }) {
    return (React.createElement("a", { href: `/blog/${post.slug}`, style: {
            display: 'flex',
            flexDirection: 'column',
            background: '#fff',
            borderRadius: '0 16px 16px 16px',
            border: '1px solid #e2e8f0',
            overflow: 'hidden',
            textDecoration: 'none',
            boxShadow: '0 2px 12px rgba(42,72,153,0.06)',
            transition: 'box-shadow 0.2s, transform 0.2s',
        }, onMouseEnter: (e) => {
            e.currentTarget.style.boxShadow = '0 8px 30px rgba(42,72,153,0.15)';
            e.currentTarget.style.transform = 'translateY(-2px)';
        }, onMouseLeave: (e) => {
            e.currentTarget.style.boxShadow = '0 2px 12px rgba(42,72,153,0.06)';
            e.currentTarget.style.transform = 'translateY(0)';
        } },
        React.createElement("div", { style: { position: 'relative', aspectRatio: '16/9', overflow: 'hidden', background: '#f1f5f9' } },
            React.createElement("img", { src: post.cover, alt: post.title, style: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' } }),
            post.featured && (React.createElement("span", { style: {
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    background: VERDE,
                    color: '#181B1C',
                    fontSize: '8px',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    letterSpacing: '0.15em',
                    padding: '4px 10px',
                    borderRadius: '20px',
                } }, "Destacado"))),
        React.createElement("div", { style: { padding: '1.25rem 1.5rem 1.5rem', flex: 1, display: 'flex', flexDirection: 'column' } },
            React.createElement("div", { style: { display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '10px' } }, post.tags.slice(0, 2).map((tag) => (React.createElement("span", { key: tag, style: {
                    fontSize: '9px',
                    fontWeight: 800,
                    color: AZUL,
                    background: '#eff6ff',
                    borderRadius: '6px',
                    padding: '3px 8px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                } }, tag)))),
            React.createElement("span", { style: { fontSize: '11px', color: '#94a3b8', fontFamily: 'Sora, sans-serif', marginBottom: '8px' } }, formatDate(post.date)),
            React.createElement("h2", { style: {
                    fontSize: '1rem',
                    fontWeight: 900,
                    color: '#181B1C',
                    margin: '0 0 0.625rem',
                    lineHeight: 1.3,
                    fontFamily: 'Sora, sans-serif',
                } }, post.title),
            React.createElement("p", { style: {
                    fontSize: '13px',
                    color: '#64748b',
                    lineHeight: 1.65,
                    margin: '0 0 1.25rem',
                    fontFamily: 'Sora, sans-serif',
                    flex: 1,
                } }, post.excerpt),
            React.createElement("span", { style: {
                    alignSelf: 'flex-start',
                    fontSize: '11px',
                    fontWeight: 900,
                    color: AZUL,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                } }, "Leer m\u00E1s \u2192"))));
}
function FeaturedPost({ post }) {
    return (React.createElement("a", { href: `/blog/${post.slug}`, style: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 0,
            background: '#fff',
            borderRadius: '0 24px 24px 24px',
            border: '1px solid #e2e8f0',
            overflow: 'hidden',
            textDecoration: 'none',
            boxShadow: '0 4px 24px rgba(42,72,153,0.1)',
            marginBottom: '2rem',
        } },
        React.createElement("div", { style: { position: 'relative', minHeight: '260px', background: '#f1f5f9' } },
            React.createElement("img", { src: post.cover, alt: post.title, style: { width: '100%', height: '100%', objectFit: 'cover', display: 'block', position: 'absolute', inset: 0 } }),
            React.createElement("span", { style: {
                    position: 'absolute',
                    top: '16px',
                    left: '16px',
                    background: VERDE,
                    color: '#181B1C',
                    fontSize: '9px',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    letterSpacing: '0.15em',
                    padding: '5px 12px',
                    borderRadius: '20px',
                } }, "Art\u00EDculo destacado")),
        React.createElement("div", { style: { padding: '2rem 2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' } },
            React.createElement("div", { style: { display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' } }, post.tags.map((tag) => (React.createElement("span", { key: tag, style: {
                    fontSize: '9px',
                    fontWeight: 800,
                    color: AZUL,
                    background: '#eff6ff',
                    borderRadius: '6px',
                    padding: '3px 8px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                } }, tag)))),
            React.createElement("span", { style: { fontSize: '12px', color: '#94a3b8', fontFamily: 'Sora, sans-serif', marginBottom: '10px' } }, formatDate(post.date)),
            React.createElement("h2", { style: {
                    fontSize: 'clamp(1.2rem, 2.5vw, 1.75rem)',
                    fontWeight: 900,
                    color: '#181B1C',
                    margin: '0 0 0.875rem',
                    lineHeight: 1.25,
                    fontFamily: 'Sora, sans-serif',
                } }, post.title),
            React.createElement("p", { style: { fontSize: '14px', color: '#64748b', lineHeight: 1.7, margin: '0 0 1.5rem', fontFamily: 'Sora, sans-serif' } }, post.excerpt),
            React.createElement("span", { style: {
                    alignSelf: 'flex-start',
                    background: AZUL,
                    color: '#fff',
                    fontSize: '11px',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    letterSpacing: '0.12em',
                    padding: '10px 22px',
                    borderRadius: '50px',
                } }, "Leer art\u00EDculo \u2192"))));
}
export default function BlogPage() {
    var _a, _b;
    const [result] = useQuery({ query: QUERY, requestPolicy: 'cache-and-network' });
    const blogData = parseBlogIndex((_b = (_a = result.data) === null || _a === void 0 ? void 0 : _a.setting) === null || _b === void 0 ? void 0 : _b.blogIndex);
    // Ordenar por fecha descendente
    const sortedPosts = useMemo(() => [...blogData.posts].sort((a, b) => b.date.localeCompare(a.date)), [blogData.posts]);
    const allTags = useMemo(() => {
        const tagSet = new Set();
        sortedPosts.forEach((p) => p.tags.forEach((t) => tagSet.add(t)));
        return Array.from(tagSet);
    }, [sortedPosts]);
    const [activeTag, setActiveTag] = useState('');
    const [page, setPage] = useState(1);
    const featured = sortedPosts.find((p) => p.featured);
    const filteredPosts = activeTag ? sortedPosts.filter((p) => p.tags.includes(activeTag)) : sortedPosts;
    const totalPages = Math.ceil(filteredPosts.length / PAGE_SIZE);
    const pagedPosts = filteredPosts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    const handleTagChange = (tag) => {
        setActiveTag(tag === activeTag ? '' : tag);
        setPage(1);
    };
    return (React.createElement("div", { style: { fontFamily: 'Sora, sans-serif', background: '#f8fafc', minHeight: '100vh' } },
        React.createElement("section", { style: {
                background: `linear-gradient(135deg, ${AZUL} 0%, #1e3576 100%)`,
                position: 'relative',
                overflow: 'hidden',
                padding: '5rem 2rem 4rem',
            } },
            React.createElement("div", { style: { position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 80% 40%, rgba(133,198,57,0.07) 0%, transparent 65%)', pointerEvents: 'none' } }),
            React.createElement("div", { style: { maxWidth: '1200px', margin: '0 auto', position: 'relative' } },
                React.createElement("span", { style: S.kicker }, "Blog INCAP"),
                React.createElement("h1", { style: S.h1 },
                    "Conocimiento t\u00E9cnico",
                    React.createElement("br", null),
                    React.createElement("span", { style: { color: VERDE } }, "para la industria")),
                React.createElement("p", { style: {
                        fontSize: '16px',
                        color: 'rgba(255,255,255,0.72)',
                        maxWidth: '540px',
                        lineHeight: 1.75,
                        margin: '0',
                        fontFamily: 'Sora, sans-serif',
                    } }, "Noticias, casos de \u00E9xito y gu\u00EDas t\u00E9cnicas de Grupo INCAP para fabricantes y distribuidores colombianos."))),
        React.createElement("div", { style: { maxWidth: '1200px', margin: '0 auto', padding: '3rem 2rem 5rem' } },
            allTags.length > 0 && (React.createElement("div", { style: { display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '2rem', alignItems: 'center' } },
                React.createElement("span", { style: { fontSize: '9px', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.2em', textTransform: 'uppercase', marginRight: '4px' } }, "Filtrar"),
                React.createElement(TagChip, { label: "Todos", active: !activeTag, onClick: () => handleTagChange('') }),
                allTags.map((tag) => (React.createElement(TagChip, { key: tag, label: tag, active: activeTag === tag, onClick: () => handleTagChange(tag) }))))),
            !activeTag && featured && React.createElement(FeaturedPost, { post: featured }),
            pagedPosts.length > 0 ? (React.createElement("div", { style: {
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: '1.5rem',
                } }, pagedPosts.map((post) => (React.createElement(PostCard, { key: post.slug, post: post }))))) : (React.createElement("div", { style: {
                    textAlign: 'center',
                    padding: '5rem 2rem',
                    background: '#fff',
                    borderRadius: '20px',
                    border: '1px solid #e2e8f0',
                } },
                React.createElement("p", { style: { color: '#94a3b8', fontSize: '15px', fontFamily: 'Sora, sans-serif', margin: 0 } }, "No hay art\u00EDculos con este filtro."))),
            totalPages > 1 && (React.createElement("div", { style: {
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '8px',
                    marginTop: '3rem',
                } }, Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (React.createElement("button", { key: p, onClick: () => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }, style: {
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: 900,
                    fontSize: '14px',
                    fontFamily: 'Sora, sans-serif',
                    background: p === page ? AZUL : '#fff',
                    color: p === page ? '#fff' : '#64748b',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
                } }, p))))))));
}
export const layout = {
    areaId: 'content',
    sortOrder: 1,
};
//# sourceMappingURL=BlogPage.js.map