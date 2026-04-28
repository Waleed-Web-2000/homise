'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Star } from 'lucide-react';
import { API_URL } from '../lib/api';

function getImageSrc(img) {
  if (!img) return '/placeholder-product.png';
  return img;
}

function StarRating({ value = 0, count = 0 }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          size={14}
          className={i <= Math.round(value) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 fill-gray-300'}
        />
      ))}
      <span className="text-xs text-gray-500 ml-1">({count})</span>
    </div>
  );
}

export default function ProductCard({ product }) {
  const imgSrc = getImageSrc(product.images?.[0]);

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
      <Link href={`/product/${product.slug}`}>
        <div className="relative aspect-square bg-gray-50 overflow-hidden">
          <img
            src={imgSrc}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            onError={(e) => { e.target.src = '/placeholder-product.png'; }}
          />
          {product.inStock ? (
            <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">In Stock</span>
          ) : (
            <span className="absolute top-2 left-2 bg-gray-500 text-white text-xs px-2 py-1 rounded-full font-medium">Out of Stock</span>
          )}
        </div>
      </Link>
      <div className="p-4">
        <Link href={`/product/${product.slug}`}>
          <h3 className="text-gray-800 font-medium text-sm line-clamp-2 hover:text-red-600 transition-colors min-h-[2.5rem]">
            {product.name}
          </h3>
        </Link>
        <div className="mt-2">
          <StarRating value={product.ratings?.average} count={product.ratings?.count} />
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-gray-400 line-through text-sm">Rs. {product.originalPrice.toLocaleString()}</span>
          )}
          <span className="text-red-600 font-bold text-lg">Rs. {product.price.toLocaleString()}</span>
        </div>
        <Link
          href={`/product/${product.slug}`}
          className="mt-3 block w-full text-center bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm min-h-[44px] flex items-center justify-center"
        >
          View Now
        </Link>
      </div>
    </div>
  );
}
