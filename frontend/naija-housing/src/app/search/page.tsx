// "use client";

// import { useSearchParams } from "next/navigation";
// import { useEffect, useState } from "react";
// import api from "@/libs/api";
// import Link from "next/link";

// export default function SearchResultsPage() {
//   const searchParams = useSearchParams();
//   const [results, setResults] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchResults = async () => {
//       try {
//         const res = await api.get(`/listings?${searchParams.toString()}`);
//         setResults(res.data);
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchResults();
//   }, [searchParams]);

//   if (loading) return <p className="p-6">Searching properties...</p>;

//   if (results.length === 0)
//     return (
//       <div className="p-6 text-center text-gray-500">
//         ❌ Listing not found
//       </div>
//     );

//   return (
//     <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
//       {results.map((listing) => (
//         <Link key={listing._id} href={`/listings/${listing._id}`}>
//           <img
//             src={listing.images?.[0]?.url || "/placeholder.jpg"}
//             className="w-full h-40 object-cover"
//             alt={listing.title}
//           />
//           <p className="font-bold">{listing.title}</p>
//           <p className="">{listing.location}</p>
//           <p className="text-green-600">₦{listing.price}</p>
//         </Link>
//       ))}
//     </div>
//   );
// }

"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import useLocationSearch from "@/hooks/useLocationSearch";

function formatDistance(distanceMeters?: number) {
  if (!distanceMeters || distanceMeters <= 0 || distanceMeters > 900000000) {
    return "";
  }

  if (distanceMeters < 1000) {
    return `${Math.round(distanceMeters)}m away`;
  }

  return `${(distanceMeters / 1000).toFixed(1)}km away`;
}

export default function SearchResultsPage() {
  const searchParams = useSearchParams();

  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const subcategory = searchParams.get("subcategory") || "";

  const { results, similarListings, loading, error, userLocation } =
    useLocationSearch(search, category, subcategory);

  if (loading) {
    return <p className="p-6">Searching listings...</p>;
  }

  if (error) {
    return <p className="p-6 text-red-500">{error}</p>;
  }

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Search results</h1>
        <p className="text-sm text-gray-600">
          {userLocation.city || userLocation.state
            ? `Showing nearby results first in ${[userLocation.city, userLocation.state]
                .filter(Boolean)
                .join(", ")}`
            : "Showing best matching results"}
        </p>
      </div>

      {results.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          ❌ No listing found
        </div>
      ) : (
        <div>
          <h2 className="text-lg font-semibold mb-4">Matching listings</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {results.map((listing: any) => (
              <Link key={listing._id} href={`/listings/${listing._id}`}>
                <img
                  src={listing.images?.[0]?.url || "/placeholder.jpg"}
                  className="w-full h-40 object-cover rounded"
                  alt={listing.title}
                />
                <p className="font-bold mt-2">{listing.title}</p>
                <p className="text-sm text-gray-500">
                  {listing.city || listing.location}, {listing.state}
                </p>
                <p className="text-green-600">
                  ₦{Number(listing.price || 0).toLocaleString()}
                </p>
                {listing.distanceMeters ? (
                  <p className="text-xs text-[#8A715D]">
                    {formatDistance(listing.distanceMeters)}
                  </p>
                ) : null}
              </Link>
            ))}
          </div>
        </div>
      )}

      {similarListings.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4">
            Similar listings near you
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {similarListings.map((listing: any) => (
              <Link key={listing._id} href={`/listings/${listing._id}`}>
                <img
                  src={listing.images?.[0]?.url || "/placeholder.jpg"}
                  className="w-full h-40 object-cover rounded"
                  alt={listing.title}
                />
                <p className="font-bold mt-2">{listing.title}</p>
                <p className="text-sm text-gray-500">
                  {listing.city || listing.location}, {listing.state}
                </p>
                <p className="text-green-600">
                  ₦{Number(listing.price || 0).toLocaleString()}
                </p>
                {listing.distanceMeters ? (
                  <p className="text-xs text-[#8A715D]">
                    {formatDistance(listing.distanceMeters)}
                  </p>
                ) : null}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}