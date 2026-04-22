import type { Metadata } from "next";
import ListingDetails from "@/components/ListingDetails";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.velora.ng";

async function getListing(slug: string) {
  const res = await fetch(`${API_URL}/listings/slug/${slug}`, {
    next: { revalidate: 300 },
  });

  if (!res.ok) return null;
  return res.json();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await getListing(slug);

  if (!data?.listing) {
    return {
      title: "Listing not found | Velora Marketplace",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const listing = data.listing;
  const title = `${listing.title} | Velora Marketplace`;
  const description =
    listing.description?.slice(0, 160) ||
    `Buy, sell or rent in ${listing.city || ""} ${listing.state || ""} on Velora Marketplace.`;
  const image =
    listing.images?.[0]?.url || `${SITE_URL}/image/background.jpg`;
  const canonical = `${SITE_URL}/listings/${listing.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "Velora Marketplace",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: listing.title || "Velora listing",
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default function ListingSlugPage() {
  return <ListingDetails />;
}