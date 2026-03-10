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

export function SearchProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<Filters>({});
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [results, setResults] = useState<any[]>([]);

  const searchListings = async () => {
    if (!filters.search?.trim()) {
      setSuggestions([]);
      return;
    }

    try {
      const params = new URLSearchParams();
      params.append("search", filters.search);

      if (filters.category) params.append("category", filters.category);
      if (filters.subcategory) params.append("subcategory", filters.subcategory);

      const res = await api.get(`/listings?${params.toString()}`);
      setSuggestions(res.data);
    } catch (error) {
      console.error("Instant search failed:", error);
      setSuggestions([]);
    }
  };

  const filterListings = async () => {
    try {
      const params = new URLSearchParams();

      if (filters.search) params.append("search", filters.search);
      if (filters.category) params.append("category", filters.category);
      if (filters.subcategory) params.append("subcategory", filters.subcategory);

      const res = await api.get(`/listings?${params.toString()}`);
      setResults(res.data);
    } catch (error) {
      console.error("Filter search failed:", error);
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