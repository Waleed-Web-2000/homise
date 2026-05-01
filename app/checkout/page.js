'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, ShoppingBag } from 'lucide-react';

function normalizePhone(val) {
  const digits = val.replace(/\D/g, '');
  if (digits.startsWith('92') && digits.length === 12) return '0' + digits.slice(2);
  return digits;
}

function validatePhone(val) {
  return /^03[0-9]{9}$/.test(normalizePhone(val));
}

const inputCls = 'w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition';
const labelCls = 'block text-sm font-medium text-gray-700 mb-1';

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [mounted, setMounted] = useState(false);
  const [form, setForm] = useState({ fullName: '', mobile: '', city: '', address: '', landmark: '', notes: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    setMounted(true);
    try {
      const stored = JSON.parse(localStorage.getItem('cart') || '[]');
      setCart(stored);
    } catch { setCart([]); }
  }, []);

  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const shippingFee = 199;
  const total = subtotal + shippingFee;

  function validate() {
    const e = {};
    if (!form.fullName.trim() || form.fullName.trim().length < 2) e.fullName = 'Name zaroor likhein';
    if (!validatePhone(form.mobile)) e.mobile = 'Sahih number: 03XXXXXXXXXX';
    if (!form.city.trim() || form.city.trim().length < 2) e.city = 'Sheher zaroor likhein';
    if (!form.address.trim() || form.address.trim().length < 5) e.address = 'Address zaroor likhein';
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setServerError('');
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);

    try {
      const normalizedPhone = normalizePhone(form.mobile);
      const body = {
        fullName: form.fullName.trim(),
        mobile: normalizedPhone,
        city: form.city.trim(),
        address: form.address.trim() + (form.landmark.trim() ? `, Landmark: ${form.landmark.trim()}` : ''),
        notes: form.notes,
        items: cart.map(i => ({
          product: i.id,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
          image: i.image || '',
        })),
        subtotal,
        shippingFee,
        total,
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Order failed');

      // Clear cart
      localStorage.setItem('cart', '[]');
      window.dispatchEvent(new Event('cartUpdated'));

      const firstItem = cart[0] || {};
      const params = new URLSearchParams({
        orderId: data.orderId || '',
        name: form.fullName.trim(),
        mobile: normalizedPhone,
        total: String(total),
        product: firstItem.name || '',
        price: String(firstItem.price || 0),
        qty: String(firstItem.quantity || 1),
      });
      router.push(`/order-success?${params.toString()}`);
    } catch (err) {
      setServerError(err.message || 'Kuch masla aaya. Dobara try karein.');
    } finally {
      setLoading(false);
    }
  }

  if (!mounted) return null;

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <ShoppingBag size={56} className="text-gray-300 mb-4" />
        <h2 className="text-xl font-bold text-gray-700 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 text-sm mb-6">Pehle koi product cart mein add karein.</p>
        <Link href="/shop" className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg transition-colors">
          Shop Now
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

        {/* LEFT — Address Form */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-red-600 px-5 py-3.5">
              <h2 className="text-white font-bold text-base">Delivery Information</h2>
            </div>

            <form id="checkout-form" onSubmit={handleSubmit} className="p-5 space-y-4">

              {/* Name | Phone */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Full Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={form.fullName}
                    onChange={e => setForm({ ...form, fullName: e.target.value })}
                    placeholder="Enter your full name"
                    className={inputCls}
                  />
                  {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                </div>
                <div>
                  <label className={labelCls}>Mobile Number <span className="text-red-500">*</span></label>
                  <input
                    type="tel"
                    value={form.mobile}
                    onChange={e => setForm({ ...form, mobile: e.target.value })}
                    placeholder="03001234567"
                    maxLength={11}
                    inputMode="numeric"
                    className={inputCls}
                  />
                  {errors.mobile && <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>}
                </div>
              </div>

              {/* City | Address */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>City <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={form.city}
                    onChange={e => setForm({ ...form, city: e.target.value })}
                    placeholder="Enter your city"
                    className={inputCls}
                  />
                  {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                </div>
                <div>
                  <label className={labelCls}>Address <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={form.address}
                    onChange={e => setForm({ ...form, address: e.target.value })}
                    placeholder="House no., street, area"
                    className={inputCls}
                  />
                  {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                </div>
              </div>

              {/* Landmark */}
              <div>
                <label className={labelCls}>
                  Nearby Landmark <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={form.landmark}
                  onChange={e => setForm({ ...form, landmark: e.target.value })}
                  placeholder="Any easily identifiable landmark"
                  className={inputCls}
                />
              </div>

              {/* Notes */}
              <div>
                <label className={labelCls}>
                  Order Notes <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <textarea
                  rows={3}
                  value={form.notes}
                  onChange={e => setForm({ ...form, notes: e.target.value })}
                  placeholder="Any special instructions..."
                  className={inputCls + ' resize-none'}
                />
              </div>

              {serverError && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
                  {serverError}
                </div>
              )}

              {/* Desktop submit */}
              <button
                type="submit"
                disabled={loading}
                className="hidden sm:flex w-full bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-bold py-3.5 rounded-lg transition-colors items-center justify-center gap-2 text-base"
              >
                {loading ? (
                  <><Loader2 size={18} className="animate-spin" /> Placing Order...</>
                ) : (
                  `Place Order – Rs. ${total.toLocaleString()} (Cash on Delivery)`
                )}
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT — Order Summary */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden sticky top-24">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-800">Order Summary</h2>
              <Link href="/cart" className="text-xs text-red-600 hover:underline">Edit Cart</Link>
            </div>

            <div className="p-5 space-y-3">
              {cart.map((item, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <div className="w-14 h-14 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
                    <img
                      src={item.image || '/placeholder-product.png'}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={e => { e.target.src = '/placeholder-product.png'; }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 line-clamp-2">{item.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-bold text-gray-800 flex-shrink-0">
                    Rs. {(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            <div className="px-5 pb-5 space-y-2 text-sm border-t border-gray-100 pt-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>Rs. {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping (Flat Rate)</span>
                <span>Rs. {shippingFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold text-gray-800 text-base border-t border-gray-200 pt-2">
                <span>Total (COD)</span>
                <span className="text-red-600">Rs. {total.toLocaleString()}</span>
              </div>
            </div>

            {/* Trust */}
            <div className="px-5 pb-5 flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500">
              <span>🔒 Secure</span>
              <span>💵 Cash on Delivery</span>
              <span>🚚 3–5 Days</span>
              <span>🔁 7 Day Return</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sticky submit */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-30">
        <button
          form="checkout-form"
          type="submit"
          disabled={loading}
          onClick={handleSubmit}
          className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-bold py-3.5 rounded-lg transition-colors flex items-center justify-center gap-2 text-base"
        >
          {loading ? (
            <><Loader2 size={18} className="animate-spin" /> Placing Order...</>
          ) : (
            `Place Order – Rs. ${total.toLocaleString()}`
          )}
        </button>
      </div>

      {/* Bottom padding for mobile sticky bar */}
      <div className="sm:hidden h-20" />
    </div>
  );
}
