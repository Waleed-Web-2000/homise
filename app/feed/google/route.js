export const dynamic = 'force-dynamic';
import { getProducts } from '../../../lib/db';

export async function GET() {
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://homisepk.com';
  let products = [];

  try {
    products = await getProducts();
  } catch {}

  function escapeXml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>Homisepk</title>
    <link>${SITE_URL}</link>
    <description>Online Shopping in Pakistan</description>
    ${products.map(p => `
    <item>
      <g:id>${escapeXml(p.sku || p.slug)}</g:id>
      <g:title>${escapeXml(p.name)}</g:title>
      <g:description>${escapeXml(p.description)}</g:description>
      <g:link>${SITE_URL}/product/${p.slug}</g:link>
      <g:image_link>${escapeXml(p.images?.[0] || '')}</g:image_link>
      <g:condition>new</g:condition>
      <g:availability>${p.inStock ? 'in stock' : 'out of stock'}</g:availability>
      <g:price>${p.price} PKR</g:price>
      ${p.originalPrice && p.originalPrice > p.price ? `<g:sale_price>${p.price} PKR</g:sale_price>` : ''}
      <g:brand>Homisepk</g:brand>
      <g:shipping>
        <g:country>PK</g:country>
        <g:price>199 PKR</g:price>
      </g:shipping>
      <g:return_policy_label>default</g:return_policy_label>
    </item>`).join('')}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' }
  });
}
