'use client';
import { useState, useEffect } from 'react';
import AdminLayout from '../../../components/AdminLayout';
import { Plus, Edit, Trash2, X, Check } from 'lucide-react';

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

const EMPTY_FORM = { title: '', slug: '', excerpt: '', content: '', published: false, metaTitle: '', metaDescription: '' };

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { fetchBlogs(); }, []);

  function fetchBlogs() {
    const token = localStorage.getItem('adminToken');
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/blogs/admin/all`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(data => { setBlogs(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }

  async function handleSave() {
    setError('');
    if (!form.title || !form.content) return setError('Title and content are required');
    setSaving(true);
    const token = localStorage.getItem('adminToken');
    const url = editId ? `${process.env.NEXT_PUBLIC_API_URL}/blogs/${editId}` : `${process.env.NEXT_PUBLIC_API_URL}/blogs`;
    const method = editId ? 'PUT' : 'POST';
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (imageFile) fd.append('image', imageFile);

    const res = await fetch(url, { method, headers: { Authorization: `Bearer ${token}` }, body: fd });
    const data = await res.json();
    if (!res.ok) return setError(data.message || 'Failed');
    setShowForm(false);
    setEditId(null);
    setForm(EMPTY_FORM);
    setImageFile(null);
    fetchBlogs();
    setSaving(false);
  }

  async function handleDelete(id, title) {
    if (!confirm(`Delete "${title}"?`)) return;
    const token = localStorage.getItem('adminToken');
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blogs/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    fetchBlogs();
  }

  function startEdit(blog) {
    setForm({ title: blog.title, slug: blog.slug, excerpt: blog.excerpt || '', content: blog.content, published: blog.published, metaTitle: blog.metaTitle || '', metaDescription: blog.metaDescription || '' });
    setEditId(blog._id);
    setShowForm(true);
    setError('');
  }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Blogs</h1>
        <button onClick={() => { setShowForm(true); setEditId(null); setForm(EMPTY_FORM); setError(''); }} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors min-h-[44px]">
          <Plus size={18} /> Add Blog
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-6">
          <h2 className="font-bold text-gray-800 mb-4">{editId ? 'Edit Blog Post' : 'New Blog Post'}</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value, slug: slugify(e.target.value) })} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                <input type="text" value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-500" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
              <input type="text" value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Content *</label>
              <textarea rows={8} value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title</label>
                <input type="text" value={form.metaTitle} onChange={e => setForm({ ...form, metaTitle: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} className="w-full border border-gray-300 rounded-lg px-3 py-2.5" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
              <textarea rows={2} value={form.metaDescription} onChange={e => setForm({ ...form, metaDescription: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none" />
            </div>
            <label className="flex items-center gap-2 cursor-pointer min-h-[44px]">
              <input type="checkbox" checked={form.published} onChange={e => setForm({ ...form, published: e.target.checked })} className="w-4 h-4" />
              <span className="text-sm font-medium text-gray-700">Published</span>
            </label>
          </div>
          {error && <p className="text-red-600 text-sm mt-3">{error}</p>}
          <div className="flex gap-3 mt-4">
            <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-semibold py-2 px-5 rounded-lg transition-colors min-h-[44px]"><Check size={16} /> {saving ? 'Saving...' : 'Save'}</button>
            <button onClick={() => setShowForm(false)} className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-5 rounded-lg transition-colors min-h-[44px]"><X size={16} /> Cancel</button>
          </div>
        </div>
      )}

      {loading ? <p className="text-gray-500">Loading...</p> : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Title</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Published</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Date</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map(blog => (
                <tr key={blog._id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">{blog.title}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${blog.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                      {blog.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{new Date(blog.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => startEdit(blog)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit size={16} /></button>
                      <button onClick={() => handleDelete(blog._id, blog.title)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {blogs.length === 0 && (
                <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-400">No blog posts yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}
