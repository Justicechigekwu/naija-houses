"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/libs/api";
import useUserLocation from "./useUserLocation";
import type { Listing, PaginatedListingsResponse } from "@/types/listing";

const HOME_LIMIT = 40;

export default function useHomeLocationFeed() {
  const userLocation = useUserLocation();

  const query = useQuery<PaginatedListingsResponse>({
    queryKey: [
      "home-location-feed",
      userLocation.latitude,
      userLocation.longitude,
      userLocation.city,
      userLocation.state,
    ],
    enabled: !userLocation.loading,
    queryFn: async () => {
      const params: Record<string, string | number> = {
        page: 1,
        limit: HOME_LIMIT,
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
    staleTime: 1000 * 60 * 2,
  });

  const listings: Listing[] = query.data?.listings || query.data?.items || [];

  return {
    listings,
    loading: query.isLoading || userLocation.loading,
    error:
      (query.error as any)?.response?.data?.message ||
      (query.error as Error | null)?.message ||
      "",
    userLocation,
  };
}