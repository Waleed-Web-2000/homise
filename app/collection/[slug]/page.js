import { notFound } from 'next/navigation';
import { getCategoryBySlug } from '../../../lib/db';
import ProductCard from '../../../components/ProductCard';
import Breadcrumb from '../../../components/Breadcrumb';

export async function generateMetadata({ params }) {
  try {
    const { category } = await getCategoryBySlug(params.slug);
    return {
      title: `${category.name} - Homisepk`,
      description: `Shop ${category.name} at Homisepk. Best prices, Cash on Delivery, 7-day returns.`
    };
  } catch {
    return { title: 'Collection - Homisepk' };
  }
}

export default async function CollectionPage({ params }) {
  let data;
  try {
    data = await getCategoryBySlug(params.slug);
  } catch {
    notFound();
  }

  const { category, products } = data;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Breadcrumb items={[{ name: 'Home', href: '/' }, { name: 'Collections', href: '/shop' }, { name: category.name }]} />
      </div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">{category.name}</h1>
      {products.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      ) : (
        <div className="text-center py-16 text-gray-500">
          <p className="text-lg">No products in this collection yet.</p>
        </div>
      )}
    </div>
  );
}
