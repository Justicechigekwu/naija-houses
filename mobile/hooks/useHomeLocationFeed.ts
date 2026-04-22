import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { api } from "@/libs/api";
import useUserLocation from "@/hooks/useUserLocation";
import type { Listing, PaginatedListingsResponse } from "@/types/listing";

const HOME_LIMIT = 40;

type HomeLocationResponse = PaginatedListingsResponse & {
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

export default function useHomeLocationFeed() {
  const userLocation = useUserLocation();

  const listingType = userLocation.lastViewedListingType || undefined;

  const query = useQuery<HomeLocationResponse>({
    queryKey: [
      "home-location-feed",
      userLocation.mode,
      userLocation.latitude,
      userLocation.longitude,
      userLocation.city,
      userLocation.state,
      userLocation.lastViewedListingType,
    ],
    enabled: !userLocation.loading,
    queryFn: async () => {
      const params: Record<string, string | number> = {
        page: 1,
        limit: HOME_LIMIT,
      };

      if (userLocation.latitude !== null && userLocation.longitude !== null) {
        params.lat = userLocation.latitude;
        params.lng = userLocation.longitude;
      }

      if (userLocation.city) params.city = userLocation.city;
      if (userLocation.state) params.state = userLocation.state;
      if (userLocation.isManual) params.manualLocationFilter = "true";
      if (listingType) params.listingType = listingType;

      const res = await api.get("/listings/feed/location", { params });
      return res.data;
    },
    staleTime: 1000 * 60 * 2,
  });

  const listings: Listing[] = query.data?.listings || query.data?.items || [];
  const similarListings: Listing[] = query.data?.similarListings || [];

  const queryError = query.error as AxiosError<ErrorResponse> | Error | null;

  return {
    listings,
    similarListings,
    meta: query.data?.meta,
    loading: query.isLoading || userLocation.loading,
    error:
      (queryError as AxiosError<ErrorResponse> | null)?.response?.data?.message ||
      queryError?.message ||
      "",
    userLocation,
    refreshFeed: query.refetch,
  };
}