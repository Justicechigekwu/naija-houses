import type { MetadataRoute } from "next";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.velora.ng";

type SitemapListingItem = {
  slug?: string;
  updatedAt?: string;
  createdAt?: string;
};

type ListingsResponse = {
  items?: SitemapListingItem[];
  listings?: SitemapListingItem[];
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${SITE_URL}/search`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
  ];

  try {
    const res = await fetch(`${API_URL}/listings?page=1&limit=5000`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) return staticPages;

    const data: ListingsResponse = await res.json();
    const items = data.items || data.listings || [];

    const listingPages: MetadataRoute.Sitemap = items
      .filter((item) => item.slug)
      .map((item) => ({
        url: `${SITE_URL}/listings/${item.slug}`,
        lastModified: new Date(item.updatedAt || item.createdAt || Date.now()),
        changeFrequency: "daily",
        priority: 0.8,
      }));

    return [...staticPages, ...listingPages];
  } catch {
    return staticPages;
  }
}