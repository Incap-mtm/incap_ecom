/**
 * Página admin /blog-admin — editor completo del blog INCAP.
 *
 * Todo el blog (título, slug, excerpt, fecha, tags, destacado, portada, cuerpo)
 * se gestiona desde aquí. El cuerpo es Markdown almacenado en el setting
 * `blog_index` — sin dependencia de CMS Pages.
 */
import React, { useState, useRef } from 'react';
import { DEFAULT_BLOG, renderMarkdown, } from '../../../components/blogData.js';
const AZUL = '#2A4899';
const VERDE = '#85C639';
const BORDER = '#e2e8f0';
// ── Helpers ──────────────────────────────────────────────────────────────────
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
/** Convierte un título en un slug kebab-case sin tildes. */
function toSlug(s) {
    return s
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_]+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
}
const EMPTY_POST = {
    slug: '',
    title: '',
    excerpt: '',
    cover: '',
    date: new Date().toISOString().slice(0, 10),
    tags: [],
    featured: false,
    body: '',
};
function PostForm({ initial, onSave, onCancel, busy }) {
    var _a;
    const [form, setForm] = useState({ ...initial, body: (_a = initial.body) !== null && _a !== void 0 ? _a : '' });
    const [slugLocked, setSlugLocked] = useState(!!initial.slug);
    const [showPreview, setShowPreview] = useState(false);
    const [uploadingCover, setUploadingCover] = useState(false);
    const [coverError, setCoverError] = useState('');
    const [uploadingBodyImg, setUploadingBodyImg] = useState(false);
    const [bodyImgError, setBodyImgError] = useState('');
    const bodyRef = useRef(null);
    const fileInputRef = useRef(null);
    const bodyImgInputRef = useRef(null);
    const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));
    function handleTitleChange(title) {
        setForm((f) => ({
            ...f,
            title,
            slug: slugLocked ? f.slug : toSlug(title),
        }));
    }
    function handleSlugChange(raw) {
        setSlugLocked(true);
        setForm((f) => ({
            ...f,
            slug: raw
                .toLowerCase()
                .replace(/[^\w-]/g, '-')
                .replace(/-+/g, '-')
                .replace(/^-|-$/g, ''),
        }));
    }
    // ── Subida de imágenes (portada y cuerpo comparten endpoint) ────────────────
    /**
     * Sube una imagen a /api/blog-cover (convierte a WebP y devuelve la URL
     * /assets/blog/...). Reutilizado por la portada y por las imágenes del cuerpo.
     */
    async function uploadImage(file) {
        const formData = new FormData();
        formData.append('cover', file);
        const res = await fetch('/api/blog-cover', {
            method: 'POST',
            credentials: 'same-origin',
            body: formData,
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok || !data.success || !data.url) {
            throw new Error(extractError(data, 'Error al subir la imagen.'));
        }
        return data.url;
    }
    async function handleCoverFile(file) {
        setUploadingCover(true);
        setCoverError('');
        try {
            const url = await uploadImage(file);
            set('cover', url);
        }
        catch (e) {
            setCoverError((e === null || e === void 0 ? void 0 : e.message) || 'Error de conexión al subir imagen.');
        }
        finally {
            setUploadingCover(false);
        }
    }
    /** Sube una imagen y la inserta en el cuerpo Markdown como ![](url). */
    async function handleBodyImageFile(file) {
        setUploadingBodyImg(true);
        setBodyImgError('');
        try {
            const url = await uploadImage(file);
            // Insertar en el cursor (o al final) como bloque de imagen con caption editable.
            const ta = bodyRef.current;
            const snippet = `\n\n![Descripción de la imagen](${url})\n\n`;
            setForm((f) => {
                var _a, _b;
                const start = (_a = ta === null || ta === void 0 ? void 0 : ta.selectionStart) !== null && _a !== void 0 ? _a : f.body.length;
                const end = (_b = ta === null || ta === void 0 ? void 0 : ta.selectionEnd) !== null && _b !== void 0 ? _b : f.body.length;
                const newBody = f.body.substring(0, start) + snippet + f.body.substring(end);
                const caret = start + snippet.length;
                setTimeout(() => {
                    if (bodyRef.current) {
                        bodyRef.current.focus();
                        bodyRef.current.setSelectionRange(caret, caret);
                    }
                }, 16);
                return { ...f, body: newBody };
            });
        }
        catch (e) {
            setBodyImgError((e === null || e === void 0 ? void 0 : e.message) || 'Error de conexión al subir imagen.');
        }
        finally {
            setUploadingBodyImg(false);
        }
    }
    // ── Mini-toolbar Markdown ──────────────────────────────────────────────────
    function insertMd(prefix, suffix = '', placeholder = 'texto') {
        var _a, _b;
        const ta = bodyRef.current;
        if (!ta)
            return;
        const start = (_a = ta.selectionStart) !== null && _a !== void 0 ? _a : 0;
        const end = (_b = ta.selectionEnd) !== null && _b !== void 0 ? _b : 0;
        const current = form.body;
        const selected = current.substring(start, end);
        const insert = prefix + (selected || placeholder) + suffix;
        const newBody = current.substring(0, start) + insert + current.substring(end);
        setForm((f) => ({ ...f, body: newBody }));
        const newCursor = start + prefix.length + (selected || placeholder).length;
        setTimeout(() => {
            if (bodyRef.current) {
                bodyRef.current.focus();
                bodyRef.current.setSelectionRange(newCursor, newCursor);
            }
        }, 16);
    }
    // ── Estilos comunes ────────────────────────────────────────────────────────
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
    const toolbarBtnStyle = {
        background: '#f1f5f9',
        border: `1px solid ${BORDER}`,
        borderRadius: '5px',
        padding: '4px 10px',
        fontSize: '12px',
        fontWeight: 700,
        cursor: 'pointer',
        fontFamily: 'monospace',
        color: '#374151',
        lineHeight: 1.4,
    };
    const bodyHtml = showPreview ? renderMarkdown(form.body) : '';
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
                margin: '0 0 1.5rem',
                fontFamily: 'Sora, sans-serif',
            } }, initial.slug ? `Editando: ${initial.title.slice(0, 55)}…` : 'Nuevo artículo'),
        React.createElement("div", { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1.5rem' } },
            React.createElement("div", { style: { gridColumn: '1 / -1' } },
                React.createElement("label", { style: labelStyle }, "T\u00EDtulo"),
                React.createElement("input", { style: inputStyle, value: form.title, onChange: (e) => handleTitleChange(e.target.value), placeholder: "T\u00EDtulo completo del art\u00EDculo" })),
            React.createElement("div", null,
                React.createElement("label", { style: labelStyle }, "Slug (URL del art\u00EDculo)"),
                React.createElement("div", { style: { position: 'relative' } },
                    React.createElement("span", { style: {
                            position: 'absolute',
                            left: '12px',
                            top: '50%',
                            transform: 'translateY(-80%)',
                            fontSize: '12px',
                            color: '#94a3b8',
                            fontFamily: 'Sora, sans-serif',
                            pointerEvents: 'none',
                        } }, "/blog/"),
                    React.createElement("input", { style: { ...inputStyle, paddingLeft: '52px' }, value: form.slug, onChange: (e) => handleSlugChange(e.target.value), placeholder: "mi-articulo" })),
                !slugLocked && form.title && (React.createElement("p", { style: {
                        fontSize: '10px',
                        color: VERDE,
                        margin: '-10px 0 14px',
                        fontFamily: 'Sora, sans-serif',
                    } }, "Auto-derivado del t\u00EDtulo. Pod\u00E9s editarlo arriba para fijarlo."))),
            React.createElement("div", null,
                React.createElement("label", { style: labelStyle }, "Fecha de publicaci\u00F3n"),
                React.createElement("input", { type: "date", style: inputStyle, value: form.date, onChange: (e) => set('date', e.target.value) })),
            React.createElement("div", { style: { gridColumn: '1 / -1' } },
                React.createElement("label", { style: labelStyle }, "Excerpt (resumen ~30 palabras)"),
                React.createElement("textarea", { style: { ...inputStyle, minHeight: '80px', resize: 'vertical' }, value: form.excerpt, onChange: (e) => set('excerpt', e.target.value), placeholder: "Resumen breve que aparece en las cards del listado y en meta description." })),
            React.createElement("div", null,
                React.createElement("label", { style: labelStyle }, "Tags (separados por coma)"),
                React.createElement("input", { style: inputStyle, value: form.tags.join(', '), onChange: (e) => set('tags', e.target.value
                        .split(',')
                        .map((t) => t.trim())
                        .filter(Boolean)), placeholder: "ej: Eventos, Marca, Grupo INCAP" })),
            React.createElement("div", { style: { display: 'flex', alignItems: 'center' } },
                React.createElement("label", { style: {
                        ...labelStyle,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                        marginBottom: 0,
                        textTransform: 'none',
                        fontSize: '13px',
                        color: '#374151',
                    } },
                    React.createElement("input", { type: "checkbox", checked: form.featured, onChange: (e) => set('featured', e.target.checked), style: { width: '16px', height: '16px', cursor: 'pointer', accentColor: AZUL } }),
                    "Art\u00EDculo destacado (resaltado en el listado)")),
            React.createElement("div", { style: { gridColumn: '1 / -1', marginBottom: '4px' } },
                React.createElement("label", { style: labelStyle }, "Portada"),
                React.createElement("div", { style: { display: 'flex', gap: '12px', alignItems: 'flex-start', flexWrap: 'wrap' } },
                    form.cover && (React.createElement("img", { src: form.cover, alt: "preview portada", style: {
                            height: '90px',
                            width: '140px',
                            objectFit: 'cover',
                            borderRadius: '8px',
                            border: `1px solid ${BORDER}`,
                            flexShrink: 0,
                        } })),
                    React.createElement("div", { style: { flex: 1, minWidth: '200px' } },
                        React.createElement("input", { style: { ...inputStyle, marginBottom: '8px' }, value: form.cover, onChange: (e) => set('cover', e.target.value), placeholder: "/assets/blog/mi-portada.webp" }),
                        React.createElement("input", { ref: fileInputRef, type: "file", accept: "image/jpeg,image/png,image/webp,image/gif", style: { display: 'none' }, onChange: (e) => {
                                var _a;
                                const file = (_a = e.target.files) === null || _a === void 0 ? void 0 : _a[0];
                                if (file)
                                    handleCoverFile(file);
                                e.target.value = '';
                            } }),
                        React.createElement("button", { type: "button", onClick: () => { var _a; return (_a = fileInputRef.current) === null || _a === void 0 ? void 0 : _a.click(); }, disabled: uploadingCover, style: {
                                background: uploadingCover ? '#94a3b8' : AZUL,
                                color: '#fff',
                                border: 'none',
                                borderRadius: '7px',
                                padding: '7px 16px',
                                fontSize: '11px',
                                fontWeight: 700,
                                cursor: uploadingCover ? 'not-allowed' : 'pointer',
                                fontFamily: 'Sora, sans-serif',
                            } }, uploadingCover ? 'Subiendo…' : 'Subir imagen'),
                        React.createElement("p", { style: {
                                fontSize: '10px',
                                color: '#94a3b8',
                                margin: '6px 0 0',
                                fontFamily: 'Sora, sans-serif',
                                lineHeight: 1.5,
                            } }, "La imagen se convierte a WebP (max 1200px, calidad 75). URL resultante: /assets/blog/..."),
                        coverError && (React.createElement("p", { style: {
                                fontSize: '11px',
                                color: '#dc2626',
                                margin: '6px 0 0',
                                fontFamily: 'Sora, sans-serif',
                            } }, coverError))))),
            React.createElement("div", { style: { gridColumn: '1 / -1', marginTop: '8px' } },
                React.createElement("div", { style: {
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '8px',
                    } },
                    React.createElement("label", { style: { ...labelStyle, marginBottom: 0 } }, "Cuerpo del art\u00EDculo (Markdown)"),
                    React.createElement("button", { type: "button", onClick: () => setShowPreview((v) => !v), style: {
                            background: showPreview ? AZUL : '#f1f5f9',
                            color: showPreview ? '#fff' : '#374151',
                            border: `1px solid ${showPreview ? AZUL : BORDER}`,
                            borderRadius: '6px',
                            padding: '4px 12px',
                            fontSize: '11px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            fontFamily: 'Sora, sans-serif',
                        } }, showPreview ? 'Ocultar preview' : 'Mostrar preview')),
                React.createElement("div", { style: {
                        display: 'flex',
                        gap: '6px',
                        flexWrap: 'wrap',
                        marginBottom: '8px',
                    } },
                    React.createElement("button", { type: "button", style: toolbarBtnStyle, onClick: () => insertMd('\n## ', '', 'Subtítulo') }, "H2"),
                    React.createElement("button", { type: "button", style: toolbarBtnStyle, onClick: () => insertMd('\n### ', '', 'Subtítulo menor') }, "H3"),
                    React.createElement("button", { type: "button", style: { ...toolbarBtnStyle, fontWeight: 900 }, onClick: () => insertMd('**', '**', 'texto en negrita') }, "B"),
                    React.createElement("button", { type: "button", style: { ...toolbarBtnStyle, fontStyle: 'italic' }, onClick: () => insertMd('*', '*', 'texto en itálica') }, "I"),
                    React.createElement("button", { type: "button", style: toolbarBtnStyle, onClick: () => insertMd('\n- ', '', 'ítem de lista') }, "- Lista"),
                    React.createElement("button", { type: "button", style: toolbarBtnStyle, onClick: () => insertMd('\n> ', '', 'cita destacada') }, "> Cita"),
                    React.createElement("button", { type: "button", style: toolbarBtnStyle, onClick: () => insertMd('[', '](https://)', 'texto del enlace') }, "Link"),
                    React.createElement("input", { ref: bodyImgInputRef, type: "file", accept: "image/jpeg,image/png,image/webp,image/gif", style: { display: 'none' }, onChange: (e) => {
                            var _a;
                            const file = (_a = e.target.files) === null || _a === void 0 ? void 0 : _a[0];
                            if (file)
                                handleBodyImageFile(file);
                            e.target.value = '';
                        } }),
                    React.createElement("button", { type: "button", style: { ...toolbarBtnStyle, background: uploadingBodyImg ? '#e2e8f0' : '#e0e7ff', color: AZUL }, disabled: uploadingBodyImg, onClick: () => { var _a; return (_a = bodyImgInputRef.current) === null || _a === void 0 ? void 0 : _a.click(); } }, uploadingBodyImg ? 'Subiendo…' : '+ Imagen')),
                bodyImgError && (React.createElement("p", { style: {
                        fontSize: '11px',
                        color: '#dc2626',
                        margin: '0 0 8px',
                        fontFamily: 'Sora, sans-serif',
                    } }, bodyImgError)),
                React.createElement("div", { style: {
                        display: 'grid',
                        gridTemplateColumns: showPreview ? '1fr 1fr' : '1fr',
                        gap: '12px',
                        alignItems: 'flex-start',
                    } },
                    React.createElement("textarea", { ref: bodyRef, style: {
                            width: '100%',
                            minHeight: '340px',
                            padding: '12px',
                            border: `1px solid ${BORDER}`,
                            borderRadius: '8px',
                            fontSize: '13px',
                            fontFamily: 'monospace',
                            color: '#181B1C',
                            outline: 'none',
                            boxSizing: 'border-box',
                            resize: 'vertical',
                            background: '#f8fafc',
                            lineHeight: 1.65,
                        }, value: form.body, onChange: (e) => set('body', e.target.value), placeholder: `## Subtítulo del primer bloque\n\nEscribí el cuerpo del artículo aquí...\n\n> Una cita destacada — Autor\n\n- Ítem 1 de lista\n- Ítem 2` }),
                    showPreview && (React.createElement("div", { style: {
                            minHeight: '340px',
                            padding: '16px',
                            border: `1px solid ${BORDER}`,
                            borderRadius: '8px',
                            background: '#fff',
                            overflowY: 'auto',
                            fontSize: '14px',
                            fontFamily: 'Sora, sans-serif',
                            color: '#374151',
                            lineHeight: 1.75,
                        } },
                        React.createElement("style", null, `
                  .blog-md-preview h1,.blog-md-preview h2,.blog-md-preview h3{font-family:Sora,sans-serif;font-weight:900;color:#181B1C;margin:1.5rem 0 0.75rem;line-height:1.25}
                  .blog-md-preview h2{font-size:1.2rem}
                  .blog-md-preview h3{font-size:1rem}
                  .blog-md-preview p{margin:0 0 1rem;font-size:13px;line-height:1.75}
                  .blog-md-preview ul,.blog-md-preview ol{padding-left:1.5rem;margin:0 0 1rem}
                  .blog-md-preview li{font-size:13px;margin:0 0 0.3rem}
                  .blog-md-preview blockquote{border-left:3px solid #2A4899;padding-left:1rem;margin:1rem 0;font-style:italic}
                  .blog-md-preview blockquote p{color:#2A4899;margin:0}
                  .blog-md-preview a{color:#2A4899;text-decoration:underline}
                  .blog-md-preview code{background:#f1f5f9;padding:1px 5px;border-radius:3px;font-size:12px;font-family:monospace}
                  .blog-md-preview figure.blog-fig{margin:1rem 0}
                  .blog-md-preview figure.blog-fig img{display:block;width:100%;height:auto;border-radius:8px}
                  .blog-md-preview figure.blog-fig figcaption{margin-top:.4rem;font-size:11px;color:#64748b;text-align:center;font-style:italic}
                  .blog-md-preview p img{max-width:100%;height:auto;border-radius:6px}
                `),
                        form.body ? (React.createElement("div", { className: "blog-md-preview", dangerouslySetInnerHTML: { __html: bodyHtml } })) : (React.createElement("p", { style: { color: '#94a3b8', fontStyle: 'italic', fontSize: '13px' } }, "El preview aparece aqu\u00ED mientras escrib\u00EDs."))))),
                React.createElement("p", { style: {
                        fontSize: '10px',
                        color: '#94a3b8',
                        margin: '6px 0 0',
                        fontFamily: 'Sora, sans-serif',
                    } }, "Gu\u00EDa r\u00E1pida: ## Subt\u00EDtulo | **negrita** | *it\u00E1lica* | - lista | > cita | [texto](url) | + Imagen (sube e inserta en el cuerpo)"))),
        React.createElement("div", { style: { display: 'flex', gap: '12px', marginTop: '1.5rem' } },
            React.createElement("button", { type: "button", onClick: () => onSave(form), disabled: busy || !form.slug || !form.title, style: {
                    background: busy ? '#94a3b8' : AZUL,
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '10px 24px',
                    fontSize: '12px',
                    fontWeight: 900,
                    cursor: busy ? 'not-allowed' : 'pointer',
                    fontFamily: 'Sora, sans-serif',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                } }, busy ? 'Guardando…' : 'Guardar artículo'),
            React.createElement("button", { type: "button", onClick: onCancel, disabled: busy, style: {
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
    const [editIndex, setEditIndex] = useState(null);
    const [busy, setBusy] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [error, setError] = useState('');
    async function saveToApi(newPosts) {
        setBusy(true);
        setError('');
        setSuccessMsg('');
        try {
            const body = {
                posts: newPosts,
                tags: Array.from(new Set(newPosts.flatMap((p) => p.tags))),
            };
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
                setSuccessMsg('Blog guardado correctamente.');
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
            newPosts = [...posts, post];
        }
        else if (editIndex !== null && editIndex >= 0) {
            newPosts = posts.map((p, i) => (i === editIndex ? post : p));
        }
        else {
            return;
        }
        saveToApi(newPosts);
    }
    function handleDelete(idx) {
        const p = posts[idx];
        if (!window.confirm(`¿Eliminar "${p.title}"?`))
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
        padding: '12px',
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
    return (React.createElement("div", { style: { fontFamily: 'Sora, sans-serif', padding: '2rem', maxWidth: '1150px' } },
        React.createElement("details", { style: {
                marginBottom: '1.5rem',
                border: `1px solid #bfdbfe`,
                borderRadius: '12px',
                background: '#eff6ff',
                overflow: 'hidden',
            } },
            React.createElement("summary", { style: {
                    padding: '12px 18px',
                    cursor: 'pointer',
                    fontWeight: 700,
                    fontSize: '13px',
                    color: AZUL,
                    fontFamily: 'Sora, sans-serif',
                    userSelect: 'none',
                } }, "C\u00F3mo cargar un art\u00EDculo \u2014 gu\u00EDa r\u00E1pida"),
            React.createElement("div", { style: { padding: '0 18px 16px', fontSize: '13px', color: '#374151', lineHeight: 1.75 } },
                React.createElement("ol", { style: { margin: '8px 0 0', paddingLeft: '1.4rem' } },
                    React.createElement("li", null,
                        React.createElement("strong", null, "T\u00EDtulo:"),
                        " el slug (URL del art\u00EDculo) se genera autom\u00E1ticamente. Pod\u00E9s editarlo si quer\u00E9s acortarlo o personalizarlo."),
                    React.createElement("li", null,
                        React.createElement("strong", null, "Portada:"),
                        " hac\u00E9 clic en \"Subir imagen\" (recomendado: WebP, aprox. 1200px de ancho). La imagen se convierte a WebP autom\u00E1ticamente y queda en ",
                        '/assets/blog/',
                        ". Tambi\u00E9n pod\u00E9s pegar una URL directamente."),
                    React.createElement("li", null,
                        React.createElement("strong", null, "Cuerpo en Markdown:"),
                        " us\u00E1 los botones de la mini-barra para insertar sintaxis.",
                        React.createElement("br", null),
                        React.createElement("code", { style: { background: '#dbeafe', padding: '1px 5px', borderRadius: '3px', fontSize: '12px' } }, "## Subt\u00EDtulo"),
                        ' ',
                        React.createElement("code", { style: { background: '#dbeafe', padding: '1px 5px', borderRadius: '3px', fontSize: '12px' } }, "**negrita**"),
                        ' ',
                        React.createElement("code", { style: { background: '#dbeafe', padding: '1px 5px', borderRadius: '3px', fontSize: '12px' } }, "- lista"),
                        ' ',
                        React.createElement("code", { style: { background: '#dbeafe', padding: '1px 5px', borderRadius: '3px', fontSize: '12px' } },
                            '>',
                            " cita"),
                        ' ',
                        React.createElement("code", { style: { background: '#dbeafe', padding: '1px 5px', borderRadius: '3px', fontSize: '12px' } }, "[texto](url)")),
                    React.createElement("li", null,
                        React.createElement("strong", null, "Im\u00E1genes en el cuerpo:"),
                        " ubic\u00E1 el cursor donde quer\u00E9s la foto y hac\u00E9 clic en",
                        ' ',
                        React.createElement("strong", null, "+ Imagen"),
                        ". Se sube, se convierte a WebP y se inserta como bloque",
                        ' ',
                        React.createElement("code", { style: { background: '#dbeafe', padding: '1px 5px', borderRadius: '3px', fontSize: '12px' } }, "![Descripci\u00F3n](url)"),
                        ". Edit\u00E1 el texto entre corchetes: es el pie de foto (y el alt para SEO)."),
                    React.createElement("li", null,
                        "Activ\u00E1 ",
                        React.createElement("strong", null, "Mostrar preview"),
                        " para ver el resultado en tiempo real al costado."),
                    React.createElement("li", null,
                        "Complet\u00E1 ",
                        React.createElement("strong", null, "Tags"),
                        " (separados por coma) y ",
                        React.createElement("strong", null, "Fecha"),
                        ", marc\u00E1 si es ",
                        React.createElement("strong", null, "Destacado"),
                        " (aparece resaltado arriba del listado)."),
                    React.createElement("li", null,
                        "Hac\u00E9 clic en ",
                        React.createElement("strong", null, "Guardar art\u00EDculo"),
                        ". El cambio se aplica de inmediato.")))),
        React.createElement("div", { style: {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '1.25rem',
                flexWrap: 'wrap',
                gap: '1rem',
            } },
            React.createElement("div", null,
                React.createElement("h1", { style: {
                        fontSize: '1.5rem',
                        fontWeight: 900,
                        color: AZUL,
                        margin: '0 0 4px',
                        fontFamily: 'Sora, sans-serif',
                    } }, "Gesti\u00F3n del Blog"),
                React.createElement("p", { style: { fontSize: '13px', color: '#64748b', margin: 0, fontFamily: 'Sora, sans-serif' } }, "T\u00EDtulo, portada, cuerpo (Markdown) y metadatos de cada art\u00EDculo \u2014 todo desde aqu\u00ED.")),
            React.createElement("button", { type: "button", onClick: () => setEditIndex(-1), disabled: busy || editIndex !== null, style: {
                    background: VERDE,
                    color: '#181B1C',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '10px 20px',
                    fontSize: '12px',
                    fontWeight: 900,
                    cursor: busy || editIndex !== null ? 'not-allowed' : 'pointer',
                    fontFamily: 'Sora, sans-serif',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    opacity: editIndex !== null ? 0.5 : 1,
                } }, "+ Nuevo art\u00EDculo")),
        error && (React.createElement("div", { style: {
                background: '#fef2f2',
                border: '1px solid #fca5a5',
                borderRadius: '8px',
                padding: '10px 16px',
                marginBottom: '1rem',
                color: '#dc2626',
                fontSize: '13px',
                fontFamily: 'Sora, sans-serif',
            } }, error)),
        successMsg && (React.createElement("div", { style: {
                background: '#f0fdf4',
                border: '1px solid #86efac',
                borderRadius: '8px',
                padding: '10px 16px',
                marginBottom: '1rem',
                color: '#16a34a',
                fontSize: '13px',
                fontFamily: 'Sora, sans-serif',
            } }, successMsg)),
        editIndex === -1 && (React.createElement(PostForm, { initial: EMPTY_POST, onSave: handleSavePost, onCancel: () => setEditIndex(null), busy: busy })),
        React.createElement("div", { style: {
                background: '#fff',
                border: `1px solid ${BORDER}`,
                borderRadius: '16px',
                overflow: 'auto',
                marginTop: '1.25rem',
            } },
            React.createElement("table", { style: { width: '100%', borderCollapse: 'collapse', minWidth: '600px' } },
                React.createElement("thead", null,
                    React.createElement("tr", null,
                        React.createElement("th", { style: thStyle }, "Portada"),
                        React.createElement("th", { style: thStyle }, "T\u00EDtulo / URL"),
                        React.createElement("th", { style: thStyle }, "Fecha"),
                        React.createElement("th", { style: thStyle }, "Tags"),
                        React.createElement("th", { style: { ...thStyle, textAlign: 'center' } }, "Dest."),
                        React.createElement("th", { style: thStyle }, "Acciones"))),
                React.createElement("tbody", null,
                    posts.length === 0 && (React.createElement("tr", null,
                        React.createElement("td", { colSpan: 6, style: {
                                ...tdStyle,
                                textAlign: 'center',
                                color: '#94a3b8',
                                padding: '2.5rem',
                            } }, "No hay art\u00EDculos. Haz clic en \"Nuevo art\u00EDculo\" para agregar el primero."))),
                    posts.map((post, idx) => (React.createElement(React.Fragment, { key: post.slug },
                        React.createElement("tr", { style: { background: editIndex === idx ? '#eff6ff' : 'transparent' } },
                            React.createElement("td", { style: tdStyle }, post.cover && (React.createElement("img", { src: post.cover, alt: "", style: {
                                    width: '60px',
                                    height: '44px',
                                    objectFit: 'cover',
                                    borderRadius: '6px',
                                    display: 'block',
                                } }))),
                            React.createElement("td", { style: tdStyle },
                                React.createElement("div", { style: { fontWeight: 900, color: '#181B1C', marginBottom: '3px', fontSize: '13px' } }, post.title.length > 65 ? post.title.slice(0, 65) + '…' : post.title),
                                React.createElement("code", { style: {
                                        fontSize: '10px',
                                        color: '#94a3b8',
                                        background: '#f8fafc',
                                        padding: '1px 6px',
                                        borderRadius: '4px',
                                    } },
                                    "/blog/",
                                    post.slug)),
                            React.createElement("td", { style: { ...tdStyle, whiteSpace: 'nowrap' } }, post.date),
                            React.createElement("td", { style: tdStyle }, post.tags.join(', ')),
                            React.createElement("td", { style: { ...tdStyle, textAlign: 'center' } }, post.featured ? (React.createElement("span", { style: { fontSize: '16px' } }, "\u2605")) : (React.createElement("span", { style: { color: '#cbd5e1', fontSize: '16px' } }, "\u2606"))),
                            React.createElement("td", { style: tdStyle },
                                React.createElement("button", { type: "button", onClick: () => setEditIndex(idx === editIndex ? null : idx), disabled: busy, style: btnStyle(AZUL) }, editIndex === idx ? 'Cerrar' : 'Editar'),
                                React.createElement("button", { type: "button", onClick: () => handleDelete(idx), disabled: busy, style: btnStyle('#dc2626') }, "Borrar"),
                                React.createElement("a", { href: `/blog/${post.slug}`, target: "_blank", rel: "noopener noreferrer", style: {
                                        fontSize: '11px',
                                        color: AZUL,
                                        fontWeight: 700,
                                        textDecoration: 'none',
                                    } }, "Ver \u2192"))),
                        editIndex === idx && (React.createElement("tr", null,
                            React.createElement("td", { colSpan: 6, style: { padding: '0 12px 16px' } },
                                React.createElement(PostForm, { initial: post, onSave: handleSavePost, onCancel: () => setEditIndex(null), busy: busy })))))))))),
        React.createElement("p", { style: {
                fontSize: '11px',
                color: '#94a3b8',
                marginTop: '1rem',
                fontFamily: 'Sora, sans-serif',
                lineHeight: 1.6,
            } },
            "Los cambios se guardan en el setting",
            ' ',
            React.createElement("code", { style: { background: '#f1f5f9', padding: '1px 5px', borderRadius: '4px' } }, "blog_index"),
            ' ',
            "de la base de datos. Las portadas subidas quedan en el volumen Railway en",
            ' ',
            React.createElement("code", { style: { background: '#f1f5f9', padding: '1px 5px', borderRadius: '4px' } }, "/app/media/blog/"),
            ' ',
            "y se sirven en",
            ' ',
            React.createElement("code", { style: { background: '#f1f5f9', padding: '1px 5px', borderRadius: '4px' } }, "/assets/blog/<archivo>.webp"),
            ".")));
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