import { useEffect, useMemo, useState } from "react";
import { api } from "@/libs/api";
import useUserLocation from "@/hooks/useUserLocation";
import type { Listing } from "@/types/listing";

type SuggestionResponse = {
  listings?: Listing[];
  items?: Listing[];
};

export default function useSearchSuggestions(query: string) {
  const userLocation = useUserLocation();
  const [suggestions, setSuggestions] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const trimmedQuery = useMemo(() => query.trim(), [query]);

  useEffect(() => {
    if (userLocation.loading) return;

    if (!trimmedQuery) {
      setSuggestions([]);
      setError("");
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        setLoading(true);
        setError("");

        const params: Record<string, string | number> = {
          q: trimmedQuery,
          page: 1,
          limit: 8,
        };

        if (userLocation.latitude != null && userLocation.longitude != null) {
          params.lat = userLocation.latitude;
          params.lng = userLocation.longitude;
        }

        if (userLocation.city) params.city = userLocation.city;
        if (userLocation.state) params.state = userLocation.state;
        if (userLocation.isManual) params.manualLocationFilter = "true";
        if (userLocation.lastViewedListingType) {
          params.listingType = userLocation.lastViewedListingType;
        }

        const res = await api.get<SuggestionResponse>("/listings/search/location", {
          params,
        });

        setSuggestions(res.data?.listings || res.data?.items || []);
      } catch (err: any) {
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to fetch suggestions"
        );
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, [
    trimmedQuery,
    userLocation.loading,
    userLocation.latitude,
    userLocation.longitude,
    userLocation.city,
    userLocation.state,
    userLocation.isManual,
    userLocation.lastViewedListingType,
  ]);

  return {
    suggestions,
    loading,
    error,
  };
}