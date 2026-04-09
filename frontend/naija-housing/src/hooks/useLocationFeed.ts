"use client";

import { useCallback, useEffect, useState } from "react";
import { AxiosError } from "axios";
import api from "@/libs/api";
import useUserLocation from "./useUserLocation";

export type ListingCardItem = {
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

export default function useLocationFeed() {
  const userLocation = useUserLocation();
  const [listings, setListings] = useState<ListingCardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const params: Record<string, string | number> = {
        page: 1,
        limit: 20,
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
        const locationListings = res.data?.listings || [];

        if (locationListings.length > 0) {
          setListings(locationListings);
          return;
        }
      } catch (locationError) {
        console.error("Location feed failed, falling back:", locationError);
      }

      const fallbackRes = await api.get("/listings");
      setListings(fallbackRes.data || []);
    } catch (error: unknown) {
      const err = error as AxiosError<ErrorResponse>;
      setError(err.response?.data?.message || "Failed to load listings");
    } finally {
      setLoading(false);
    }
  }, [
    userLocation.latitude,
    userLocation.longitude,
    userLocation.city,
    userLocation.state,
  ]);

  useEffect(() => {
    if (!userLocation.loading) {
      load();
    }
  }, [userLocation.loading, load]);

  return {
    listings,
    loading,
    error,
    userLocation,
    refreshFeed: load,
  };
}