'use client';
import { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

function OrderSuccessContent() {
  const params = useSearchParams();
  const orderId = params.get('orderId') || '';
  const name = params.get('name') || '';
  const mobile = params.get('mobile') || '';
  const total = params.get('total') || '';
  const productName = params.get('product') || '';
  const price = params.get('price') || '';
  const qty = params.get('qty') || '1';

  useEffect(() => {
    // Fire GA purchase event
    if (typeof window !== 'undefined' && window.gtag && orderId) {
      window.gtag('event', 'purchase', {
        transaction_id: orderId,
        currency: 'PKR',
        value: Number(total) || 0,
        shipping: 199,
        items: productName ? [{
          item_id: orderId,
          item_name: productName,
          price: Number(price) || 0,
          quantity: Number(qty) || 1,
        }] : [],
      });
    }
  }, [orderId]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">

        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <CheckCircle size={44} className="text-green-600" />
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-2">Order Placed!</h1>
        <p className="text-gray-500 text-sm mb-6">
          Shukriya {name || 'aapka'}! Aapka order receive ho gaya hai.
        </p>

        {orderId && (
          <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4 mb-6">
            <p className="text-xs text-gray-500 mb-1">Order ID</p>
            <p className="text-xl font-bold text-gray-900 tracking-wide">
              #{String(orderId).slice(-8).toUpperCase()}
            </p>
          </div>
        )}

        <div className="bg-gray-50 rounded-xl p-4 text-sm text-left space-y-2 mb-6">
          {mobile && (
            <div className="flex justify-between">
              <span className="text-gray-500">Contact</span>
              <span className="font-medium text-gray-800">{mobile}</span>
            </div>
          )}
          {total && (
            <div className="flex justify-between">
              <span className="text-gray-500">Total (COD)</span>
              <span className="font-bold text-red-600">Rs. {Number(total).toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-gray-500">Delivery</span>
            <span className="font-medium text-gray-800">3–5 working days</span>
          </div>
        </div>

        <p className="text-xs text-gray-400 mb-6">
          Aapke number <strong>{mobile}</strong> par call aayegi order confirm karne ke liye.
        </p>

        <div className="flex flex-col gap-3">
          <Link
            href="/shop"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-colors"
          >
            Continue Shopping
          </Link>
          <Link
            href="/"
            className="w-full border border-gray-300 text-gray-600 font-medium py-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin" /></div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}
