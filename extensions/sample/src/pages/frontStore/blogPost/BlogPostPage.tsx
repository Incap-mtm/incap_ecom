import React, { useState, useEffect } from 'react';
import { useQuery } from 'urql';
import { DEFAULT_BLOG, parseBlogIndex, formatDate, type BlogPost } from '../../../components/blogData.js';

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

// ── EditorJS inline renderer (evita importar @components en extensión) ─────
interface EditorBlock {
  type: string;
  data: any;
}

function renderBlock(block: EditorBlock, idx: number): React.ReactElement | null {
  const bodyStyle: React.CSSProperties = {
    fontSize: '16px',
    color: '#374151',
    lineHeight: 1.85,
    fontFamily: 'Sora, sans-serif',
    margin: '0 0 1.25rem',
  };
  switch (block.type) {
    case 'paragraph':
      return (
        <p
          key={idx}
          style={bodyStyle}
          dangerouslySetInnerHTML={{ __html: block.data?.text ?? '' }}
        />
      );
    case 'header': {
      const level = block.data?.level ?? 2;
      const headStyle: React.CSSProperties = {
        fontSize: level <= 2 ? '1.5rem' : '1.2rem',
        fontWeight: 900,
        color: '#181B1C',
        margin: '2rem 0 0.875rem',
        fontFamily: 'Sora, sans-serif',
        lineHeight: 1.25,
      };
      return React.createElement(`h${level}`, { key: idx, style: headStyle }, block.data?.text ?? '');
    }
    case 'list': {
      const ListTag = block.data?.style === 'ordered' ? 'ol' : 'ul';
      return (
        <ListTag key={idx} style={{ paddingLeft: '1.5rem', margin: '0 0 1.25rem' }}>
          {(block.data?.items ?? []).map((item: string, i: number) => (
            <li key={i} style={{ ...bodyStyle, margin: '0 0 0.4rem' }}>{item}</li>
          ))}
        </ListTag>
      );
    }
    case 'quote':
      return (
        <blockquote
          key={idx}
          style={{
            borderLeft: `4px solid ${AZUL}`,
            paddingLeft: '1.5rem',
            margin: '1.75rem 0',
            fontStyle: 'italic',
          }}
        >
          <p style={{ ...bodyStyle, color: '#2A4899' }}>"{block.data?.text ?? ''}"</p>
          {block.data?.caption && (
            <cite style={{ fontSize: '13px', color: '#64748b', fontFamily: 'Sora, sans-serif' }}>
              — {block.data.caption}
            </cite>
          )}
        </blockquote>
      );
    default:
      return null;
  }
}

/** Extrae bloques EditorJS aplanados desde la estructura Row[] del CMS. */
function extractBlocks(content: any): EditorBlock[] {
  if (!content || !Array.isArray(content)) return [];
  const blocks: EditorBlock[] = [];
  for (const row of content) {
    if (!Array.isArray(row?.columns)) continue;
    for (const col of row.columns) {
      if (!Array.isArray(col?.data?.blocks)) continue;
      blocks.push(...col.data.blocks);
    }
  }
  return blocks;
}

