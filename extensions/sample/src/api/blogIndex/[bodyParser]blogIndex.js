import { pool } from '@evershop/evershop/lib/postgres';
import { getSetting, refreshSetting } from '@evershop/evershop/setting/services';

/**
 * GET  /api/blog-index  → devuelve el blog_index actual
 * POST /api/blog-index  → recibe { posts, tags } y persiste el setting
 */
export default async function blogIndex(request, response) {
  const admin = typeof request.getCurrentUser === 'function' ? request.getCurrentUser() : null;
  if (!admin) {
    return response.status(401).json({ error: 'No autorizado' });
  }

  // ── GET: devolver el índice actual ────────────────────────────────────────
  if (request.method === 'GET') {
    try {
      const raw = await getSetting('blog_index', '{}');
      let data = {};
      try { data = JSON.parse(raw); } catch { data = {}; }
      return response.json({ success: true, data });
    } catch (err) {
      return response.status(500).json({ error: err.message });
    }
  }

  // ── POST: persistir el nuevo índice ──────────────────────────────────────
  const body = request.body || {};

  if (!Array.isArray(body.posts)) {
    return response.status(400).json({ error: 'El campo "posts" debe ser un array.' });
  }

  // Validación básica de cada post
  for (const post of body.posts) {
    if (!post.slug || !post.title) {
      return response.status(400).json({ error: 'Cada post debe tener slug y title.' });
    }
  }

  try {
    const value = JSON.stringify({ posts: body.posts, tags: body.tags ?? [] });
    await pool.query(
      `INSERT INTO setting (name, value, is_json)
       VALUES ('blog_index', $1, true)
       ON CONFLICT (name) DO UPDATE SET value = EXCLUDED.value, is_json = true`,
      [value],
    );
    await refreshSetting();
    return response.json({ success: true });
  } catch (err) {
    return response.status(500).json({ error: err.message });
  }
}
