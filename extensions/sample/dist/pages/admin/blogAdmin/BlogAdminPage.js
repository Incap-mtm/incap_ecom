/**
 * Página admin /blog-admin
 * Gestiona los metadatos del blog: lista de posts en el setting `blog_index`.
 * El cuerpo de cada artículo se redacta en Admin → CMS → Pages.
 */
import React, { useState } from 'react';
import { DEFAULT_BLOG } from '../../frontStore/blog/blogData.js';
const AZUL = '#2A4899';
const VERDE = '#85C639';
const BORDER = '#e2e8f0';
// ── Helpers ─────────────────────────────────────────────────────────────────
function extractError(data, fallback) {
    var _a;
    if (typeof (data === null || data === void 0 ? void 0 : data.error) === 'string')
        return data.error;
    if (typeof ((_a = data === null || data === void 0 ? void 0 : data.error) === null || _a === void 0 ? void 0 : _a.message) === 'string')
        return data.error.message;
    return fallback;
}
function parseBlogIndex(raw) {
    if (!raw)
        return DEFAULT_BLOG;
    try {
        const p = JSON.parse(raw);
        if (p && Array.isArray(p.posts) && p.posts.length > 0)
            return p;
    }
    catch (_a) { }
    return DEFAULT_BLOG;
}
const EMPTY_POST = {
    slug: '',
    cmsUrlKey: '',
    title: '',
    excerpt: '',
    cover: '',
    date: new Date().toISOString().slice(0, 10),
    tags: [],
    featured: false,
    bodyFallback: [],
};
function PostForm({ initial, onSave, onCancel, busy }) {
    const [form, setForm] = useState({ ...initial });
    const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));
    const labelStyle = {
        fontSize: '11px',
        fontWeight: 800,
        color: '#64748b',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        display: 'block',
        marginBottom: '5px',
        fontFamily: 'Sora, sans-serif',
    };
    const inputStyle = {
        width: '100%',
        padding: '9px 12px',
        border: `1px solid ${BORDER}`,
        borderRadius: '8px',
        fontSize: '13px',
        fontFamily: 'Sora, sans-serif',
        color: '#181B1C',
        outline: 'none',
        boxSizing: 'border-box',
        marginBottom: '14px',
        background: '#f8fafc',
    };
    return (React.createElement("div", { style: {
            background: '#fff',
            border: `1px solid ${BORDER}`,
            borderRadius: '16px',
            padding: '1.75rem',
            marginTop: '1rem',
        } },
        React.createElement("h3", { style: {
                fontSize: '1rem',
                fontWeight: 900,
                color: AZUL,
                margin: '0 0 1.25rem',
                fontFamily: 'Sora, sans-serif',
            } }, initial.slug ? `Editando: ${initial.title.slice(0, 60)}…` : 'Nuevo artículo'),
        React.createElement("div", { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1.5rem' } },
            React.createElement("div", { style: { gridColumn: '1 / -1' } },
                React.createElement("label", { style: labelStyle }, "T\u00EDtulo"),
                React.createElement("input", { style: inputStyle, value: form.title, onChange: (e) => set('title', e.target.value), placeholder: "T\u00EDtulo completo del art\u00EDculo" })),
            React.createElement("div", null,
                React.createElement("label", { style: labelStyle }, "Slug (URL)"),
                React.createElement("input", { style: inputStyle, value: form.slug, onChange: (e) => set('slug', e.target.value.toLowerCase().replace(/\s+/g, '-')), placeholder: "ej: incap-en-interzum-2026" })),
            React.createElement("div", null,
                React.createElement("label", { style: labelStyle }, "CMS URL Key"),
                React.createElement("input", { style: inputStyle, value: form.cmsUrlKey, onChange: (e) => set('cmsUrlKey', e.target.value), placeholder: "ej: blog-incap-en-interzum-2026" }),
                React.createElement("p", { style: { fontSize: '11px', color: '#94a3b8', margin: '-10px 0 14px', fontFamily: 'Sora, sans-serif' } }, "URL Key de la CMS Page que contiene el cuerpo.")),
            React.createElement("div", { style: { gridColumn: '1 / -1' } },
                React.createElement("label", { style: labelStyle }, "Excerpt (resumen ~30 palabras)"),
                React.createElement("textarea", { style: { ...inputStyle, minHeight: '80px', resize: 'vertical' }, value: form.excerpt, onChange: (e) => set('excerpt', e.target.value), placeholder: "Resumen que aparece en las cards del listado." })),
            React.createElement("div", null,
                React.createElement("label", { style: labelStyle }, "Fecha (YYYY-MM-DD)"),
                React.createElement("input", { type: "date", style: inputStyle, value: form.date, onChange: (e) => set('date', e.target.value) })),
            React.createElement("div", null,
                React.createElement("label", { style: labelStyle }, "Tags (separados por coma)"),
                React.createElement("input", { style: inputStyle, value: form.tags.join(', '), onChange: (e) => set('tags', e.target.value.split(',').map((t) => t.trim()).filter(Boolean)), placeholder: "ej: Eventos, Marca, Grupo INCAP" })),
            React.createElement("div", { style: { gridColumn: '1 / -1' } },
                React.createElement("label", { style: labelStyle }, "URL de portada"),
                React.createElement("input", { style: inputStyle, value: form.cover, onChange: (e) => set('cover', e.target.value), placeholder: "/images/blog/mi-articulo.webp  \u2014  TODO: subir via media volume" }),
                form.cover && (React.createElement("img", { src: form.cover, alt: "preview", style: { height: '80px', objectFit: 'cover', borderRadius: '8px', marginTop: '-6px', marginBottom: '14px', border: `1px solid ${BORDER}` } }))),
            React.createElement("div", null,
                React.createElement("label", { style: { ...labelStyle, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '14px' } },
                    React.createElement("input", { type: "checkbox", checked: form.featured, onChange: (e) => set('featured', e.target.checked), style: { width: '16px', height: '16px', cursor: 'pointer' } }),
                    "Art\u00EDculo destacado (aparece resaltado en el listado)"))),
        React.createElement("div", { style: { display: 'flex', gap: '12px', marginTop: '0.5rem' } },
            React.createElement("button", { onClick: () => onSave(form), disabled: busy || !form.slug || !form.title, style: {
                    background: busy ? '#94a3b8' : AZUL,
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '10px 22px',
                    fontSize: '12px',
                    fontWeight: 900,
                    cursor: busy ? 'not-allowed' : 'pointer',
                    fontFamily: 'Sora, sans-serif',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                } }, busy ? 'Guardando…' : 'Guardar'),
            React.createElement("button", { onClick: onCancel, disabled: busy, style: {
                    background: '#f1f5f9',
                    color: '#64748b',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '10px 22px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontFamily: 'Sora, sans-serif',
                } }, "Cancelar"))));
}
export default function BlogAdminPage({ setting }) {
    const initial = parseBlogIndex(setting === null || setting === void 0 ? void 0 : setting.blogIndex);
    const [posts, setPosts] = useState(initial.posts);
    const [editIndex, setEditIndex] = useState(null); // null = cerrado, -1 = nuevo
    const [busy, setBusy] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [error, setError] = useState('');
    async function saveToApi(newPosts) {
        setBusy(true);
        setError('');
        setSuccessMsg('');
        try {
            const body = { posts: newPosts, tags: Array.from(new Set(newPosts.flatMap((p) => p.tags))) };
            const res = await fetch('/api/blog-index', {
                method: 'POST',
                credentials: 'same-origin',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok || data.success === false) {
                setError(extractError(data, 'Error al guardar el blog index.'));
            }
            else {
                setPosts(newPosts);
                setEditIndex(null);
                setSuccessMsg('Blog index guardado correctamente.');
                setTimeout(() => setSuccessMsg(''), 4000);
            }
        }
        catch (e) {
            setError((e === null || e === void 0 ? void 0 : e.message) || 'Error de conexión.');
        }
        finally {
            setBusy(false);
        }
    }
    function handleSavePost(post) {
        let newPosts;
        if (editIndex === -1) {
            // Nuevo
            newPosts = [...posts, post];
        }
        else if (editIndex !== null) {
            // Editar existente
            newPosts = posts.map((p, i) => (i === editIndex ? post : p));
        }
        else {
            return;
        }
        saveToApi(newPosts);
    }
    function handleDelete(idx) {
        const p = posts[idx];
        if (!window.confirm(`¿Eliminar "${p.title}"? Esta acción actualizará el setting del blog.`))
            return;
        const newPosts = posts.filter((_, i) => i !== idx);
        saveToApi(newPosts);
    }
    const thStyle = {
        textAlign: 'left',
        fontSize: '10px',
        fontWeight: 800,
        color: '#94a3b8',
        textTransform: 'uppercase',
        letterSpacing: '0.15em',
        padding: '10px 12px',
        borderBottom: `2px solid ${BORDER}`,
        fontFamily: 'Sora, sans-serif',
        whiteSpace: 'nowrap',
    };
    const tdStyle = {
        padding: '12px 12px',
        fontSize: '13px',
        color: '#374151',
        fontFamily: 'Sora, sans-serif',
        borderBottom: `1px solid ${BORDER}`,
        verticalAlign: 'middle',
    };
    const btnStyle = (color) => ({
        background: color,
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        padding: '5px 12px',
        fontSize: '11px',
        fontWeight: 700,
        cursor: 'pointer',
        fontFamily: 'Sora, sans-serif',
        marginRight: '6px',
    });
    return (React.createElement("div", { style: { fontFamily: 'Sora, sans-serif', padding: '2rem', maxWidth: '1100px' } },
        React.createElement("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' } },
            React.createElement("div", null,
                React.createElement("h1", { style: { fontSize: '1.5rem', fontWeight: 900, color: AZUL, margin: '0 0 4px', fontFamily: 'Sora, sans-serif' } }, "Gesti\u00F3n del Blog"),
                React.createElement("p", { style: { fontSize: '13px', color: '#64748b', margin: 0, fontFamily: 'Sora, sans-serif' } },
                    "Edita los metadatos de cada art\u00EDculo. El cuerpo se redacta en",
                    ' ',
                    React.createElement("a", { href: "/admin/cms/pages", style: { color: AZUL, fontWeight: 700 } }, "Admin \u2192 CMS \u2192 Pages"),
                    ' ',
                    "usando el url_key ",
                    React.createElement("code", { style: { background: '#f1f5f9', padding: '1px 5px', borderRadius: '4px', fontSize: '11px' } },
                        "blog-",
                        '<slug>'),
                    ".")),
            React.createElement("button", { onClick: () => setEditIndex(-1), disabled: busy || editIndex !== null, style: {
                    background: VERDE,
                    color: '#181B1C',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '10px 20px',
                    fontSize: '12px',
                    fontWeight: 900,
                    cursor: 'pointer',
                    fontFamily: 'Sora, sans-serif',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                } }, "+ Nuevo art\u00EDculo")),
        error && (React.createElement("div", { style: { background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '8px', padding: '10px 16px', marginBottom: '1rem', color: '#dc2626', fontSize: '13px', fontFamily: 'Sora, sans-serif' } }, error)),
        successMsg && (React.createElement("div", { style: { background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '8px', padding: '10px 16px', marginBottom: '1rem', color: '#16a34a', fontSize: '13px', fontFamily: 'Sora, sans-serif' } }, successMsg)),
        editIndex === -1 && (React.createElement(PostForm, { initial: EMPTY_POST, onSave: handleSavePost, onCancel: () => setEditIndex(null), busy: busy })),
        React.createElement("div", { style: { background: '#fff', border: `1px solid ${BORDER}`, borderRadius: '16px', overflow: 'auto', marginTop: editIndex === -1 ? '1.5rem' : 0 } },
            React.createElement("table", { style: { width: '100%', borderCollapse: 'collapse', minWidth: '600px' } },
                React.createElement("thead", null,
                    React.createElement("tr", null,
                        React.createElement("th", { style: thStyle }, "Portada"),
                        React.createElement("th", { style: thStyle }, "T\u00EDtulo / Slug"),
                        React.createElement("th", { style: thStyle }, "Fecha"),
                        React.createElement("th", { style: thStyle }, "Tags"),
                        React.createElement("th", { style: { ...thStyle, textAlign: 'center' } }, "Dest."),
                        React.createElement("th", { style: thStyle }, "Acciones"))),
                React.createElement("tbody", null,
                    posts.length === 0 && (React.createElement("tr", null,
                        React.createElement("td", { colSpan: 6, style: { ...tdStyle, textAlign: 'center', color: '#94a3b8', padding: '2.5rem' } }, "No hay art\u00EDculos. Haz clic en \"Nuevo art\u00EDculo\" para agregar el primero."))),
                    posts.map((post, idx) => (React.createElement(React.Fragment, { key: post.slug },
                        React.createElement("tr", { style: { background: editIndex === idx ? '#eff6ff' : 'transparent' } },
                            React.createElement("td", { style: tdStyle }, post.cover && (React.createElement("img", { src: post.cover, alt: "", style: { width: '60px', height: '44px', objectFit: 'cover', borderRadius: '6px', display: 'block' } }))),
                            React.createElement("td", { style: tdStyle },
                                React.createElement("div", { style: { fontWeight: 900, color: '#181B1C', marginBottom: '3px' } }, post.title.length > 70 ? post.title.slice(0, 70) + '…' : post.title),
                                React.createElement("code", { style: { fontSize: '10px', color: '#94a3b8', background: '#f8fafc', padding: '1px 6px', borderRadius: '4px' } },
                                    "/blog/",
                                    post.slug)),
                            React.createElement("td", { style: { ...tdStyle, whiteSpace: 'nowrap' } }, post.date),
                            React.createElement("td", { style: tdStyle }, post.tags.join(', ')),
                            React.createElement("td", { style: { ...tdStyle, textAlign: 'center' } }, post.featured ? (React.createElement("span", { style: { fontSize: '16px' } }, "\u2605")) : (React.createElement("span", { style: { color: '#cbd5e1', fontSize: '16px' } }, "\u2606"))),
                            React.createElement("td", { style: tdStyle },
                                React.createElement("button", { onClick: () => setEditIndex(idx === editIndex ? null : idx), disabled: busy, style: btnStyle(AZUL) }, editIndex === idx ? 'Cerrar' : 'Editar'),
                                React.createElement("button", { onClick: () => handleDelete(idx), disabled: busy, style: { ...btnStyle('#dc2626') } }, "Borrar"),
                                React.createElement("a", { href: `/blog/${post.slug}`, target: "_blank", rel: "noopener noreferrer", style: { fontSize: '11px', color: AZUL, fontWeight: 700, textDecoration: 'none' } }, "Ver \u2192"))),
                        editIndex === idx && (React.createElement("tr", null,
                            React.createElement("td", { colSpan: 6, style: { padding: '0 12px 12px' } },
                                React.createElement(PostForm, { initial: post, onSave: handleSavePost, onCancel: () => setEditIndex(null), busy: busy })))))))))),
        React.createElement("p", { style: { fontSize: '11px', color: '#94a3b8', marginTop: '1rem', fontFamily: 'Sora, sans-serif', lineHeight: 1.6 } },
            "Los cambios se guardan en el setting ",
            React.createElement("code", { style: { background: '#f1f5f9', padding: '1px 5px', borderRadius: '4px' } }, "blog_index"),
            " de la base de datos. La portada es una URL de imagen; para subir im\u00E1genes reales, use el directorio del volumen Railway en ",
            React.createElement("code", { style: { background: '#f1f5f9', padding: '1px 5px', borderRadius: '4px' } }, "/app/media/"),
            " y referencia la URL relativa.")));
}
export const layout = {
    areaId: 'content',
    sortOrder: 10,
};
export const query = `
  query BlogAdminQuery {
    setting {
      blogIndex
    }
  }
`;
//# sourceMappingURL=BlogAdminPage.js.map