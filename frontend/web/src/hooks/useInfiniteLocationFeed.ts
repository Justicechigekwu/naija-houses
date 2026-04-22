"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import api from "@/libs/api";
import useUserLocation from "./useUserLocation";
import type { Listing, PaginatedListingsResponse } from "@/types/listing";

const PAGE_SIZE = 20;

type ErrorResponse = {
  message?: string;
};

export default function useInfiniteLocationFeed() {
  const userLocation = useUserLocation();

  const query = useInfiniteQuery<PaginatedListingsResponse>({
    queryKey: [
      "location-feed",
      userLocation.latitude,
      userLocation.longitude,
      userLocation.city,
      userLocation.state,
    ],
    enabled: !userLocation.loading,
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const page = Number(pageParam) || 1;

      const params: Record<string, string | number> = {
        page,
        limit: PAGE_SIZE,
      };

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
        const res = await api.get("/listings/feed/location", { params });
        return res.data;
      } catch {
        const fallbackRes = await api.get("/listings", { params });
        return fallbackRes.data;
      }
    },
    getNextPageParam: (lastPage) =>
      lastPage?.hasMore ? lastPage.nextPage : undefined,
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
    userLocation,
    refreshFeed: query.refetch,
  };
}