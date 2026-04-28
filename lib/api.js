// Client-side API helpers — all calls go to /api/* (Next.js API routes)
// For server components, import directly from lib/db.js instead

export { getProducts, getProductBySlug as getProduct, getCategories, getCategoryBySlug as getCategory, getBlogs, getBlogBySlug as getBlog } from './db';

// Re-export for server components (same functions)
export { getProductBySlug, getCategoryBySlug, getBlogBySlug } from './db';

// ─── Client-side fetch helpers ───────────────────────────────────────────────

export async function placeOrder(data) {
  const res = await fetch('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Order failed');
  }
  return res.json();
}

export async function addReview(slug, data) {
  const res = await fetch(`/api/products/${slug}/review`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Review failed');
  }
  return res.json();
}

// ─── Admin fetch helper ──────────────────────────────────────────────────────

export function adminFetch(endpoint, options = {}, token = '') {
  return fetch(`/api${endpoint}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(!options.body || options.body instanceof FormData
        ? {}
        : { 'Content-Type': 'application/json' }),
      ...options.headers
    }
  }).then(r => r.json());
}
