import React from 'react';

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  cover: string;
  date: string;
  tags?: string[];
  featured?: boolean;
}

interface Props {
  setting?: {
    blogIndex?: string | null;
  };
}

const MONTHS = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
];

function formatDate(iso: string): string {
  try {
    const [y, m, d] = iso.split('-').map(Number);
    return `${d} de ${MONTHS[m - 1]} de ${y}`;
  } catch {
    return iso;
  }
}

function parsePosts(raw?: string | null): BlogPost[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (parsed && Array.isArray(parsed.posts)) return parsed.posts as BlogPost[];
  } catch {
    // sin datos → sección oculta
  }
  return [];
}

export default function BlogSection({ setting }: Props) {
  const posts = parsePosts(setting?.blogIndex)
    .slice()
    .sort((a, b) => (b.date || '').localeCompare(a.date || ''))
    .slice(0, 3);

  if (posts.length === 0) return null;

  return (
    <section className="bg-[#f8f9fa] py-20 md:py-28 px-4 sm:px-6 lg:px-8 font-sora">
      <div className="w-full max-w-[1920px] mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <div>
            <span className="text-[#85C639] font-black text-[10px] md:text-xs uppercase tracking-[0.4em] block mb-3">
              Novedades
            </span>
            <h2 className="text-4xl md:text-7xl font-black text-[#181B1C] leading-[0.9] uppercase font-sora">
              Desde el <span className="text-[#2A4899]">Blog</span>
            </h2>
            <div className="w-24 h-2 bg-[#85C639] mt-6" />
          </div>

          <a
            href="/blog"
            className="mt-8 md:mt-0 text-[10px] font-black text-[#2A4899] hover:text-[#85C639] tracking-[0.2em] uppercase flex items-center gap-2 transition-all group"
          >
            VER TODO EL BLOG
            <span className="group-hover:translate-x-2 transition-transform">→</span>
          </a>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {posts.map((post) => (
            <a
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col bg-white rounded-3xl overflow-hidden shadow-xl shadow-slate-200/40 border border-slate-100 hover:shadow-2xl hover:-translate-y-1 transition-all"
            >
              <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
                {post.cover ? (
                  <img
                    src={post.cover}
                    alt={post.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300 font-black uppercase tracking-widest text-sm">
                    INCAP
                  </div>
                )}
              </div>

              <div className="flex flex-col flex-grow p-6 md:p-8">
                <div className="flex items-center gap-3 mb-3 flex-wrap">
                  {post.tags?.[0] && (
                    <span className="text-[#2A4899] font-black text-[9px] md:text-[10px] uppercase tracking-[0.3em]">
                      {post.tags[0]}
                    </span>
                  )}
                  <span className="text-slate-400 text-[10px] md:text-xs font-inter">
                    {formatDate(post.date)}
                  </span>
                </div>

                <h3 className="text-lg md:text-xl font-black font-sora text-[#181B1C] group-hover:text-[#2A4899] transition-colors leading-tight mb-3">
                  {post.title}
                </h3>

                {post.excerpt && (
                  <p className="text-sm text-slate-500 font-inter leading-relaxed line-clamp-3 flex-grow">
                    {post.excerpt}
                  </p>
                )}

                <span className="mt-5 text-[10px] font-black text-[#2A4899] group-hover:text-[#85C639] tracking-[0.2em] uppercase flex items-center gap-2 transition-colors">
                  Leer artículo
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export const layout = {
  areaId: 'content',
  sortOrder: 11
};

export const query = `
query BlogSectionQuery {
  setting {
    blogIndex
  }
}
`;
