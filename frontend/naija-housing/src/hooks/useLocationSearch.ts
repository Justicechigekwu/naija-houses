"use client";

import { useEffect, useState } from "react";
import api from "@/libs/api";
import useUserLocation from "./useUserLocation";

type ListingItem = {
  _id: string;
  title: string;
  price?: number;
  city?: string;
  state?: string;
  location?: string;
  images?: { url: string }[];
  distanceMeters?: number;
  category?: string;
  subcategory?: string;
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

        const res = await api.get("/listings/search/location", { params });

        setResults(res.data?.listings || []);
        setSimilarListings(res.data?.similarListings || []);
      } catch (error: any) {
        setError(error?.response?.data?.message || "Search failed");
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