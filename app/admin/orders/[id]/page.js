'use client';
import { useState, useEffect } from 'react';
import AdminLayout from '../../../../components/AdminLayout';
import { useRouter } from 'next/navigation';

const STATUS_COLORS = {
  Pending: 'bg-yellow-100 text-yellow-800',
  Processing: 'bg-blue-100 text-blue-800',
  Shipped: 'bg-purple-100 text-purple-800',
  Delivered: 'bg-green-100 text-green-800',
  Cancelled: 'bg-red-100 text-red-800'
};

const STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

function getImageSrc(img) {
  if (!img) return '/placeholder-product.png';
  return img;
}

export default function OrderDetailPage({ params }) {
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${params.id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(data => { setOrder(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [params.id]);

  async function updateStatus(status) {
    setUpdatingStatus(true);
    const token = localStorage.getItem('adminToken');
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${params.id}/status`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    const data = await res.json();
    if (res.ok) setOrder(data);
    setUpdatingStatus(false);
  }

  if (loading) return <AdminLayout><p className="text-gray-500">Loading...</p></AdminLayout>;
  if (!order || !order._id) return <AdminLayout><p className="text-gray-500">Order not found.</p></AdminLayout>;

  return (
    <AdminLayout>
      <div className="max-w-4xl">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => router.back()} className="text-gray-500 hover:text-gray-700 text-sm">← Back</button>
          <h1 className="text-2xl font-bold text-gray-800">Order #{String(order._id).slice(-8).toUpperCase()}</h1>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${STATUS_COLORS[order.status]}`}>{order.status}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Customer Info */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <h2 className="font-bold text-gray-800 mb-3">Customer Information</h2>
            <div className="space-y-2 text-sm">
              <p><span className="text-gray-500">Name:</span> <span className="font-medium">{order.fullName}</span></p>
              <p><span className="text-gray-500">Mobile:</span> <a href={`tel:${order.mobile}`} className="text-red-600 font-medium">{order.mobile}</a></p>
              <p><span className="text-gray-500">City:</span> <span className="font-medium">{order.city}</span></p>
              <p><span className="text-gray-500">Address:</span> <span className="font-medium">{order.address}</span></p>
              {order.notes && <p><span className="text-gray-500">Notes:</span> <span>{order.notes}</span></p>}
              <p><span className="text-gray-500">Payment:</span> <span className="font-medium">{order.paymentMethod}</span></p>
              <p><span className="text-gray-500">Date:</span> <span>{new Date(order.createdAt).toLocaleString()}</span></p>
            </div>
          </div>

          {/* Update Status */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <h2 className="font-bold text-gray-800 mb-3">Update Status</h2>
            <div className="grid grid-cols-1 gap-2">
              {STATUSES.map(s => (
                <button
                  key={s}
                  onClick={() => updateStatus(s)}
                  disabled={updatingStatus || order.status === s}
                  className={`text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors min-h-[44px] ${order.status === s ? STATUS_COLORS[s] + ' cursor-default' : 'bg-gray-50 hover:bg-gray-100 text-gray-700'}`}
                >
                  {order.status === s ? `✓ ${s} (current)` : s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="p-5 border-b">
            <h2 className="font-bold text-gray-800">Order Items</h2>
          </div>
          <div className="divide-y">
            {order.items?.map((item, i) => (
              <div key={i} className="flex gap-4 p-5">
                <div className="w-16 h-16 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                  <img src={getImageSrc(item.image)} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{item.name}</p>
                  <p className="text-gray-500 text-sm mt-1">Rs. {item.price?.toLocaleString()} × {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-800">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="p-5 bg-gray-50 space-y-2 text-sm border-t">
            <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>Rs. {order.subtotal?.toLocaleString()}</span></div>
            <div className="flex justify-between text-gray-600"><span>Shipping</span><span>Rs. {order.shippingFee}</span></div>
            <div className="flex justify-between font-bold text-gray-800 text-base pt-2 border-t">
              <span>Total</span>
              <span className="text-red-600">Rs. {order.total?.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
