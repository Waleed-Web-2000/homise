import './globals.css';
import ConditionalLayout from '../components/ConditionalLayout';
import GoogleAnalytics from '../components/GoogleAnalytics';

const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'OnlineStore',
  name: 'Homisepk',
  url: 'https://homisepk.com',
  logo: 'https://homisepk.com/logo.png',
  telephone: '+92-321-8797321',
  email: 'support@homisepk.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'F46 1st floor hyderi gold mark mall north nazimabad block h',
    addressLocality: 'Karachi',
    postalCode: '74700',
    addressCountry: 'PK'
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+92-321-8797321',
    contactType: 'customer service',
    availableLanguage: ['English', 'Urdu'],
    hoursAvailable: 'Mo-Sa 11:00-20:00'
  },
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
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Homisepk Products'
  }
};

export const metadata = {
  metadataBase: new URL('https://homisepk.com'),
  title: { default: 'Homisepk – Online Shopping in Pakistan', template: '%s | Homisepk' },
  description: 'Shop online in Pakistan at Homisepk. Cash on Delivery. Fast 3-5 day delivery. 7-day returns.',
  icons: { icon: '/favicon.ico' }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script
          id="org-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-white">
        <GoogleAnalytics />
        <ConditionalLayout>{children}</ConditionalLayout>
      </body>
    </html>
  );
}
