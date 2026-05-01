'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

function normalizePhone(val) {
  const digits = val.replace(/\D/g, '');
  if (digits.startsWith('92') && digits.length === 12) return '0' + digits.slice(2);
  return digits;
}

function validatePhone(val) {
  const normalized = normalizePhone(val);
  return /^03[0-9]{9}$/.test(normalized);
}

const inputCls = 'w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition';
const labelCls = 'block text-sm font-medium text-gray-700 mb-1';

export default function OrderForm({ product }) {
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: '', mobile: '', city: '', address: '', landmark: '', quantity: 1, notes: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const subtotal = product.price * form.quantity;
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
        items: [{
          product: product._id,
          name: product.name,
          price: product.price,
          quantity: Number(form.quantity),
          image: product.images?.[0] || ''
        }],
        subtotal,
        shippingFee,
        total
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Order failed');

      // Redirect to success page with GA tracking params
      const params = new URLSearchParams({
        orderId: data.orderId || '',
        name: form.fullName.trim(),
        mobile: normalizedPhone,
        total: String(total),
        product: product.name,
        price: String(product.price),
        qty: String(form.quantity),
      });
      router.push(`/order-success?${params.toString()}`);

    } catch (err) {
      setServerError(err.message || 'Kuch masla aaya. Dobara try karein.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden" id="order-form">

      {/* Header */}
      <div className="bg-red-600 px-5 py-3.5">
        <h3 className="text-white font-bold text-base">Order Now — Cash on Delivery</h3>
      </div>

      <form onSubmit={handleSubmit} className="p-5 space-y-4">

        {/* Row 1: Name | Phone */}
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

        {/* Row 2: City | Address */}
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

        {/* Nearby Landmark */}
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

        {/* Quantity */}
        <div>
          <label className={labelCls}>Quantity</label>
          <div className="flex items-center gap-3">
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
              <button
                type="button"
                onClick={() => setForm({ ...form, quantity: Math.max(1, form.quantity - 1) })}
                className="px-3 py-2 hover:bg-gray-100 font-bold text-gray-700 transition-colors"
              >−</button>
              <span className="px-4 py-2 text-sm font-semibold border-x border-gray-300 min-w-[3rem] text-center">
                {form.quantity}
              </span>
              <button
                type="button"
                onClick={() => setForm({ ...form, quantity: Math.min(10, form.quantity + 1) })}
                className="px-3 py-2 hover:bg-gray-100 font-bold text-gray-700 transition-colors"
              >+</button>
            </div>
            <span className="text-sm text-gray-500">
              Total: <span className="font-bold text-gray-800">Rs. {subtotal.toLocaleString()}</span>
            </span>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-2 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal ({form.quantity}x)</span>
            <span>Rs. {subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Shipping (Flat Rate)</span>
            <span>Rs. {shippingFee.toLocaleString()}</span>
          </div>
          <div className="flex justify-between font-bold text-gray-800 text-base border-t border-gray-200 pt-2 mt-1">
            <span>Total (COD)</span>
            <span className="text-red-600">Rs. {total.toLocaleString()}</span>
          </div>
        </div>

        {/* Trust row */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
          <span>🔒 Secure</span>
          <span>💵 Cash on Delivery</span>
          <span>🚚 3–5 Days</span>
          <span>🔁 7 Day Return</span>
        </div>

        {serverError && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
            {serverError}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-bold py-3.5 rounded-lg transition-colors flex items-center justify-center gap-2 text-base"
        >
          {loading ? (
            <><Loader2 size={18} className="animate-spin" /> Placing Order...</>
          ) : (
            'Place Order – Cash on Delivery'
          )}
        </button>
      </form>
    </div>
  );
}
