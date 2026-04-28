export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/cart/']
      }
    ],
    sitemap: 'https://homisepk.com/sitemap.xml'
  };
}
