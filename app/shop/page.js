export const dynamic = 'force-dynamic';
import ProductCard from '../../components/ProductCard';
import { getProducts, getCategories } from '../../lib/db';
import Link from 'next/link';

export const metadata = {
  title: 'Shop All Products - Homisepk',
  description: 'Browse all products at Homisepk. Best prices, Cash on Delivery, 7-day returns.'
};

export default async function ShopPage({ searchParams }) {
  let products = [];
  let categories = [];

  try {
    const params = {};
    if (searchParams.category) params.categorySlug = searchParams.category;
    [products, categories] = await Promise.all([getProducts(params), getCategories()]);
  } catch {}

  const activeCategory = searchParams.category || '';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">All Products</h1>

      <div className="flex flex-wrap gap-3 mb-8">
        <Link href="/shop" className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors min-h-[44px] flex items-center ${!activeCategory ? 'bg-red-600 text-white border-red-600' : 'bg-white text-gray-700 border-gray-300 hover:border-red-600 hover:text-red-600'}`}>
          All
        </Link>
        {categories.map(cat => (
          <Link key={cat.id} href={`/shop?category=${cat.slug}`} className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors min-h-[44px] flex items-center ${activeCategory === cat.slug ? 'bg-red-600 text-white border-red-600' : 'bg-white text-gray-700 border-gray-300 hover:border-red-600 hover:text-red-600'}`}>
            {cat.name}
          </Link>
        ))}
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      ) : (
        <div className="text-center py-16 text-gray-500">
          <p className="text-lg">No products found.</p>
        </div>
      )}
    </div>
  );
}
