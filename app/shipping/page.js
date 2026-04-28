import Link from 'next/link';

export const metadata = {
  title: 'Shipping Policy - Delivery Time & Charges in Pakistan - Homisepk',
  description: 'Homisepk ships all over Pakistan. Rs. 199 flat shipping fee. 3-5 business day delivery. Cash on Delivery available.'
};

const shippingSchema = {
  '@context': 'https://schema.org',
  '@type': 'OnlineStore',
  name: 'Homisepk',
  url: 'https://homisepk.com',
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Homisepk Products'
  },
  shippingDetails: {
    '@type': 'OfferShippingDetails',
    shippingRate: {
      '@type': 'MonetaryAmount',
      value: '199',
      currency: 'PKR'
    },
    shippingDestination: {
      '@type': 'DefinedRegion',
      addressCountry: 'PK'
    },
    deliveryTime: {
      '@type': 'ShippingDeliveryTime',
      handlingTime: {
        '@type': 'QuantitativeValue',
        minValue: 0,
        maxValue: 1,
        unitCode: 'DAY'
      },
      transitTime: {
        '@type': 'QuantitativeValue',
        minValue: 3,
        maxValue: 5,
        unitCode: 'DAY'
      }
    }
  }
};

export default function ShippingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(shippingSchema) }}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-red-600">Home</Link>
          <span>/</span>
          <span className="text-gray-800 font-medium">Shipping Policy</span>
        </nav>

        <h1 className="text-3xl font-bold text-gray-800 mb-8">Shipping & Delivery Policy</h1>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
            <div className="text-2xl mb-1">💰</div>
            <p className="font-bold text-blue-800">Rs. 199 Flat Rate</p>
            <p className="text-blue-600 text-sm">All orders</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
            <div className="text-2xl mb-1">🚚</div>
            <p className="font-bold text-green-800">3–5 Business Days</p>
            <p className="text-green-600 text-sm">Transit time</p>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 text-center">
            <div className="text-2xl mb-1">🇵🇰</div>
            <p className="font-bold text-purple-800">All Over Pakistan</p>
            <p className="text-purple-600 text-sm">Nationwide delivery</p>
          </div>
        </div>

        <div className="prose max-w-none text-gray-700 space-y-8">
          <p>At homisepk.com, we are committed to delivering your orders as quickly and reliably as possible across Pakistan.</p>

          <section>
            <h2 className="text-xl font-bold text-gray-800">1. Shipping Cost</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Standard Shipping Fee: <strong>Rs. 199/- (Flat Rate)</strong> — applies to all orders</li>
              <li>Shipping cost is clearly shown at checkout before completing purchase.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800">2. Order Processing & Handling Time</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Handling Time: <strong>0 - 1 Business Day</strong> (Monday – Friday)</li>
              <li>Order Cut-off Time: <strong>6:00 PM (PKT)</strong></li>
              <li>Orders placed after 6:00 PM on Friday or on weekends will be processed the next business day.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800">3. Transit Time</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Transit Time: <strong>3 - 5 Business Days</strong> (Monday – Friday)</li>
              <li>Total Estimated Delivery: <strong>3 - 6 Business Days</strong></li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800">4. Shipping Carrier</h2>
            <p>We partner with reliable couriers (Leopards, TCS, or Trax). You will receive a tracking number via email or SMS once your order is shipped.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800">5. Service Area</h2>
            <p>We ship to all major cities and towns within <strong>Pakistan</strong>. Please ensure your delivery address and contact number are accurate.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800">6. Order Tracking</h2>
            <p>A tracking link will be sent once your package is dispatched.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800">7. Missing or Delayed Shipments</h2>
            <p>If your order doesn't arrive within 3-5 business days, contact our support team immediately.</p>
          </section>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm space-y-1">
            <p>Contact: <a href="mailto:support@homisepk.com" className="text-red-600 hover:underline">support@homisepk.com</a> | <a href="tel:03218797321" className="text-red-600 hover:underline">03218797321</a></p>
          </div>
        </div>
      </div>
    </>
  );
}
