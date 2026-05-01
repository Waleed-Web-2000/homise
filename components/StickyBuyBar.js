'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Zap } from 'lucide-react';

function addToCart(product) {
  try {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
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
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
  } catch {}
}

export default function StickyBuyBar({ product }) {
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [added, setAdded] = useState(false);
  const sentinelRef = useRef(null);

  useEffect(() => {
    const sentinel = document.getElementById('product-actions-sentinel');
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

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
    <div
      className={`lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 px-4 py-3 transition-transform duration-300 ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="flex gap-3 max-w-lg mx-auto">
        <button
          onClick={handleAddToCart}
          className="flex-1 flex items-center justify-center gap-2 border-2 border-red-600 text-red-600 font-semibold py-3 rounded-lg hover:bg-red-50 transition-colors text-sm"
        >
          <ShoppingCart size={17} />
          {added ? '✓ Added' : 'Add to Cart'}
        </button>
        <button
          onClick={handleBuyNow}
          className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition-colors text-sm"
        >
          <Zap size={17} />
          Buy Now
        </button>
      </div>
    </div>
  );
}
