"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import api from "@/libs/api";
import useUserLocation from "./useUserLocation";
import type { Listing, PaginatedListingsResponse } from "@/types/listing";

const PAGE_SIZE = 20;

type SearchResponse = PaginatedListingsResponse & {
  meta?: {
    mode?: "manual" | "geo";
    exactLocationOnly?: boolean;
    selectedCity?: string;
    selectedState?: string;
  };
};

type ErrorResponse = {
  message?: string;
};

export default function useInfiniteLocationSearch(
  query: string,
  category?: string,
  subcategory?: string
) {
  const userLocation = useUserLocation();

  const enabled =
    !userLocation.loading && !!(query.trim() || category || subcategory);

  const searchQuery = useInfiniteQuery<SearchResponse>({
    queryKey: [
      "location-search",
      query,
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
    queryFn: async ({ pageParam }) => {
      const page = Number(pageParam) || 1;

      const params: Record<string, string | number> = {
        page,
        limit: PAGE_SIZE,
      };

      if (query.trim()) params.q = query.trim();
      if (category) params.category = category;
      if (subcategory) params.subcategory = subcategory;

      if (userLocation.latitude !== null && userLocation.longitude !== null) {
        params.lat = userLocation.latitude;
        params.lng = userLocation.longitude;
      }

      if (userLocation.city) params.city = userLocation.city;
      if (userLocation.state) params.state = userLocation.state;
      if (userLocation.isManual) params.manualLocationFilter = "true";

      const res = await api.get("/listings/search/location", { params });
      return res.data;
    },
    getNextPageParam: (lastPage) =>
      lastPage?.hasMore ? lastPage.nextPage : undefined,
  });

  const results: Listing[] =
    searchQuery.data?.pages.flatMap((page) => page.listings || page.items || []) || [];

  const similarListings: Listing[] =
    searchQuery.data?.pages?.[0]?.similarListings || [];

  const meta = searchQuery.data?.pages?.[0]?.meta;

  const queryError = searchQuery.error as AxiosError<ErrorResponse> | Error | null;

  return {
    results,
    similarListings,
    meta,
    loading: searchQuery.isLoading || userLocation.loading,
    error:
      (queryError as AxiosError<ErrorResponse> | null)?.response?.data?.message ||
      queryError?.message ||
      "",
    hasNextPage: searchQuery.hasNextPage,
    fetchNextPage: searchQuery.fetchNextPage,
    isFetchingNextPage: searchQuery.isFetchingNextPage,
    userLocation,
    refreshFeed: searchQuery.refetch,
  };
}