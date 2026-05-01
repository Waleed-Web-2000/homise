'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Zap } from 'lucide-react';

function addToCart(product, qty = 1) {
  try {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existing = cart.find(i => i.id === product._id);
    if (existing) {
      existing.quantity = Math.min(existing.quantity + qty, 10);
    } else {
      cart.push({
        id: product._id,
        name: product.name,
        price: product.price,
        image: product.images?.[0] || '',
        slug: product.slug,
        quantity: qty,
      });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
    return true;
  } catch {
    return false;
  }
}

export default function ProductActions({ product }) {
  const router = useRouter();
  const [added, setAdded] = useState(false);

  function handleAddToCart() {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  function handleBuyNow() {
    addToCart(product);
    router.push('/checkout');
  }

  return (
    <div className="flex gap-3">
      <button
        onClick={handleAddToCart}
        className="flex-1 flex items-center justify-center gap-2 border-2 border-red-600 text-red-600 font-semibold py-3 rounded-lg hover:bg-red-50 transition-colors text-sm"
      >
        <ShoppingCart size={18} />
        {added ? '✓ Added to Cart' : 'Add to Cart'}
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
