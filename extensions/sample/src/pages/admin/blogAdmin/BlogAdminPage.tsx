/**
 * Página admin /blog-admin
 * Gestiona los metadatos del blog: lista de posts en el setting `blog_index`.
 * El cuerpo de cada artículo se redacta en Admin → CMS → Pages.
 */
import React, { useState } from 'react';
import { DEFAULT_BLOG, type BlogPost, type BlogData } from '../../../components/blogData.js';

const AZUL = '#2A4899';
const VERDE = '#85C639';
const BORDER = '#e2e8f0';

// ── Helpers ─────────────────────────────────────────────────────────────────

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

const EMPTY_POST: BlogPost = {
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

// ── Sub-componente: formulario de edición ───────────────────────────────────

interface FormProps {
  initial: BlogPost;
  onSave: (post: BlogPost) => void;
  onCancel: () => void;
  busy: boolean;
}

function PostForm({ initial, onSave, onCancel, busy }: FormProps) {
  const [form, setForm] = useState<BlogPost>({ ...initial });

  const set = (key: keyof BlogPost, value: any) => setForm((f) => ({ ...f, [key]: value }));

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
          margin: '0 0 1.25rem',
          fontFamily: 'Sora, sans-serif',
        }}
      >
        {initial.slug ? `Editando: ${initial.title.slice(0, 60)}…` : 'Nuevo artículo'}
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1.5rem' }}>

        <div style={{ gridColumn: '1 / -1' }}>
          <label style={labelStyle}>Título</label>
          <input
            style={inputStyle}
            value={form.title}
            onChange={(e) => set('title', e.target.value)}
            placeholder="Título completo del artículo"
          />
        </div>

        <div>
          <label style={labelStyle}>Slug (URL)</label>
          <input
            style={inputStyle}
            value={form.slug}
            onChange={(e) => set('slug', e.target.value.toLowerCase().replace(/\s+/g, '-'))}
            placeholder="ej: incap-en-interzum-2026"
          />
        </div>

        <div>
          <label style={labelStyle}>CMS URL Key</label>
          <input
            style={inputStyle}
            value={form.cmsUrlKey}
            onChange={(e) => set('cmsUrlKey', e.target.value)}
            placeholder="ej: blog-incap-en-interzum-2026"
          />
          <p style={{ fontSize: '11px', color: '#94a3b8', margin: '-10px 0 14px', fontFamily: 'Sora, sans-serif' }}>
            URL Key de la CMS Page que contiene el cuerpo.
          </p>
        </div>

        <div style={{ gridColumn: '1 / -1' }}>
          <label style={labelStyle}>Excerpt (resumen ~30 palabras)</label>
          <textarea
            style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
            value={form.excerpt}
            onChange={(e) => set('excerpt', e.target.value)}
            placeholder="Resumen que aparece en las cards del listado."
          />
        </div>

        <div>
          <label style={labelStyle}>Fecha (YYYY-MM-DD)</label>
          <input
            type="date"
            style={inputStyle}
            value={form.date}
            onChange={(e) => set('date', e.target.value)}
          />
        </div>

        <div>
          <label style={labelStyle}>Tags (separados por coma)</label>
          <input
            style={inputStyle}
            value={form.tags.join(', ')}
            onChange={(e) => set('tags', e.target.value.split(',').map((t) => t.trim()).filter(Boolean))}
            placeholder="ej: Eventos, Marca, Grupo INCAP"
          />
        </div>

        <div style={{ gridColumn: '1 / -1' }}>
          <label style={labelStyle}>URL de portada</label>
          <input
            style={inputStyle}
            value={form.cover}
            onChange={(e) => set('cover', e.target.value)}
            placeholder="/images/blog/mi-articulo.webp  —  TODO: subir via media volume"
          />
          {form.cover && (
            <img
              src={form.cover}
              alt="preview"
              style={{ height: '80px', objectFit: 'cover', borderRadius: '8px', marginTop: '-6px', marginBottom: '14px', border: `1px solid ${BORDER}` }}
            />
          )}
        </div>

        <div>
          <label style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '14px' }}>
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => set('featured', e.target.checked)}
              style={{ width: '16px', height: '16px', cursor: 'pointer' }}
            />
            Artículo destacado (aparece resaltado en el listado)
          </label>
        </div>

      </div>

      <div style={{ display: 'flex', gap: '12px', marginTop: '0.5rem' }}>
        <button
          onClick={() => onSave(form)}
          disabled={busy || !form.slug || !form.title}
          style={{
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
          }}
        >
          {busy ? 'Guardando…' : 'Guardar'}
        </button>
        <button
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
  const [editIndex, setEditIndex] = useState<number | null>(null); // null = cerrado, -1 = nuevo
  const [busy, setBusy] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [error, setError] = useState('');

  async function saveToApi(newPosts: BlogPost[]) {
    setBusy(true);
    setError('');
    setSuccessMsg('');
    try {
      const body: BlogData = { posts: newPosts, tags: Array.from(new Set(newPosts.flatMap((p) => p.tags))) };
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
        setSuccessMsg('Blog index guardado correctamente.');
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
      // Nuevo
      newPosts = [...posts, post];
    } else if (editIndex !== null) {
      // Editar existente
      newPosts = posts.map((p, i) => (i === editIndex ? post : p));
    } else {
      return;
    }
    saveToApi(newPosts);
  }

  function handleDelete(idx: number) {
    const p = posts[idx];
    if (!window.confirm(`¿Eliminar "${p.title}"? Esta acción actualizará el setting del blog.`)) return;
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
    padding: '12px 12px',
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
    <div style={{ fontFamily: 'Sora, sans-serif', padding: '2rem', maxWidth: '1100px' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 900, color: AZUL, margin: '0 0 4px', fontFamily: 'Sora, sans-serif' }}>
            Gestión del Blog
          </h1>
          <p style={{ fontSize: '13px', color: '#64748b', margin: 0, fontFamily: 'Sora, sans-serif' }}>
            Edita los metadatos de cada artículo. El cuerpo se redacta en{' '}
            <a href="/admin/cms/pages" style={{ color: AZUL, fontWeight: 700 }}>
              Admin → CMS → Pages
            </a>{' '}
            usando el url_key <code style={{ background: '#f1f5f9', padding: '1px 5px', borderRadius: '4px', fontSize: '11px' }}>blog-{'<slug>'}</code>.
          </p>
        </div>
        <button
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
            cursor: 'pointer',
            fontFamily: 'Sora, sans-serif',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}
        >
          + Nuevo artículo
        </button>
      </div>

      {/* Mensajes */}
      {error && (
        <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '8px', padding: '10px 16px', marginBottom: '1rem', color: '#dc2626', fontSize: '13px', fontFamily: 'Sora, sans-serif' }}>
          {error}
        </div>
      )}
      {successMsg && (
        <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '8px', padding: '10px 16px', marginBottom: '1rem', color: '#16a34a', fontSize: '13px', fontFamily: 'Sora, sans-serif' }}>
          {successMsg}
        </div>
      )}

      {/* Formulario nuevo */}
      {editIndex === -1 && (
        <PostForm
          initial={EMPTY_POST}
          onSave={handleSavePost}
          onCancel={() => setEditIndex(null)}
          busy={busy}
        />
      )}

      {/* Tabla de posts */}
      <div style={{ background: '#fff', border: `1px solid ${BORDER}`, borderRadius: '16px', overflow: 'auto', marginTop: editIndex === -1 ? '1.5rem' : 0 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
          <thead>
            <tr>
              <th style={thStyle}>Portada</th>
              <th style={thStyle}>Título / Slug</th>
              <th style={thStyle}>Fecha</th>
              <th style={thStyle}>Tags</th>
              <th style={{ ...thStyle, textAlign: 'center' }}>Dest.</th>
              <th style={thStyle}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 && (
              <tr>
                <td colSpan={6} style={{ ...tdStyle, textAlign: 'center', color: '#94a3b8', padding: '2.5rem' }}>
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
                        style={{ width: '60px', height: '44px', objectFit: 'cover', borderRadius: '6px', display: 'block' }}
                      />
                    )}
                  </td>
                  <td style={tdStyle}>
                    <div style={{ fontWeight: 900, color: '#181B1C', marginBottom: '3px' }}>
                      {post.title.length > 70 ? post.title.slice(0, 70) + '…' : post.title}
                    </div>
                    <code style={{ fontSize: '10px', color: '#94a3b8', background: '#f8fafc', padding: '1px 6px', borderRadius: '4px' }}>
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
                      onClick={() => setEditIndex(idx === editIndex ? null : idx)}
                      disabled={busy}
                      style={btnStyle(AZUL)}
                    >
                      {editIndex === idx ? 'Cerrar' : 'Editar'}
                    </button>
                    <button
                      onClick={() => handleDelete(idx)}
                      disabled={busy}
                      style={{ ...btnStyle('#dc2626') }}
                    >
                      Borrar
                    </button>
                    <a
                      href={`/blog/${post.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: '11px', color: AZUL, fontWeight: 700, textDecoration: 'none' }}
                    >
                      Ver →
                    </a>
                  </td>
                </tr>
                {editIndex === idx && (
                  <tr>
                    <td colSpan={6} style={{ padding: '0 12px 12px' }}>
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

      {/* Nota footer */}
      <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '1rem', fontFamily: 'Sora, sans-serif', lineHeight: 1.6 }}>
        Los cambios se guardan en el setting <code style={{ background: '#f1f5f9', padding: '1px 5px', borderRadius: '4px' }}>blog_index</code> de la base de datos. La portada es una URL de imagen; para subir imágenes reales, use el directorio del volumen Railway en <code style={{ background: '#f1f5f9', padding: '1px 5px', borderRadius: '4px' }}>/app/media/</code> y referencia la URL relativa.
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
