"use client";

import { useSearchParams } from "next/navigation";
import useInfiniteLocationSearch from "@/hooks/useInfiniteLocationSearch";
import VirtualizedListingGrid from "@/components/listings/VirtualizedListingGrid";
import ListingCard from "@/components/listings/ListingCard";

export default function SearchResultsPage() {
  const searchParams = useSearchParams();

  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const subcategory = searchParams.get("subcategory") || "";

  const {
    results,
    similarListings,
    loading,
    error,
    userLocation,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteLocationSearch(search, category, subcategory);

  if (loading) {
    return <p className="p-6">Searching listings...</p>;
  }

  if (error) {
    return <p className="p-6 text-red-500">{error}</p>;
  }

  return (
    <div className="p-6 space-y-8 bg-[#F5F5F5] min-h-screen">
      <div>
        <h1 className="text-2xl font-bold">Search results</h1>
        <p className="text-sm text-gray-600">
          {userLocation.city || userLocation.state
            ? `Showing nearby results first in ${[userLocation.city, userLocation.state]
                .filter(Boolean)
                .join(", ")}`
            : "Showing best matching results"}
        </p>
      </div>

      {results.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          ❌ No listing found
        </div>
      ) : (
        <div>
          <h2 className="text-lg font-semibold mb-4">Matching listings</h2>

          <VirtualizedListingGrid
            items={results}
            hasNextPage={hasNextPage}
            fetchNextPage={() => fetchNextPage()}
            isFetchingNextPage={isFetchingNextPage}
          />
        </div>
      )}

      {similarListings.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4">
            Similar listings near you
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {similarListings.map((listing) => (
              <ListingCard key={listing._id} listing={listing} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}