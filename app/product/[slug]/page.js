export const dynamic = 'force-dynamic';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getProductBySlug, getProducts } from '../../../lib/db';
import OrderForm from '../../../components/OrderForm';
import ProductCard from '../../../components/ProductCard';
import Breadcrumb from '../../../components/Breadcrumb';
import ReviewSection from './ReviewSection';

export async function generateMetadata({ params }) {
  try {
    const product = await getProductBySlug(params.slug);
    return {
      title: `${product.metaTitle || product.name} - Homisepk`,
      description: product.metaDescription || `Buy ${product.name} at Rs. ${product.price} in Pakistan. Cash on Delivery.`,
      openGraph: {
        title: product.metaTitle || product.name,
        description: product.metaDescription || `Buy ${product.name} at Rs. ${product.price}`,
        images: product.images?.[0] ? [product.images[0]] : [],
        url: `https://homisepk.com/product/${params.slug}`,
        type: 'website'
      }
    };
  } catch {
    return { title: 'Product - Homisepk' };
  }
}

export default async function ProductPage({ params }) {
  let product;
  let related = [];

  try {
    product = await getProductBySlug(params.slug);
  } catch {
    notFound();
  }

  try {
    const allProducts = await getProducts();
    related = allProducts
      .filter(p => p.slug !== params.slug && p.category?.id === product.category?.id)
      .slice(0, 4);
    if (related.length < 4) {
      const more = allProducts
        .filter(p => p.slug !== params.slug && !related.find(r => r.id === p.id))
        .slice(0, 4 - related.length);
      related = [...related, ...more];
    }
  } catch {}

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images || [],
    sku: product.sku || product.slug,
    brand: { '@type': 'Brand', name: 'Homisepk' },
    offers: {
      '@type': 'Offer',
      url: `https://homisepk.com/product/${product.slug}`,
      priceCurrency: 'PKR',
      price: product.price,
      priceValidUntil: '2026-12-31',
      availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: { '@type': 'MonetaryAmount', value: '199', currency: 'PKR' },
        shippingDestination: { '@type': 'DefinedRegion', addressCountry: 'PK' },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: { '@type': 'QuantitativeValue', minValue: 0, maxValue: 1, unitCode: 'DAY' },
          transitTime: { '@type': 'QuantitativeValue', minValue: 3, maxValue: 5, unitCode: 'DAY' }
        }
      },
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'PK',
        returnPolicyCountry: 'PK',
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: 7,
        returnMethod: 'https://schema.org/ReturnByMail',
        returnFees: 'https://schema.org/FreeReturn'
      }
    },
    ...(product.ratings?.count > 0 ? {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: product.ratings.average,
        reviewCount: product.ratings.count
      }
    } : {})
  };

  const mainImg = product.images?.[0] || '/placeholder-product.png';

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Breadcrumb items={[{ name: 'Home', href: '/' }, { name: 'Shop', href: '/shop' }, { name: product.name }]} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
          {/* Images */}
          <div>
            <div className="relative aspect-square bg-gray-50 rounded-2xl overflow-hidden border border-gray-200 mb-4">
              <img src={mainImg} alt={product.name} className="w-full h-full object-cover" />
            </div>
            {product.images?.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.slice(0, 4).map((img, i) => (
                  <div key={i} className="aspect-square bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                    <img src={img} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info + Order Form */}
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 leading-tight">{product.name}</h1>

              {product.ratings?.count > 0 && (
                <div className="flex items-center gap-2 mt-3">
                  <div className="flex">
                    {[1,2,3,4,5].map(i => (
                      <span key={i} className={`text-lg ${i <= Math.round(product.ratings.average) ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
                    ))}
                  </div>
                  <span className="text-gray-600 text-sm">({product.ratings.count} reviews)</span>
                </div>
              )}

              <div className="flex items-baseline gap-3 mt-3">
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-gray-400 line-through text-xl">Rs. {product.originalPrice.toLocaleString()}</span>
                )}
                <span className="text-3xl font-extrabold text-red-600">Rs. {product.price.toLocaleString()}</span>
              </div>

              <div className="mt-2">
                {product.inStock ? (
                  <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                    <span className="w-2 h-2 bg-green-500 rounded-full" /> In Stock
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 bg-red-100 text-red-800 text-sm font-medium px-3 py-1 rounded-full">
                    <span className="w-2 h-2 bg-red-500 rounded-full" /> Out of Stock
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[['🔒','Secure Payments'],['💵','Cash on Delivery'],['🚚','3–5 Working Days','Shipping: Rs. 199'],['🔁','Easy 7 Days Return']].map(([icon,title,sub]) => (
                <div key={title} className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm">
                  <span className="text-xl">{icon}</span>
                  <div>
                    <p className="font-medium text-gray-800 text-xs">{title}</p>
                    {sub && <p className="text-gray-500 text-xs">{sub}</p>}
                  </div>
                </div>
              ))}
            </div>

            <OrderForm product={product} />
          </div>
        </div>

        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Description</h2>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-gray-700 leading-relaxed whitespace-pre-line">
            {product.description}
          </div>
        </section>

        <ReviewSection product={product} />

        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
