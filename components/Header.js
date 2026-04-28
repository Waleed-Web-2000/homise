'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingCart, Menu, X, ChevronDown } from 'lucide-react';

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collectionsOpen, setCollectionsOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    function updateCart() {
      try {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        setCartCount(cart.reduce((s, i) => s + i.quantity, 0));
      } catch {}
    }
    updateCart();
    window.addEventListener('cartUpdated', updateCart);
    return () => window.removeEventListener('cartUpdated', updateCart);
  }, []);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <span className="text-2xl font-bold text-red-600">Homise</span>
            <span className="text-2xl font-bold text-gray-800">PK</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-gray-700 hover:text-red-600 font-medium transition-colors">Home</Link>
            <Link href="/shop" className="text-gray-700 hover:text-red-600 font-medium transition-colors">Shop</Link>
            <div className="relative">
              <button
                className="flex items-center gap-1 text-gray-700 hover:text-red-600 font-medium transition-colors"
                onClick={() => setCollectionsOpen(!collectionsOpen)}
              >
                Collections <ChevronDown size={16} />
              </button>
              {collectionsOpen && (
                <div className="absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-lg py-1 min-w-[160px] z-50">
                  <Link href="/collection/best-items" className="block px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600" onClick={() => setCollectionsOpen(false)}>
                    Best Items
                  </Link>
                </div>
              )}
            </div>
            <Link href="/about" className="text-gray-700 hover:text-red-600 font-medium transition-colors">About</Link>
            <Link href="/contact" className="text-gray-700 hover:text-red-600 font-medium transition-colors">Contact</Link>
          </nav>

          {/* Cart + Mobile Menu */}
          <div className="flex items-center gap-4">
            <Link href="/cart" className="relative p-2 text-gray-700 hover:text-red-600 transition-colors" aria-label="Shopping cart">
              <ShoppingCart size={24} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>
            <button
              className="md:hidden p-2 text-gray-700"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t shadow-lg">
          <div className="px-4 py-3 space-y-3">
            <Link href="/" className="block py-2 text-gray-700 hover:text-red-600 font-medium" onClick={() => setMobileOpen(false)}>Home</Link>
            <Link href="/shop" className="block py-2 text-gray-700 hover:text-red-600 font-medium" onClick={() => setMobileOpen(false)}>Shop</Link>
            <Link href="/collection/best-items" className="block py-2 text-gray-700 hover:text-red-600 font-medium pl-4" onClick={() => setMobileOpen(false)}>Best Items</Link>
            <Link href="/about" className="block py-2 text-gray-700 hover:text-red-600 font-medium" onClick={() => setMobileOpen(false)}>About</Link>
            <Link href="/contact" className="block py-2 text-gray-700 hover:text-red-600 font-medium" onClick={() => setMobileOpen(false)}>Contact</Link>
            <Link href="/cart" className="block py-2 text-gray-700 hover:text-red-600 font-medium" onClick={() => setMobileOpen(false)}>Cart ({cartCount})</Link>
          </div>
        </div>
      )}
    </header>
  );
}
