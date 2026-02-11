// app/sitemap.ts
import type { MetadataRoute } from 'next';

const SITE_URL = 'https://myzakat.vercel.app';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // If you have dynamic pages (posts, cases, receipts), fetch them here and map to URLs.
  // Example static routes below — extend by fetching your dynamic data.
  const staticRoutes = [''];

  return staticRoutes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date().toISOString(),
  }));
}
