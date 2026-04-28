export const dynamic = 'force-dynamic';
import { getProducts, getBlogs } from '../lib/db';

export default async function sitemap() {
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://homisepk.com';

  let products = [];
  let blogs = [];

  try {
    [products, blogs] = await Promise.all([getProducts(), getBlogs()]);
  } catch {}

  const staticPages = [
    '/', '/shop', '/about', '/contact', '/blog',
    '/return-policy', '/privacy-policy', '/shipping', '/terms-and-conditions',
    '/collection/best-items'
  ].map(url => ({
    url: `${SITE_URL}${url}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: url === '/' ? 1.0 : 0.8
  }));

  const productPages = products.map(p => ({
    url: `${SITE_URL}/product/${p.slug}`,
    lastModified: new Date(p.updatedAt || p.createdAt),
    changeFrequency: 'weekly',
    priority: 0.9
  }));

  const blogPages = blogs.map(b => ({
    url: `${SITE_URL}/blog/${b.slug}`,
    lastModified: new Date(b.created_at),
    changeFrequency: 'monthly',
    priority: 0.6
  }));

  return [...staticPages, ...productPages, ...blogPages];
}
