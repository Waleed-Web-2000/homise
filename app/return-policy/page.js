import Link from 'next/link';

export const metadata = {
  title: 'Return & Refund Policy - 7 Days Easy Returns - Homisepk',
  description: 'Homisepk offers 7-day easy returns on all products. No restocking fees. Free return label included.'
};

const returnPolicySchema = {
  '@context': 'https://schema.org',
  '@type': 'OnlineStore',
  name: 'Homisepk',
  url: 'https://homisepk.com',
  hasMerchantReturnPolicy: {
    '@type': 'MerchantReturnPolicy',
    applicableCountry: 'PK',
    returnPolicyCountry: 'PK',
    returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
    merchantReturnDays: 7,
    itemCondition: ['https://schema.org/NewCondition'],
    returnMethod: 'https://schema.org/ReturnByMail',
    returnFees: 'https://schema.org/FreeReturn',
    refundType: 'https://schema.org/FullRefund',
    returnLabelSource: 'https://schema.org/ReturnLabelInBox'
  }
};

export default function ReturnPolicyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(returnPolicySchema) }}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-red-600">Home</Link>
          <span>/</span>
          <span className="text-gray-800 font-medium">Return Policy</span>
        </nav>

        <h1 className="text-3xl font-bold text-gray-800 mb-8">Return and Refund Policy</h1>

        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8 flex items-start gap-3">
          <span className="text-2xl">↩️</span>
          <p className="text-red-800 font-medium">We offer a <strong>7-day return window</strong> from the date of delivery. Items must be in new, unused condition in original packaging.</p>
        </div>

        <div className="prose max-w-none text-gray-700 space-y-8">
          <p>At homisepk.com, customer satisfaction is our top priority. We provide a transparent and straightforward return process to ensure a trustworthy shopping experience.</p>

          <section>
            <h2 className="text-xl font-bold text-gray-800">1. Return Window</h2>
            <p>You have <strong>7 days</strong> from the date of receiving your item to request a return or exchange. After 7 days, we cannot offer you a refund or exchange.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800">2. Eligibility & Condition</h2>
            <p>To be eligible for a return:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>The product must be in <strong>New</strong> and <strong>Unused</strong> condition.</li>
              <li>It must be in the original packaging with all tags, manuals, and accessories included.</li>
              <li>We accept returns for both <strong>Defective</strong> (damaged or wrong item) and <strong>Non-Defective</strong> (change of mind) products.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800">3. Return Process (By Mail)</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>A pre-paid return shipping label is <strong>included in your original package</strong>.</li>
              <li>Pack the item securely, attach the provided label, and drop it off at the designated courier.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800">4. Fees & Charges</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Return Shipping Fee: <strong>No charge</strong> if using the provided label.</li>
              <li>Restocking Fee: <strong>None</strong>.</li>
              <li>Original shipping charges are non-refundable.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800">5. Exchanges</h2>
            <p>Follow the return process. Once we receive your original item, we will process and ship the exchange within 3-5 business days.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800">6. Refund Timeline</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>We will inspect the returned item and notify you of approval/rejection.</li>
              <li>Approved refunds are processed to your original payment method (or bank transfer).</li>
              <li>Refund reflects in your account within <strong>3 business days</strong>.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800">7. Contact Us</h2>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm space-y-1">
              <p>Email: <a href="mailto:support@homisepk.com" className="text-red-600 hover:underline">support@homisepk.com</a></p>
              <p>Phone/WhatsApp: <a href="tel:03218797321" className="text-red-600 hover:underline">03218797321</a></p>
              <p>Address: F46 1st floor hyderi gold mark mall north nazimabad block h Karachi 74700</p>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
