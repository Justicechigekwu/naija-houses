"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import api from "@/libs/api";

export interface Filters {
  category?: string;
  subcategory?: string;
  search?: string;
}

export interface SearchSuggestion {
  _id: string;
  title: string;
  location?: string;
  state?: string;
  images?: { url: string }[];
}

interface SearchContextType {
  filters: Filters;
  results: SearchSuggestion[];
  suggestions: SearchSuggestion[];
  setFilters: (filters: Filters) => void;
  searchListings: () => Promise<void>;
  filterListings: () => Promise<void>;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

const LOCATION_STORAGE_KEY = "userCurrentLocation_v1";

function getStoredLocation(): {
  latitude?: number;
  longitude?: number;
  city?: string;
  state?: string;
} | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(LOCATION_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function SearchProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<Filters>({});
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [results, setResults] = useState<SearchSuggestion[]>([]);

  const buildLocationParams = (params: URLSearchParams) => {
    const storedLocation = getStoredLocation();

    if (storedLocation?.latitude != null && storedLocation?.longitude != null) {
      params.append("lat", String(storedLocation.latitude));
      params.append("lng", String(storedLocation.longitude));
    }

    if (storedLocation?.city) params.append("city", storedLocation.city);
    if (storedLocation?.state) params.append("state", storedLocation.state);
  };

  const searchListings = async () => {
    if (!filters.search?.trim()) {
      setSuggestions([]);
      return;
    }

    try {
      const params = new URLSearchParams();
      params.append("q", filters.search.trim());
      params.append("page", "1");
      params.append("limit", "8");

      if (filters.category) params.append("category", filters.category);
      if (filters.subcategory) params.append("subcategory", filters.subcategory);

      buildLocationParams(params);

      try {
        const res = await api.get(`/listings/search/location?${params.toString()}`);
        const locationListings: SearchSuggestion[] =
          res.data?.listings || res.data?.items || [];

        if (locationListings.length > 0) {
          setSuggestions(locationListings);
          return;
        }
      } catch (locationError) {
        console.error("Instant location search failed, falling back:", locationError);
      }

      const fallbackParams = new URLSearchParams();
      fallbackParams.append("search", filters.search.trim());
      fallbackParams.append("page", "1");
      fallbackParams.append("limit", "8");

      if (filters.category) fallbackParams.append("category", filters.category);
      if (filters.subcategory) fallbackParams.append("subcategory", filters.subcategory);

      const fallbackRes = await api.get(`/listings?${fallbackParams.toString()}`);
      const fallbackListings: SearchSuggestion[] = fallbackRes.data?.items || [];
      setSuggestions(fallbackListings);
    } catch (error) {
      console.error("Instant search failed:", error);
      setSuggestions([]);
    }
  };

  const filterListings = async () => {
    try {
      const params = new URLSearchParams();

      if (filters.search?.trim()) params.append("q", filters.search.trim());
      if (filters.category) params.append("category", filters.category);
      if (filters.subcategory) params.append("subcategory", filters.subcategory);
      params.append("page", "1");
      params.append("limit", "20");

      buildLocationParams(params);

      try {
        const res = await api.get(`/listings/search/location?${params.toString()}`);
        const locationListings: SearchSuggestion[] =
          res.data?.listings || res.data?.items || [];

        if (locationListings.length > 0) {
          setResults(locationListings);
          return;
        }
      } catch (locationError) {
        console.error("Filter location search failed, falling back:", locationError);
      }

      const fallbackParams = new URLSearchParams();

      if (filters.search?.trim()) fallbackParams.append("search", filters.search.trim());
      if (filters.category) fallbackParams.append("category", filters.category);
      if (filters.subcategory) fallbackParams.append("subcategory", filters.subcategory);
      fallbackParams.append("page", "1");
      fallbackParams.append("limit", "20");

      const fallbackRes = await api.get(`/listings?${fallbackParams.toString()}`);
      const fallbackListings: SearchSuggestion[] = fallbackRes.data?.items || [];
      setResults(fallbackListings);
    } catch (error) {
      console.error("Filter search failed:", error);
      setResults([]);
    }
  };

  return (
    <SearchContext.Provider
      value={{
        filters,
        results,
        suggestions,
        setFilters,
        searchListings,
        filterListings,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error("useSearch must be used within SearchProvider");
  return ctx;
}