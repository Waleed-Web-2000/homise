import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getBlogBySlug } from '../../../lib/db';
import Breadcrumb from '../../../components/Breadcrumb';

export async function generateMetadata({ params }) {
  try {
    const blog = await getBlogBySlug(params.slug);
    return {
      title: blog.meta_title || `${blog.title} - Homisepk`,
      description: blog.meta_description || blog.excerpt || blog.title
    };
  } catch {
    return { title: 'Blog - Homisepk' };
  }
}

export default async function BlogPostPage({ params }) {
  let blog;
  try { blog = await getBlogBySlug(params.slug); }
  catch { notFound(); }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-6">
        <Breadcrumb items={[{ name: 'Home', href: '/' }, { name: 'Blog', href: '/blog' }, { name: blog.title }]} />
      </div>
      <article>
        {blog.image && (
          <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden mb-8">
            <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" />
          </div>
        )}
        <h1 className="text-3xl font-bold text-gray-800 mb-4">{blog.title}</h1>
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-8 pb-6 border-b">
          <span>By {blog.author}</span>
          <time>{new Date(blog.created_at).toLocaleDateString('en-PK', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
        </div>
        <div className="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-line">{blog.content}</div>
      </article>
      <div className="mt-12 pt-6 border-t">
        <Link href="/blog" className="text-red-600 hover:text-red-700 font-medium">← Back to Blog</Link>
      </div>
    </div>
  );
}
