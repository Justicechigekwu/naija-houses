import { useInfiniteQuery } from "@tanstack/react-query";
import useUserLocation from "./useUserLocation";
import { getInfiniteLocationFeed } from "@/features/listings/api";
import type { Listing, PaginatedListingsResponse } from "@/types/listing";

const PAGE_SIZE = 20;

export default function useInfiniteLocationFeed() {
  const userLocation = useUserLocation();

  const query = useInfiniteQuery<PaginatedListingsResponse>({
    queryKey: [
      "location-feed",
      userLocation.latitude,
      userLocation.longitude,
      userLocation.city,
      userLocation.state,
      userLocation.mode,
      userLocation.lastViewedListingType,
    ],
    enabled: !userLocation.loading,
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      getInfiniteLocationFeed({
        page: Number(pageParam) || 1,
        limit: PAGE_SIZE,
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

  const listings: Listing[] =
    query.data?.pages.flatMap((page) => page.listings || page.items || []) || [];

  return {
    listings,
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