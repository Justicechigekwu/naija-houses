// 'use client';

// import { useEffect, useState } from "react";
// import Link from "next/link";
// import api from "@/libs/api";

// interface Listing {
//   _id: string;
//   title: string;
//   price?: number ;
//   state?: string;
//   location?: string;
//   images?: { url: string; public_id: string }[];
//   category?: string;
//   subcategory?: string;
//   attributes?: Record<string, any>;
// }

// export default function RelatedListing({ listingId }: { listingId: string }) {
//   const [related, setRelated] = useState<Listing[]>([]);

//   useEffect(() => {
//     if (!listingId) return;

//     const fetchRelated = async () => {
//       try {
//         const res = await api.get(`/listings/${listingId}/related`);
//         setRelated(res.data);
//       } catch (error) {
//         console.error("Failed to load related listings", error);
//       }
//     };

//     fetchRelated();
//   }, [listingId]);

//   if (!related.length) return null;

//   return (
//     <div className="mt-10 aspect-ratio">
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

//             <h3 className="text-lg font-semibold">{listing.title}</h3>

//             <p className="text-green-600 text-sm font-semibold">
//               ₦{Number(listing.price).toLocaleString()}
//             </p>

//             <p className="text-gray-500 text-xs inline">{listing.state}</p>,{" "}
//             <p className="text-gray-500 text-xs inline">{listing.location}</p>
//           </Link>
//         ))}
//       </div>
//     </div>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/libs/api";

interface Listing {
  _id: string;
  title: string;
  price?: number;
  city?: string;
  state?: string;
  location?: string;
  images?: { url: string; public_id: string }[];
  distanceMeters?: number;
}

function formatDistance(distanceMeters?: number) {
  if (!distanceMeters) return "";
  if (distanceMeters < 1000) return `${Math.round(distanceMeters)}m away`;
  return `${(distanceMeters / 1000).toFixed(1)}km away`;
}

export default function RelatedListing({ listingId }: { listingId: string }) {
  const [related, setRelated] = useState<Listing[]>([]);

  useEffect(() => {
    if (!listingId) return;

    const fetchRelated = async () => {
      try {
        const res = await api.get(`/listings/${listingId}/related`);
        setRelated(res.data || []);
      } catch (error) {
        console.error("Failed to load related listings", error);
      }
    };

    fetchRelated();
  }, [listingId]);

  if (!related.length) return null;

  return (
    <div className="mt-10">
      <h2 className="text-xl font-bold mb-4">You may also like</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {related.map((listing) => (
          <Link
            key={listing._id}
            href={`/listings/${listing._id}`}
            className="block border rounded p-4 shadow hover:shadow-lg transition cursor-pointer"
          >
            <img
              src={listing.images?.[0]?.url || "/placeholder.jpg"}
              alt={listing.title}
              className="w-full h-48 object-cover rounded mb-3"
            />

            <h3 className="text-lg font-semibold line-clamp-2">{listing.title}</h3>

            <p className="text-green-600 text-sm font-semibold">
              ₦{Number(listing.price || 0).toLocaleString()}
            </p>

            <p className="text-gray-500 text-xs">
              {listing.city || listing.location}, {listing.state}
            </p>

            {listing.distanceMeters ? (
              <p className="text-xs text-[#8A715D] mt-1">
                {formatDistance(listing.distanceMeters)}
              </p>
            ) : null}
          </Link>
        ))}
      </div>
    </div>
  );
}