import Link from 'next/link';

export const metadata = {
  title: 'About Us - Homisepk | Trusted Online Shopping in Pakistan',
  description: 'Learn about Homisepk — Pakistan\'s trusted online store based in Karachi. Quality products, fast delivery, and excellent customer service.'
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">About Us</h1>
      <div className="prose max-w-none text-gray-700 space-y-6">
        <p className="text-lg">
          Welcome to <strong>homisepk.com</strong> – Your Trusted Destination for Quality and Convenience in Pakistan.
        </p>
        <p>
          Founded with a vision to simplify online shopping, homisepk.com is a premier digital storefront dedicated to providing high-quality products directly to your doorstep. We believe that shopping should be fast, reliable, and transparent, which is why we have built our business around these core values.
        </p>

        <h2 className="text-2xl font-bold text-gray-800 mt-8">Who We Are</h2>
        <p>
          Operating from the heart of Karachi, homisepk.com is a registered business located at Gold Mark Mall North Nazimabad. Our team is passionate about sourcing the best products—ensuring that every item meets our strict quality standards before it reaches you. We take pride in being a local business that understands the needs of Pakistani consumers.
        </p>

        <h2 className="text-2xl font-bold text-gray-800 mt-8">Why Choose homisepk.com?</h2>
        <ul className="space-y-3 list-none pl-0">
          {[
            ['Customer-First Approach', 'Your satisfaction is our priority. From our easy-to-navigate website to our dedicated support team, we are here to help you at every step.'],
            ['Fast & Reliable Shipping', 'With a handling time of just 0-1 day and a flat shipping rate of Rs. 199, we ensure your orders reach you within 3-5 business days.'],
            ['Transparent Policies', 'No hidden fees and no complicated returns. Our 7-day return policy is designed to give you peace of mind with every purchase.'],
            ['Secure Shopping', 'We use advanced encryption and secure payment methods to ensure your personal data and transactions are always protected.'],
          ].map(([title, desc]) => (
            <li key={title} className="flex gap-3">
              <span className="text-red-500 font-bold mt-0.5">✓</span>
              <div>
                <strong className="text-gray-800">{title}:</strong>{' '}
                <span>{desc}</span>
              </div>
            </li>
          ))}
        </ul>

        <h2 className="text-2xl font-bold text-gray-800 mt-8">Our Mission</h2>
        <p>
          To become Pakistan's most reliable online marketplace by offering a seamless shopping experience, authentic products, and unparalleled customer service. We don't just sell products; we build relationships based on trust.
        </p>

        <h2 className="text-2xl font-bold text-gray-800 mt-8">Get in Touch</h2>
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 space-y-2 text-sm">
          <p><strong>Business Name:</strong> Homisepk</p>
          <p><strong>Physical Address:</strong> F46 1st floor hyderi gold mark mall north nazimabad block h Karachi 74700</p>
          <p><strong>Email:</strong> <a href="mailto:support@homisepk.com" className="text-red-600 hover:underline">support@homisepk.com</a></p>
          <p><strong>Phone / WhatsApp:</strong> <a href="tel:03218797321" className="text-red-600 hover:underline">03218797321</a></p>
          <p><strong>Website:</strong> <a href="https://homisepk.com" className="text-red-600 hover:underline">https://homisepk.com</a></p>
          <p><strong>Working Hours:</strong> Monday – Saturday (11:00 AM – 8:00 PM)</p>
        </div>

        <div className="mt-8">
          <Link
            href="/contact"
            className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg transition-colors min-h-[48px] flex items-center w-fit"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
