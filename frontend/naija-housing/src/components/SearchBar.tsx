"use client";

import { useSearch } from "@/context/SearchContext";

export default function SearchBar() {
  const { query, setQuery, filters, setFilters, results, searchListings } = useSearch();

  return (
    <div className="p-4 border rounded-lg shadow bg-white">
      <div className="flex flex-wrap gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search title, state, location..."
          className="border p-2 rounded flex-1"
        />

        <input
          type="number"
          placeholder="Min Price"
          value={filters.minPrice || ""}
          onChange={(e) => setFilters({ ...filters, minPrice: Number(e.target.value) })}
          className="border p-2 rounded w-28"
        />

        <input
          type="number"
          placeholder="Max Price"
          value={filters.maxPrice || ""}
          onChange={(e) => setFilters({ ...filters, maxPrice: Number(e.target.value) })}
          className="border p-2 rounded w-28"
        />

        <input
          type="text"
          placeholder="State"
          value={filters.state || ""}
          onChange={(e) => setFilters({ ...filters, state: e.target.value })}
          className="border p-2 rounded w-28"
        />

        <input
          type="number"
          placeholder="Bedrooms"
          value={filters.bedrooms || ""}
          onChange={(e) => setFilters({ ...filters, bedrooms: Number(e.target.value) })}
          className="border p-2 rounded w-28"
        />

        <button
          onClick={searchListings}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Search
        </button>
      </div>

      <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
        {results.map((listing: any) => (
          <div key={listing._id} className="border p-3 rounded shadow">
            <img
              src={listing.images?.[0] ? `http://localhost:5000${listing.images[0]}` : "/placeholder.jpg"}
              alt={listing.title}
              className="w-full h-32 object-cover rounded"
            />
            <p className="font-bold">{listing.title}</p>
            <p>{listing.location}</p>
            <p className="text-green-600 font-semibold">₦{listing.price?.toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
