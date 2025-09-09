"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import api from "@/libs/api";

interface Filters {
  minPrice?: number;
  maxPrice?: number;
  state?: string;
  location?: string;
  bedrooms?: number;
}

interface SearchContextType {
  query: string;
  filters: Filters;
  results: any[];
  setQuery: (query: string) => void;
  setFilters: (filters: Filters) => void;
  searchListings: () => Promise<void>; 
  filterListings: () => Promise<void>; 
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<Filters>({});
  const [results, setResults] = useState<any[]>([]);

  const searchListings = async () => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    try {
      const res = await api.get(`/listings/search?q=${query}`);
      setResults(res.data);
    } catch (error) {
      console.error("Instant search failed:", error);
      setResults([]);
    }
  };

  const filterListings = async () => {
    try {
      const params = new URLSearchParams();
      if (query) params.append("search", query);
      if (filters.minPrice) params.append("minPrice", filters.minPrice.toString());
      if (filters.maxPrice) params.append("maxPrice", filters.maxPrice.toString());
      if (filters.state) params.append("state", filters.state);
      if (filters.location) params.append("location", filters.location);
      if (filters.bedrooms) params.append("bedrooms", filters.bedrooms.toString());

      const res = await api.get(`/listings?${params.toString()}`);
      setResults(res.data);
    } catch (error) {
      console.error("Filter search failed:", error);
    }
  };

  return (
    <SearchContext.Provider
      value={{ query, filters, results, setQuery, setFilters, searchListings, filterListings }}
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
