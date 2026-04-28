import Link from 'next/link';

export const metadata = {
  title: 'Terms & Conditions - Homisepk',
  description: 'Read the Terms and Conditions for shopping at Homisepk. All purchases subject to our policies.'
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-red-600">Home</Link>
        <span>/</span>
        <span className="text-gray-800 font-medium">Terms &amp; Conditions</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-800 mb-8">Terms and Conditions - Homisepk</h1>

      <div className="prose max-w-none text-gray-700 space-y-8">
        <p>Welcome to homisepk.com. By accessing or using our website, you agree to comply with and be bound by the following terms and conditions.</p>

        <section>
          <h2 className="text-xl font-bold text-gray-800">1. General Conditions</h2>
          <p>By agreeing to these Terms, you represent that you are at least the age of majority in your province or country of residence. We reserve the right to refuse service to anyone for any reason at any time.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-800">2. Product Accuracy & Pricing</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Accuracy:</strong> We strive to display colors and images as accurately as possible.</li>
            <li><strong>Pricing:</strong> All prices are in <strong>PKR (Pakistani Rupees)</strong>. We reserve the right to modify prices without prior notice.</li>
            <li><strong>Errors:</strong> If a product is listed at an incorrect price due to a typographical error, we reserve the right to cancel orders placed for that product.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-800">3. Order Acceptance & Billing</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>We reserve the right to limit or cancel quantities per person or per order.</li>
            <li>You agree to provide current, complete, and accurate information for all purchases.</li>
            <li>Shipping Fee: A flat shipping fee of <strong>Rs. 199</strong> applies to all orders.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-800">4. Shipping & Delivery</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Handling Time: <strong>0 - 1 Business Day</strong></li>
            <li>Transit Time: <strong>3 - 5 Business Days</strong></li>
            <li>Cut-off Time: <strong>6:00 PM (PKT)</strong></li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-800">5. Returns & Refunds</h2>
          <p>We accept returns for both defective and non-defective items within <strong>7 days</strong> of delivery, provided the item is in <strong>New</strong> condition. See our <Link href="/return-policy" className="text-red-600 hover:underline">Return Policy</Link> for full details.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-800">6. Prohibited Uses</h2>
          <p>You are prohibited from using the site:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>For any unlawful purpose.</li>
            <li>To solicit others to perform unlawful acts.</li>
            <li>To infringe upon our intellectual property rights.</li>
            <li>To upload or transmit viruses or malicious code.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-800">7. Limitation of Liability</h2>
          <p>Homisepk shall not be liable for any direct, indirect, incidental, or consequential damages from use of our services.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-800">8. Governing Law</h2>
          <p>These Terms shall be governed by the laws of <strong>Pakistan</strong>.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-800">9. Changes to Terms</h2>
          <p>We reserve the right to update these Terms at any time. Check this page periodically for changes.</p>
        </section>

        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm space-y-1">
          <p>Contact: <a href="mailto:support@homisepk.com" className="text-red-600 hover:underline">support@homisepk.com</a> | <a href="tel:03218797321" className="text-red-600 hover:underline">03218797321</a></p>
          <p>F46 1st floor hyderi gold mark mall north nazimabad block h Karachi 74700</p>
        </div>
      </div>
    </div>
  );
}
