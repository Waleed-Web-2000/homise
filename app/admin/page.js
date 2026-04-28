'use client';
import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import Link from 'next/link';

const STATUS_COLORS = {
  Pending: 'bg-yellow-100 text-yellow-800',
  Processing: 'bg-blue-100 text-blue-800',
  Shipped: 'bg-purple-100 text-purple-800',
  Delivered: 'bg-green-100 text-green-800',
  Cancelled: 'bg-red-100 text-red-800'
};

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/stats`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => { setStats(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold text-gray-800 mb-8">Dashboard</h1>

      {loading ? (
        <div className="text-gray-500">Loading stats...</div>
      ) : stats ? (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Orders', value: stats.totalOrders, color: 'bg-blue-500' },
              { label: 'Total Revenue', value: `Rs. ${(stats.totalRevenue || 0).toLocaleString()}`, color: 'bg-green-500' },
              { label: 'Total Products', value: stats.totalProducts, color: 'bg-purple-500' },
              { label: 'Total Blogs', value: stats.totalBlogs, color: 'bg-orange-500' }
            ].map(s => (
              <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                <div className={`inline-block w-2 h-8 rounded ${s.color} mb-3`} />
                <p className="text-gray-500 text-sm">{s.label}</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{s.value}</p>
              </div>
            ))}
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="font-bold text-gray-800">Recent Orders</h2>
              <Link href="/admin/orders" className="text-red-600 hover:text-red-700 text-sm font-medium">View All</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-4 py-3 text-gray-600 font-medium">Order ID</th>
                    <th className="text-left px-4 py-3 text-gray-600 font-medium">Customer</th>
                    <th className="text-left px-4 py-3 text-gray-600 font-medium">Total</th>
                    <th className="text-left px-4 py-3 text-gray-600 font-medium">Status</th>
                    <th className="text-left px-4 py-3 text-gray-600 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {(stats.recentOrders || []).map(order => (
                    <tr key={order._id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono text-xs">{String(order._id).slice(-8).toUpperCase()}</td>
                      <td className="px-4 py-3">{order.fullName}</td>
                      <td className="px-4 py-3 font-semibold">Rs. {order.total?.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[order.status]}`}>{order.status}</span>
                      </td>
                      <td className="px-4 py-3 text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                  {(!stats.recentOrders || stats.recentOrders.length === 0) && (
                    <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">No orders yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <p className="text-gray-500">Could not load stats. Make sure the backend is running.</p>
      )}
    </AdminLayout>
  );
}
