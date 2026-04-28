import Link from 'next/link';

export default function HeroBanner() {
  return (
    <div className="relative bg-gradient-to-r from-red-600 to-red-800 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="max-w-2xl">
          <p className="text-red-200 font-medium mb-2 uppercase tracking-wide text-sm">Online Shopping in Pakistan</p>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">
            Best Quality Products<br />
            <span className="text-yellow-300">Fast Delivery</span>
          </h1>
          <p className="text-red-100 text-lg mb-8">
            Cash on Delivery all over Pakistan. Rs. 199 shipping. 7-day easy returns. 3–5 business day delivery.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/shop"
              className="bg-white text-red-600 hover:bg-yellow-50 font-bold py-3 px-8 rounded-full transition-colors text-lg shadow-lg min-h-[48px] flex items-center"
            >
              Shop Now
            </Link>
            <Link
              href="/collection/best-items"
              className="border-2 border-white text-white hover:bg-white hover:text-red-600 font-bold py-3 px-8 rounded-full transition-colors text-lg min-h-[48px] flex items-center"
            >
              Best Items
            </Link>
          </div>
        </div>
      </div>
      {/* Decorative circles */}
      <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full" />
      <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full" />
    </div>
  );
}
