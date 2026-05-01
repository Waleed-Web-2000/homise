import Script from 'next/script';

const GA_ID = process.env.NEXT_PUBLIC_GA_ID || '';

export default function GoogleAnalytics() {
  if (!GA_ID) return null;
  return (
    <>
      {/* Init dataLayer + gtag stub before anything else — prevents race condition
          where purchase events fire before gtag.js has loaded */}
      <Script id="gtag-init" strategy="beforeInteractive">{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
      `}</Script>

      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />

      <Script id="gtag-config" strategy="afterInteractive">{`
        gtag('config', '${GA_ID}', { page_path: window.location.pathname });
      `}</Script>
    </>
  );
}
