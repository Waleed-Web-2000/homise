import Link from 'next/link';
import HeroBanner from '../components/HeroBanner';
import TrustBadges from '../components/TrustBadges';
import ProductCard from '../components/ProductCard';
import { getProducts, getCategories } from '../lib/db';

export const metadata = {
  title: 'Online Shopping in Pakistan - Homisepk – Fast Delivery & Best Prices',
  description: 'Shop online in Pakistan at Homisepk. Cash on Delivery all over Pakistan. Fast 3-5 day delivery. 7-day easy returns. Best prices guaranteed.',
  openGraph: {
    title: 'Online Shopping in Pakistan - Homisepk',
    description: 'Shop online in Pakistan at Homisepk. Cash on Delivery all over Pakistan.',
    url: 'https://homisepk.com',
    type: 'website'
  }
};

export default async function HomePage() {
  let products = [];
  let categories = [];

  try {
    [products, categories] = await Promise.all([
      getProducts({ featured: true }),
      getCategories()
    ]);
  } catch {}

  return (
    <>
      <HeroBanner />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <section className="py-8">
          <TrustBadges />
        </section>

        <section className="py-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Our Collections</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {categories.length > 0 ? categories.map(cat => (
              <Link
                key={cat.id}
                href={`/collection/${cat.slug}`}
                className="group bg-gradient-to-br from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 border border-red-200 rounded-xl p-8 text-center transition-all hover:shadow-md"
              >
                <h3 className="text-xl font-bold text-gray-800 group-hover:text-red-600 transition-colors">{cat.name}</h3>
                <p className="text-gray-500 text-sm mt-2">View all products →</p>
              </Link>
            )) : (
              <Link
                href="/collection/best-items"
                className="group bg-gradient-to-br from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 border border-red-200 rounded-xl p-8 text-center transition-all hover:shadow-md"
              >
                <h3 className="text-xl font-bold text-gray-800 group-hover:text-red-600 transition-colors">Best Items</h3>
                <p className="text-gray-500 text-sm mt-2">View all products →</p>
              </Link>
            )}
          </div>
        </section>

        <section className="py-8 pb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Our Latest Items</h2>
            <Link href="/shop" className="text-red-600 hover:text-red-700 font-medium text-sm">View All →</Link>
          </div>
          {products.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {products.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-500">
              <p className="text-lg">No products yet. Add some from the <Link href="/admin" className="text-red-600 hover:underline">admin panel</Link>.</p>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
