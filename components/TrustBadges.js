export default function TrustBadges({ className = '' }) {
  const badges = [
    { icon: '🔒', title: 'SSL Secure', subtitle: 'Safe Shopping' },
    { icon: '🚚', title: 'Cash on Delivery', subtitle: 'All Over Pakistan' },
    { icon: '↩️', title: 'Easy 07 Day Returns', subtitle: 'Hassle Free Policy' },
    { icon: '🎧', title: 'Customer Support', subtitle: 'Mon–Sat 11AM–8PM' },
  ];

  return (
    <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 ${className}`}>
      {badges.map((b) => (
        <div key={b.title} className="flex flex-col items-center text-center p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
          <span className="text-3xl mb-2">{b.icon}</span>
          <span className="font-semibold text-gray-800 text-sm">{b.title}</span>
          <span className="text-gray-500 text-xs mt-1">{b.subtitle}</span>
        </div>
      ))}
    </div>
  );
}
