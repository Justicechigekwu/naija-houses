"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import useInfiniteLocationSearch from "@/hooks/useInfiniteLocationSearch";
import InfiniteListingGrid from "@/components/listings/InfinitListingGrid";
import ListingCard from "@/components/listings/ListingCard";
import LocationFilter from "@/components/LocationFilter";
import { useBrowsingLocation } from "@/context/BrowsingLocationContext";

export default function SearchResultsClient() {
  const searchParams = useSearchParams();
  const { browsingLocation, resetToDeviceLocation, setManualLocation } =
    useBrowsingLocation();

  const [locationFilterOpen, setLocationFilterOpen] = useState(false);
  const router = useRouter();

  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const subcategory = searchParams.get("subcategory") || "";

  const {
    results,
    similarListings,
    meta,
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

  const exactEndText =
    meta?.exactLocationOnly && meta?.selectedCity && meta?.selectedState
      ? `That is all for ${meta.selectedCity}, ${meta.selectedState}.`
      : meta?.exactLocationOnly && meta?.selectedState
      ? `That is all for ${meta.selectedState}.`
      : "";

  return (
    <div className="p-6 space-y-8 bg-[#F5F5F5] min-h-screen">
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push("/")}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-600">
            {meta?.exactLocationOnly
              ? `Showing only listings for ${[meta.selectedCity, meta.selectedState]
                  .filter(Boolean)
                  .join(", ")}`
              : userLocation.city || userLocation.state
              ? `Showing nearby results first in ${[userLocation.city, userLocation.state]
                  .filter(Boolean)
                  .join(", ")}`
              : "Showing best matching results"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {userLocation.isManual ? (
            <button
              onClick={resetToDeviceLocation}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50"
            >
              My location
            </button>
          ) : null}

          <LocationFilter
            selectedState={browsingLocation.isManual ? browsingLocation.state : ""}
            selectedCity={browsingLocation.isManual ? browsingLocation.city : ""}
            onApply={({ state, city }) => {
              setManualLocation({ state, city });
            }}
            onClear={() => {
              resetToDeviceLocation();
            }}
            open={locationFilterOpen}
            onOpenChange={setLocationFilterOpen}
          />
        </div>
      </div>

      {results.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center text-gray-500">
          No listing found for this category or location.
        </div>
      ) : (
        <div>
          <h2 className="text-lg font-semibold mb-4">Matching listings</h2>

          <InfiniteListingGrid
            items={results}
            hasNextPage={hasNextPage}
            fetchNextPage={() => fetchNextPage()}
            isFetchingNextPage={isFetchingNextPage}
          />
        </div>
      )}

      {exactEndText ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-6 text-center">
          <p className="text-base font-semibold text-gray-900">{exactEndText}</p>
          <p className="mt-2 text-sm text-gray-600">
            Would you like to see similar listings from other cities
            {meta?.selectedState ? ` in ${meta.selectedState}` : ""}?
          </p>

          <button
            onClick={() => setLocationFilterOpen(true)}
            className="mt-4 inline-flex items-center rounded-lg border border-[#8A715D] px-4 py-2 text-sm font-medium text-[#8A715D] hover:bg-[#8A715D] hover:text-white transition"
          >
            Change location
          </button>
        </div>
      ) : null}

      {similarListings.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4">
            Similar listings from other cities
            {meta?.selectedState ? ` in ${meta.selectedState}` : ""}
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