export default function BlogPostPage() {
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

  const blogData = parseBlogIndex(settingResult.data?.setting?.blogIndex);
  const wa = settingResult.data?.setting?.storeWhatsappNumber ?? '573002171521';

  // Encontrar el post por slug
  const post: BlogPost | undefined = slug
    ? blogData.posts.find((p) => p.slug === slug)
    : undefined;

  // CMS query — sólo cuando tenemos el slug
  const cmsUrlKey = post?.cmsUrlKey ?? '';
  const cmsQueryStr = cmsUrlKey
    ? `query { cmsPages(filters: [{ key: "url_key", operation: eq, value: "${cmsUrlKey}" }]) { items { urlKey name content metaTitle metaDescription } } }`
    : '{ __typename }';

  const [cmsResult] = useQuery({
    query: cmsQueryStr,
    pause: !isClient || !cmsUrlKey,
    requestPolicy: 'cache-and-network',
  });

  // Extraer contenido del CMS o usar fallback
  const cmsPage = cmsResult.data?.cmsPages?.items?.[0];
  const blocks = cmsPage?.content ? extractBlocks(cmsPage.content) : [];
  const usesFallback = blocks.length === 0;

  // Posts relacionados
  const relatedPosts = blogData.posts.filter((p) => p.slug !== slug).slice(0, 3);

  // JSON-LD Article
  const coverAbsolute = post?.cover
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
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#94a3b8', fontFamily: 'Sora, sans-serif', fontSize: '15px' }}>Cargando artículo...</p>
      </div>
    );
  }

  if (isClient && slug && !settingResult.fetching && !post) {
    return (
      <div style={{ minHeight: '60vh', maxWidth: '800px', margin: '4rem auto', padding: '0 2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#181B1C', fontFamily: 'Sora, sans-serif', marginBottom: '1rem' }}>
          Artículo no encontrado
        </h1>
        <p style={{ color: '#64748b', fontSize: '15px', fontFamily: 'Sora, sans-serif', marginBottom: '1.5rem' }}>
          El artículo que buscas no existe o fue movido.
        </p>
        <a
          href="/blog"
          style={{
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
          }}
        >
          Ver todos los artículos
        </a>
      </div>
    );
  }

  if (!post) return null;

  const metaTitle = cmsPage?.metaTitle ?? post.title;
  const metaDesc = cmsPage?.metaDescription ?? post.excerpt;

  return (
    <div style={{ fontFamily: 'Sora, sans-serif', background: '#f8fafc', minHeight: '100vh' }}>

      {/* JSON-LD */}
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd }}
        />
      )}

      {/* Meta SEO — actualiza document.title en cliente */}
      {isClient && (() => {
        document.title = metaTitle;
        let desc = document.querySelector('meta[name="description"]');
        if (!desc) {
          desc = document.createElement('meta');
          (desc as HTMLMetaElement).name = 'description';
          document.head.appendChild(desc);
        }
        (desc as HTMLMetaElement).content = metaDesc;
        return null;
      })()}

      {/* Hero */}
      <section
        style={{
          position: 'relative',
          height: 'clamp(320px, 45vw, 520px)',
          overflow: 'hidden',
          background: '#181B1C',
        }}
      >
        <img
          src={post.cover}
          alt={post.title}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.55,
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, rgba(24,27,28,0.2) 0%, rgba(24,27,28,0.85) 100%)',
          }}
        />
        <div
          style={{
            position: 'relative',
            maxWidth: '900px',
            margin: '0 auto',
            padding: '0 2rem',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            paddingBottom: '3rem',
          }}
        >
          {/* Breadcrumb */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '16px' }}>
            <a
              href="/blog"
              style={{ fontSize: '11px', color: 'rgba(255,255,255,0.65)', textDecoration: 'none', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}
            >
              Blog
            </a>
            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px' }}>›</span>
            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.65)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              {post.tags[0] ?? 'Artículo'}
            </span>
          </div>

          {/* Tags */}
          <div style={{ display: 'flex', gap: '6px', marginBottom: '14px', flexWrap: 'wrap' }}>
            {post.tags.map((tag) => (
              <span
                key={tag}
                style={{
                  background: VERDE,
                  color: '#181B1C',
                  fontSize: '9px',
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  padding: '4px 10px',
                  borderRadius: '20px',
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          <h1
            style={{
              fontSize: 'clamp(1.5rem, 4vw, 2.75rem)',
              fontWeight: 900,
              color: '#fff',
              margin: '0 0 1rem',
              lineHeight: 1.15,
              fontFamily: 'Sora, sans-serif',
            }}
          >
            {post.title}
          </h1>

          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.55)', fontFamily: 'Sora, sans-serif' }}>
            {formatDate(post.date)}
          </span>
        </div>
      </section>

      {/* Article body */}
      <article style={{ maxWidth: '780px', margin: '0 auto', padding: '3.5rem 2rem 3rem' }}>
        {/* Excerpt */}
        <p
          style={{
            fontSize: '18px',
            color: '#374151',
            lineHeight: 1.75,
            fontFamily: 'Sora, sans-serif',
            margin: '0 0 2.5rem',
            fontWeight: 500,
            borderLeft: `4px solid ${VERDE}`,
            paddingLeft: '1.25rem',
          }}
        >
          {post.excerpt}
        </p>

        {/* CMS or fallback content */}
        {usesFallback
          ? post.bodyFallback.map((text, i) => (
              <p
                key={i}
                style={{
                  fontSize: '16px',
                  color: '#374151',
                  lineHeight: 1.85,
                  fontFamily: 'Sora, sans-serif',
                  margin: '0 0 1.25rem',
                }}
              >
                {text}
              </p>
            ))
          : blocks.map((block, i) => renderBlock(block, i))}
      </article>

      {/* Related posts */}
      {relatedPosts.length > 0 && (
        <section
          style={{
            background: '#fff',
            borderTop: '1px solid #e2e8f0',
            padding: '3.5rem 2rem 4rem',
          }}
        >
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <span
              style={{
                fontSize: '10px',
                fontWeight: 800,
                color: VERDE,
                letterSpacing: '0.35em',
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: '8px',
              }}
            >
              Más artículos
            </span>
            <h2
              style={{
                fontSize: 'clamp(1.2rem, 2.5vw, 1.75rem)',
                fontWeight: 900,
                color: '#181B1C',
                margin: '0 0 2rem',
                fontFamily: 'Sora, sans-serif',
              }}
            >
              También puede interesarte
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
              {relatedPosts.map((rp) => (
                <a
                  key={rp.slug}
                  href={`/blog/${rp.slug}`}
                  style={{
                    display: 'flex',
                    gap: '1rem',
                    alignItems: 'flex-start',
                    background: '#f8fafc',
                    borderRadius: '0 12px 12px 12px',
                    border: '1px solid #e2e8f0',
                    padding: '1rem',
                    textDecoration: 'none',
                  }}
                >
                  <img
                    src={rp.cover}
                    alt={rp.title}
                    style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }}
                  />
                  <div>
                    <span style={{ fontSize: '9px', color: '#94a3b8', fontFamily: 'Sora, sans-serif', display: 'block', marginBottom: '4px' }}>
                      {formatDate(rp.date)}
                    </span>
                    <p
                      style={{
                        fontSize: '12px',
                        fontWeight: 900,
                        color: '#181B1C',
                        margin: 0,
                        lineHeight: 1.35,
                        fontFamily: 'Sora, sans-serif',
                      }}
                    >
                      {rp.title.length > 80 ? rp.title.slice(0, 80) + '…' : rp.title}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA WhatsApp */}
      <section
        style={{
          background: `linear-gradient(135deg, ${AZUL} 0%, #1e3576 100%)`,
          padding: '4rem 2rem',
          textAlign: 'center',
        }}
      >
        <span
          style={{
            fontSize: '10px',
            fontWeight: 800,
            color: VERDE,
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            display: 'block',
            marginBottom: '12px',
          }}
        >
          ¿Tienes dudas técnicas?
        </span>
        <h2
          style={{
            fontSize: 'clamp(1.4rem, 3vw, 2.25rem)',
            fontWeight: 900,
            color: '#fff',
            margin: '0 0 1rem',
            fontFamily: 'Sora, sans-serif',
          }}
        >
          Nuestros técnicos resuelven tus dudas gratis
        </h2>
        <p
          style={{
            fontSize: '14px',
            color: 'rgba(255,255,255,0.65)',
            maxWidth: '520px',
            margin: '0 auto 1.75rem',
            lineHeight: 1.7,
            fontFamily: 'Sora, sans-serif',
          }}
        >
          Escríbenos por WhatsApp y recibe asesoría técnica personalizada para tu industria.
        </p>
        <a
          href={`https://wa.me/${wa}?text=${encodeURIComponent('Hola INCAP, leí su artículo y tengo una consulta técnica.')}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
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
          }}
        >
          Hablar con un técnico INCAP →
        </a>
      </section>

    </div>
  );
}

export const layout = {
  areaId: 'content',
  sortOrder: 1,
};
