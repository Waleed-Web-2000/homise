'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Trash2, Plus, Minus } from 'lucide-react';

function getImageSrc(img) {
  if (!img) return '/placeholder-product.png';
  return img;
}

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      setCart(JSON.parse(localStorage.getItem('cart') || '[]'));
    } catch { setCart([]); }
  }, []);

  function saveCart(newCart) {
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    window.dispatchEvent(new Event('cartUpdated'));
  }

  function updateQty(index, delta) {
    const updated = cart.map((item, i) => i === index ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item);
    saveCart(updated);
  }

  function removeItem(index) {
    saveCart(cart.filter((_, i) => i !== index));
  }

  if (!mounted) return null;

  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = 199;
  const total = subtotal + shipping;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Shopping Cart</h1>

      {cart.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg mb-6">Your cart is empty.</p>
          <Link href="/shop" className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg transition-colors min-h-[48px] flex items-center w-fit mx-auto">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item, i) => (
              <div key={i} className="flex gap-4 bg-white border border-gray-200 rounded-xl p-4">
                <div className="w-20 h-20 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                  <img src={getImageSrc(item.image)} alt={item.name} className="w-full h-full object-cover" onError={e => { e.target.src = '/placeholder-product.png'; }} />
                </div>
                <div className="flex-1 min-w-0">
                  <Link href={`/product/${item.slug}`} className="font-medium text-gray-800 text-sm hover:text-red-600 line-clamp-2">{item.name}</Link>
                  <p className="text-red-600 font-bold mt-1">Rs. {item.price.toLocaleString()}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <button onClick={() => updateQty(i, -1)} className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"><Minus size={14} /></button>
                    <span className="font-semibold w-6 text-center">{item.quantity}</span>
                    <button onClick={() => updateQty(i, 1)} className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"><Plus size={14} /></button>
                    <button onClick={() => removeItem(i)} className="ml-auto text-red-500 hover:text-red-700 transition-colors p-1"><Trash2 size={16} /></button>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-gray-800">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 sticky top-24">
              <h2 className="font-bold text-lg text-gray-800 mb-4">Order Summary</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>Rs. {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>🚚 Shipping (Flat Rate)</span>
                  <span>Rs. {shipping}</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-bold text-gray-800 text-base">
                  <span>Grand Total</span>
                  <span className="text-red-600">Rs. {total.toLocaleString()}</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-3 mb-4">Shipping: Rs. 199 flat rate. Delivery in 3–5 business days.</p>
              <Link href="/checkout" className="block w-full text-center bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-colors min-h-[48px] flex items-center justify-center">
                Proceed to Checkout
              </Link>
              <Link href="/shop" className="block w-full text-center text-gray-600 text-sm mt-3 hover:underline">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
