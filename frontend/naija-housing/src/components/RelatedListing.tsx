// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";
// import api from "@/libs/api";
// import { useBrowsingLocation } from "@/context/BrowsingLocationContext";

// interface Listing {
//   _id: string;
//   title: string;
//   price?: number;
//   city?: string;
//   state?: string;
//   images?: { url: string; public_id: string }[];
//   distanceMeters?: number;
// }

// function formatDistance(distanceMeters?: number) {
//   if (!distanceMeters) return "";
//   if (distanceMeters < 1000) return `${Math.round(distanceMeters)}m away`;
//   return `${(distanceMeters / 1000).toFixed(1)}km away`;
// }

// export default function RelatedListing({ listingId }: { listingId: string }) {
//   const [related, setRelated] = useState<Listing[]>([]);
//   const { browsingLocation } = useBrowsingLocation();

//   useEffect(() => {
//     if (!listingId) return;

//     const fetchRelated = async () => {
//       try {
//         const params: Record<string, string | number> = {};

//         if (browsingLocation.latitude != null && browsingLocation.longitude != null) {
//           params.lat = browsingLocation.latitude;
//           params.lng = browsingLocation.longitude;
//         }

//         if (browsingLocation.city) params.city = browsingLocation.city;
//         if (browsingLocation.state) params.state = browsingLocation.state;
//         if (browsingLocation.isManual) params.manualLocationFilter = "true";

//         const res = await api.get(`/listings/${listingId}/related`, { params });
//         setRelated(res.data || []);
//       } catch (error) {
//         console.error("Failed to load related listings", error);
//       }
//     };

//     fetchRelated();
//   }, [
//     listingId,
//     browsingLocation.latitude,
//     browsingLocation.longitude,
//     browsingLocation.city,
//     browsingLocation.state,
//     browsingLocation.isManual,
//   ]);

//   if (!related.length) return null;

//   return (
//     <div className="mt-10">
//       <h2 className="text-xl font-bold mb-4">You may also like</h2>

//       <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
//         {related.map((listing) => (
//           <Link
//             key={listing._id}
//             href={`/listings/${listing._id}`}
//             className="block border rounded p-4 shadow hover:shadow-lg transition cursor-pointer"
//           >
//             <img
//               src={listing.images?.[0]?.url || "/placeholder.jpg"}
//               alt={listing.title}
//               className="w-full h-48 object-cover rounded mb-3"
//             />

//             <h3 className="text-lg font-semibold line-clamp-2">{listing.title}</h3>

//             <p className="text-green-600 text-sm font-semibold">
//               ₦{Number(listing.price || 0).toLocaleString()}
//             </p>

//             {listing.city || listing.state ? (
//               <p className="text-xs text-gray-500 mt-1">
//                 {[listing.city, listing.state].filter(Boolean).join(", ")}
//               </p>
//             ) : null}

//             {listing.distanceMeters ? (
//               <p className="text-xs text-[#8A715D] mt-1">
//                 {formatDistance(listing.distanceMeters)}
//               </p>
//             ) : null}
//           </Link>
//         ))}
//       </div>
//     </div>
//   );
// }







"use client";

import InfiniteListingGrid from "@/components/listings/InfinitListingGrid";
import useInfiniteRelatedListings from "@/hooks/useInfiniteRelatedListings";

export default function RelatedListing({ listingId }: { listingId: string }) {
  const {
    listings,
    loading,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteRelatedListings(listingId);

  if (loading) return null;
  if (error) return null;
  if (!listings.length) return null;

  return (
    <div className="mt-10">
      <h2 className="text-xl font-bold mb-4">You may also like</h2>

      <InfiniteListingGrid
        items={listings}
        hasNextPage={hasNextPage}
        fetchNextPage={() => fetchNextPage()}
        isFetchingNextPage={isFetchingNextPage}
      />
    </div>
  );
}