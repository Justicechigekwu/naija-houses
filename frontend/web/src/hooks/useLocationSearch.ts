"use client";

import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import api from "@/libs/api";
import useUserLocation from "./useUserLocation";

type ListingItem = {
  _id: string;
  title: string;
  price?: number;
  city?: string;
  state?: string;
  images?: { url: string }[];
  distanceMeters?: number;
  category?: string;
  subcategory?: string;
  attributes?: Record<string, string | number | boolean | string[]>;
  postedBy?: "Owner" | "Agent" | "Dealer" | "Seller";
};

type ErrorResponse = {
  message?: string;
};

export default function useLocationSearch(
  query: string,
  category?: string,
  subcategory?: string
) {
  const userLocation = useUserLocation();
  const [results, setResults] = useState<ListingItem[]>([]);
  const [similarListings, setSimilarListings] = useState<ListingItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!query.trim() && !category && !subcategory) {
      setResults([]);
      setSimilarListings([]);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        setLoading(true);
        setError("");

        const params: Record<string, string | number> = {
          page: 1,
          limit: 20,
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
          const locationRes = await api.get("/listings/search/location", {
            params,
          });

          const locationListings = locationRes.data?.listings || [];
          const locationSimilar = locationRes.data?.similarListings || [];

          if (locationListings.length > 0 || locationSimilar.length > 0) {
            setResults(locationListings);
            setSimilarListings(locationSimilar);
            return;
          }
        } catch (locationError) {
          console.error("Location search failed, falling back:", locationError);
        }

        const fallbackParams = new URLSearchParams();

        if (query.trim()) fallbackParams.append("search", query.trim());
        if (category) fallbackParams.append("category", category);
        if (subcategory) fallbackParams.append("subcategory", subcategory);

        const fallbackRes = await api.get(`/listings?${fallbackParams.toString()}`);

        setResults(fallbackRes.data || []);
        setSimilarListings([]);
      } catch (error: unknown) {
        console.error("Search failed:", error);

        const err = error as AxiosError<ErrorResponse>;
        setError(err.response?.data?.message || "Search failed");

        setResults([]);
        setSimilarListings([]);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, [
    query,
    category,
    subcategory,
    userLocation.latitude,
    userLocation.longitude,
    userLocation.city,
    userLocation.state,
  ]);

  return {
    results,
    similarListings,
    loading,
    error,
    userLocation,
  };
}