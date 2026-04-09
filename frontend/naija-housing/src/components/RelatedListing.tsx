"use client";

import InfiniteListingGrid from "@/components/listings/InfinitListingGrid";
import useInfiniteRelatedListings from "@/hooks/useInfiniteRelatedListings";

export default function RelatedListing({ listingId }: { listingId: string }) {
  const {
    listings,
    loading,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteRelatedListings(listingId);

  if (loading) return null;
  if (error) return null;
  if (!listings.length) return null;

  return (
    <div className="mt-10">
      <h2 className="text-xl font-bold mb-4">You may also like</h2>

      <InfiniteListingGrid
        items={listings}
        hasNextPage={hasNextPage}
        fetchNextPage={() => fetchNextPage()}
        isFetchingNextPage={isFetchingNextPage}
      />
    </div>
  );
}

