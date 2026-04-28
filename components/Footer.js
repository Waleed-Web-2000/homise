import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Contact Us</h3>
            <p className="font-semibold text-white mb-2">Homisepk — Online Shopping Store</p>
            <address className="not-italic text-sm space-y-2">
              <p>F46 1st floor hyderi gold mark mall<br />north nazimabad block h<br />Karachi 74700</p>
              <p>
                <a href="tel:03218797321" className="hover:text-white transition-colors">03218797321</a>
              </p>
              <p>
                <a href="mailto:support@homisepk.com" className="hover:text-white transition-colors">support@homisepk.com</a>
              </p>
              <p className="text-gray-400 text-xs">Mon–Sat: 11:00 AM – 8:00 PM</p>
            </address>
          </div>

          {/* Collections */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Collections</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/collection/best-items" className="hover:text-white transition-colors">Best Items</Link>
              </li>
            </ul>
          </div>

          {/* Useful Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Useful Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="/return-policy" className="hover:text-white transition-colors">Return Policy</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/shipping" className="hover:text-white transition-colors">Shipping Policy</Link></li>
              <li><Link href="/terms-and-conditions" className="hover:text-white transition-colors">Terms &amp; Conditions</Link></li>
            </ul>
          </div>
        </div>

        {/* Return mention */}
        <div className="mt-8 pt-6 border-t border-gray-700 text-center text-sm text-gray-400">
          <p className="mb-2">7-Day Easy Returns &nbsp;|&nbsp; Cash on Delivery &nbsp;|&nbsp; Shipping: Rs. 199 Flat Rate</p>
          <p>© 2026, Homisepk &nbsp;|&nbsp; <Link href="/sitemap.xml" className="hover:text-white transition-colors">Sitemap</Link></p>
        </div>
      </div>
    </footer>
  );
}
