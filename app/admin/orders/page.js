'use client';
import { useState, useEffect } from 'react';
import AdminLayout from '../../../components/AdminLayout';
import Link from 'next/link';

const STATUS_COLORS = {
  Pending: 'bg-yellow-100 text-yellow-800',
  Processing: 'bg-blue-100 text-blue-800',
  Shipped: 'bg-purple-100 text-purple-800',
  Delivered: 'bg-green-100 text-green-800',
  Cancelled: 'bg-red-100 text-red-800'
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(data => { setOrders(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Orders</h1>

      {loading ? <p className="text-gray-500">Loading...</p> : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium">Order ID</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium">Customer</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium">City</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium">Items</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium">Total</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium">Status</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium">Date</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order._id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs">{String(order._id).slice(-8).toUpperCase()}</td>
                    <td className="px-4 py-3 font-medium">{order.fullName}</td>
                    <td className="px-4 py-3 text-gray-600">{order.city}</td>
                    <td className="px-4 py-3 text-gray-600">{order.items?.length} item(s)</td>
                    <td className="px-4 py-3 font-semibold text-red-600">Rs. {order.total?.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[order.status]}`}>{order.status}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <Link href={`/admin/orders/${order._id}`} className="text-blue-600 hover:text-blue-700 font-medium text-xs">View</Link>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr><td colSpan={8} className="px-4 py-8 text-center text-gray-400">No orders yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
