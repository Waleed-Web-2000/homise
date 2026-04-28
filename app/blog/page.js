import Link from 'next/link';
import { getBlogs } from '../../lib/db';

export const metadata = {
  title: 'Blog - Homisepk',
  description: 'Read the latest articles and tips from Homisepk.'
};

export default async function BlogPage() {
  let blogs = [];
  try { blogs = await getBlogs(); } catch {}

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Blog</h1>
      {blogs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map(blog => (
            <article key={blog.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              {blog.image && (
                <div className="aspect-video bg-gray-50 overflow-hidden">
                  <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" loading="lazy" />
                </div>
              )}
              <div className="p-5">
                <h2 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2">
                  <Link href={`/blog/${blog.slug}`} className="hover:text-red-600 transition-colors">{blog.title}</Link>
                </h2>
                {blog.excerpt && <p className="text-gray-500 text-sm line-clamp-3 mb-4">{blog.excerpt}</p>}
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>{blog.author}</span>
                  <time>{new Date(blog.created_at).toLocaleDateString('en-PK', { year: 'numeric', month: 'short', day: 'numeric' })}</time>
                </div>
                <Link href={`/blog/${blog.slug}`} className="mt-4 inline-block text-red-600 hover:text-red-700 font-medium text-sm">Read More →</Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-gray-500"><p>No blog posts yet.</p></div>
      )}
    </div>
  );
}
