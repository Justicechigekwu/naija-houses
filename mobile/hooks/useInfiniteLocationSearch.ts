import { useInfiniteQuery } from "@tanstack/react-query";
import useUserLocation from "./useUserLocation";
import { searchListingsByLocation } from "@/features/listings/api";
import type { Listing, PaginatedListingsResponse } from "@/types/listing";

const PAGE_SIZE = 20;

export default function useInfiniteLocationSearch(
  search: string,
  category?: string,
  subcategory?: string
) {
  const userLocation = useUserLocation();

  const enabled =
    !userLocation.loading && !!(search.trim() || category || subcategory);

  const query = useInfiniteQuery<PaginatedListingsResponse>({
    queryKey: [
      "location-search",
      search,
      category,
      subcategory,
      userLocation.mode,
      userLocation.latitude,
      userLocation.longitude,
      userLocation.city,
      userLocation.state,
      userLocation.lastViewedListingType,
    ],
    enabled,
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      searchListingsByLocation({
        page: Number(pageParam) || 1,
        limit: PAGE_SIZE,
        q: search.trim() || undefined,
        category,
        subcategory,
        lat: userLocation.latitude,
        lng: userLocation.longitude,
        city: userLocation.city,
        state: userLocation.state,
        manualLocationFilter: userLocation.isManual ? "true" : undefined,
        listingType: userLocation.lastViewedListingType || undefined,
      }),
    getNextPageParam: (lastPage) =>
      lastPage?.hasMore ? lastPage.nextPage ?? undefined : undefined,
  });

  const results: Listing[] =
    query.data?.pages.flatMap((page) => page.listings || page.items || []) || [];

  const similarListings: Listing[] =
    query.data?.pages?.[0]?.similarListings || [];

  return {
    results,
    similarListings,
    meta: query.data?.pages?.[0]?.meta,
    loading: query.isLoading || userLocation.loading,
    error:
      (query.error as any)?.response?.data?.message ||
      (query.error as Error | null)?.message ||
      "",
    hasNextPage: query.hasNextPage,
    fetchNextPage: query.fetchNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
    userLocation,
    refreshFeed: query.refetch,
  };
}