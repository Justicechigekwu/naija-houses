"use client";

import { useEffect, useRef } from "react";
import type { Listing } from "@/types/listing";
import ListingCard from "./ListingCard";

type Props = {
  items: Listing[];
  hasNextPage?: boolean;
  fetchNextPage?: () => void;
  isFetchingNextPage?: boolean;
  emptyText?: string;
};

export default function InfiniteListingGrid({
  items,
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage,
  emptyText = "No listings found",
}: Props) {
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = loadMoreRef.current;
    if (!node || !hasNextPage || !fetchNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        if (firstEntry.isIntersecting && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        root: null,
        rootMargin: "300px",
        threshold: 0,
      }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [hasNextPage, fetchNextPage, isFetchingNextPage]);

  if (!items.length) {
    return <p>{emptyText}</p>;
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 w-full sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {items.map((listing) => (
          <ListingCard key={listing._id} listing={listing} />
        ))}
      </div>

      <div ref={loadMoreRef} className="h-10 w-full" />

      {isFetchingNextPage ? (
        <p className="mt-4 text-center text-sm text-gray-500">
          Loading more listings...
        </p>
      ) : null}
    </div>
  );
}