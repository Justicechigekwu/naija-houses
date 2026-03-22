// "use client";

// import { createContext, useContext, useState, ReactNode } from "react";
// import api from "@/libs/api";

// interface Filters {
//   category?: string;
//   subcategory?: string;
//   search?: string;
// }

// interface SearchContextType {
//   filters: Filters;
//   results: any[];
//   suggestions: any[];
//   setFilters: (filters: Filters) => void;
//   searchListings: () => Promise<void>;
//   filterListings: () => Promise<void>;
// }

// const SearchContext = createContext<SearchContextType | undefined>(undefined);

// export function SearchProvider({ children }: { children: ReactNode }) {
//   const [filters, setFilters] = useState<Filters>({});
//   const [suggestions, setSuggestions] = useState<any[]>([]);
//   const [results, setResults] = useState<any[]>([]);

//   const searchListings = async () => {
//     if (!filters.search?.trim()) {
//       setSuggestions([]);
//       return;
//     }

//     try {
//       const params = new URLSearchParams();
//       params.append("search", filters.search);

//       if (filters.category) params.append("category", filters.category);
//       if (filters.subcategory) params.append("subcategory", filters.subcategory);

//       const res = await api.get(`/listings?${params.toString()}`);
//       setSuggestions(res.data);
//     } catch (error) {
//       console.error("Instant search failed:", error);
//       setSuggestions([]);
//     }
//   };

//   const filterListings = async () => {
//     try {
//       const params = new URLSearchParams();

//       if (filters.search) params.append("search", filters.search);
//       if (filters.category) params.append("category", filters.category);
//       if (filters.subcategory) params.append("subcategory", filters.subcategory);

//       const res = await api.get(`/listings?${params.toString()}`);
//       setResults(res.data);
//     } catch (error) {
//       console.error("Filter search failed:", error);
//     }
//   };

//   return (
//     <SearchContext.Provider
//       value={{
//         filters,
//         results,
//         suggestions,
//         setFilters,
//         searchListings,
//         filterListings,
//       }}
//     >
//       {children}
//     </SearchContext.Provider>
//   );
// }

// export function useSearch() {
//   const ctx = useContext(SearchContext);
//   if (!ctx) throw new Error("useSearch must be used within SearchProvider");
//   return ctx;
// }





"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import api from "@/libs/api";

interface Filters {
  category?: string;
  subcategory?: string;
  search?: string;
}

interface SearchContextType {
  filters: Filters;
  results: any[];
  suggestions: any[];
  setFilters: (filters: Filters) => void;
  searchListings: () => Promise<void>;
  filterListings: () => Promise<void>;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

const LOCATION_STORAGE_KEY = "userCurrentLocation_v1";

function getStoredLocation() {
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
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [results, setResults] = useState<any[]>([]);

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
      params.append("q", filters.search);

      if (filters.category) params.append("category", filters.category);
      if (filters.subcategory) params.append("subcategory", filters.subcategory);

      buildLocationParams(params);

      const res = await api.get(`/listings/search/location?${params.toString()}`);
      setSuggestions(res.data?.listings || []);
    } catch (error) {
      console.error("Instant search failed:", error);
      setSuggestions([]);
    }
  };

  const filterListings = async () => {
    try {
      const params = new URLSearchParams();

      if (filters.search) params.append("q", filters.search);
      if (filters.category) params.append("category", filters.category);
      if (filters.subcategory) params.append("subcategory", filters.subcategory);

      buildLocationParams(params);

      const res = await api.get(`/listings/search/location?${params.toString()}`);
      setResults(res.data?.listings || []);
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