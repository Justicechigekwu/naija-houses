"use client";

import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import api from "@/libs/api";
import { useBrowsingLocation } from "@/context/BrowsingLocationContext";

export interface Filters {
  category?: string;
  subcategory?: string;
  search?: string;
}

export interface SearchSuggestion {
  _id: string;
  title: string;
  location?: string;
  city?: string;
  state?: string;
  images?: { url: string }[];
}

interface SearchContextType {
  filters: Filters;
  results: SearchSuggestion[];
  suggestions: SearchSuggestion[];
  // setFilters: (filters: Filters) => void;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  searchListings: () => Promise<void>;
  filterListings: () => Promise<void>;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<Filters>({});
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [results, setResults] = useState<SearchSuggestion[]>([]);
  const { browsingLocation } = useBrowsingLocation();

  const buildLocationParams = useCallback(
    (params: URLSearchParams) => {
      if (browsingLocation.latitude != null && browsingLocation.longitude != null) {
        params.append("lat", String(browsingLocation.latitude));
        params.append("lng", String(browsingLocation.longitude));
      }

      if (browsingLocation.city) params.append("city", browsingLocation.city);
      if (browsingLocation.state) params.append("state", browsingLocation.state);
      if (browsingLocation.isManual) params.append("manualLocationFilter", "true");
    },
    [
      browsingLocation.latitude,
      browsingLocation.longitude,
      browsingLocation.city,
      browsingLocation.state,
      browsingLocation.isManual,
    ]
  );

  const searchListings = useCallback(async () => {
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
      if (browsingLocation.state) fallbackParams.append("state", browsingLocation.state);
      if (browsingLocation.city) fallbackParams.append("city", browsingLocation.city);

      const fallbackRes = await api.get(`/listings?${fallbackParams.toString()}`);
      const fallbackListings: SearchSuggestion[] =
        fallbackRes.data?.items || fallbackRes.data || [];

      setSuggestions(fallbackListings);
    } catch (error) {
      console.error("Instant search failed:", error);
      setSuggestions([]);
    }
  }, [filters, buildLocationParams, browsingLocation.state, browsingLocation.city]);

  const filterListings = useCallback(async () => {
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
      if (browsingLocation.state) fallbackParams.append("state", browsingLocation.state);
      if (browsingLocation.city) fallbackParams.append("city", browsingLocation.city);
      fallbackParams.append("page", "1");
      fallbackParams.append("limit", "20");

      const fallbackRes = await api.get(`/listings?${fallbackParams.toString()}`);
      const fallbackListings: SearchSuggestion[] =
        fallbackRes.data?.items || fallbackRes.data || [];

      setResults(fallbackListings);
    } catch (error) {
      console.error("Filter search failed:", error);
      setResults([]);
    }
  }, [filters, buildLocationParams, browsingLocation.state, browsingLocation.city]);

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
  const context = useContext(SearchContext);

  if (!context) {
    throw new Error("useSearch must be used within SearchProvider");
  }

  return context;
}