// app/head.tsx
export default function Head() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.example';
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'name': 'Zakat Calculator',
    'url': siteUrl,
    'potentialAction': {
      '@type': 'SearchAction',
      'target': `${siteUrl}/?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <>
      {/* explicit manifest link (optional — Next will serve app/manifest.ts automatically) */}
      <link rel="manifest" href="/manifest.json" />
      <meta name="theme-color" content="#0ea5a4" />
      <script type="application/ld+json">{JSON.stringify(ld)}</script>
    </>
  );
}
