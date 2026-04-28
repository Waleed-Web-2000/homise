'use client';
import { useState } from 'react';

export default function OrderForm({ product }) {
  const [form, setForm] = useState({ fullName: '', mobile: '', city: '', address: '', quantity: 1, notes: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState('');

  const subtotal = product.price * form.quantity;
  const total = subtotal + 199;

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const body = {
        fullName: form.fullName.trim(),
        mobile: form.mobile.trim(),
        city: form.city.trim(),
        address: form.address.trim(),
        notes: form.notes,
        items: [{
          product: product._id,
          name: product.name,
          price: product.price,
          quantity: Number(form.quantity),
          image: product.images?.[0] || ''
        }],
        subtotal,
        shippingFee: 199,
        total
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Order failed');
      setSuccess(data);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
        <div className="text-4xl mb-3">✅</div>
        <h3 className="text-green-800 font-bold text-xl mb-2">Order Placed Successfully!</h3>
        <p className="text-green-700 mb-1">Order ID: <strong>{String(success.orderId).slice(-8).toUpperCase()}</strong></p>
        <p className="text-green-600 text-sm">We will contact you at <strong>{form.mobile}</strong> to confirm your order.</p>
        <p className="text-green-600 text-sm mt-1">Expected delivery: 3–5 business days</p>
        <button
          onClick={() => { setSuccess(null); setForm({ fullName: '', mobile: '', city: '', address: '', quantity: 1, notes: '' }); }}
          className="mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
        >
          Place Another Order
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 border border-gray-200 rounded-xl p-6 space-y-4">
      <h3 className="font-bold text-lg text-gray-800">Order Now — Cash on Delivery</h3>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name <span className="text-red-500">*</span></label>
        <input
          type="text"
          required
          value={form.fullName}
          onChange={e => setForm({ ...form, fullName: e.target.value })}
          placeholder="Enter your full name"
          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number <span className="text-red-500">*</span></label>
        <input
          type="tel"
          required
          value={form.mobile}
          onChange={e => setForm({ ...form, mobile: e.target.value })}
          placeholder="03XXXXXXXXX"
          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">City <span className="text-red-500">*</span></label>
        <input
          type="text"
          required
          value={form.city}
          onChange={e => setForm({ ...form, city: e.target.value })}
          placeholder="e.g. Karachi, Lahore, Islamabad"
          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Complete Address <span className="text-red-500">*</span></label>
        <textarea
          required
          rows={3}
          value={form.address}
          onChange={e => setForm({ ...form, address: e.target.value })}
          placeholder="House/Flat no., Street, Area, City"
          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
        <input
          type="number"
          min={1}
          max={10}
          value={form.quantity}
          onChange={e => setForm({ ...form, quantity: Math.max(1, parseInt(e.target.value) || 1) })}
          className="w-24 border border-gray-300 rounded-lg px-3 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
        />
      </div>

      {/* Order Summary */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-2 text-sm">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal ({form.quantity}x)</span>
          <span>Rs. {subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>🚚 Shipping (Flat Rate)</span>
          <span>Rs. 199</span>
        </div>
        <div className="flex justify-between font-bold text-gray-800 text-base border-t pt-2 mt-2">
          <span>Total</span>
          <span className="text-red-600">Rs. {total.toLocaleString()}</span>
        </div>
      </div>

      {/* Trust row */}
      <div className="flex flex-wrap gap-3 text-xs text-gray-600">
        <span>🔒 Secure</span>
        <span>💵 Cash on Delivery</span>
        <span>🚚 3–5 Days</span>
        <span>🔁 7 Day Return</span>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">{error}</div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-bold py-3.5 px-6 rounded-lg transition-colors text-lg min-h-[52px]"
      >
        {loading ? 'Placing Order...' : 'Place Order – Cash on Delivery'}
      </button>
    </form>
  );
}
