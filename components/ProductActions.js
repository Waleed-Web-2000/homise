'use client';
import { useState } from 'react';
import { ShoppingCart, Zap } from 'lucide-react';

export default function ProductActions({ product }) {
  const [added, setAdded] = useState(false);

  function handleBuyNow() {
    document.getElementById('order-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function handleAddToCart() {
    try {
      const cart = JSON.parse(localStorage.getItem('homise_cart') || '[]');
      const existing = cart.find(i => i.id === product._id);
      if (existing) {
        existing.quantity = Math.min(existing.quantity + 1, 10);
      } else {
        cart.push({
          id: product._id,
          name: product.name,
          price: product.price,
          image: product.images?.[0] || '',
          slug: product.slug,
          quantity: 1,
        });
      }
      localStorage.setItem('homise_cart', JSON.stringify(cart));
    } catch {}
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
    // Scroll to form so they can place order
    setTimeout(() => {
      document.getElementById('order-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 600);
  }

  return (
    <div className="flex gap-3">
      <button
        onClick={handleAddToCart}
        className="flex-1 flex items-center justify-center gap-2 border-2 border-red-600 text-red-600 font-semibold py-3 rounded-lg hover:bg-red-50 transition-colors text-sm"
      >
        <ShoppingCart size={18} />
        {added ? 'Added!' : 'Add to Cart'}
      </button>
      <button
        onClick={handleBuyNow}
        className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition-colors text-sm"
      >
        <Zap size={18} />
        Buy Now
      </button>
    </div>
  );
}
