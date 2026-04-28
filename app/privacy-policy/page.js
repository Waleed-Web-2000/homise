import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy - Homisepk',
  description: 'Read Homisepk\'s privacy policy. We protect your data with SSL encryption and never sell your information to third parties.'
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-red-600">Home</Link>
        <span>/</span>
        <span className="text-gray-800 font-medium">Privacy Policy</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-800 mb-8">Privacy Policy - Homisepk</h1>

      <div className="prose max-w-none text-gray-700 space-y-8">
        <p>At homisepk.com, we value your privacy and are committed to protecting your personal data. This Privacy Policy outlines how we collect, use, and safeguard your information when you visit our website.</p>

        <section>
          <h2 className="text-xl font-bold text-gray-800">1. Information We Collect</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Personal Identity:</strong> Name, shipping address, billing address.</li>
            <li><strong>Contact Information:</strong> Email address and phone number.</li>
            <li><strong>Payment Information:</strong> We use secure third-party payment processors. We do <strong>not</strong> store your full credit card or bank details.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-800">2. How We Use Your Information</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Processing and delivering your orders.</li>
            <li>Providing tracking updates and customer support.</li>
            <li>Preventing fraudulent transactions and ensuring website security.</li>
            <li>Sending promotional emails (only if you have opted-in).</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-800">3. Data Sharing with Third Parties</h2>
          <p>We do <strong>not</strong> sell, rent, or trade your personal information. We only share data with:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Courier Services</strong> (Name, Address, Phone) — for delivery.</li>
            <li><strong>Payment Gateways</strong> — for secure transactions.</li>
            <li><strong>Analytics</strong> — to improve user experience.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-800">4. Cookies and Tracking</h2>
          <p>Our website uses cookies to enhance your browsing experience and analyze site traffic. You can disable cookies through your browser settings.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-800">5. Data Security</h2>
          <p>We implement industry-standard SSL (Secure Socket Layer) encryption to protect your personal information during transmission.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-800">6. Your Rights</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Access the personal data we hold about you.</li>
            <li>Request correction of inaccurate data.</li>
            <li>Request deletion of your account and personal information.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-800">7. Changes to This Policy</h2>
          <p>We may update this Privacy Policy from time to time. Changes will be posted on this page.</p>
        </section>

        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm space-y-1">
          <p>Contact: <a href="mailto:support@homisepk.com" className="text-red-600 hover:underline">support@homisepk.com</a> | <a href="tel:03218797321" className="text-red-600 hover:underline">03218797321</a></p>
          <p className="text-gray-500">Last Updated: January 2026</p>
        </div>
      </div>
    </div>
  );
}
