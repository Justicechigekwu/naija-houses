import { useInfiniteQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import useUserLocation from "@/hooks/useUserLocation";
import { getRelatedListings } from "@/features/listings/api";
import type { Listing, PaginatedListingsResponse } from "@/types/listing";

const PAGE_SIZE = 20;

type ErrorResponse = {
  message?: string;
};

export default function useInfiniteRelatedListings(listingId: string) {
  const userLocation = useUserLocation();

  const query = useInfiniteQuery<PaginatedListingsResponse>({
    queryKey: [
      "related-listings",
      listingId,
      userLocation.latitude,
      userLocation.longitude,
      userLocation.city,
      userLocation.state,
      userLocation.isManual,
    ],
    enabled: !userLocation.loading && !!listingId,
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const page = Number(pageParam) || 1;

      return getRelatedListings(listingId, {
        page,
        limit: PAGE_SIZE,
        lat: userLocation.latitude,
        lng: userLocation.longitude,
        city: userLocation.city,
        state: userLocation.state,
        manualLocationFilter: userLocation.isManual ? "true" : undefined,
      });
    },
    getNextPageParam: (lastPage) =>
      lastPage?.hasMore ? lastPage.nextPage ?? undefined : undefined,
  });

  const listings: Listing[] =
    query.data?.pages.flatMap((page) => page.listings || page.items || []) || [];

  const queryError = query.error as AxiosError<ErrorResponse> | Error | null;

  return {
    listings,
    loading: query.isLoading || userLocation.loading,
    error:
      (queryError as AxiosError<ErrorResponse> | null)?.response?.data?.message ||
      queryError?.message ||
      "",
    hasNextPage: query.hasNextPage,
    fetchNextPage: query.fetchNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
    refreshFeed: query.refetch,
  };
}