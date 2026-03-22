"use client";

import { useEffect, useState } from "react";
import api from "@/libs/api";
import useUserLocation from "./useUserLocation";

export type ListingCardItem = {
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

export default function useLocationFeed() {
  const userLocation = useUserLocation();
  const [listings, setListings] = useState<ListingCardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
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

        const res = await api.get("/listings/feed/location", { params });
        setListings(res.data?.listings || []);
      } catch (error: any) {
        setError(error?.response?.data?.message || "Failed to load listings");
      } finally {
        setLoading(false);
      }
    };

    if (!userLocation.loading) {
      load();
    }
  }, [
    userLocation.loading,
    userLocation.latitude,
    userLocation.longitude,
    userLocation.city,
    userLocation.state,
  ]);

  return {
    listings,
    loading,
    error,
    userLocation,
  };
}