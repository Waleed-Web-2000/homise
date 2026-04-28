import Link from 'next/link';

export default function Breadcrumb({ items }) {
  // items: [{name, href}] — last item has no href
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      ...(item.href ? { item: `https://homisepk.com${item.href}` } : {})
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-gray-500 flex-wrap">
        {items.map((item, i) => (
          <span key={i} className="flex items-center gap-2">
            {i > 0 && <span className="text-gray-300">/</span>}
            {item.href ? (
              <Link href={item.href} className="hover:text-red-600 transition-colors">{item.name}</Link>
            ) : (
              <span className="text-gray-800 font-medium">{item.name}</span>
            )}
          </span>
        ))}
      </nav>
    </>
  );
}
