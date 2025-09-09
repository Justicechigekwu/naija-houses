// you mean i should remove this code 'use client';

// import { createContext, useContext, useState, ReactNode } from "react";
// import api from "@/libs/api";

// interface Filters {
//     minPrice?: number;
//     maxPrice?: number;
//     state?: string;
//     location?: string;
//     bedrooms?: number;
// }

// interface SearchContextType {
//     query: string;
//     filters: Filters;
//     results: any[];
//     setQuery: (query: string) => void;
//     setFilters: (filters: Filters) => void;
//     searchListings: () => Promise<void>;
// }

// const searchContext = createContext<SearchContextType | undefined>(undefined);

// export function SearchProvider({ children }: { children: ReactNode }) {
//     const [query, setQuery] = useState("");
//     const [filters, setFilters] = useState<Filters>({});
//     const [results, setResults] = useState<any[]>([]);

//     const searchListings = async () => {
//         try {
//             const params = new URLSearchParams();

//             if (query) params.append('search', query);
//             if (filters.minPrice) params.append('minPrice', filters.minPrice.toString());
//             if (filters.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
//             if (filters.state) params.append('state', filters.state);
//             if (filters.location) params.append('location', filters.location);
//             if (filters.bedrooms) params.append('bedrooms', filters.bedrooms.toString());

//             const res = await api.get(`/listings?${params.toString()}`);
//             setResults(res.data);
//         } catch (error) {
//             console.error('Search failed:', error)
//         }
//     };

//     return (
//         <searchContext.Provider value={{ query, filters, results, setQuery, setFilters, searchListings }}>
//             {children}
//         </searchContext.Provider>
//     );
// }

//     export const useSearch = () => {
//         const context = useContext(searchContext);
//         if (!context) {
//             throw new Error('useSearch must be used within a SearchProvider');
//         }
//         return context;
//     } and add this code   "use client";
// import { createContext, useContext, useState } from "react";
// import api from "@/libs/api";

// const SearchContext = createContext<any>(null);

// export function SearchProvider({ children }: { children: React.ReactNode }) {
//   const [query, setQuery] = useState("");
//   const [results, setResults] = useState<any[]>([]);

//   const searchListings = async () => {
//     if (!query.trim()) {
//       setResults([]);
//       return;
//     }
//     try {
//       const res = await api.get(`/search?q=${query}`);
//       setResults(res.data);
//     } catch (error) {
//       console.error("Search failed", error);
//       setResults([]);
//     }
//   };

//   return (
//     <SearchContext.Provider value={{ query, setQuery, results, searchListings }}>
//       {children}
//     </SearchContext.Provider>
//   );
// }

// export function useSearch() {
//   return useContext(SearchContext);
// } ?