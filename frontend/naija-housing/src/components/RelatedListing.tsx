"use client";

import { useEffect, useRef } from "react";
import ListingCard from "@/components/listings/ListingCard";
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

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = loadMoreRef.current;

    if (!node || !hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];

        if (firstEntry?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        root: null,
        rootMargin: "300px 0px",
        threshold: 0,
      }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, listings.length]);

  if (loading) return null;
  if (error) return null;
  if (!listings.length) return null;

  return (
    <div className="mt-10">
      <h2 className="mb-4 text-xl font-bold">You may also like</h2>

      <div className="columns-2 md:columns-4 lg:columns-4 gap-3">
        {listings.map((listing) => (
          <ListingCard key={listing._id} listing={listing} />
        ))}
      </div>

      {hasNextPage ? (
        <div ref={loadMoreRef} className="h-10 w-full" />
      ) : null}

      {isFetchingNextPage ? (
        <p className="mt-6 text-center text-sm text-gray-500">
          Loading more listings...
        </p>
      ) : null}
    </div>
  );
}