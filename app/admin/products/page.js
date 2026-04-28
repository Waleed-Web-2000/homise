'use client';
import { useState, useEffect } from 'react';
import AdminLayout from '../../../components/AdminLayout';
import Link from 'next/link';
import { Plus, Edit, Trash2 } from 'lucide-react';

function getImageSrc(img) {
  if (!img) return '/placeholder-product.png';
  return img;
}

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchProducts(); }, []);

  function fetchProducts() {
    const token = localStorage.getItem('adminToken');
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(data => { setProducts(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }

  async function deleteProduct(id, name) {
    if (!confirm(`Delete "${name}"?`)) return;
    const token = localStorage.getItem('adminToken');
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    fetchProducts();
  }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Products</h1>
        <Link href="/admin/products/new" className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors min-h-[44px]">
          <Plus size={18} /> Add Product
        </Link>
      </div>

      {loading ? <p className="text-gray-500">Loading...</p> : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium">Image</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium">Name</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium">SKU</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium">Price</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium">Stock</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium">Status</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium">Featured</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p._id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="w-12 h-12 bg-gray-50 rounded-lg overflow-hidden">
                        <img src={getImageSrc(p.images?.[0])} alt={p.name} className="w-full h-full object-cover" />
                      </div>
                    </td>
                    <td className="px-4 py-3 max-w-xs">
                      <p className="font-medium text-gray-800 line-clamp-2">{p.name}</p>
                      <p className="text-gray-400 text-xs">{p.slug}</p>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-600">{p.sku || '-'}</td>
                    <td className="px-4 py-3 font-semibold text-red-600">Rs. {p.price?.toLocaleString()}</td>
                    <td className="px-4 py-3">{p.stock}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${p.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {p.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {p.featured ? <span className="text-yellow-500 text-lg">★</span> : <span className="text-gray-300 text-lg">☆</span>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Link href={`/admin/products/${p._id}/edit`} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center"><Edit size={16} /></Link>
                        <button onClick={() => deleteProduct(p._id, p.name)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr><td colSpan={8} className="px-4 py-8 text-center text-gray-400">No products yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
