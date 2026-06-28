/**
 * Página admin /blog-admin — editor completo del blog INCAP.
 *
 * Todo el blog (título, slug, excerpt, fecha, tags, destacado, portada, cuerpo)
 * se gestiona desde aquí. El cuerpo es Markdown almacenado en el setting
 * `blog_index` — sin dependencia de CMS Pages.
 */
import React, { useState, useRef } from 'react';
import {
  DEFAULT_BLOG,
  renderMarkdown,
  type BlogPost,
  type BlogData,
} from '../../../components/blogData.js';

const AZUL = '#2A4899';
const VERDE = '#85C639';
const BORDER = '#e2e8f0';

// ── Helpers ──────────────────────────────────────────────────────────────────

function extractError(data: any, fallback: string): string {
  if (typeof data?.error === 'string') return data.error;
  if (typeof data?.error?.message === 'string') return data.error.message;
  return fallback;
}

function parseBlogIndex(raw: string | null | undefined): BlogData {
  if (!raw) return DEFAULT_BLOG;
  try {
    const p = JSON.parse(raw);
    if (p && Array.isArray(p.posts) && p.posts.length > 0) return p as BlogData;
  } catch {}
  return DEFAULT_BLOG;
}

/** Convierte un título en un slug kebab-case sin tildes. */
function toSlug(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

const EMPTY_POST: BlogPost = {
  slug: '',
  title: '',
  excerpt: '',
  cover: '',
  date: new Date().toISOString().slice(0, 10),
  tags: [],
  featured: false,
  body: '',
};

// ── Sub-componente: PostForm ─────────────────────────────────────────────────

interface FormProps {
  initial: BlogPost;
  onSave: (post: BlogPost) => void;
  onCancel: () => void;
  busy: boolean;
}

function PostForm({ initial, onSave, onCancel, busy }: FormProps) {
  const [form, setForm] = useState<BlogPost>({ ...initial, body: initial.body ?? '' });
  const [slugLocked, setSlugLocked] = useState(!!initial.slug);
  const [showPreview, setShowPreview] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [coverError, setCoverError] = useState('');
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const set = (key: keyof BlogPost, value: any) =>
    setForm((f) => ({ ...f, [key]: value }));

  function handleTitleChange(title: string) {
    setForm((f) => ({
      ...f,
      title,
      slug: slugLocked ? f.slug : toSlug(title),
    }));
  }

  function handleSlugChange(raw: string) {
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

  // ── Subida de portada ──────────────────────────────────────────────────────

  async function handleCoverFile(file: File) {
    setUploadingCover(true);
    setCoverError('');
    try {
      const formData = new FormData();
      formData.append('cover', file);
      const res = await fetch('/api/blog-cover', {
        method: 'POST',
        credentials: 'same-origin',
        body: formData,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) {
        setCoverError(extractError(data, 'Error al subir la imagen.'));
      } else {
        set('cover', data.url);
        setCoverError('');
      }
    } catch (e: any) {
      setCoverError(e?.message || 'Error de conexión al subir imagen.');
    } finally {
      setUploadingCover(false);
    }
  }

  // ── Mini-toolbar Markdown ──────────────────────────────────────────────────

  function insertMd(prefix: string, suffix = '', placeholder = 'texto') {
    const ta = bodyRef.current;
    if (!ta) return;
    const start = ta.selectionStart ?? 0;
    const end = ta.selectionEnd ?? 0;
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

  const labelStyle: React.CSSProperties = {
    fontSize: '11px',
    fontWeight: 800,
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    display: 'block',
    marginBottom: '5px',
    fontFamily: 'Sora, sans-serif',
  };
  const inputStyle: React.CSSProperties = {
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
  const toolbarBtnStyle: React.CSSProperties = {
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

  return (
    <div
      style={{
        background: '#fff',
        border: `1px solid ${BORDER}`,
        borderRadius: '16px',
        padding: '1.75rem',
        marginTop: '1rem',
      }}
    >
      <h3
        style={{
          fontSize: '1rem',
          fontWeight: 900,
          color: AZUL,
          margin: '0 0 1.5rem',
          fontFamily: 'Sora, sans-serif',
        }}
      >
        {initial.slug ? `Editando: ${initial.title.slice(0, 55)}…` : 'Nuevo artículo'}
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1.5rem' }}>

        {/* Título */}
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={labelStyle}>Título</label>
          <input
            style={inputStyle}
            value={form.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Título completo del artículo"
          />
        </div>

        {/* Slug */}
        <div>
          <label style={labelStyle}>Slug (URL del artículo)</label>
          <div style={{ position: 'relative' }}>
            <span
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-80%)',
                fontSize: '12px',
                color: '#94a3b8',
                fontFamily: 'Sora, sans-serif',
                pointerEvents: 'none',
              }}
            >
              /blog/
            </span>
            <input
              style={{ ...inputStyle, paddingLeft: '52px' }}
              value={form.slug}
              onChange={(e) => handleSlugChange(e.target.value)}
              placeholder="mi-articulo"
            />
          </div>
          {!slugLocked && form.title && (
            <p
              style={{
                fontSize: '10px',
                color: VERDE,
                margin: '-10px 0 14px',
                fontFamily: 'Sora, sans-serif',
              }}
            >
              Auto-derivado del título. Podés editarlo arriba para fijarlo.
            </p>
          )}
        </div>

        {/* Fecha */}
        <div>
          <label style={labelStyle}>Fecha de publicación</label>
          <input
            type="date"
            style={inputStyle}
            value={form.date}
            onChange={(e) => set('date', e.target.value)}
          />
        </div>

        {/* Excerpt */}
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={labelStyle}>Excerpt (resumen ~30 palabras)</label>
          <textarea
            style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
            value={form.excerpt}
            onChange={(e) => set('excerpt', e.target.value)}
            placeholder="Resumen breve que aparece en las cards del listado y en meta description."
          />
        </div>

        {/* Tags */}
        <div>
          <label style={labelStyle}>Tags (separados por coma)</label>
          <input
            style={inputStyle}
            value={form.tags.join(', ')}
            onChange={(e) =>
              set(
                'tags',
                e.target.value
                  .split(',')
                  .map((t) => t.trim())
                  .filter(Boolean),
              )
            }
            placeholder="ej: Eventos, Marca, Grupo INCAP"
          />
        </div>

        {/* Destacado */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <label
            style={{
              ...labelStyle,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              marginBottom: 0,
              textTransform: 'none',
              fontSize: '13px',
              color: '#374151',
            }}
          >
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => set('featured', e.target.checked)}
              style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: AZUL }}
            />
            Artículo destacado (resaltado en el listado)
          </label>
        </div>

        {/* Portada */}
        <div style={{ gridColumn: '1 / -1', marginBottom: '4px' }}>
          <label style={labelStyle}>Portada</label>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            {/* Preview */}
            {form.cover && (
              <img
                src={form.cover}
                alt="preview portada"
                style={{
                  height: '90px',
                  width: '140px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  border: `1px solid ${BORDER}`,
                  flexShrink: 0,
                }}
              />
            )}

            <div style={{ flex: 1, minWidth: '200px' }}>
              {/* URL manual */}
              <input
                style={{ ...inputStyle, marginBottom: '8px' }}
                value={form.cover}
                onChange={(e) => set('cover', e.target.value)}
                placeholder="/assets/blog/mi-portada.webp"
              />

              {/* Subir archivo */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                style={{ display: 'none' }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleCoverFile(file);
                  e.target.value = '';
                }}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingCover}
                style={{
                  background: uploadingCover ? '#94a3b8' : AZUL,
                  color: '#fff',
                  border: 'none',
                  borderRadius: '7px',
                  padding: '7px 16px',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: uploadingCover ? 'not-allowed' : 'pointer',
                  fontFamily: 'Sora, sans-serif',
                }}
              >
                {uploadingCover ? 'Subiendo…' : 'Subir imagen'}
              </button>
              <p
                style={{
                  fontSize: '10px',
                  color: '#94a3b8',
                  margin: '6px 0 0',
                  fontFamily: 'Sora, sans-serif',
                  lineHeight: 1.5,
                }}
              >
                La imagen se convierte a WebP (max 1200px, calidad 75). URL resultante: /assets/blog/...
              </p>
              {coverError && (
                <p
                  style={{
                    fontSize: '11px',
                    color: '#dc2626',
                    margin: '6px 0 0',
                    fontFamily: 'Sora, sans-serif',
                  }}
                >
                  {coverError}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Cuerpo Markdown */}
        <div style={{ gridColumn: '1 / -1', marginTop: '8px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '8px',
            }}
          >
            <label style={{ ...labelStyle, marginBottom: 0 }}>Cuerpo del artículo (Markdown)</label>
            <button
              type="button"
              onClick={() => setShowPreview((v) => !v)}
              style={{
                background: showPreview ? AZUL : '#f1f5f9',
                color: showPreview ? '#fff' : '#374151',
                border: `1px solid ${showPreview ? AZUL : BORDER}`,
                borderRadius: '6px',
                padding: '4px 12px',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'Sora, sans-serif',
              }}
            >
              {showPreview ? 'Ocultar preview' : 'Mostrar preview'}
            </button>
          </div>

          {/* Mini-toolbar */}
          <div
            style={{
              display: 'flex',
              gap: '6px',
              flexWrap: 'wrap',
              marginBottom: '8px',
            }}
          >
            <button type="button" style={toolbarBtnStyle} onClick={() => insertMd('\n## ', '', 'Subtítulo')}>
              H2
            </button>
            <button type="button" style={toolbarBtnStyle} onClick={() => insertMd('\n### ', '', 'Subtítulo menor')}>
              H3
            </button>
            <button type="button" style={{ ...toolbarBtnStyle, fontWeight: 900 }} onClick={() => insertMd('**', '**', 'texto en negrita')}>
              B
            </button>
            <button type="button" style={{ ...toolbarBtnStyle, fontStyle: 'italic' }} onClick={() => insertMd('*', '*', 'texto en itálica')}>
              I
            </button>
            <button type="button" style={toolbarBtnStyle} onClick={() => insertMd('\n- ', '', 'ítem de lista')}>
              - Lista
            </button>
            <button type="button" style={toolbarBtnStyle} onClick={() => insertMd('\n> ', '', 'cita destacada')}>
              &gt; Cita
            </button>
            <button
              type="button"
              style={toolbarBtnStyle}
              onClick={() => insertMd('[', '](https://)', 'texto del enlace')}
            >
              Link
            </button>
          </div>

          {/* Editor + Preview */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: showPreview ? '1fr 1fr' : '1fr',
              gap: '12px',
              alignItems: 'flex-start',
            }}
          >
            <textarea
              ref={bodyRef}
              style={{
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
              }}
              value={form.body}
              onChange={(e) => set('body', e.target.value)}
              placeholder={`## Subtítulo del primer bloque\n\nEscribí el cuerpo del artículo aquí...\n\n> Una cita destacada — Autor\n\n- Ítem 1 de lista\n- Ítem 2`}
            />

            {showPreview && (
              <div
                style={{
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
                }}
              >
                {/* Estilos de tipografía del preview */}
                <style>{`
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
                `}</style>
                {form.body ? (
                  <div
                    className="blog-md-preview"
                    dangerouslySetInnerHTML={{ __html: bodyHtml }}
                  />
                ) : (
                  <p style={{ color: '#94a3b8', fontStyle: 'italic', fontSize: '13px' }}>
                    El preview aparece aquí mientras escribís.
                  </p>
                )}
              </div>
            )}
          </div>

          <p
            style={{
              fontSize: '10px',
              color: '#94a3b8',
              margin: '6px 0 0',
              fontFamily: 'Sora, sans-serif',
            }}
          >
            Guía rápida: ## Subtítulo | **negrita** | *itálica* | - lista | &gt; cita | [texto](url)
          </p>
        </div>

      </div>

      {/* Acciones */}
      <div style={{ display: 'flex', gap: '12px', marginTop: '1.5rem' }}>
        <button
          type="button"
          onClick={() => onSave(form)}
          disabled={busy || !form.slug || !form.title}
          style={{
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
          }}
        >
          {busy ? 'Guardando…' : 'Guardar artículo'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={busy}
          style={{
            background: '#f1f5f9',
            color: '#64748b',
            border: 'none',
            borderRadius: '8px',
            padding: '10px 22px',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: 'Sora, sans-serif',
          }}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}

// ── Componente principal ─────────────────────────────────────────────────────

interface Props {
  setting: {
    blogIndex: string;
  };
}

export default function BlogAdminPage({ setting }: Props) {
  const initial = parseBlogIndex(setting?.blogIndex);
  const [posts, setPosts] = useState<BlogPost[]>(initial.posts);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [error, setError] = useState('');

  async function saveToApi(newPosts: BlogPost[]) {
    setBusy(true);
    setError('');
    setSuccessMsg('');
    try {
      const body: BlogData = {
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
      } else {
        setPosts(newPosts);
        setEditIndex(null);
        setSuccessMsg('Blog guardado correctamente.');
        setTimeout(() => setSuccessMsg(''), 4000);
      }
    } catch (e: any) {
      setError(e?.message || 'Error de conexión.');
    } finally {
      setBusy(false);
    }
  }

  function handleSavePost(post: BlogPost) {
    let newPosts: BlogPost[];
    if (editIndex === -1) {
      newPosts = [...posts, post];
    } else if (editIndex !== null && editIndex >= 0) {
      newPosts = posts.map((p, i) => (i === editIndex ? post : p));
    } else {
      return;
    }
    saveToApi(newPosts);
  }

  function handleDelete(idx: number) {
    const p = posts[idx];
    if (!window.confirm(`¿Eliminar "${p.title}"?`)) return;
    const newPosts = posts.filter((_, i) => i !== idx);
    saveToApi(newPosts);
  }

  const thStyle: React.CSSProperties = {
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
  const tdStyle: React.CSSProperties = {
    padding: '12px',
    fontSize: '13px',
    color: '#374151',
    fontFamily: 'Sora, sans-serif',
    borderBottom: `1px solid ${BORDER}`,
    verticalAlign: 'middle',
  };
  const btnStyle = (color: string): React.CSSProperties => ({
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

  return (
    <div style={{ fontFamily: 'Sora, sans-serif', padding: '2rem', maxWidth: '1150px' }}>

      {/* Panel de instrucciones (colapsable) */}
      <details
        style={{
          marginBottom: '1.5rem',
          border: `1px solid #bfdbfe`,
          borderRadius: '12px',
          background: '#eff6ff',
          overflow: 'hidden',
        }}
      >
        <summary
          style={{
            padding: '12px 18px',
            cursor: 'pointer',
            fontWeight: 700,
            fontSize: '13px',
            color: AZUL,
            fontFamily: 'Sora, sans-serif',
            userSelect: 'none',
          }}
        >
          Cómo cargar un artículo — guía rápida
        </summary>
        <div style={{ padding: '0 18px 16px', fontSize: '13px', color: '#374151', lineHeight: 1.75 }}>
          <ol style={{ margin: '8px 0 0', paddingLeft: '1.4rem' }}>
            <li>
              <strong>Título:</strong> el slug (URL del artículo) se genera automáticamente.
              Podés editarlo si querés acortarlo o personalizarlo.
            </li>
            <li>
              <strong>Portada:</strong> hacé clic en "Subir imagen" (recomendado: WebP, aprox. 1200px de ancho).
              La imagen se convierte a WebP automáticamente y queda en {'/assets/blog/'}.
              También podés pegar una URL directamente.
            </li>
            <li>
              <strong>Cuerpo en Markdown:</strong> usá los botones de la mini-barra para insertar sintaxis.
              <br />
              <code style={{ background: '#dbeafe', padding: '1px 5px', borderRadius: '3px', fontSize: '12px' }}>
                ## Subtítulo
              </code>{' '}
              <code style={{ background: '#dbeafe', padding: '1px 5px', borderRadius: '3px', fontSize: '12px' }}>
                **negrita**
              </code>{' '}
              <code style={{ background: '#dbeafe', padding: '1px 5px', borderRadius: '3px', fontSize: '12px' }}>
                - lista
              </code>{' '}
              <code style={{ background: '#dbeafe', padding: '1px 5px', borderRadius: '3px', fontSize: '12px' }}>
                {'>'} cita
              </code>{' '}
              <code style={{ background: '#dbeafe', padding: '1px 5px', borderRadius: '3px', fontSize: '12px' }}>
                [texto](url)
              </code>
            </li>
            <li>
              Activá <strong>Mostrar preview</strong> para ver el resultado en tiempo real al costado.
            </li>
            <li>
              Completá <strong>Tags</strong> (separados por coma) y <strong>Fecha</strong>, marcá
              si es <strong>Destacado</strong> (aparece resaltado arriba del listado).
            </li>
            <li>Hacé clic en <strong>Guardar artículo</strong>. El cambio se aplica de inmediato.</li>
          </ol>
        </div>
      </details>

      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '1.25rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <h1
            style={{
              fontSize: '1.5rem',
              fontWeight: 900,
              color: AZUL,
              margin: '0 0 4px',
              fontFamily: 'Sora, sans-serif',
            }}
          >
            Gestión del Blog
          </h1>
          <p style={{ fontSize: '13px', color: '#64748b', margin: 0, fontFamily: 'Sora, sans-serif' }}>
            Título, portada, cuerpo (Markdown) y metadatos de cada artículo — todo desde aquí.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setEditIndex(-1)}
          disabled={busy || editIndex !== null}
          style={{
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
          }}
        >
          + Nuevo artículo
        </button>
      </div>

      {/* Mensajes */}
      {error && (
        <div
          style={{
            background: '#fef2f2',
            border: '1px solid #fca5a5',
            borderRadius: '8px',
            padding: '10px 16px',
            marginBottom: '1rem',
            color: '#dc2626',
            fontSize: '13px',
            fontFamily: 'Sora, sans-serif',
          }}
        >
          {error}
        </div>
      )}
      {successMsg && (
        <div
          style={{
            background: '#f0fdf4',
            border: '1px solid #86efac',
            borderRadius: '8px',
            padding: '10px 16px',
            marginBottom: '1rem',
            color: '#16a34a',
            fontSize: '13px',
            fontFamily: 'Sora, sans-serif',
          }}
        >
          {successMsg}
        </div>
      )}

      {/* Formulario nuevo artículo */}
      {editIndex === -1 && (
        <PostForm
          initial={EMPTY_POST}
          onSave={handleSavePost}
          onCancel={() => setEditIndex(null)}
          busy={busy}
        />
      )}

      {/* Tabla de posts */}
      <div
        style={{
          background: '#fff',
          border: `1px solid ${BORDER}`,
          borderRadius: '16px',
          overflow: 'auto',
          marginTop: '1.25rem',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
          <thead>
            <tr>
              <th style={thStyle}>Portada</th>
              <th style={thStyle}>Título / URL</th>
              <th style={thStyle}>Fecha</th>
              <th style={thStyle}>Tags</th>
              <th style={{ ...thStyle, textAlign: 'center' }}>Dest.</th>
              <th style={thStyle}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  style={{
                    ...tdStyle,
                    textAlign: 'center',
                    color: '#94a3b8',
                    padding: '2.5rem',
                  }}
                >
                  No hay artículos. Haz clic en "Nuevo artículo" para agregar el primero.
                </td>
              </tr>
            )}
            {posts.map((post, idx) => (
              <React.Fragment key={post.slug}>
                <tr style={{ background: editIndex === idx ? '#eff6ff' : 'transparent' }}>
                  <td style={tdStyle}>
                    {post.cover && (
                      <img
                        src={post.cover}
                        alt=""
                        style={{
                          width: '60px',
                          height: '44px',
                          objectFit: 'cover',
                          borderRadius: '6px',
                          display: 'block',
                        }}
                      />
                    )}
                  </td>
                  <td style={tdStyle}>
                    <div style={{ fontWeight: 900, color: '#181B1C', marginBottom: '3px', fontSize: '13px' }}>
                      {post.title.length > 65 ? post.title.slice(0, 65) + '…' : post.title}
                    </div>
                    <code
                      style={{
                        fontSize: '10px',
                        color: '#94a3b8',
                        background: '#f8fafc',
                        padding: '1px 6px',
                        borderRadius: '4px',
                      }}
                    >
                      /blog/{post.slug}
                    </code>
                  </td>
                  <td style={{ ...tdStyle, whiteSpace: 'nowrap' }}>{post.date}</td>
                  <td style={tdStyle}>{post.tags.join(', ')}</td>
                  <td style={{ ...tdStyle, textAlign: 'center' }}>
                    {post.featured ? (
                      <span style={{ fontSize: '16px' }}>★</span>
                    ) : (
                      <span style={{ color: '#cbd5e1', fontSize: '16px' }}>☆</span>
                    )}
                  </td>
                  <td style={tdStyle}>
                    <button
                      type="button"
                      onClick={() => setEditIndex(idx === editIndex ? null : idx)}
                      disabled={busy}
                      style={btnStyle(AZUL)}
                    >
                      {editIndex === idx ? 'Cerrar' : 'Editar'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(idx)}
                      disabled={busy}
                      style={btnStyle('#dc2626')}
                    >
                      Borrar
                    </button>
                    <a
                      href={`/blog/${post.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontSize: '11px',
                        color: AZUL,
                        fontWeight: 700,
                        textDecoration: 'none',
                      }}
                    >
                      Ver →
                    </a>
                  </td>
                </tr>
                {editIndex === idx && (
                  <tr>
                    <td colSpan={6} style={{ padding: '0 12px 16px' }}>
                      <PostForm
                        initial={post}
                        onSave={handleSavePost}
                        onCancel={() => setEditIndex(null)}
                        busy={busy}
                      />
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <p
        style={{
          fontSize: '11px',
          color: '#94a3b8',
          marginTop: '1rem',
          fontFamily: 'Sora, sans-serif',
          lineHeight: 1.6,
        }}
      >
        Los cambios se guardan en el setting{' '}
        <code style={{ background: '#f1f5f9', padding: '1px 5px', borderRadius: '4px' }}>
          blog_index
        </code>{' '}
        de la base de datos. Las portadas subidas quedan en el volumen Railway en{' '}
        <code style={{ background: '#f1f5f9', padding: '1px 5px', borderRadius: '4px' }}>
          /app/media/blog/
        </code>{' '}
        y se sirven en{' '}
        <code style={{ background: '#f1f5f9', padding: '1px 5px', borderRadius: '4px' }}>
          /assets/blog/&lt;archivo&gt;.webp
        </code>
        .
      </p>
    </div>
  );
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
