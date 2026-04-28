'use client';
import { useState, useEffect } from 'react';
import AdminLayout from '../../../components/AdminLayout';
import { Plus, Edit, Trash2, X, Check } from 'lucide-react';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', slug: '' });
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { fetchCategories(); }, []);

  function slugify(str) {
    return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  function fetchCategories() {
    const token = localStorage.getItem('adminToken');
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(data => { setCategories(Array.isArray(data) ? data : []); setLoading(false); });
  }

  async function handleSave() {
    setError('');
    if (!form.name) return setError('Name is required');
    const token = localStorage.getItem('adminToken');
    const url = editId ? `${process.env.NEXT_PUBLIC_API_URL}/categories/${editId}` : `${process.env.NEXT_PUBLIC_API_URL}/categories`;
    const method = editId ? 'PUT' : 'POST';
    const fd = new FormData();
    fd.append('name', form.name);
    fd.append('slug', form.slug || slugify(form.name));

    const res = await fetch(url, { method, headers: { Authorization: `Bearer ${token}` }, body: fd });
    const data = await res.json();
    if (!res.ok) return setError(data.message || 'Failed');
    setShowForm(false);
    setEditId(null);
    setForm({ name: '', slug: '' });
    fetchCategories();
  }

  async function handleDelete(id, name) {
    if (!confirm(`Delete "${name}"?`)) return;
    const token = localStorage.getItem('adminToken');
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    fetchCategories();
  }

  function startEdit(cat) {
    setForm({ name: cat.name, slug: cat.slug });
    setEditId(cat._id);
    setShowForm(true);
    setError('');
  }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Categories</h1>
        <button onClick={() => { setShowForm(true); setEditId(null); setForm({ name: '', slug: '' }); setError(''); }} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors min-h-[44px]">
          <Plus size={18} /> Add Category
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-6">
          <h2 className="font-bold text-gray-800 mb-4">{editId ? 'Edit Category' : 'New Category'}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input type="text" value={form.name} onChange={e => setForm({ name: e.target.value, slug: slugify(e.target.value) })} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
              <input type="text" value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-500" />
            </div>
          </div>
          {error && <p className="text-red-600 text-sm mt-3">{error}</p>}
          <div className="flex gap-3 mt-4">
            <button onClick={handleSave} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-5 rounded-lg transition-colors min-h-[44px]"><Check size={16} /> Save</button>
            <button onClick={() => setShowForm(false)} className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-5 rounded-lg transition-colors min-h-[44px]"><X size={16} /> Cancel</button>
          </div>
        </div>
      )}

      {loading ? <p className="text-gray-500">Loading...</p> : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Name</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Slug</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map(cat => (
                <tr key={cat._id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">{cat.name}</td>
                  <td className="px-4 py-3 text-gray-500 font-mono text-xs">{cat.slug}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => startEdit(cat)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit size={16} /></button>
                      <button onClick={() => handleDelete(cat._id, cat.name)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr><td colSpan={3} className="px-4 py-8 text-center text-gray-400">No categories yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}
