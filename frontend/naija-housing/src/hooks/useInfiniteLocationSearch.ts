"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import api from "@/libs/api";
import useUserLocation from "./useUserLocation";
import type { Listing, PaginatedListingsResponse } from "@/types/listing";

const PAGE_SIZE = 20;

export default function useInfiniteLocationSearch(
  query: string,
  category?: string,
  subcategory?: string
) {
  const userLocation = useUserLocation();

  const enabled =
    !userLocation.loading && !!(query.trim() || category || subcategory);

  const searchQuery = useInfiniteQuery<PaginatedListingsResponse>({
    queryKey: [
      "location-search",
      query,
      category,
      subcategory,
      userLocation.latitude,
      userLocation.longitude,
      userLocation.city,
      userLocation.state,
    ],
    enabled,
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const page = Number(pageParam) || 1;

      const params: Record<string, string | number> = {
        page,
        limit: PAGE_SIZE,
      };

      if (query.trim()) params.q = query.trim();
      if (category) params.category = category;
      if (subcategory) params.subcategory = subcategory;

      if (
        userLocation.latitude !== null &&
        userLocation.longitude !== null
      ) {
        params.lat = userLocation.latitude;
        params.lng = userLocation.longitude;
      }

      if (userLocation.city) params.city = userLocation.city;
      if (userLocation.state) params.state = userLocation.state;

      try {
        const res = await api.get("/listings/search/location", { params });
        return res.data;
      } catch {
        const fallbackParams: Record<string, string | number> = {
          page,
          limit: PAGE_SIZE,
        };

        if (query.trim()) fallbackParams.search = query.trim();
        if (category) fallbackParams.category = category;
        if (subcategory) fallbackParams.subcategory = subcategory;

        const fallbackRes = await api.get("/listings", { params: fallbackParams });

        return {
          ...fallbackRes.data,
          similarListings: [],
        };
      }
    },
    getNextPageParam: (lastPage) =>
      lastPage?.hasMore ? lastPage.nextPage : undefined,
  });

  const results: Listing[] =
    searchQuery.data?.pages.flatMap((page) => page.listings || page.items || []) || [];

  const similarListings: Listing[] =
    searchQuery.data?.pages?.[0]?.similarListings || [];

  return {
    results,
    similarListings,
    loading: searchQuery.isLoading || userLocation.loading,
    error:
      (searchQuery.error as any)?.response?.data?.message ||
      (searchQuery.error as Error | null)?.message ||
      "",
    hasNextPage: searchQuery.hasNextPage,
    fetchNextPage: searchQuery.fetchNextPage,
    isFetchingNextPage: searchQuery.isFetchingNextPage,
    userLocation,
  };
}